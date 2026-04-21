"use client";

import Link from "next/link";
import { Service, Booking } from "@/types/booking";

interface ConfirmationProps {
  booking: Booking;
  service: Service;
}

export function Confirmation({ booking, service }: ConfirmationProps) {
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  // Generate Google Calendar link
  const generateCalendarLink = () => {
    const startDate = new Date(`${booking.date}T${booking.time}:00`);
    const endDate = new Date(startDate.getTime() + service.duration * 60000);

    const formatForCalendar = (date: Date) => {
      return date.toISOString().replace(/-|:|\.\d{3}/g, "");
    };

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: `Forward Design - ${service.name}`,
      dates: `${formatForCalendar(startDate)}/${formatForCalendar(endDate)}`,
      details: `${service.name}\n\nPrix: ${formatPrice(service.price)}\n\nCoordonnées:\n- ${booking.name}\n- ${booking.email}\n- ${booking.phone}`,
      location: "Kinshasa, République Démocratique du Congo",
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Success header */}
      <div className="text-center">
        {/* Success icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-accent-gold/20">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            className="text-accent-gold"
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

        <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-gold">
          Réservation confirmée
        </span>
        <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
          Merci pour votre confiance!
        </h2>
        <p className="mt-4 font-body text-lg text-foreground-muted">
          Votre réservation a été enregistrée avec succès.
        </p>
      </div>

      {/* Booking details card */}
      <div className="rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-6">
        <h3 className="font-display text-lg font-semibold text-accent-gold">
          Détails de la réservation
        </h3>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Service
            </p>
            <p className="font-display text-base font-semibold text-foreground">
              {service.name}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Date
            </p>
            <p className="font-display text-base font-semibold text-foreground">
              {formatDate(booking.date)}
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Horaire
            </p>
            <p className="font-display text-base font-semibold text-foreground">
              {formatTime(booking.time)} ({service.duration} min)
            </p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Total
            </p>
            <p className="font-display text-base font-bold text-accent-gold">
              {formatPrice(service.price)}
            </p>
          </div>

          {booking.notes && (
            <div className="sm:col-span-2">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
                Notes
              </p>
              <p className="font-body text-foreground">{booking.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Contact info card */}
      <div className="rounded-lg border border-foreground-muted/20 bg-background-light p-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Vos informations
        </h3>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Nom
            </p>
            <p className="font-body text-foreground">{booking.name}</p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Email
            </p>
            <p className="font-body text-foreground">{booking.email}</p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Téléphone
            </p>
            <p className="font-body text-foreground">{booking.phone}</p>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.1em] text-foreground-muted">
              Statut
            </p>
            <span className="inline-flex items-center rounded-full bg-accent-gold/20 px-3 py-1 font-mono text-xs font-medium text-accent-gold">
              En attente de confirmation
            </span>
          </div>
        </div>
      </div>

      {/* Next steps */}
      <div className="rounded-lg border border-foreground-muted/20 bg-background-light p-6">
        <h3 className="font-display text-lg font-semibold text-foreground">
          Prochaines étapes
        </h3>

        <div className="mt-4 space-y-4">
          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-gold/20 font-mono text-sm font-bold text-accent-gold">
              1
            </div>
            <div>
              <p className="font-body text-foreground">
                Confirmation par email
              </p>
              <p className="font-body text-sm text-foreground-muted">
                Nous vous enverrons un email de confirmation sous 24h.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-gold/20 font-mono text-sm font-bold text-accent-gold">
              2
            </div>
            <div>
              <p className="font-body text-foreground">
                Discussion du projet
              </p>
              <p className="font-body text-sm text-foreground-muted">
                Nous vous contacterons pour discuter des détails et attentes.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent-gold/20 font-mono text-sm font-bold text-accent-gold">
              3
            </div>
            <div>
              <p className="font-body text-foreground">
                Séance photo
              </p>
              <p className="font-body text-sm text-foreground-muted">
                Rendez-vous pour votre séance photo le jour prévu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <a
          href={generateCalendarLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-lg border border-accent-gold px-6 py-4 text-center font-display text-lg font-semibold text-accent-gold transition-all duration-200 hover:bg-accent-gold/10"
        >
          <span className="flex items-center justify-center gap-2">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M16 2V6M8 2V6M3 10H21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            Ajouter à Google Calendar
          </span>
        </a>

        <Link
          href="/"
          className="flex-1 rounded-lg border border-foreground-muted/20 px-6 py-4 text-center font-display text-lg font-semibold text-foreground transition-all duration-200 hover:border-accent-gold"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}