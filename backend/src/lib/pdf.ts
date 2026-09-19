/**
 * Resume PDF renderer.
 *
 * Architecture
 *  1. prepare():  sanitise every string against the glyphs of the embedded fonts (cannot throw on emoji etc.)
 *  2. layout():   pure measurement pass → a display list of text/rule ops + page count. No drawing yet, so
 *                 the page-fit search below can try many scales cheaply.
 *  3. choose():   page-fit search (1 page scaled up/down, or a well-filled 2 pages; trims low-priority
 *                 bullets only to avoid an orphaned last page).
 *  4. draw():     one real render of the winning layout.
 *
 * ATS safety: single column, real text only, standard section headings, "•" bullets as text,
 * contact details in the page body, embedded fonts with a ToUnicode map (clean text extraction).
 */
import { PDFArray, PDFDocument, PDFFont, PDFName, PDFPage, PDFString, rgb, RGB } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import type { ResumeData, TemplateName, PageSize } from './resume/types';
import { FAMILY_FACES, fontBytes, type FontFamily } from './resume/fonts';
import { tidySeparators, toRenderable } from './resume/text';

export type { ResumeData, TemplateName, PageSize } from './resume/types';

// ─────────────────────────────────────────────────────────────────────────────
// Themes
// ─────────────────────────────────────────────────────────────────────────────

type SectionKey = 'summary' | 'skills' | 'experience' | 'education';

interface Theme {
  family: FontFamily;
  accent: RGB;
  ink: RGB;
  muted: RGB;
  rule: RGB;
  body: number;
  small: number;
  name: number;
  headline: number;
  heading: number;
  entryTitle: number;
  lh: number;
  marginX: number;
  marginTop: number;
  marginBottom: number;
  sectionGap: number;
  entryGap: number;
  bulletGap: number;
  align: 'left' | 'center';
  headingStyle: 'accent' | 'classic';
  order: SectionKey[];
  maxScale: number;
  bulletIndent: number;
}

const THEMES: Record<TemplateName, Theme> = {
  // Modern: clean sans-serif, sapphire accent, skills before experience (fast keyword scan).
  modern: {
    family: 'sans',
    accent: rgb(0.078, 0.278, 0.58),
    ink: rgb(0.09, 0.1, 0.13),
    muted: rgb(0.36, 0.4, 0.46),
    rule: rgb(0.78, 0.83, 0.9),
    body: 9.8,
    small: 9,
    name: 26,
    headline: 11,
    heading: 9.5,
    entryTitle: 10.4,
    lh: 1.38,
    marginX: 50,
    marginTop: 46,
    marginBottom: 44,
    sectionGap: 15,
    entryGap: 8,
    bulletGap: 2.2,
    align: 'left',
    headingStyle: 'accent',
    order: ['summary', 'skills', 'experience', 'education'],
    maxScale: 1.1,
    bulletIndent: 12,
  },
  // Classic: serif, centred header, traditional order — banking, consulting, law, academia.
  classic: {
    family: 'serif',
    accent: rgb(0.52, 0.12, 0.18),
    ink: rgb(0.1, 0.1, 0.1),
    muted: rgb(0.33, 0.33, 0.33),
    rule: rgb(0.52, 0.12, 0.18),
    body: 10.3,
    small: 9.6,
    name: 24,
    headline: 11,
    heading: 10,
    entryTitle: 10.9,
    lh: 1.36,
    marginX: 54,
    marginTop: 50,
    marginBottom: 48,
    sectionGap: 15,
    entryGap: 8,
    bulletGap: 2.2,
    align: 'center',
    headingStyle: 'classic',
    order: ['summary', 'experience', 'education', 'skills'],
    maxScale: 1.08,
    bulletIndent: 13,
  },
  // Compact: denser, aims for one page.
  compact: {
    family: 'sans',
    accent: rgb(0.09, 0.38, 0.82),
    ink: rgb(0.09, 0.1, 0.13),
    muted: rgb(0.36, 0.4, 0.46),
    rule: rgb(0.82, 0.87, 0.94),
    body: 9.2,
    small: 8.6,
    name: 21,
    headline: 10,
    heading: 9,
    entryTitle: 9.8,
    lh: 1.32,
    marginX: 40,
    marginTop: 36,
    marginBottom: 34,
    sectionGap: 11,
    entryGap: 6,
    bulletGap: 1.6,
    align: 'left',
    headingStyle: 'accent',
    order: ['summary', 'skills', 'experience', 'education'],
    maxScale: 1.06,
    bulletIndent: 11,
  },
  // Executive: deep hunter emerald, experience-first order, distinguished leadership style.
  executive: {
    family: 'sans',
    accent: rgb(0.08, 0.36, 0.28),
    ink: rgb(0.08, 0.1, 0.12),
    muted: rgb(0.35, 0.39, 0.45),
    rule: rgb(0.8, 0.88, 0.84),
    body: 9.8,
    small: 9.0,
    name: 25,
    headline: 11.2,
    heading: 9.6,
    entryTitle: 10.5,
    lh: 1.38,
    marginX: 48,
    marginTop: 46,
    marginBottom: 44,
    sectionGap: 14,
    entryGap: 8,
    bulletGap: 2.2,
    align: 'left',
    headingStyle: 'accent',
    order: ['summary', 'experience', 'skills', 'education'],
    maxScale: 1.1,
    bulletIndent: 12,
  },
  // Finance: oxford navy serif, centered prestigious layout, banking & legal standards.
  finance: {
    family: 'serif',
    accent: rgb(0.06, 0.16, 0.34),
    ink: rgb(0.08, 0.08, 0.08),
    muted: rgb(0.3, 0.3, 0.3),
    rule: rgb(0.06, 0.16, 0.34),
    body: 10.1,
    small: 9.4,
    name: 24,
    headline: 10.8,
    heading: 10,
    entryTitle: 10.8,
    lh: 1.35,
    marginX: 52,
    marginTop: 48,
    marginBottom: 46,
    sectionGap: 14,
    entryGap: 8,
    bulletGap: 2.0,
    align: 'center',
    headingStyle: 'classic',
    order: ['summary', 'experience', 'education', 'skills'],
    maxScale: 1.08,
    bulletIndent: 13,
  },
  // Tech: electric indigo, prominent skills matrix, product & engineering focus.
  tech: {
    family: 'sans',
    accent: rgb(0.36, 0.25, 0.82),
    ink: rgb(0.07, 0.08, 0.12),
    muted: rgb(0.38, 0.42, 0.48),
    rule: rgb(0.86, 0.83, 0.95),
    body: 9.6,
    small: 8.8,
    name: 26,
    headline: 11,
    heading: 9.5,
    entryTitle: 10.4,
    lh: 1.36,
    marginX: 46,
    marginTop: 44,
    marginBottom: 42,
    sectionGap: 14,
    entryGap: 8,
    bulletGap: 2.2,
    align: 'left',
    headingStyle: 'accent',
    order: ['summary', 'skills', 'experience', 'education'],
    maxScale: 1.1,
    bulletIndent: 12,
  },
  // Minimal: refined charcoal monochrome, balanced generous spacing.
  minimal: {
    family: 'sans',
    accent: rgb(0.18, 0.2, 0.24),
    ink: rgb(0.1, 0.11, 0.14),
    muted: rgb(0.42, 0.45, 0.5),
    rule: rgb(0.88, 0.89, 0.92),
    body: 9.6,
    small: 8.9,
    name: 24,
    headline: 10.8,
    heading: 9.2,
    entryTitle: 10.2,
    lh: 1.4,
    marginX: 52,
    marginTop: 48,
    marginBottom: 46,
    sectionGap: 16,
    entryGap: 8.5,
    bulletGap: 2.4,
    align: 'left',
    headingStyle: 'accent',
    order: ['summary', 'experience', 'skills', 'education'],
    maxScale: 1.08,
    bulletIndent: 12,
  },
  // Nordic: scandinavian cool slate teal, modern editorial rhythm.
  nordic: {
    family: 'sans',
    accent: rgb(0.12, 0.45, 0.52),
    ink: rgb(0.08, 0.1, 0.13),
    muted: rgb(0.35, 0.4, 0.45),
    rule: rgb(0.8, 0.89, 0.91),
    body: 9.8,
    small: 9.0,
    name: 25,
    headline: 11,
    heading: 9.5,
    entryTitle: 10.5,
    lh: 1.38,
    marginX: 48,
    marginTop: 46,
    marginBottom: 44,
    sectionGap: 15,
    entryGap: 8,
    bulletGap: 2.2,
    align: 'left',
    headingStyle: 'accent',
    order: ['summary', 'skills', 'experience', 'education'],
    maxScale: 1.1,
    bulletIndent: 12,
  },
};

const PAGE_DIMENSIONS: Record<PageSize, [number, number]> = {
  a4: [595.28, 841.89],
  letter: [612, 792],
};

// ─────────────────────────────────────────────────────────────────────────────
// Measuring & wrapping
// ─────────────────────────────────────────────────────────────────────────────

/** Word-level width cache. pdf-lib applies no kerning/ligatures, so summing words is exact. */
class Measurer {
  private cache = new Map<PDFFont, Map<string, number>>();

  private unit(font: PDFFont, s: string): number {
    let m = this.cache.get(font);
    if (!m) this.cache.set(font, (m = new Map()));
    let w = m.get(s);
    if (w === undefined) m.set(s, (w = font.widthOfTextAtSize(s, 1000)));
    return w;
  }

  width(font: PDFFont, text: string, size: number): number {
    if (!text) return 0;
    const parts = text.split(' ');
    let w = 0;
    for (let i = 0; i < parts.length; i++) {
      if (parts[i]) w += this.unit(font, parts[i]);
      if (i < parts.length - 1) w += this.unit(font, ' ');
    }
    return (w * size) / 1000;
  }
}

function wrap(m: Measurer, text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const lines: string[] = [];
  let cur = '';
  const startWith = (w: string) => {
    // a single word wider than the line (URLs etc.) is hard-split by characters
    if (m.width(font, w, size) <= maxWidth) {
      cur = w;
      return;
    }
    let chunk = '';
    for (const ch of w) {
      if (m.width(font, chunk + ch, size) > maxWidth && chunk) {
        lines.push(chunk);
        chunk = ch;
      } else chunk += ch;
    }
    cur = chunk;
  };
  for (const word of words) {
    if (!cur) {
      startWith(word);
      continue;
    }
    const attempt = `${cur} ${word}`;
    if (m.width(font, attempt, size) > maxWidth) {
      lines.push(cur);
      cur = '';
      startWith(word);
    } else cur = attempt;
  }
  if (cur) lines.push(cur);
  return lines;
}

/** Back-compat export (the previous renderer exposed this helper). */
export function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  return wrap(new Measurer(), text, font, size, maxWidth);
}

// ─────────────────────────────────────────────────────────────────────────────
// Layout (measure-only)
// ─────────────────────────────────────────────────────────────────────────────

interface Fonts {
  regular: PDFFont;
  semibold: PDFFont;
  italic: PDFFont;
}

interface LinkRect {
  x1: number;
  x2: number;
  url: string;
}

type Op =
  | { t: 'text'; page: number; x: number; y: number; text: string; size: number; font: PDFFont; color: RGB; links?: LinkRect[] }
  | { t: 'rule'; page: number; x1: number; x2: number; y: number; w: number; color: RGB };

interface Layout {
  ops: Op[];
  pages: number;
  /** Fraction (0–1) of the last page's content area that is used. */
  lastFill: number;
  scale: number;
}

interface LayoutParams {
  scale: number;
  /** Max bullets for older roles (Infinity = no trimming). */
  bulletCap: number;
}

class Flow {
  ops: Op[] = [];
  page = 0;
  y: number;
  readonly top: number;
  readonly bottom: number;
  readonly left: number;
  readonly right: number;
  private atTop = true;

  constructor(
    readonly W: number,
    readonly H: number,
    readonly th: Theme
  ) {
    this.top = H - th.marginTop;
    this.bottom = th.marginBottom;
    this.left = th.marginX;
    this.right = W - th.marginX;
    this.y = this.top;
  }

  get contentW(): number {
    return this.right - this.left;
  }

  need(h: number): void {
    if (this.y - h < this.bottom) {
      this.page++;
      this.y = this.top;
      this.atTop = true;
    }
  }

  gap(h: number): void {
    if (this.atTop) return; // never start a page with blank space
    this.y -= h;
  }

  /** One text line whose line-box is `size * lh` tall; the baseline sits optically centred in it. */
  line(
    text: string,
    o: { x?: number; size: number; font: PDFFont; color: RGB; lh?: number; links?: LinkRect[] }
  ): void {
    const lineH = o.size * (o.lh ?? this.th.lh);
    this.need(lineH);
    const baseline = this.y - (lineH - o.size) / 2 - o.size * 0.8;
    this.ops.push({ t: 'text', page: this.page, x: o.x ?? this.left, y: baseline, text, size: o.size, font: o.font, color: o.color, links: o.links });
    this.y -= lineH;
    this.atTop = false;
  }

  /** Text placed on the line just drawn (right-aligned dates) or about to be drawn (bullets, labels). */
  overlay(text: string, o: { x: number; size: number; font: PDFFont; color: RGB; lineH: number; below?: boolean }): void {
    const top = o.below ? this.y : this.y + o.lineH;
    const baseline = top - (o.lineH - o.size) / 2 - o.size * 0.8;
    this.ops.push({ t: 'text', page: this.page, x: o.x, y: baseline, text, size: o.size, font: o.font, color: o.color });
  }

  rule(y: number, w: number, color: RGB, x1 = this.left, x2 = this.right): void {
    this.ops.push({ t: 'rule', page: this.page, x1, x2, y, w, color });
  }
}

function dateRange(start?: string, end?: string): string {
  if (start && end) return start === end ? start : `${start} – ${end}`;
  return start || end || '';
}

function layout(data: ResumeData, th: Theme, fonts: Fonts, m: Measurer, dims: [number, number], p: LayoutParams): Layout {
  const [W, H] = dims;
  const s = p.scale;
  const f = new Flow(W, H, th);
  const sz = (n: number) => n * s;
  const bodyS = sz(th.body);
  const smallS = sz(th.small);
  const center = th.align === 'center';
  const subColor = th.headingStyle === 'accent' ? th.accent : th.ink;

  // ── header ────────────────────────────────────────────────────────────────
  const nameSize = th.name * Math.min(Math.max(s, 0.92), 1.06);
  const nameText = center ? data.name.toUpperCase() : data.name;
  for (const l of wrap(m, nameText, fonts.semibold, nameSize, f.contentW)) {
    const x = center ? f.left + (f.contentW - m.width(fonts.semibold, l, nameSize)) / 2 : f.left;
    f.line(l, { x, size: nameSize, font: fonts.semibold, color: center ? th.accent : th.ink, lh: 1.16 });
  }
  if (data.headline) {
    f.y -= sz(2);
    const hs = sz(th.headline);
    const hFont = center ? fonts.italic : fonts.regular;
    for (const l of wrap(m, data.headline, hFont, hs, f.contentW)) {
      const x = center ? f.left + (f.contentW - m.width(hFont, l, hs)) / 2 : f.left;
      f.line(l, { x, size: hs, font: hFont, color: center ? th.muted : th.accent, lh: 1.32 });
    }
  }
  // contact line(s): items are joined with " · " and wrapped only at item boundaries
  const c = data.contact;
  const items: Array<{ text: string; url?: string }> = [];
  if (c.location) items.push({ text: c.location });
  if (c.phone) items.push({ text: c.phone, url: `tel:${c.phone.replace(/[^\d+]/g, '')}` });
  if (c.email) items.push({ text: c.email, url: `mailto:${c.email}` });
  if (c.linkedin) items.push({ text: c.linkedin, url: `https://${c.linkedin}` });
  if (c.website) items.push({ text: c.website, url: `https://${c.website}` });
  if (items.length) {
    f.y -= sz(2.5);
    const sep = ' · ';
    const rows: Array<typeof items> = [[]];
    for (const it of items) {
      const row = rows[rows.length - 1];
      const test = [...row, it].map((x) => x.text).join(sep);
      if (row.length && m.width(fonts.regular, test, smallS) > f.contentW) rows.push([it]);
      else row.push(it);
    }
    for (const row of rows) {
      const text = row.map((x) => x.text).join(sep);
      const total = m.width(fonts.regular, text, smallS);
      const x0 = center ? f.left + (f.contentW - total) / 2 : f.left;
      const links: LinkRect[] = [];
      let acc = '';
      row.forEach((it, i) => {
        const before = acc + (i ? sep : '');
        const x1 = x0 + m.width(fonts.regular, before, smallS);
        if (it.url) links.push({ x1, x2: x1 + m.width(fonts.regular, it.text, smallS), url: it.url });
        acc = before + it.text;
      });
      f.line(text, { x: x0, size: smallS, font: fonts.regular, color: th.muted, lh: 1.4, links });
    }
  }
  if (center) {
    f.y -= sz(6);
    f.rule(f.y, 1, th.accent);
    f.y -= sz(2);
  }

  // ── section helpers ───────────────────────────────────────────────────────
  const heading = (title: string, minBlock: number) => {
    const hs = sz(th.heading);
    f.gap(sz(th.sectionGap));
    f.need(hs * 1.25 + sz(9) + minBlock); // keep-with-next: heading never sits alone at a page bottom
    f.line(title.toUpperCase(), { size: hs, font: fonts.semibold, color: th.headingStyle === 'accent' ? th.accent : th.ink, lh: 1.25 });
    f.y += hs * 0.1;
    f.rule(f.y, th.headingStyle === 'accent' ? 0.9 : 0.6, th.headingStyle === 'accent' ? th.rule : th.ink);
    f.y -= sz(5.5);
  };

  const bulletBlock = (bullets: string[]) => {
    const indent = th.bulletIndent;
    const lineH = bodyS * th.lh;
    for (const b of bullets) {
      const lines = wrap(m, b, fonts.regular, bodyS, f.contentW - indent);
      f.need(lines.length * lineH); // a bullet is never split across pages
      f.overlay('•', { x: f.left + 1, size: bodyS, font: fonts.regular, color: th.accent, lineH, below: true });
      for (const l of lines) f.line(l, { x: f.left + indent, size: bodyS, font: fonts.regular, color: th.ink });
      f.y -= sz(th.bulletGap);
    }
  };

  /** Title (semibold) with right-aligned dates, then a sub-line (company / school). */
  const titleRow = (title: string, right: string, sub: string, firstBulletH: number) => {
    const ts = sz(th.entryTitle);
    const dateW = right ? m.width(fonts.regular, right, smallS) : 0;
    const tLines = wrap(m, title, fonts.semibold, ts, f.contentW - (dateW ? dateW + 14 : 0));
    const subLines = sub ? wrap(m, sub, fonts.regular, bodyS, f.contentW) : [];
    f.need(tLines.length * ts * 1.3 + subLines.length * bodyS * 1.3 + firstBulletH);
    tLines.forEach((l, i) => {
      f.line(l, { size: ts, font: fonts.semibold, color: th.ink, lh: 1.3 });
      if (i === 0 && right) {
        f.overlay(right, { x: f.right - dateW, size: smallS, font: fonts.regular, color: th.muted, lineH: ts * 1.3 });
      }
    });
    for (const l of subLines) f.line(l, { size: bodyS, font: fonts.regular, color: subColor, lh: 1.3 });
    f.y -= sz(1.8);
  };

  // ── sections ──────────────────────────────────────────────────────────────
  const lineH = bodyS * th.lh;
  const entryMin = sz(th.entryTitle) * 1.3 + bodyS * 1.3 + lineH;

  const sections: Record<SectionKey, () => void> = {
    summary: () => {
      if (!data.summary) return;
      heading('Professional Summary', lineH * 2);
      for (const l of wrap(m, data.summary, fonts.regular, bodyS, f.contentW)) {
        f.line(l, { size: bodyS, font: fonts.regular, color: th.ink, lh: th.lh + 0.02 });
      }
    },

    skills: () => {
      if (!data.skills.length) return;
      heading('Skills', lineH * 2);
      const labels = data.skills.map((g) => `${g.label}:`);
      const colW = Math.min(Math.max(...labels.map((l) => m.width(fonts.semibold, l, bodyS))) + 9, f.contentW * 0.36);
      data.skills.forEach((g, i) => {
        const lines = wrap(m, g.items.join(', '), fonts.regular, bodyS, f.contentW - colW);
        f.need(Math.min(lines.length, 2) * lineH);
        f.overlay(labels[i], { x: f.left, size: bodyS, font: fonts.semibold, color: th.ink, lineH, below: true });
        for (const l of lines) f.line(l, { x: f.left + colW, size: bodyS, font: fonts.regular, color: th.ink });
        f.y -= sz(1.6);
      });
    },

    experience: () => {
      if (!data.experience.length) return;
      heading('Work Experience', entryMin);
      data.experience.forEach((r, i) => {
        const limit = i < 2 ? Math.min(5, p.bulletCap + 1) : p.bulletCap;
        const bullets = r.bullets.slice(0, limit);
        const first = bullets.length ? wrap(m, bullets[0], fonts.regular, bodyS, f.contentW - th.bulletIndent).length * lineH : 0;
        titleRow(r.title, dateRange(r.start, r.end), [r.company, r.location].filter(Boolean).join(' · '), first);
        bulletBlock(bullets);
        if (i < data.experience.length - 1) f.y -= sz(th.entryGap);
      });
    },

    education: () => {
      if (!data.education.length) return;
      heading('Education', entryMin);
      data.education.forEach((e, i) => {
        titleRow(e.degree, dateRange(e.start, e.end), e.school, e.detail ? lineH : 0);
        if (e.detail) f.line(e.detail, { size: bodyS, font: fonts.italic, color: th.muted });
        if (i < data.education.length - 1) f.y -= sz(th.entryGap);
      });
    },
  };

  // Freshers (no experience listed) lead with education.
  const order: SectionKey[] = data.experience.length ? th.order : ['summary', 'education', 'skills'];
  for (const key of order) sections[key]();

  const usable = f.top - f.bottom;
  return { ops: f.ops, pages: f.page + 1, lastFill: Math.max(0, Math.min(1, (f.top - f.y) / usable)), scale: s };
}

// ─────────────────────────────────────────────────────────────────────────────
// Page-fit search
// ─────────────────────────────────────────────────────────────────────────────

function choose(data: ResumeData, th: Theme, fonts: Fonts, m: Measurer, dims: [number, number]): Layout {
  const run = (scale: number, bulletCap = Infinity) => layout(data, th, fonts, m, dims, { scale, bulletCap });
  const minScale = Math.max(0.88, 8.5 / th.body);

  // (a) One page at the largest comfortable scale (scales UP short resumes so they don't look empty).
  for (let s = th.maxScale; s >= minScale - 1e-9; s -= 0.02) {
    const L = run(Math.round(s * 100) / 100);
    if (L.pages === 1) return L;
  }

  // (b) Two well-filled pages at natural size.
  const natural = run(1);
  if (natural.pages === 2 && natural.lastFill >= 0.22) return natural;

  // (c) An orphaned second page: try trimming low-priority (older-role) bullets to reach one page.
  if (natural.pages === 2) {
    for (const cap of [4, 3]) {
      for (const s of [1, 0.96, 0.92, minScale]) {
        const L = run(s, cap);
        if (L.pages === 1) return L;
      }
    }
    return natural;
  }

  // (d) Long career: fit into two pages by trimming older roles progressively.
  for (const cap of [4, 3, 2, 1]) {
    const L = run(1, cap);
    if (L.pages <= 2) return L;
  }
  return run(minScale, 1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Preparation & drawing
// ─────────────────────────────────────────────────────────────────────────────

function prepare(data: ResumeData, charset: ReadonlySet<number>): ResumeData {
  const r = (s: string | undefined) => (s ? toRenderable(s, charset) : '');
  const opt = (s: string | undefined) => r(s) || undefined;
  return {
    name: r(data.name) || 'Your Name',
    headline: tidySeparators(r(data.headline)),
    contact: {
      location: opt(data.contact?.location),
      phone: opt(data.contact?.phone),
      email: opt(data.contact?.email),
      linkedin: opt(data.contact?.linkedin),
      website: opt(data.contact?.website),
    },
    summary: r(data.summary),
    experience: (data.experience ?? [])
      .map((x) => ({
        title: r(x.title),
        company: r(x.company),
        location: opt(x.location),
        start: opt(x.start),
        end: opt(x.end),
        bullets: (x.bullets ?? []).map(r).filter(Boolean),
      }))
      .filter((x) => x.title && x.company),
    education: (data.education ?? [])
      .map((x) => ({ degree: r(x.degree), school: r(x.school), start: opt(x.start), end: opt(x.end), detail: opt(x.detail) }))
      .filter((x) => x.degree && x.school),
    skills: (data.skills ?? [])
      .map((g) => ({ label: r(g.label) || 'Skills', items: (g.items ?? []).map(r).filter(Boolean) }))
      .filter((g) => g.items.length),
  };
}

function addLink(doc: PDFDocument, page: PDFPage, x1: number, y1: number, x2: number, y2: number, url: string): void {
  const annot = doc.context.register(
    doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: [x1, y1, x2, y2],
      Border: [0, 0, 0],
      A: { Type: 'Action', S: 'URI', URI: PDFString.of(url) },
    })
  );
  const annots = page.node.Annots();
  if (annots instanceof PDFArray) annots.push(annot);
  else page.node.set(PDFName.of('Annots'), doc.context.obj([annot]));
}

export interface RenderInfo {
  bytes: Uint8Array;
  pages: number;
  scale: number;
  lastFill: number;
}

export async function renderResumePdfWithInfo(data: ResumeData, template: TemplateName = 'modern'): Promise<RenderInfo> {
  const name = (data.template ?? template) as TemplateName;
  const th = THEMES[name] ?? THEMES.modern;
  const dims = PAGE_DIMENSIONS[data.pageSize ?? 'a4'] ?? PAGE_DIMENSIONS.a4;

  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  const faces = FAMILY_FACES[th.family];
  // Fonts are pre-subset at build time, so in-document subsetting is skipped (saves CPU on the Worker).
  const fonts: Fonts = {
    regular: await doc.embedFont(fontBytes(faces.regular), { subset: false }),
    semibold: await doc.embedFont(fontBytes(faces.semibold), { subset: false }),
    italic: await doc.embedFont(fontBytes(faces.italic), { subset: false }),
  };
  const sets = [fonts.regular, fonts.semibold, fonts.italic].map((ft) => new Set(ft.getCharacterSet()));
  const charset = new Set([...sets[0]].filter((cp) => sets[1].has(cp) && sets[2].has(cp)));

  const clean = prepare(data, charset);
  const m = new Measurer();
  const L = choose(clean, th, fonts, m, dims);

  const pages: PDFPage[] = [];
  for (let i = 0; i < L.pages; i++) pages.push(doc.addPage(dims));
  for (const op of L.ops) {
    const page = pages[op.page];
    if (op.t === 'rule') {
      page.drawLine({ start: { x: op.x1, y: op.y }, end: { x: op.x2, y: op.y }, thickness: op.w, color: op.color });
    } else {
      page.drawText(op.text, { x: op.x, y: op.y, size: op.size, font: op.font, color: op.color });
      for (const l of op.links ?? []) addLink(doc, page, l.x1, op.y - op.size * 0.25, l.x2, op.y + op.size * 0.95, l.url);
    }
  }

  doc.setTitle(`${clean.name} – Resume`, { showInWindowTitleBar: true });
  doc.setAuthor(clean.name);
  doc.setSubject('Resume');
  doc.setCreator('CareerCraft by WebElvate');
  doc.setProducer('CareerCraft by WebElvate');
  try {
    doc.setLanguage('en');
  } catch {
    /* older pdf-lib builds */
  }

  return { bytes: await doc.save(), pages: L.pages, scale: L.scale, lastFill: L.lastFill };
}

export async function renderResumePdf(data: ResumeData, template: TemplateName = 'modern'): Promise<Uint8Array> {
  return (await renderResumePdfWithInfo(data, template)).bytes;
}
