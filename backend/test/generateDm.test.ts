import { describe, it, expect, vi } from 'vitest';

let mockDmResult: any = { message: 'Hi, I noticed we both work with React...' };
let mockDmThrows = false;
let mockDmKeyRow: any = { key: 'LKX-1', linkedin_id: 'li-1', status: 'active' };

vi.mock('../src/lib/llm', () => ({
  callLLMJson: vi.fn(async () => {
    if (mockDmThrows) throw new Error('llm_json_parse_failed');
    return mockDmResult;
  }),
}));

vi.mock('../src/lib/db', () => ({
  getDb: vi.fn(() => {
    let callCount = 0;
    return vi.fn(async () => {
      callCount++;
      if (callCount === 1) return [mockDmKeyRow];
      if (callCount === 2) return [{ count: '0' }];
      return [];
    });
  }),
}));

const { handleGenerateDm } = await import('../src/routes/generateDm');

describe('handleGenerateDm', () => {
  it('returns a 75-word-scale referral message for a valid key', async () => {
    mockDmKeyRow = { key: 'LKX-1', linkedin_id: 'li-1', status: 'active' };
    mockDmThrows = false;

    const request = new Request('https://x/generate-dm', {
      method: 'POST',
      body: JSON.stringify({
        key: 'LKX-1',
        linkedinId: 'li-1',
        viewerStack: 'React, Node.js',
        targetName: 'Jane Doe',
        targetHeadline: 'Senior Engineer at Acme',
      }),
    });

    const response = await handleGenerateDm(request, {} as any);
    const body = await response.json<any>();

    expect(response.status).toBe(200);
    expect(typeof body.message).toBe('string');
  });

  it('returns 403 for a mismatched linkedin account', async () => {
    mockDmKeyRow = { key: 'LKX-1', linkedin_id: 'li-OTHER', status: 'active' };

    const request = new Request('https://x/generate-dm', {
      method: 'POST',
      body: JSON.stringify({
        key: 'LKX-1',
        linkedinId: 'li-1',
        viewerStack: 'React',
        targetName: 'Bob',
        targetHeadline: 'Manager',
      }),
    });

    const response = await handleGenerateDm(request, {} as any);
    expect(response.status).toBe(403);
  });
});
