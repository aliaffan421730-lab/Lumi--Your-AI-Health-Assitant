import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for image uploads

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Helper to clean JSON strings from AI
const cleanJson = (text: string) => {
  return text.replace(/```json|```/g, "").trim();
};

// 1. Medical Dictionary Route
app.post("/api/gemini/translate-term", async (req, res) => {
  try {
    const { term, language = "English" } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Explain this medical term for a patient in ${language}: "${term}". 
    Return ONLY JSON: {"term":"","definition":"","simpleExplanation":"","uses":"","warnings":""}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ success: true, data: JSON.parse(cleanJson(response.text())) });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 2. Lab Report / Prescription Analyzer
app.post("/api/gemini/analyze-image", async (req, res) => {
  try {
    const { image, type } = req.body; // image should be base64 string
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this ${type} image and explain it in simple terms for a patient. 
    Highlight key findings and suggest follow-up questions for their doctor.
    Return ONLY JSON: {"summary":"","findings":[],"recommendations":[]}`;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: image.split(',')[1], mimeType: "image/jpeg" } }
    ]);
    
    const response = await result.response;
    res.json({ success: true, data: JSON.parse(cleanJson(response.text())) });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 3. AI Assistant / Chat
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: history });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    res.json({ success: true, message: response.text() });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// 4. Drug Interaction Checker
app.post("/api/gemini/check-interactions", async (req, res) => {
  try {
    const { medications } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Check potential interactions between these medications: ${medications.join(", ")}.
    Return ONLY JSON: {"interactions":[],"severity":"","advice":""}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    res.json({ success: true, data: JSON.parse(cleanJson(response.text())) });
  } catch (e: any) {
    res.status(500).json({ success: false, error: e.message });
  }
});

// IMPORTANT FOR VERCEL
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;
