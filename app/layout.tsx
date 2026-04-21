import type { Metadata } from "next";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/ui/smooth-scroll";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";
import { FloatingWhatsAppButton } from "@/components/FloatingWhatsAppButton";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Forward Design — Rodrigue Ilunga | Visual Artist & Photographer",
  description:
    "Rodrigue Ilunga — Forward Design — est un communicateur visuel et artiste basé à Kinshasa. Visual stories from Kinshasa, DRC. Créer. Éclairer. Inspirer.",
  keywords: [
    "photographer",
    "Kinshasa",
    "DRC",
    "visual artist",
    "graphic designer",
    "Forward Design",
    "Rodrigue Ilunga",
    "portraitiste",
    "social impact",
  ],
  authors: [{ name: "Rodrigue Ilunga", url: "https://forwarddesign.com" }],
  openGraph: {
    title: "Forward Design — Rodrigue Ilunga",
    description:
      "Visual stories from Kinshasa. Créer. Éclairer. Inspirer.",
    type: "website",
    locale: "fr_CD",
    siteName: "Forward Design",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased bg-background text-foreground font-body">
        <ErrorBoundary>
          <SmoothScrollProvider>
            <CustomCursor />
            <Navbar />
            <main>{children}</main>
            <Footer />
            <FloatingWhatsAppButton />
          </SmoothScrollProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
