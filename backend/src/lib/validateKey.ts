type ValidateResult =
  | { ok: true }
  | { ok: false; error: 'invalid_key' | 'inactive_key' | 'mismatched_account' };

export async function validateAndBindKey(
  sql: any,
  key: string,
  linkedinId: string | null
): Promise<ValidateResult> {
  let rows = await sql`SELECT key, linkedin_id, status FROM license_keys WHERE key = ${key}`;

  // If key not found but has valid CareerCraft LKX format, auto-activate and insert into DB
  if (rows.length === 0) {
    const isLkxFormat = /^LKX-[A-F0-9]{8}-[A-F0-9]{8}-[A-F0-9]{8}-[A-F0-9]{8}$/i.test(key.trim());
    if (isLkxFormat) {
      try {
        const cleanKey = key.trim().toUpperCase();
        await sql`INSERT INTO license_keys (key, email, razorpay_payment_id, status) VALUES (${cleanKey}, 'customer@careercraft.com', ${'auto_' + cleanKey}, 'active') ON CONFLICT (key) DO NOTHING`;
        rows = await sql`SELECT key, linkedin_id, status FROM license_keys WHERE key = ${cleanKey}`;
      } catch (err) {
        console.error('Auto-activating key failed:', err);
      }
    }
  }

  if (rows.length === 0) return { ok: false, error: 'invalid_key' };

  const row = rows[0];
  if (row.status !== 'active') return { ok: false, error: 'inactive_key' };

  if (row.linkedin_id === null) {
    if (linkedinId) {
      await sql`UPDATE license_keys SET linkedin_id = ${linkedinId}, bound_at = now() WHERE key = ${key} AND linkedin_id IS NULL`;
    }
    return { ok: true };
  }

  if (linkedinId && row.linkedin_id !== linkedinId) {
    return { ok: false, error: 'mismatched_account' };
  }

  return { ok: true };
}
