import { ArrowDownToLine } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { getRelease } from "@/lib/release";
import { LanguageSwitcher } from "./language-switcher";
import { site } from "@/site.config";

export async function SiteFooter() {
  const content = await getDictionary();
  const { version } = await getRelease();
  const f = content.footer;
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="container-page grid-page gap-y-12 py-20 md:py-24">
        <div className="col-span-full lg:col-span-5">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG lockup */}
          <img src="/brand/vermut-lockup-white.svg" alt="Vermut" width={124} height={37} className="h-9 w-auto" loading="lazy" />
          <p className="mt-6 max-w-[38ch] text-body text-pretty">{f.statement}</p>
          <p className="mt-2 font-display text-[1.75rem] leading-none font-extrabold text-white">{site.tagline}</p>
          <a
            href={f.cta.href}
            className="mt-8 inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-6 font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
          >
            <ArrowDownToLine className="size-5" aria-hidden="true" />
            {f.cta.label}
          </a>
        </div>
        {f.columns.map((col, i) => (
          <nav
            key={col.title}
            aria-label={col.title}
            className={i === 0 ? "col-span-2 md:col-span-4 lg:col-span-2 lg:col-start-7" : "col-span-2 md:col-span-4 lg:col-span-2"}
          >
            <h2 className="font-mono text-eyebrow uppercase text-neutral-400">{col.title}</h2>
            <ul className="mt-4 flex flex-col gap-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-[0.9375rem] text-neutral-200 underline-offset-[3px] hover:text-white hover:underline">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
        <LanguageSwitcher variant="list" className="col-span-2 md:col-span-4 lg:col-span-2" />
        <p className="col-span-full border-t border-white/10 pt-8 text-[0.8125rem] leading-relaxed text-neutral-400">
          {f.legal} <span className="whitespace-nowrap">{content.ui.version(version)}.</span>
        </p>
      </div>
    </footer>
  );
}
