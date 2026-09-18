import { describe, it, expect, vi } from 'vitest';
import { validateAndBindKey } from '../src/lib/validateKey';

function fakeSql(rows: any[]) {
  const fn: any = vi.fn(async () => rows);
  return fn;
}

describe('validateAndBindKey', () => {
  it('returns invalid_key when the key does not exist', async () => {
    const sql = fakeSql([]);
    const result = await validateAndBindKey(sql, 'LKX-BAD', null);
    expect(result).toEqual({ ok: false, error: 'invalid_key' });
  });

  it('returns inactive_key when status is not active', async () => {
    const sql = fakeSql([{ key: 'LKX-1', linkedin_id: null, status: 'revoked' }]);
    const result = await validateAndBindKey(sql, 'LKX-1', 'li-123');
    expect(result).toEqual({ ok: false, error: 'inactive_key' });
  });

  it('binds an unbound key to the given linkedin id and returns ok', async () => {
    const sql = fakeSql([{ key: 'LKX-1', linkedin_id: null, status: 'active' }]);
    const result = await validateAndBindKey(sql, 'LKX-1', 'li-123');
    expect(result).toEqual({ ok: true });
    // second call in the function is the UPDATE ... WHERE linkedin_id IS NULL
    expect(sql).toHaveBeenCalledTimes(2);
  });

  it('returns ok without rebinding when linkedin id matches the bound account', async () => {
    const sql = fakeSql([{ key: 'LKX-1', linkedin_id: 'li-123', status: 'active' }]);
    const result = await validateAndBindKey(sql, 'LKX-1', 'li-123');
    expect(result).toEqual({ ok: true });
    expect(sql).toHaveBeenCalledTimes(1);
  });

  it('returns mismatched_account when linkedin id differs from the bound account', async () => {
    const sql = fakeSql([{ key: 'LKX-1', linkedin_id: 'li-123', status: 'active' }]);
    const result = await validateAndBindKey(sql, 'LKX-1', 'li-999');
    expect(result).toEqual({ ok: false, error: 'mismatched_account' });
  });
});
