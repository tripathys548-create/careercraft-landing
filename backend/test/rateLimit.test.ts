import { describe, it, expect, vi } from 'vitest';
import { checkRateLimit, logUsage } from '../src/lib/rateLimit';

describe('checkRateLimit', () => {
  it('returns true when usage is below the daily cap', async () => {
    const sql = vi.fn(async () => [{ count: '3' }]);
    const result = await checkRateLimit(sql as any, 'LKX-1', 50);
    expect(result).toBe(true);
  });

  it('returns false when usage has reached the daily cap', async () => {
    const sql = vi.fn(async () => [{ count: '50' }]);
    const result = await checkRateLimit(sql as any, 'LKX-1', 50);
    expect(result).toBe(false);
  });
});

describe('logUsage', () => {
  it('inserts a usage_log row for the given key and endpoint', async () => {
    const sql = vi.fn(async () => []);
    await logUsage(sql as any, 'LKX-1', 'rewrite-profile');
    expect(sql).toHaveBeenCalledTimes(1);
  });
});
