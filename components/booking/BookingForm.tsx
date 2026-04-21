"use client";

import { useState, FormEvent } from "react";
import { Service, Booking } from "@/types/booking";

interface BookingFormProps {
  selectedService: Service;
  selectedDate: Date;
  selectedTime: string;
  onSubmit: (booking: Omit<Booking, "id" | "createdAt" | "updatedAt">) => Promise<void>;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

export function BookingForm({
  selectedService,
  selectedDate,
  selectedTime,
  onSubmit,
  onSuccess,
}: BookingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Format time
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Validate email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate phone (basic international format)
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[\d\s\-()]{8,}$/;
    return phoneRegex.test(phone);
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Le nom doit contenir au moins 2 caractères";
    }

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Veuillez entrer un email valide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = "Veuillez entrer un numéro valide";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create booking data
      const bookingData: Omit<Booking, "id" | "createdAt" | "updatedAt"> = {
        serviceId: selectedService.id,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        date: selectedDate.toISOString().split("T")[0],
        time: selectedTime,
        status: "pending",
        notes: formData.notes.trim() || undefined,
      };

      await onSubmit(bookingData);
      onSuccess();
    } catch (error) {
      console.error("Booking submission error:", error);
      setSubmitError(
        "Une erreur est survenue lors de la réservation. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-gold">
          Réservation
        </span>
        <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
          Vos informations
        </h2>
      </div>

      {/* Booking summary */}
      <div className="rounded-lg border border-foreground-muted/20 bg-background-light p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Service
            </p>
            <p className="font-display text-base font-semibold text-foreground">
              {selectedService.name}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Date
            </p>
            <p className="font-display text-base font-semibold text-foreground">
              {formatDate(selectedDate)}
            </p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Heure
            </p>
            <p className="font-display text-base font-semibold text-foreground">
              {formatTime(selectedTime)} ({selectedService.duration} min)
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-foreground-muted/20 pt-4">
          <div className="flex items-center justify-between">
            <span className="font-body text-foreground-muted">
              Total estimé
            </span>
            <span className="font-display text-xl font-bold text-accent-gold">
              {formatPrice(selectedService.price)}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted"
          >
            Nom complet *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`
              w-full rounded-lg border bg-background-light px-4 py-3
              font-body text-foreground placeholder:text-foreground-muted/50
              transition-all duration-200
              focus:outline-none focus:ring-2
              ${
                errors.name
                  ? "border-red-500 focus:ring-red-500/30"
                  : "border-foreground-muted/20 focus:border-accent-gold focus:ring-accent-gold/30"
              }
            `}
            placeholder="Votre nom complet"
          />
          {errors.name && (
            <p className="font-body text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Email field */}
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`
              w-full rounded-lg border bg-background-light px-4 py-3
              font-body text-foreground placeholder:text-foreground-muted/50
              transition-all duration-200
              focus:outline-none focus:ring-2
              ${
                errors.email
                  ? "border-red-500 focus:ring-red-500/30"
                  : "border-foreground-muted/20 focus:border-accent-gold focus:ring-accent-gold/30"
              }
            `}
            placeholder="votre@email.com"
          />
          {errors.email && (
            <p className="font-body text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone field */}
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted"
          >
            Téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`
              w-full rounded-lg border bg-background-light px-4 py-3
              font-body text-foreground placeholder:text-foreground-muted/50
              transition-all duration-200
              focus:outline-none focus:ring-2
              ${
                errors.phone
                  ? "border-red-500 focus:ring-red-500/30"
                  : "border-foreground-muted/20 focus:border-accent-gold focus:ring-accent-gold/30"
              }
            `}
            placeholder="+243 999 999 999"
          />
          {errors.phone && (
            <p className="font-body text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Notes field */}
        <div className="space-y-2">
          <label
            htmlFor="notes"
            className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted"
          >
            Notes (optionnel)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            className="w-full rounded-lg border border-foreground-muted/20 bg-background-light px-4 py-3 font-body text-foreground placeholder:text-foreground-muted/50 transition-all duration-200 focus:border-accent-gold focus:outline-none focus:ring-2 focus:ring-accent-gold/30"
            placeholder="Informations supplémentaires, préférences, etc."
          />
        </div>

        {/* Submit error */}
        {submitError && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <p className="font-body text-sm text-red-500">{submitError}</p>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`
            w-full rounded-lg border bg-accent-gold px-6 py-4
            font-display text-lg font-semibold text-background
            transition-all duration-200
            hover:bg-accent-warm
            disabled:cursor-not-allowed disabled:opacity-50
          `}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
              Réservation en cours...
            </span>
          ) : (
            <span>Confirmer la réservation</span>
          )}
        </button>

        <p className="text-center font-body text-xs text-foreground-muted">
          En cliquant sur "Confirmer la réservation", vous acceptez nos{" "}
          <a href="#terms" className="text-accent-gold hover:underline">
            conditions d&apos;utilisation
          </a>
        </p>
      </form>
    </div>
  );
}