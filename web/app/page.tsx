import SiteShell from "@/components/layout/SiteShell";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import ValueProp from "@/components/sections/ValueProp";
import ProductShowcase from "@/components/sections/ProductShowcase";
import Process from "@/components/sections/Process";
import Testimonial from "@/components/sections/Testimonial";
import FAQ from "@/components/sections/FAQ";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <SiteShell>
      <Hero />
      <SocialProof />
      <ValueProp />
      <ProductShowcase />
      <Process />
      <Testimonial />
      <FAQ />
      <FinalCTA />
    </SiteShell>
  );
}