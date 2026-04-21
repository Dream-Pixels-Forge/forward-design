/**
 * GET /api/booking/available
 * 
 * Get available time slots for a specific date.
 * 
 * Query parameters:
 *   - date: string (required) - Date in YYYY-MM-DD format
 *   - serviceId: string (optional) - Service ID for duration consideration
 * 
 * Response:
 *   - 200: Returns available slots
 *   - 400: Missing or invalid date parameter
 *   - 500: Server error
 */

import { NextResponse } from 'next/server';
import { getAvailableSlots } from '@/lib/booking';
import { DEFAULT_SERVICES, isValidDate } from '@/types/booking';

export async function GET(request: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    
    // Validate required date parameter
    if (!date) {
      return NextResponse.json(
        { error: 'date parameter is required' },
        { status: 400 }
      );
    }
    
    // Validate date format
    if (!isValidDate(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }
    
    // Validate serviceId if provided
    if (serviceId && !DEFAULT_SERVICES.find(s => s.id === serviceId)) {
      return NextResponse.json(
        { error: 'Invalid serviceId' },
        { status: 400 }
      );
    }
    
    // Get service duration for calculation
    const service = serviceId ? DEFAULT_SERVICES.find(s => s.id === serviceId) : null;
    const duration = service?.duration || 60;
    
    // Get available slots
    const slots = getAvailableSlots(date, duration);
    
    // Separate available and unavailable slots
    const availableSlots = slots.filter(s => s.available);
    const bookedSlots = slots.filter(s => !s.available);
    
    // Return response
    return NextResponse.json({
      date,
      serviceId: serviceId || null,
      serviceDuration: duration,
      slots: slots,
      summary: {
        total: slots.length,
        available: availableSlots.length,
        booked: bookedSlots.length,
      },
      availableTimes: availableSlots.map(s => s.time),
    });
    
  } catch (error) {
    console.error('Error getting available slots:', error);
    
    const message = error instanceof Error ? error.message : 'Failed to get available slots';
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
