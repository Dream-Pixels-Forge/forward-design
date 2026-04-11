"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";

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
