"use client";

import { useState, useEffect } from "react";
import { DEFAULT_TIME_SLOTS } from "@/types/booking";

interface TimeSlotPickerProps {
  selectedDate: Date;
  selectedServiceDuration: number;
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotPicker({
  selectedDate,
  selectedServiceDuration,
  selectedTime,
  onSelect,
}: TimeSlotPickerProps) {
  const [availableSlots, setAvailableSlots] = useState<
    { time: string; available: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Fetch available slots from API
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      setLoading(true);

      const dateString = selectedDate.toISOString().split("T")[0];

      try {
        const response = await fetch(
          `/api/booking/available?date=${dateString}&duration=${selectedServiceDuration}`
        );

        if (response.ok) {
          const data = await response.json();
          setAvailableSlots(data.slots || []);
        } else {
          // Fall back to default slots if API fails
          setAvailableSlots(
            DEFAULT_TIME_SLOTS.map((time) => ({
              time,
              available: true,
            }))
          );
        }
      } catch {
        // Fall back to default slots on error
        setAvailableSlots(
          DEFAULT_TIME_SLOTS.map((time) => ({
            time,
            available: true,
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedServiceDuration]);

  // Format time for display (24h to 12h)
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Calculate end time based on service duration
  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes + duration;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-gold">
          Réservation
        </span>
        <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
          Sélectionnez un horaire
        </h2>

        <p className="mt-2 font-body text-foreground-muted">
          {selectedDate.toLocaleDateString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Duration info */}
      <div className="rounded-lg border border-foreground-muted/20 bg-background-light p-4">
        <div className="flex items-center justify-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            className="text-accent-gold"
          >
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 6V12L16 16"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-body text-sm text-foreground-muted">
            Durée du service:{" "}
            <span className="font-semibold text-foreground">
              {selectedServiceDuration} minutes
            </span>
          </span>
        </div>
      </div>

      {/* Time slots grid */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg border border-foreground-muted/20 bg-background-light p-4"
            >
              <div className="h-4 w-16 rounded bg-foreground-muted/20" />
            </div>
          ))
        ) : (
          availableSlots.map((slot, index) => {
            const isSelected = selectedTime === slot.time;
            const endTime = calculateEndTime(slot.time, selectedServiceDuration);

            return (
              <button
                key={slot.time}
                onClick={() => slot.available && onSelect(slot.time)}
                disabled={!slot.available}
                className={`
                  group relative overflow-hidden rounded-lg border p-3
                  transition-all duration-200
                  ${
                    isSelected
                      ? "border-accent-gold bg-accent-gold/10"
                      : slot.available
                      ? "border-foreground-muted/20 bg-background-light hover:border-accent-gold/50"
                      : "cursor-not-allowed border-foreground-muted/10 bg-background-lighter opacity-40"
                  }
                `}
                style={{
                  animation: "fadeInUpSmooth 0.4s ease-out forwards",
                  animationDelay: `${index * 0.05}s`,
                }}
              >
                {/* Selection highlight */}
                <div
                  className={`
                    absolute inset-0 transition-opacity duration-200
                    ${isSelected ? "opacity-100" : "opacity-0"}
                  `}
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(212, 168, 67, 0.1) 0%, transparent 100%)",
                  }}
                />

                <div className="relative">
                  <span
                    className={`
                      font-display text-lg font-semibold
                      ${isSelected ? "text-accent-gold" : "text-foreground"}
                      ${!slot.available ? "text-foreground-muted/50" : ""}
                    `}
                  >
                    {formatTime(slot.time)}
                  </span>

                  {/* End time indicator */}
                  {slot.available && (
                    <p className="mt-1 font-mono text-xs text-foreground-muted">
                      → {formatTime(endTime)}
                    </p>
                  )}

                  {/* Unavailable indicator */}
                  {!slot.available && (
                    <p className="mt-1 font-mono text-xs text-foreground-muted">
                      Indisponible
                    </p>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>

      {availableSlots.length === 0 && !loading && (
        <div className="rounded-lg border border-foreground-muted/20 bg-background-light p-8 text-center">
          <p className="font-body text-foreground-muted">
            Aucun créneau disponible pour cette date.
          </p>
          <p className="mt-2 font-body text-sm text-foreground-muted">
            Veuillez sélectionner une autre date.
          </p>
        </div>
      )}

      {selectedTime && (
        <div
          className="rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-4"
          style={{
            animation: "fadeInUpSmooth 0.4s ease-out forwards",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-foreground-muted">
                Horaire sélectionné
              </p>
              <p className="font-display text-lg font-semibold text-accent-gold">
                {formatTime(selectedTime)} -{" "}
                {formatTime(
                  calculateEndTime(selectedTime, selectedServiceDuration)
                )}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-gold">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                className="text-background"
              >
                <path
                  d="M5 12L10 17L19 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}