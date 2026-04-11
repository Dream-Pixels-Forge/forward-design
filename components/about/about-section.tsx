"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

export function AboutSection() {
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
      { threshold: 0.1, rootMargin: "-15%" }
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

  const values = [
    {
      title: "Image comme Message",
      description:
        "La photographie est un véhicule, pas une destination. Chaque image porte un sens qui dépasse l'esthétique.",
    },
    {
      title: "Impact Social",
      description:
        "L'art doit servir la communauté, pas seulement la galerie. Des campagnes de sensibilisation aux documentaires sociaux.",
    },
    {
      title: "Authenticité",
      description:
        "Des visuels forts, authentiques et porteurs de message. Pas de production sterile, que du vrai.",
    },
    {
      title: "Lumière comme Matière",
      description:
        "Chaque cliché est une mise en scène de lumière, d'émotion et de sens. La lumière de Kinshasa sculptée.",
    },
  ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen px-6 py-24 md:px-12 md:py-32"
      aria-label="À propos de Rodrigue Ilunga"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="mb-16 md:mb-24"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(40px)",
            // Enhanced easing per movematics skill - smooth luxury
            transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-gold">
            À Propos
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-6xl lg:text-7xl">
            L'Homme <span className="text-gradient">Derrière</span> l'Objectif
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-5 md:gap-16">
          <div
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(-40px)",
              transition: "all 0.8s ease-out 0.2s",
            }}
            className="md:col-span-2"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden">
              <Image
                src="/hero_sequences/frame-010.webp"
                alt="Portrait de Rodrigue Ilunga, photographe et designer graphique à Kinshasa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <div className="h-8 w-px bg-accent-gold" />
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
                  Kinshasa, RDC
                </p>
                <p className="font-body text-sm text-foreground-muted">
                  République Démocratique du Congo
                </p>
              </div>
            </div>
          </div>

          <div
            className="md:col-span-3 md:pt-8"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? "translateX(0)" : "translateX(40px)",
              transition: "all 0.8s ease-out 0.4s",
            }}
          >
            <div className="space-y-6 font-body text-lg leading-relaxed text-foreground-muted md:text-xl">
              <p className="font-display text-2xl font-semibold text-foreground md:text-3xl">
                Rodrigue Ilunga — <span className="text-accent-gold">Forward Design</span> — est un communicateur visuel et artiste basé à Kinshasa, en République Démocratique du Congo.
              </p>

              <p>
                Il ne se contente pas de rendre les choses « jolies ». Il utilise l'image comme un outil de{" "}
                <span className="text-foreground">narration, d'expression d'idées et de provocation</span>. 
                Chaque cliché est une mise en scène de lumière, d'émotion et de sens.
              </p>

              <p>
                Son travail se situe à l'intersection de l'art et de l'engagement social — des campagnes 
                de planification familiale sur les bases militaires à la sensibilisation COVID-19, chaque 
                projet porte un message qui dépasse l'esthétique.
              </p>

              <p className="font-display text-xl font-medium text-foreground md:text-2xl">
                Créer. Éclairer. Inspirer.
              </p>
            </div>

            <div
              className="mt-12 border-l-2 border-accent-gold pl-6"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.8s ease-out 0.8s",
              }}
            >
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-accent-gold">
                Disciplines
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {[
                  "Photographie",
                  "Design Graphique",
                  "Direction Artistique",
                  "Storytelling Visuel",
                  "Impact Social",
                ].map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-foreground-muted/30 px-4 py-2 font-body text-sm text-foreground-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-24 md:mt-32"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(60px)",
            transition: "all 0.8s ease-out 1s",
          }}
        >
          <h3 className="mb-12 font-display text-2xl font-semibold md:text-3xl">
            Philosophie <span className="text-gradient">Créative</span>
          </h3>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={value.title}
                className="group"
                style={{
                  opacity: isInView ? 1 : 0,
                  transform: isInView ? "translateY(0)" : "translateY(30px)",
                  transition: `all 0.6s ease-out ${1.2 + index * 0.1}s`,
                }}
              >
                <div className="mb-4 h-px w-12 bg-accent-gold transition-all duration-300 group-hover:w-20" />
                <h4 className="font-display text-xl font-medium text-foreground">
                  {value.title}
                </h4>
                <p className="mt-3 font-body text-sm leading-relaxed text-foreground-muted">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
