/**
 * Booking Storage API
 * 
 * Re-exports all storage functions for convenient importing.
 */

export {
  createBooking,
  getBooking,
  getAllBookings,
  getBookingsByDate,
  getBookingsByService,
  getBookingsByStatus,
  updateBooking,
  deleteBooking,
  getAvailableSlots,
  isSlotAvailable,
  getBookingStats,
  clearAllBookings,
} from './storage';

export {
  sendBookingNotification,
  sendCustomerConfirmation,
  sendAdminNotification,
} from './notifications';