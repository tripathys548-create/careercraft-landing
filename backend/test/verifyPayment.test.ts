import { describe, it, expect } from 'vitest';
import { handleVerifyPayment } from '../src/routes/verifyPayment';

async function generateTestSignature(orderId: string, paymentId: string, secret: string): Promise<string> {
  const message = `${orderId}|${paymentId}`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(message));
  return Array.from(new Uint8Array(sigBuf), (b) => b.toString(16).padStart(2, '0')).join('');
}

describe('handleVerifyPayment route', () => {
  const env = {
    RAZORPAY_KEY_ID: 'rzp_test_TdaVW6CqNv6GnT',
    RAZORPAY_KEY_SECRET: 'ktzMzDq7Fgv5s9IZA6Z8eftk',
    CHECKOUT_ORIGIN: 'http://localhost:5173',
  } as any;

  it('rejects requests with missing fields', async () => {
    const req = new Request('https://x/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ razorpay_order_id: 'order_123' }),
    });

    const res = await handleVerifyPayment(req, env);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('missing_fields');
  });

  it('rejects an invalid signature', async () => {
    const req = new Request('https://x/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: 'order_123',
        razorpay_payment_id: 'pay_123',
        razorpay_signature: 'invalid_signature_hex',
      }),
    });

    const res = await handleVerifyPayment(req, env);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.ok).toBe(false);
    expect(data.error).toBe('invalid_signature');
  });

  it('verifies a valid payment signature successfully', async () => {
    const orderId = 'order_valid_123';
    const paymentId = 'pay_valid_456';
    const validSignature = await generateTestSignature(orderId, paymentId, env.RAZORPAY_KEY_SECRET);

    const req = new Request('https://x/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: validSignature,
      }),
    });

    const res = await handleVerifyPayment(req, env);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.verified).toBe(true);
    expect(data.order_id).toBe(orderId);
    expect(data.payment_id).toBe(paymentId);
  });
});
