import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { validateAndBindKey } from '../lib/validateKey';

export async function handleValidateKey(request: Request, env: Env): Promise<Response> {
  const { key, linkedinId } = await request.json<{ key: string; linkedinId: string | null }>();
  const sql = getDb(env);
  const result = await validateAndBindKey(sql, key, linkedinId ?? null);

  return new Response(JSON.stringify(result), {
    status: result.ok ? 200 : 403,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN,
    },
  });
}
