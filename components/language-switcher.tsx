import { Globe } from "lucide-react";
import { getDictionary, getLocale } from "@/lib/i18n";
import { localeInfo, localePath, locales } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

/**
 * Plain links (crawlable, no JS). `variant="menu"` wraps them in a native
 * <details> disclosure for the header; `variant="list"` is the footer list.
 */
export async function LanguageSwitcher({ variant, className }: { variant: "menu" | "list"; className?: string }) {
  const [t, current] = await Promise.all([getDictionary(), getLocale()]);
  const items = locales.map((l) => (
    <li key={l}>
      <a
        href={localePath(l)}
        hrefLang={localeInfo[l].htmlLang}
        lang={localeInfo[l].htmlLang}
        aria-current={l === current ? "page" : undefined}
        className={cn(
          variant === "menu"
            ? "block rounded-md px-3 py-2 text-[0.9375rem] text-neutral-800 hover:bg-neutral-100 aria-[current=page]:font-semibold aria-[current=page]:text-neutral-950"
            : "text-[0.9375rem] text-neutral-200 underline-offset-[3px] hover:text-white hover:underline aria-[current=page]:font-semibold aria-[current=page]:text-white",
        )}
      >
        {localeInfo[l].native}
      </a>
    </li>
  ));
  if (variant === "list") {
    return (
      <nav aria-label={t.ui.language} className={className}>
        <h2 className="font-mono text-eyebrow uppercase text-neutral-400">{t.ui.language}</h2>
        <ul className="mt-4 flex flex-col gap-2.5">{items}</ul>
      </nav>
    );
  }
  return (
    <details className={cn("group relative", className)}>
      <summary
        className="inline-flex h-10 cursor-pointer list-none items-center gap-1.5 rounded-full px-3 text-[0.9375rem] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white [&::-webkit-details-marker]:hidden"
        aria-label={`${t.ui.language}: ${localeInfo[current].native}`}
      >
        <Globe className="size-4" aria-hidden="true" />
        <span className="uppercase">{current === "zh" ? "中文" : current}</span>
      </summary>
      <ul className="absolute right-0 z-30 mt-2 w-44 rounded-xl border border-neutral-200 bg-white p-1.5 shadow-[0_16px_40px_-12px_rgb(0_0_0/0.35)]">
        {items}
      </ul>
    </details>
  );
}
