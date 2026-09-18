import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { checkAdminAuth } from '../lib/adminAuth';
import { generateLicenseKey } from '../lib/licenseKey';
import { sendLicenseKeyEmail } from '../lib/email';

function jsonResp(request: Request, env: Env, data: any, status = 200): Response {
  const origin = request.headers.get('Origin') || env.CHECKOUT_ORIGIN || '*';
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function handleAdminMigrate(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return jsonResp(request, env, { ok: false, error: 'unauthorized' }, 401);
  }
  const sql = getDb(env);
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      mobile TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS license_keys (
      key TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      mobile TEXT,
      user_id INTEGER,
      linkedin_id TEXT,
      bound_at TIMESTAMPTZ,
      resume_generated_at TIMESTAMPTZ,
      razorpay_payment_id TEXT UNIQUE,
      status TEXT NOT NULL DEFAULT 'active',
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  await sql`ALTER TABLE license_keys ADD COLUMN IF NOT EXISTS user_id INTEGER`.catch(() => {});
  await sql`ALTER TABLE license_keys ADD COLUMN IF NOT EXISTS mobile TEXT`.catch(() => {});
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

  return jsonResp(request, env, { ok: true, message: 'Schema migration executed successfully.' });
}

export async function handleAdminUsers(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return jsonResp(request, env, { ok: false, error: 'unauthorized' }, 401);
  }
  const sql = getDb(env);
  try {
    const rows = await sql`
      SELECT u.id, u.name, u.email, u.mobile, u.created_at, COUNT(l.key)::int as key_count
      FROM users u
      LEFT JOIN license_keys l ON LOWER(u.email) = LOWER(l.email)
      GROUP BY u.id, u.name, u.email, u.mobile, u.created_at
      ORDER BY u.created_at DESC
      LIMIT 200
    `;
    return jsonResp(request, env, { ok: true, users: rows });
  } catch (err: any) {
    return jsonResp(request, env, { ok: false, error: err.message }, 500);
  }
}

export async function handleAdminKeys(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return jsonResp(request, env, { ok: false, error: 'unauthorized' }, 401);
  }
  const sql = getDb(env);
  try {
    const rows = await sql`
      SELECT key, email, mobile, linkedin_id, status, created_at, resume_generated_at, razorpay_payment_id
      FROM license_keys
      ORDER BY created_at DESC
      LIMIT 200
    `;
    return jsonResp(request, env, { ok: true, keys: rows });
  } catch (err: any) {
    return jsonResp(request, env, { ok: false, error: err.message }, 500);
  }
}

interface AdminGenerateKeyBody {
  email: string;
  name?: string;
  mobile?: string;
  sendEmail?: boolean;
}

export async function handleAdminGenerateKey(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return jsonResp(request, env, { ok: false, error: 'unauthorized' }, 401);
  }
  const body = (await request.json().catch(() => ({}))) as AdminGenerateKeyBody;
  const email = (body.email || '').trim().toLowerCase();
  if (!email) {
    return jsonResp(request, env, { ok: false, error: 'missing_email', message: 'Email is required' }, 400);
  }

  const sql = getDb(env);
  const key = generateLicenseKey();
  const paymentId = `manual_admin_${Date.now()}`;

  try {
    let userId: number | null = null;
    if (body.name || body.mobile) {
      const uRows = await sql`
        INSERT INTO users (name, email, mobile)
        VALUES (${body.name || 'Candidate'}, ${email}, ${body.mobile || null})
        ON CONFLICT (email) DO UPDATE SET mobile = COALESCE(EXCLUDED.mobile, users.mobile)
        RETURNING id
      `;
      if (uRows.length > 0) userId = uRows[0].id;
    }

    await sql`
      INSERT INTO license_keys (key, email, mobile, user_id, razorpay_payment_id, status)
      VALUES (${key}, ${email}, ${body.mobile || null}, ${userId}, ${paymentId}, 'active')
    `;

    if (body.sendEmail && env.EMAIL_API_KEY) {
      await sendLicenseKeyEmail(env, email, key).catch((e) => console.error('Email send error:', e));
    }

    return jsonResp(request, env, { ok: true, key, email });
  } catch (err: any) {
    return jsonResp(request, env, { ok: false, error: err.message }, 500);
  }
}

export async function handleAdminResendKey(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return jsonResp(request, env, { ok: false, error: 'unauthorized' }, 401);
  }
  const body = await request.json<{ key: string; email: string }>().catch(() => ({ key: '', email: '' }));
  if (!body.key || !body.email) {
    return jsonResp(request, env, { ok: false, error: 'missing_fields' }, 400);
  }

  if (!env.EMAIL_API_KEY) {
    return jsonResp(request, env, { ok: false, error: 'no_email_service', message: 'Email API key not configured' }, 500);
  }

  try {
    await sendLicenseKeyEmail(env, body.email.trim().toLowerCase(), body.key.trim());
    return jsonResp(request, env, { ok: true, message: `License key sent to ${body.email}` });
  } catch (err: any) {
    return jsonResp(request, env, { ok: false, error: err.message }, 500);
  }
}

export async function handleAdminToggleKey(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return jsonResp(request, env, { ok: false, error: 'unauthorized' }, 401);
  }
  const body = await request.json<{ key: string; status: 'active' | 'revoked' }>().catch(() => ({ key: '', status: 'active' as const }));
  if (!body.key || !body.status) {
    return jsonResp(request, env, { ok: false, error: 'missing_fields' }, 400);
  }

  const sql = getDb(env);
  try {
    await sql`UPDATE license_keys SET status = ${body.status} WHERE key = ${body.key.trim()}`;
    return jsonResp(request, env, { ok: true, key: body.key, status: body.status });
  } catch (err: any) {
    return jsonResp(request, env, { ok: false, error: err.message }, 500);
  }
}

export async function handleAdminMessages(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return jsonResp(request, env, { ok: false, error: 'unauthorized' }, 401);
  }
  const sql = getDb(env);
  try {
    const rows = await sql`
      SELECT id, name, email, key, message, status, admin_reply, created_at, replied_at
      FROM support_messages
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return jsonResp(request, env, { ok: true, messages: rows });
  } catch (err: any) {
    return jsonResp(request, env, { ok: false, error: err.message }, 500);
  }
}

interface AdminResolveMessageBody {
  id: number;
  status?: string;
  admin_reply?: string;
}

export async function handleAdminResolveMessage(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return jsonResp(request, env, { ok: false, error: 'unauthorized' }, 401);
  }
  const body = (await request.json().catch(() => ({}))) as AdminResolveMessageBody;
  if (!body.id) {
    return jsonResp(request, env, { ok: false, error: 'missing_id' }, 400);
  }

  const sql = getDb(env);
  try {
    await sql`
      UPDATE support_messages
      SET status = ${body.status || 'resolved'}, admin_reply = ${body.admin_reply || null}, replied_at = now()
      WHERE id = ${body.id}
    `;
    return jsonResp(request, env, { ok: true, id: body.id });
  } catch (err: any) {
    return jsonResp(request, env, { ok: false, error: err.message }, 500);
  }
}

export async function handleAdminGenerations(request: Request, env: Env): Promise<Response> {
  if (!checkAdminAuth(request, env)) {
    return jsonResp(request, env, { ok: false, error: 'unauthorized' }, 401);
  }
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  const sql = getDb(env);
  try {
    const rows = key
      ? await sql`SELECT id, key, endpoint, output_json, created_at FROM generated_content WHERE key = ${key} ORDER BY created_at DESC LIMIT 100`
      : await sql`SELECT id, key, endpoint, output_json, created_at FROM generated_content ORDER BY created_at DESC LIMIT 100`;
    return jsonResp(request, env, { ok: true, generations: rows });
  } catch (err: any) {
    return jsonResp(request, env, { ok: false, error: err.message }, 500);
  }
}
