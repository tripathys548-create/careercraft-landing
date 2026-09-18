import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { validateAndBindKey } from '../lib/validateKey';
import { checkRateLimit, logUsage } from '../lib/rateLimit';
import { callLLMJson } from '../lib/llm';

const SYSTEM_PROMPT = `You rewrite LinkedIn profiles for Indian tech job seekers.
Return ONLY JSON matching: {"headline": string, "about": string, "experience": string[]}.
Headline: SEO-focused, under 220 characters.
About: three short paragraphs (hook, journey, call-to-action).
Experience: each entry starts with an action verb and includes a metric.`;

export async function handleRewriteProfile(request: Request, env: Env): Promise<Response> {
  const body = await request.json<{
    key: string;
    linkedinId: string;
    headline: string;
    about: string;
    experience: string;
  }>();

  const sql = getDb(env);
  const validation = await validateAndBindKey(sql, body.key, body.linkedinId);
  if (!validation.ok) {
    return new Response(JSON.stringify(validation), {
      status: 403,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN },
    });
  }

  const withinLimit = await checkRateLimit(sql, body.key);
  if (!withinLimit) {
    return new Response(JSON.stringify({ ok: false, error: 'rate_limited' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN },
    });
  }

  const userContent = `Headline: ${body.headline}\nAbout: ${body.about}\nExperience: ${body.experience}`;
  let result: any;
  try {
    result = await callLLMJson(env, SYSTEM_PROMPT, userContent);
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'generation_failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN },
    });
  }

  await logUsage(sql, body.key, 'rewrite-profile');
  await sql`INSERT INTO generated_content (key, endpoint, output_json) VALUES (${body.key}, 'rewrite-profile', ${JSON.stringify(result)})`;

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN },
  });
}
