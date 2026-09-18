import type { Env } from './db';

function extractJson(raw: string): any {
  let cleaned = raw.trim();
  // Strip markdown code fences
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  cleaned = cleaned.trim();

  // Extract JSON object if surrounded by extra text
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    cleaned = cleaned.substring(start, end + 1);
  }

  return JSON.parse(cleaned);
}

export async function callLLM(env: Env, systemPrompt: string, userContent: string): Promise<string> {
  const models = [
    'gemini-flash-latest',
    'gemini-3.5-flash',
    'gemini-3.1-flash-lite',
    'gemini-pro-latest',
  ];

  let lastError: any = null;

  for (const model of models) {
    try {
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.LLM_API_KEY}`,
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

      if (resp.ok) {
        const data = await resp.json<any>();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      } else {
        const errBody = await resp.text().catch(() => '<no body>');
        console.error(`[llm] model=${model} status=${resp.status} body=${errBody}`);
        lastError = new Error(`LLM call failed (${model}): ${resp.status} - ${errBody}`);
      }
    } catch (err) {
      console.error(`[llm] model=${model} fetch error:`, err);
      lastError = err;
    }
  }

  throw lastError || new Error('All LLM models failed');
}

export async function callLLMJson(env: Env, systemPrompt: string, userContent: string): Promise<any> {
  const safeContent =
    typeof userContent === 'string' && userContent.length > 15000
      ? userContent.slice(0, 15000)
      : userContent;

  const raw = await callLLM(env, systemPrompt, safeContent);
  try {
    return extractJson(raw);
  } catch {
    // Retry once with a stricter prompt
    const stricterPrompt = `${systemPrompt}\n\nYour previous response was not valid JSON. Return ONLY valid JSON, with no surrounding text or markdown fences.`;
    const retryRaw = await callLLM(env, stricterPrompt, safeContent);
    try {
      return extractJson(retryRaw);
    } catch {
      throw new Error('llm_json_parse_failed');
    }
  }
}
