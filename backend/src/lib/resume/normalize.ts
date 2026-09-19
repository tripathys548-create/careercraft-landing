/**
 * Turns whatever the LLM returned into a strict, clean ResumeData — and refuses to let
 * invented facts through. The resume is a one-time paid deliverable, so the rule is:
 * anything not evidenced by the customer's own profile is removed, never "trusted".
 *
 * Severity model:
 *  - hard: a fabricated or unusable fact. The offending item is REMOVED from the output
 *          and the issue is reported (so the caller can ask the model to try again).
 *  - soft: a style problem (clichés, weak openers, over-long bullets). Kept, but reported.
 */
import type {
  Issue,
  ResumeContact,
  ResumeData,
  ResumeEducation,
  ResumeRole,
  ResumeSkillGroup,
  SourceProfile,
} from './types';
import { alnum, cleanText, wordCount, wordTokens } from './text';
import { formatDate } from './dates';

// ─────────────────────────────────────────────────────────────────────────────
// Source index: everything we can check the model's output against
// ─────────────────────────────────────────────────────────────────────────────

export interface SourceIndex {
  alnum: string;
  tokens: Set<string>;
  numbers: Set<string>;
  /** Numbers the customer themselves attached to "years" ("10+ years of experience"). */
  yearClaims: Set<string>;
}

const YEARS_RE = /(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\b/gi;

const NUMBER_WORDS: Record<string, string> = {
  one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8',
  nine: '9', ten: '10', eleven: '11', twelve: '12', fifteen: '15', twenty: '20',
};

const NUM_RE = /\d[\d,]*(?:\.\d+)?/g;

export function numbersIn(s: string): string[] {
  const out: string[] = [];
  for (const m of s.matchAll(NUM_RE)) {
    const n = parseFloat(m[0].replace(/,/g, ''));
    if (Number.isFinite(n)) out.push(String(n));
  }
  return out;
}

export function buildSourceIndex(src: SourceProfile): SourceIndex {
  const all = [src.name, src.headline, src.about, src.experience, src.education, src.skills, src.raw].join('\n');
  const tokens = new Set(wordTokens(all));
  const numbers = new Set(numbersIn(all));
  for (const t of tokens) if (NUMBER_WORDS[t]) numbers.add(NUMBER_WORDS[t]);
  const yearClaims = new Set<string>();
  for (const m of all.matchAll(YEARS_RE)) yearClaims.add(String(parseFloat(m[1])));
  return { alnum: alnum(all), tokens, numbers, yearClaims };
}

// Canonical-spelling aliases: the prompt asks the model to normalise "Postgres" → "PostgreSQL",
// so the guard must not treat that as an invented skill.
const ALIAS_GROUPS: string[][] = [
  ['postgresql', 'postgres', 'psql'],
  ['javascript', 'js', 'es6'],
  ['typescript', 'ts'],
  ['nodejs', 'node'],
  ['reactjs', 'react'],
  ['nextjs', 'next'],
  ['vuejs', 'vue'],
  ['expressjs', 'express'],
  ['mongodb', 'mongo'],
  ['kubernetes', 'k8s'],
  ['amazonwebservices', 'aws'],
  ['googlecloudplatform', 'gcp', 'googlecloud'],
  ['microsoftexcel', 'excel', 'msexcel'],
  ['microsoftoffice', 'msoffice', 'office'],
  ['sqlserver', 'mssql', 'microsoftsqlserver'],
  ['machinelearning', 'ml'],
  ['naturallanguageprocessing', 'nlp'],
  ['artificialintelligence', 'ai'],
  ['searchengineoptimization', 'seo'],
  ['html', 'html5'],
  ['css', 'css3'],
  ['cicd', 'cicdpipelines'],
  ['restapis', 'restapi', 'rest', 'restful', 'restfulapis'],
  ['golang', 'go'],
];

const STOP = new Set([
  'and', 'the', 'of', 'for', 'at', 'in', 'on', 'with', 'to', 'a', 'an', 'pvt', 'ltd', 'llc',
  'inc', 'limited', 'private', 'llp',
]);

function tokenInSource(t: string, idx: SourceIndex): boolean {
  if (idx.tokens.has(t)) return true;
  if (t.endsWith('s') && idx.tokens.has(t.slice(0, -1))) return true;
  if (idx.tokens.has(t + 's')) return true;
  const group = ALIAS_GROUPS.find((g) => g.includes(t));
  return !!group && group.some((a) => idx.tokens.has(a));
}

/** Phrase-level check for titles, companies, schools, locations, education detail. */
export function phraseSupported(phrase: string, idx: SourceIndex): boolean {
  const norm = alnum(phrase);
  if (!norm) return false;
  if (norm.length >= 4 && idx.alnum.includes(norm)) return true;
  const toks = wordTokens(phrase).filter((t) => t.length >= 2 && !STOP.has(t));
  if (!toks.length) return false;
  const hit = toks.filter((t) => tokenInSource(t, idx)).length;
  return hit / toks.length >= 0.6;
}

// Words that change a job's rank. The fuzzy phrase check would let "Senior Software Engineer" through
// on "Software Engineer" (2 of 3 words match), so rank words must appear in the profile themselves.
const RANK_ALIASES: string[][] = [
  ['senior', 'sr'],
  ['junior', 'jr'],
  ['manager', 'mgr'],
  ['lead', 'leader', 'tech lead'],
  ['principal'], ['staff'], ['head'], ['director'], ['vp', 'vice'], ['president'], ['chief'],
  ['cto'], ['ceo'], ['cfo'], ['coo'], ['founder', 'cofounder'], ['architect'], ['intern', 'internship', 'trainee'],
  ['executive'], ['officer'], ['consultant'], ['specialist'],
];

export function titleSupported(title: string, idx: SourceIndex): boolean {
  if (!phraseSupported(title, idx)) return false;
  const toks = new Set(wordTokens(title));
  for (const group of RANK_ALIASES) {
    if (group.some((a) => toks.has(a)) && !group.some((a) => idx.tokens.has(a))) return false;
  }
  return true;
}

/** Skill-level check: strict for short/single-word skills so "Java" never rides on "JavaScript". */
export function skillSupported(skill: string, idx: SourceIndex): boolean {
  const variants = new Set<string>([skill]);
  const paren = skill.match(/^(.*?)\s*\((.*?)\)\s*$/);
  if (paren) {
    variants.add(paren[1]);
    variants.add(paren[2]);
  }
  for (const v of variants) {
    const norm = alnum(v);
    if (!norm) continue;
    const toks = wordTokens(v);
    const singleWord = toks.length <= 1;
    const group = ALIAS_GROUPS.find((g) => g.includes(norm)) ?? [];
    const forms = [norm, ...group];
    for (const f of forms) {
      if (idx.tokens.has(f)) return true;
      if (f.endsWith('s') && idx.tokens.has(f.slice(0, -1))) return true;
      // dotted / multi-part skills ("Node.js", "CI/CD"): allow whole-string match in the source
      if (f.length >= 5 && !singleWord && idx.alnum.includes(f)) return true;
      if (f.length >= 5 && singleWord && idx.alnum.includes(f) && /[.\-/#+]/.test(v)) return true;
    }
    if (!singleWord && toks.every((t) => tokenInSource(t, idx))) return true;
  }
  return false;
}

// ─────────────────────────────────────────────────────────────────────────────
// Style rules
// ─────────────────────────────────────────────────────────────────────────────

const CLICHE =
  /\b(passionate|hard[- ]?working|results?[- ]driven|self[- ]motivated|self[- ]starter|team player|go[- ]getter|dynamic professional|synerg\w+|think outside the box|proven track record|highly motivated|seeking|looking (for|to)|detail[- ]oriented)\b/i;
const WEAK_OPENER =
  /^(responsible for|worked on|worked with|helped|assisted|assist|involved in|duties included|tasked with|in charge of|handled)\b/i;
const FIRST_PERSON = /\b(I|my|me|myself|we|our)\b/i;

const ROLE_BULLET_CAPS = [5, 5, 4, 4, 3, 3, 3, 3];
const MAX_ROLES = 8;
const MAX_EDU = 4;
const MAX_SKILL_GROUPS = 6;
const MAX_SKILLS = 24;

// ─────────────────────────────────────────────────────────────────────────────
// Number rules
// ─────────────────────────────────────────────────────────────────────────────

interface NumberContext {
  idx: SourceIndex;
  /** Deterministic experience estimate; enables "4+ years" claims in the summary only. */
  years: number;
  allowYearsClaim: boolean;
}

function numbersOk(text: string, ctx: NumberContext): string[] {
  const bad: string[] = [];
  // Numbers attached to "years" are judged as experience claims — a stray "9" elsewhere in the
  // profile (e.g. "9 mos") must not bless "9+ years".
  const claimed = new Set<string>();
  for (const m of text.matchAll(YEARS_RE)) claimed.add(String(parseFloat(m[1])));
  for (const n of numbersIn(text)) {
    if (claimed.has(n)) {
      const derived = ctx.allowYearsClaim && ctx.years >= 1 && +n <= Math.round(ctx.years);
      if (derived || ctx.idx.yearClaims.has(n)) continue;
      bad.push(n);
      continue;
    }
    if (!ctx.idx.numbers.has(n)) bad.push(n);
  }
  return bad;
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact
// ─────────────────────────────────────────────────────────────────────────────

export function sanitizeContact(
  input: { email?: unknown; phone?: unknown; location?: unknown; website?: unknown },
  linkedinId: string
): ResumeContact {
  const c: ResumeContact = {};
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  if (email.length <= 100 && /^[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}$/.test(email)) c.email = email;
  const phone = typeof input.phone === 'string' ? input.phone.trim() : '';
  if (/^[+\d][\d\s().-]{6,20}$/.test(phone)) c.phone = phone;
  const location = cleanText(input.location, 60);
  if (location && /^[\p{L}\p{M}\s,.'-]{2,60}$/u.test(location)) c.location = location;
  const web = typeof input.website === 'string' ? input.website.trim().replace(/^https?:\/\//i, '').replace(/\/$/, '') : '';
  if (web.length <= 80 && /^[\w.-]+\.[a-z]{2,}(\/[\w\-./%?=&#+]*)?$/i.test(web)) c.website = web;
  if (/^[A-Za-z0-9_%.-]{2,100}$/.test(linkedinId ?? '')) c.linkedin = `linkedin.com/in/${linkedinId}`;
  return c;
}

/**
 * Pulls an email / phone out of text the customer supplied themselves (pasted resume, About section).
 * Deliberately conservative: an unrecognised number is better omitted than wrong.
 */
export function contactFromText(text: string): { email?: string; phone?: string } {
  const out: { email?: string; phone?: string } = {};
  const email = text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/);
  if (email) out.email = email[0];
  const phone =
    text.match(/(?:\+\d{1,3}[\s-]?)?[6-9]\d{4}[\s-]?\d{5}(?!\d)/) || // Indian mobile
    text.match(/\+\d{1,3}[\s-]?\(?\d{2,4}\)?[\s-]?\d{3,4}[\s-]?\d{3,4}(?!\d)/); // other international
  if (phone) out.phone = phone[0].trim();
  return out;
}

/** "priya-nayak-1a2b3c4d5" → "Priya Nayak" — only used if the scraped name is unusable. */
export function nameFromLinkedinId(id: string): string {
  const parts = id
    .replace(/%[0-9a-f]{2}/gi, ' ')
    .split(/[-_.\s]+/)
    .filter((p) => /^[A-Za-z]{2,}$/.test(p) && !/^[a-f0-9]{8,}$/i.test(p));
  return parts
    .slice(0, 3)
    .map((p) => p[0].toUpperCase() + p.slice(1).toLowerCase())
    .join(' ');
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry
// ─────────────────────────────────────────────────────────────────────────────

export interface NormalizeContext {
  source: SourceProfile;
  contact: ResumeContact;
  years: number;
}

export interface NormalizeResult {
  data: ResumeData;
  issues: Issue[];
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function asObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

function firstLetterUpper(s: string): string {
  return s ? s[0].toUpperCase() + s.slice(1) : s;
}

function cleanDate(value: unknown, idx: SourceIndex, path: string, issues: Issue[]): string {
  const formatted = formatDate(value);
  if (!formatted) return '';
  if (formatted === 'Present') return formatted;
  const year = formatted.match(/\d{4}/)?.[0];
  if (year && !idx.numbers.has(year)) {
    issues.push({ severity: 'hard', path, message: `date "${formatted}" is not in the profile — removed` });
    return '';
  }
  return formatted;
}

export function normalizeResume(raw: unknown, ctx: NormalizeContext): NormalizeResult {
  const issues: Issue[] = [];
  const obj = asObject(raw) ?? {};
  const idx = buildSourceIndex(ctx.source);
  const numCtxBullet: NumberContext = { idx, years: ctx.years, allowYearsClaim: false };
  const numCtxSummary: NumberContext = { idx, years: ctx.years, allowYearsClaim: true };

  // ── experience ────────────────────────────────────────────────────────────
  const experience: ResumeRole[] = [];
  const seenRoles = new Set<string>();
  asArray(obj.experience).forEach((r, i) => {
    const path = `experience[${i}]`;
    const o = asObject(r);
    if (!o) {
      issues.push({ severity: 'soft', path, message: 'experience entries must be objects with title/company/bullets' });
      return;
    }
    const title = cleanText(o.title, 90);
    const company = cleanText(o.company, 90);
    if (!title || !company) {
      issues.push({ severity: 'hard', path, message: 'role is missing a title or company — removed' });
      return;
    }
    if (!titleSupported(title, idx)) {
      issues.push({ severity: 'hard', path, message: `job title "${title}" is not in the profile — role removed` });
      return;
    }
    if (!phraseSupported(company, idx)) {
      issues.push({ severity: 'hard', path, message: `company "${company}" is not in the profile — role removed` });
      return;
    }
    const start = cleanDate(o.start, idx, `${path}.start`, issues);
    const end = cleanDate(o.end, idx, `${path}.end`, issues);
    const key = alnum(`${title}|${company}|${start}`);
    if (seenRoles.has(key)) return;
    seenRoles.add(key);

    let location = cleanText(o.location, 60);
    if (location && !phraseSupported(location, idx)) location = '';

    const cap = ROLE_BULLET_CAPS[Math.min(experience.length, ROLE_BULLET_CAPS.length - 1)];
    const rawBullets = Array.isArray(o.bullets)
      ? o.bullets
      : typeof o.bullets === 'string'
        ? o.bullets.split(/\n+/)
        : [];
    const bullets: string[] = [];
    const seenBullets = new Set<string>();
    rawBullets.forEach((b, j) => {
      const bpath = `${path}.bullets[${j}]`;
      let t = cleanText(b, 420).replace(/[.;,]+$/, '').trim();
      if (wordCount(t) < 3) return;
      t = firstLetterUpper(t);
      const bad = numbersOk(t, numCtxBullet);
      if (bad.length) {
        issues.push({
          severity: 'hard',
          path: bpath,
          message: `contains number(s) ${bad.join(', ')} that are not in the profile — bullet removed. Never add or compute metrics.`,
        });
        return;
      }
      const k = alnum(t);
      if (seenBullets.has(k)) return;
      seenBullets.add(k);
      if (WEAK_OPENER.test(t)) issues.push({ severity: 'soft', path: bpath, message: `weak opener "${t.split(' ').slice(0, 2).join(' ')}" — start with a strong action verb` });
      if (CLICHE.test(t)) issues.push({ severity: 'soft', path: bpath, message: 'contains a resume cliché' });
      if (FIRST_PERSON.test(t)) issues.push({ severity: 'soft', path: bpath, message: 'uses first person — remove it' });
      if (wordCount(t) > 34) issues.push({ severity: 'soft', path: bpath, message: 'bullet is longer than ~30 words — tighten it' });
      bullets.push(t);
    });
    if (bullets.length > cap) bullets.length = cap;

    experience.push({ title, company, location: location || undefined, start: start || undefined, end: end || undefined, bullets });
  });
  if (experience.length > MAX_ROLES) experience.length = MAX_ROLES;

  // repeated opening verbs inside one role
  experience.forEach((role, i) => {
    const seen = new Map<string, number>();
    for (const b of role.bullets) {
      const verb = b.split(' ')[0].toLowerCase();
      seen.set(verb, (seen.get(verb) ?? 0) + 1);
    }
    for (const [verb, n] of seen) {
      if (n >= 2) issues.push({ severity: 'soft', path: `experience[${i}]`, message: `several bullets start with "${verb}" — vary the opening verbs` });
    }
  });

  // ── education ─────────────────────────────────────────────────────────────
  const education: ResumeEducation[] = [];
  asArray(obj.education).forEach((e, i) => {
    const path = `education[${i}]`;
    const o = asObject(e);
    if (!o) return;
    const school = cleanText(o.school, 110);
    const degree = cleanText(o.degree, 110);
    if (!school || !degree) {
      issues.push({ severity: 'hard', path, message: 'education entry is missing degree or school — removed' });
      return;
    }
    if (!phraseSupported(school, idx)) {
      issues.push({ severity: 'hard', path, message: `school "${school}" is not in the profile — removed` });
      return;
    }
    if (!phraseSupported(degree, idx)) {
      issues.push({ severity: 'soft', path, message: `degree "${degree}" may not match the profile wording` });
    }
    let detail = cleanText(o.detail, 140);
    if (detail) {
      if (numbersOk(detail, numCtxBullet).length || !phraseSupported(detail, idx)) {
        issues.push({ severity: 'hard', path: `${path}.detail`, message: 'detail is not supported by the profile — removed' });
        detail = '';
      }
    }
    education.push({
      degree,
      school,
      start: cleanDate(o.start, idx, `${path}.start`, issues) || undefined,
      end: cleanDate(o.end, idx, `${path}.end`, issues) || undefined,
      detail: detail || undefined,
    });
  });
  if (education.length > MAX_EDU) education.length = MAX_EDU;

  // ── skills ────────────────────────────────────────────────────────────────
  let rawGroups = asArray(obj.skills);
  if (rawGroups.length && rawGroups.every((g) => typeof g === 'string')) {
    rawGroups = [{ label: 'Skills', items: rawGroups }];
  }
  const skills: ResumeSkillGroup[] = [];
  const seenSkills = new Set<string>();
  let skillTotal = 0;
  const dropped: string[] = [];
  for (const g of rawGroups) {
    const o = asObject(g);
    if (!o) continue;
    const label = cleanText(o.label, 32) || 'Skills';
    const items: string[] = [];
    for (const it of asArray(o.items)) {
      const s = cleanText(it, 40).replace(/[.;,]+$/, '');
      if (!s) continue;
      const k = alnum(s);
      if (!k || seenSkills.has(k)) continue;
      if (!skillSupported(s, idx)) {
        dropped.push(s);
        continue;
      }
      if (skillTotal >= MAX_SKILLS) continue;
      seenSkills.add(k);
      items.push(s);
      skillTotal++;
    }
    if (items.length) skills.push({ label, items });
  }
  if (skills.length > MAX_SKILL_GROUPS) skills.length = MAX_SKILL_GROUPS;
  if (dropped.length) {
    issues.push({
      severity: 'hard',
      path: 'skills',
      message: `these skills are not in the profile and were removed: ${dropped.slice(0, 8).join(', ')}`,
    });
  }

  // ── summary ───────────────────────────────────────────────────────────────
  let summary = cleanText(obj.summary, 800);
  if (summary) {
    const sentences = summary.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [];
    const keep = sentences.filter((s) => numbersOk(s, numCtxSummary).length === 0);
    if (keep.length < sentences.length) {
      issues.push({
        severity: 'hard',
        path: 'summary',
        message:
          'a summary sentence contained numbers not in the profile — removed. Only state years of experience using the provided computed figure.',
      });
    }
    const trimmed: string[] = [];
    let words = 0;
    for (const s of keep) {
      if (words + wordCount(s) > 80 && trimmed.length) break;
      trimmed.push(s);
      words += wordCount(s);
    }
    summary = trimmed.join(' ');
    if (CLICHE.test(summary)) issues.push({ severity: 'soft', path: 'summary', message: 'summary contains clichés (passionate, hardworking, seeking, …) — rewrite with concrete facts' });
    if (FIRST_PERSON.test(summary)) issues.push({ severity: 'soft', path: 'summary', message: 'summary uses first person — remove it' });
  }
  if (!summary) issues.push({ severity: 'soft', path: 'summary', message: 'summary is missing or was removed — write 2–3 factual sentences' });

  // ── headline / name ───────────────────────────────────────────────────────
  const modelName = cleanText(obj.name, 80);
  const name =
    cleanText(ctx.source.name, 80) ||
    (modelName && phraseSupported(modelName, idx) ? modelName : '') ||
    nameFromLinkedinId(ctx.source.linkedinId) ||
    'Your Name';
  const headline = pickHeadline(obj.headline, ctx.source.headline, experience, idx, issues);

  return {
    data: { name, headline, contact: ctx.contact, summary, experience, education, skills },
    issues,
  };
}

function pickHeadline(
  fromModel: unknown,
  original: string,
  roles: ResumeRole[],
  idx: SourceIndex,
  issues: Issue[]
): string {
  const candidate = cleanText(fromModel, 140);
  if (candidate) {
    const words = wordTokens(candidate).filter((t) => t.length >= 4 && /^[a-z]+$/.test(t) && !STOP.has(t));
    if (words.every((t) => tokenInSource(t, idx))) return candidate;
    issues.push({ severity: 'soft', path: 'headline', message: 'headline used words that are not in the profile — original headline used instead' });
  }
  const orig = cleanText(original, 140);
  return orig || roles[0]?.title || '';
}

// ─────────────────────────────────────────────────────────────────────────────
// Retry helpers
// ─────────────────────────────────────────────────────────────────────────────

export function resumeScore(issues: Issue[]): number {
  return issues.reduce((n, i) => n + (i.severity === 'hard' ? 10 : 1), 0);
}

export function needsRetry(issues: Issue[]): boolean {
  const hard = issues.filter((i) => i.severity === 'hard').length;
  const soft = issues.length - hard;
  return hard > 0 || soft >= 2;
}

export function isRenderable(data: ResumeData): boolean {
  return data.experience.length > 0 || data.education.length > 0 || data.skills.length > 0;
}

export function buildRetryFeedback(issues: Issue[]): string {
  const lines = issues.slice(0, 14).map((i) => `- ${i.path}: ${i.message}`);
  return [
    '',
    'CORRECTION REQUIRED. Your previous answer was checked against the profile and had these problems:',
    ...lines,
    'Return the complete corrected JSON. Fix every problem above, and do not introduce any new number, employer, school, title or skill that is not in the profile.',
  ].join('\n');
}
