"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { projects, categories, Project } from "@/lib/projects";

/* Enhanced PortfolioItem with micro-interactions per movematics skill */
function PortfolioItem({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // Bento-style layout: varies by index for visual interest
  const isLarge = index % 5 === 0;
  const isTall = index % 7 === 0;
  const isOffset = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden ${
        // Bento grid variations per grid-layout-master skill
        isLarge 
          ? "md:col-span-2 md:row-span-2" 
          : isTall 
            ? "md:row-span-2" 
            : ""
      } ${
        isOffset && !isLarge && !isTall 
          ? "md:translate-y-8" 
          : ""
      }`}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView 
          ? "translateY(0) scale(1)" 
          : "translateY(60px) scale(0.98)",
        // Enhanced easing per movematics skill - smooth luxury
        transition: `all 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.08}s`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`Projet: ${project.title}`}
    >
      <div 
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: isLarge ? '16/10' : isTall ? '3/5' : '4/5',
        }}
      >
        <Image
          src={project.image}
          alt={`Projet ${project.title} - ${project.categoryLabel}`}
          fill
          // Enhanced hover: subtle scale + brightness per movematics skill
          className="object-cover transition-all duration-500 group-hover:scale-105"
          style={{
            filter: isHovered ? 'brightness(1.1)' : 'brightness(1)',
          }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />

        {/* Enhanced gradient overlay */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent"
          style={{ 
            opacity: isHovered ? 1 : 0,
            transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {/* Enhanced content reveal with smooth transform */}
        <div
          className="absolute bottom-0 left-0 right-0 p-6"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(24px)",
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-accent-gold">
            {project.categoryLabel}
          </span>
          <h3 className="mt-2 font-display text-2xl font-semibold text-foreground md:text-3xl">
            {project.title}
          </h3>
          <p className="mt-2 font-body text-sm text-foreground-muted line-clamp-2">
            {project.description}
          </p>
          {project.impact && (
            <div className="mt-3 flex items-center gap-2">
              <div className="h-px w-8 bg-accent-gold" />
              <span className="font-body text-xs text-accent-warm">
                {project.impact}
              </span>
            </div>
          )}
        </div>
        
        {/* Magnetic corner accent per movematics */}
        <div 
          className="absolute top-4 right-4 w-3 h-3 border border-accent-gold/0 transition-all duration-300 group-hover:border-accent-gold/100"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? 'scale(1)' : 'scale(0.5)',
          }}
        />
      </div>
    </div>
  );
}

export function PortfolioGrid() {
  const [activeCategory, setActiveCategory] = useState("all");
  const sectionRef = useRef<HTMLDivElement>(null);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative min-h-screen px-6 py-24 md:px-12 md:py-32"
      aria-label="Portfolio des œuvres"
    >
      <div className="mx-auto max-w-7xl">
        {/* Enhanced header with fadeInSmooth per movematics */}
        <div
          className="mb-16"
          style={{
            animation: "fadeInUpSmooth 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-gold">
            Portfolio
          </span>
          <h2 className="mt-4 font-display text-4xl font-bold md:text-6xl lg:text-7xl">
            Œuvres{" "}
            <span className="text-gradient">Sélectionnées</span>
          </h2>
        </div>

        {/* Enhanced category filter with micro-interaction */}
        <div className="mb-12 flex flex-wrap gap-4 md:gap-8">
          {categories.map((category, idx) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`relative font-body text-sm uppercase tracking-wider transition-all duration-300 ${
                activeCategory === category.id
                  ? "text-accent-gold"
                  : "text-foreground-muted hover:text-foreground"
              }`}
              style={{
                // Stagger animation per movematics
                animationDelay: `${idx * 50}ms`,
              }}
              data-cursor-hover
              aria-pressed={activeCategory === category.id}
            >
              {category.label}
              {activeCategory === category.id && (
                <div 
                  className="absolute bottom-0 left-0 h-px w-full bg-accent-gold"
                  style={{
                    // Smooth width animation per movematics
                    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    animation: 'widthGrow 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                  }} 
                />
              )}
            </button>
          ))}
        </div>

        {/* Bento grid layout per grid-layout-master skill */}
        <div
          key={activeCategory}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          style={{
            animation: "fadeInSmooth 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
        >
          {filteredProjects.map((project, index) => (
            <PortfolioItem
              key={project.id}
              project={project}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
