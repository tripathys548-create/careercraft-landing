import { describe, it, expect } from 'vitest';
import { verifyRazorpaySignature } from '../src/lib/razorpay';

describe('verifyRazorpaySignature', () => {
  it('returns true for a correctly signed body', async () => {
    const secret = 'test-secret';
    const body = '{"event":"payment.captured"}';
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    const sigBuf = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body));
    const signature = Array.from(new Uint8Array(sigBuf), (b) => b.toString(16).padStart(2, '0')).join('');

    const result = await verifyRazorpaySignature(body, signature, secret);
    expect(result).toBe(true);
  });

  it('returns false for a tampered body', async () => {
    const result = await verifyRazorpaySignature('{"event":"tampered"}', 'deadbeef', 'test-secret');
    expect(result).toBe(false);
  });

  it('returns false for an empty signature', async () => {
    const result = await verifyRazorpaySignature('{"event":"x"}', '', 'test-secret');
    expect(result).toBe(false);
  });
});
