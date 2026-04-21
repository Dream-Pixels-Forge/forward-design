"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { WhatsAppQR } from "../WhatsAppQR";

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

export function ContactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const whatsappLink = WHATSAPP_PHONE
    ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent("Bonjour! Je souhaite discuter d'un projet avec vous.")}`
    : null;

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative min-h-[80vh] px-6 py-24 md:px-12 md:py-32"
      aria-label="Contactez Forward Design"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-2">
          <div
            className="flex flex-col justify-center"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.8s ease-out",
            }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-gold">
              Contact
            </span>

            <h2 className="mt-6 font-display text-5xl font-bold leading-tight md:text-7xl lg:text-8xl">
              Racontez-moi{" "}
              <span className="text-gradient">votre histoire</span>
            </h2>

            <p className="mt-8 max-w-md font-body text-lg text-foreground-muted">
              Chaque projet commence par une conversation. Que vous ayez une vision 
              claire ou une idée naissante, je suis là pour vous aider à la raconter 
              visuellement.
            </p>

            <a
              href="mailto:contact@forwarddesign.com"
              className="mt-10 inline-flex items-center gap-4 group"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out 0.3s",
              }}
              data-cursor-hover
            >
              <span className="font-body text-lg font-medium text-foreground transition-colors group-hover:text-accent-gold">
                contact@forwarddesign.com
              </span>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="text-accent-gold"
                style={{
                  animation: "slideRight 2s ease-in-out infinite",
                }}
              >
                <path
                  d="M5 12H19M19 12L13 6M19 12L13 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>

          <div
            className="flex flex-col justify-center"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s ease-out 0.2s",
            }}
          >
            <div className="rounded-lg border border-foreground-muted/20 bg-background-light/50 p-8 backdrop-blur-sm">
              <h3 className="font-display text-xl font-semibold text-foreground">
                Informations
              </h3>

              <div className="mt-6 space-y-6">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
                    Localisation
                  </p>
                  <p className="mt-2 font-body text-foreground-muted">
                    Kinshasa, République Démocratique du Congo
                  </p>
                  <p className="font-body text-sm text-foreground-muted">
                    Disponible pour des projets en Afrique et à l'international
                  </p>
                </div>

                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
                    Email
                  </p>
                  <Link
                    href="mailto:contact@forwarddesign.com"
                    className="mt-2 inline-block font-body text-foreground transition-colors hover:text-accent-gold"
                    data-cursor-hover
                  >
                    contact@forwarddesign.com
                  </Link>
                </div>

                {whatsappLink && (
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
                      WhatsApp
                    </p>
                    <Link
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="mt-2 inline-flex items-center gap-2 font-body text-foreground transition-colors hover:text-accent-gold"
                      data-cursor-hover
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 32 32"
                        fill="none"
                        className="text-[#25D366]"
                      >
                        <path
                          d="M27.157 4.847a9.386 9.386 0 00-9.375-9.375 9.386 9.386 0 00-6.875 2.708l-0.417 0.5-2.167 0.708 0.75-2.25 0.542-0.458A9.385 9.385 0 003.22 4.847a9.387 9.387 0 002.708 14.167l0.417 0.333 1.25 0.375 0.375-1.375 0.208-0.75a9.375 9.375 0 009.334-9.375 9.385 9.385 0 00-0.625-3.417zm-4.208 11.625a7.812 7.812 0 01-7.792-7.792 7.812 7.812 0 017.792-7.792 7.812 7.812 0 017.792 7.792 7.813 7.813 0 01-7.792 7.792zm4.167-6.208c-0.35-0.058-0.717-0.092-1.083-0.092-2.333 0-4.308 1.375-5.208 3.625-0.467 1.167-1.458 3.542-1.583 3.875-0.117 0.317-0.467 0.65-1.017 0.483-0.55-0.167-1.625-0.767-2.458-1.317-0.667-0.442-1.192-0.933-1.325-1.083-0.133-0.15-0.108-0.367 0.075-0.517l1.183-0.992c0.308-0.258 0.517-0.433 0.658-0.708 0.125-0.242 0.083-0.483-0.042-0.7-0.175-0.308-0.975-2.167-0.975-2.167s-0.65-1.3-0.758-1.525c-0.133-0.275-0.35-0.467-0.692-0.467h-0.575c-0.342 0-0.808 0.1-1.267 0.542-0.458 0.442-1.442 1.392-1.442 3.392s1.483 3.95 1.692 4.225c0.208 0.275 2.917 4.65 7.058 6.65 4.142 2 4.142 1.333 4.892 1.25 0.75-0.083 2.45-1.008 2.792-1.992 0.342-0.983 0.342-1.825 0.233-1.992-0.108-0.167-0.392-0.267-0.817-0.467z"
                          fill="currentColor"
                        />
                      </svg>
                      Message rapide
                    </Link>
                  </div>
                )}

                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
                    Réseaux Sociaux
                  </p>
                  <div className="mt-3 flex gap-4">
                    <Link
                      href="https://instagram.com/forwarddesign"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-foreground-muted transition-colors hover:text-accent-gold"
                      aria-label="Suivre Forward Design sur Instagram"
                      data-cursor-hover
                    >
                      Instagram
                    </Link>
                    <span className="text-foreground-muted">•</span>
                    <Link
                      href="https://linkedin.com/in/forwarddesign"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-foreground-muted transition-colors hover:text-accent-gold"
                      aria-label="Connecter avec Forward Design sur LinkedIn"
                      data-cursor-hover
                    >
                      LinkedIn
                    </Link>
                  </div>
                </div>

                {/* WhatsApp QR Code - displayed on larger screens as alternative */}
                {WHATSAPP_PHONE && (
                  <div className="mt-8 hidden lg:block">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
                      Ou scanner
                    </p>
                    <div className="mt-4 flex justify-center">
                      <WhatsAppQR size={140} />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div
              className="mt-8 text-center"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out 0.5s",
              }}
            >
              <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent-gold">
                Créer. Éclairer. Inspirer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
