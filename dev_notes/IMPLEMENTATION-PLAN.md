# Implementation Plan
## Google Drive Integration, WhatsApp & Booking System

**Project**: Forward Design Portfolio Enhancement  
**Date**: April 11, 2026  
**Version**: 1.0

---

## 1. Implementation Overview

This plan details the technical implementation for three major features:
- **Google Drive Integration**: Automated content synchronization
- **WhatsApp Integration**: Mobile communication channel
- **Booking System**: Online appointment scheduling

**Total Estimated Effort**: 4-6 weeks  
**Priority**: High

---

## 2. Technical Architecture

### 2.1 Component Structure

```
forward-design/
├── app/
│   ├── api/
│   │   ├── drive/
│   │   │   ├── route.ts          # Drive sync endpoint
│   │   │   ├── contents/route.ts # Get folder contents
│   │   │   └── image/route.ts    # Serve images
│   │   ├── booking/
│   │   │   ├── route.ts          # Create booking
│   │   │   ├── available/route.ts # Get available slots
│   │   │   └── list/route.ts     # List bookings (admin)
│   │   └── whatsapp/
│   │       └── route.ts          # Get WhatsApp config
│   ├── booking/
│   │   └── page.tsx              # Booking page
│   ├── contact/
│   │   └── page.tsx              # Contact with WhatsApp
│   └── admin/
│       └── page.tsx              # Admin dashboard
├── components/
│   ├── drive/
│   │   ├── Gallery.tsx           # Drive image gallery
│   │   ├── FolderView.tsx        # Folder browser
│   │   └── SyncStatus.tsx        # Sync indicator
│   ├── whatsapp/
│   │   ├── FloatingButton.tsx    # FAB component
│   │   ├── ShareButton.tsx       # Image share button
│   │   └── WhatsAppQR.tsx        # QR code component
│   ├── booking/
│   │   ├── ServiceSelector.tsx    # Service type picker
│   │   ├── CalendarPicker.tsx    # Date/time picker
│   │   ├── BookingForm.tsx       # Client information form
│   │   └── Confirmation.tsx      # Success message
│   └── ui/
│       └── ...                   # Shared UI components
├── lib/
│   ├── drive/
│   │   ├── client.ts             # Google Drive client
│   │   ├── parser.ts             # Text file parser
│   │   └── sync.ts               # Sync logic
│   ├── booking/
│   │   ├── calendar.ts           # Availability logic
│   │   ├── email.ts              # Notification emails
│   │   └── storage.ts            # Booking storage
│   └── config.ts                 # Environment config
└── types/
    ├── drive.ts                  # Drive type definitions
    └── booking.ts                # Booking type definitions
```

---

## 3. Google Drive Integration Implementation

### 3.1 Phase 1: Setup & Authentication (3 days)

**Day 1-2: Google Cloud Configuration**
- [ ] Create Google Cloud project
- [ ] Enable Google Drive API
- [ ] Create Service Account
- [ ] Generate JSON credentials
- [ ] Share portfolio folder with Service Account email

**Day 3: Environment Setup**
- [ ] Add to `.env.local`:
  ```
  GOOGLE_SERVICE_ACCOUNT_EMAIL=xxx@xxx.iam.gserviceaccount.com
  GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY..."
  GOOGLE_DRIVE_FOLDER_ID=root 或 specific folder ID
  ```

### 3.2 Phase 2: API Implementation (4 days)

**Day 4-5: Drive Client & Basic Endpoints**
```typescript
// lib/drive/client.ts
import { google } from 'googleapis';

const auth = new google.auth.JWT(
  process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  ['https://www.googleapis.com/auth/drive.readonly']
);

const drive = google.drive({ version: 'v3', auth });

export async function listFiles(folderId: string) {
  const response = await drive.files.list({
    q: `'${folderId}' in parents`,
    fields: 'files(id, name, mimeType, modifiedTime)',
  });
  return response.data.files;
}

export async function getFileContent(fileId: string) {
  const response = await drive.files.get({ fileId, alt: 'media' });
  return response.data;
}
```

**Day 6-7: Folder Structure Detection**
```typescript
// Detect folder structure
const STRUCTURE = {
  campagnes: 'compagnes',
  artistiques: 'artistiques',
  photos: 'photos',
  texts: ['texte.md', 'texte.txt', 'caption.json']
};
```

### 3.3 Phase 3: Image & Caption Handling (3 days)

**Day 8-9: Image Fetching & Caching**
- [ ] Implement thumbnail generation (use Drive thumbnails)
- [ ] Set up Vercel KV or local cache
- [ ] Implement 24-hour TTL

**Day 10: Caption Parsing**
```typescript
// lib/drive/parser.ts
export async function parseCaptions(folderId: string) {
  // Look for texte.md, texte.txt, or image-name.txt files
  // Map to images by filename matching
}
```

### 3.4 Phase 4: Sync Mechanism (2 days)

**Day 11-12: Sync Logic**
- [ ] Manual sync endpoint `/api/drive/sync`
- [ ] Background job option (Vercel Cron)
- [ ] Status tracking in database

---

## 4. WhatsApp Integration Implementation

### 4.1 Phase 1: Basic Setup (2 days)

**Day 13-14: Configuration & Components**
```typescript
// lib/config.ts
export const whatsappConfig = {
  phoneNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  defaultMessage: 'Hello! I saw your portfolio and would like to inquire about your services.',
};
```

```tsx
// components/whatsapp/FloatingButton.tsx
export function FloatingWhatsAppButton() {
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent(whatsappConfig.defaultMessage);
  const url = `https://wa.me/${phone}?text=${message}`;
  
  return (
    <a href={url} className="fixed bottom-5 right-5 bg-[#25D366] ...">
      <WhatsAppIcon />
    </a>
  );
}
```

### 4.2 Phase 2: Advanced Features (2 days)

**Day 15-16: Share & QR Features**
- [ ] Image share component
- [ ] QR code generation with `qrcode` package
- [ ] User agent detection (hide FAB on desktop)

---

## 5. Booking System Implementation

### 5.1 Phase 1: Data Models & Storage (2 days)

**Day 17-18: Types & Storage**
```typescript
// types/booking.ts
interface Booking {
  id: string;
  service: 'portrait' | 'commercial' | 'event' | 'product';
  date: string;
  time: string;
  duration: number;
  location: 'studio' | 'onsite' | 'remote';
  client: {
    name: string;
    email: string;
    phone: string;
  };
  description?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
```

**Storage**: Use Vercel KV (Redis) for simplicity
```typescript
// lib/booking/storage.ts
import kv from '@vercel/kv';

export async function saveBooking(booking: Booking) {
  await kv.hset(`booking:${booking.id}`, booking);
  await kv.zadd('bookings', { score: Date.now(), value: booking.id });
}
```

### 5.2 Phase 2: API Endpoints (3 days)

**Day 19-21: Booking Routes**
```typescript
// app/api/booking/route.ts
export async function POST(request: Request) {
  const body = await request.json();
  const booking = validateBooking(body);
  await saveBooking(booking);
  await sendConfirmationEmail(booking);
  return Response.json({ success: true, bookingId: booking.id });
}

// app/api/booking/available/route.ts
export async function GET(request: Request) {
  const slots = getAvailableSlots(date, service);
  return Response.json(slots);
}
```

### 5.3 Phase 3: Frontend Components (4 days)

**Day 22-25: Booking UI**
- [ ] ServiceSelector - Radio/select for service type
- [ ] CalendarPicker - Date selection (react-calendar)
- [ ] TimeSlotPicker - Available time slots
- [ ] BookingForm - Client info with react-hook-form + zod
- [ ] Confirmation - Success state

### 5.4 Phase 4: Notifications (2 days)

**Day 26-27: Email System**
```typescript
// lib/booking/email.ts
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendConfirmationEmail(booking: Booking) {
  await transporter.sendMail({
    from: '"Forward Design" <noreply@forwarddesign.com>',
    to: booking.client.email,
    subject: 'Booking Confirmed - Forward Design',
    html: generateConfirmationTemplate(booking),
  });
}
```

---

## 6. Integration Points

### 6.1 Page Integration

| Page | Components to Add |
|------|-------------------|
| Home | Optional: FloatingWhatsAppButton |
| Gallery | DriveGallery, SyncStatus |
| Contact | WhatsApp links, QR code, FloatingWhatsAppButton |
| Booking | Full booking flow (ServiceSelector → Calendar → Form) |
| Admin | Sync controls, Booking list, Settings |

### 6.2 Existing Components to Update

- `app/layout.tsx` - Add FloatingWhatsAppButton (if on all pages)
- `components/carousel/Carousel.tsx` - Integrate DriveGallery or use Drive as data source

---

## 7. Testing Plan

### 7.1 Unit Tests
- [ ] Caption parser - Handle all text formats
- [ ] Date availability - Exclude weekends, past dates
- [ ] Form validation - All required fields, email format
- [ ] URL generation - WhatsApp deep links

### 7.2 Integration Tests
- [ ] Drive sync end-to-end
- [ ] Booking flow complete
- [ ] Email delivery

### 7.3 Manual Testing
- [ ] Mobile WhatsApp click
- [ ] Booking calendar on mobile
- [ ] Image gallery responsive

---

## 8. Deployment Checklist

### 8.1 Pre-Deployment
- [ ] Environment variables configured
- [ ] Google Drive credentials valid
- [ ] Email service configured
- [ ] All tests passing

### 8.2 Post-Deployment
- [ ] Verify API routes responding
- [ ] Test WhatsApp link on mobile
- [ ] Submit test booking
- [ ] Monitor error logs

---

## 9. Rollback Plan

| Scenario | Rollback Action |
|----------|-----------------|
| Drive API failure | Show cached content, log errors |
| Booking form broken | Disable booking, show contact info |
| Email not sending | Log to console, show admin alert |

---

## 10. Timeline Summary

| Week | Focus |
|------|-------|
| Week 1 | Google Drive setup + basic API |
| Week 2 | Drive sync + caption parsing |
| Week 3 | WhatsApp components |
| Week 4 | Booking system (API + UI) |
| Week 5 | Testing + polish |
| Week 6 | Deployment + monitoring |

---

## 11. Dependencies

```json
{
  "dependencies": {
    "googleapis": "^133.0.0",
    "@vercel/kv": "^2.0.0",
    "react-hook-form": "^7.49.0",
    "@hookform/resolvers": "^3.3.0",
    "zod": "^3.22.0",
    "nodemailer": "^6.9.0",
    "qrcode": "^1.5.3",
    "date-fns": "^3.0.0",
    "react-calendar": "^4.0.0",
    "uuid": "^9.0.0"
  }
}
```

---

## 12. Approval

| Role | Name | Date |
|------|------|------|
| Lead Developer | - | - |
| Project Manager | - | - |

---

**End of Implementation Plan**