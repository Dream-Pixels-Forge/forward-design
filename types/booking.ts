/**
 * Booking System Types
 * 
 * Defines all type interfaces for the booking system including:
 * - Booking status enum
 * - Service definitions
 * - Time slot configuration
 * - Booking entity
 */

/**
 * Booking status states
 */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

/**
 * Service available for booking
 */
export interface Service {
  id: string;
  name: string;
  duration: number; // duration in minutes
  price: number; // price in USD
  description: string;
  active: boolean;
}

/**
 * Available time slot
 */
export interface TimeSlot {
  time: string; // HH:MM format (24-hour)
  available: boolean;
}

/**
 * Booking entity
 */
export interface Booking {
  id: string; // UUID
  serviceId: string;
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format (24-hour)
  status: BookingStatus;
  notes?: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}

/**
 * Input type for creating a new booking (id auto-generated)
 */
export type CreateBookingInput = Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Input type for updating an existing booking
 */
export type UpdateBookingInput = Partial<Omit<Booking, 'id' | 'createdAt'>>;

/**
 * Default services offered
 */
export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'portrait-session',
    name: 'Portrait Session',
    duration: 60,
    price: 150,
    description: 'Professional portrait photography session with multiple setups and retouching.',
    active: true,
  },
  {
    id: 'event-coverage',
    name: 'Event Coverage',
    duration: 180,
    price: 400,
    description: 'Full event photography coverage for corporate events, weddings, and celebrations.',
    active: true,
  },
  {
    id: 'product-photography',
    name: 'Product Photography',
    duration: 120,
    price: 250,
    description: 'Professional product shots with studio lighting and background removal.',
    active: true,
  },
  {
    id: 'brand-session',
    name: 'Brand Session',
    duration: 240,
    price: 600,
    description: 'Comprehensive brand photography including headshots, lifestyle, and content creation.',
    active: true,
  },
];

/**
 * Default available time slots for bookings
 */
export const DEFAULT_TIME_SLOTS: string[] = [
  '09:00',
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
];

/**
 * Helper to validate date format (YYYY-MM-DD)
 */
export function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Helper to validate time format (HH:MM)
 */
export function isValidTime(timeString: string): boolean {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(timeString);
}

/**
 * Helper to generate ISO timestamp
 */
export function generateTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Helper to format date for storage
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}