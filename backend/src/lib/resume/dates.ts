const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const MONTH_LABEL = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const PRESENT = /^(present|current|now|till date|to date|ongoing|today)$/i;

export interface ParsedDate {
  year: number;
  /** 0-11, or null when only a year is known */
  month: number | null;
}

export function parseDate(input: unknown): ParsedDate | 'present' | null {
  if (typeof input !== 'string') return null;
  const s = input.trim();
  if (!s) return null;
  if (PRESENT.test(s)) return 'present';
  let m = s.match(/^([A-Za-z]{3,9})\.?,?\s+(\d{4})$/);
  if (m) {
    const idx = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase());
    if (idx >= 0) return { year: +m[2], month: idx };
  }
  m = s.match(/^(\d{4})[-/](\d{1,2})$/) || null;
  if (m && +m[2] >= 1 && +m[2] <= 12) return { year: +m[1], month: +m[2] - 1 };
  m = s.match(/^(\d{1,2})[-/](\d{4})$/);
  if (m && +m[1] >= 1 && +m[1] <= 12) return { year: +m[2], month: +m[1] - 1 };
  m = s.match(/^(\d{4})$/);
  if (m && +m[1] >= 1950 && +m[1] <= 2100) return { year: +m[1], month: null };
  return null;
}

/** Canonical display form: "Jan 2022", "2022" or "Present". Returns '' when unparseable. */
export function formatDate(input: unknown): string {
  const p = parseDate(input);
  if (p === null) return '';
  if (p === 'present') return 'Present';
  return p.month === null ? String(p.year) : `${MONTH_LABEL[p.month]} ${p.year}`;
}

const RANGE =
  /\b((?:[A-Za-z]{3,9}\.?\s+)?\d{4})\s*(?:-|\u2013|\u2014|to)\s*((?:[A-Za-z]{3,9}\.?\s+)?\d{4}|present|current|now)\b/gi;

/**
 * Deterministic estimate of total professional experience (in years) from date ranges
 * found anywhere in the raw scraped experience text. Overlapping ranges are merged so
 * concurrent roles are not double-counted. Returns 0 if nothing parseable.
 */
export function estimateExperienceYears(rawExperience: string, now: Date = new Date()): number {
  const nowIdx = now.getUTCFullYear() * 12 + now.getUTCMonth();
  const spans: Array<[number, number]> = [];
  for (const m of rawExperience.matchAll(RANGE)) {
    const a = parseDate(m[1]);
    const b = parseDate(m[2]);
    if (!a || a === 'present') continue;
    if (!b) continue;
    const start = a.year * 12 + (a.month ?? 0);
    const end = b === 'present' ? nowIdx : b.year * 12 + (b.month ?? 11);
    if (end >= start && start > 1950 * 12 && end <= nowIdx + 1) spans.push([start, end + 1]);
  }
  if (!spans.length) return 0;
  spans.sort((x, y) => x[0] - y[0]);
  let months = 0;
  let [cs, ce] = spans[0];
  for (const [s, e] of spans.slice(1)) {
    if (s <= ce) ce = Math.max(ce, e);
    else {
      months += ce - cs;
      [cs, ce] = [s, e];
    }
  }
  months += ce - cs;
  return Math.round((months / 12) * 10) / 10;
}

export function monthYearLabel(now: Date): string {
  return `${MONTH_LABEL[now.getUTCMonth()]} ${now.getUTCFullYear()}`;
}
