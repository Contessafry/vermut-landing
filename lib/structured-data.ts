import { content, seo, type Rich } from "@/lib/content";
import { getRelease } from "@/lib/release";
import { site } from "@/site.config";

export const plain = (r: Rich) => r.map((p) => (typeof p === "string" ? p : p.text)).join("");

/** One @graph: Organization, WebSite, SoftwareApplication, FAQPage. */
export async function jsonLdGraph() {
  const r = await getRelease();
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
      },
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: "Vermut",
        description: seo.description,
        inLanguage: "en",
        publisher: { "@id": org },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${site.url}/#app`,
        name: "Vermut",
        description: seo.description,
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
        installUrl: `${site.url}/#download`,
        codeRepository: site.githubUrl,
        url: site.url,
        image: `${site.url}/opengraph-image.png`,
        screenshot: [
          `${site.url}/videos/step-1-poster.webp`,
          `${site.url}/videos/step-2-poster.webp`,
          `${site.url}/videos/step-3-poster.webp`,
        ],
        publisher: { "@id": org },
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/#faq`,
        mainEntity: content.faq.items.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: plain(f.a) },
        })),
      },
    ],
  };
}
