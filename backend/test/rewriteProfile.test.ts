import { describe, it, expect, vi } from 'vitest';

// Mutable state shared by top-level mocks
let mockLlmResult: any = {
  headline: 'Backend Engineer | Node.js, Postgres | Ex-TCS',
  about: 'Line one.\nLine two.\nLine three.',
  experience: ['Built X reducing latency by 40%.'],
};
let mockLlmThrows = false;

let mockKeyRow: any = { key: 'LKX-1', linkedin_id: 'li-1', status: 'active' };

vi.mock('../src/lib/llm', () => ({
  callLLMJson: vi.fn(async () => {
    if (mockLlmThrows) throw new Error('llm_json_parse_failed');
    return mockLlmResult;
  }),
}));

vi.mock('../src/lib/db', () => ({
  getDb: vi.fn(() => {
    let callCount = 0;
    return vi.fn(async () => {
      callCount++;
      if (callCount === 1) return [mockKeyRow];      // SELECT key, linkedin_id, status
      if (callCount === 2) return [{ count: '0' }]; // SELECT count(*)
      return [];                                      // INSERT / UPDATE
    });
  }),
}));

const { handleRewriteProfile } = await import('../src/routes/rewriteProfile');

describe('handleRewriteProfile', () => {
  it('returns structured rewrite JSON for a valid, bound key', async () => {
    mockKeyRow = { key: 'LKX-1', linkedin_id: 'li-1', status: 'active' };
    mockLlmThrows = false;
    mockLlmResult = {
      headline: 'Backend Engineer | Node.js, Postgres | Ex-TCS',
      about: 'Line one.\nLine two.\nLine three.',
      experience: ['Built X reducing latency by 40%.'],
    };

    const request = new Request('https://x/rewrite-profile', {
      method: 'POST',
      body: JSON.stringify({
        key: 'LKX-1',
        linkedinId: 'li-1',
        headline: 'Software dev',
        about: 'I like coding',
        experience: 'Worked at TCS for 2 years',
      }),
    });

    const response = await handleRewriteProfile(request, {} as any);
    const body = await response.json<any>();

    expect(response.status).toBe(200);
    expect(body.headline).toContain('Backend Engineer');
    expect(Array.isArray(body.experience)).toBe(true);
  });

  it('returns 502 when the LLM returns unparseable JSON twice in a row', async () => {
    mockKeyRow = { key: 'LKX-1', linkedin_id: 'li-1', status: 'active' };
    mockLlmThrows = true;

    const request = new Request('https://x/rewrite-profile', {
      method: 'POST',
      body: JSON.stringify({ key: 'LKX-1', linkedinId: 'li-1', headline: 'x', about: 'y', experience: 'z' }),
    });

    const response = await handleRewriteProfile(request, {} as any);
    expect(response.status).toBe(502);
  });

  it('returns 403 when the key is bound to a different linkedin account', async () => {
    mockKeyRow = { key: 'LKX-1', linkedin_id: 'li-OTHER', status: 'active' };
    mockLlmThrows = false;

    const request = new Request('https://x/rewrite-profile', {
      method: 'POST',
      body: JSON.stringify({ key: 'LKX-1', linkedinId: 'li-1', headline: 'x', about: 'y', experience: 'z' }),
    });

    const response = await handleRewriteProfile(request, {} as any);
    expect(response.status).toBe(403);
  });
});
