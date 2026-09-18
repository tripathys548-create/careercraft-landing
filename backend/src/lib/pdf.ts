import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, RGB } from 'pdf-lib';

export interface ResumeData {
  name: string;
  headline: string;
  summary: string;
  experience: string[];
  education: string[];
  skills: string[];
}

export type TemplateName = 'modern' | 'classic' | 'compact';

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const BLACK = rgb(0.09, 0.09, 0.09);
const GRAY = rgb(0.4, 0.4, 0.4);
const RULE_GRAY = rgb(0.8, 0.8, 0.8);
const WHITE = rgb(1, 1, 1);

interface TemplateConfig {
  accent: RGB;
  headingFont: 'bold' | 'timesBold';
  bodyFont: 'regular' | 'times';
  nameSize: number;
  bandHeader: boolean;
  tight: boolean;
}

const TEMPLATES: Record<TemplateName, TemplateConfig> = {
  // Colored header band, sans-serif — reads as contemporary/tech.
  modern: { accent: rgb(0.086, 0.639, 0.29), headingFont: 'bold', bodyFont: 'regular', nameSize: 22, bandHeader: true, tight: false },
  // Serif, black-and-white, no color — traditional/conservative fields.
  classic: { accent: rgb(0.15, 0.15, 0.15), headingFont: 'timesBold', bodyFont: 'times', nameSize: 20, bandHeader: false, tight: false },
  // Tight spacing, small type, blue accent — fits more on one page.
  compact: { accent: rgb(0.145, 0.388, 0.922), headingFont: 'bold', bodyFont: 'regular', nameSize: 17, bandHeader: false, tight: true },
};

export function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const attempt = current ? `${current} ${word}` : word;
    if (current && font.widthOfTextAtSize(attempt, size) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = attempt;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Flows text onto a paginated PDF, adding new pages when content overflows. */
class FlowingDoc {
  doc: PDFDocument;
  page: PDFPage;
  y: number;

  constructor(doc: PDFDocument) {
    this.doc = doc;
    this.page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  private ensureSpace(height: number) {
    if (this.y - height < MARGIN) {
      this.page = this.doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
      this.y = PAGE_HEIGHT - MARGIN;
    }
  }

  spacer(amount: number) {
    this.y -= amount;
  }

  line(text: string, size: number, font: PDFFont, color: RGB, lineGap: number, x = MARGIN) {
    this.ensureSpace(lineGap);
    this.page.drawText(text, { x, y: this.y - size, size, font, color });
    this.y -= lineGap;
  }

  paragraph(text: string, size: number, font: PDFFont, color: RGB, lineGap: number, maxWidth = CONTENT_WIDTH) {
    for (const wrapped of wrapText(text, font, size, maxWidth)) {
      this.line(wrapped, size, font, color, lineGap);
    }
  }

  bulletList(items: string[], size: number, font: PDFFont, color: RGB, lineGap: number, indent = 14) {
    for (const item of items) {
      const wrapped = wrapText(item, font, size, CONTENT_WIDTH - indent);
      wrapped.forEach((text, i) => {
        this.ensureSpace(lineGap);
        if (i === 0) {
          this.page.drawText('•', { x: MARGIN, y: this.y - size, size, font, color });
        }
        this.page.drawText(text, { x: MARGIN + indent, y: this.y - size, size, font, color });
        this.y -= lineGap;
      });
    }
  }

  rule(color: RGB, gapBefore: number, gapAfter: number) {
    this.ensureSpace(gapBefore + gapAfter + 1);
    this.y -= gapBefore;
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y },
      thickness: 0.75,
      color,
    });
    this.y -= gapAfter;
  }
}

export async function renderResumePdf(data: ResumeData, template: TemplateName = 'modern'): Promise<Uint8Array> {
  const cfg = TEMPLATES[template] ?? TEMPLATES.modern;
  const doc = await PDFDocument.create();

  const fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    times: await doc.embedFont(StandardFonts.TimesRoman),
    timesBold: await doc.embedFont(StandardFonts.TimesRomanBold),
  };
  const headingFont = fonts[cfg.headingFont];
  const bodyFont = fonts[cfg.bodyFont];

  const bodySize = cfg.tight ? 9.5 : 10;
  const lineGap = bodySize * (cfg.tight ? 1.3 : 1.45);
  const sectionGapBefore = cfg.tight ? 12 : 16;

  const flow = new FlowingDoc(doc);

  const nameLineGap = cfg.nameSize + 6;
  const headlineLineGap = 14;

  if (cfg.bandHeader) {
    // Compute the band's height from actual wrapped line count so a long,
    // two-line headline never spills past the colored band's bottom edge.
    const headlineLines = data.headline ? wrapText(data.headline, bodyFont, 10.5, CONTENT_WIDTH) : [];
    const topPad = 32;
    const bottomPad = 22;
    const bandHeight = topPad + nameLineGap + headlineLines.length * headlineLineGap + bottomPad;

    flow.page.drawRectangle({ x: 0, y: PAGE_HEIGHT - bandHeight, width: PAGE_WIDTH, height: bandHeight, color: cfg.accent });
    flow.y = PAGE_HEIGHT - topPad;
    flow.line(data.name || 'Your Name', cfg.nameSize, headingFont, WHITE, nameLineGap);
    for (const headlineLine of headlineLines) flow.line(headlineLine, 10.5, bodyFont, WHITE, headlineLineGap);
    flow.y = PAGE_HEIGHT - bandHeight - 20;
  } else {
    flow.line(data.name || 'Your Name', cfg.nameSize, headingFont, BLACK, nameLineGap);
    if (data.headline) flow.paragraph(data.headline, 10.5, bodyFont, GRAY, headlineLineGap);
    flow.spacer(6);
  }

  const section = (title: string) => {
    const titleSize = 10.5;
    flow.spacer(sectionGapBefore);
    // lineGap must exceed titleSize so the rule below is drawn clear of the
    // title's own glyphs (a rule drawn while y is still within one font-size
    // of the title's baseline visually crosses through the text).
    flow.line(title.toUpperCase(), titleSize, headingFont, cfg.accent, titleSize * 1.3);
    flow.rule(RULE_GRAY, 0, 10);
  };

  if (data.summary) {
    section('Summary');
    flow.paragraph(data.summary, bodySize, bodyFont, BLACK, lineGap);
  }

  if (data.experience.length > 0) {
    section('Experience');
    flow.bulletList(data.experience, bodySize, bodyFont, BLACK, lineGap);
  }

  if (data.education.length > 0) {
    section('Education');
    flow.bulletList(data.education, bodySize, bodyFont, BLACK, lineGap);
  }

  if (data.skills.length > 0) {
    section('Skills');
    flow.paragraph(data.skills.join('   •   '), bodySize, bodyFont, BLACK, lineGap);
  }

  return doc.save();
}
