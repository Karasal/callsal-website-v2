import type { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { getStorage } from '../lib/storage.js';
import { setOnboardingStatus, getAuthUser } from '../lib/auth.js';

// SMTP Config
const SMTP_HOST = 'mail.privateemail.com';
const SMTP_PORT = 465;
const SMTP_USER = process.env.SMTP_USER || 'info@callsal.app';
const SMTP_PASS = process.env.SMTP_PASS;
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'info@callsal.app';

const ALLOWED_ORIGINS = [
  'https://callsal.app',
  'https://www.callsal.app',
  'https://crm.callsal.app',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174'
];

// HTML escape to prevent XSS
const escapeHtml = (str: string): string =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// Input sanitization
const sanitizeString = (str: string, maxLength = 500): string =>
  String(str || '').slice(0, maxLength);

interface OnboardingData {
  clientId: string;
  clientEmail: string;
  clientName: string;
  businessName: string;
  industry: string;
  website?: string;
  ownerStory: string;
  mission: string;
  specialOffer: string;
  shootDay1: { date: string; timePreference: string };
  shootDay2: { date: string; timePreference: string };
  phone: string;
  submittedAt: string;
}

// Create SMTP transporter
function createTransporter() {
  if (!SMTP_USER || !SMTP_PASS) {
    throw new Error('SMTP credentials not configured');
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
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

// Time preference labels
const TIME_LABELS: Record<string, string> = {
  morning: 'Morning (9am - 12pm)',
  afternoon: 'Afternoon (12pm - 5pm)',
  evening: 'Evening (5pm - 8pm)',
  flexible: 'Flexible - Any time works',
};

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

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user is authenticated
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Parse and validate request body
    const data: OnboardingData = req.body;

    // Validate required fields
    if (!data.clientId || !data.businessName || !data.industry || !data.ownerStory ||
        !data.mission || !data.specialOffer || !data.shootDay1?.date || !data.shootDay2?.date || !data.phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Ensure client is submitting their own data
    if (data.clientId !== authUser.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Sanitize all inputs
    const safeData = {
      clientId: sanitizeString(data.clientId, 100),
      clientEmail: sanitizeString(data.clientEmail, 100),
      clientName: sanitizeString(data.clientName, 100),
      businessName: sanitizeString(data.businessName, 200),
      industry: sanitizeString(data.industry, 100),
      website: sanitizeString(data.website || '', 200),
      ownerStory: sanitizeString(data.ownerStory, 2000),
      mission: sanitizeString(data.mission, 1000),
      specialOffer: sanitizeString(data.specialOffer, 500),
      shootDay1: {
        date: sanitizeString(data.shootDay1.date, 20),
        timePreference: sanitizeString(data.shootDay1.timePreference, 20),
      },
      shootDay2: {
        date: sanitizeString(data.shootDay2.date, 20),
        timePreference: sanitizeString(data.shootDay2.timePreference, 20),
      },
      phone: sanitizeString(data.phone, 20),
      submittedAt: new Date().toISOString(),
    };

    // Store onboarding data in KV
    const storage = await getStorage();
    await storage.set(`callsal:onboarding:data:${safeData.clientId}`, safeData);

    // Mark onboarding as completed
    await setOnboardingStatus(safeData.clientId, true);

    // Format dates for display
    const formatDate = (dateStr: string) => {
      try {
        return new Date(dateStr).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return dateStr;
      }
    };

    // Send notification email to Sal
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0a; color: #ffffff; padding: 40px; margin: 0; }
          .container { max-width: 600px; margin: 0 auto; }
          h1 { color: #CCFF00; font-size: 24px; margin-bottom: 8px; letter-spacing: 2px; }
          .subtitle { color: #888; font-size: 14px; margin-bottom: 32px; }
          .section { background: #111; border: 1px solid #222; padding: 20px; margin: 16px 0; }
          .section-title { color: #CCFF00; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 16px; }
          .field { margin: 12px 0; }
          .label { color: #666; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
          .value { color: #fff; font-size: 15px; margin-top: 4px; line-height: 1.5; }
          .story { white-space: pre-wrap; background: #0a0a0a; padding: 12px; margin-top: 8px; border-left: 3px solid #CCFF00; }
          .shoot-card { display: inline-block; background: #1a1a1a; padding: 16px; margin: 8px 8px 8px 0; min-width: 200px; }
          .shoot-number { color: #CCFF00; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; }
          .shoot-date { color: #fff; font-size: 16px; font-weight: 600; margin-top: 8px; }
          .shoot-time { color: #888; font-size: 13px; margin-top: 4px; }
          .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #222; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>NEW CLIENT ONBOARDING</h1>
          <p class="subtitle">${escapeHtml(safeData.clientName)} has completed their onboarding interview</p>

          <div class="section">
            <div class="section-title">Business Info</div>
            <div class="field">
              <div class="label">Business Name</div>
              <div class="value">${escapeHtml(safeData.businessName)}</div>
            </div>
            <div class="field">
              <div class="label">Industry</div>
              <div class="value">${escapeHtml(safeData.industry)}</div>
            </div>
            ${safeData.website ? `
            <div class="field">
              <div class="label">Website</div>
              <div class="value"><a href="${escapeHtml(safeData.website)}" style="color: #CCFF00;">${escapeHtml(safeData.website)}</a></div>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">Their Story</div>
            <div class="story">${escapeHtml(safeData.ownerStory)}</div>
          </div>

          <div class="section">
            <div class="section-title">Mission & Drive</div>
            <div class="value">${escapeHtml(safeData.mission)}</div>
          </div>

          <div class="section">
            <div class="section-title">Special Offer for Video</div>
            <div class="value" style="color: #CCFF00; font-weight: 600;">${escapeHtml(safeData.specialOffer)}</div>
          </div>

          <div class="section">
            <div class="section-title">Shoot Schedule</div>
            <div class="shoot-card">
              <div class="shoot-number">Shoot Day 1</div>
              <div class="shoot-date">${formatDate(safeData.shootDay1.date)}</div>
              <div class="shoot-time">${TIME_LABELS[safeData.shootDay1.timePreference] || safeData.shootDay1.timePreference}</div>
            </div>
            <div class="shoot-card">
              <div class="shoot-number">Shoot Day 2</div>
              <div class="shoot-date">${formatDate(safeData.shootDay2.date)}</div>
              <div class="shoot-time">${TIME_LABELS[safeData.shootDay2.timePreference] || safeData.shootDay2.timePreference}</div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Contact</div>
            <div class="field">
              <div class="label">Name</div>
              <div class="value">${escapeHtml(safeData.clientName)}</div>
            </div>
            <div class="field">
              <div class="label">Email</div>
              <div class="value">${escapeHtml(safeData.clientEmail)}</div>
            </div>
            <div class="field">
              <div class="label">Phone</div>
              <div class="value">${escapeHtml(safeData.phone)}</div>
            </div>
          </div>

          <div class="footer">
            <p>Submitted: ${new Date(safeData.submittedAt).toLocaleString()}</p>
            <p>Client ID: ${escapeHtml(safeData.clientId)}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    try {
      await sendEmail(
        NOTIFICATION_EMAIL,
        `New Client Onboarding: ${safeData.businessName} (${safeData.clientName})`,
        adminEmailHtml
      );
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails - data is already saved
    }

    return res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully'
    });

  } catch (error) {
    console.error('Onboarding error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}
