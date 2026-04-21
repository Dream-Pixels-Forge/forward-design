/**
 * Admin Booking Page
 * 
 * Admin dashboard for managing bookings.
 * Features:
 * - List all bookings with filtering
 * - Filter by status (pending, confirmed, cancelled, completed)
 * - Sort by date
 * - Update booking status
 * - Reschedule bookings
 * - Cancel bookings
 * 
 * Note: This is a protected route. In production, add authentication.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Booking, BookingStatus } from '@/types/booking';
import { DEFAULT_SERVICES } from '@/types/booking';

// Status badge colors
const statusColors: Record<BookingStatus, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  confirmed: { bg: 'bg-green-500/20', text: 'text-green-400' },
  cancelled: { bg: 'bg-red-500/20', text: 'text-red-400' },
  completed: { bg: 'bg-blue-500/20', text: 'text-blue-400' },
};

// Get service name by ID
function getServiceName(serviceId: string): string {
  const service = DEFAULT_SERVICES.find(s => s.id === serviceId);
  return service?.name || serviceId;
}

// Format date for display
function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Format time for display
function formatTime(timeStr: string): string {
  const [hours, minutes] = timeStr.split(':');
  return `${hours}h${minutes}`;
}

interface BookingFilters {
  status: BookingStatus | 'all';
  dateFrom: string;
  dateTo: string;
}

interface Statistics {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export default function AdminBookingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [stats, setStats] = useState<Statistics>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<BookingFilters>({
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });
  
  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch bookings
  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      if (filters.status !== 'all') {
        params.set('status', filters.status);
      }
      if (filters.dateFrom) {
        params.set('dateFrom', filters.dateFrom);
      }
      if (filters.dateTo) {
        params.set('dateTo', filters.dateTo);
      }
      
      const response = await fetch(`/api/booking/list?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }
      
      const data = await response.json();
      setBookings(data.bookings);
      setStats(data.statistics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Update booking status
  const updateStatus = async (id: string, status: BookingStatus) => {
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/booking/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update booking');
      }
      
      await fetchBookings();
      setShowCancelModal(false);
      setSelectedBooking(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  // Reschedule booking
  const rescheduleBooking = async () => {
    if (!selectedBooking || !rescheduleDate || !rescheduleTime) return;
    
    try {
      setActionLoading(true);
      
      const response = await fetch(`/api/booking/${selectedBooking.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date: rescheduleDate,
          time: rescheduleTime,
          status: 'pending', // Reset to pending after reschedule
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reschedule booking');
      }
      
      await fetchBookings();
      setShowRescheduleModal(false);
      setSelectedBooking(null);
      setRescheduleDate('');
      setRescheduleTime('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reschedule');
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm booking
  const confirmBooking = async (id: string) => {
    await updateStatus(id, 'confirmed');
  };

  // Cancel booking
  const cancelBooking = async () => {
    if (!selectedBooking) return;
    await updateStatus(selectedBooking.id, 'cancelled');
  };

  // Open reschedule modal
  const openRescheduleModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setRescheduleDate(booking.date);
    setRescheduleTime(booking.time);
    setShowRescheduleModal(true);
  };

  // Open cancel modal
  const openCancelModal = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowCancelModal(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
              Administration
            </span>
            <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
              Gestion des réservations
            </h1>
          </div>
          <button
            onClick={fetchBookings}
            className="rounded-lg border border-foreground-muted/20 px-4 py-2 text-sm font-medium text-foreground-muted transition-colors hover:border-accent-gold/50 hover:text-foreground"
          >
            Actualiser
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <div className="rounded-lg border border-foreground-muted/10 bg-background-light p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
            Total
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-foreground">
            {stats.total}
          </p>
        </div>
        <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-yellow-400">
            En attente
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-yellow-400">
            {stats.pending}
          </p>
        </div>
        <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-green-400">
            Confirmées
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-green-400">
            {stats.confirmed}
          </p>
        </div>
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-blue-400">
            Terminées
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-blue-400">
            {stats.completed}
          </p>
        </div>
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <p className="font-mono text-xs uppercase tracking-wider text-red-400">
            Annulées
          </p>
          <p className="mt-1 font-display text-2xl font-bold text-red-400">
            {stats.cancelled}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 rounded-lg border border-foreground-muted/10 bg-background-light p-4">
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
            Statut
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value as BookingStatus | 'all' })}
            className="rounded-md border border-foreground-muted/20 bg-background px-3 py-2 text-sm text-foreground focus:border-accent-gold focus:outline-none"
          >
            <option value="all">Tous</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmée</option>
            <option value="completed">Terminée</option>
            <option value="cancelled">Annulée</option>
          </select>
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
            À partir du
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
            className="rounded-md border border-foreground-muted/20 bg-background px-3 py-2 text-sm text-foreground focus:border-accent-gold focus:outline-none"
          />
        </div>
        
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
            Until
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
            className="rounded-md border border-foreground-muted/20 bg-background px-3 py-2 text-sm text-foreground focus:border-accent-gold focus:outline-none"
          />
        </div>
        
        <div className="flex items-end">
          <button
            onClick={() => setFilters({ status: 'all', dateFrom: '', dateTo: '' })}
            className="rounded-md border border-foreground-muted/20 px-4 py-2 text-sm text-foreground-muted transition-colors hover:border-foreground-muted/40 hover:text-foreground"
          >
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground-muted/20 border-t-accent-gold" />
        </div>
      )}

      {/* Booking list */}
      {!loading && (
        <div className="overflow-x-auto rounded-lg border border-foreground-muted/10 bg-background-light">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground-muted/10 bg-background">
                <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-foreground-muted">
                  Date & Heure
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-foreground-muted">
                  Service
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-foreground-muted">
                  Client
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-foreground-muted">
                  Contact
                </th>
                <th className="px-4 py-3 text-left font-mono text-xs uppercase tracking-wider text-foreground-muted">
                  Statut
                </th>
                <th className="px-4 py-3 text-right font-mono text-xs uppercase tracking-wider text-foreground-muted">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-foreground-muted">
                    Aucune réservation trouvée
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="border-b border-foreground-muted/5 transition-colors hover:bg-background"
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {formatDate(booking.date)}
                        </span>
                        <span className="text-sm text-foreground-muted">
                          {formatTime(booking.time)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-foreground">
                        {getServiceName(booking.serviceId)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          {booking.name}
                        </span>
                        <span className="text-sm text-foreground-muted">
                          {booking.email}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-foreground-muted">
                        {booking.phone}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusColors[booking.status].bg
                        } ${statusColors[booking.status].text}`}
                      >
                        {booking.status === 'pending' && 'En attente'}
                        {booking.status === 'confirmed' && 'Confirmée'}
                        {booking.status === 'completed' && 'Terminée'}
                        {booking.status === 'cancelled' && 'Annulée'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => confirmBooking(booking.id)}
                            className="rounded-md bg-green-500/20 px-3 py-1.5 text-xs font-medium text-green-400 transition-colors hover:bg-green-500/30"
                          >
                            Confirmer
                          </button>
                        )}
                        <button
                          onClick={() => openRescheduleModal(booking)}
                          className="rounded-md border border-foreground-muted/20 px-3 py-1.5 text-xs font-medium text-foreground-muted transition-colors hover:border-accent-gold/50 hover:text-foreground"
                        >
                          Reprogrammer
                        </button>
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <button
                            onClick={() => openCancelModal(booking)}
                            className="rounded-md border border-red-500/30 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/10"
                          >
                            Annuler
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-foreground-muted/20 bg-background-light p-6">
            <h3 className="mb-4 font-display text-xl font-bold text-foreground">
              Reprogrammer la réservation
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-foreground-muted">
                  Nouvelle date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full rounded-md border border-foreground-muted/20 bg-background px-3 py-2 text-foreground focus:border-accent-gold focus:outline-none"
                />
              </div>
              
              <div>
                <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-foreground-muted">
                  Nouvel horaire
                </label>
                <select
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="w-full rounded-md border border-foreground-muted/20 bg-background px-3 py-2 text-foreground focus:border-accent-gold focus:outline-none"
                >
                  <option value="">Sélectionner</option>
                  <option value="09:00">09h00</option>
                  <option value="10:00">10h00</option>
                  <option value="11:00">11h00</option>
                  <option value="13:00">13h00</option>
                  <option value="14:00">14h00</option>
                  <option value="15:00">15h00</option>
                  <option value="16:00">16h00</option>
                  <option value="17:00">17h00</option>
                </select>
              </div>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowRescheduleModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 rounded-md border border-foreground-muted/20 px-4 py-2 font-medium text-foreground-muted transition-colors hover:border-foreground-muted/40 hover:text-foreground"
              >
                Annuler
              </button>
              <button
                onClick={rescheduleBooking}
                disabled={!rescheduleDate || !rescheduleTime || actionLoading}
                className="flex-1 rounded-md bg-accent-gold px-4 py-2 font-medium text-background transition-colors hover:bg-accent-warm disabled:opacity-50"
              >
                {actionLoading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-xl border border-red-500/30 bg-background-light p-6">
            <h3 className="mb-2 font-display text-xl font-bold text-foreground">
              Annuler la réservation
            </h3>
            <p className="mb-6 text-foreground-muted">
              Êtes-vous sûr de vouloir annuler la réservation de{' '}
              <span className="font-medium text-foreground">{selectedBooking.name}</span> du{' '}
              {formatDate(selectedBooking.date)} à {formatTime(selectedBooking.time)} ?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 rounded-md border border-foreground-muted/20 px-4 py-2 font-medium text-foreground-muted transition-colors hover:border-foreground-muted/40 hover:text-foreground"
              >
                Non, garder
              </button>
              <button
                onClick={cancelBooking}
                disabled={actionLoading}
                className="flex-1 rounded-md bg-red-500 px-4 py-2 font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {actionLoading ? 'Annulation...' : 'Oui, annuler'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}