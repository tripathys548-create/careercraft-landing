export async function checkRateLimit(sql: any, key: string, maxPerDay = 50): Promise<boolean> {
  const rows = await sql`SELECT count(*) AS count FROM usage_log WHERE key = ${key} AND created_at > now() - interval '1 day'`;
  return Number(rows[0].count) < maxPerDay;
}

export async function logUsage(sql: any, key: string, endpoint: string): Promise<void> {
  await sql`INSERT INTO usage_log (key, endpoint) VALUES (${key}, ${endpoint})`;
}
