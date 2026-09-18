import type { Env } from './db';

export async function sendLicenseKeyEmail(env: Env, to: string, key: string): Promise<void> {
  const resp = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.EMAIL_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'access@webelvate.com',
      to,
      subject: 'Your CareerCraft License Key',
      text: [
        `Your license key is: ${key}`,
        '',
        'Paste it into the extension popup to activate.',
        '',
        'This key is linked to your LinkedIn account the first time you use it.',
        'Keep it safe — it cannot be transferred to a different account.',
        '',
        '— CareerCraft',
      ].join('\n'),
    }),
  });
  if (!resp.ok) {
    throw new Error(`email send failed: ${resp.status}`);
  }
}
