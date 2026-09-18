import type { Env } from './db';

export const AUTHORIZED_ADMIN_EMAILS = [
  'support.websitecreation@gmail.com',
];

export function checkAdminAuth(request: Request, env: Env): boolean {
  const header = request.headers.get('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  const adminEmail = (request.headers.get('X-Admin-Email') ?? '').trim().toLowerCase();

  // If admin email is supplied, check that it is an authorized admin email
  if (adminEmail && !AUTHORIZED_ADMIN_EMAILS.includes(adminEmail)) {
    return false;
  }

  // Verify against ADMIN_PASSWORD or fallback secret
  const configuredPassword = env.ADMIN_PASSWORD || 'admin_secret';
  return token.length > 0 && token === configuredPassword;
}
