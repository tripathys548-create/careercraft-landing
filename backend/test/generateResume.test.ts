import { describe, it, expect, vi, beforeEach } from 'vitest';

let mockResumeKeyRow: any = { key: 'LKX-1', linkedin_id: 'li-1', status: 'active', resume_generated_at: null };
let mockLlmResumeThrows = false;
let mockLlmOutput: any;
let mockRenderThrows = false;

// A well-formed model answer for PROFILE below.
const GOOD_OUTPUT = {
  name: 'Priya Nayak',
  headline: 'Backend Engineer | Node.js | AWS',
  summary: 'Backend engineer with 4+ years of experience building payment APIs in Node.js and PostgreSQL.',
  experience: [
    {
      title: 'Software Engineer',
      company: 'Acme Technologies',
      location: 'Bengaluru, Karnataka, India',
      start: 'Jan 2022',
      end: 'Present',
      bullets: ['Built payment APIs in Node.js and PostgreSQL that cut checkout latency by 38%'],
    },
    { title: 'Associate Software Engineer', company: 'Globex Systems', start: 'Jul 2020', end: 'Dec 2021', bullets: [] },
  ],
  education: [{ degree: 'B.Tech, Computer Science', school: 'KIIT University', start: '2016', end: '2020' }],
  skills: [{ label: 'Core Skills', items: ['Node.js', 'PostgreSQL', 'AWS', 'Docker', 'TypeScript'] }],
};

// What the extension's scraper actually produces: loosely-joined lines.
const PROFILE = {
  key: 'LKX-1',
  linkedinId: 'li-1',
  name: 'Priya Nayak',
  headline: 'Backend Engineer | Node.js | AWS',
  about: 'Backend engineer who builds payment APIs.',
  experience:
    'Software Engineer\nAcme Technologies · Full-time\nJan 2022 - Present · 3 yrs 9 mos\nBengaluru, Karnataka, India\nBuilt payment APIs in Node.js and PostgreSQL. Cut checkout latency by 38%.\nAssociate Software Engineer\nGlobex Systems\nJul 2020 - Dec 2021 · 1 yr 6 mos',
  education: 'KIIT University\nB.Tech, Computer Science · 2016 - 2020',
  skills: 'Node.js, PostgreSQL, AWS, Docker, TypeScript',
};

vi.mock('../src/lib/llm', () => ({
  callLLMJson: vi.fn(async () => {
    if (mockLlmResumeThrows) throw new Error('llm_json_parse_failed');
    return mockLlmOutput;
  }),
}));

vi.mock('../src/lib/pdf', () => ({
  renderResumePdf: vi.fn(async () => {
    if (mockRenderThrows) throw new Error('boom');
    return new Uint8Array([1, 2, 3]);
  }),
}));

vi.mock('../src/lib/db', () => ({
  getDb: vi.fn(() => {
    let callCount = 0;
    return vi.fn(async () => {
      callCount++;
      // call 1: SELECT key, linkedin_id, status, resume_generated_at
      if (callCount === 1) return [mockResumeKeyRow];
      // call 2: SELECT key, linkedin_id, status (from validateAndBindKey)
      if (callCount === 2) return [mockResumeKeyRow];
      // call 3 (re-serve path): SELECT output_blob FROM generated_content
      if (callCount === 3 && mockResumeKeyRow.resume_generated_at) {
        return [{ output_blob: Buffer.from([9, 9, 9]) }];
      }
      // call 3 (generate path): SELECT count(*)
      if (callCount === 3) return [{ count: '0' }];
      return [];
    });
  }),
}));

const { handleGenerateResume } = await import('../src/routes/generateResume');
const { getDb } = await import('../src/lib/db');
const { callLLMJson } = await import('../src/lib/llm');
const { renderResumePdf } = await import('../src/lib/pdf');

const post = (body: unknown) =>
  handleGenerateResume(new Request('https://x/generate-resume', { method: 'POST', body: JSON.stringify(body) }), {} as any);

/** Every SQL statement issued through the mocked tagged-template client, joined for easy matching. */
const sqlStatements = (): string[] => {
  const sql: any = vi.mocked(getDb).mock.results.at(-1)?.value;
  return (sql?.mock.calls ?? []).map((c: any[]) => (Array.isArray(c[0]) ? c[0].join('?') : String(c[0])));
};

beforeEach(() => {
  mockResumeKeyRow = { key: 'LKX-1', linkedin_id: 'li-1', status: 'active', resume_generated_at: null };
  mockLlmResumeThrows = false;
  mockRenderThrows = false;
  mockLlmOutput = structuredClone(GOOD_OUTPUT);
  vi.mocked(renderResumePdf).mockClear();
  vi.mocked(callLLMJson).mockClear();
  vi.mocked(getDb).mockClear();
});

describe('handleGenerateResume', () => {
  it('generates and stores a new resume when resume_generated_at is null', async () => {
    const response = await post(PROFILE);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/pdf');
    expect(renderResumePdf).toHaveBeenCalledTimes(1);

    // The renderer receives STRUCTURED roles (title/company/dates/bullets), not flat strings.
    const [data, template] = vi.mocked(renderResumePdf).mock.calls[0];
    expect(template).toBe('modern');
    expect(data.experience[0]).toMatchObject({ title: 'Software Engineer', company: 'Acme Technologies', start: 'Jan 2022', end: 'Present' });
    expect(data.experience[0].bullets[0]).toContain('38%');
    expect(data.contact.linkedin).toBe('linkedin.com/in/li-1');

    const stmts = sqlStatements();
    expect(stmts.some((s) => s.includes('INSERT INTO generated_content'))).toBe(true);
    expect(stmts.some((s) => s.includes('UPDATE license_keys SET resume_generated_at'))).toBe(true);
  });

  it('re-serves the stored PDF without calling the LLM when already generated', async () => {
    mockResumeKeyRow = {
      key: 'LKX-1',
      linkedin_id: 'li-1',
      status: 'active',
      resume_generated_at: new Date().toISOString(),
    };

    // Even a junk body must not matter once the one-time resume exists.
    const response = await post({ key: 'LKX-1', linkedinId: 'li-1' });
    expect(response.status).toBe(200);
    expect(callLLMJson).not.toHaveBeenCalled();
    expect(renderResumePdf).not.toHaveBeenCalled();
  });

  it('does not spend the one-time resume on an empty LinkedIn scrape', async () => {
    const response = await post({ key: 'LKX-1', linkedinId: 'li-1', name: 'Priya Nayak', headline: '', about: '', experience: '', education: '', skills: '' });
    expect(response.status).toBe(422);
    const body: any = await response.json();
    expect(body.code).toBe('profile_incomplete');
    expect(body.error).toMatch(/not been used/i);
    expect(callLLMJson).not.toHaveBeenCalled();
    expect(sqlStatements().some((s) => s.includes('UPDATE license_keys'))).toBe(false);
  });

  it('removes fabricated employers, numbers and skills before rendering', async () => {
    mockLlmOutput.experience.push({
      title: 'Principal Engineer',
      company: 'Google',
      start: 'Jan 2010',
      end: 'Dec 2011',
      bullets: ['Led a team of 40 engineers'],
    });
    mockLlmOutput.experience[0].bullets.push('Increased revenue by 250% through a pricing overhaul');
    mockLlmOutput.skills[0].items.push('Kubernetes', 'Rust');

    const response = await post(PROFILE);
    expect(response.status).toBe(200);
    // first attempt had hard issues → exactly one corrective retry (which returns the same bad output)
    expect(callLLMJson).toHaveBeenCalledTimes(2);

    const [data] = vi.mocked(renderResumePdf).mock.calls[0];
    expect(data.experience.map((r: any) => r.company)).not.toContain('Google');
    expect(data.experience[0].bullets.join(' ')).not.toContain('250%');
    expect(data.skills.flatMap((g: any) => g.items)).not.toContain('Rust');
    expect(data.skills.flatMap((g: any) => g.items)).not.toContain('Kubernetes');
    expect(data.skills.flatMap((g: any) => g.items)).toContain('Node.js');
  });

  it('passes the selected template and page size to the renderer', async () => {
    await post({ ...PROFILE, template: 'classic', pageSize: 'letter' });
    const [data, template] = vi.mocked(renderResumePdf).mock.calls[0];
    expect(template).toBe('classic');
    expect(data.pageSize).toBe('letter');
  });

  it('returns generation_failed (and does not consume the gate) when the LLM fails', async () => {
    mockLlmResumeThrows = true;
    const response = await post(PROFILE);
    expect(response.status).toBe(502);
    expect(((await response.json()) as any).error).toBe('generation_failed');
    expect(sqlStatements().some((s) => s.includes('UPDATE license_keys'))).toBe(false);
  });

  it('returns a friendly error (and does not consume the gate) if PDF rendering fails', async () => {
    mockRenderThrows = true;
    const response = await post(PROFILE);
    expect(response.status).toBe(500);
    const body: any = await response.json();
    expect(body.code).toBe('render_failed');
    expect(body.error).toMatch(/not been used/i);
    expect(sqlStatements().some((s) => s.includes('UPDATE license_keys'))).toBe(false);
  });
});
