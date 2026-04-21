# Feature Plan: Google Drive Integration, WhatsApp & Booking System

## Overview
This document outlines the comprehensive plan for adding Google Drive synchronization, WhatsApp integration, and a booking system to the Forward Design portfolio website.

---

## 1. Google Drive Integration

### 1.1 Architecture

**Option A: Server-Side API (Recommended)**
- Use Google Drive API with OAuth 2.0 Service Account
- Backend API routes in Next.js to fetch folder contents
- Server-side caching with ISR for performance
- Pros: Secure, works without client interaction
- Cons: Requires Google Cloud setup

**Option B: Client-Side Picker**
- Google Drive Picker widget for manual selection
- User selects folders to display
- Pros: Simple setup, user controls
- Cons: Manual selection needed each time

### 1.2 Folder Structure Detection

```
Root/
├── compagnes/
│   └── [campaign-name]/
│       ├── photos/
│       │   ├── image1.jpg
│       │   ├── image2.jpg
│       │   └── ...
│       └── texte.md
│
└── artistiques/
    └── [series-name]/
        ├── photos/
        │   ├── image1.jpg
        │   └── ...
        └── texte.md
```

### 1.3 Caption/Text File Parsing

Supported formats:
- `.txt` - Plain text captions
- `.md` - Markdown with formatting
- `.json` - Structured metadata

**Caption mapping rules:**
- Exact match: `image-name.jpg` -> `image-name.txt`
- Default: `texte.md` applies to all images in folder

### 1.4 Synchronization Strategy

- **Polling**: Check Drive every X minutes (configurable)
- **Webhook** (if available): Real-time updates
- **Manual refresh**: Button to trigger sync
- **Incremental**: Only fetch changed files

---

## 2. WhatsApp Integration

### 2.1 Integration Methods

**Option A: WhatsApp Click to Chat (Simple)**
```
https://wa.me/1234567890?text=Hello%20Forward%20Design
```
- No API required
- Opens WhatsApp app on mobile
- Pre-filled message

**Option B: WhatsApp Business API (Advanced)**
- Two-way messaging
- Template messages
- Automated responses
- Requires WhatsApp Business account

### 2.2 Mobile Collaboration Features

- Quick share from portfolio to WhatsApp
- Image gallery with share buttons
- Project updates to photographer
- Client communication channel

### 2.3 UI Components

- Floating WhatsApp button (bottom-right)
- Share buttons on images
- Contact page integration
- QR code for easy scanning

---

## 3. Booking System

### 3.1 Booking Flow

```
Landing → Service Selection → Date/Time → Client Info → Confirmation
```

### 3.2 Features

1. **Service Selection**
   - Photography type (portrait, commercial, event)
   - Duration (1hr, half-day, full-day)
   - Location (studio, on-site, remote)

2. **Availability Calendar**
   - Google Calendar integration
   - Real-time slot availability
   - Buffer time between bookings

3. **Client Information Form**
   - Name, email, phone
   - Project description
   - Special requirements

4. **Confirmation & Notifications**
   - Email confirmation to client
   - Notification to photographer
   - Calendar event creation
   - Reminder notifications

5. **Add Photo of photographer**
   - Photo of photographer
   - Bio
   - Contact information

### 3.3 Integration Options

| Option | Complexity | Cost | Features |
|--------|------------|------|----------|
| Custom form + email | Low | Free | Basic |
| Cal.com embed | Medium | Free/Pro | Full calendar |
| Google Calendar API | Medium | Free | Full control |
| Acuity Scheduling | High | $15+/mo | Complete solution |

---

## 4. Implementation Phases

### Phase 1: Foundation (Week 1)
- [ ] Set up Google Cloud project and Drive API
- [ ] Create API routes for folder listing
- [ ] Implement image fetching from Drive
- [ ] Basic caption parsing

### Phase 2: Google Drive Features (Week 2)
- [ ] Folder structure detection (compagnes/artistiques)
- [ ] Text file parsing for captions
- [ ] Thumbnail generation/caching
- [ ] Sync mechanism (polling/webhook)

### Phase 3: WhatsApp Integration (Week 3)
- [ ] Floating button component
- [ ] Share functionality on images
- [ ] Contact page WhatsApp link
- [ ] QR code generation

### Phase 4: Booking System (Week 4)
- [ ] Service selection UI
- [ ] Calendar component integration
- [ ] Booking form creation
- [ ] Email notification system
- [ ] Admin dashboard for photographer

---

## 5. Technical Considerations

### Performance
- Lazy loading for Drive images
- Thumbnail caching
- CDN for image delivery
- ISR for folder content

### Security
- OAuth 2.0 with proper scopes
- Service account key protection
- Input validation on forms
- Rate limiting on API

### Mobile First
- Touch-friendly booking calendar
- WhatsApp deep linking
- Responsive image gallery
- PWA capabilities

---

## 6. Dependencies

```json
{
  "googleapis": "^133.0.0",
  "@googleapis/drive": "^8.0.0",
  "date-fns": "^3.0.0",
  "react-calendar": "^4.0.0",
  "react-hook-form": "^7.49.0",
  "nodemailer": "^6.9.0",
  "qrcode": "^1.5.3"
}
```

---

## 7. Environment Variables

```
# Google Drive
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
GOOGLE_DRIVE_FOLDER_ID=

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890

# Booking
CAL_COM_API_KEY=
EMAIL_HOST=
EMAIL_USER=
EMAIL_PASS=
```

---

## 8. User Stories

1. **Photographer** - "I want to upload photos to Google Drive and have them automatically appear on my portfolio with captions"

2. **Client** - "I want to contact Forward Design via WhatsApp from my mobile phone"

3. **Client** - "I want to book a photography session directly from the website"

4. **Photographer** - "I want to receive booking notifications and have them added to my calendar"

---

## 9. Success Metrics

- [ ] Images sync from Drive within 5 minutes
- [ ] Captions display correctly for all images
- [ ] WhatsApp click-to-chat works on mobile
- [ ] Booking form submits successfully
- [ ] Email notifications received

---

**Document Version**: 1.0
**Created**: April 11, 2026
**Status**: Planning Complete - Ready for Implementation