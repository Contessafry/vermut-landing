import { getDictionaryFor } from "@/lib/i18n";
import { localeInfo, localePath, type Locale } from "@/lib/i18n/config";
import type { Rich } from "@/lib/i18n/types";
import { getRelease } from "@/lib/release";
import { donate, site } from "@/site.config";

export const plain = (r: Rich) => r.map((p) => (typeof p === "string" ? p : p.text)).join("");

/** One @graph per locale: Organization, WebSite, SoftwareApplication, FAQPage. */
export async function jsonLdGraph(locale: Locale) {
  const [r, t] = await Promise.all([getRelease(), getDictionaryFor(locale)]);
  const inLanguage = localeInfo[locale].hreflang;
  const pageUrl = `${site.url}${localePath(locale) === "/" ? "" : localePath(locale)}`;
  const org = `${site.url}/#organization`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": org,
        name: "Vermut",
        url: site.url,
        logo: `${site.url}/icon-512.png`,
        sameAs: [site.githubUrl],
        ...(donate.paypal ? { potentialAction: { "@type": "DonateAction", target: donate.paypal, name: "Donate with PayPal" } } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: `${site.url}/`,
        name: "Vermut",
        alternateName: "Vermut for Mac",
        inLanguage: Object.values(localeInfo).map((i) => i.hreflang),
        publisher: { "@id": org },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${pageUrl}/#app`,
        name: "Vermut",
        description: t.seo.description,
        inLanguage,
        applicationCategory: "GameApplication",
        operatingSystem: `macOS ${site.minMacOS} or later`,
        processorRequirements: "Apple Silicon (arm64)",
        softwareVersion: r.version,
        fileSize: r.sizeLabel,
        license: "https://opensource.org/license/mit",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        downloadUrl: r.dmgUrl,
        releaseNotes: r.notesUrl,
        installUrl: `${pageUrl}/#download`,
        codeRepository: site.githubUrl,
        url: pageUrl,
        image: `${site.url}/opengraph-image.png`,
        screenshot: [1, 2, 3].map((n) => `${site.url}/videos/step-${n}-poster.webp`),
        publisher: { "@id": org },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}/#faq`,
        inLanguage,
        mainEntity: t.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
        })),
      },
    ],
  };
}
