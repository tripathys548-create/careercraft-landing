import { describe, it, expect } from 'vitest';
import { PDFArray, PDFDocument } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { renderResumePdf, renderResumePdfWithInfo, wrapText } from '../../src/lib/pdf';
import { fontBytes } from '../../src/lib/resume/fonts';
import { ALL_SAMPLES, midLevel } from '../fixtures/resumeSamples';
import type { ResumeData, TemplateName } from '../../src/lib/resume/types';

const TEMPLATES: TemplateName[] = ['modern', 'classic', 'compact'];
const A4: [number, number] = [595.28, 841.89];

const header = (b: Uint8Array) => new TextDecoder().decode(b.slice(0, 5));

describe('renderResumePdf', () => {
  for (const [name, data] of Object.entries(ALL_SAMPLES)) {
    for (const t of TEMPLATES) {
      it(`renders ${name} / ${t} as a valid 1–2 page A4 PDF`, async () => {
        const info = await renderResumePdfWithInfo({ ...data }, t);
        expect(header(info.bytes)).toBe('%PDF-');
        expect(info.pages).toBeGreaterThanOrEqual(1);
        expect(info.pages).toBeLessThanOrEqual(2);
        const doc = await PDFDocument.load(info.bytes);
        expect(doc.getPageCount()).toBe(info.pages);
        const { width, height } = doc.getPage(0).getSize();
        expect([width, height]).toEqual(A4);
      });
    }
  }

  it('keeps the old two-argument call signature working and defaults to the modern template', async () => {
    const bytes = await renderResumePdf(midLevel);
    expect(header(bytes)).toBe('%PDF-');
  });

  it('supports US Letter', async () => {
    const doc = await PDFDocument.load(await renderResumePdf({ ...midLevel, pageSize: 'letter' }, 'classic'));
    expect(doc.getPage(0).getSize()).toEqual({ width: 612, height: 792 });
  });

  it('sets document metadata', async () => {
    const doc = await PDFDocument.load(await renderResumePdf(midLevel, 'modern'), { updateMetadata: false });
    expect(doc.getTitle()).toBe('Priya Nayak – Resume');
    expect(doc.getAuthor()).toBe('Priya Nayak');
    expect(doc.getProducer()).toMatch(/CareerCraft/);
  });

  it('adds clickable link annotations for email and LinkedIn', async () => {
    const doc = await PDFDocument.load(await renderResumePdf(midLevel, 'modern'));
    const annots = doc.getPage(0).node.Annots();
    expect(annots).toBeInstanceOf(PDFArray);
    expect((annots as PDFArray).size()).toBeGreaterThanOrEqual(3); // phone, email, linkedin
  });

  it('never throws on emoji, unsupported scripts, RTL marks, control chars or huge words (the old renderer did)', async () => {
    const nasty = 'Dev 🚀👩🏽‍💻 ଓଡ଼ିଆ हिन्दी 日本語 مرحبا \u202Eevil\u202C \u0007 \u200B' + 'W'.repeat(400) + ' ₹5 → ≥ “q” ‘s’ — –';
    const data: ResumeData = {
      name: nasty,
      headline: nasty,
      contact: { location: nasty, phone: nasty, email: nasty, linkedin: nasty, website: nasty },
      summary: nasty,
      experience: [{ title: nasty, company: nasty, location: nasty, start: nasty, end: nasty, bullets: [nasty, nasty] }],
      education: [{ degree: nasty, school: nasty, start: nasty, end: nasty, detail: nasty }],
      skills: [{ label: nasty, items: [nasty, nasty] }],
    };
    for (const t of TEMPLATES) {
      const info = await renderResumePdfWithInfo(data, t);
      expect(header(info.bytes)).toBe('%PDF-');
    }
  });

  it('survives randomised Unicode in every field', async () => {
    let seed = 42;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
    const ranges: Array<[number, number]> = [[0x20, 0x7e], [0xa0, 0x17f], [0x2000, 0x206f], [0x0900, 0x097f], [0x1f300, 0x1faff], [0x4e00, 0x4e80], [0x0600, 0x0640], [0x0300, 0x036f]];
    const junk = (n: number) =>
      Array.from({ length: n }, () => {
        const [a, b] = ranges[Math.floor(rnd() * ranges.length)];
        return String.fromCodePoint(a + Math.floor(rnd() * (b - a)));
      }).join('');
    for (let i = 0; i < 25; i++) {
      const data: ResumeData = {
        name: junk(20),
        headline: junk(80),
        contact: { location: junk(10), email: junk(12) },
        summary: junk(300),
        experience: Array.from({ length: 1 + (i % 4) }, () => ({ title: junk(20), company: junk(15), start: junk(6), end: junk(6), bullets: [junk(120), junk(60)] })),
        education: [{ degree: junk(20), school: junk(30) }],
        skills: [{ label: junk(8), items: [junk(10), junk(10)] }],
      };
      const bytes = await renderResumePdf(data, TEMPLATES[i % 3]);
      expect(header(bytes)).toBe('%PDF-');
    }
  });

  it('renders a nearly empty resume (name only) without throwing', async () => {
    const info = await renderResumePdfWithInfo({ name: 'A', headline: '', contact: {}, summary: '', experience: [], education: [], skills: [] }, 'classic');
    expect(info.pages).toBe(1);
  });

  it('caps very long careers at two pages instead of overflowing', async () => {
    const roles = Array.from({ length: 8 }, (_, i) => ({
      title: `Role ${i + 1} Engineer`,
      company: `Company ${i + 1} Technologies`,
      location: 'Pune, Maharashtra',
      start: `Jan ${2010 + i}`,
      end: `Dec ${2010 + i}`,
      bullets: Array.from({ length: 5 }, (_, j) => `Delivered milestone ${j + 1} for the platform migration programme by coordinating design, build and rollout across several distributed teams`),
    }));
    for (const t of TEMPLATES) {
      const info = await renderResumePdfWithInfo({ ...midLevel, experience: roles }, t);
      expect(info.pages, t).toBeLessThanOrEqual(2);
    }
  });

  it('scales a short resume UP toward a full page instead of leaving it tiny', async () => {
    const info = await renderResumePdfWithInfo(midLevel, 'modern');
    expect(info.pages).toBe(1);
    expect(info.scale).toBeGreaterThan(1);
  });

  it('avoids an orphaned near-empty second page', async () => {
    // grow the content until it just spills; whatever layout is chosen must not leave a sliver on page 2
    for (let bullets = 3; bullets <= 5; bullets++) {
      const roles = Array.from({ length: 5 }, (_, i) => ({
        title: `Engineer ${i}`,
        company: `Company ${i} Technologies`,
        start: `Jan ${2015 + i}`,
        end: `Dec ${2015 + i}`,
        bullets: Array.from({ length: bullets }, (_, j) => `Built and shipped feature ${j} for the core product used by many customers every single day`),
      }));
      const info = await renderResumePdfWithInfo({ ...midLevel, experience: roles }, 'modern');
      if (info.pages === 2) expect(info.lastFill).toBeGreaterThanOrEqual(0.2);
    }
  });
});

describe('wrapText', () => {
  it('wraps on words and hard-splits words wider than the line', async () => {
    const doc = await PDFDocument.create();
    doc.registerFontkit(fontkit);
    const font = await doc.embedFont(fontBytes('sansRegular'), { subset: false });
    const lines = wrapText('alpha beta gamma delta ' + 'x'.repeat(200), font, 10, 100);
    expect(lines.length).toBeGreaterThan(3);
    for (const l of lines) expect(font.widthOfTextAtSize(l, 10)).toBeLessThanOrEqual(100.5);
    expect(lines.join('').replace(/\s/g, '')).toBe('alphabetagammadelta' + 'x'.repeat(200));
    expect(wrapText('   ', font, 10, 100)).toEqual([]);
  });
});
