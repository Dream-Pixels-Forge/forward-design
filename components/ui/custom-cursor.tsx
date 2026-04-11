"use client";

import { useState, useEffect, useCallback } from "react";

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  // Check device support - do this inside useEffect to avoid early return issue
  useEffect(() => {
    // Hide cursor on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsSupported(false);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[data-cursor-hover]")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("mouseenter", onMouseEnter);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, []);

  // Return null AFTER all hooks - this is valid because isSupported state is set inside useEffect
  if (!isSupported) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9999]"
      style={{
        transform: `translate(${position.x - (isHovering ? 10 : 5)}px, ${position.y - (isHovering ? 10 : 5)}px)`,
        transition: "transform 0.1s ease-out",
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div
        className={`
          rounded-full border transition-all duration-200
          ${isHovering
            ? "h-10 w-10 border-[#d4a843]/50 bg-[#d4a843]/10"
            : "h-2 w-2 border-[#f5f0eb] bg-[#f5f0eb]/50"
          }
        `}
      />
    </div>
  );
}
