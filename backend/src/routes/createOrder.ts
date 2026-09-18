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
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  if (isRateLimited(ip)) {
    return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': env.CHECKOUT_ORIGIN },
    });
  }

  const order = await createRazorpayOrder(env, 19900); // ₹199 in paise
  return new Response(JSON.stringify(order), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': env.CHECKOUT_ORIGIN,
    },
  });
}
