import { describe, it, expect, vi } from 'vitest';

let mockResumeKeyRow: any = { key: 'LKX-1', linkedin_id: 'li-1', status: 'active', resume_generated_at: null };
let mockLlmResumeThrows = false;

vi.mock('../src/lib/llm', () => ({
  callLLMJson: vi.fn(async () => {
    if (mockLlmResumeThrows) throw new Error('llm_json_parse_failed');
    return {
      summary: 'Aspiring backend engineer.',
      experience: ['Interned at Acme building APIs.'],
      education: ['B.Tech CSE, XYZ College, 2026'],
      skills: ['Node.js', 'Postgres'],
    };
  }),
}));

vi.mock('../src/lib/pdf', () => ({
  renderResumePdf: vi.fn(async () => new Uint8Array([1, 2, 3])),
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

describe('handleGenerateResume', () => {
  it('generates and stores a new resume when resume_generated_at is null', async () => {
    mockResumeKeyRow = { key: 'LKX-1', linkedin_id: 'li-1', status: 'active', resume_generated_at: null };
    mockLlmResumeThrows = false;

    const { renderResumePdf } = await import('../src/lib/pdf');
    vi.mocked(renderResumePdf).mockClear();

    const request = new Request('https://x/generate-resume', {
      method: 'POST',
      body: JSON.stringify({
        key: 'LKX-1',
        linkedinId: 'li-1',
        name: 'A',
        headline: 'B',
        about: 'C',
        experience: 'D',
        education: 'E',
        skills: 'F',
      }),
    });

    const response = await handleGenerateResume(request, {} as any);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('application/pdf');
    expect(renderResumePdf).toHaveBeenCalledTimes(1);
  });

  it('re-serves the stored PDF without calling the LLM when already generated', async () => {
    mockResumeKeyRow = {
      key: 'LKX-1',
      linkedin_id: 'li-1',
      status: 'active',
      resume_generated_at: new Date().toISOString(),
    };

    const { callLLMJson } = await import('../src/lib/llm');
    vi.mocked(callLLMJson).mockClear();

    const request = new Request('https://x/generate-resume', {
      method: 'POST',
      body: JSON.stringify({ key: 'LKX-1', linkedinId: 'li-1' }),
    });

    const response = await handleGenerateResume(request, {} as any);
    expect(response.status).toBe(200);
    expect(callLLMJson).not.toHaveBeenCalled();
  });
});
