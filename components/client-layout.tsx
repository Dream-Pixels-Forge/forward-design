"use client";

import { SmoothScrollProvider } from "@/components/ui/smooth-scroll";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SmoothScrollProvider>
      <CustomCursor />
      <Navbar />
      {children}
      <Footer />
    </SmoothScrollProvider>
  );
}
