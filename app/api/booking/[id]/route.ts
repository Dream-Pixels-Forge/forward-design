/**
 * Admin Booking Management API
 * 
 * Endpoints:
 * - GET /api/booking/[id] - Get a specific booking
 * - PUT /api/booking/[id] - Update booking status, date, time
 * - DELETE /api/booking/[id] - Delete a booking
 */

import { NextResponse } from 'next/server';
import { getBooking, updateBooking, deleteBooking } from '@/lib/booking';
import { isValidDate, isValidTime } from '@/types/booking';
import type { BookingStatus } from '@/types/booking';

/**
 * Valid status values
 */
const VALID_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];

/**
 * GET /api/booking/[id]
 * 
 * Get a specific booking by ID.
 * 
 * Response:
 *   - 200: Booking found
 *   - 404: Booking not found
 *   - 500: Server error
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const booking = getBooking(id);
    
    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ booking });
    
  } catch (error) {
    console.error('Error getting booking:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get booking';
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/booking/[id]
 * 
 * Update a booking (status, date, time, notes).
 * 
 * Request body (all optional):
 *   - status: string - New status (pending, confirmed, cancelled, completed)
 *   - date: string - New date (YYYY-MM-DD)
 *   - time: string - New time (HH:MM)
 *   - notes: string - Updated notes
 *   - name: string - Customer name
 *   - email: string - Customer email
 *   - phone: string - Customer phone
 *   - serviceId: string - Service ID
 * 
 * Response:
 *   - 200: Booking updated successfully
 *   - 400: Validation error
 *   - 404: Booking not found
 *   - 500: Server error
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Check if booking exists
    const existing = getBooking(id);
    
    if (!existing) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
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
    
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }
    
    const data = body as Record<string, unknown>;
    const updates: Record<string, unknown> = {};
    
    // Validate and process status
    if (data.status !== undefined) {
      if (!VALID_STATUSES.includes(data.status as BookingStatus)) {
        return NextResponse.json(
          { error: `Invalid status. Valid values: ${VALID_STATUSES.join(', ')}` },
          { status: 400 }
        );
      }
      updates.status = data.status;
    }
    
    // Validate and process date
    if (data.date !== undefined) {
      if (typeof data.date !== 'string') {
        return NextResponse.json(
          { error: 'date must be a string' },
          { status: 400 }
        );
      }
      if (!isValidDate(data.date)) {
        return NextResponse.json(
          { error: 'Invalid date format. Use YYYY-MM-DD' },
          { status: 400 }
        );
      }
      updates.date = data.date;
    }
    
    // Validate and process time
    if (data.time !== undefined) {
      if (typeof data.time !== 'string') {
        return NextResponse.json(
          { error: 'time must be a string' },
          { status: 400 }
        );
      }
      if (!isValidTime(data.time)) {
        return NextResponse.json(
          { error: 'Invalid time format. Use HH:MM (24-hour)' },
          { status: 400 }
        );
      }
      updates.time = data.time;
    }
    
    // Process other fields
    if (data.notes !== undefined) {
      updates.notes = typeof data.notes === 'string' ? data.notes : undefined;
    }
    
    if (data.name !== undefined) {
      if (typeof data.name !== 'string' || data.name.trim().length === 0) {
        return NextResponse.json(
          { error: 'name must be a non-empty string' },
          { status: 400 }
        );
      }
      updates.name = data.name.trim();
    }
    
    if (data.email !== undefined) {
      if (typeof data.email !== 'string' || data.email.trim().length === 0) {
        return NextResponse.json(
          { error: 'email must be a non-empty string' },
          { status: 400 }
        );
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        return NextResponse.json(
          { error: 'Invalid email format' },
          { status: 400 }
        );
      }
      updates.email = data.email.trim().toLowerCase();
    }
    
    if (data.phone !== undefined) {
      if (typeof data.phone !== 'string' || data.phone.trim().length === 0) {
        return NextResponse.json(
          { error: 'phone must be a non-empty string' },
          { status: 400 }
        );
      }
      updates.phone = data.phone.trim();
    }
    
    if (data.serviceId !== undefined) {
      if (typeof data.serviceId !== 'string') {
        return NextResponse.json(
          { error: 'serviceId must be a string' },
          { status: 400 }
        );
      }
      updates.serviceId = data.serviceId;
    }
    
    // Check if there's anything to update
    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    // Update the booking
    const updated = updateBooking(id, updates);
    
    if (!updated) {
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking updated successfully',
      booking: updated,
    });
    
  } catch (error) {
    console.error('Error updating booking:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to update booking';
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/booking/[id]
 * 
 * Delete a booking.
 * 
 * Response:
 *   - 200: Booking deleted successfully
 *   - 404: Booking not found
 *   - 500: Server error
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const deleted = deleteBooking(id);
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });
    
  } catch (error) {
    console.error('Error deleting booking:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to delete booking';
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}