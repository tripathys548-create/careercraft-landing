import { describe, it, expect, vi, beforeEach } from 'vitest';
import { sendLicenseKeyEmail } from '../src/lib/email';

describe('sendLicenseKeyEmail', () => {
  beforeEach(() => {
    global.fetch = vi.fn(async () => new Response('{}', { status: 200 })) as any;
  });

  it('POSTs to the email provider with the key in the body', async () => {
    await sendLicenseKeyEmail({ EMAIL_API_KEY: 'test-key' } as any, 'user@example.com', 'LKX-ABCD');
    expect(fetch).toHaveBeenCalledTimes(1);
    const [, options] = (fetch as any).mock.calls[0];
    expect(options.body).toContain('LKX-ABCD');
    expect(options.body).toContain('user@example.com');
  });

  it('throws if the email provider returns an error status', async () => {
    global.fetch = vi.fn(async () => new Response('error', { status: 500 })) as any;
    await expect(
      sendLicenseKeyEmail({ EMAIL_API_KEY: 'test-key' } as any, 'user@example.com', 'LKX-ABCD')
    ).rejects.toThrow();
  });
});
