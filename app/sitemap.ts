import type { MetadataRoute } from "next";
import { contentUpdated, site } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(contentUpdated);
  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/llms.txt`, lastModified, changeFrequency: "monthly", priority: 0.3 },
    { url: `${site.url}/llms-full.txt`, lastModified, changeFrequency: "monthly", priority: 0.3 },
  ];
}
