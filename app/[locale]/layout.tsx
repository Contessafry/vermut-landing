import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { notFound } from "next/navigation";
import { LocaleSuggest } from "@/components/locale-suggest";
import { fontVars } from "@/lib/fonts";
import { getDictionaryFor } from "@/lib/i18n";
import { hasLocale, languageAlternates, localeInfo, localePath, locales, type Locale } from "@/lib/i18n/config";
import { jsonLdGraph } from "@/lib/structured-data";
import { site, verification } from "@/site.config";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const t = await getDictionaryFor(locale);
  const { title, description, keywords } = t.seo;
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: "%s · Vermut" },
    description,
    applicationName: "Vermut",
    keywords: [...keywords],
    category: "games",
    alternates: {
      canonical: localePath(locale),
      languages: languageAlternates(),
      types: { "text/markdown": [{ url: "/llms.txt", title: "Vermut for LLMs (English)" }] },
    },
    verification: {
      ...(verification.google ? { google: verification.google } : {}),
      ...(verification.bing ? { other: { "msvalidate.01": verification.bing } } : {}),
    },
    openGraph: {
      type: "website",
      url: localePath(locale),
      siteName: "Vermut",
      title,
      description,
      locale: localeInfo[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeInfo[l].og),
    },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
    formatDetection: { telephone: false, email: false, address: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#CE003E",
  colorScheme: "light",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const t = await getDictionaryFor(locale);
  return (
    <html lang={localeInfo[locale].htmlLang} className={fontVars}>
      <body>
        <a
          href="#main"
          className="sr-only z-50 rounded-md bg-neutral-950 px-4 py-3 font-medium text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          {t.ui.skipToContent}
        </a>
        {children}
        <Analytics />
        <LocaleSuggest current={locale as Locale} options={suggestOptions()} />
        <script
          type="application/ld+json"
          // Static, server-generated JSON-LD; `<` escaped.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(await jsonLdGraph(locale)).replace(/</g, "\\u003c") }}
        />
      </body>
    </html>
  );
}

/** Per-locale banner strings, written in the *target* language (tiny, serialised to the client). */
function suggestOptions() {
  return locales.map((l) => ({ locale: l, href: localePath(l), lang: localeInfo[l].htmlLang, ...suggestCopy[l] }));
}

const suggestCopy: Record<Locale, { text: string; cta: string; dismiss: string }> = {
  en: { text: "This page is also available in English.", cta: "Read in English", dismiss: "Dismiss" },
  it: { text: "Questa pagina è disponibile anche in italiano.", cta: "Leggi in italiano", dismiss: "Chiudi" },
  de: { text: "Diese Seite gibt es auch auf Deutsch.", cta: "Auf Deutsch lesen", dismiss: "Schließen" },
  fr: { text: "Cette page existe aussi en français.", cta: "Lire en français", dismiss: "Fermer" },
  es: { text: "Esta página también está en español.", cta: "Leer en español", dismiss: "Cerrar" },
  ja: { text: "このページは日本語でもご覧いただけます。", cta: "日本語で読む", dismiss: "閉じる" },
  zh: { text: "本页面也提供简体中文版本。", cta: "阅读中文版", dismiss: "关闭" },
};
