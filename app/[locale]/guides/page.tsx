import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { assertEnglish, GuideHeader, guidePath, JsonLd } from "@/components/guide-page";
import { SiteFooter } from "@/components/site-footer";
import { guides } from "@/lib/guides";
import { site } from "@/site.config";

const description =
  "Practical, honest guides to running Windows games on Apple Silicon Macs: Steam with Wine, Whisky alternatives, and options without CrossOver.";

export const metadata: Metadata = {
  title: "Guides: Windows games on Apple Silicon Macs",
  description,
  alternates: { canonical: "/guides", languages: { en: "/guides", "x-default": "/guides" } },
  openGraph: { type: "website", url: "/guides", siteName: "Vermut", title: "Vermut guides", description, locale: "en_US" },
};

export default async function GuidesHub() {
  await assertEnglish();
  const url = `${site.url}/guides`;
  return (
    <>
      <div id="top" className="on-brand bg-brand text-white">
        <GuideHeader />
        <div className="container-page grid-page pt-8 pb-16 md:pt-12 md:pb-24">
          <div className="col-span-full lg:col-span-8">
            <p className="font-mono text-eyebrow uppercase text-white/85">Guides</p>
            <h1 className="mt-6 font-display text-h2 font-extrabold text-balance">Windows games on your Mac, explained honestly.</h1>
            <p className="mt-8 max-w-[56ch] text-lead text-white text-pretty">{description}</p>
          </div>
        </div>
      </div>
      <main id="main" tabIndex={-1} className="outline-none">
        <div className="container-page grid-page gap-y-6 py-20 md:py-24">
          <ul className="col-span-full grid gap-6 md:grid-cols-3">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link href={guidePath(g.slug)} className="group flex h-full flex-col rounded-xl border bg-white p-7 transition-colors hover:border-neutral-950">
                  <h2 className="font-display text-[1.625rem] leading-[1.1] font-extrabold text-balance">{g.h1}</h2>
                  <p className="mt-4 flex-1 text-[0.9375rem] leading-relaxed text-muted-foreground text-pretty">{g.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-foreground">
                    Read the guide <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="col-span-full text-[0.9375rem] text-muted-foreground">
            Guides are in English. <Link href="/" className="font-medium text-foreground underline underline-offset-[3px]">Back to Vermut</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "@id": `${url}#page`,
          url,
          name: "Vermut guides",
          description,
          inLanguage: "en",
          hasPart: guides.map((g) => ({ "@type": "TechArticle", headline: g.h1, url: `${site.url}${guidePath(g.slug)}` })),
        }}
      />
    </>
  );
}
