import type { MetadataRoute } from "next";
import { site } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: site.url, lastModified: new Date("2026-10-19"), changeFrequency: "monthly", priority: 1 }];
}
