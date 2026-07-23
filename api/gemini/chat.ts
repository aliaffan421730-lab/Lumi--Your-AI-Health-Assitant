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
    const { message, history = [], userProfile, language = 'English', imageBase64 } = req.body || {};
    const ai = getGeminiClient();

    const systemInstruction = `You are Lumi - Your AI Health Assistant.
You speak with warmth, empathetic clarity, and deep health accuracy.
Your job is to translate complex medical terms, prescription instructions, side effects, and health conditions into simple plain language suitable for elderly patients and non-technical users.
Target user language: ${language}.

User Profile Context (if relevant): ${JSON.stringify(userProfile || { name: 'Ali Affan', age: 34, conditions: ['Hypertension'] })}

RULES:
1. Speak plainly and warmly. Never send massive walls of unreadable text. Use bullet points for readability.
2. If asked about medication dosage, food timing, or side effects, explain clearly.
3. ALWAYS include this mandatory disclaimer at the very end of your response:
"Lumi provides AI-generated information for educational purposes only. Always consult a qualified medical professional for medical advice, diagnosis, or treatment."
4. If image attached, analyze medical text or report visible in image.`;

    let contents: any[] = [];
    if (history && history.length > 0) {
      for (const h of history) {
        contents.push({ role: h.role === 'user' ? 'user' : 'model', parts: [{ text: h.text }] });
      }
    }

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:\w+\/\w+;base64,/, '');
      contents.push({
        role: 'user',
        parts: [
          { inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } },
          { text: message || 'Please analyze this medical image/document for me.' },
        ],
      });
    } else {
      contents.push({ role: 'user', parts: [{ text: message }] });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-1.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.status(200).json({
      success: true,
      reply: response.text || 'I am here to help you understand your health. Could you rephrase your question?',
    });
  } catch (error: any) {
    console.error('Chat Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to process AI chat query',
    });
  }
}
