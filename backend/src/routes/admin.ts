import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { checkAdminAuth } from '../lib/adminAuth';

export async function handleAdminMessages(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return new Response('unauthorized', { status: 401 });
  }
  const sql = getDb(env);
  const rows = await sql`SELECT * FROM support_messages ORDER BY created_at DESC LIMIT 100`;
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleAdminGenerations(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return new Response('unauthorized', { status: 401 });
  }
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const sql = getDb(env);
  const rows = key
    ? await sql`SELECT id, key, endpoint, output_json, created_at FROM generated_content WHERE key = ${key} ORDER BY created_at DESC LIMIT 100`
    : await sql`SELECT id, key, endpoint, output_json, created_at FROM generated_content ORDER BY created_at DESC LIMIT 100`;
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function handleAdminKeys(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return new Response('unauthorized', { status: 401 });
  }
  const sql = getDb(env);
  const rows = await sql`SELECT key, email, linkedin_id, status, created_at, resume_generated_at FROM license_keys ORDER BY created_at DESC LIMIT 200`;
  return new Response(JSON.stringify(rows), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
