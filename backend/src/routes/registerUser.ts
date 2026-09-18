import type { Env } from '../lib/db';
import { getDb } from '../lib/db';

export interface RegisterUserBody {
  name: string;
  email: string;
  mobile?: string;
}

export async function handleRegisterUser(request: Request, env: Env): Promise<Response> {
  const origin = request.headers.get('Origin') || env.CHECKOUT_ORIGIN || '*';
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  let body: RegisterUserBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const mobile = body.mobile?.trim() || null;

  if (!name || !email) {
    return new Response(
      JSON.stringify({ ok: false, error: 'missing_fields', message: 'Name and email are required.' }),
      { status: 400, headers: corsHeaders }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'invalid_email', message: 'Please enter a valid email address.' }),
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const sql = getDb(env);

    // Auto-ensure users table exists
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        mobile TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;

    // Ensure license_keys columns exist
    await sql`ALTER TABLE license_keys ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id)`.catch(() => {});
    await sql`ALTER TABLE license_keys ADD COLUMN IF NOT EXISTS mobile TEXT`.catch(() => {});

    // Insert or update user
    const users = await sql`
      INSERT INTO users (name, email, mobile)
      VALUES (${name}, ${email}, ${mobile})
      ON CONFLICT (email)
      DO UPDATE SET name = EXCLUDED.name, mobile = COALESCE(EXCLUDED.mobile, users.mobile)
      RETURNING id, name, email, mobile, created_at
    `;

    const user = users[0];

    // Check if user already owns any license keys
    const existingKeys = await sql`
      SELECT key, status, created_at, linkedin_id
      FROM license_keys
      WHERE email = ${email}
      ORDER BY created_at DESC
    `;

    return new Response(
      JSON.stringify({
        ok: true,
        user,
        existingKeys: existingKeys || [],
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: any) {
    console.error('[registerUser] Error registering user:', err);
    return new Response(
      JSON.stringify({ ok: false, error: 'db_error', message: err.message || 'Failed to register user.' }),
      { status: 500, headers: corsHeaders }
    );
  }
}
