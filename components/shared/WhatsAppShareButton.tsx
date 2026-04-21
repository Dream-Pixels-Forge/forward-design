"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const WHATSAPP_PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE;

interface WhatsAppShareButtonProps {
  imageUrl: string;
  imageAlt?: string;
  projectName?: string;
  message?: string;
  className?: string;
}

export function WhatsAppShareButton({
  imageUrl,
  imageAlt = "Image à partager",
  projectName,
  message,
  className = "",
}: WhatsAppShareButtonProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const defaultMessage = projectName
    ? `Découvrez ce projet "${projectName}" : ${imageUrl}`
    : `Découvrez cette création : ${imageUrl}`;

  const shareMessage = message || defaultMessage;
  const whatsappUrl = WHATSAPP_PHONE
    ? `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(shareMessage)}`
    : null;

  // Hide if no phone number configured
  if (!whatsappUrl || !WHATSAPP_PHONE) {
    return null;
  }

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={`inline-flex items-center gap-2 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Partager sur WhatsApp"
    >
      {/* Thumbnail Preview */}
      <div
        className="relative overflow-hidden rounded-lg border border-foreground-muted/20"
        style={{
          width: 48,
          height: 48,
          transition: "all 0.3s ease",
          transform: isHovered ? "scale(1.05)" : "scale(1)",
        }}
      >
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="48px"
          className="object-cover"
        />
        {/* Overlay on hover */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
          }}
        >
          <svg
            width="20"
            height="20"
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
      </div>

      {/* Text */}
      <span
        className="font-body text-sm font-medium text-foreground transition-colors duration-300 group-hover:text-[#25D366]"
        style={{
          transition: "all 0.3s ease",
        }}
      >
        {isHovered ? "Partager sur WhatsApp" : "Partager"}
      </span>

      {/* Share Icon */}
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        className="text-foreground-muted transition-all duration-300 group-hover:text-[#25D366]"
        style={{
          transform: isHovered ? "translateX(2px) translateY(-2px)" : "translateX(0) translateY(0)",
          transition: "all 0.3s ease",
        }}
      >
        <path
          d="M18 8C19.1046 8 20 7.10457 20 6C20 4.89543 19.1046 4 18 4C16.8954 4 16 4.89543 16 6C16 7.10457 16.8954 8 18 8ZM12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8ZM6 8C7.10457 8 8 7.10457 8 6C8 4.89543 7.10457 4 6 4C4.89543 4 4 4.89543 4 6C4 7.10457 4.89543 8 6 8ZM18 14C19.1046 14 20 13.1046 20 12C20 10.8954 19.1046 10 18 10C16.8954 10 16 10.8954 16 12C16 13.1046 16.8954 14 18 14ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14ZM6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12C4 13.1046 4.89543 14 6 14ZM18 20C19.1046 20 20 19.1046 20 18C20 16.8954 19.1046 16 18 16C16.8954 16 16 16.8954 16 18C16 19.1046 16.8954 20 18 20ZM12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20ZM6 20C7.10457 20 8 19.1046 8 18C8 16.8954 7.10457 16 6 16C4.89543 16 4 16.8954 4 18C4 19.1046 4.89543 20 6 20Z"
          stroke="currentColor"
          strokeWidth="2"
        />
      </svg>
    </a>
  );
}