import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI } from '@google/genai';

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is missing.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: { 'User-Agent': 'aistudio-build' },
    },
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { term, language = 'English' } = req.body || {};
    const ai = getGeminiClient();

    const prompt = `Explain the medical term or word "${term}" in exactly ONE simple sentence in plain language suitable for a 10-year-old or non-medical elderly person.
Target language: ${language}.

Return JSON:
{
  "term": "${term}",
  "definition": "One simple sentence plain language definition",
  "category": "Condition / Lab Test / Drug Class / Body Part / Procedure",
  "simpleExample": "e.g. Having hypertension is like water running through a garden hose under very high pressure."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text || '{}';
    return res.status(200).json({ success: true, data: JSON.parse(text) });
  } catch (error: any) {
    console.error('Dictionary Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to explain term',
    });
  }
}
