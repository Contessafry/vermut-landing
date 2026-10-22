import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GuideHeader, guideAlternates, JsonLd } from "@/components/guide-page";
import { SiteFooter } from "@/components/site-footer";
import { getLocale } from "@/lib/i18n";
import { hasLocale, localeInfo, locales } from "@/lib/i18n/config";
import { guideHref, loadGuides } from "@/lib/guides";
import { site } from "@/site.config";

export async function generateMetadata({ params }: PageProps<"/[locale]/guides">): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(locale)) return {};
  const { ui } = await loadGuides(locale);
  const path = guideHref(locale, "guides");
  return {
    title: ui.hub.metaTitle,
    description: ui.hub.description,
    alternates: { canonical: path, languages: guideAlternates("guides") },
    openGraph: {
      type: "website", url: path, siteName: "Vermut", title: ui.hub.metaTitle, description: ui.hub.description,
      locale: localeInfo[locale].og, alternateLocale: locales.filter((o) => o !== locale).map((o) => localeInfo[o].og),
    },
  };
}

export default async function GuidesHub() {
  const locale = await getLocale();
  const { ui, guides } = await loadGuides(locale);
  const url = `${site.url}${guideHref(locale, "guides")}`;
  return (
    <>
      <div id="top" className="on-brand bg-brand text-white">
        <GuideHeader locale={locale} ui={ui} slug="guides" />
        <div className="container-page grid-page pt-8 pb-16 md:pt-12 md:pb-24">
          <div className="col-span-full lg:col-span-8">
            <p className="font-mono text-eyebrow uppercase text-white/85">{ui.hub.eyebrow}</p>
            <h1 className="mt-6 font-display text-h2 font-extrabold text-balance">{ui.hub.h1}</h1>
            <p className="mt-8 max-w-[56ch] text-lead text-white text-pretty">{ui.hub.description}</p>
          </div>
        </div>
      </div>
      <main id="main" tabIndex={-1} className="outline-none">
        <div className="container-page grid-page gap-y-6 py-20 md:py-24">
          <ul className="col-span-full grid gap-6 md:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={guideHref(locale, g.slug)} className="group flex h-full flex-col rounded-xl border bg-white p-7 transition-colors hover:border-neutral-950">
                  <h2 className="font-display text-[1.625rem] leading-[1.1] font-extrabold text-balance">{g.h1}</h2>
                  <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground text-pretty">{g.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-foreground">
                    {ui.readGuide} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="col-span-full text-[0.9375rem] text-muted-foreground">
            <Link href={locale === "en" ? "/" : `/${locale}`} className="font-medium text-foreground underline underline-offset-[3px]">{ui.hub.back}</Link>
          </p>
        </div>
      </main>
      <SiteFooter path={(l) => guideHref(l, "guides")} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${url}#page`,
          url,
          name: ui.hub.metaTitle,
          description: ui.hub.description,
          inLanguage: localeInfo[locale].hreflang,
          hasPart: guides.map((g) => ({ "@type": "TechArticle", headline: g.h1, url: `${site.url}${guideHref(locale, g.slug)}` })),
        }}
      />
    </>
  );
}
