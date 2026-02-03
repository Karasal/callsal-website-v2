import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from '../lib/storage.js';
import { Booking } from './index';

const BOOKINGS_KEY = 'callsal:bookings';
const ALLOWED_ORIGINS = ['https://callsal.app', 'https://www.callsal.app', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:5173'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const storage = await getStorage();
    const bookings = await storage.get<Booking[]>(BOOKINGS_KEY) || [];

    // Get all non-cancelled bookings for the next 2 weeks
    const now = new Date();
    const twoWeeksLater = new Date();
    twoWeeksLater.setDate(twoWeeksLater.getDate() + 14);

    const bookedSlots = bookings
      .filter(b => {
        if (b.status === 'cancelled') return false;
        const bookingDate = new Date(`${b.date}T${b.time}:00`);
        return bookingDate >= now && bookingDate <= twoWeeksLater;
      })
      .map(b => ({
        start: `${b.date}T${b.time}:00`,
        end: `${b.date}T${String(parseInt(b.time.split(':')[0]) + 1).padStart(2, '0')}:${b.time.split(':')[1]}:00`,
      }));

    return res.status(200).json({
      success: true,
      bookedSlots,
      timeZone: 'America/Edmonton',
    });
  } catch (err) {
    console.error('Availability check error:', err);
    return res.status(500).json({ error: 'Failed to check availability' });
  }
}
