import type { Env } from './db';

export async function callLLM(env: Env, systemPrompt: string, userContent: string): Promise<string> {
  const resp = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${env.LLM_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userContent }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    }
  );
  if (!resp.ok) {
    throw new Error(`llm call failed: ${resp.status}`);
  }
  const data = await resp.json<any>();
  return data.candidates[0].content.parts[0].text;
}

export async function callLLMJson(env: Env, systemPrompt: string, userContent: string): Promise<any> {
  const raw = await callLLM(env, systemPrompt, userContent);
  try {
    return JSON.parse(raw);
  } catch {
    // Retry once with a stricter prompt per spec §9
    const stricterPrompt = `${systemPrompt}\n\nYour previous response was not valid JSON. Return ONLY valid JSON, with no surrounding text or markdown fences.`;
    const retryRaw = await callLLM(env, stricterPrompt, userContent);
    try {
      return JSON.parse(retryRaw);
    } catch {
      throw new Error('llm_json_parse_failed');
    }
  }
}
