import type { Env } from './db';

export async function verifyRazorpaySignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  if (!signature) return false;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
  const expected = Array.from(new Uint8Array(sigBuf), (b) => b.toString(16).padStart(2, '0')).join('');
  return expected === signature;
}

export async function createRazorpayOrder(
  env: Env,
  amountPaise: number
): Promise<{ id: string; amount: number; currency: string }> {
  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const resp = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount: amountPaise, currency: 'INR' }),
  });
  if (!resp.ok) {
    throw new Error(`razorpay order creation failed: ${resp.status}`);
  }
  return resp.json();
}
