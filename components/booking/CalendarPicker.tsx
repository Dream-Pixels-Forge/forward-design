"use client";

import { useState, useEffect } from "react";

interface CalendarPickerProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  availableDates?: string[]; // YYYY-MM-DD format
}

export function CalendarPicker({
  selectedDate,
  onSelect,
  availableDates = [],
}: CalendarPickerProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<
    { date: Date; isCurrentMonth: boolean; isToday: boolean; isAvailable: boolean }[]
  >([]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate calendar days for the current month
  useEffect(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday
    const daysInMonth = lastDay.getDate();

    const days: {
      date: Date;
      isCurrentMonth: boolean;
      isToday: boolean;
      isAvailable: boolean;
    }[] = [];

    // Add days from previous month to fill the first week
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      const dateString = formatDateString(date);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isAvailable: !availableDates.length || availableDates.includes(dateString),
      });
    }

    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dateString = formatDateString(date);
      const isPast = date < today;

      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime(),
        isAvailable: !isPast && (!availableDates.length || availableDates.includes(dateString)),
      });
    }

    // Add days from next month to complete the last week
    const remainingDays = 42 - days.length; // 6 weeks
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      const dateString = formatDateString(date);

      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        isAvailable: !availableDates.length || availableDates.includes(dateString),
      });
    }

    setCalendarDays(days);
  }, [currentMonth, availableDates]);

  // Helper to format date string
  function formatDateString(date: Date): string {
    return date.toISOString().split("T")[0];
  }

  // Format month for display
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
  };

  // Navigate months
  const goToPrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    if (newDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newDate);
    }
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentMonth(newDate);
  };

  // Check if previous month is allowed
  const canGoPrev = () => {
    const prevMonth = new Date(today);
    prevMonth.setMonth(prevMonth.getMonth());
    return currentMonth.getFullYear() > prevMonth.getFullYear() ||
      (currentMonth.getFullYear() === prevMonth.getFullYear() &&
        currentMonth.getMonth() > prevMonth.getMonth());
  };

  // Day names
  const dayNames = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-gold">
          Réservation
        </span>
        <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
          Choisissez une date
        </h2>
      </div>

      <div className="rounded-lg border border-foreground-muted/20 bg-background-light p-4">
        {/* Month navigation */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={goToPrevMonth}
            disabled={!canGoPrev()}
            className={`
              flex h-10 w-10 items-center justify-center rounded-lg
              border border-foreground-muted/20 text-foreground-muted
              transition-all duration-200 hover:border-accent-gold hover:text-accent-gold
              disabled:cursor-not-allowed disabled:opacity-30
            `}
            aria-label="Mois précédent"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <h3 className="font-display text-lg font-semibold text-foreground">
            {formatMonth(currentMonth)}
          </h3>

          <button
            onClick={goToNextMonth}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-foreground-muted/20 text-foreground-muted transition-all duration-200 hover:border-accent-gold hover:text-accent-gold"
            aria-label="Mois suivant"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Day names */}
        <div className="mb-2 grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div
              key={day}
              className="py-2 text-center font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => {
            const isSelected =
              selectedDate &&
              day.date.toDateString() === selectedDate.toDateString();
            const isPast = day.date < today;

            return (
              <button
                key={index}
                onClick={() => {
                  if (day.isCurrentMonth && !isPast) {
                    onSelect(day.date);
                  }
                }}
                disabled={!day.isCurrentMonth || isPast || !day.isAvailable}
                className={`
                  relative h-12 w-full rounded-lg font-body text-sm
                  transition-all duration-200
                  ${
                    isSelected
                      ? "bg-accent-gold text-background"
                      : !day.isCurrentMonth || isPast || !day.isAvailable
                      ? "cursor-not-allowed opacity-20"
                      : "hover:border-accent-gold/50 hover:bg-foreground-muted/10"
                  }
                  ${day.isToday && !isSelected ? "border border-accent-gold/50" : "border border-transparent"}
                  ${day.isCurrentMonth && !isPast && day.isAvailable && !isSelected ? "border border-foreground-muted/20" : ""}
                `}
              >
                <span
                  className={`
                    ${isSelected ? "font-semibold" : ""}
                  `}
                >
                  {day.date.getDate()}
                </span>

                {/* Available indicator */}
                {day.isCurrentMonth &&
                  !isPast &&
                  day.isAvailable &&
                  !isSelected &&
                  availableDates.length === 0 && (
                    <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent-gold" />
                  )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div
          className="rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-4"
          style={{
            animation: "fadeInUpSmooth 0.4s ease-out forwards",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-foreground-muted">
                Date sélectionnée
              </p>
              <p className="font-display text-lg font-semibold text-accent-gold">
                {selectedDate.toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
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