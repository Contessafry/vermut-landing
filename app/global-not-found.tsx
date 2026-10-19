import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { fontVars } from "@/lib/fonts";
import { en } from "@/lib/i18n/dictionaries/en";
import { site } from "@/site.config";
import "./globals.css";

export const metadata: Metadata = { metadataBase: new URL(site.url), title: `${en.notFound.metaTitle} · Vermut`, robots: { index: false } };

/** Unmatched URLs (outside any locale). English, same look as the per-locale 404. */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVars}>
      <body>
        <main id="main" className="on-brand flex min-h-dvh flex-col items-start justify-center bg-brand px-6 text-white md:px-16">
          <p className="font-mono text-eyebrow uppercase">404</p>
          <h1 className="mt-4 font-display text-h2 font-extrabold">{en.notFound.title}</h1>
          <p className="mt-4 max-w-[40ch] text-lead">{en.notFound.body}</p>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full document, no client router here */}
          <a href="/" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-neutral-950 hover:bg-neutral-100">
            <ArrowLeft className="size-5" aria-hidden="true" />
            {en.notFound.back}
          </a>
        </main>
      </body>
    </html>
  );
}
