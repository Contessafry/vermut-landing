/**
 * Locales. English is the default and lives at "/" (no prefix); the others
 * live at "/<segment>/". Internally English is the `en` segment, which
 * next.config.ts rewrites from "/" (and redirects "/en" → "/").
 * Rationale and data: docs/I18N.md.
 */
export const locales = ["en", "it", "de", "fr", "es", "ja", "zh"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeInfo: Record<
  Locale,
  { native: string; english: string; htmlLang: string; hreflang: string; og: string; review: "native" | "machine-assisted" }
> = {
  en: { native: "English", english: "English", htmlLang: "en", hreflang: "en", og: "en_US", review: "native" },
  it: { native: "Italiano", english: "Italian", htmlLang: "it", hreflang: "it", og: "it_IT", review: "native" },
  de: { native: "Deutsch", english: "German", htmlLang: "de", hreflang: "de", og: "de_DE", review: "machine-assisted" },
  fr: { native: "Français", english: "French", htmlLang: "fr", hreflang: "fr", og: "fr_FR", review: "machine-assisted" },
  es: { native: "Español", english: "Spanish", htmlLang: "es", hreflang: "es", og: "es_ES", review: "machine-assisted" },
  ja: { native: "日本語", english: "Japanese", htmlLang: "ja", hreflang: "ja", og: "ja_JP", review: "machine-assisted" },
  zh: { native: "简体中文", english: "Simplified Chinese", htmlLang: "zh-Hans", hreflang: "zh-Hans", og: "zh_CN", review: "machine-assisted" },
};

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Public path of a locale's home page: "/" for English, "/it/" style otherwise (no trailing slash). */
export const localePath = (l: Locale) => (l === defaultLocale ? "/" : `/${l}`);

/** hreflang → path map for the home page, plus x-default → English at "/". */
export const languageAlternates = (base = "") => ({
  ...Object.fromEntries(locales.map((l) => [localeInfo[l].hreflang, `${base}${localePath(l)}`])),
  "x-default": `${base}/`,
});
