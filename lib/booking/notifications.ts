/**
 * Booking Email Notifications
 * 
 * Handles email notifications for booking events.
 * Currently uses console.log for development - in production,
 * integrate with services like Resend, SendGrid, or AWS SES.
 * 
 * Required environment variables for production:
 * - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 * - EMAIL_FROM (sender address)
 * - Or use a service like Resend (RESEND_API_KEY)
 */

import type { Booking, Service } from '@/types/booking';
import { DEFAULT_SERVICES } from '@/types/booking';

/**
 * Email recipient types
 */
export type EmailRecipient = 'customer' | 'admin';

/**
 * Email content structure
 */
export interface EmailContent {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

/**
 * Get service details by ID
 */
function getServiceById(serviceId: string): Service | undefined {
  return DEFAULT_SERVICES.find(s => s.id === serviceId);
}

/**
 * Format a date for display
 */
function formatDisplayDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format time for display
 */
function formatDisplayTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Build customer confirmation email content
 */
function buildCustomerConfirmationEmail(booking: Booking): EmailContent {
  const service = getServiceById(booking.serviceId);
  const serviceName = service?.name || 'Photography Session';
  const servicePrice = service?.price || 0;

  const subject = `Booking Confirmed - ${serviceName}`;
  
  const textBody = `
Dear ${booking.name},

Thank you for your booking! Your appointment has been confirmed.

BOOKING DETAILS
===============
Service: ${serviceName}
Date: ${formatDisplayDate(booking.date)}
Time: ${formatDisplayTime(booking.time)}
Price: $${servicePrice}

${booking.notes ? `Notes: ${booking.notes}` : ''}

WHAT'S NEXT
===========
We look forward to seeing you! If you need to reschedule or cancel, 
please contact us at least 24 hours in advance.

Best regards,
Forward Design Team
  `.trim();

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1a1a1a; color: #fff; padding: 30px; text-align: center; }
    .content { background: #f9f9f9; padding: 30px; }
    .details { background: #fff; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .detail-row:last-child { border-bottom: none; }
    .label { font-weight: 600; color: #666; }
    .value { color: #1a1a1a; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Booking Confirmed</h1>
    </div>
    <div class="content">
      <p>Dear <strong>${booking.name}</strong>,</p>
      <p>Thank you for your booking! Your appointment has been confirmed.</p>
      
      <div class="details">
        <div class="detail-row">
          <span class="label">Service</span>
          <span class="value">${serviceName}</span>
        </div>
        <div class="detail-row">
          <span class="label">Date</span>
          <span class="value">${formatDisplayDate(booking.date)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Time</span>
          <span class="value">${formatDisplayTime(booking.time)}</span>
        </div>
        <div class="detail-row">
          <span class="label">Price</span>
          <span class="value">$${servicePrice}</span>
        </div>
        ${booking.notes ? `
        <div class="detail-row">
          <span class="label">Notes</span>
          <span class="value">${booking.notes}</span>
        </div>
        ` : ''}
      </div>
      
      <p><strong>What's Next:</strong></p>
      <p>We look forward to seeing you! If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
      
      <div class="footer">
        <p>Best regards,<br>Forward Design Team</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  return {
    to: booking.email,
    subject: subject,
    body: textBody,
    html: htmlBody,
  };
}

/**
 * Build admin notification email content
 */
function buildAdminNotificationEmail(booking: Booking): EmailContent {
  const service = getServiceById(booking.serviceId);
  const serviceName = service?.name || 'Unknown Service';

  const subject = `New Booking - ${booking.name} - ${serviceName}`;
  
  const textBody = `
NEW BOOKING NOTIFICATION
========================
Service: ${serviceName}
Client: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
Date: ${formatDisplayDate(booking.date)}
Time: ${formatDisplayTime(booking.time)}
Status: ${booking.status}
Booking ID: ${booking.id}

${booking.notes ? `Notes: ${booking.notes}` : ''}
  `.trim();

  return {
    to: 'admin@forwarddesign.com', // Configure in environment variables
    subject: subject,
    body: textBody,
  };
}

/**
 * Send email (placeholder for production)
 * 
 * In production, replace this with actual email sending:
 * - Resend: https://resend.com
 * - SendGrid: https://sendgrid.com
 * - AWS SES: https://aws.amazon.com/ses/
 */
async function sendEmail(email: EmailContent): Promise<boolean> {
  // Development: log to console
  console.log('='.repeat(60));
  console.log('📧 EMAIL NOTIFICATION (Development Mode)');
  console.log('='.repeat(60));
  console.log(`To: ${email.to}`);
  console.log(`Subject: ${email.subject}`);
  console.log('-'.repeat(60));
  console.log(email.body);
  console.log('='.repeat(60));
  
  // In production, uncomment one of these:
  
  /*
  // Option 1: Resend (recommended for Next.js)
  import { Resend } from 'resend';
  const resend = new Resend(process.env.RESEND_API_KEY);
  await resend.emails.send({
    from: process.env.EMAIL_FROM || 'bookings@forwarddesign.com',
    to: email.to,
    subject: email.subject,
    text: email.body,
    html: email.html,
  });
  */
  
  /*
  // Option 2: Nodemailer
  import nodemailer from 'nodemailer';
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email.to,
    subject: email.subject,
    text: email.body,
    html: email.html,
  });
  */
  
  return true;
}

/**
 * Send booking confirmation to customer
 */
export async function sendCustomerConfirmation(booking: Booking): Promise<boolean> {
  const email = buildCustomerConfirmationEmail(booking);
  return sendEmail(email);
}

/**
 * Send admin notification for new booking
 */
export async function sendAdminNotification(booking: Booking): Promise<boolean> {
  const email = buildAdminNotificationEmail(booking);
  return sendEmail(email);
}

/**
 * Send booking confirmation (both customer and admin)
 * This is the main function to call after successful booking
 */
export async function sendBookingNotification(booking: Booking): Promise<{
  customer: boolean;
  admin: boolean;
}> {
  const [customerResult, adminResult] = await Promise.all([
    sendCustomerConfirmation(booking),
    sendAdminNotification(booking),
  ]);

  return {
    customer: customerResult,
    admin: adminResult,
  };
}
