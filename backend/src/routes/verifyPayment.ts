import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { verifyRazorpaySignature } from '../lib/razorpay';
import { generateLicenseKey } from '../lib/licenseKey';
import { sendLicenseKeyEmail } from '../lib/email';

export async function handleVerifyPayment(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin') || env.CHECKOUT_ORIGIN || '*';
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  let body: {
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    order_id?: string;
    payment_id?: string;
    signature?: string;
    email?: string;
  };

  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json', message: 'Invalid JSON request body' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const orderId = body.razorpay_order_id || body.order_id;
  const paymentId = body.razorpay_payment_id || body.payment_id;
  const signature = body.razorpay_signature || body.signature;

  if (!orderId || !paymentId || !signature) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'missing_fields',
        message: 'Missing required fields: order_id, payment_id, and signature are required.',
      }),
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  const secret = env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'server_configuration_error',
        message: 'Razorpay secret key not configured on server',
      }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }

  // Algorithm: HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
  const message = `${orderId}|${paymentId}`;
  const isValid = await verifyRazorpaySignature(message, signature, secret);

  if (!isValid) {
    return new Response(
      JSON.stringify({
        ok: false,
        verified: false,
        error: 'invalid_signature',
        message: 'Payment verification failed: Signature mismatch',
      }),
      {
        status: 400,
        headers: corsHeaders,
      }
    );
  }

  let licenseKey: string | null = null;
  try {
    if (env.DATABASE_URL) {
      const sql = getDb(env);
      const existing = await sql`SELECT key FROM license_keys WHERE razorpay_payment_id = ${paymentId}`;
      if (existing && existing.length > 0) {
        licenseKey = existing[0].key;
      } else {
        licenseKey = generateLicenseKey();
        const userEmail = body.email || null;
        await sql`INSERT INTO license_keys (key, email, razorpay_payment_id) VALUES (${licenseKey}, ${userEmail}, ${paymentId})`;
        if (userEmail && env.EMAIL_API_KEY) {
          await sendLicenseKeyEmail(env, userEmail, licenseKey).catch((err) =>
            console.error('Failed to send license key email:', err)
          );
        }
      }
    }
  } catch (dbErr) {
    console.warn('Database license key creation skipped/failed:', dbErr);
  }

  return new Response(
    JSON.stringify({
      ok: true,
      verified: true,
      message: 'Payment verified successfully',
      payment_id: paymentId,
      order_id: orderId,
      license_key: licenseKey,
    }),
    {
      status: 200,
      headers: corsHeaders,
    }
  );
}
