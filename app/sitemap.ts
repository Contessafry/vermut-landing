import type { MetadataRoute } from "next";
import { languageAlternates, localePath, locales } from "@/lib/i18n/config";
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
    { url: `${site.url}/llms.txt`, lastModified, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/llms-full.txt`, lastModified, changeFrequency: "monthly", priority: 0.3 },
  ];
}
