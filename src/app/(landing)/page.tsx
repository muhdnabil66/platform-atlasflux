import { Hero3DStage } from "@/components/landing/hero-3d-stage";
import { LogoCloud } from "@/components/landing/logo-cloud";
import { FeatureCardsSection } from "@/components/landing/feature-cards-section";
import { AISection } from "@/components/landing/ai-section";
import { ProductDirectionSection } from "@/components/landing/product-direction-section";
import { WorkflowsSection } from "@/components/landing/workflows-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <Hero3DStage />
      <LogoCloud />
      <FeatureCardsSection />
      <AISection />
      <ProductDirectionSection />
      <WorkflowsSection />
      <PricingSection />
      <CTASection />
    </>
  );
}