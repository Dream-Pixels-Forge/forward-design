"use client";

import { useState, useEffect } from "react";
import { Service, Booking, DEFAULT_SERVICES, DEFAULT_TIME_SLOTS } from "@/types/booking";
import { ServiceSelector } from "./ServiceSelector";
import { CalendarPicker } from "./CalendarPicker";
import { TimeSlotPicker } from "./TimeSlotPicker";
import { BookingForm } from "./BookingForm";
import { Confirmation } from "./Confirmation";

// Step types
type BookingStep = "service" | "date" | "time" | "details" | "confirmation";

interface BookingState {
  step: BookingStep;
  selectedService: Service | null;
  selectedDate: Date | null;
  selectedTime: string | null;
  booking: Booking | null;
}

const initialState: BookingState = {
  step: "service",
  selectedService: null,
  selectedDate: null,
  selectedTime: null,
  booking: null,
};

export function BookingStepper() {
  const [state, setState] = useState<BookingState>(initialState);
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);

  // Move to next step
  const goToStep = (step: BookingStep) => {
    setState((prev) => ({ ...prev, step }));
  };

  // Select service
  const handleServiceSelect = (service: Service) => {
    setState((prev) => ({
      ...prev,
      selectedService: service,
      step: "date",
    }));
  };

  // Select date
  const handleDateSelect = (date: Date) => {
    setState((prev) => ({
      ...prev,
      selectedDate: date,
      selectedTime: null, // Reset time when date changes
      step: "time",
    }));
  };

  // Select time
  const handleTimeSelect = (time: string) => {
    setState((prev) => ({
      ...prev,
      selectedTime: time,
      step: "details",
    }));
  };

  // Submit booking
  const handleSubmit = async (
    bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt">
  ) => {
    const response = await fetch("/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create booking");
    }

    const result = await response.json();

    // Update state with booking
    setState((prev) => ({
      ...prev,
      booking: result.booking,
      step: "confirmation",
    }));
  };

  // Steps array for progress indicator
  const steps: { key: BookingStep; label: string }[] = [
    { key: "service", label: "Service" },
    { key: "date", label: "Date" },
    { key: "time", label: "Heure" },
    { key: "details", label: "Détails" },
    { key: "confirmation", label: "Confirmé" },
  ];

  // Current step index
  const currentStepIndex = steps.findIndex((s) => s.key === state.step);

  // Get current step status
  const getStepStatus = (stepKey: BookingStep) => {
    const stepIndex = steps.findIndex((s) => s.key === stepKey);
    const currentIndex = currentStepIndex;

    if (stepIndex < currentIndex) return "completed";
    if (stepIndex === currentIndex) return "current";
    return "upcoming";
  };

  return (
    <div className="space-y-8">
      {/* Progress indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.slice(0, -1).map((step, index) => {
            const status = getStepStatus(step.key);
            const isLast = index === steps.length - 2;

            return (
              <div key={step.key} className="flex flex-1 items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      flex h-10 w-10 items-center justify-center rounded-full
                      border-2 font-mono text-sm font-bold transition-all duration-300
                      ${
                        status === "completed"
                          ? "border-accent-gold bg-accent-gold text-background"
                          : status === "current"
                          ? "border-accent-gold bg-accent-gold/10 text-accent-gold"
                          : "border-foreground-muted/30 text-foreground-muted"
                      }
                    `}
                  >
                    {status === "completed" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M5 12L10 17L19 8"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`
                      font-mono text-xs uppercase tracking-wider
                      ${
                        status === "current"
                          ? "text-accent-gold"
                          : status === "completed"
                          ? "text-foreground"
                          : "text-foreground-muted"
                      }
                    `}
                  >
                    {step.label}
                  </span>
                </div>

                {!isLast && (
                  <div
                    className={`
                      flex-1 h-px mx-4 transition-all duration-300
                      ${
                        status === "completed"
                          ? "bg-accent-gold"
                          : "bg-foreground-muted/20"
                      }
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile progress indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-wider text-accent-gold">
            Étape {currentStepIndex + 1} sur {steps.length - 1}
          </span>
          <span className="font-mono text-xs uppercase tracking-wider text-foreground-muted">
            {steps[currentStepIndex]?.label}
          </span>
        </div>
        <div className="mt-2 h-1 w-full rounded-full bg-foreground-muted/20">
          <div
            className="h-1 rounded-full bg-accent-gold transition-all duration-300"
            style={{
              width: `${((currentStepIndex + 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {state.step === "service" && (
          <ServiceSelector
            services={services}
            selectedService={state.selectedService}
            onSelect={handleServiceSelect}
          />
        )}

        {state.step === "date" && (
          <CalendarPicker
            selectedDate={state.selectedDate}
            onSelect={handleDateSelect}
          />
        )}

        {state.step === "time" && state.selectedDate && (
          <TimeSlotPicker
            selectedDate={state.selectedDate}
            selectedServiceDuration={state.selectedService?.duration || 60}
            selectedTime={state.selectedTime}
            onSelect={handleTimeSelect}
          />
        )}

        {state.step === "details" &&
          state.selectedService &&
          state.selectedDate &&
          state.selectedTime && (
            <BookingForm
              selectedService={state.selectedService}
              selectedDate={state.selectedDate}
              selectedTime={state.selectedTime}
              onSubmit={handleSubmit}
              onSuccess={() => {}}
            />
          )}

        {state.step === "confirmation" && state.booking && state.selectedService && (
          <Confirmation
            booking={state.booking}
            service={state.selectedService}
          />
        )}
      </div>

      {/* Back button */}
      {state.step !== "service" && state.step !== "confirmation" && (
        <button
          onClick={() => {
            const stepIndex = steps.findIndex((s) => s.key === state.step);
            if (stepIndex > 0) {
              goToStep(steps[stepIndex - 1].key);
            }
          }}
          className="flex items-center gap-2 text-foreground-muted transition-colors hover:text-foreground"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="font-body">Retour</span>
        </button>
      )}
    </div>
  );
}