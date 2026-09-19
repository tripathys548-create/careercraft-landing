import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PDFDocument } from 'pdf-lib';

const ANALYSIS = {
  beforeScore: 40,
  beforeBreakdown: { headline: 10, about: 10, experience: 10, skills: 10 },
  afterScore: 90,
  afterBreakdown: { headline: 22, about: 22, experience: 26, skills: 20 },
  improvements: ['a', 'b', 'c', 'd'],
  // deliberately full of invented metrics, like the marketing-style rewrite prompt encourages
  rewrite: { headline: 'Visionary Leader', about: 'Grew revenue 900%', experience: ['Spearheaded a 500% uplift'], skills: ['Blockchain'] },
};

const RESUME_JSON = {
  name: 'Priya Nayak',
  headline: 'Data Analyst | SQL | Python',
  summary: 'Data analyst with 3+ years of experience turning raw data into weekly dashboards using SQL and Python.',
  experience: [
    {
      title: 'Data Analyst',
      company: 'Acme Analytics',
      location: '',
      start: 'Jan 2023',
      end: 'Present',
      bullets: ['Built weekly SQL and Python dashboards that reduced manual reporting time by 30%'],
    },
  ],
  education: [{ degree: 'B.Sc, Statistics', school: 'Utkal University', start: '2019', end: '2022' }],
  skills: [{ label: 'Analytics', items: ['SQL', 'Python', 'Blockchain'] }],
};

let resumeCalls = 0;
vi.mock('../src/lib/llm', () => ({
  callLLMJson: vi.fn(async (_env: unknown, system: string) => {
    if (system.includes('Executive Career Strategist')) return ANALYSIS;
    resumeCalls++;
    return RESUME_JSON;
  }),
}));
vi.mock('../src/lib/validateKey', () => ({ validateAndBindKey: vi.fn(async () => ({ ok: true })) }));
vi.mock('../src/lib/rateLimit', () => ({ checkRateLimit: vi.fn(async () => true), logUsage: vi.fn(async () => {}) }));
vi.mock('../src/lib/db', () => ({ getDb: vi.fn(() => vi.fn(async () => [])) }));
// Real renderer, wrapped in a spy so tests can inspect exactly what data reaches it.
vi.mock('../src/lib/pdf', async (importOriginal) => {
  const real = await importOriginal<typeof import('../src/lib/pdf')>();
  return { ...real, renderResumePdf: vi.fn(real.renderResumePdf) };
});

const { handleAnalyzeProfile } = await import('../src/routes/analyzeProfile');
const { renderResumePdf } = await import('../src/lib/pdf');

const RESUME_TEXT = `Priya Nayak
priya.nayak@example.com | +91 98765 43210
Data Analyst, Acme Analytics — Jan 2023 - Present
Built weekly dashboards in SQL and Python, cutting manual reporting time by 30%.
B.Sc, Statistics, Utkal University, 2019 - 2022
Skills: SQL, Python, Excel`;

const call = async (body: Record<string, unknown>) => {
  const res = await handleAnalyzeProfile(
    new Request('https://x/analyze-profile', { method: 'POST', body: JSON.stringify({ key: 'K', ...body }) }),
    { CHECKOUT_ORIGIN: 'https://site', EXTENSION_ORIGIN: 'chrome-extension://x' } as any
  );
  return { res, json: (await res.json()) as any };
};

beforeEach(() => {
  resumeCalls = 0;
  vi.mocked(renderResumePdf).mockClear();
});

describe('handleAnalyzeProfile — resume PDF', () => {
  it('builds a structured, fact-checked resume PDF from the customer’s own text (not from the marketing rewrite)', async () => {
    const { res, json } = await call({ resumeText: RESUME_TEXT, targetRole: 'Senior Data Analyst', template: 'classic', linkedinUrl: 'https://www.linkedin.com/in/priya-nayak' });
    expect(res.status).toBe(200);
    // analysis feature is untouched
    expect(json.beforeScore).toBe(40);
    expect(json.rewrite.headline).toBe('Visionary Leader');
    // resume PDF exists and is a real 1–2 page document
    expect(typeof json.resumePdfBase64).toBe('string');
    const bytes = Uint8Array.from(atob(json.resumePdfBase64), (c) => c.charCodeAt(0));
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe('%PDF-');
    const doc = await PDFDocument.load(bytes);
    expect(doc.getPageCount()).toBeLessThanOrEqual(2);
    expect(doc.getTitle()).toBe('Priya Nayak – Resume');
    expect(resumeCalls).toBeGreaterThanOrEqual(1);

    // What the renderer actually received: fact-checked, structured, contact taken from the pasted resume.
    const [data, template] = vi.mocked(renderResumePdf).mock.calls.at(-1)!;
    expect(template).toBe('classic');
    expect(data.contact).toMatchObject({ email: 'priya.nayak@example.com', phone: '+91 98765 43210', linkedin: 'linkedin.com/in/priya-nayak' });
    expect(data.experience[0]).toMatchObject({ title: 'Data Analyst', company: 'Acme Analytics' });
    const everything = JSON.stringify(data);
    for (const invented of ['Visionary', '900%', '500%', 'Blockchain']) expect(everything).not.toContain(invented);
    expect(data.skills.flatMap((g: any) => g.items)).toEqual(expect.arrayContaining(['SQL', 'Python']));
  });

  it('is best-effort: a resume failure never breaks the analysis response', async () => {
    const { callLLMJson } = await import('../src/lib/llm');
    vi.mocked(callLLMJson).mockImplementation(async (_e: any, system: string) => {
      if (system.includes('Executive Career Strategist')) return ANALYSIS;
      throw new Error('llm down');
    });
    const { res, json } = await call({ resumeText: RESUME_TEXT });
    expect(res.status).toBe(200);
    expect(json.resumePdfBase64).toBeNull();
    expect(json.afterScore).toBe(90);
  });

  it('skips the resume (no wasted LLM call) when there is not enough source text', async () => {
    const { callLLMJson } = await import('../src/lib/llm');
    vi.mocked(callLLMJson).mockImplementation(async () => ANALYSIS);
    const { json } = await call({ headline: 'Dev' });
    expect(json.resumePdfBase64).toBeNull();
  });
});
