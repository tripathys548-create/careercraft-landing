/**
 * The single resume-content pipeline, shared by every entry point (Chrome extension route and the
 * web Profile Analyzer route):
 *
 *   noisy source text → structured LLM extraction → code-side fact check → (one) corrective retry
 *
 * Returns null when no usable resume could be produced; callers decide how to surface that.
 */
import type { Env } from '../db';
import { callLLMJson } from '../llm';
import type { SourceProfile } from './types';
import { RESUME_RESPONSE_SCHEMA, RESUME_SYSTEM_PROMPT, buildResumeUserContent } from './prompt';
import {
  buildRetryFeedback,
  contactFromText,
  isRenderable,
  needsRetry,
  normalizeResume,
  resumeScore,
  sanitizeContact,
  type NormalizeResult,
} from './normalize';
import { estimateExperienceYears } from './dates';

export interface ExplicitContact {
  email?: unknown;
  phone?: unknown;
  location?: unknown;
  website?: unknown;
}

export interface GenerateOutcome {
  result: NormalizeResult;
  attempts: number;
}

const MAX_ATTEMPTS = 2;

export async function generateResumeData(
  env: Env,
  source: SourceProfile,
  explicit: ExplicitContact = {},
  now: Date = new Date()
): Promise<GenerateOutcome | null> {
  const years = estimateExperienceYears([source.experience, source.raw].join('\n'), now);

  // Contact: explicit fields win; otherwise use what the customer wrote themselves (pasted resume / About).
  const found = contactFromText([source.about, source.raw].join('\n'));
  const contact = sanitizeContact(
    {
      email: explicit.email || found.email,
      phone: explicit.phone || found.phone,
      location: explicit.location,
      website: explicit.website,
    },
    source.linkedinId
  );

  const userContent = buildResumeUserContent(source, { now, years });

  let best: NormalizeResult | null = null;
  let feedback = '';
  let attempts = 0;
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    let raw: unknown;
    try {
      attempts++;
      raw = await callLLMJson(env, RESUME_SYSTEM_PROMPT + feedback, userContent, {
        temperature: attempt === 0 ? 0.3 : 0.2,
        responseSchema: RESUME_RESPONSE_SCHEMA,
      });
    } catch {
      break; // callLLMJson has already cycled through every configured model
    }
    const result = normalizeResume(raw, { source, contact, years });
    if (!best || resumeScore(result.issues) < resumeScore(best.issues)) best = result;
    if (!needsRetry(result.issues)) break;
    feedback = buildRetryFeedback(result.issues);
  }

  if (!best || !isRenderable(best.data)) return null;

  // Counts only — never log profile content.
  console.log(
    `[resume] attempts=${attempts} hard=${best.issues.filter((i) => i.severity === 'hard').length} soft=${best.issues.filter((i) => i.severity === 'soft').length}`
  );
  return { result: best, attempts };
}
