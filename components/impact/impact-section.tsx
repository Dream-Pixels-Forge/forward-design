"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { projects } from "@/lib/projects";

const impactProjects = projects.filter((p) => p.category === "impact");

export function ImpactSection() {
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
      { threshold: 0.1, rootMargin: "-20%" }
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
      id="impact"
      ref={sectionRef}
      className="relative min-h-screen px-6 py-24 md:px-12 md:py-32"
      aria-label="Projets à impact social"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className="mb-16 md:mb-24"
          style={{
            opacity: isInView ? 1 : 0,
            transform: isInView ? "translateY(0)" : "translateY(40px)",
            transition: "all 0.8s ease-out",
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-copper">
            Engagement
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-6xl lg:text-7xl">
            Impact <span className="text-gradient">Social</span>
          </h2>
          <p className="mt-6 max-w-2xl font-body text-lg text-foreground-muted">
            La photographie comme infrastructure sociale. Des projets qui servent 
            la communauté et portent des messages qui sauvent des vies.
          </p>
        </div>

        <div className="space-y-24 md:space-y-32">
          {impactProjects.map((project, index) => (
            <div
              key={project.id}
              className={`grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 ${
                index % 2 === 1 ? "md:[&>div:first-child]:order-2" : ""
              }`}
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? "translateY(0)" : "translateY(60px)",
                transition: `all 0.8s ease-out ${index * 0.2}s`,
              }}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-[16/10]">
                <Image
                  src={project.image}
                  alt={`Projet ${project.title} - ${project.description}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
              </div>

              <div className="flex flex-col justify-center">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-copper">
                    {project.categoryLabel}
                  </span>
                  {project.year && (
                    <>
                      <span className="text-foreground-muted">•</span>
                      <span className="font-mono text-xs text-foreground-muted">
                        {project.year}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="font-display text-3xl font-semibold text-foreground md:text-4xl lg:text-5xl">
                  {project.title}
                </h3>

                <p className="mt-6 font-body text-lg leading-relaxed text-foreground-muted">
                  {project.description}
                </p>

                {project.impact && (
                  <div
                    className="mt-8 flex items-center gap-4"
                    style={{
                      opacity: isInView ? 1 : 0,
                      transform: isInView ? "translateX(0)" : "translateX(-20px)",
                      transition: `all 0.6s ease-out ${0.6 + index * 0.2}s`,
                    }}
                  >
                    <div className="h-px w-12 bg-accent-gold" />
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-gold">
                        Impact
                      </p>
                      <p className="mt-1 font-body text-sm font-medium text-foreground">
                        {project.impact}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
