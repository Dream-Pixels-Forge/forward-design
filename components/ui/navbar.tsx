"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#work", label: "Œuvres" },
  { href: "#about", label: "À Propos" },
  { href: "#impact", label: "Impact" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        }`}
        style={{
          animation: "slideDown 0.8s ease-out forwards",
        }}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
          <Link
            href="/"
            className="group flex items-center gap-3"
            aria-label="Retour à l'accueil"
          >
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold tracking-tight text-[#f5f0eb] transition-colors group-hover:text-accent-gold">
                Forward Design
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#a0a0a0]">
                Rodrigue Ilunga
              </span>
            </div>
          </Link>

          <ul className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="font-body text-sm uppercase tracking-wider text-[#a0a0a0] transition-colors hover:text-accent-gold"
                  data-cursor-hover
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex flex-col gap-1.5 md:hidden"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            data-cursor-hover
          >
            <span
              className={`h-px w-6 bg-foreground transition-all duration-300 ${
                mobileMenuOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-foreground transition-all duration-300 ${
                mobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-foreground transition-all duration-300 ${
                mobileMenuOpen ? "-translate-y-[4px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-background/95 backdrop-blur-lg md:hidden"
          style={{ animation: "fadeIn 0.3s ease-out forwards" }}
        >
          <ul className="flex flex-col items-center gap-8">
            {navLinks.map((link, index) => (
              <li
                key={link.href}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${index * 0.1}s forwards`,
                  opacity: 0,
                }}
              >
                <button
                  onClick={() => handleNavClick(link.href)}
                  className="font-display text-3xl font-medium text-foreground transition-colors hover:text-accent-gold"
                  data-cursor-hover
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
