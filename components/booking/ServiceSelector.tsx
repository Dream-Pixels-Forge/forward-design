"use client";

import { Service } from "@/types/booking";

interface ServiceSelectorProps {
  services: Service[];
  selectedService: Service | null;
  onSelect: (service: Service) => void;
}

export function ServiceSelector({
  services,
  selectedService,
  onSelect,
}: ServiceSelectorProps) {
  // Filter to only active services
  const activeServices = services.filter((service) => service.active);

  // Format price with USD
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${mins}min`;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-gold">
          Réservation
        </span>
        <h2 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
          Sélectionnez votre service
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {activeServices.map((service, index) => {
          const isSelected = selectedService?.id === service.id;

          return (
            <button
              key={service.id}
              onClick={() => onSelect(service)}
              className={`
                group relative overflow-hidden rounded-lg border p-6 text-left
                transition-all duration-300 ease-out
                ${
                  isSelected
                    ? "border-accent-gold bg-accent-gold/10"
                    : "border-foreground-muted/20 bg-background-light hover:border-accent-gold/50"
                }
              `}
              style={{
                opacity: 1,
                transform: "translateY(0)",
                animation: "fadeInUpSmooth 0.5s ease-out forwards",
                animationDelay: `${index * 0.1}s`,
              }}
            >
              {/* Selection indicator */}
              <div
                className={`
                  absolute left-0 top-0 h-full w-1 transition-all duration-300
                  ${isSelected ? "bg-accent-gold" : "bg-transparent"}
                `}
              />

              <div className="relative ml-2">
                <h3
                  className={`
                    font-display text-xl font-semibold transition-colors
                    ${isSelected ? "text-accent-gold" : "text-foreground"}
                  `}
                >
                  {service.name}
                </h3>

                <p className="mt-2 font-body text-sm text-foreground-muted">
                  {service.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-foreground-muted">
                      {formatDuration(service.duration)}
                    </span>
                    <span
                      className={`
                        font-display text-lg font-bold
                        ${isSelected ? "text-accent-gold" : "text-foreground"}
                      `}
                    >
                      {formatPrice(service.price)}
                    </span>
                  </div>

                  {/* Selection icon */}
                  <div
                    className={`
                      flex h-6 w-6 items-center justify-center rounded-full
                      border-2 transition-all duration-300
                      ${
                        isSelected
                          ? "border-accent-gold bg-accent-gold"
                          : "border-foreground-muted/30"
                      }
                    `}
                  >
                    {isSelected && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-background"
                      >
                        <path
                          d="M5 12L10 17L19 8"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedService && (
        <div
          className="mt-6 rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-4"
          style={{
            animation: "fadeInUpSmooth 0.4s ease-out forwards",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-body text-sm text-foreground-muted">
                Service sélectionné
              </p>
              <p className="font-display text-lg font-semibold text-accent-gold">
                {selectedService.name}
              </p>
            </div>
            <div className="text-right">
              <p className="font-body text-sm text-foreground-muted">
                Durée totale
              </p>
              <p className="font-display text-lg font-semibold text-foreground">
                {formatDuration(selectedService.duration)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}