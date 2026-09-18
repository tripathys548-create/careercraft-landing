import type { Env } from './db';

export function checkAdminAuth(request: Request, env: Env): boolean {
  const header = request.headers.get('Authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return token.length > 0 && token === env.ADMIN_PASSWORD;
}
