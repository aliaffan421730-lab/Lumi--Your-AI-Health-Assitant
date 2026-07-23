import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '20mb' }));

// Initialize Gemini Client
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

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Prescription AI OCR & Analysis
app.post('/api/gemini/analyze-prescription', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', language = 'English' } = req.body;
    const ai = getGeminiClient();
    const prompt = `You are Lumi, an expert AI medical assistant. Analyze this prescription document image/PDF scan with high OCR accuracy...`; // Keep original prompt

    let contents: any;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '').replace(/^data:application\/pdf;base64,/, '');
      contents = {
        parts: [
          { inlineData: { data: cleanBase64, mimeType: mimeType === 'application/pdf' ? 'image/jpeg' : mimeType } },
          { text: prompt },
        ],
      };
    } else {
      contents = prompt + '\nGenerate a sample prescription response...';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: { responseMimeType: 'application/json' },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to analyze prescription' });
  }
});

// 3. Lab Report Analyzer
app.post('/api/gemini/analyze-lab-report', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', language = 'English' } = req.body;
    const ai = getGeminiClient();
    const prompt = `You are Lumi, an expert AI medical lab analyst...`; // Keep original prompt

    let contents: any;
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:\w+\/\w+;base64,/, '');
      contents = { parts: [{ inlineData: { data: cleanBase64, mimeType } }, { text: prompt }] };
    } else {
      contents = prompt + '\nAnalyze a sample lab report...';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: { responseMimeType: 'application/json' },
    });

    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to analyze lab report' });
  }
});

// 4. Drug Interaction Checker
app.post('/api/gemini/check-interactions', async (req: Request, res: Response) => {
  try {
    const { medicines, language = 'English' } = req.body;
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Evaluate drug interactions for: ${JSON.stringify(medicines)}`,
      config: { responseMimeType: 'application/json' },
    });
    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to check interactions' });
  }
});

// 5. Affordable Alternatives
app.post('/api/gemini/find-alternatives', async (req: Request, res: Response) => {
  try {
    const { medicineName, language = 'English' } = req.body;
    const ai = getGeminiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find generic alternatives for "${medicineName}".`,
      config: { responseMimeType: 'application/json' },
    });
    res.json({ success: true, data: JSON.parse(response.text || '{}') });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Failed to find alternatives' });
  }
});

// 6. Ask Lumi Chatbot
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], userProfile, language = 'English', imageBase64 } = req.body;
    const ai = getGeminiClient();

    let contents: any[] = history.map((h: any) => ({
      role: h.role === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }],
    }));

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:\w+\/\w+;base64,/, '');
      contents.push({
        role: 'user',
        parts: [{ inlineData: { data: cleanBase64, mimeType: 'image/jpeg' } }, { text: message || 'Analyze image' }],
      });
    } else {
      contents.push({ role: 'user', parts: [{ text: message }] });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: { systemInstruction: 'You are Lumi, an empathetic AI Health Assistant.' },
    });

    res.json({ success: true, reply: response.text });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error?.message || 'Chat error' });
  }
});

// Export Express App as Vercel Serverless Function
export default app;
