import Hero from "@/components/hero/Hero";
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

export default function Home() {
  return (
    <>
      <Hero />
      <ScrollVideoStory />
      <WhyServiceMatters />
      <ServiceIncluded />
      <BeforeAfter />
      <ServiceProcess />
      <Pricing />
      <Reviews />
      <WhyChoose />
      <FAQ />
      <FinalCTA />
    </>
  );
}
