import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { getDictionary, getLocale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getDictionary();
  return { title: t.notFound.metaTitle, robots: { index: false } };
}

export default async function NotFound() {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()]);
  return (
    <main id="main" className="on-brand flex min-h-dvh flex-col items-start justify-center bg-brand px-6 text-white md:px-16">
      <p className="font-mono text-eyebrow uppercase">404</p>
      <h1 className="mt-4 font-display text-h2 font-extrabold">{t.notFound.title}</h1>
      <p className="mt-4 max-w-[40ch] text-lead">{t.notFound.body}</p>
      <a href={localePath(locale)} className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-semibold text-neutral-950 hover:bg-neutral-100">
        <ArrowLeft className="size-5" aria-hidden="true" />
        {t.notFound.back}
      </a>
    </main>
  );
}
