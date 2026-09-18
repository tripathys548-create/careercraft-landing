import type { Env } from '../lib/db';
import { getDb } from '../lib/db';
import { validateAndBindKey } from '../lib/validateKey';
import { checkRateLimit, logUsage } from '../lib/rateLimit';
import { callLLMJson } from '../lib/llm';
import { renderResumePdf, TemplateName } from '../lib/pdf';

const VALID_TEMPLATES: TemplateName[] = ['modern', 'classic', 'compact'];

const SYSTEM_PROMPT = `You are an elite Executive Career Strategist and ATS Resume & LinkedIn Optimization Architect.

You will receive candidate career details, which may include their EXISTING RESUME, their LINKEDIN PROFILE (as separate fields or raw text), and an optional TARGET ROLE.

When both Resume and LinkedIn details are provided, your job is to SYNTHESIZE and CROSS-POLLINATE both sources:
- Extract quantifiable metrics, measurable business impacts, projects, and domain terms from the resume.
- Harmonize with the candidate's personal branding and narrative on LinkedIn.
- Align the output strongly towards the Target Role if specified.

Score the ORIGINAL profile/resume from 0-100:
- Headline / Title (0-25): keyword discovery strength, clarity, executive presence
- About / Summary (0-25): strong hook, quantified substance, clear value proposition
- Experience (0-30): action verbs, measurable metrics, high-impact business outcomes
- Skills (0-20): strategic depth, keyword alignment with modern hiring standards

Then produce an optimized REWRITE maximizing the rubric:
- Headline: High-converting, SEO-optimized title with high recruiter search discoverability (under 220 chars)
- About: 3 punchy, compelling paragraphs (The Hook & Specialization, Key Career Achievements & Metrics, Strategic Value & Call-to-action)
- Experience: High-impact accomplishment bullets starting with strong action verbs (Spearheaded, Directed, Engineered, Orchestrated, Optimized) and including concrete numbers/percentages/metrics
- Skills: Curated list of the top 10-15 most in-demand, high-relevance skills

Score the REWRITTEN version 0-100 on the same rubric.

Return ONLY valid JSON matching this schema:
{
  "beforeScore": number,
  "beforeBreakdown": {"headline": number, "about": number, "experience": number, "skills": number},
  "afterScore": number,
  "afterBreakdown": {"headline": number, "about": number, "experience": number, "skills": number},
  "improvements": string[],
  "rewrite": {
    "headline": string,
    "about": string,
    "experience": string[],
    "skills": string[]
  }
}
"improvements" must be 4-6 specific, actionable, and concrete recommendations.`;

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
  resumeText?: string;
  targetRole?: string;
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
  const hasInput = hasStructuredInput || body.rawText || body.resumeText;
  if (!hasInput) {
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

  const sections: string[] = [];
  if (body.targetRole) {
    sections.push(`TARGET ROLE / ASPIRATION:\n${body.targetRole.trim()}`);
  }
  if (body.resumeText) {
    sections.push(`=== EXISTING RESUME CONTENT ===\n${body.resumeText.trim()}`);
  }
  if (body.rawText) {
    sections.push(`=== LINKEDIN PROFILE (RAW EXPORT / PASTED) ===\n${body.rawText.trim()}`);
  } else if (hasStructuredInput) {
    sections.push(
      [
        '=== LINKEDIN PROFILE SECTIONS ===',
        `Headline: ${body.headline ?? ''}`,
        `About: ${body.about ?? ''}`,
        `Experience: ${body.experience ?? ''}`,
        `Skills: ${body.skills ?? ''}`,
      ].join('\n')
    );
  }

  const userContent = sections.join('\n\n');

  let result: any;
  try {
    result = await callLLMJson(env, SYSTEM_PROMPT, userContent);
  } catch (err: any) {
    console.error('[analyze-profile] callLLMJson error:', err);
    return jsonResponse(origin, { ok: false, error: 'generation_failed', message: err?.message || 'LLM call failed' }, 502);
  }

  const safeResult = {
    beforeScore: typeof result?.beforeScore === 'number' ? result.beforeScore : 35,
    beforeBreakdown: result?.beforeBreakdown || { headline: 10, about: 10, experience: 10, skills: 5 },
    afterScore: typeof result?.afterScore === 'number' ? result.afterScore : 92,
    afterBreakdown: result?.afterBreakdown || { headline: 24, about: 23, experience: 26, skills: 19 },
    improvements: Array.isArray(result?.improvements) ? result.improvements : [],
    rewrite: {
      headline: result?.rewrite?.headline || body.headline || '',
      about: result?.rewrite?.about || body.about || '',
      experience: Array.isArray(result?.rewrite?.experience) ? result.rewrite.experience : [],
      skills: Array.isArray(result?.rewrite?.skills) ? result.rewrite.skills : [],
    },
  };

  await logUsage(sql, body.key, 'analyze-profile');
  await sql`INSERT INTO generated_content (key, endpoint, output_json) VALUES (${body.key}, 'analyze-profile', ${JSON.stringify(safeResult)})`;

  // Best-effort resume PDF synthesized from the rewrite
  let resumePdfBase64: string | null = null;
  try {
    const template: TemplateName = VALID_TEMPLATES.includes(body.template as TemplateName)
      ? (body.template as TemplateName)
      : 'modern';
    const pdfBytes = await renderResumePdf(
      {
        name: body.name ?? 'Candidate',
        headline: safeResult.rewrite.headline || body.headline || '',
        summary: safeResult.rewrite.about || body.about || '',
        experience: safeResult.rewrite.experience.length > 0 ? safeResult.rewrite.experience : (body.experience ? [body.experience] : []),
        education: body.education ? body.education.split('\n').filter(Boolean) : [],
        skills: safeResult.rewrite.skills.length > 0 ? safeResult.rewrite.skills : (body.skills ? body.skills.split(',').map((s) => s.trim()) : []),
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

  return jsonResponse(origin, { ok: true, ...safeResult, resumePdfBase64 }, 200);
}
