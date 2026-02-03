import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from '../lib/storage.js';

// Config from environment - MUST be set in Vercel
const JWT_SECRET = process.env.JWT_SECRET;
const COOKIE_NAME = 'callsal_auth';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  avatar: string;
}

// Inline getAuthUser function
async function getAuthUser(req: VercelRequest): Promise<AuthUser | null> {
  const cookies = req.headers.cookie;
  if (!cookies) return null;

  const match = cookies.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = match ? match[1] : null;
  if (!token) return null;

  if (!JWT_SECRET) {
    return null;
  }
  try {
    const jwt = (await import('jsonwebtoken')).default;
    const payload = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      email: string;
      name: string;
      role: string;
      avatar: string;
    };
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      avatar: payload.avatar
    };
  } catch {
    return null;
  }
}

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  meetingType: 'zoom' | 'in-person' | 'phone';
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const BOOKINGS_KEY = 'callsal:bookings';
const ALLOWED_ORIGINS = ['https://callsal.app', 'https://www.callsal.app', 'https://crm.callsal.app', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:5173', 'http://localhost:5174'];

const isValidStatus = (status: string): status is 'pending' | 'confirmed' | 'cancelled' =>
  ['pending', 'confirmed', 'cancelled'].includes(status);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Check admin authorization via JWT cookie
  const user = await getAuthUser(req);

  if (!user || user.role !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized - admin access required' });
  }

  try {
    // GET - List all bookings
    if (req.method === 'GET') {
      const storage = await getStorage();
      const bookings = await storage.get<Booking[]>(BOOKINGS_KEY) || [];

      const now = new Date();
      const activeBookings = bookings.filter(b => {
        if (b.status === 'cancelled') return false;
        const bookingDate = new Date(`${b.date}T${b.time}:00`);
        return bookingDate >= now;
      });

      activeBookings.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}:00`);
        const dateB = new Date(`${b.date}T${b.time}:00`);
        return dateA.getTime() - dateB.getTime();
      });

      return res.status(200).json({ success: true, bookings: activeBookings });
    }

    // PATCH - Update booking status
    if (req.method === 'PATCH') {
      const { id, status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: 'Missing id or status' });
      }

      if (!isValidStatus(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }

      const storage = await getStorage();
      const bookings = await storage.get<Booking[]>(BOOKINGS_KEY) || [];
      const bookingIndex = bookings.findIndex(b => b.id === id);

      if (bookingIndex === -1) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      bookings[bookingIndex].status = status;
      await storage.set(BOOKINGS_KEY, bookings);

      return res.status(200).json({ success: true, booking: bookings[bookingIndex] });
    }

    // DELETE - Cancel booking
    if (req.method === 'DELETE') {
      const { id } = req.query;

      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Missing booking id' });
      }

      const storage = await getStorage();
      const bookings = await storage.get<Booking[]>(BOOKINGS_KEY) || [];
      const bookingIndex = bookings.findIndex(b => b.id === id);

      if (bookingIndex === -1) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      bookings[bookingIndex].status = 'cancelled';
      await storage.set(BOOKINGS_KEY, bookings);

      return res.status(200).json({ success: true, message: 'Booking cancelled' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Admin bookings API error:', err);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
