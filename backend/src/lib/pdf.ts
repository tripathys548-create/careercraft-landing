import { PDFDocument, PDFFont, PDFPage, StandardFonts, rgb, RGB } from 'pdf-lib';

export interface ResumeData {
  name: string;
  headline: string;
  summary: string;
  experience: string[];
  education: string[];
  skills: string[];
  template?: 'classic' | 'modern' | 'compact';
}

export type TemplateName = 'modern' | 'classic' | 'compact';

const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const MARGIN = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const COLOR_BLACK = rgb(0.08, 0.10, 0.14);
const COLOR_MUTED = rgb(0.35, 0.40, 0.48);
const COLOR_RULE = rgb(0.86, 0.89, 0.93);
const COLOR_WHITE = rgb(1, 1, 1);

interface TemplateDesign {
  primary: RGB;
  secondary: RGB;
  softBg: RGB;
  badgeBorder: RGB;
  headingFont: 'bold' | 'timesBold';
  bodyFont: 'regular' | 'times';
  nameSize: number;
  bannerStyle: 'gradient' | 'classic_rule' | 'compact_bar';
  tight: boolean;
}

const DESIGNS: Record<TemplateName, TemplateDesign> = {
  // Modern Tech: Executive Sapphire & Teal with skill badges and accent headers
  modern: {
    primary: rgb(0.08, 0.28, 0.58),     // #144794 Deep Sapphire
    secondary: rgb(0.05, 0.55, 0.58),   // #0D8C94 Emerald Teal
    softBg: rgb(0.93, 0.96, 0.99),      // #EDF5FC Soft Tint
    badgeBorder: rgb(0.78, 0.86, 0.95), // #C7DCF2
    headingFont: 'bold',
    bodyFont: 'regular',
    nameSize: 22,
    bannerStyle: 'gradient',
    tight: false,
  },
  // Classic Ivy: Rich Crimson & Warm Slate for banking, consulting & law
  classic: {
    primary: rgb(0.52, 0.12, 0.18),     // #851F2E Royal Burgundy
    secondary: rgb(0.72, 0.48, 0.18),   // #B87B2E Bronze Accent
    softBg: rgb(0.98, 0.96, 0.95),      // #FAF5F2 Warm Cream Tint
    badgeBorder: rgb(0.88, 0.80, 0.76), // #E0CCC2
    headingFont: 'timesBold',
    bodyFont: 'times',
    nameSize: 21,
    bannerStyle: 'classic_rule',
    tight: false,
  },
  // Compact Executive: High-density Slate & Electric Cobalt
  compact: {
    primary: rgb(0.09, 0.38, 0.82),     // #1761D1 Electric Cobalt
    secondary: rgb(0.18, 0.24, 0.34),   // #2E3D57 Dark Slate
    softBg: rgb(0.94, 0.96, 0.99),      // #F0F5FC
    badgeBorder: rgb(0.82, 0.88, 0.96),
    headingFont: 'bold',
    bodyFont: 'regular',
    nameSize: 18,
    bannerStyle: 'compact_bar',
    tight: true,
  },
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

class EnhancedFlowingDoc {
  doc: PDFDocument;
  page: PDFPage;
  y: number;

  constructor(doc: PDFDocument) {
    this.doc = doc;
    this.page = doc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  ensureSpace(height: number) {
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

  /** Renders colorful section title with accent pill indicator and modern rule */
  drawSectionHeader(
    title: string,
    design: TemplateDesign,
    headingFont: PDFFont
  ) {
    const titleSize = design.tight ? 10.5 : 11;
    this.spacer(design.tight ? 12 : 16);
    this.ensureSpace(28);

    const barHeight = titleSize + 3;
    const barY = this.y - barHeight + 1;

    // Colorful vertical pill indicator
    this.page.drawRectangle({
      x: MARGIN,
      y: barY,
      width: 4,
      height: barHeight,
      color: design.primary,
    });

    // Subtle colored background strip
    this.page.drawRectangle({
      x: MARGIN + 4,
      y: barY,
      width: CONTENT_WIDTH - 4,
      height: barHeight,
      color: design.softBg,
    });

    // Title text inside highlighted strip
    this.page.drawText(title.toUpperCase(), {
      x: MARGIN + 12,
      y: this.y - titleSize + 1,
      size: titleSize,
      font: headingFont,
      color: design.primary,
    });

    this.y -= barHeight + 4;

    // Dual-tone underline (accent block + muted horizontal rule)
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: MARGIN + 60, y: this.y },
      thickness: 1.5,
      color: design.secondary,
    });
    this.page.drawLine({
      start: { x: MARGIN + 60, y: this.y },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y },
      thickness: 0.5,
      color: COLOR_RULE,
    });

    this.y -= 8;
  }

  /** Renders experience / education bullets with high-contrast accent bullets */
  bulletList(
    items: string[],
    size: number,
    font: PDFFont,
    textColor: RGB,
    bulletColor: RGB,
    lineGap: number,
    indent = 14
  ) {
    for (const item of items) {
      const wrapped = wrapText(item, font, size, CONTENT_WIDTH - indent);
      wrapped.forEach((text, i) => {
        this.ensureSpace(lineGap);
        if (i === 0) {
          // Modern geometric vector bullet (accent colored square)
          this.page.drawRectangle({
            x: MARGIN + 3,
            y: this.y - size + 2.5,
            width: 4,
            height: 4,
            color: bulletColor,
          });
        }
        this.page.drawText(text, {
          x: MARGIN + indent,
          y: this.y - size,
          size,
          font,
          color: textColor,
        });
        this.y -= lineGap;
      });
      this.spacer(3); // extra breath between bullets
    }
  }

  /** Renders skills as colorful badge tags / pills */
  drawSkillBadges(
    skills: string[],
    font: PDFFont,
    design: TemplateDesign
  ) {
    if (skills.length === 0) return;

    const fontSize = 8.5;
    const badgeHeight = 16;
    const padX = 7;
    const gapX = 6;
    const gapY = 6;

    let curX = MARGIN;
    this.ensureSpace(badgeHeight + gapY);

    for (const skill of skills) {
      const textWidth = font.widthOfTextAtSize(skill, fontSize);
      const badgeWidth = textWidth + padX * 2;

      // Wrap to next line if badge overflows page width
      if (curX + badgeWidth > PAGE_WIDTH - MARGIN) {
        curX = MARGIN;
        this.y -= badgeHeight + gapY;
        this.ensureSpace(badgeHeight + gapY);
      }

      // Draw Badge Background Pill
      this.page.drawRectangle({
        x: curX,
        y: this.y - badgeHeight,
        width: badgeWidth,
        height: badgeHeight,
        color: design.softBg,
        borderColor: design.badgeBorder,
        borderWidth: 0.75,
      });

      // Draw Badge Text
      this.page.drawText(skill, {
        x: curX + padX,
        y: this.y - badgeHeight + 4,
        size: fontSize,
        font,
        color: design.primary,
      });

      curX += badgeWidth + gapX;
    }

    this.y -= badgeHeight + 10;
  }
}

export async function renderResumePdf(
  data: ResumeData,
  template: TemplateName = 'modern'
): Promise<Uint8Array> {
  const chosenTemplate = (data.template as TemplateName) || template;
  const design = DESIGNS[chosenTemplate] ?? DESIGNS.modern;
  const doc = await PDFDocument.create();

  const fonts = {
    regular: await doc.embedFont(StandardFonts.Helvetica),
    bold: await doc.embedFont(StandardFonts.HelveticaBold),
    times: await doc.embedFont(StandardFonts.TimesRoman),
    timesBold: await doc.embedFont(StandardFonts.TimesRomanBold),
  };

  const headingFont = fonts[design.headingFont];
  const bodyFont = fonts[design.bodyFont];

  const bodySize = design.tight ? 9 : 9.5;
  const lineGap = bodySize * (design.tight ? 1.3 : 1.4);

  const flow = new EnhancedFlowingDoc(doc);

  // ── HEADER SECTION ──────────────────────────────────────────────────────────
  if (design.bannerStyle === 'gradient') {
    // Modern Gradient-style Top Card
    const headlineLines = data.headline
      ? wrapText(data.headline, bodyFont, 10, CONTENT_WIDTH - 20)
      : [];
    const bannerHeight = 36 + design.nameSize + (headlineLines.length * 13) + 24;

    // Primary Header Card
    flow.page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - bannerHeight,
      width: PAGE_WIDTH,
      height: bannerHeight,
      color: design.primary,
    });

    // Secondary Accent Line at banner bottom
    flow.page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - bannerHeight - 4,
      width: PAGE_WIDTH,
      height: 4,
      color: design.secondary,
    });

    flow.y = PAGE_HEIGHT - 28;
    flow.line(data.name || 'Your Name', design.nameSize, headingFont, COLOR_WHITE, design.nameSize + 4);

    for (const hLine of headlineLines) {
      flow.line(hLine, 10, bodyFont, rgb(0.88, 0.94, 0.99), 13);
    }

    flow.y = PAGE_HEIGHT - bannerHeight - 22;
  } else if (design.bannerStyle === 'compact_bar') {
    // Compact Header with side accent strip
    flow.page.drawRectangle({
      x: 0,
      y: PAGE_HEIGHT - 6,
      width: PAGE_WIDTH,
      height: 6,
      color: design.primary,
    });

    flow.spacer(10);
    flow.line(data.name || 'Your Name', design.nameSize, headingFont, design.primary, design.nameSize + 4);
    if (data.headline) {
      flow.paragraph(data.headline, 9.5, bodyFont, COLOR_MUTED, 12);
    }
    flow.spacer(6);
  } else {
    // Classic Ivy Header with formal styling
    flow.spacer(10);
    flow.line((data.name || 'Your Name').toUpperCase(), design.nameSize, headingFont, design.primary, design.nameSize + 6);
    if (data.headline) {
      flow.paragraph(data.headline, 10, bodyFont, COLOR_MUTED, 14);
    }
    flow.spacer(8);
  }

  // ── 1. SUMMARY SECTION ──────────────────────────────────────────────────────
  if (data.summary) {
    flow.drawSectionHeader('Professional Summary', design, headingFont);
    flow.paragraph(data.summary, bodySize, bodyFont, COLOR_BLACK, lineGap);
  }

  // ── 2. CORE SKILLS SECTION (Rendered as colorful badges) ─────────────────────
  if (data.skills && data.skills.length > 0) {
    flow.drawSectionHeader('Core Competencies & Skills', design, headingFont);
    flow.drawSkillBadges(data.skills, fonts.bold, design);
  }

  // ── 3. EXPERIENCE SECTION ───────────────────────────────────────────────────
  if (data.experience && data.experience.length > 0) {
    flow.drawSectionHeader('Professional Experience', design, headingFont);
    flow.bulletList(data.experience, bodySize, bodyFont, COLOR_BLACK, design.secondary, lineGap);
  }

  // ── 4. EDUCATION SECTION ────────────────────────────────────────────────────
  if (data.education && data.education.length > 0) {
    flow.drawSectionHeader('Education & Credentials', design, headingFont);
    flow.bulletList(data.education, bodySize, bodyFont, COLOR_BLACK, design.primary, lineGap);
  }

  return doc.save();
}
