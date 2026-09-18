import type { Env } from '../lib/db';
import { getDb } from '../lib/db';

export async function handleSupportMessage(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin') || env.CHECKOUT_ORIGIN || '*';
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), { status: 405, headers: corsHeaders });
  }

  let body: { name?: string; email: string; key?: string; message: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), { status: 400, headers: corsHeaders });
  }

  if (!body.email || !body.message) {
    return new Response(
      JSON.stringify({ ok: false, error: 'missing_fields', message: 'Email and message are required.' }),
      { status: 400, headers: corsHeaders }
    );
  }

  const sql = getDb(env);
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS support_messages (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT NOT NULL,
        key TEXT,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'open',
        admin_reply TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        replied_at TIMESTAMPTZ
      )
    `;
    await sql`ALTER TABLE support_messages ADD COLUMN IF NOT EXISTS name TEXT`.catch(() => {});

    await sql`
      INSERT INTO support_messages (name, email, key, message)
      VALUES (${body.name?.trim() || null}, ${body.email.trim().toLowerCase()}, ${body.key?.trim() || null}, ${body.message.trim()})
    `;

    return new Response(JSON.stringify({ ok: true, message: 'Message received. We will get back to you shortly.' }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err: any) {
    console.error('Error saving support message:', err);
    return new Response(JSON.stringify({ ok: false, error: err.message || 'Failed to submit message' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
