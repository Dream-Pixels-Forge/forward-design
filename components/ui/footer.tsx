"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-foreground-muted/10 px-6 py-12 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <div>
            <Link href="/" className="group">
              <span className="font-display text-lg font-bold text-foreground transition-colors group-hover:text-accent-gold">
                Forward Design
              </span>
              <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground-muted">
                Rodrigue Ilunga
              </span>
            </Link>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-6" aria-label="Navigation pied de page">
            <Link
              href="#work"
              className="font-body text-sm text-foreground-muted transition-colors hover:text-accent-gold"
            >
              Œuvres
            </Link>
            <Link
              href="#about"
              className="font-body text-sm text-foreground-muted transition-colors hover:text-accent-gold"
            >
              À Propos
            </Link>
            <Link
              href="#impact"
              className="font-body text-sm text-foreground-muted transition-colors hover:text-accent-gold"
            >
              Impact
            </Link>
            <Link
              href="#contact"
              className="font-body text-sm text-foreground-muted transition-colors hover:text-accent-gold"
            >
              Contact
            </Link>
          </nav>

          {/* Copyright */}
          <div className="font-mono text-xs text-foreground-muted">
            © {currentYear} Forward Design. Tous droits réservés.
          </div>
        </div>

        {/* Mantra */}
        <div className="mt-8 border-t border-foreground-muted/10 pt-8 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.4em] text-accent-gold/60">
            Créer. Éclairer. Inspirer.
          </p>
        </div>
      </div>
    </footer>
  );
}
