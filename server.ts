import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

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

// API Endpoints

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 2. Prescription AI OCR & Analysis
app.post('/api/gemini/analyze-prescription', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', language = 'English' } = req.body;
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
      // Clean base64 string if data header present
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '').replace(/^data:application\/pdf;base64,/, '');
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
      contents = prompt + '\nGenerate a comprehensive analysis for a sample diabetes and hypertension prescription with Metformin and Amlodipine.';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const jsonResult = JSON.parse(text);
    res.json({ success: true, data: jsonResult });
  } catch (error: any) {
    console.error('Prescription Analysis Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze prescription',
    });
  }
});

// 3. Lab Report Analyzer
app.post('/api/gemini/analyze-lab-report', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/jpeg', reportType = 'Lab Report', language = 'English' } = req.body;
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
          {
            inlineData: {
              data: cleanBase64,
              mimeType,
            },
          },
          { text: prompt },
        ],
      };
    } else {
      contents = prompt + '\nAnalyze a sample CBC and Lipid profile lab report showing Hemoglobin 11.2 g/dL (Low) and Total Cholesterol 225 mg/dL (High).';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const jsonResult = JSON.parse(text);
    res.json({ success: true, data: jsonResult });
  } catch (error: any) {
    console.error('Lab Analysis Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to analyze lab report',
    });
  }
});

// 4. Drug Interaction Checker
app.post('/api/gemini/check-interactions', async (req: Request, res: Response) => {
  try {
    const { medicines, language = 'English' } = req.body;
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
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const jsonResult = JSON.parse(text);
    res.json({ success: true, data: jsonResult });
  } catch (error: any) {
    console.error('Drug Interaction Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to check interactions',
    });
  }
});

// 5. Affordable Alternatives
app.post('/api/gemini/find-alternatives', async (req: Request, res: Response) => {
  try {
    const { medicineName, language = 'English' } = req.body;
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
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const jsonResult = JSON.parse(text);
    res.json({ success: true, data: jsonResult });
  } catch (error: any) {
    console.error('Find Alternatives Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to find alternatives',
    });
  }
});

// 6. AI Health Chatbot
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, history = [], userProfile, language = 'English', imageBase64 } = req.body;
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
      model: 'gemini-3.6-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      reply: response.text || 'I am here to help you understand your health. Could you rephrase your question?',
    });
  } catch (error: any) {
    console.error('Chat Error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to process AI chat query',
    });
  }
});

// 7. Medical Dictionary & Term Translator
app.post('/api/gemini/medical-dictionary', async (req: Request, res: Response) => {
  try {
    const { term, language = 'English' } = req.body;
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
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text || '{}';
    res.json({ success: true, data: JSON.parse(text) });
  } catch (error: any) {
    console.error('Dictionary Error:', error);
    res.status(500).json({ success: false, error: error?.message || 'Failed to explain term' });
  }
});

// Start Server with Vite Integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lumi Health Assistant Backend listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
