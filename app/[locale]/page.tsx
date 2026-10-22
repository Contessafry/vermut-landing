import { Comparison } from "@/components/comparison";
import { Compatibility } from "@/components/compatibility";
import { Download } from "@/components/download";
import { Faq } from "@/components/faq";
import { Hero } from "@/components/hero";
import { HowItWorks } from "@/components/how-it-works";
import { Support } from "@/components/support";
import { SiteFooter } from "@/components/site-footer";
import { getLocale } from "@/lib/i18n";
import { jsonLdGraph } from "@/lib/structured-data";

export default async function Home() {
  const locale = await getLocale();
  const jsonLd = JSON.stringify(await jsonLdGraph(locale)).replace(/</g, "\\u003c");
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
      {/* Home-only JSON-LD (guide pages ship their own graph). `<` escaped. */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
    </>
  );
}
