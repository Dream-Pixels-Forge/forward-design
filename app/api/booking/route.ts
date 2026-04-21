/**
 * POST /api/booking
 * 
 * Create a new booking.
 * 
 * Request body:
 *   - serviceId: string (required) - Service ID from available services
 *   - name: string (required) - Customer name
 *   - email: string (required) - Customer email
 *   - phone: string (required) - Customer phone
 *   - date: string (required) - Date in YYYY-MM-DD format
 *   - time: string (required) - Time in HH:MM format (24-hour)
 *   - notes: string (optional) - Additional notes
 * 
 * Response:
 *   - 201: Booking created successfully
 *   - 400: Validation error
 *   - 409: Time slot not available
 *   - 500: Server error
 */

import { NextResponse } from 'next/server';
import { createBooking, isSlotAvailable } from '@/lib/booking';
import { sendBookingNotification } from '@/lib/booking/notifications';
import { DEFAULT_SERVICES, isValidDate, isValidTime } from '@/types/booking';

/**
 * Validate booking input
 */
function validateBookingInput(data: unknown): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Request body is required'] };
  }
  
  const input = data as Record<string, unknown>;
  
  // Required fields
  if (!input.serviceId || typeof input.serviceId !== 'string') {
    errors.push('serviceId is required');
  }
  
  if (!input.name || typeof input.name !== 'string' || input.name.trim().length === 0) {
    errors.push('name is required');
  }
  
  if (!input.email || typeof input.email !== 'string' || input.email.trim().length === 0) {
    errors.push('email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.push('Invalid email format');
  }
  
  if (!input.phone || typeof input.phone !== 'string' || input.phone.trim().length === 0) {
    errors.push('phone is required');
  }
  
  if (!input.date || typeof input.date !== 'string') {
    errors.push('date is required');
  } else if (!isValidDate(input.date)) {
    errors.push('Invalid date format. Use YYYY-MM-DD');
  }
  
  if (!input.time || typeof input.time !== 'string') {
    errors.push('time is required');
  } else if (!isValidTime(input.time)) {
    errors.push('Invalid time format. Use HH:MM (24-hour)');
  }
  
  // Validate service exists
  if (input.serviceId && !DEFAULT_SERVICES.find(s => s.id === input.serviceId)) {
    errors.push('Invalid serviceId');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export async function POST(request: Request) {
  try {
    // Parse request body
    let body: unknown;
    
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }
    
    // Validate input
    const validation = validateBookingInput(body);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }
    
    const data = body as Record<string, string>;
    
    // Check if time slot is available
    if (!isSlotAvailable(data.date, data.time)) {
      return NextResponse.json(
        { 
          error: 'Time slot not available',
          details: [`The slot at ${data.time} on ${data.date} is already booked`]
        },
        { status: 409 }
      );
    }
    
    // Create the booking
    const booking = createBooking({
      serviceId: data.serviceId,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      date: data.date,
      time: data.time,
      status: 'pending',
      notes: data.notes?.trim() || undefined,
    });
    
    // Send email notifications (non-blocking)
    // We don't wait for this to complete - fire and forget
    sendBookingNotification(booking).catch(err => {
      console.error('Failed to send booking notifications:', err);
    });
    
    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Booking created successfully',
        booking: {
          id: booking.id,
          serviceId: booking.serviceId,
          name: booking.name,
          email: booking.email,
          phone: booking.phone,
          date: booking.date,
          time: booking.time,
          status: booking.status,
          notes: booking.notes,
          createdAt: booking.createdAt,
        },
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Error creating booking:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to create booking';
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
