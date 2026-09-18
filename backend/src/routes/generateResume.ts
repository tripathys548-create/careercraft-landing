import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { validateAndBindKey } from '../lib/validateKey';
import { checkRateLimit, logUsage } from '../lib/rateLimit';
import { callLLMJson } from '../lib/llm';
import { renderResumePdf, TemplateName } from '../lib/pdf';

const VALID_TEMPLATES: TemplateName[] = ['modern', 'classic', 'compact'];

const SYSTEM_PROMPT = `Structure this LinkedIn profile into resume content.
Return ONLY JSON matching: {"summary": string, "experience": string[], "education": string[], "skills": string[]}.`;

export async function handleGenerateResume(request: Request, env: Env): Promise<Response> {
  const body = await request.json<{
    key: string;
    linkedinId: string;
    name?: string;
    headline?: string;
    about?: string;
    experience?: string;
    education?: string;
    template?: 'classic' | 'modern' | 'compact' | string;
  }>();

  const sql = getDb(env);

  // Load key row including resume_generated_at for one-time gate check
  const rows = await sql`SELECT key, linkedin_id, status, resume_generated_at FROM license_keys WHERE key = ${body.key}`;
  if (rows.length === 0) {
    return jsonResponse(env, { ok: false, error: 'invalid_key' }, 403);
  }

  const validation = await validateAndBindKey(sql, body.key, body.linkedinId);
  if (!validation.ok) {
    return jsonResponse(env, validation, 403);
  }

  // One-time gate: if already generated, re-serve stored PDF without calling the LLM
  if (rows[0].resume_generated_at) {
    const stored = await sql`SELECT output_blob FROM generated_content WHERE key = ${body.key} AND endpoint = 'generate-resume' ORDER BY created_at DESC LIMIT 1`;
    const blob = stored[0]?.output_blob;
    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
        'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN,
      },
    });
  }

  const withinLimit = await checkRateLimit(sql, body.key);
  if (!withinLimit) {
    return jsonResponse(env, { ok: false, error: 'rate_limited' }, 429);
  }

  const userContent = `Name: ${body.name}\nHeadline: ${body.headline}\nAbout: ${body.about}\nExperience: ${body.experience}\nEducation: ${body.education}\nSkills: ${body.skills}`;
  let structured: any;
  try {
    structured = await callLLMJson(env, SYSTEM_PROMPT, userContent);
  } catch {
    return jsonResponse(env, { ok: false, error: 'generation_failed' }, 502);
  }

  const template: TemplateName = VALID_TEMPLATES.includes(body.template as TemplateName)
    ? (body.template as TemplateName)
    : 'modern';
  const pdfBytes = await renderResumePdf(
    {
      name: body.name ?? '',
      headline: body.headline ?? '',
      summary: structured.summary,
      experience: structured.experience,
      education: structured.education,
      skills: structured.skills,
      template,
    },
    template
  );

  await logUsage(sql, body.key, 'generate-resume');
  await sql`INSERT INTO generated_content (key, endpoint, output_blob) VALUES (${body.key}, 'generate-resume', ${Buffer.from(pdfBytes)})`;
  await sql`UPDATE license_keys SET resume_generated_at = now() WHERE key = ${body.key}`;

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="resume.pdf"',
      'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN,
    },
  });
}

function jsonResponse(env: Env, body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': env.EXTENSION_ORIGIN,
    },
  });
}
