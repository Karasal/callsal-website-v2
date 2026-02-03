import type { VercelRequest, VercelResponse } from '@vercel/node';

// Config from environment - MUST be set in Vercel
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'callsal_auth';
const ADMIN_AVATAR = 'https://i.ibb.co/m5YMYQR6/Generated-Image-January-12-2026-1-46-PM.jpg';

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

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get token from cookies
    const cookies = req.headers.cookie;
    if (!cookies) {
      return res.status(401).json({ error: 'Not authenticated', user: null });
    }

    const match = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    const token = match ? match[1] : null;

    if (!token) {
      return res.status(401).json({ error: 'Not authenticated', user: null });
    }

    // Verify token (dynamic import for ESM compatibility)
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    const jwt = (await import('jsonwebtoken')).default;
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
      name: string;
      role: string;
      avatar: string;
      hasCompletedOnboarding?: boolean;
    };

    // For clients, check latest onboarding status from KV (in case it changed)
    let hasCompletedOnboarding = payload.hasCompletedOnboarding ?? true;
    if (payload.role === 'client') {
      const { getOnboardingStatus } = await import('../lib/auth.js');
      hasCompletedOnboarding = await getOnboardingStatus(payload.sub);
    }

    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      avatar: payload.role === 'admin' ? ADMIN_AVATAR : payload.avatar,
      hasCompletedOnboarding
    };

    return res.status(200).json({
      success: true,
      user
    });
  } catch (err) {
    console.error('Auth check error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: 'Auth check failed', details: errorMessage });
  }
}
