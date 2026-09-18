import { describe, it, expect, vi } from 'vitest';

// Top-level mock — Vitest hoists this before any test runs
vi.mock('../src/lib/razorpay', () => ({
  createRazorpayOrder: vi.fn(async () => ({ id: 'order_1', amount: 19900, currency: 'INR' })),
}));

describe('handleCreateOrder IP rate limiting', () => {
  it('rejects a 6th request from the same IP within a minute', async () => {
    vi.resetModules();
    // Re-import after reset so ipHits Map is fresh
    const { handleCreateOrder } = await import('../src/routes/createOrder');
    const env = { CHECKOUT_ORIGIN: 'https://checkout.example.com' } as any;

    const makeRequest = (ip = '1.2.3.4') =>
      new Request('https://x/create-order', {
        method: 'POST',
        headers: { 'CF-Connecting-IP': ip },
      });

    for (let i = 0; i < 5; i++) {
      const r = await handleCreateOrder(makeRequest(), env);
      expect(r.status).toBe(200);
    }

    const sixth = await handleCreateOrder(makeRequest(), env);
    expect(sixth.status).toBe(429);
  });

  it('allows requests from different IPs independently', async () => {
    vi.resetModules();
    const { handleCreateOrder } = await import('../src/routes/createOrder');
    const env = { CHECKOUT_ORIGIN: 'https://checkout.example.com' } as any;

    const makeReq = (ip: string) =>
      new Request('https://x/create-order', {
        method: 'POST',
        headers: { 'CF-Connecting-IP': ip },
      });

    // 5 requests from IP A — should all pass
    for (let i = 0; i < 5; i++) {
      const r = await handleCreateOrder(makeReq('10.0.0.1'), env);
      expect(r.status).toBe(200);
    }

    // 1 request from a different IP — separate counter, should pass
    const r = await handleCreateOrder(makeReq('10.0.0.2'), env);
    expect(r.status).toBe(200);
  });
});
