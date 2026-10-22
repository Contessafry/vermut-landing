/**
 * Guide pages, translated into all 7 locales (see docs/I18N.md › Guides). Every claim is
 * sourced in `sources` or comes from the Vermut source code (Contessafry/Vermut).
 * Facts checked 22 October 2026.
 */
import type { Rich } from "@/lib/i18n/types";
import { localeInfo, locales, type Locale } from "@/lib/i18n/config";
import { links } from "@/site.config";

export const guidesUpdated = "2026-10-22";

export type GuideSection = {
  id: string;
  title: string;
  body?: readonly Rich[];
  steps?: readonly { title: string; body: Rich }[];
  bullets?: readonly Rich[];
};

export type GuideCompare = {
  caption: string;
  columns: readonly string[];
  rows: readonly { label: string; cells: readonly string[] }[];
};

export type Guide = {
  slug: string;
  /** <title> (the layout template appends "· Vermut"). */
  metaTitle: string;
  description: string;
  /** Short label for the hub and cross-links. */
  label: string;
  h1: string;
  answer: Rich;
  sections: readonly GuideSection[];
  compare?: GuideCompare;
  /** Rendered after the comparison table. */
  after?: readonly GuideSection[];
  faq: readonly { q: string; a: Rich }[];
  sources: readonly { label: string; href: string }[];
};

export const S = {
  whiskyNotice: { label: "Whisky documentation: Maintenance notice", href: "https://docs.getwhisky.app/maintenance-notice" },
  whiskyRepo: { label: "Whisky-App/Whisky on GitHub (archived)", href: "https://github.com/Whisky-App/Whisky" },
  whiskyFork: { label: "frankea/Whisky, a community fork", href: "https://github.com/frankea/Whisky" },
  cxStore: { label: "CodeWeavers store (CrossOver prices)", href: "https://www.codeweavers.com/store" },
  cxLicence: { label: "CodeWeavers: Licensing questions", href: "https://www.codeweavers.com/store/licensing" },
  cx26: { label: "CodeWeavers: CrossOver 26 release, 10 February 2026", href: "https://www.codeweavers.com/blog/mjohnson/2026/02/10/crossover-26-cures-artificial-incompatibility-with-windows-games-on-mac" },
  gptk: { label: "Apple Developer: Game Porting Toolkit", href: "https://developer.apple.com/games/game-porting-toolkit/" },
  gptkReq: { label: "Gcenx/game-porting-toolkit releases (requirements)", href: "https://github.com/Gcenx/game-porting-toolkit/releases" },
  parallels: { label: "Parallels KB 122485: Play Windows games in Parallels Desktop", href: "https://kb.parallels.com/en/122485" },
  gfn: { label: "NVIDIA: GeForce NOW system requirements", href: "https://www.nvidia.com/en-us/geforce-now/system-reqs/" },
  aacy: { label: "Are We Anti-Cheat Yet?", href: "https://areweanticheatyet.com/" },
  cxCompat: { label: "CodeWeavers compatibility database", href: "https://www.codeweavers.com/compatibility" },
  legendary: { label: "Legendary, an open-source Epic Games client", href: "https://github.com/derrod/legendary" },
  vermut: { label: "Vermut source code (MIT)", href: links.github },
} as const;


export type GuideUi = {
  guides: string; download: string; home: string; breadcrumbGuide: string;
  downloadLabel: (version: string) => string; firstLaunch: string; updated: string;
  compared: string; questions: string; sources: string; tryTitle: string; tryBody: string;
  moreGuides: string; allGuides: string; readGuide: string;
  hub: { metaTitle: string; eyebrow: string; h1: string; description: string; back: string };
};

export type GuideBundle = { ui: GuideUi; guides: readonly Guide[] };

const bundles: Record<Locale, () => Promise<GuideBundle>> = {
  en: () => import("./guide-content/en"),
  it: () => import("./guide-content/it"),
  de: () => import("./guide-content/de"),
  fr: () => import("./guide-content/fr"),
  es: () => import("./guide-content/es"),
  ja: () => import("./guide-content/ja"),
  zh: () => import("./guide-content/zh"),
};

export const loadGuides = (l: Locale) => bundles[l]();

/** Slugs are shared by every locale (English slugs, locale prefix like the home page). */
export const guideSlugs = [
  "run-windows-steam-games-on-apple-silicon",
  "free-whisky-alternative-mac",
  "run-windows-games-on-mac-without-crossover",
] as const;

/** Public path: "/<slug>" for English, "/<locale>/<slug>" otherwise. "" slug = hub "guides". */
export const guideHref = (l: Locale, slug: string) => (l === "en" ? `/${slug}` : `/${l}/${slug}`);

/** Locale's home path with a hash, e.g. "/it#first-launch". */
export const homeHash = (l: Locale, hash: string) => (l === "en" ? `/#${hash}` : `/${l}#${hash}`);

/** hreflang map for a guide (or "guides" hub): all 7 locales + x-default (English). */
export const guideAlternates = (slug: string, base = "") => ({
  ...Object.fromEntries(locales.map((l) => [localeInfo[l].hreflang, `${base}${guideHref(l, slug)}`])),
  "x-default": `${base}${guideHref("en", slug)}`,
});
