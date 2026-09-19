/**
 * Text hygiene for resume content. Two separate jobs:
 *  - cleanText:  content-level cleanup (emoji, markdown, bullets, odd whitespace).
 *  - toRenderable: glyph-level safety — guarantees the PDF renderer can never throw
 *    on a character the embedded font does not have.
 */

const INVISIBLE = /[\u200B-\u200D\u2060\uFEFF\u00AD\u200E\u200F\u202A-\u202E]/g;
const CONTROL = /[\u0000-\u0008\u000B-\u001F\u007F-\u009F]/g;
const ODD_SPACES = /[\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\t]/g;
const EMOJI =
  /[\p{Extended_Pictographic}\u{FE0E}\u{FE0F}\u{20E3}\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}]/gu;
const LEADING_BULLET = /^[\s\u2022\u00B7\u25AA\u25CF\u25E6\u25A0\u2043\-*\u2013\u2014>]+\s*/;

export function cleanText(input: unknown, maxLen = 600): string {
  if (typeof input !== 'string') return '';
  let s = input.normalize('NFC');
  s = s.replace(CONTROL, ' ').replace(ODD_SPACES, ' ').replace(INVISIBLE, '');
  s = s.replace(EMOJI, '');
  // markdown / formatting residue
  s = s.replace(/\*\*|__|`+/g, '').replace(/^#{1,6}\s+/, '');
  s = s.replace(LEADING_BULLET, '');
  s = s.replace(/\s+/g, ' ').trim();
  if (s.length > maxLen) s = s.slice(0, maxLen).replace(/\s+\S*$/, '').trim();
  return s;
}

/** Typographic characters that have a plain ASCII fallback if a font lacks them. */
const FALLBACKS: Record<string, string> = {
  '\u2018': "'", '\u2019': "'", '\u201A': ',', '\u201C': '"', '\u201D': '"', '\u201E': '"',
  '\u2010': '-', '\u2011': '-', '\u2012': '-', '\u2013': '-', '\u2014': '-', '\u2015': '-',
  '\u2022': '-', '\u2026': '...', '\u2192': '->', '\u2190': '<-', '\u2264': '<=', '\u2265': '>=',
  '\u2260': '!=', '\u2248': '~', '\u2212': '-', '\u2122': 'TM', '\u20B9': 'Rs.',
};

/**
 * Returns text made only of glyphs present in `charset` (code points of the embedded
 * font). Known typographic characters are transliterated; everything else is dropped.
 */
export function toRenderable(text: string, charset: ReadonlySet<number>): string {
  let out = '';
  for (const ch of text) {
    const cp = ch.codePointAt(0)!;
    if (cp === 0x20 || charset.has(cp)) {
      out += ch;
      continue;
    }
    const fb = FALLBACKS[ch];
    if (fb !== undefined) {
      for (const f of fb) if (charset.has(f.codePointAt(0)!)) out += f;
    }
  }
  return out.replace(/\s+/g, ' ').trim();
}

/** Removes dangling separators left behind after unsupported characters were stripped ("A | B | " → "A | B"). */
export function tidySeparators(s: string): string {
  let t = s;
  if (t.includes('|')) {
    t = t
      .split('|')
      .map((p) => p.trim())
      .filter(Boolean)
      .join(' | ');
  }
  return t.replace(/^[\s\-\u2013\u2014\u00B7,;:]+|[\s\-\u2013\u2014\u00B7,;:]+$/g, '').trim();
}

/** Lower-case letters/digits only — used for tolerant "is this in the source?" checks. */
export function alnum(s: string): string {
  return s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '');
}

export function wordTokens(s: string): string[] {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

export function wordCount(s: string): number {
  return s.split(/\s+/).filter(Boolean).length;
}

/** Drop LinkedIn UI noise and consecutive duplicate lines from a scraped block. */
export function cleanRawBlock(raw: unknown, maxLen: number): string {
  if (typeof raw !== 'string') return '';
  const noise =
    /^(\u2026\s*)?(see|show)\s+(more|less|all)\b.*$|^(endorsed by|endorsements?|followers?|connections?)\b.*$|^\d+\s+(endorsements?|connections?|followers?)$/i;
  const lines: string[] = [];
  for (const line of raw.split(/\r?\n/)) {
    const l = cleanText(line, 1200);
    if (!l || noise.test(l)) continue;
    if (lines.length && lines[lines.length - 1] === l) continue;
    lines.push(l);
  }
  let out = lines.join('\n');
  if (out.length > maxLen) out = out.slice(0, maxLen).replace(/\n[^\n]*$/, '');
  return out;
}
