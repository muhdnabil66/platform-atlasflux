import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/landing/hero";
import { Capabilities } from "@/components/landing/capabilities";
import { ModelSection } from "@/components/landing/model-section";
import { PricingSection } from "@/components/landing/pricing-section";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <ModelSection />
      <PricingSection />
      <section className="border-b">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-balance">
              Start building with AtlasFlux today
            </h2>
            <p className="mt-3 text-muted-foreground">
              Create an account, generate your first API key and make a request
              in under five minutes. Your balance is prepaid and always visible.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/sign-in">
                  Get API key
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="https://api-docs.atlasflux.my">Read the docs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
