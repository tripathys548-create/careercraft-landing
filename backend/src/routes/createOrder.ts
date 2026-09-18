import type { Env } from '../lib/db';
import { createRazorpayOrder } from '../lib/razorpay';

const ipHits = new Map<string, number[]>();

function isRateLimited(ip: string, maxPerMinute = 5): boolean {
  const now = Date.now();
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < 60_000);
  hits.push(now);
  ipHits.set(ip, hits);
  return hits.length > maxPerMinute;
}

export async function handleCreateOrder(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin') || env.CHECKOUT_ORIGIN || '*';
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ ok: false, error: 'rate_limited', message: 'Too many requests. Please try again later.' }), {
      status: 429,
      headers: corsHeaders,
    });
  }

  let amount = 19900; // default ₹199 in paise
  let currency = 'INR';
  let receipt = `rcpt_${Date.now()}`;

  if (request.method === 'POST') {
    try {
      const body = await request.json<{ amount?: number; currency?: string; receipt?: string }>().catch(() => null);
      if (body && typeof body.amount === 'number') {
        if (body.amount < 100) {
          return new Response(
            JSON.stringify({ ok: false, error: 'amount_too_low', message: 'Minimum order amount is 100 paise (₹1)' }),
            { status: 400, headers: corsHeaders }
          );
        }
        amount = body.amount;
      }
      if (body && body.currency) {
        currency = body.currency;
      }
      if (body && body.receipt) {
        receipt = body.receipt;
      }
    } catch {
      // Use defaults
    }
  }

  try {
    const order = await createRazorpayOrder(env, amount, currency, receipt);
    return new Response(
      JSON.stringify({
        ok: true,
        order_id: order.id,
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (err: any) {
    console.error('Error creating Razorpay order:', err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'order_creation_failed',
        message: err.message || 'Failed to create Razorpay order',
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

