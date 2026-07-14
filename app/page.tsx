import InteractiveHero from "@/components/hero/InteractiveHero";
import ScrollVideoStory from "@/components/sections/ScrollVideoStory";
import WhyServiceMatters from "@/components/sections/WhyServiceMatters";
import ServiceIncluded from "@/components/sections/ServiceIncluded";
import BeforeAfter from "@/components/sections/BeforeAfter";
import ServiceProcess from "@/components/sections/ServiceProcess";
import Pricing from "@/components/sections/Pricing";
import Reviews from "@/components/sections/Reviews";
import WhyChoose from "@/components/sections/WhyChoose";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";
import { LiquidGlassBackground } from "@/components/ui/liquid-glass";

export default function Home() {
  return (
    <>
      <InteractiveHero />
      <ScrollVideoStory />
      {/* Everything below the video shares one animated liquid-glass water
          background; the sections themselves are transparent so it shows
          through their frosted cards. `isolate` keeps the negative-z
          background layers scoped to this stack. */}
      <div className="relative isolate">
        <LiquidGlassBackground />
        <WhyServiceMatters />
        <ServiceIncluded />
        <BeforeAfter />
        <ServiceProcess />
        <Pricing />
        <Reviews />
        <WhyChoose />
        <FAQ />
        <FinalCTA />
      </div>
    </>
  );
}
