# Booking System - Phase 1: Data Models & Storage

## Completed Deliverables

### 1. Types (`types/booking.ts`)
Full type definitions including:
- `BookingStatus` - pending, confirmed, cancelled, completed
- `Service` - service definitions with id, name, duration, price, description
- `TimeSlot` - time slot with availability
- `Booking` - main booking entity with all required fields
- `CreateBookingInput` / `UpdateBookingInput` - input types for CRUD
- `DEFAULT_SERVICES` - default service offerings
- `DEFAULT_TIME_SLOTS` - available booking times
- Helper functions for validation

### 2. Storage (`lib/booking/storage.ts`)
File-based JSON storage with full CRUD operations:
- `createBooking(input)` - Create new booking with auto-generated UUID
- `getBooking(id)` - Get single booking by ID
- `getAllBookings()` - Get all bookings sorted by creation date
- `getBookingsByDate(date)` - Get bookings for specific date
- `getBookingsByService(serviceId)` - Get bookings by service
- `getBookingsByStatus(status)` - Get bookings by status
- `updateBooking(id, updates)` - Update existing booking
- `deleteBooking(id)` - Delete a booking
- `getAvailableSlots(date)` - Get available time slots for date
- `isSlotAvailable(date, time)` - Check specific slot availability
- `getBookingStats()` - Get booking statistics

### 3. Index (`lib/booking/index.ts`)
Re-exports all storage functions for convenient importing.

## Storage Details

### Current Implementation: File-Based JSON
- **Location**: `data/bookings.json`
- **Auto-created**: Storage directory created on first write
- **Git ignored**: `data/` folder is in `.gitignore`

### Production Migration (Vercel KV)

To migrate to Vercel KV for production:

1. **Install Vercel KV SDK**:
   ```bash
   pnpm add @vercel/kv
   ```

2. **Set environment variables**:
   ```
   KV_REST_API_URL=your_kv_url
   KV_REST_API_TOKEN=your_kv_token
   ```

3. **Update storage.ts** to use Vercel KV instead of file-based storage.

## TypeScript
All types pass TypeScript validation with `npx tsc --noEmit --skipLibCheck`.

## Usage Example
```typescript
import { createBooking, getAvailableSlots } from '@/lib/booking';

// Create a new booking
const booking = createBooking({
  serviceId: 'portrait-session',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  date: '2026-04-20',
  time: '10:00',
  status: 'pending',
  notes: 'Looking forward to the session',
});

// Get available slots
const slots = getAvailableSlots('2026-04-20');
```