// pages/api/generate.js (or equivalent serverless function)

import { GoogleGenAI } from '@google/genai';

// 🚨 STEP 1: Access the secret variable using process.env
const apiKey = process.env.GEMINI_API_KEY;

// 🚨 STEP 2: Initialize the client using the variable
// The GoogleGenAI constructor is a great place to pass the key.
if (!apiKey) {
    // This check is important for debugging!
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Example of using the model securely on the backend
    try {
        const { prompt } = req.body;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash", 
            contents: prompt,
        });

        res.status(200).json({ text: response.text });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ message: 'An error occurred during API call.' });
    }
}