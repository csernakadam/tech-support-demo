import { GoogleGenAI } from '@google/genai';

// 1. Get the API Key securely from Vercel Environment Variables
// Vercel makes environment variables available via the Node.js global 'process.env' object.
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    // This error will appear in your Vercel runtime logs if the variable is not set correctly.
    console.error("CRITICAL ERROR: GEMINI_API_KEY is not set in environment variables. Check Vercel project settings.");
}

// 2. Initialize the GoogleGenAI client
// The client uses the API key securely on the server.
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;


/**
 * Vercel Serverless Function Handler
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
    // Enforce POST method for security
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Check if API key was loaded (should be handled by Vercel)
    if (!ai) {
        return res.status(500).json({ text: 'API Key not configured on the server.' });
    }

    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ text: 'Prompt is missing in the request body.' });
        }

        console.log('Received prompt:', prompt);

        // 3. Call the Gemini API
        const response = await ai.models.generateContent({
            // Using a powerful, low-latency model for chat
            model: "gemini-2.5-flash", 
            contents: prompt,
        });

        // 4. Send the result back to the frontend
        res.status(200).json({ text: response.text });

    } catch (error) {
        // Log the full error to Vercel logs for debugging
        console.error('Gemini API Call Failed:', error.message || error);
        
        // Send a generic error message to the client
        res.status(500).json({ text: 'An error occurred while contacting the Gemini service.' });
    }
}
