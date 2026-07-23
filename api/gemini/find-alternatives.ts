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
    const { medicineName, language = 'English' } = req.body || {};
    const ai = getGeminiClient();

    const prompt = `You are Lumi AI. Find affordable generic alternatives for the medicine "${medicineName}".
Language: ${language}.
Output JSON format:
{
  "brandName": "${medicineName}",
  "genericName": "Chemical Active Ingredient",
  "estimatedBrandPrice": "PKR 1,200 / pack",
  "alternatives": [
    {
      "name": "Generic Equivalent Brand 1",
      "manufacturer": "Drug Regulatory Authority of Pakistan (DRAP) Approved",
      "price": "PKR 250 / pack",
      "savingsPercent": 78,
      "similarityScore": "99% Identical Active Formula",
      "notes": "Bioequivalent formulation with same active molecule and efficacy"
    },
    {
      "name": "Generic Equivalent Brand 2",
      "manufacturer": "Quality Pharma Pakistan",
      "price": "PKR 350 / pack",
      "savingsPercent": 70,
      "similarityScore": "99% Identical Active Formula",
      "notes": "Widely available generic substitute in local pharmacies"
    }
  ],
  "disclaimer": "Consult your doctor or pharmacist before switching medication brands."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text || '{}';
    return res.status(200).json({ success: true, data: JSON.parse(text) });
  } catch (error: any) {
    console.error('Find Alternatives Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to find alternatives',
    });
  }
}
