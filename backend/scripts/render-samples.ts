/**
 * Renders every sample resume in every template to backend/.samples/ so the layout can be
 * eyeballed and text-extracted (pdftotext) after any renderer change.
 *   npm run resume:samples
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { renderResumePdfWithInfo } from '../src/lib/pdf';
import { ALL_SAMPLES } from '../test/fixtures/resumeSamples';
import { TEMPLATE_NAMES } from '../src/lib/resume/types';

const out = fileURLToPath(new URL('../.samples/', import.meta.url));
mkdirSync(out, { recursive: true });
for (const [name, data] of Object.entries(ALL_SAMPLES)) {
  for (const t of TEMPLATE_NAMES) {
    const t0 = performance.now();
    const info = await renderResumePdfWithInfo({ ...data, template: t }, t);
    writeFileSync(`${out}${name}-${t}.pdf`, info.bytes);
    console.log(
      `${name}-${t}`.padEnd(24),
      `pages=${info.pages}`,
      `scale=${info.scale.toFixed(2)}`,
      `lastFill=${(info.lastFill * 100).toFixed(0)}%`,
      `${(info.bytes.length / 1024).toFixed(0)}KB`,
      `${(performance.now() - t0).toFixed(0)}ms`
    );
  }
}
