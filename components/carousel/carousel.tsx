"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Image files from public/images folder
const IMAGES = [
  { src: "/images/DSC_0208-1.jpg", alt: "Kinshasa photography work 1" },
  { src: "/images/DSC_0210.jpg", alt: "Kinshasa photography work 2" },
  { src: "/images/DSC_0215-1.jpg", alt: "Kinshasa photography work 3" },
  { src: "/images/DSC_0228-1.jpg", alt: "Kinshasa photography work 4" },
  { src: "/images/DSC_0229.jpg", alt: "Kinshasa photography work 5" },
  { src: "/images/DSC_0234.jpg", alt: "Kinshasa photography work 6" },
  { src: "/images/DSC_0236.jpg", alt: "Kinshasa photography work 7" },
  { src: "/images/DSC_3054.jpg", alt: "Kinshasa photography work 8" },
  { src: "/images/DSC_3062.jpg", alt: "Kinshasa photography work 9" },
  { src: "/images/DSC_3067.jpg", alt: "Kinshasa photography work 10" },
  { src: "/images/DSC_3081.jpg", alt: "Kinshasa photography work 11" },
  { src: "/images/DSC_3588.jpg", alt: "Kinshasa photography work 12" },
  { src: "/images/DSC_3589.jpg", alt: "Kinshasa photography work 13" },
  { src: "/images/DSC_3596.jpg", alt: "Kinshasa photography work 14" },
  { src: "/images/DSC_4193-1.jpg", alt: "Kinshasa photography work 15" },
  { src: "/images/DSC_4195.jpg", alt: "Kinshasa photography work 16" },
  { src: "/images/DSC_4806-1.jpg", alt: "Kinshasa photography work 17" },
  { src: "/images/DSC_4807-1.jpg", alt: "Kinshasa photography work 18" },
  { src: "/images/DSC_6412-1.jpg", alt: "Kinshasa photography work 19" },
  { src: "/images/DSC_6416-1.jpg", alt: "Kinshasa photography work 20" },
  { src: "/images/DSC_6422.jpg", alt: "Kinshasa photography work 21" },
  { src: "/images/DSC_6423.jpg", alt: "Kinshasa photography work 22" },
  { src: "/images/DSC_6714.jpg", alt: "Kinshasa photography work 23" },
  { src: "/images/DSC_6754.jpg", alt: "Kinshasa photography work 24" },
  { src: "/images/DSC_6755.jpg", alt: "Kinshasa photography work 25" },
];

interface CarouselProps {
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function ImageCarousel({
  autoPlay = true,
  autoPlayInterval = 5000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
  }, [isTransitioning]);

  const goToNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % IMAGES.length;
    goToSlide(nextIndex);
  }, [currentIndex, goToSlide]);

  const goToPrev = useCallback(() => {
    const prevIndex = currentIndex === 0 ? IMAGES.length - 1 : currentIndex - 1;
    goToSlide(prevIndex);
  }, [currentIndex, goToSlide]);

  // Auto play
  useEffect(() => {
    if (!autoPlay) return;
    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, goToNext]);

  // Animation on slide change
  useEffect(() => {
    if (!slidesRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        slidesRef.current,
        { opacity: 0, x: 50 },
        { 
          opacity: 1, 
          x: 0, 
          duration: 0.6, 
          ease: "power2.out",
          onComplete: () => setIsTransitioning(false)
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [currentIndex]);

  // Initial load animation
  useEffect(() => {
    if (!containerRef.current || isLoaded) return;
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0 },
        { 
          opacity: 1, 
          duration: 0.8, 
          ease: "power2.out",
          onComplete: () => setIsLoaded(true)
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-background"
      aria-label="Gallery carousel"
    >
      <div className="relative h-[60vh] w-full md:h-[70vh]">
        {/* Main slide */}
        <div
          ref={slidesRef}
          className="absolute inset-0"
          style={{ opacity: 1 }}
        >
          <Image
            src={IMAGES[currentIndex].src}
            alt={IMAGES[currentIndex].alt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/40" />
        </div>

        {/* Navigation arrows */}
        <button
          onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/20 bg-background/50 text-foreground backdrop-blur-sm transition-all duration-300 hover:border-accent-gold hover:bg-background/80"
          aria-label="Previous image"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-foreground/20 bg-background/50 text-foreground backdrop-blur-sm transition-all duration-300 hover:border-accent-gold hover:bg-background/80"
          aria-label="Next image"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-3">
          {IMAGES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentIndex === index
                  ? "w-8 bg-accent-gold"
                  : "w-2 bg-foreground/30 hover:bg-foreground/50"
              }`}
              aria-label={`Go to image ${index + 1}`}
              aria-current={currentIndex === index ? "true" : "false"}
            />
          ))}
        </div>

        {/* Counter */}
        <div className="absolute bottom-8 right-8 z-10 font-mono text-sm text-foreground/70">
          {String(currentIndex + 1).padStart(2, "0")} / {String(IMAGES.length).padStart(2, "0")}
        </div>
      </div>
    </section>
  );
}