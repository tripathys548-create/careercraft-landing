import type { Env } from './db';

export async function verifyRazorpaySignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  if (!signature || !secret || !body) return false;
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
    const expected = Array.from(new Uint8Array(sigBuf), (b) => b.toString(16).padStart(2, '0')).join('');
    return expected.toLowerCase() === signature.toLowerCase();
  } catch {
    return false;
  }
}

export async function createRazorpayOrder(
  env: Env,
  amountPaise: number,
  currency = 'INR',
  receipt?: string
): Promise<{ id: string; amount: number; currency: string; receipt?: string }> {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials are not configured in environment');
  }

  const auth = btoa(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`);
  const payload: Record<string, any> = {
    amount: amountPaise,
    currency: currency || 'INR',
  };
  if (receipt) {
    payload.receipt = receipt;
  }

  const resp = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const errText = await resp.text();
    throw new Error(`Razorpay order creation failed: ${resp.status} - ${errText}`);
  }

  return resp.json();
}
