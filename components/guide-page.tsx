import Link from "next/link";
import { ArrowDownToLine, ArrowRight, Plus } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale } from "@/lib/i18n";
import { localeInfo, locales, type Locale } from "@/lib/i18n/config";
export { guideAlternates } from "@/lib/guides";
import { guideAlternates, guideHref, guidesUpdated, homeHash, loadGuides, type Guide, type GuideSection, type GuideUi } from "@/lib/guides";
import { plain } from "@/lib/structured-data";
import { getRelease } from "@/lib/release";
import { site } from "@/site.config";
import { GitHubIcon } from "./icons";
import { LanguageSwitcher } from "./language-switcher";
import { RichText } from "./rich-text";
import { SiteFooter } from "./site-footer";

const absolute = (path: string) => `${site.url}${path}`;
const homeOf = (l: Locale) => (l === "en" ? "/" : `/${l}`);

export async function guideMetadata(locale: string, slug: string): Promise<Metadata> {
  const l = toLocale(locale);
  const { guides } = await loadGuides(l);
  const g = guides.find((x) => x.slug === slug);
  if (!g) return {};
  const path = guideHref(l, slug);
  return {
    title: g.metaTitle,
    description: g.description,
    alternates: { canonical: path, languages: guideAlternates(slug) },
    openGraph: {
      type: "article", url: path, siteName: "Vermut", title: g.metaTitle, description: g.description,
      locale: localeInfo[l].og, alternateLocale: locales.filter((o) => o !== l).map((o) => localeInfo[o].og),
    },
    twitter: { card: "summary_large_image", title: g.metaTitle, description: g.description },
  };
}

const toLocale = (l: string): Locale => ((locales as readonly string[]).includes(l) ? (l as Locale) : "en");

export function GuideHeader({ locale, ui, slug }: { locale: Locale; ui: GuideUi; slug: string }) {
  return (
    <header className="container-page relative z-10 flex h-18 items-center justify-between md:h-22">
      <Link href={homeOf(locale)} className="-m-2 rounded-md p-2" aria-label={ui.home}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG lockup */}
        <img src="/brand/vermut-lockup-white.svg" alt="" width={124} height={37} className="h-8 w-auto md:h-9" />
      </Link>
      <nav aria-label="Primary" className="flex items-center gap-1">
        <Link href={guideHref(locale, "guides")} className="rounded-md px-3 py-2 text-[0.9375rem] font-medium text-white/90 hover:bg-white/10 hover:text-white">
          {ui.guides}
        </Link>
        <Link href={homeHash(locale, "download")} className="hidden rounded-md px-3 py-2 text-[0.9375rem] font-medium text-white/90 hover:bg-white/10 hover:text-white sm:inline-block">
          {ui.download}
        </Link>
        <LanguageSwitcher variant="menu" className="ml-1" path={(l) => guideHref(l, slug)} />
        <a
          href={site.githubUrl}
          className="ml-1 inline-flex h-10 items-center gap-2 rounded-full border border-white/35 px-4 text-[0.9375rem] font-medium text-white transition-colors hover:border-white hover:bg-white/10"
        >
          <GitHubIcon className="size-4" />
          <span>GitHub</span>
        </a>
      </nav>
    </header>
  );
}

function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 font-mono text-eyebrow uppercase text-white/85">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {it.href ? <a href={it.href} className="hover:text-white hover:underline">{it.label}</a> : <span aria-current="page">{it.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

async function DownloadCta({ tone = "dark", locale, ui }: { tone?: "dark" | "light"; locale: Locale; ui: GuideUi }) {
  const r = await getRelease();
  const btn =
    tone === "light"
      ? "bg-white text-neutral-950 hover:bg-neutral-100"
      : "bg-neutral-950 text-white hover:bg-neutral-800";
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <a href={r.dmgUrl} className={`inline-flex h-13 items-center gap-2.5 rounded-full px-6 text-base font-semibold transition-colors ${btn}`}>
        <ArrowDownToLine className="size-5" aria-hidden="true" />
        {ui.downloadLabel(r.version)}
      </a>
      <Link href={homeHash(locale, "first-launch")} className={`text-[0.9375rem] font-medium underline underline-offset-[3px] ${tone === "light" ? "text-white" : "text-foreground"}`}>
        {ui.firstLaunch}
      </Link>
    </div>
  );
}

function Section({ s }: { s: GuideSection }) {
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-8">
      <h2 id={`${s.id}-title`} className="font-display text-[2rem] leading-[1.05] font-extrabold text-balance md:text-[2.5rem]">
        {s.title}
      </h2>
      {s.steps ? (
        <ol className="mt-6 flex flex-col gap-5">
          {s.steps.map((st, i) => (
            <li key={st.title} className="grid grid-cols-[2.25rem_1fr] gap-4">
              <span aria-hidden="true" className="flex size-9 items-center justify-center rounded-full bg-neutral-950 font-mono text-[0.875rem] font-semibold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[1.125rem] font-semibold text-foreground">{st.title}</h3>
                <p className="mt-1 text-body text-muted-foreground text-pretty"><RichText value={st.body} /></p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
      {s.bullets ? (
        <ul className="mt-6 flex flex-col gap-3">
          {s.bullets.map((b, i) => (
            <li key={i} className="relative pl-6 text-body text-muted-foreground text-pretty before:absolute before:top-[0.7em] before:left-0 before:size-2 before:rounded-full before:bg-neutral-400">
              <RichText value={b} />
            </li>
          ))}
        </ul>
      ) : null}
      {s.body?.map((p, i) => (
        <p key={i} className="mt-5 text-body text-muted-foreground text-pretty"><RichText value={p} /></p>
      ))}
    </section>
  );
}

function guideJsonLd(g: Guide, l: Locale, ui: GuideUi) {
  const url = absolute(guideHref(l, g.slug));
  const inLanguage = localeInfo[l].hreflang;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        "@id": `${url}#article`,
        headline: g.h1,
        description: g.description,
        inLanguage,
        url,
        mainEntityOfPage: url,
        dateModified: guidesUpdated,
        datePublished: guidesUpdated,
        image: absolute("/opengraph-image.png"),
        author: { "@id": `${site.url}/#organization` },
        publisher: { "@id": `${site.url}/#organization` },
        about: { "@type": "SoftwareApplication", name: "Vermut", operatingSystem: `macOS ${site.minMacOS} or later`, applicationCategory: "GameApplication", url: absolute(homeOf(l)) },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage,
        mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f.a) } })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Vermut", item: absolute(homeOf(l)) },
          { "@type": "ListItem", position: 2, name: ui.guides, item: absolute(guideHref(l, "guides")) },
          { "@type": "ListItem", position: 3, name: g.label, item: url },
        ],
      },
      { "@type": "Organization", "@id": `${site.url}/#organization`, name: "Vermut", url: `${site.url}/`, logo: absolute("/icon-512.png"), sameAs: [site.githubUrl] },
    ],
  };
}

export const JsonLd = ({ data }: { data: unknown }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
);

export async function GuidePage({ slug }: { slug: string }) {
  const locale = await getLocale();
  const { ui, guides } = await loadGuides(locale);
  const g = guides.find((x) => x.slug === slug);
  if (!g) notFound();
  const others = guides.filter((o) => o.slug !== slug);
  return (
    <>
      <div id="top" className="on-brand bg-brand text-white">
        <GuideHeader locale={locale} ui={ui} slug={slug} />
        <div className="container-page grid-page pt-8 pb-16 md:pt-12 md:pb-24">
          <div className="col-span-full lg:col-span-9">
            <Breadcrumb items={[{ label: "Vermut", href: homeOf(locale) }, { label: ui.guides, href: guideHref(locale, "guides") }, { label: ui.breadcrumbGuide }]} />
            <h1 className="mt-6 font-display text-h2 font-extrabold text-balance">{g.h1}</h1>
            <p className="mt-8 max-w-[62ch] text-lead text-white text-pretty">
              <RichText value={g.answer} />
            </p>
            <div className="mt-10"><DownloadCta tone="light" locale={locale} ui={ui} /></div>
            <p className="mt-6 font-mono text-eyebrow uppercase text-white/85">{ui.updated}</p>
          </div>
        </div>
      </div>

      <main id="main" tabIndex={-1} className="outline-none">
        <div className="container-page grid-page gap-y-16 py-20 md:py-24">
          <article className="col-span-full flex flex-col gap-16 lg:col-span-8">
            {g.sections.map((s) => <Section key={s.id} s={s} />)}

            {g.compare ? (
              <section aria-labelledby="compare-title">
                <h2 id="compare-title" className="font-display text-[2rem] leading-[1.05] font-extrabold md:text-[2.5rem]">{ui.compared}</h2>
                <div className="mt-6 overflow-x-auto rounded-xl border">
                  <table className="w-full min-w-[40rem] border-collapse text-left text-[0.9375rem]">
                    <caption className="px-4 pt-4 pb-2 text-left text-[0.8125rem] text-muted-foreground">{g.compare.caption}</caption>
                    <thead>
                      <tr className="border-b bg-neutral-100/70">
                        {g.compare.columns.map((c) => (
                          <th key={c} scope="col" className="px-4 py-3 font-semibold text-foreground">{c}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {g.compare.rows.map((r) => (
                        <tr key={r.label} className="border-b last:border-b-0">
                          <th scope="row" className="px-4 py-3 align-top font-semibold text-foreground">{r.label}</th>
                          {r.cells.map((c, i) => (
                            <td key={i} className="px-4 py-3 align-top text-muted-foreground">{c}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ) : null}

            {g.after?.map((s) => <Section key={s.id} s={s} />)}

            <section aria-labelledby="faq-title">
              <h2 id="faq-title" className="font-display text-[2rem] leading-[1.05] font-extrabold md:text-[2.5rem]">{ui.questions}</h2>
              <ul className="mt-6 border-b border-neutral-300">
                {g.faq.map((item) => (
                  <li key={item.q} className="border-t border-neutral-300">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.125rem] font-semibold text-foreground">
                        <h3>{item.q}</h3>
                        <Plus className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
                      </summary>
                      <p className="max-w-[62ch] pb-6 text-body text-muted-foreground text-pretty"><RichText value={item.a} /></p>
                    </details>
                  </li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="sources-title">
              <h2 id="sources-title" className="font-mono text-eyebrow uppercase text-muted-foreground">{ui.sources}</h2>
              <ul className="mt-4 flex flex-col gap-2 text-[0.9375rem]">
                {g.sources.map((s) => (
                  <li key={s.href}><RichText value={[{ text: s.label, href: s.href }]} /></li>
                ))}
              </ul>
            </section>
          </article>

          <aside aria-labelledby="try-title" className="col-span-full self-start rounded-xl bg-neutral-950 p-7 text-white lg:sticky lg:top-8 lg:col-span-4">
            <h2 id="try-title" className="font-display text-[2rem] leading-none font-extrabold">{ui.tryTitle}</h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-neutral-300">{ui.tryBody}</p>
            <p lang="en" className="mt-3 font-display text-[1.375rem] leading-none font-extrabold">{site.tagline}</p>
            <div className="mt-6"><DownloadCta tone="light" locale={locale} ui={ui} /></div>
            <h3 className="mt-8 font-mono text-eyebrow uppercase text-neutral-400">{ui.moreGuides}</h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {others.map((o) => (
                <li key={o.slug}>
                  <Link href={guideHref(locale, o.slug)} className="inline-flex items-start gap-2 text-[0.9375rem] text-neutral-200 hover:text-white hover:underline">
                    <ArrowRight className="mt-1 size-4 shrink-0" aria-hidden="true" />
                    {o.label}
                  </Link>
                </li>
              ))}
              <li><Link href={homeOf(locale)} className="inline-flex items-start gap-2 text-[0.9375rem] text-neutral-200 hover:text-white hover:underline"><ArrowRight className="mt-1 size-4 shrink-0" aria-hidden="true" />{ui.home}</Link></li>
            </ul>
          </aside>
        </div>
      </main>
      <SiteFooter path={(l) => guideHref(l, slug)} />
      <JsonLd data={guideJsonLd(g, locale, ui)} />
    </>
  );
}
