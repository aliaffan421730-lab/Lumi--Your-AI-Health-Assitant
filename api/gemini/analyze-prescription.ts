import { GoogleGenAI } from '@google/genai';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 2. Read the API key from environment variables
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res
        .status(500)
        .json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
    }

    // 3. Initialize the Gemini client
    const ai = new GoogleGenAI({ apiKey });

    // 4. Extract parameters from the request body
    const { image, prompt, mimeType = 'image/jpeg' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image data provided.' });
    }

    // 5. Clean up base64 prefix if passed directly from frontend
    const base64Data = image.includes('base64,')
      ? image.split('base64,')[1]
      : image;

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const defaultPrompt =
      prompt ||
      'Please analyze this medical prescription and detail the medications, dosages, and instructions clearly.';

    // 6. Call the Gemini API using gemini-2.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [defaultPrompt, imagePart],
    });

    // 7. Return the response text
    return res.status(200).json({ result: response.text });
  } catch (error: any) {
    console.error('Error analyzing prescription:', error);
    return res.status(500).json({
      error: 'Failed to analyze prescription',
      details: error.message || String(error),
    });
  }
}
