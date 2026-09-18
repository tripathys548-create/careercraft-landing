import { describe, it, expect } from 'vitest';
import { getDb } from '../src/lib/db';

describe('getDb', () => {
  it('returns a callable sql tagged-template function', () => {
    const sql = getDb({ DATABASE_URL: 'postgresql://user:password@host.neon.tech/dbname' } as any);
    expect(typeof sql).toBe('function');
  });
});
