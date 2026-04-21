# Tasks - Forward Design Portfolio Enhancement

**Last Updated**: April 11, 2026

---

## Overview

This document tracks all tasks for the Google Drive Integration, WhatsApp Integration, and Booking System features.

---

## Google Drive Integration

### Phase 1: Setup & Authentication
- [ ] Create Google Cloud project
- [ ] Enable Google Drive API
- [ ] Create Service Account
- [ ] Generate JSON credentials
- [ ] Share portfolio folder with Service Account
- [x] Configure environment variables

### Phase 2: API Implementation
- [x] Implement Google Drive client (lib/drive/client.ts)
- [x] Create GET /api/drive/contents endpoint
- [x] Create GET /api/drive/image/:id endpoint
- [ ] Implement folder structure detection

### Phase 3: Image & Caption Handling
- [x] Implement thumbnail generation
- [x] Set up caching with 24-hour TTL
- [x] Parse texte.md / texte.txt captions
- [x] Implement per-image caption mapping

### Phase 4: Sync Mechanism
- [x] Create POST /api/drive/sync endpoint
- [x] Implement manual sync trigger
- [x] Add sync status indicator component

---

## WhatsApp Integration

### Phase 1: Basic Setup
- [ ] Configure WhatsApp phone number in env
- [ ] Create FloatingWhatsAppButton component
- [ ] Add WhatsApp links to contact page
- [ ] Add FAB to all pages (layout.tsx)

### Phase 2: Advanced Features
- [ ] Implement ShareButton for images
- [ ] Create WhatsAppQR component
- [ ] Add user agent detection (hide on desktop)
- [ ] Test deep linking on mobile

---

## Booking System

### Phase 1: Data Models & Storage
- [ ] Define Booking types (types/booking.ts)
- [ ] Set up Vercel KV storage
- [ ] Create booking storage functions

### Phase 2: API Endpoints
- [ ] Create POST /api/booking endpoint
- [ ] Create GET /api/booking/available endpoint
- [ ] Create GET /api/booking/list endpoint (admin)
- [ ] Implement email notification service

### Phase 3: Frontend Components
- [ ] Create ServiceSelector component
- [ ] Create CalendarPicker component
- [ ] Create TimeSlotPicker component
- [ ] Create BookingForm component with validation
- [ ] Create Confirmation component
- [ ] Build /booking page

### Phase 4: Admin Features
- [ ] Create /admin/booking page
- [ ] Implement booking list view
- [ ] Add cancel/reschedule functionality

---

## Testing & Deployment

- [ ] Write unit tests for caption parser
- [ ] Write unit tests for booking validation
- [ ] Integration test: Drive sync
- [ ] Integration test: Booking flow
- [ ] Manual mobile testing
- [ ] Deploy to production
- [ ] Monitor and fix issues

---

## Security Audit Remediation

### Immediate Actions
- [ ] Upgrade Next.js to 16.1.7+ to patch CVE-2026-27980
- [ ] Add security headers to next.config.js

### Short-term Actions
- [ ] Add React Error Boundary component
- [ ] Refactor inline styles to CSS classes for CSP compliance

### Optional Improvements
- [ ] Implement contact form to hide email (optional)
- [ ] Add CSP reporting endpoint (optional)

---

## Legend

- [ ] Not started
- [x] In progress
- [x] Completed
- [ ] Blocked

---

## Notes

- Total estimated tasks: 40+
- Priority order: Google Drive → WhatsApp → Booking
- Each phase builds on previous