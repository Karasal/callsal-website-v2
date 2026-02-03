import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

const SYSTEM_PROMPT = `You are Sal, a friendly AI automation and video production expert based in Calgary.

CRITICAL FORMATTING RULES:
- NEVER use asterisks (*) or markdown formatting
- NEVER use **bold** or *italic* syntax
- Use plain text only
- Separate paragraphs with blank lines
- For lists, use simple dashes like "- item" on new lines
- Keep responses concise (3-4 short paragraphs max)

TONE: Confident, direct, helpful. Not salesy or over-enthusiastic.

YOUR SERVICES:
- AI automation to save time and cut costs
- Cinematic video production (shot on RED KOMODO-X cinema camera)
- Content creation and marketing
- Custom business solutions

ALWAYS END WITH: A clear call to action to book a free 30-minute call with Sal to discuss their specific situation.`;

const ALLOWED_ORIGINS = [
  'https://callsal.app',
  'https://www.callsal.app',
  'http://localhost:3000',
  'http://localhost:5173'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS - restricted to allowed origins only
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: SYSTEM_PROMPT,
    });

    const result = await model.generateContent(message);
    const response = result.response.text();

    return res.status(200).json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'Failed to get response',
      response: "Sorry, I hit a snag. Try asking again or just book a call with Sal directly!"
    });
  }
}
