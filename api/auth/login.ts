import type { VercelRequest, VercelResponse } from '@vercel/node';

// Config from environment - MUST be set in Vercel
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'callsal_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days
const ADMIN_AVATAR = 'https://i.ibb.co/m5YMYQR6/Generated-Image-January-12-2026-1-46-PM.jpg';

// Users loaded from environment variable
function getUsers() {
  const usersJson = process.env.ADMIN_USERS;
  if (!usersJson) return [];
  try {
    return JSON.parse(usersJson);
  } catch {
    return [];
  }
}

const allowedOrigins = [
  'https://callsal.app',
  'https://www.callsal.app',
  'https://crm.callsal.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173'
];

// Also allow Vercel preview deployments
function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.includes(origin)) return true;
  // Allow Vercel preview URLs for callsal projects
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

  try {
    // Dynamic imports for ESM compatibility
    const jwt = (await import('jsonwebtoken')).default;
    const bcrypt = (await import('bcryptjs')).default;

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    // Find user
    const USERS = getUsers();
    if (USERS.length === 0) {
      console.error('ADMIN_USERS not configured or invalid JSON');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    if (!JWT_SECRET) {
      console.error('JWT_SECRET not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    const user = USERS.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      console.error('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password using bcrypt
    const passwordValid = bcrypt.compareSync(password, user.passwordHash);
    if (!passwordValid) {
      console.error('Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check onboarding status for clients only
    let hasCompletedOnboarding = true; // Default true for admins
    if (user.role === 'client') {
      try {
        const { getOnboardingStatus } = await import('../lib/auth');
        hasCompletedOnboarding = await getOnboardingStatus(user.id);
      } catch (e) {
        console.error('Failed to get onboarding status:', e);
        // Continue with default value
      }
    }

    // Create JWT token - override avatar for admin users
    const authUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.role === 'admin' ? ADMIN_AVATAR : user.avatar,
      hasCompletedOnboarding
    };

    const token = jwt.sign(
      {
        sub: authUser.id,
        email: authUser.email,
        name: authUser.name,
        role: authUser.role,
        avatar: authUser.avatar,
        hasCompletedOnboarding: authUser.hasCompletedOnboarding
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set httpOnly cookie
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    const domain = isProduction ? '; Domain=.callsal.app' : '';
    res.setHeader('Set-Cookie', [
      `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${isProduction ? '; Secure' : ''}${domain}`
    ]);

    return res.status(200).json({
      success: true,
      user: authUser
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      error: 'Login failed. Please try again.'
    });
  }
}
