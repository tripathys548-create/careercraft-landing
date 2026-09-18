import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { validateAndBindKey } from '../lib/validateKey';
import { checkRateLimit, logUsage } from '../lib/rateLimit';
import { callLLMJson } from '../lib/llm';

const SYSTEM_PROMPT = `You write a single cold-outreach LinkedIn DM (~75 words) from a job seeker
to a recruiter or senior employee, asking for a referral, based on both people's tech stacks.
Return ONLY JSON matching: {"message": string}. Be specific, not generic. No emojis.`;

export async function handleGenerateDm(request: Request, env: Env): Promise<Response> {
  const body = await request.json<{
    key: string;
    linkedinId: string;
    viewerStack: string;
    targetName: string;
    targetHeadline: string;
    persona?: 'hiring_manager' | 'recruiter' | 'peer';
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

  const personaInstructions = {
    hiring_manager: 'Target is a Hiring Manager / Team Lead. Focus on problem-solving, technical depth, and direct value proposition.',
    recruiter: 'Target is an HR / Talent Recruiter. Focus on exact skill/keyword match, experience level, and clear interview availability.',
    peer: 'Target is an Alumni / Peer. Use a warm, collaborative tone, common-ground hook, and a low-pressure ask for advice or internal referral.',
  }[body.persona ?? 'hiring_manager'];

  const userContent = `Persona style: ${personaInstructions}\nMy stack: ${body.viewerStack}\nTarget name: ${body.targetName}\nTarget headline: ${body.targetHeadline}`;
  let result: any;
  try {
    result = await callLLMJson(env, SYSTEM_PROMPT, userContent);
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'generation_failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN },
    });
  }

  await logUsage(sql, body.key, 'generate-dm');
  await sql`INSERT INTO generated_content (key, endpoint, output_json) VALUES (${body.key}, 'generate-dm', ${JSON.stringify(result)})`;

  return new Response(JSON.stringify(result), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN },
  });
}
