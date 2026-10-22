import type { MetadataRoute } from "next";
import { languageAlternates, localePath, locales } from "@/lib/i18n/config";
import { guideAlternates, guideHref, guideSlugs, guidesUpdated } from "@/lib/guides";
import { contentUpdated, site } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(contentUpdated);
  const languages = languageAlternates(site.url);
  return [
    ...locales.map((l) => ({
      url: `${site.url}${localePath(l)}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: l === "en" ? 1 : 0.8,
      alternates: { languages },
    })),
    // Guides: every locale, each with the full hreflang set (7 locales + x-default).
    ...["guides", ...guideSlugs].flatMap((slug) => {
      const alt = guideAlternates(slug, site.url);
      return locales.map((l) => ({
        url: `${site.url}${guideHref(l, slug)}`,
        lastModified: new Date(guidesUpdated),
        changeFrequency: "monthly" as const,
        priority: (slug === "guides" ? 0.6 : 0.7) - (l === "en" ? 0 : 0.1),
        alternates: { languages: alt },
      }));
    }),
    { url: `${site.url}/llms.txt`, lastModified, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/llms-full.txt`, lastModified, changeFrequency: "monthly", priority: 0.3 },
  ];
}
