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
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  try {
    const { imageBase64, mimeType = 'image/jpeg', language = 'English' } = req.body || {};
    const ai = getGeminiClient();

    const prompt = `You are Lumi, an expert AI medical assistant. Analyze this prescription document image/PDF scan with high OCR accuracy.
Convert handwriting and medical jargon into clean, plain language that an elderly or non-technical person can easily understand.
Return the output in language: ${language}.
Always provide realistic, complete, helpful healthcare information.

Extract and structure the response as JSON matching this schema:
{
  "doctorName": "Doctor's name or 'Dr. Unknown'",
  "hospital": "Hospital/Clinic name or 'Clinic'",
  "date": "Date on prescription or current date",
  "patientName": "Patient name or 'Patient'",
  "ocrConfidence": 96,
  "medicines": [
    {
      "brandName": "Brand Name (e.g., Metformin 500mg)",
      "genericName": "Generic molecule (e.g., Metformin Hydrochloride)",
      "medicineType": "Tablet/Capsule/Syrup/Injection/Eye drop",
      "purpose": "Simple 1-sentence explanation of why doctor prescribed it",
      "dosage": "500mg - 1 tablet",
      "schedule": {
        "morning": true,
        "afternoon": false,
        "night": true
      },
      "foodTiming": "after_food",
      "durationDays": 30,
      "instructions": "Take with a full glass of water after meals",
      "commonSideEffects": ["Mild nausea", "Upset stomach"],
      "seriousSideEffects": ["Persistent dizziness", "Severe abdominal pain"],
      "warnings": {
        "food": "Avoid excessive sugar intake",
        "alcohol": "Avoid alcohol as it increases risk of lactic acidosis",
        "pregnancy": "Consult doctor if pregnant or planning",
        "driving": "Safe to drive",
        "storage": "Store below 25°C in a dry place"
      },
      "estimatedPrice": "PKR 450 / 30 tablets",
      "genericAlternatives": [
        {
          "name": "Generic Metformin HCl 500mg",
          "price": "PKR 150",
          "savings": "66%"
        }
      ]
    }
  ],
  "generalAdvice": "Take your medicines regularly as directed. Keep hydrated.",
  "disclaimer": "Lumi provides AI-generated information for educational purposes only. Always consult a qualified medical professional for diagnosis and treatment decisions."
}`;

    let contents: any;
    if (imageBase64) {
      const cleanBase64 = imageBase64
        .replace(/^data:image\/\w+;base64,/, '')
        .replace(/^data:application\/pdf;base64,/, '');

      contents = {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: mimeType === 'application/pdf' ? 'image/jpeg' : mimeType,
            },
          },
          { text: prompt },
        ],
      };
    } else {
      contents = prompt + '\nGenerate a comprehensive analysis for a sample prescription.';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const jsonResult = JSON.parse(text);

    return res.status(200).json({ success: true, data: jsonResult });
  } catch (error: any) {
    console.error('Prescription Analysis Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze prescription',
    });
  }
}
