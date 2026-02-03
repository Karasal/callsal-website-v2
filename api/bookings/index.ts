import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from '../lib/storage.js';

export interface Booking {
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
const ADMIN_SECRET = process.env.ADMIN_SECRET;
const ALLOWED_ORIGINS = ['https://callsal.app', 'https://www.callsal.app', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

// Input validation helpers
const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidDate = (date: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(date);
const isValidTime = (time: string): boolean => /^\d{2}:\d{2}$/.test(time);
const isValidMeetingType = (type: string): type is 'zoom' | 'in-person' | 'phone' =>
  ['zoom', 'in-person', 'phone'].includes(type);
const isValidStatus = (status: string): status is 'pending' | 'confirmed' | 'cancelled' =>
  ['pending', 'confirmed', 'cancelled'].includes(status);
const sanitizeString = (str: string, maxLength = 500): string =>
  String(str || '').slice(0, maxLength).replace(/[<>]/g, '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS - restrict to allowed origins
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Admin-Secret');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Helper to check admin auth
  const isAdminAuthorized = (): boolean => {
    if (!ADMIN_SECRET) return false;
    const providedSecret = req.headers['x-admin-secret'];
    return providedSecret === ADMIN_SECRET;
  };

  try {
    // GET - List all bookings (ADMIN ONLY)
    if (req.method === 'GET') {
      if (!isAdminAuthorized()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const storage = await getStorage();
      const bookings = await storage.get<Booking[]>(BOOKINGS_KEY) || [];

      // Filter out cancelled and past bookings for the list
      const now = new Date();
      const activeBookings = bookings.filter(b => {
        if (b.status === 'cancelled') return false;
        const bookingDate = new Date(`${b.date}T${b.time}:00`);
        return bookingDate >= now;
      });

      // Sort by date/time
      activeBookings.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}:00`);
        const dateB = new Date(`${b.date}T${b.time}:00`);
        return dateA.getTime() - dateB.getTime();
      });

      return res.status(200).json({ success: true, bookings: activeBookings });
    }

    // POST - Create new booking (public, but validated)
    if (req.method === 'POST') {
      const { name, email, phone, date, time, meetingType, notes } = req.body;

      // Validate required fields
      if (!name || !email || !date || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate formats
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }
      if (!isValidDate(date)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      if (!isValidTime(time)) {
        return res.status(400).json({ error: 'Invalid time format' });
      }
      if (meetingType && !isValidMeetingType(meetingType)) {
        return res.status(400).json({ error: 'Invalid meeting type' });
      }

      // Sanitize inputs
      const sanitizedName = sanitizeString(name, 100);
      const sanitizedPhone = sanitizeString(phone, 20);
      const sanitizedNotes = sanitizeString(notes, 1000);

      const storage = await getStorage();
      const bookings = await storage.get<Booking[]>(BOOKINGS_KEY) || [];

      // Check for double booking
      const isBooked = bookings.some(b =>
        b.status !== 'cancelled' &&
        b.date === date &&
        b.time === time
      );

      if (isBooked) {
        return res.status(409).json({ error: 'This time slot is already booked' });
      }

      const newBooking: Booking = {
        id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: sanitizedName,
        email: email.toLowerCase().trim(),
        phone: sanitizedPhone,
        date,
        time,
        meetingType: meetingType || 'zoom',
        notes: sanitizedNotes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      bookings.push(newBooking);
      await storage.set(BOOKINGS_KEY, bookings);

      // Don't return full booking details to client
      return res.status(201).json({ success: true, bookingId: newBooking.id });
    }

    // PATCH - Update booking status (ADMIN ONLY)
    if (req.method === 'PATCH') {
      if (!isAdminAuthorized()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { id, status } = req.body;

      if (!id || !status) {
        return res.status(400).json({ error: 'Missing id or status' });
      }

      // Validate status value
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

    // DELETE - Cancel/remove booking (ADMIN ONLY)
    if (req.method === 'DELETE') {
      if (!isAdminAuthorized()) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

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

      // Mark as cancelled instead of deleting (for history)
      bookings[bookingIndex].status = 'cancelled';
      await storage.set(BOOKINGS_KEY, bookings);

      return res.status(200).json({ success: true, message: 'Booking cancelled' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Bookings API error:', err);
    // Don't leak error details to client
    return res.status(500).json({ error: 'Failed to process booking' });
  }
}
