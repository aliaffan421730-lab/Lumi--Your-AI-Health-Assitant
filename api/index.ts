import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
app.use(express.json({ limit: '20mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const cleanJson = (text: string) => text.replace(/```json|```/g, "").trim();

// 1. Lab Report Analyzer
app.post("/api/gemini/analyze-lab-report", async (req, res) => {
  try {
    const { imageBase64 } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze this lab report. Return ONLY JSON: {"reportType":"","labName":"","date":"","patientName":"","summary":"","parameters":[{"parameterName":"","value":"","unit":"","referenceRange":"","status":"normal/low/high","aiExplanation":"","recommendations":[]}]}`;
    
    if (!imageBase64) {
       return res.json({ success: true, data: { reportType: "Sample Report", summary: "Please upload an image.", parameters: [] } });
    }

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBase64.split(',')[1], mimeType: "image/jpeg" } }
    ]);
    res.json({ success: true, data: JSON.parse(cleanJson(result.response.text())) });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// 2. Drug Interaction Checker
app.post("/api/gemini/check-interactions", async (req, res) => {
  try {
    const { medications } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Check interactions for: ${medications.join(", ")}. Return ONLY JSON: {"interactions":[], "severity": "low/high", "advice": ""}`);
    res.json({ success: true, data: JSON.parse(cleanJson(result.response.text())) });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// 3. Find Alternative Medicines
app.post("/api/gemini/find-alternatives", async (req, res) => {
  try {
    const { medicine } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Suggest alternatives for ${medicine}. Return ONLY JSON: {"alternatives":[]}`);
    res.json({ success: true, data: JSON.parse(cleanJson(result.response.text())) });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

// 4. Medical Dictionary
app.post("/api/gemini/translate-term", async (req, res) => {
  try {
    const { term } = req.body;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(`Explain ${term}. Return ONLY JSON: {"term":"","definition":"","simpleExplanation":"","uses":"","warnings":""}`);
    res.json({ success: true, data: JSON.parse(cleanJson(result.response.text())) });
  } catch (e: any) { res.status(500).json({ success: false, error: e.message }); }
});

export default app;
