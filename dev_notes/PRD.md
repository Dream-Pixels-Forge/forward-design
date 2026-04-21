# Product Requirements Document (PRD)
## Google Drive Integration, WhatsApp & Booking System

**Project**: Forward Design Portfolio Enhancement  
**Date**: April 11, 2026  
**Version**: 1.0  
**Status**: Approved for Implementation

---

## 1. Executive Summary

This PRD outlines the requirements for adding three key features to the Forward Design photography portfolio:
1. **Google Drive Integration** - Automatic synchronization of images and captions from a structured folder system
2. **WhatsApp Integration** - Mobile-first collaboration channel for clients and photographers
3. **Booking System** - Online scheduling and appointment management

**Target Users**:
- Primary: Photographer (Forward Design) - manages content and bookings
- Secondary: Potential clients - view portfolio and book services

---

## 2. Problem Statement

### Current State
- Portfolio content is hardcoded/static
- Updating images requires developer intervention
- No direct communication channel for mobile users
- No self-service booking capability

### Desired State
- Photographer uploads to Google Drive → automatically appears on site
- Clients can reach photographer via WhatsApp with one tap
- Clients can book photography sessions 24/7 through the website

---

## 3. Feature Requirements

### 3.1 Google Drive Integration

#### 3.1.1 Folder Structure Detection

| Requirement | Description | Priority |
|-------------|-------------|----------|
| GD-001 | Detect `compagnes/` folder with campaign subfolders | Must |
| GD-002 | Detect `artistiques/` folder with series subfolders | Must |
| GD-003 | Identify `photos/` subfolder within each campaign/series | Must |
| GD-004 | Identify text files (`.txt`, `.md`, `.json`) in each folder | Must |
| GD-005 | Support nested folder depth of up to 4 levels | Should |

#### 3.1.2 Image Synchronization

| Requirement | Description | Priority |
|-------------|-------------|----------|
| GD-006 | Fetch images from Google Drive API | Must |
| GD-007 | Support formats: JPG, JPEG, PNG, WebP, GIF | Must |
| GD-008 | Generate thumbnails for performance | Must |
| GD-009 | Cache images locally (24-hour TTL minimum) | Must |
| GD-010 | Handle image ordering (by filename or date) | Should |

#### 3.1.3 Caption/Text Parsing

| Requirement | Description | Priority |
|-------------|-------------|----------|
| GD-011 | Parse `.txt` files as plain text captions | Must |
| GD-012 | Parse `.md` files with Markdown support | Should |
| GD-013 | Map captions to images via filename matching | Must |
| GD-014 | Support per-image captions (`image-name.txt`) | Should |
| GD-015 | Support folder-level default caption (`texte.md`) | Must |

#### 3.1.4 Sync Mechanisms

| Requirement | Description | Priority |
|-------------|-------------|----------|
| GD-016 | Manual sync trigger via admin button | Must |
| GD-017 | Automatic periodic sync (configurable interval) | Should |
| GD-018 | Sync status indicator in admin panel | Should |
| GD-019 | Error handling and notification on sync failure | Must |

---

### 3.2 WhatsApp Integration

#### 3.2.1 Basic Features

| Requirement | Description | Priority |
|-------------|-------------|----------|
| WA-001 | WhatsApp click-to-chat link on contact page | Must |
| WA-002 | Floating action button (FAB) visible on all pages | Must |
| WA-003 | Pre-filled message template option | Should |
| WA-004 | QR code generation for easy scanning | Should |

#### 3.2.2 Mobile Features

| Requirement | Description | Priority |
|-------------|-------------|----------|
| WA-005 | Deep link to WhatsApp app on mobile | Must |
| WA-006 | Share individual portfolio images to WhatsApp | Should |
| WA-007 | Native share API integration | Should |

#### 3.2.3 UI Requirements

| Requirement | Description | Priority |
|-------------|-------------|----------|
| WA-008 | FAB positioned bottom-right, 20px from edges | Must |
| WA-009 | WhatsApp green color (#25D366) as accent | Must |
| WA-010 | Animate on scroll (fade in after first section) | Should |
| WA-011 | Hide on WhatsApp web/desktop (detect user agent) | Should |

---

### 3.3 Booking System

#### 3.3.1 Service Configuration

| Requirement | Description | Priority |
|-------------|-------------|----------|
| BS-001 | Define service types (portrait, commercial, event, product) | Must |
| BS-002 | Set duration options per service (30min, 1hr, 2hr, 4hr, full-day) | Must |
| BS-003 | Configure pricing display (optional) | Should |
| BS-004 | Set location options (studio, on-site, remote) | Should |

#### 3.3.2 Calendar & Availability

| Requirement | Description | Priority |
|-------------|-------------|----------|
| BS-005 | Display available time slots | Must |
| BS-006 | Show next 30 days availability | Must |
| BS-007 | Block unavailable dates | Must |
| BS-008 | Allow buffer time between bookings (30min default) | Should |
| BS-009 | Business hours configuration (Mon-Fri, 9am-6pm default) | Should |

#### 3.3.3 Booking Form

| Requirement | Description | Priority |
|-------------|-------------|----------|
| BS-010 | Client name field (required) | Must |
| BS-011 | Client email field (required, validated) | Must |
| BS-012 | Client phone field (required) | Must |
| BS-013 | Project description (textarea, optional) | Must |
| BS-014 | Service selection (dropdown/radio) | Must |
| BS-015 | Date/time selection | Must |
| BS-016 | Terms acceptance checkbox | Must |

#### 3.3.4 Notifications

| Requirement | Description | Priority |
|-------------|-------------|----------|
| BS-017 | Email confirmation to client | Must |
| BS-018 | Email notification to photographer | Must |
| BS-019 | Calendar event creation (.ics attachment) | Should |
| BS-020 | Reminder 24 hours before appointment | Should |

#### 3.3.5 Admin Features

| Requirement | Description | Priority |
|-------------|-------------|----------|
| BS-021 | View upcoming bookings | Should |
| BS-022 | Cancel/reschedule bookings | Should |
| BS-023 | Configure services and availability | Should |
| BS-024 | Export bookings to CSV | Should |

---

## 4. Technical Architecture

### 4.1 System Diagram

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Google Drive  │────▶│   Next.js API    │────▶│   Database/     │
│   (Source)      │     │   (Server)       │     │   Cache         │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                │
                                ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   WhatsApp      │◀────│   Frontend       │◀────│   Booking       │
│   (User)        │     │   (React)        │     │   System        │
└─────────────────┘     └──────────────────┘     └─────────────────┘
```

### 4.2 Technology Stack

| Component | Technology | Justification |
|-----------|------------|---------------|
| Backend | Next.js API Routes | Serverless, integrated |
| Auth | Google Service Account | Secure server-side |
| Database | Vercel KV / PostgreSQL | Caching + persistence |
| Email | Nodemailer / Resend | Transactional emails |
| Calendar | Google Calendar API | Existing photographer calendar |
| Booking UI | React Hook Form + Zod | Type-safe forms |
| Calendar UI | react-calendar or Custom | Date selection |

### 4.3 API Endpoints

```
GET  /api/drive/sync          - Trigger folder sync
GET  /api/drive/contents      - Get folder contents
GET  /api/drive/image/:id     - Get image by ID

POST /api/booking             - Create booking
GET  /api/booking/available   - Get available slots
GET  /api/booking/list        - List bookings (admin)

GET  /api/whatsapp/config     - Get WhatsApp config
```

---

## 5. Non-Functional Requirements

### 5.1 Performance

| Metric | Target |
|--------|--------|
| Image load time (cached) | < 500ms |
| Initial page load | < 2s |
| Sync completion | < 30s for 100 images |
| Booking form submission | < 1s |

### 5.2 Security

| Requirement | Implementation |
|-------------|----------------|
| API authentication | Service account with limited scopes |
| Input sanitization | Zod validation on all inputs |
| Rate limiting | 100 req/min per IP |
| Environment variables | All secrets in .env |

### 5.3 Accessibility

| Standard | Requirement |
|----------|-------------|
| WCAG 2.1 AA | All interactive elements |
| Screen reader | Proper ARIA labels |
| Keyboard nav | All features accessible |
| Color contrast | 4.5:1 minimum |

---

## 6. User Flows

### 6.1 Content Sync Flow

```
1. Photographer uploads images to Google Drive folder
2. System detects new/modified files on next sync
3. Images downloaded and cached locally
4. Captions parsed from text files
5. Portfolio gallery updated automatically
6. Admin notified of sync completion
```

### 6.2 Booking Flow

```
1. Client visits booking page
2. Selects service type
3. Views available dates/times
4. Selects preferred slot
5. Fills contact form
6. Submits booking
7. Receives confirmation email
8. Photographer notified
9. Calendar event created
```

---

## 7. Edge Cases

| Scenario | Handling |
|----------|----------|
| Google Drive quota exceeded | Show warning, use cached content |
| Image file too large (>20MB) | Skip with error log |
| Invalid caption format | Show placeholder text |
| WhatsApp not installed | Show fallback contact form |
| Double booking attempt | Show error, suggest alternative |
| Email delivery failure | Retry 3x, then show admin alert |
| Sync during high traffic | Queue and process in background |

---

## 8. Success Criteria

| Feature | KPI | Target |
|---------|-----|--------|
| Google Drive | Sync success rate | > 98% |
| Google Drive | Time to display new image | < 5 min |
| WhatsApp | Click-through rate | Track via analytics |
| Booking | Form completion rate | > 60% |
| Booking | No-show rate | < 10% |

---

## 9. Out of Scope

- Video content support
- Multiple photographers support
- Client login/portal
- Payment processing
- Multi-language (i18n)
- Mobile app development

---

## 10. Approval

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Product Owner | Patrick | April 11, 2026 | [Pending] |
| Technical Lead | TBD | - | - |
| Designer | TBD | - | - |

---

**End of PRD**