import { describe, it, expect } from 'vitest';
import { checkAdminAuth } from '../src/lib/adminAuth';

describe('checkAdminAuth', () => {
  it('returns true when the Authorization header matches the admin password', () => {
    const request = new Request('https://x/admin/messages', {
      headers: { Authorization: 'Bearer correct-password' },
    });
    expect(checkAdminAuth(request, { ADMIN_PASSWORD: 'correct-password' } as any)).toBe(true);
  });

  it('returns false when the Authorization header is missing', () => {
    const request = new Request('https://x/admin/messages');
    expect(checkAdminAuth(request, { ADMIN_PASSWORD: 'correct-password' } as any)).toBe(false);
  });

  it('returns false when the password does not match', () => {
    const request = new Request('https://x/admin/messages', {
      headers: { Authorization: 'Bearer wrong-password' },
    });
    expect(checkAdminAuth(request, { ADMIN_PASSWORD: 'correct-password' } as any)).toBe(false);
  });
});

describe('handleAdminMessages', () => {
  it('returns 401 when auth fails', async () => {
    const { handleAdminMessages } = await import('../src/routes/admin');
    const request = new Request('https://x/admin/messages');
    const response = await handleAdminMessages(request, { ADMIN_PASSWORD: 'p' } as any);
    expect(response.status).toBe(401);
  });
});
