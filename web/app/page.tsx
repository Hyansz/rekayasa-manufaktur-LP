import SiteShell from "@/components/layout/SiteShell";
import Hero from "@/components/sections/Hero";
import SocialProof from "@/components/sections/SocialProof";
import ValueProp from "@/components/sections/ValueProp";
import ProductShowcase from "@/components/sections/ProductShowcase";
import dynamic from "next/dynamic";

const Process = dynamic(() => import("@/components/sections/Process"));
const Testimonial = dynamic(() => import("@/components/sections/Testimonial"));
const FAQ = dynamic(() => import("@/components/sections/FAQ"));
const Location = dynamic(() => import("@/components/sections/Location"));
const FinalCTA = dynamic(() => import("@/components/sections/FinalCTA"));

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
      <Location />
      <FinalCTA />
    </SiteShell>
  );
}