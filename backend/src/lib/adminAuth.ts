import type { Env } from './db';

export const AUTHORIZED_ADMIN_EMAILS = [
  'support.websitecreation@gmail.com',
];

export function checkAdminAuth(request: Request, env: Env): boolean {
  const header = request.headers.get('Authorization') ?? '';
  const token = (header.startsWith('Bearer ') ? header.slice(7) : header).trim();
  const adminEmail = (request.headers.get('X-Admin-Email') ?? '').trim().toLowerCase();

  // If admin email is supplied, check that it is an authorized admin email
  if (adminEmail && !AUTHORIZED_ADMIN_EMAILS.includes(adminEmail)) {
    return false;
  }

  // Valid passwords: environment secret, standard admin password, or dev secret
  const validPasswords = [
    env.ADMIN_PASSWORD,
    'CareerCraftAdmin@2026',
    'admin_secret',
  ].filter(Boolean);

  return validPasswords.includes(token);
}
