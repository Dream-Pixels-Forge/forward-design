"use client";

import { useState, useEffect } from "react";

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;
const DEFAULT_MESSAGE = "Bonjour! Je souhaite discuter d'un projet avec vous.";

// Breakpoint for hiding on desktop
const MOBILE_BREAKPOINT = 1024;

interface FloatingWhatsAppButtonProps {
  message?: string;
  className?: string;
  /** Force show on all devices (default: false - hidden on desktop) */
  forceShow?: boolean;
  /** Hide based on screen size (default: true) */
  hideOnDesktop?: boolean;
}

export function FloatingWhatsAppButton({
  message = DEFAULT_MESSAGE,
  className = "",
  forceShow = false,
  hideOnDesktop = true,
}: FloatingWhatsAppButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    setMounted(true);
    
    // Check if device is mobile or tablet
    const checkMobile = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      
      // Check for mobile indicators
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isSmallScreen = width < MOBILE_BREAKPOINT;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Consider mobile if: small screen OR mobile user agent OR touch device with small screen
      setIsMobile(isMobileDevice || (isSmallScreen && isTouchDevice));
    };
    
    // Initial check
    checkMobile();
    
    // Re-check on resize
    window.addEventListener('resize', checkMobile);
    
    // Delay visibility to allow for entrance animation
    const timer = setTimeout(() => setIsVisible(true), 500);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Determine if we should show the button
  const shouldShow = forceShow || (hideOnDesktop ? isMobile : true);
  
  // Don't render if no phone number configured
  if (!WHATSAPP_PHONE || !shouldShow) {
    return null;
  }

  const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`fixed bottom-6 right-6 z-50 group ${className}`}
      style={{
        opacity: mounted && isVisible ? 1 : 0,
        transform: mounted && isVisible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.8)",
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        animation: "pulse 3s ease-in-out infinite 1s",
      }}
      aria-label="Envoyer un message sur WhatsApp"
    >
      {/* Button */}
      <div
        className="relative flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
        style={{
          backgroundColor: "#25D366",
          boxShadow: "0 8px 25px rgba(37, 211, 102, 0.4)",
        }}
      >
        {/* WhatsApp Icon */}
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-transform duration-300 group-hover:scale-110"
        >
          <path
            d="M27.157 4.847a9.386 9.386 0 00-9.375-9.375 9.386 9.386 0 00-6.875 2.708l-0.417 0.5-2.167 0.708 0.75-2.25 0.542-0.458A9.385 9.385 0 003.22 4.847a9.387 9.387 0 002.708 14.167l0.417 0.333 1.25 0.375 0.375-1.375 0.208-0.75a9.375 9.375 0 009.334-9.375 9.385 9.385 0 00-0.625-3.417zm-4.208 11.625a7.812 7.812 0 01-7.792-7.792 7.812 7.812 0 017.792-7.792 7.812 7.812 0 017.792 7.792 7.813 7.813 0 01-7.792 7.792zm4.167-6.208c-0.35-0.058-0.717-0.092-1.083-0.092-2.333 0-4.308 1.375-5.208 3.625-0.467 1.167-1.458 3.542-1.583 3.875-0.117 0.317-0.467 0.65-1.017 0.483-0.55-0.167-1.625-0.767-2.458-1.317-0.667-0.442-1.192-0.933-1.325-1.083-0.133-0.15-0.108-0.367 0.075-0.517l1.183-0.992c0.308-0.258 0.517-0.433 0.658-0.708 0.125-0.242 0.083-0.483-0.042-0.7-0.175-0.308-0.975-2.167-0.975-2.167s-0.65-1.3-0.758-1.525c-0.133-0.275-0.35-0.467-0.692-0.467h-0.575c-0.342 0-0.808 0.1-1.267 0.542-0.458 0.442-1.442 1.392-1.442 3.392s1.483 3.95 1.692 4.225c0.208 0.275 2.917 4.65 7.058 6.65 4.142 2 4.142 1.333 4.892 1.25 0.75-0.083 2.45-1.008 2.792-1.992 0.342-0.983 0.342-1.825 0.233-1.992-0.108-0.167-0.392-0.267-0.817-0.467z"
            fill="white"
          />
        </svg>

        {/* Ripple Effect */}
        <span
          className="absolute h-full w-full rounded-full opacity-0"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            animation: "ripple 2s ease-out infinite",
          }}
        />
      </div>

      {/* Tooltip */}
      <span
        className="absolute bottom-full right-0 mb-3 translate-x-[-50%] whitespace-nowrap rounded-md bg-foreground px-3 py-2 font-body text-sm text-background opacity-0 shadow-lg transition-all duration-300 group-hover:opacity-100"
        style={{
          transform: "translateX(-50%) translateY(-8px)",
        }}
      >
        Discutons sur WhatsApp
        <span
          className="absolute bottom-0 left-1/2 h-2 w-2 -translate-x-1/2 translate-y-1 rotate-45"
          style={{ backgroundColor: "inherit" }}
        />
      </span>
    </a>
  );
}