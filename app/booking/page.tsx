import type { Metadata } from "next";
import { BookingStepper } from "@/components/booking";

export const metadata: Metadata = {
  title: "Réservation — Forward Design",
  description:
    "Réservez votre séance photo avec Forward Design. Portrait, événement, produit ou brand session — Kinshasa, RDC.",
  keywords: [
    "réservation",
    "photographe",
    "Kinshasa",
    "portrait",
    "event",
    "produit",
    "brand",
    "Forward Design",
  ],
};

export default function BookingPage() {
  return (
    <div className="relative min-h-screen px-6 py-24 md:px-12 md:py-32">
      {/* Background decoration */}
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        {/* Gradient orbs */}
        <div
          className="absolute -left-1/4 -top-1/4 h-[600px] w-[600px] rounded-full bg-accent-gold/5 blur-[100px]"
        />
        <div
          className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-accent-copper/5 blur-[100px]"
        />
      </div>

      {/* Main content */}
      <div className="relative mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-gold">
            Forward Design
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
            Réservez votre{" "}
            <span className="text-gradient">séance</span>
          </h1>
          <p className="mx-auto mt-4 max-w-lg font-body text-lg text-foreground-muted">
            Choisissez votre service, sélectionnez une date et horaire, et réservez votre
            expérience photo en quelques clics.
          </p>
        </div>

        {/* Booking flow */}
        <div className="rounded-xl border border-foreground-muted/10 bg-background-light/50 p-6 backdrop-blur-sm md:p-8 lg:p-12">
          <BookingStepper />
        </div>

        {/* Contact info */}
        <div className="mt-12 text-center">
          <p className="font-body text-sm text-foreground-muted">
            Vous préférez discuter avant de réserver?{" "}
            <a
              href="mailto:contact@forwarddesign.com"
              className="text-accent-gold transition-colors hover:text-accent-warm"
            >
              Envoyez-nous un email
            </a>{" "}
            ou{" "}
            <a
              href="#contact"
              className="text-accent-gold transition-colors hover:text-accent-warm"
            >
              utilisez le formulaire de contact
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}