"use client";

import { useState, useEffect } from "react";

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

interface WhatsAppQRProps {
  size?: number;
  message?: string;
  className?: string;
}

export function WhatsAppQR({
  size = 180,
  message = "Bonjour! Je souhaite discuter d'un projet avec vous.",
  className = "",
}: WhatsAppQRProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Build the WhatsApp share URL
  const shareUrl = WHATSAPP_PHONE
    ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
    : null;

  // Generate QR code URL using a public API (fallback approach)
  useEffect(() => {
    if (shareUrl) {
      // Use Google's chart API as primary (deprecated but still works)
      // Fallback to qrserver.com API
      const encodedUrl = encodeURIComponent(shareUrl);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodedUrl}`;
      setQrCodeUrl(qrUrl);
    }
  }, [shareUrl, size]);

  // Hide if no phone number configured
  if (!shareUrl || !WHATSAPP_PHONE) {
    return null;
  }

  return (
    <div
      className={`flex flex-col items-center gap-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* QR Code Container */}
      <div
        className="relative overflow-hidden rounded-xl border-2 p-3 transition-all duration-300"
        style={{
          borderColor: isHovered ? "#25D366" : "rgba(255,255,255,0.15)",
          backgroundColor: "rgba(255,255,255,0.03)",
          transition: "all 0.3s ease",
          width: size + 24,
          height: size + 24,
        }}
      >
        {qrCodeUrl && (
          <img
            src={qrCodeUrl}
            alt="QR Code WhatsApp"
            width={size}
            height={size}
            className="rounded-lg"
            style={{
              transition: "transform 0.3s ease",
              transform: isHovered ? "scale(1.02)" : "scale(1)",
            }}
          />
        )}

        {/* Subtle glow effect on hover */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            boxShadow: "inset 0 0 30px rgba(37, 211, 102, 0.2)",
            background: "radial-gradient(circle, rgba(37, 211, 102, 0.1) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Label */}
      <div
        className="text-center"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <p
          className="font-body text-sm transition-colors duration-300"
          style={{
            color: isHovered ? "#25D366" : "rgba(255,255,255,0.7)",
          }}
        >
          Scannez pour ouvrir WhatsApp
        </p>
        <p
          className="mt-1 font-mono text-xs"
          style={{
            color: "rgba(255,255,255,0.4)",
          }}
        >
          conversation@forwarddesign
        </p>
      </div>

      {/* WhatsApp Icon Badge */}
      <div
        className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full"
        style={{
          backgroundColor: "#25D366",
          boxShadow: "0 2px 8px rgba(37, 211, 102, 0.4)",
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 32 32"
          fill="none"
          className="text-white"
        >
          <path
            d="M27.157 4.847a9.386 9.386 0 00-9.375-9.375 9.386 9.386 0 00-6.875 2.708l-0.417 0.5-2.167 0.708 0.75-2.25 0.542-0.458A9.385 9.385 0 003.22 4.847a9.387 9.387 0 002.708 14.167l0.417 0.333 1.25 0.375 0.375-1.375 0.208-0.75a9.375 9.375 0 009.334-9.375 9.385 9.385 0 00-0.625-3.417zm-4.208 11.625a7.812 7.812 0 01-7.792-7.792 7.812 7.812 0 017.792-7.792 7.812 7.812 0 017.792 7.792 7.813 7.813 0 01-7.792 7.792z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Decorative corner elements */}
      <div
        className="absolute left-3 top-3 h-3 w-3 rounded-tl-lg"
        style={{
          borderLeft: "2px solid #25D366",
          borderTop: "2px solid #25D366",
          opacity: isHovered ? 1 : 0.5,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        className="absolute right-3 top-3 h-3 w-3 rounded-tr-lg"
        style={{
          borderRight: "2px solid #25D366",
          borderTop: "2px solid #25D366",
          opacity: isHovered ? 1 : 0.5,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        className="absolute bottom-3 left-3 h-3 w-3 rounded-bl-lg"
        style={{
          borderLeft: "2px solid #25D366",
          borderBottom: "2px solid #25D366",
          opacity: isHovered ? 1 : 0.5,
          transition: "opacity 0.3s ease",
        }}
      />
      <div
        className="absolute bottom-3 right-3 h-3 w-3 rounded-br-lg"
        style={{
          borderRight: "2px solid #25D366",
          borderBottom: "2px solid #25D366",
          opacity: isHovered ? 1 : 0.5,
          transition: "opacity 0.3s ease",
        }}
      />
    </div>
  );
}