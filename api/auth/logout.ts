import type { VercelRequest, VercelResponse } from '@vercel/node';

// Inline config
const COOKIE_NAME = 'callsal_auth';

const allowedOrigins = [
  'https://callsal.app',
  'https://www.callsal.app',
  'https://crm.callsal.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
];

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.includes(origin)) return true;
  if (origin.match(/^https:\/\/callsal.*\.vercel\.app$/)) return true;
  return false;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers.origin || '';
  if (isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Clear the auth cookie — match domain to origin
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const isCallsalDomain = origin.includes('callsal.app') && !origin.includes('vercel.app');
  const domain = isCallsalDomain ? '; Domain=.callsal.app' : '';
  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProduction ? '; Secure' : ''}${domain}`
  ]);

  return res.status(200).json({
    success: true,
    message: 'Logged out'
  });
}
