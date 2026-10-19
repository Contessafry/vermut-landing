import type { Dictionary } from "@/lib/i18n";

/**
 * Simplified, neutral mock-ups of the two macOS screens in the first-launch
 * flow. Plain HTML (server-rendered), zinc only, no Apple artwork. Each is a
 * single labelled image for assistive tech; the steps carry the real text.
 */
type Ill = Dictionary["illustrations"];

function AppGlyph() {
  return (
    <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-[10px] border border-neutral-300 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG mark */}
      <img src="/icon.svg" alt="" width={28} height={28} className="size-7" />
    </span>
  );
}

export function NotOpenedDialog({ t }: { t: Ill["dialog"] }) {
  return (
    <figure role="img" aria-label={t.aria} className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)]">
      <div className="flex flex-col items-center text-center">
        <AppGlyph />
        <p className="mt-3 text-[0.875rem] font-semibold text-neutral-950">{t.title}</p>
        <p className="mt-1 text-[0.75rem] leading-snug text-neutral-500">{t.body}</p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-[0.75rem] font-medium">
        <span className="rounded-md bg-neutral-200 px-1 py-1.5 text-center text-neutral-700">{t.trash}</span>
        <span className="rounded-md bg-neutral-900 px-1 py-1.5 text-center text-white ring-2 ring-neutral-900 ring-offset-2 ring-offset-neutral-50">
          {t.done}
        </span>
      </div>
    </figure>
  );
}

export function OpenAnywayPanel({ t }: { t: Ill["settings"] }) {
  return (
    <figure role="img" aria-label={t.aria} className="rounded-xl border border-neutral-200 bg-neutral-50 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)]">
      <div className="flex items-center gap-1.5 border-b border-neutral-200 px-3 py-2">
        <span aria-hidden="true" className="size-2 rounded-full bg-neutral-300" />
        <span aria-hidden="true" className="size-2 rounded-full bg-neutral-300" />
        <span aria-hidden="true" className="size-2 rounded-full bg-neutral-300" />
        <span className="ml-2 text-[0.75rem] font-semibold text-neutral-700">{t.window}</span>
      </div>
      <div className="p-4">
        <p className="text-[0.6875rem] font-semibold tracking-wide text-neutral-500 uppercase">{t.section}</p>
        <div className="mt-2 rounded-lg border border-neutral-200 bg-white p-3">
          <p className="text-[0.75rem] text-neutral-500">{t.allow}</p>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-200 pt-3">
            <p className="text-[0.75rem] leading-snug text-neutral-950">{t.blocked}</p>
            <span className="shrink-0 rounded-md bg-neutral-900 px-2.5 py-1 text-[0.75rem] font-medium text-white ring-2 ring-neutral-900 ring-offset-2">
              {t.button}
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}
