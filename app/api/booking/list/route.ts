/**
 * GET /api/booking/list
 * 
 * Get all bookings (admin endpoint).
 * 
 * Query parameters:
 *   - status: string (optional) - Filter by status: pending, confirmed, cancelled, completed
 *   - dateFrom: string (optional) - Filter from date (YYYY-MM-DD)
 *   - dateTo: string (optional) - Filter to date (YYYY-MM-DD)
 *   - serviceId: string (optional) - Filter by service
 * 
 * Response:
 *   - 200: Returns list of bookings
 *   - 400: Invalid filter parameters
 *   - 500: Server error
 */

import { NextResponse } from 'next/server';
import { getAllBookings } from '@/lib/booking';
import { isValidDate } from '@/types/booking';
import type { BookingStatus } from '@/types/booking';

/**
 * Valid status values
 */
const VALID_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    
    const status = searchParams.get('status');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const serviceId = searchParams.get('serviceId');
    
    // Validate status parameter
    if (status && !VALID_STATUSES.includes(status as BookingStatus)) {
      return NextResponse.json(
        { error: `Invalid status. Valid values: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Validate dateFrom format
    if (dateFrom && !isValidDate(dateFrom)) {
      return NextResponse.json(
        { error: 'Invalid dateFrom format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }
    
    // Validate dateTo format
    if (dateTo && !isValidDate(dateTo)) {
      return NextResponse.json(
        { error: 'Invalid dateTo format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }
    
    // Get all bookings
    let bookings = getAllBookings();
    
    // Apply filters
    if (status) {
      bookings = bookings.filter(b => b.status === status);
    }
    
    if (serviceId) {
      bookings = bookings.filter(b => b.serviceId === serviceId);
    }
    
    if (dateFrom) {
      bookings = bookings.filter(b => b.date >= dateFrom);
    }
    
    if (dateTo) {
      bookings = bookings.filter(b => b.date <= dateTo);
    }
    
    // Calculate statistics
    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
    };
    
    // Return response
    return NextResponse.json({
      bookings,
      count: bookings.length,
      filters: {
        status: status || null,
        dateFrom: dateFrom || null,
        dateTo: dateTo || null,
        serviceId: serviceId || null,
      },
      statistics: stats,
    });
    
  } catch (error) {
    console.error('Error getting bookings:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get bookings';
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
