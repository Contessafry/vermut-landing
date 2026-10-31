import { ArrowDownToLine } from "lucide-react";
import { downloadHref } from "@/lib/download-core";
import { getDictionary, getLocale } from "@/lib/i18n";
import { localePath, type Locale } from "@/lib/i18n/config";
import { guideHref, loadGuides } from "@/lib/guides";
import { getRelease } from "@/lib/release";
import { LanguageSwitcher } from "./language-switcher";
import { links, site } from "@/site.config";

/** `path` maps a locale to the same page in that locale (language list); default is each locale's home. */
export async function SiteFooter({ path }: { path?: (l: Locale) => string } = {}) {
  const [content, locale] = await Promise.all([getDictionary(), getLocale()]);
  const { ui, guides } = await loadGuides(locale);
  // Hash links point at home sections, so they work from guide pages too.
  const home = localePath(locale);
  const currentPath = path?.(locale) ?? home;
  const resolve = (href: string) => {
    if (href.startsWith("#")) return `${home}${href}`;
    if (href === links.download) return downloadHref("stable", currentPath);
    if (href === links.releases) return downloadHref("releases", currentPath);
    return href;
  };
  const columns = [
    ...content.footer.columns.map((c) => ({ ...c, links: c.links.map((l) => ({ ...l, href: resolve(l.href) })) })),
    { title: ui.guides, links: [{ label: ui.allGuides, href: guideHref(locale, "guides") }, ...guides.map((g) => ({ label: g.label, href: guideHref(locale, g.slug) }))] },
  ];
  const { version } = await getRelease();
  const f = content.footer;
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="container-page grid-page gap-y-12 py-20 md:py-24">
        <div className="col-span-full lg:col-span-4">
          {/* eslint-disable-next-line @next/next/no-img-element -- static SVG lockup */}
          <img src="/brand/vermut-lockup-white.svg" alt="Vermut" width={124} height={37} className="h-9 w-auto" loading="lazy" />
          <p className="mt-6 max-w-[38ch] text-body text-pretty">{f.statement}</p>
          <p className="mt-2 font-display text-[1.75rem] leading-none font-extrabold text-white">{site.tagline}</p>
          <a
            href={downloadHref("stable", currentPath)}
            className="mt-8 inline-flex h-12 items-center gap-2.5 rounded-full bg-white px-6 font-semibold text-neutral-950 transition-colors hover:bg-neutral-200"
          >
            <ArrowDownToLine className="size-5" aria-hidden="true" />
            {f.cta.label}
          </a>
        </div>
        {columns.map((col, i) => (
          <nav
            key={col.title}
            aria-label={col.title}
            className={i === 0 ? "col-span-2 md:col-span-4 lg:col-span-2 lg:col-start-5" : "col-span-2 md:col-span-4 lg:col-span-2"}
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
        <LanguageSwitcher variant="list" path={path} className="col-span-2 md:col-span-4 lg:col-span-2" />
        <p className="col-span-full border-t border-white/10 pt-8 text-[0.8125rem] leading-relaxed text-neutral-400">
          {f.legal} <span className="whitespace-nowrap">{content.ui.version(version)}.</span>
        </p>
      </div>
    </footer>
  );
}
