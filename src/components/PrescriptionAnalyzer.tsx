import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

export const PrescriptionAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');

  // Helper function to read image file and convert to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Url = reader.result as string;
        // Strip out the data URL prefix (e.g., "data:image/jpeg;base64,")
        const pureBase64 = base64Url.replace(/^data:image\/\w+;base64,/, '');
        resolve(pureBase64);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setResult('');

    try {
      // 1. Fetch API key from Vite environment variables
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!apiKey) {
        throw new Error(
          'Missing API key! Please add VITE_GEMINI_API_KEY to your .env file.'
        );
      }

      // 2. Convert uploaded file to pure Base64
      const base64Data = await fileToBase64(file);

      // 3. Initialize Gemini Client directly on frontend
      const ai = new GoogleGenAI({ apiKey });

      // 4. Send image to Gemini-2.5-flash
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type || 'image/jpeg',
            },
          },
          'Please analyze this medical prescription in detail. List medications, dosages, and usage instructions clearly.',
        ],
      });

      setResult(response.text || 'No description generated.');
    } catch (err: any) {
      console.error('Scanning error:', err);
      setError(err.message || 'Failed to scan image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Prescription Analyzer</h2>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={loading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {loading && <p className="text-blue-600 font-medium animate-pulse">Scanning image with Gemini...</p>}
      
      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-md">
          {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <h3 className="font-semibold text-gray-700 mb-2">Analysis Result:</h3>
          <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{result}</p>
        </div>
      )}
    </div>
  );
};
