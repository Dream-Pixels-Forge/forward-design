/**
 * Booking Storage Functions
 * 
 * Provides CRUD operations for bookings using file-based JSON storage.
 * For production, this should be replaced with Vercel KV or similar.
 * 
 * Key naming convention:
 * - bookings:all -> array of all booking IDs
 * - booking:{id} -> individual booking JSON
 * - bookings:date:{YYYY-MM-DD} -> array of booking IDs for a specific date
 * - bookings:service:{serviceId} -> array of booking IDs for a service
 */

import { randomUUID } from 'crypto';
import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import type { Booking, CreateBookingInput, UpdateBookingInput, TimeSlot } from '../../types/booking';
import { DEFAULT_TIME_SLOTS } from '../../types/booking';

// Storage configuration
const STORAGE_DIR = join(process.cwd(), 'data');
const BOOKINGS_FILE = join(STORAGE_DIR, 'bookings.json');

// Ensure storage directory exists
function ensureStorageDir(): void {
  if (!existsSync(STORAGE_DIR)) {
    mkdirSync(STORAGE_DIR, { recursive: true });
  }
}

/**
 * Read all bookings from storage
 */
function readBookings(): Record<string, Booking> {
  ensureStorageDir();
  
  if (!existsSync(BOOKINGS_FILE)) {
    return {};
  }
  
  try {
    const data = readFileSync(BOOKINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading bookings:', error);
    return {};
  }
}

/**
 * Write all bookings to storage
 */
function writeBookings(bookings: Record<string, Booking>): void {
  ensureStorageDir();
  
  try {
    writeFileSync(BOOKINGS_FILE, JSON.stringify(bookings, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing bookings:', error);
    throw new Error('Failed to persist bookings');
  }
}

/**
 * Create a new booking
 */
export function createBooking(input: CreateBookingInput): Booking {
  const bookings = readBookings();
  
  const now = new Date().toISOString();
  const booking: Booking = {
    id: randomUUID(),
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  
  bookings[booking.id] = booking;
  writeBookings(bookings);
  
  return booking;
}

/**
 * Get a booking by ID
 */
export function getBooking(id: string): Booking | null {
  const bookings = readBookings();
  return bookings[id] || null;
}

/**
 * Get all bookings
 */
export function getAllBookings(): Booking[] {
  const bookings = readBookings();
  return Object.values(bookings).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Get bookings for a specific date
 */
export function getBookingsByDate(date: string): Booking[] {
  const bookings = readBookings();
  return Object.values(bookings)
    .filter(b => b.date === date)
    .sort((a, b) => a.time.localeCompare(b.time));
}

/**
 * Get bookings for a specific service
 */
export function getBookingsByService(serviceId: string): Booking[] {
  const bookings = readBookings();
  return Object.values(bookings)
    .filter(b => b.serviceId === serviceId)
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/**
 * Get bookings by status
 */
export function getBookingsByStatus(status: string): Booking[] {
  const bookings = readBookings();
  return Object.values(bookings)
    .filter(b => b.status === status)
    .sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

/**
 * Update an existing booking
 */
export function updateBooking(id: string, updates: UpdateBookingInput): Booking | null {
  const bookings = readBookings();
  
  if (!bookings[id]) {
    return null;
  }
  
  const updated: Booking = {
    ...bookings[id],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  bookings[id] = updated;
  writeBookings(bookings);
  
  return updated;
}

/**
 * Delete a booking
 */
export function deleteBooking(id: string): boolean {
  const bookings = readBookings();
  
  if (!bookings[id]) {
    return false;
  }
  
  delete bookings[id];
  writeBookings(bookings);
  
  return true;
}

/**
 * Get available time slots for a specific date
 * 
 * Filters out slots that already have bookings
 */
export function getAvailableSlots(date: string, serviceDuration: number = 60): TimeSlot[] {
  const bookings = getBookingsByDate(date);
  
  // Get booked times for the date
  const bookedTimes = new Set(bookings.map(b => b.time));
  
  return DEFAULT_TIME_SLOTS.map(time => ({
    time,
    available: !bookedTimes.has(time),
  }));
}

/**
 * Check if a specific time slot is available
 */
export function isSlotAvailable(date: string, time: string): boolean {
  const bookings = getBookingsByDate(date);
  return !bookings.some(b => b.time === time);
}

/**
 * Get booking statistics
 */
export function getBookingStats(): {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
} {
  const bookings = getAllBookings();
  
  return {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };
}

/**
 * Clear all bookings (for testing/reset)
 */
export function clearAllBookings(): void {
  writeBookings({});
}