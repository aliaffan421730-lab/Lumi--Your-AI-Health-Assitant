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
    const { imageBase64, mimeType = 'image/jpeg', reportType = 'Lab Report', language = 'English' } = req.body || {};
    const ai = getGeminiClient();

    const prompt = `You are Lumi, an expert AI medical lab analyst.
Extract all test parameters from this lab report image/document or request.
Provide simple, plain-language explanations for any abnormal or borderline values so elderly patients or non-technical users can understand what their results mean.
Target response language: ${language}.

Format response as JSON matching this structure:
{
  "reportType": "CBC / Lipid Profile / Liver Function / Blood Glucose",
  "labName": "Diagnostic Lab Name",
  "date": "Report Date",
  "patientName": "Patient Name",
  "parameters": [
    {
      "parameterName": "Hemoglobin",
      "value": "11.2",
      "unit": "g/dL",
      "referenceRange": "13.5 - 17.5 g/dL",
      "status": "low",
      "aiExplanation": "Your hemoglobin is slightly below the normal range. Hemoglobin carries oxygen in your red blood cells. Low levels can cause fatigue or mild anemia.",
      "causes": ["Iron deficiency", "Insufficient red meat/leafy greens", "Mild blood loss"],
      "recommendations": ["Eat iron-rich foods (spinach, lentils, pomegranate)", "Consult doctor about iron supplements"]
    }
  ],
  "summary": "Overall your report shows good organ function with slightly low hemoglobin and mild cholesterol elevation.",
  "healthScoreImpact": -5,
  "disclaimer": "Lumi provides AI-generated information for educational purposes only. Always consult a qualified physician to interpret your lab results."
}`;

    let contents: any;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:\w+\/\w+;base64,/, '');
      contents = {
        parts: [
          { inlineData: { data: cleanBase64, mimeType } },
          { text: prompt },
        ],
      };
    } else {
      contents = prompt + '\nAnalyze a sample CBC and Lipid profile lab report showing Hemoglobin 11.2 g/dL (Low) and Total Cholesterol 225 mg/dL (High).';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text || '{}';
    return res.status(200).json({ success: true, data: JSON.parse(text) });
  } catch (error: any) {
    console.error('Lab Analysis Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze lab report',
    });
  }
}
