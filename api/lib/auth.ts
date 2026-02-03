import type { VercelRequest, VercelResponse } from '@vercel/node';

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: string;
  avatar: string;
  hasCompletedOnboarding?: boolean;
}

// Users loaded from environment variables for security
// Set ADMIN_USERS in Vercel as JSON: [{"id":"admin-sal","email":"...","passwordHash":"...","name":"...","role":"admin","avatar":"..."}]
function getUsers(): StoredUser[] {
  const usersJson = process.env.ADMIN_USERS;
  if (!usersJson) {
    console.error('ADMIN_USERS environment variable not set');
    return [];
  }
  try {
    return JSON.parse(usersJson) as StoredUser[];
  } catch (e) {
    console.error('Failed to parse ADMIN_USERS:', e);
    return [];
  }
}

const USERS = getUsers();

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
  hasCompletedOnboarding?: boolean;
}

// JWT secret - MUST be set in Vercel env vars
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-do-not-use-in-production';
if (!process.env.JWT_SECRET && process.env.VERCEL === '1') {
  throw new Error('CRITICAL: JWT_SECRET environment variable not set');
}

const COOKIE_NAME = 'callsal_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

/**
 * Find user by email
 */
export function findUserByEmail(email: string) {
  return USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Verify password against hash (async for ESM dynamic import)
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = (await import('bcryptjs')).default;
  return bcrypt.compareSync(password, hash);
}

/**
 * Create JWT token (async for ESM dynamic import)
 */
export async function createToken(user: AuthUser): Promise<string> {
  const jwt = (await import('jsonwebtoken')).default;
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      hasCompletedOnboarding: user.hasCompletedOnboarding ?? false
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Verify JWT token and return user (async for ESM dynamic import)
 */
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const jwt = (await import('jsonwebtoken')).default;
    const decoded = jwt.verify(token, JWT_SECRET);
    if (typeof decoded === 'string') return null;
    const payload = decoded as {
      sub: string;
      email: string;
      name: string;
      role: string;
      avatar: string;
      hasCompletedOnboarding?: boolean;
    };
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      avatar: payload.avatar,
      hasCompletedOnboarding: payload.hasCompletedOnboarding ?? false
    };
  } catch {
    return null;
  }
}

/**
 * Set auth cookie on response
 */
export function setAuthCookie(res: VercelResponse, token: string) {
  // Set httpOnly cookie - works across all callsal.app subdomains
  // Domain=.callsal.app allows sharing between callsal.app and crm.callsal.app
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const domain = isProduction ? '; Domain=.callsal.app' : '';

  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${COOKIE_MAX_AGE}${isProduction ? '; Secure' : ''}${domain}`
  ]);
}

/**
 * Clear auth cookie
 */
export function clearAuthCookie(res: VercelResponse) {
  const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
  const domain = isProduction ? '; Domain=.callsal.app' : '';

  res.setHeader('Set-Cookie', [
    `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isProduction ? '; Secure' : ''}${domain}`
  ]);
}

/**
 * Get auth token from request cookies
 */
export function getTokenFromRequest(req: VercelRequest): string | null {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const match = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match ? match[1] : null;
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(req: VercelRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Get onboarding completion status for a user from KV
 */
export async function getOnboardingStatus(userId: string): Promise<boolean> {
  const { getStorage } = await import('./storage.js');
  const storage = await getStorage();
  const status = await storage.get<boolean>(`callsal:onboarding:completed:${userId}`);
  return status ?? false;
}

/**
 * Set onboarding completion status for a user in KV
 */
export async function setOnboardingStatus(userId: string, completed: boolean): Promise<void> {
  const { getStorage } = await import('./storage.js');
  const storage = await getStorage();
  await storage.set(`callsal:onboarding:completed:${userId}`, completed);
}

/**
 * CORS headers for auth endpoints
 */
export function setCorsHeaders(req: VercelRequest, res: VercelResponse) {
  const allowedOrigins = [
    'https://callsal.app',
    'https://www.callsal.app',
    'https://crm.callsal.app',
    ...(process.env.VERCEL !== '1' ? ['http://localhost:3000', 'http://localhost:5173'] : [])
  ];

  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
}
