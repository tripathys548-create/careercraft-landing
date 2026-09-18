import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { validateAndBindKey } from '../lib/validateKey';
import { checkRateLimit, logUsage } from '../lib/rateLimit';
import { callLLMJson } from '../lib/llm';
import { renderResumePdf, TemplateName } from '../lib/pdf';

const VALID_TEMPLATES: TemplateName[] = ['modern', 'classic', 'compact'];

const SYSTEM_PROMPT = `You are a LinkedIn profile grader and rewriter for Indian tech job seekers.

You will receive a LinkedIn profile either as separate fields (headline, about, experience,
skills) or as one block of raw text pasted from a LinkedIn PDF export. If given raw text,
first identify and separate the headline, the About section, experience entries, and skills
from it as best you can before scoring.

Score the ORIGINAL profile from 0-100 using this rubric:
- Headline (0-25): keyword strength for recruiter search, clarity, specificity
- About section (0-25): a real hook, a narrative with substance, a call-to-action — not generic filler
- Experience (0-30): action verbs, quantified results, ordering that leads with recruiter-relevant skills
- Skills (0-20): relevance and specificity, not a generic laundry list

Then rewrite the headline, About section, experience bullets, and skills to maximize the same
rubric, following these rules:
- Headline: SEO-focused, under 220 characters
- About: three short paragraphs (hook, journey, call-to-action)
- Experience: each entry starts with an action verb and includes a metric
- Skills: reordered so the most recruiter-relevant ones come first, trimmed to the strongest 8-12

Score the REWRITTEN profile 0-100 using the identical rubric.

Return ONLY JSON matching:
{
  "beforeScore": number,
  "beforeBreakdown": {"headline": number, "about": number, "experience": number, "skills": number},
  "afterScore": number,
  "afterBreakdown": {"headline": number, "about": number, "experience": number, "skills": number},
  "improvements": string[],
  "rewrite": {"headline": string, "about": string, "experience": string[], "skills": string[]}
}
"improvements" should be 4-6 specific, concrete suggestions a person could act on immediately.`;

interface AnalyzeRequestBody {
  key: string;
  linkedinUrl?: string;
  name?: string;
  headline?: string;
  about?: string;
  experience?: string;
  education?: string;
  skills?: string;
  rawText?: string;
  template?: string;
}

function deriveLinkedinId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/\/in\/([^/?#]+)/);
  return match ? match[1] : null;
}

function resolveOrigin(request: Request, env: Env): string {
  const origin = request.headers.get('Origin') ?? '';
  if (
    origin === env.CHECKOUT_ORIGIN ||
    origin === env.EXTENSION_ORIGIN ||
    origin === 'https://careercraftt.webelvate.com' ||
    origin === 'https://careercraft.webelvate.com' ||
    /^https?:\/\/([a-z0-9-]+\.)*webelvate\.com$/.test(origin) ||
    /^http:\/\/localhost:\d+$/.test(origin)
  ) {
    return origin;
  }
  return env.CHECKOUT_ORIGIN || '*';
}

function jsonResponse(origin: string, body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin },
  });
}

export async function handleAnalyzeProfile(request: Request, env: Env): Promise<Response> {
  const origin = resolveOrigin(request, env);
  const body = await request.json<AnalyzeRequestBody>();

  if (!body.key) {
    return jsonResponse(origin, { ok: false, error: 'missing_key' }, 400);
  }

  const hasStructuredInput = body.headline || body.about || body.experience || body.skills;
  if (!hasStructuredInput && !body.rawText) {
    return jsonResponse(origin, { ok: false, error: 'missing_profile_content' }, 400);
  }

  const sql = getDb(env);
  const linkedinId = deriveLinkedinId(body.linkedinUrl);

  const validation = await validateAndBindKey(sql, body.key, linkedinId);
  if (!validation.ok) {
    return jsonResponse(origin, validation, 403);
  }

  const withinLimit = await checkRateLimit(sql, body.key);
  if (!withinLimit) {
    return jsonResponse(origin, { ok: false, error: 'rate_limited' }, 429);
  }

  const userContent = body.rawText
    ? `Raw exported profile text:\n${body.rawText}`
    : [
        `Headline: ${body.headline ?? ''}`,
        `About: ${body.about ?? ''}`,
        `Experience: ${body.experience ?? ''}`,
        `Skills: ${body.skills ?? ''}`,
      ].join('\n');

  let result: any;
  try {
    result = await callLLMJson(env, SYSTEM_PROMPT, userContent);
  } catch {
    return jsonResponse(origin, { ok: false, error: 'generation_failed' }, 502);
  }

  await logUsage(sql, body.key, 'analyze-profile');
  await sql`INSERT INTO generated_content (key, endpoint, output_json) VALUES (${body.key}, 'analyze-profile', ${JSON.stringify(result)})`;

  // Best-effort resume PDF from the same rewrite — never fail the whole request over this.
  let resumePdfBase64: string | null = null;
  try {
    const template: TemplateName = VALID_TEMPLATES.includes(body.template as TemplateName)
      ? (body.template as TemplateName)
      : 'modern';
    const pdfBytes = await renderResumePdf(
      {
        name: body.name ?? '',
        headline: result.rewrite?.headline ?? body.headline ?? '',
        summary: result.rewrite?.about ?? body.about ?? '',
        experience: result.rewrite?.experience ?? [],
        education: body.education ? body.education.split('\n').filter(Boolean) : [],
        skills: result.rewrite?.skills ?? [],
      },
      template
    );
    let binary = '';
    const chunkSize = 8192;
    for (let i = 0; i < pdfBytes.length; i += chunkSize) {
      binary += String.fromCharCode(...pdfBytes.subarray(i, i + chunkSize));
    }
    resumePdfBase64 = btoa(binary);
  } catch (err) {
    console.error('[analyze-profile] resume generation failed:', err);
  }

  return jsonResponse(origin, { ok: true, ...result, resumePdfBase64 }, 200);
}
