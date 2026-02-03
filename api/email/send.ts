import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getStorage } from '../lib/storage.js';
import nodemailer from 'nodemailer';

// SMTP Config - Namecheap Private Email
const SMTP_HOST = 'mail.privateemail.com';
const SMTP_PORT = 465;
const SMTP_USER = process.env.SMTP_USER || 'info@callsal.app';
const SMTP_PASS = process.env.SMTP_PASS;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@callsal.app';

const ALLOWED_ORIGINS = ['https://callsal.app', 'https://www.callsal.app', 'http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'];

// HTML escape to prevent XSS/injection in emails
const escapeHtml = (str: string): string =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Input validation
const isValidEmail = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const sanitizeString = (str: string, maxLength = 500): string =>
  String(str || '').slice(0, maxLength);

// Convert 24h time to 12h format (e.g., "14:00" -> "2 PM")
const formatTime12h = (time: string): string => {
  const [hourStr, minute] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return minute === '00' ? `${hour} ${ampm}` : `${hour}:${minute} ${ampm}`;
};

// Format date as "MONDAY - JAN 26"
const formatDateFriendly = (dateStr: string): string => {
  const date = new Date(dateStr + 'T12:00:00');
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${days[date.getDay()]} - ${months[date.getMonth()]} ${date.getDate()}`;
};

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  meetingType: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

const BOOKINGS_KEY = 'callsal:bookings';

// Create SMTP transporter
function createTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials not configured');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true, // SSL/TLS on port 465
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

// Send email via SMTP
async function sendEmail(to: string, subject: string, htmlBody: string): Promise<void> {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: `"Call Sal" <${SMTP_USER}>`,
    to,
    subject,
    html: htmlBody,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.includes(origin)) {
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

  const { type } = req.body;

  try {
    // ========== BOOKING FLOW ==========
    if (type === 'booking') {
      // Support both flat and nested data formats
      const bookingData = req.body.data || req.body;
      const { name, email, phone, date, time, meetingType, notes } = bookingData;

      // Validate
      if (!name || !email || !date || !time) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Sanitize
      const safeName = sanitizeString(name, 100);
      const safeEmail = sanitizeString(email, 100);
      const safePhone = sanitizeString(phone || '', 20);
      const safeMeetingType = sanitizeString(meetingType || 'consultation', 50);
      const safeNotes = sanitizeString(notes || '', 1000);

      // Create booking
      const booking: Booking = {
        id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: safeName,
        email: safeEmail,
        phone: safePhone,
        date,
        time,
        meetingType: safeMeetingType,
        notes: safeNotes,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      // Store booking
      try {
        const storage = await getStorage();
        const existingBookings = await storage.get<Booking[]>(BOOKINGS_KEY) || [];
        await storage.set(BOOKINGS_KEY, [...existingBookings, booking]);
      } catch (storageError) {
        console.error('Storage error:', storageError);
      }

      // Randomly pick one of 3 Calgary banner images
      const bannerImages = [
        'https://callsal.app/email-banner-1.jpg',
        'https://callsal.app/email-banner-2.jpg',
        'https://callsal.app/email-banner-3.jpg',
      ];
      const randomBanner = bannerImages[Math.floor(Math.random() * bannerImages.length)];

      // Send confirmation to client - Mobile-first dark brutalist
      const clientEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: Arial, Helvetica, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
            <tr>
              <td style="padding: 16px;" align="center">
                <!-- Wrapper with max-width -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">

                  <!-- Calgary Banner -->
                  <tr>
                    <td style="padding-bottom: 20px;">
                      <img src="${randomBanner}" alt="Sal from Calgary" style="width: 100%; height: auto; display: block;">
                    </td>
                  </tr>

                  <!-- Header -->
                  <tr>
                    <td style="padding: 0 8px 12px 8px; text-align: center;">
                      <p style="margin: 0 0 12px 0; font-size: 10px; letter-spacing: 4px; color: #B400FF; text-transform: uppercase; font-weight: 800;">TRANSMISSION CONFIRMED</p>
                      <h1 style="margin: 0; font-size: 32px; font-weight: 900; color: #CCFF00; letter-spacing: -1px; text-transform: uppercase; line-height: 1;">YOU'RE LOCKED IN</h1>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td style="padding: 20px 8px 28px 8px; text-align: center;">
                      <p style="margin: 0; font-size: 18px; color: #ffffff; font-weight: 500;">Hey <span style="color: #00F0FF; font-weight: 700;">${escapeHtml(safeName)}</span>, you're on the calendar.</p>
                    </td>
                  </tr>

                  <!-- Details Box -->
                  <tr>
                    <td>
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a;">
                        <!-- Date Row -->
                        <tr>
                          <td style="padding: 20px; border-bottom: 1px solid #1a1a1a;">
                            <p style="margin: 0 0 6px 0; font-size: 12px; letter-spacing: 3px; color: #00F0FF; text-transform: uppercase; font-weight: 800;">DATE</p>
                            <p style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase;">${formatDateFriendly(date)}</p>
                          </td>
                        </tr>
                        <!-- Time Row -->
                        <tr>
                          <td style="padding: 20px; border-bottom: 1px solid #1a1a1a;">
                            <p style="margin: 0 0 6px 0; font-size: 12px; letter-spacing: 3px; color: #CCFF00; text-transform: uppercase; font-weight: 800;">TIME</p>
                            <p style="margin: 0; font-size: 22px; font-weight: 900; color: #ffffff; text-transform: uppercase;">${formatTime12h(time)}</p>
                          </td>
                        </tr>
                        <!-- Type Row -->
                        <tr>
                          <td style="padding: 20px;">
                            <p style="margin: 0 0 6px 0; font-size: 12px; letter-spacing: 3px; color: #B400FF; text-transform: uppercase; font-weight: 800;">SESSION</p>
                            <p style="margin: 0; font-size: 22px; font-weight: 900; color: #FF5A00; text-transform: uppercase;">${escapeHtml(safeMeetingType).toUpperCase()}</p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Info Text -->
                  <tr>
                    <td style="padding: 28px 8px;">
                      <p style="margin: 0; font-size: 16px; line-height: 1.7; color: #ffffff; text-align: center;">
                        I'll send you a <span style="color: #00F0FF; font-weight: 700;">confirmation email</span> shortly for details!<br>
                        If something comes up, just reply to this email :)
                      </p>
                    </td>
                  </tr>

                  <!-- Gradient Confirmed Button -->
                  <tr>
                    <td align="center" style="padding: 0 8px 28px 8px;">
                      <table role="presentation" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding: 16px 40px; background: linear-gradient(135deg, #00F0FF 0%, #CCFF00 100%); font-size: 13px; letter-spacing: 3px; color: #000000; font-weight: 900; text-transform: uppercase;">
                            ✓ CONFIRMED
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="padding: 28px 8px 0 8px; text-align: center; border-top: 1px solid #1a1a1a;">
                      <!-- Logo Box -->
                      <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-bottom: 16px;">
                        <tr>
                          <td style="background-color: #ffffff; padding: 10px 20px;">
                            <span style="font-size: 20px; font-weight: 900; color: #000000; letter-spacing: -1px; text-transform: uppercase;">CALL SAL.</span>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 0 0 12px 0; font-size: 12px; color: #ffffff; text-transform: uppercase; letter-spacing: 2px; font-weight: 600;">AI-Powered Business Solutions</p>
                      <a href="https://callsal.app" style="font-size: 14px; color: #00F0FF; text-decoration: none; font-weight: 700;">callsal.app</a>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      // Send notification to admin - Mobile-first dark brutalist
      const adminEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: Arial, Helvetica, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
            <tr>
              <td style="padding: 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                  <tr>
                    <td style="padding: 0 0 20px 0;">
                      <p style="margin: 0 0 10px 0; font-size: 10px; letter-spacing: 4px; color: #B400FF; font-weight: 800; text-transform: uppercase;">INCOMING TRANSMISSION</p>
                      <h1 style="margin: 0; font-size: 28px; color: #CCFF00; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">NEW BOOKING</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #0a0a0a;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;"><p style="margin: 0 0 4px 0; font-size: 12px; color: #00F0FF; letter-spacing: 3px; font-weight: 800; text-transform: uppercase;">NAME</p><p style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 900;">${escapeHtml(safeName)}</p></td></tr>
                        <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;"><p style="margin: 0 0 4px 0; font-size: 12px; color: #CCFF00; letter-spacing: 3px; font-weight: 800; text-transform: uppercase;">EMAIL</p><p style="margin: 0; font-size: 16px; color: #00F0FF; font-weight: 700;">${escapeHtml(safeEmail)}</p></td></tr>
                        <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;"><p style="margin: 0 0 4px 0; font-size: 12px; color: #00F0FF; letter-spacing: 3px; font-weight: 800; text-transform: uppercase;">PHONE</p><p style="margin: 0; font-size: 16px; color: #ffffff; font-weight: 600;">${escapeHtml(safePhone) || 'Not provided'}</p></td></tr>
                        <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;"><p style="margin: 0 0 4px 0; font-size: 12px; color: #CCFF00; letter-spacing: 3px; font-weight: 800; text-transform: uppercase;">DATE</p><p style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 900;">${escapeHtml(date)}</p></td></tr>
                        <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;"><p style="margin: 0 0 4px 0; font-size: 12px; color: #00F0FF; letter-spacing: 3px; font-weight: 800; text-transform: uppercase;">TIME</p><p style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 900;">${formatTime12h(time)}</p></td></tr>
                        <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;"><p style="margin: 0 0 4px 0; font-size: 12px; color: #B400FF; letter-spacing: 3px; font-weight: 800; text-transform: uppercase;">TYPE</p><p style="margin: 0; font-size: 18px; color: #FF5A00; font-weight: 900; text-transform: uppercase;">${escapeHtml(safeMeetingType).toUpperCase()}</p></td></tr>
                        <tr><td style="padding: 16px 20px;"><p style="margin: 0 0 4px 0; font-size: 12px; color: #CCFF00; letter-spacing: 3px; font-weight: 800; text-transform: uppercase;">NOTES</p><p style="margin: 0; font-size: 15px; color: #ffffff; line-height: 1.6;">${escapeHtml(safeNotes) || 'None'}</p></td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      try {
        await Promise.all([
          sendEmail(safeEmail, `Booking Confirmed - ${date} at ${time}`, clientEmailHtml),
          sendEmail(NOTIFICATION_EMAIL, `New Booking: ${safeName} - ${date}`, adminEmailHtml),
        ]);
      } catch (emailError) {
        console.error('Email send error:', emailError);
        // Still return success - booking was saved
      }

      return res.status(200).json({
        success: true,
        message: 'Booking confirmed',
        bookingId: booking.id,
      });
    }

    // ========== CONTACT FORM ==========
    if (type === 'contact') {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      const safeName = sanitizeString(name, 100);
      const safeEmail = sanitizeString(email, 100);
      const safeMessage = sanitizeString(message, 2000);

      const contactEmailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #000000; font-family: Arial, Helvetica, sans-serif;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000;">
            <tr>
              <td style="padding: 16px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px;">
                  <tr>
                    <td style="padding: 0 0 20px 0;">
                      <p style="margin: 0 0 10px 0; font-size: 10px; letter-spacing: 4px; color: #CCFF00; font-weight: 800; text-transform: uppercase;">INCOMING MESSAGE</p>
                      <h1 style="margin: 0; font-size: 28px; color: #00F0FF; font-weight: 900; letter-spacing: -1px; text-transform: uppercase;">CONTACT FORM</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="background-color: #0a0a0a;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;"><p style="margin: 0 0 4px 0; font-size: 12px; color: #CCFF00; letter-spacing: 3px; font-weight: 800; text-transform: uppercase;">NAME</p><p style="margin: 0; font-size: 20px; color: #ffffff; font-weight: 900;">${escapeHtml(safeName)}</p></td></tr>
                        <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;"><p style="margin: 0 0 4px 0; font-size: 12px; color: #00F0FF; letter-spacing: 3px; font-weight: 800; text-transform: uppercase;">EMAIL</p><p style="margin: 0; font-size: 16px; color: #CCFF00; font-weight: 700;">${escapeHtml(safeEmail)}</p></td></tr>
                        <tr><td style="padding: 16px 20px;"><p style="margin: 0 0 8px 0; font-size: 12px; color: #B400FF; letter-spacing: 3px; font-weight: 800; text-transform: uppercase;">MESSAGE</p><p style="margin: 0; font-size: 15px; color: #ffffff; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(safeMessage)}</p></td></tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      try {
        await sendEmail(NOTIFICATION_EMAIL, `Contact: ${safeName}`, contactEmailHtml);
      } catch (emailError) {
        console.error('Email send error:', emailError);
        return res.status(500).json({ error: 'Failed to send message' });
      }

      return res.status(200).json({ success: true, message: 'Message sent' });
    }

    return res.status(400).json({ error: 'Invalid request type' });

  } catch (error) {
    console.error('Email handler error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
