"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Frames: 33 down to 01 (reversed) - actual files in public/hero_sequences
const FRAME_COUNT = 33;
const FRAME_PATH = (index: number) =>
  `/hero_sequences/frame-${String(index).padStart(3, "0")}.webp`;

export function CinematicHero() {
  const [currentFrame, setCurrentFrame] = useState(FRAME_COUNT);
  const [showText, setShowText] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  // Check if mobile - skip cinematic animation on mobile
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      setIsMobile(true);
      setShowText(true);
    }
  }, []);

  useEffect(() => {
    if (!imageRef.current || !containerRef.current || isMobile) return;

    // Preload frames in reverse order
    const framesToLoad = Array.from({ length: FRAME_COUNT }, (_, i) => FRAME_COUNT - i);
    framesToLoad.forEach((frame) => {
      const img = new window.Image();
      img.src = FRAME_PATH(frame);
    });

    // GSAP ScrollTrigger for frame progression (reversed: 33 -> 01)
    const ctx = gsap.context(() => {
      // First, reveal text after camera enters
      gsap.delayedCall(1.8, () => setShowText(true));

      // Use a proxy object to track frame
      const frameObj = { frame: FRAME_COUNT };
      
      // Then, on scroll, animate frames in reverse
      gsap.to(frameObj, {
        frame: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${FRAME_COUNT * 100}`,
          pin: true,
          scrub: 1,
          onUpdate: function () {
            setCurrentFrame(Math.round(frameObj.frame));
          },
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  // Fallback: Show text immediately on mobile
  useEffect(() => {
    if (isMobile) {
      setShowText(true);
    }
  }, [isMobile]);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      aria-label="Introduction cinématique"
    >
      {/* Hero background - initially empty until camera enters */}
      <div ref={imageRef} className="relative h-full w-full">
        <Image
          src={isMobile ? FRAME_PATH(1) : FRAME_PATH(currentFrame)}
          alt="Séquence cinématique - Photographe Forward Design au travail"
          fill
          priority
          className="object-cover"
          quality={90}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      </div>

      {/* Text content - shows after camera entrance */}
      <div
        className={`relative z-10 flex h-full flex-col items-center justify-center px-6 text-center transition-opacity duration-700 md:px-12 ${
          showText ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className="mb-6"
          style={{
            animation: showText ? "fadeInUpSmooth 1s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "none",
            opacity: showText ? 0 : 0,
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.5em] text-accent-gold md:text-sm">
            Rodrigue Ilunga
          </span>
        </div>

        <h1
          className="font-display text-5xl font-bold leading-tight text-foreground md:text-8xl lg:text-9xl"
          style={{
            animation: showText ? "fadeInUpSmooth 1s cubic-bezier(0.4, 0, 0.2, 1) 0.2s forwards" : "none",
            opacity: showText ? 0 : 0,
          }}
        >
          <span className="block">Forward</span>
          <span className="block text-gradient">Design</span>
        </h1>

        <p
          className="mt-6 font-body text-lg text-foreground-muted md:text-xl md:tracking-wide"
          style={{
            animation: showText ? "fadeInUpSmooth 1s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards" : "none",
            opacity: showText ? 0 : 0,
          }}
        >
          Créer. Éclairer. Inspirer.
        </p>

        <div
          className="mt-12 hidden md:block"
          style={{
            animation: showText ? "fadeInSmooth 1s cubic-bezier(0.4, 0, 0.2, 1) 0.6s forwards" : "none",
            opacity: showText ? 0 : 0,
          }}
        >
          <span className="font-mono text-xs uppercase tracking-[0.3em] text-foreground-muted">
            Visual Stories from Kinshasa, DRC
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-700 ${
          showText ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transition: "opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1) 0.8s",
        }}
      >
        <div
          className="flex flex-col items-center gap-2"
          style={{
            animation: isMobile ? "none" : "smoothPulse 2s ease-in-out infinite",
          }}
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-foreground-muted">
            Défiler
          </span>
          <div className="relative h-8 w-px">
            <div className="absolute inset-0 bg-gradient-to-b from-accent-gold/30 to-transparent" />
            <div 
              className="h-full w-full bg-gradient-to-b from-accent-gold to-transparent"
              style={{
                animation: isMobile ? "none" : "glowPulse 2s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Frame counter - reversed (33 -> 01) - hide on mobile */}
      <div className="absolute bottom-8 right-8 z-10 hidden md:block">
        <span className="font-mono text-xs text-foreground/70">
          {String(currentFrame).padStart(2, "0")} / {String(FRAME_COUNT).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}