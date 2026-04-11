import { CinematicHero } from "@/components/hero/cinematic-hero";
import { ImageCarousel } from "@/components/carousel/carousel";
import { PortfolioGrid } from "@/components/portfolio/portfolio-grid";
import { AboutSection } from "@/components/about/about-section";
import { ImpactSection } from "@/components/impact/impact-section";
import { ContactSection } from "@/components/contact/contact-section";

export default function Home() {
  return (
    <>
      <CinematicHero />
      <ImageCarousel autoPlay={true} autoPlayInterval={5000} />
      <PortfolioGrid />
      <AboutSection />
      <ImpactSection />
      <ContactSection />
    </>
  );
}
