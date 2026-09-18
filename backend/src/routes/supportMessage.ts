import type { Env } from '../lib/db';
import { getDb } from '../lib/db';

export async function handleSupportMessage(request: Request, env: Env): Promise<Response> {
  const body = await request.json<{ email: string; key?: string; message: string }>();
  const sql = getDb(env);
  await sql`INSERT INTO support_messages (email, key, message) VALUES (${body.email}, ${body.key ?? null}, ${body.message})`;
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN,
    },
  });
}
