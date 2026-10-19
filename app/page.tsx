import { Comparison } from "@/components/comparison";
import { Compatibility } from "@/components/compatibility";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main" tabIndex={-1} className="outline-none">
        <HowItWorks />
        <Compatibility />
        <Comparison />
        <Faq />
      </main>
      <SiteFooter />
    </>
  );
}
