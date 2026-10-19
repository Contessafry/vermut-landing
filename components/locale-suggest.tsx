"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Option = { locale: string; href: string; lang: string; text: string; cta: string; dismiss: string };

const KEY = "vermut-locale-suggest-dismissed";

/** Map a browser language tag to one of our locales ("zh" = Simplified only). */
function match(tag: string, supported: readonly string[]): string | null {
  const t = tag.toLowerCase();
  if (t.startsWith("zh")) return /^(zh)(-hans|-cn|-sg)?(-|$)/.test(t) && !/-(hant|tw|hk|mo)/.test(t) && supported.includes("zh") ? "zh" : null;
  const base = t.split("-")[0];
  return supported.includes(base) ? base : null;
}

/**
 * Suggests the visitor's browser language once, as a dismissible toast.
 * Never redirects (crawlers and shared links always get the URL they asked
 * for), renders nothing on the server, and is fixed-position (no layout shift).
 */
export function LocaleSuggest({ current, options }: { current: string; options: Option[] }) {
  const [opt, setOpt] = useState<Option | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY)) return;
    } catch {
      return;
    }
    const supported = options.map((o) => o.locale);
    for (const tag of navigator.languages ?? [navigator.language]) {
      const l = match(tag, supported);
      if (!l) continue;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time read of browser-only state
      if (l !== current) setOpt(options.find((o) => o.locale === l) ?? null);
      return;
    }
  }, [current, options]);

  if (!opt) return null;
  const dismiss = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setOpt(null);
  };
  return (
    <div
      lang={opt.lang}
      role="region"
      aria-label={opt.text}
      className="fixed inset-x-3 bottom-3 z-40 flex items-center gap-3 rounded-xl border border-neutral-200 bg-white/95 p-3 pl-4 text-[0.9375rem] shadow-[0_12px_32px_-12px_rgb(0_0_0/0.35)] backdrop-blur sm:inset-x-auto sm:left-4 sm:max-w-md"
    >
      <p className="flex-1 text-neutral-700">{opt.text}</p>
      <a
        href={opt.href}
        hrefLang={opt.lang}
        onClick={dismiss}
        className="shrink-0 rounded-full bg-neutral-950 px-4 py-2 font-semibold text-white hover:bg-neutral-800"
      >
        {opt.cta}
      </a>
      <button
        type="button"
        onClick={dismiss}
        aria-label={opt.dismiss}
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-950"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
    </div>
  );
}
