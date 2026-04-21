"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - Catches React rendering errors gracefully
 * Part of PRIDES security remediation
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error for debugging
    console.error("[ErrorBoundary] Caught an error:", error, errorInfo);

    // Optional custom error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI matching project design system
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--background)",
            color: "var(--foreground)",
            padding: "2rem",
          }}
        >
          <div
            style={{
              maxWidth: "480px",
              textAlign: "center",
              padding: "3rem",
              background: "var(--background-light)",
              borderRadius: "12px",
              border: "1px solid var(--background-lighter)",
            }}
          >
            {/* Error Icon */}
            <div
              style={{
                width: "64px",
                height: "64px",
                margin: "0 auto 1.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--background-lighter)",
                borderRadius: "50%",
              }}
            >
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent-gold)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            {/* Error Message */}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: "var(--foreground)",
              }}
            >
              Quelque chose s&apos;est mal passé
            </h1>

            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "1rem",
                color: "var(--foreground-muted)",
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              Nous rencontrons des difficultés à charger cette section.
              Veuillez réessayer.
            </p>

            {/* Try Again Button */}
            <button
              onClick={this.handleReset}
              style={{
                padding: "0.875rem 2rem",
                fontSize: "0.9375rem",
                fontFamily: "var(--font-body)",
                fontWeight: 500,
                color: "var(--background)",
                background: "var(--accent-gold)",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                transition: "all 0.25s var(--ease-luxury)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-warm)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--accent-gold)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
             Réessayer
            </button>

            {/* Error Details (Development) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details
                style={{
                  marginTop: "2rem",
                  padding: "1rem",
                  background: "var(--background)",
                  borderRadius: "8px",
                  textAlign: "left",
                  fontSize: "0.8125rem",
                  fontFamily: "var(--font-mono)",
                  color: "var(--foreground-muted)",
                  overflow: "auto",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    marginBottom: "0.5rem",
                    color: "var(--accent-gold)",
                  }}
                >
                  Détails de l&apos;erreur
                </summary>
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;