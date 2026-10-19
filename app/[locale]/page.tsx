import { Comparison } from "@/components/comparison";
import { Compatibility } from "@/components/compatibility";
import { Download } from "@/components/download";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Support } from "@/components/support";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <Hero />
      <main id="main" tabIndex={-1} className="outline-none">
        <HowItWorks />
        <Compatibility />
        <Comparison />
        <Support />
        <Faq />
        <Download />
      </main>
      <SiteFooter />
    </>
  );
}
