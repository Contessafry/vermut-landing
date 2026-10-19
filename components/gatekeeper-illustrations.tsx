/**
 * Simplified, neutral mock-ups of the two macOS screens in the first-launch
 * flow. Plain HTML (server-rendered), zinc only, no Apple artwork. Each is a
 * single labelled image for assistive tech; the steps carry the real text.
 */

function AppGlyph() {
  return (
    <span aria-hidden="true" className="flex size-11 items-center justify-center rounded-[10px] border border-neutral-300 bg-white">
      {/* eslint-disable-next-line @next/next/no-img-element -- static SVG mark */}
      <img src="/icon.svg" alt="" width={28} height={28} className="size-7" />
    </span>
  );
}

export function NotOpenedDialog() {
  return (
    <figure
      role="img"
      aria-label="Illustration of the macOS dialog “Vermut” Not Opened, with the buttons Done and Move to Trash. Click Done."
      className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)]"
    >
      <div className="flex flex-col items-center text-center">
        <AppGlyph />
        <p className="mt-3 text-[0.875rem] font-semibold text-neutral-950">“Vermut” Not Opened</p>
        <p className="mt-1 text-[0.75rem] leading-snug text-neutral-500">
          Apple could not verify “Vermut” is free of malware that may harm your Mac or compromise your privacy.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 text-[0.75rem] font-medium">
        <span className="rounded-md bg-neutral-200 py-1.5 text-center text-neutral-700">Move to Trash</span>
        <span className="rounded-md bg-neutral-900 py-1.5 text-center text-white ring-2 ring-neutral-900 ring-offset-2 ring-offset-neutral-50">
          Done
        </span>
      </div>
    </figure>
  );
}

export function OpenAnywayPanel() {
  return (
    <figure
      role="img"
      aria-label="Illustration of System Settings, Privacy & Security, Security section: the message “Vermut” was blocked to protect your Mac, with an Open Anyway button."
      className="rounded-xl border border-neutral-200 bg-neutral-50 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.25)]"
    >
      <div className="flex items-center gap-1.5 border-b border-neutral-200 px-3 py-2">
        <span aria-hidden="true" className="size-2 rounded-full bg-neutral-300" />
        <span aria-hidden="true" className="size-2 rounded-full bg-neutral-300" />
        <span aria-hidden="true" className="size-2 rounded-full bg-neutral-300" />
        <span className="ml-2 text-[0.75rem] font-semibold text-neutral-700">Privacy &amp; Security</span>
      </div>
      <div className="p-4">
        <p className="text-[0.6875rem] font-semibold tracking-wide text-neutral-500 uppercase">Security</p>
        <div className="mt-2 rounded-lg border border-neutral-200 bg-white p-3">
          <p className="text-[0.75rem] text-neutral-500">Allow applications from App Store &amp; Known Developers</p>
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-neutral-200 pt-3">
            <p className="text-[0.75rem] leading-snug text-neutral-950">“Vermut” was blocked to protect your Mac.</p>
            <span className="shrink-0 rounded-md bg-neutral-900 px-2.5 py-1 text-[0.75rem] font-medium text-white ring-2 ring-neutral-900 ring-offset-2">
              Open Anyway
            </span>
          </div>
        </div>
      </div>
    </figure>
  );
}
