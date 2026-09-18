import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface ResumeData {
  name: string;
  headline: string;
  summary: string;
  experience: string[];
  education: string[];
  skills: string[];
}

export async function renderResumePdf(data: ResumeData): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([612, 792]); // US Letter
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  let y = 740;
  const left = 50;
  const width = 512; // 612 - 2*50

  const draw = (text: string, size: number, f = font, gap = 16) => {
    // Truncate text that would overflow the page width (naive single-line)
    page.drawText(text.slice(0, 120), { x: left, y, size, font: f, color: rgb(0, 0, 0) });
    y -= gap;
  };

  const section = (title: string) => {
    y -= 4;
    page.drawLine({ start: { x: left, y }, end: { x: left + width, y }, thickness: 0.5, color: rgb(0.6, 0.6, 0.6) });
    y -= 14;
    draw(title, 11, bold, 18);
  };

  draw(data.name, 18, bold, 22);
  draw(data.headline, 11, font, 20);

  section('SUMMARY');
  draw(data.summary, 10, font, 20);

  section('EXPERIENCE');
  data.experience.forEach((line) => { draw(`• ${line}`, 10, font, 14); });

  section('EDUCATION');
  data.education.forEach((line) => { draw(`• ${line}`, 10, font, 14); });

  section('SKILLS');
  draw(data.skills.join(', '), 10, font, 14);

  return doc.save();
}
