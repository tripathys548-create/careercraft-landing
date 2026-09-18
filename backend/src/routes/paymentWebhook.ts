import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { verifyRazorpaySignature } from '../lib/razorpay';
import { generateLicenseKey } from '../lib/licenseKey';
import { sendLicenseKeyEmail } from '../lib/email';

export async function handlePaymentWebhook(request: Request, env: Env): Promise<Response> {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';
  const valid = await verifyRazorpaySignature(rawBody, signature, env.RAZORPAY_WEBHOOK_SECRET);
  if (!valid) {
    return new Response('invalid signature', { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  const payment = payload.payload.payment.entity;
  const email = payment.email;
  const paymentId = payment.id;

  const sql = getDb(env);
  const existing = await sql`SELECT key FROM license_keys WHERE razorpay_payment_id = ${paymentId}`;
  if (existing.length > 0) {
    return new Response('ok', { status: 200 }); // already processed — idempotent
  }

  const key = generateLicenseKey();
  await sql`INSERT INTO license_keys (key, email, razorpay_payment_id) VALUES (${key}, ${email}, ${paymentId})`;
  await sendLicenseKeyEmail(env, email, key);

  return new Response('ok', { status: 200 });
}
