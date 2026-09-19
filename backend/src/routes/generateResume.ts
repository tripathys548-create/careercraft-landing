import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { validateAndBindKey } from '../lib/validateKey';
import { checkRateLimit, logUsage } from '../lib/rateLimit';
import { renderResumePdf } from '../lib/pdf';
import { TEMPLATE_NAMES, type PageSize, type TemplateName } from '../lib/resume/types';
import { cleanSource, isProfileUsable } from '../lib/resume/prompt';
import { generateResumeData } from '../lib/resume/generate';

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

export async function handleGenerateResume(request: Request, env: Env): Promise<Response> {
  const body = await request.json<{
    key: string;
    linkedinId: string;
    name?: string;
    headline?: string;
    about?: string;
    experience?: string;
    education?: string;
    skills?: string;
    template?: 'classic' | 'modern' | 'compact' | string;
    // Optional extras — rendered only if supplied and well-formed.
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    pageSize?: 'a4' | 'letter' | string;
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

  // Don't spend the customer's single generation on an empty/failed LinkedIn scrape.
  const source = cleanSource({
    linkedinId: str(body.linkedinId),
    name: str(body.name),
    headline: str(body.headline),
    about: str(body.about),
    experience: str(body.experience),
    education: str(body.education),
    skills: str(body.skills),
  });
  if (!isProfileUsable(source)) {
    return jsonResponse(
      env,
      {
        ok: false,
        code: 'profile_incomplete',
        error:
          'We could not read enough of your LinkedIn profile. Open your profile page, scroll to the bottom so every section loads, then try again. Your one-time resume has not been used.',
      },
      422
    );
  }

  const withinLimit = await checkRateLimit(sql, body.key);
  if (!withinLimit) {
    return jsonResponse(env, { ok: false, error: 'rate_limited' }, 429);
  }

  // ── Generate: structured extraction → code-side fact check → (one) corrective retry ──
  const generated = await generateResumeData(env, source, {
    email: body.email,
    phone: body.phone,
    location: body.location,
    website: body.website,
  });
  if (!generated) {
    return jsonResponse(env, { ok: false, error: 'generation_failed' }, 502);
  }
  const best = generated.result;

  const template: TemplateName = (TEMPLATE_NAMES as readonly string[]).includes(str(body.template))
    ? (body.template as TemplateName)
    : 'modern';
  const pageSize: PageSize = body.pageSize === 'letter' ? 'letter' : 'a4';

  let pdfBytes: Uint8Array;
  try {
    pdfBytes = await renderResumePdf({ ...best.data, template, pageSize }, template);
  } catch (err) {
    console.error('[resume] render failed', err instanceof Error ? err.message : err);
    return jsonResponse(
      env,
      {
        ok: false,
        code: 'render_failed',
        error: 'We could not build your resume PDF. Your one-time resume has not been used — please try again.',
      },
      500
    );
  }

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
