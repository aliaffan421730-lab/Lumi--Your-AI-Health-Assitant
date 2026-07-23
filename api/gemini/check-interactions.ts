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
    const { medicines, language = 'English' } = req.body || {};
    const ai = getGeminiClient();

    const prompt = `You are Lumi AI Health Assistant. Evaluate drug-drug and food-drug interactions for the following list of medications: ${JSON.stringify(medicines)}.
Language: ${language}.
Provide structured JSON with risk severity levels (Safe, Moderate, High Risk), plain-language mechanism descriptions, food/alcohol caveats, and clear action advice.

Schema:
{
  "overallRisk": "Safe" | "Moderate" | "High Risk",
  "summary": "Plain-language summary of safety",
  "interactions": [
    {
      "drug1": "Drug A",
      "drug2": "Drug B",
      "severity": "Moderate",
      "mechanism": "How these two drugs affect each other in body",
      "symptomsToWatch": "Dizziness, low blood pressure",
      "advice": "Take drug A in morning and drug B at night 12 hours apart"
    }
  ],
  "foodWarnings": ["Avoid grapefruit juice", "Do not take on empty stomach"],
  "alcoholWarning": "High risk of dizziness if alcohol consumed",
  "disclaimer": "AI-generated information is for educational purposes only and should not replace professional medical advice."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text || '{}';
    return res.status(200).json({ success: true, data: JSON.parse(text) });
  } catch (error: any) {
    console.error('Drug Interaction Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to check interactions',
    });
  }
}
