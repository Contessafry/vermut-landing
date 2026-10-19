import { ArrowDownToLine, SquareTerminal } from "lucide-react";
import { getDictionary } from "@/lib/i18n";
import { getRelease } from "@/lib/release";
import { links, release as cfg, site } from "@/site.config";
import { CopyButton } from "./copy-button";
import { NotOpenedDialog, OpenAnywayPanel } from "./gatekeeper-illustrations";
import { SectionHeading } from "./section-heading";

export async function Download() {
  const content = await getDictionary();
  const s = content.download;
  const g = s.gatekeeper;
  const r = await getRelease();
  const curl = cfg.installer.scriptUrl ? `curl -fsSL ${cfg.installer.scriptUrl} | bash` : "";
  const facts = [
    { label: content.ui.facts.version, value: r.version },
    { label: content.ui.facts.size, value: r.sizeLabel },
    { label: content.ui.facts.macos, value: content.ui.macosRequirement.replace(/^macOS /, "") },
    { label: content.ui.facts.mac, value: content.ui.appleSilicon },
    { label: content.ui.facts.licence, value: site.license },
  ];
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-4 py-24 md:py-32">
      <div className="container-page grid-page gap-y-12">
        <SectionHeading id={s.id} eyebrow={s.eyebrow} title={s.title} lead={s.lead} className="md:col-span-full lg:col-span-full" />

        <div className="col-span-full lg:col-span-5">
          <a
            href={r.dmgUrl}
            className="inline-flex h-13 items-center gap-2.5 rounded-full bg-neutral-950 px-6 text-base font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            <ArrowDownToLine className="size-5" aria-hidden="true" />
            {s.primaryLabel(r.version)}
          </a>
          <dl className="mt-8 flex flex-col border-b">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-t py-3">
                <dt className="font-mono text-[0.8125rem] leading-6 text-muted-foreground">{f.label}</dt>
                <dd className="text-[0.9375rem] leading-6">{f.value}</dd>
              </div>
            ))}
            {r.sha256 ? (
              <div id="sha256" className="grid scroll-mt-8 grid-cols-[6.5rem_1fr] gap-3 border-t py-3">
                <dt className="font-mono text-[0.8125rem] leading-6 text-muted-foreground">{s.shaLabel}</dt>
                <dd className="flex items-start gap-1">
                  <code className="min-w-0 font-mono text-[0.8125rem] leading-6 break-all select-all">{r.sha256}</code>
                  <CopyButton value={r.sha256} label={content.ui.copySha(r.dmgName)} copiedLabel={content.ui.copied} />
                </dd>
              </div>
            ) : null}
          </dl>
          <p className="mt-6 text-[0.9375rem]">
            <a href={cfg.releasesUrl} className="font-medium underline underline-offset-[3px] hover:text-muted-foreground">
              {s.allReleases}
            </a>
          </p>
          {cfg.brewCask ? (
            <div className="mt-6">
              <p className="text-[0.9375rem] text-muted-foreground">{s.brewLabel}</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-neutral-950 px-4 py-3 font-mono text-[0.875rem] text-white">
                <code>{`brew install --cask ${cfg.brewCask}`}</code>
              </pre>
            </div>
          ) : null}
        </div>

        <div className="col-span-full lg:col-span-6 lg:col-start-7">
          <h3 className="text-h3 font-semibold">{s.installTitle}</h3>
          <ol className="mt-5 flex flex-col gap-4">
            {s.steps(r.dmgName).map((step, i) => (
              <li key={step} className="grid grid-cols-[2.25rem_1fr] items-baseline gap-2 text-body text-pretty">
                <span className="font-mono text-[0.8125rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {cfg.notarized ? null : (
            <div className="mt-8 rounded-xl border bg-neutral-100/70 p-6">
              <h3 className="text-[1.0625rem] font-semibold">{g.title}</h3>
              <p className="mt-2 text-[0.9375rem] text-muted-foreground text-pretty">
                {g.why}
                <a href={links.github} className="font-medium text-foreground underline underline-offset-[3px]">
                  {g.whySource}
                </a>
                {g.whyAnd}
                <a href="#sha256" className="font-medium text-foreground underline underline-offset-[3px]">
                  {g.whySha}
                </a>
                {g.whyEnd}
              </p>
              <ol className="mt-5 flex flex-col gap-4">
                {g.steps.map((step, i) => (
                  <li key={step.title} className="grid grid-cols-[1.75rem_1fr] gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-7 items-center justify-center rounded-full bg-neutral-950 font-mono text-[0.75rem] text-white"
                    >
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-semibold">{step.title}</p>
                      <p className="mt-0.5 text-[0.9375rem] text-muted-foreground text-pretty">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <NotOpenedDialog t={content.illustrations.dialog} />
                <OpenAnywayPanel t={content.illustrations.settings} />
              </div>
              <p className="mt-2 text-[0.75rem] text-muted-foreground">{content.illustrations.note}</p>
              <p className="mt-4 text-[0.875rem] text-muted-foreground text-pretty">
                {g.note}{" "}
                <a href={g.appleHref} className="font-medium text-foreground underline underline-offset-[3px]">
                  {g.appleLabel}
                </a>
              </p>
            </div>
          )}
          {curl ? (
            <div className="mt-8 border-t pt-8">
              <h3 className="flex items-center gap-2 text-[1.0625rem] font-semibold">
                <SquareTerminal className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                {s.terminal.title}
              </h3>
              <p className="mt-2 text-[0.9375rem] text-muted-foreground text-pretty">{s.terminal.body}</p>
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-neutral-950 py-2 pr-2 pl-4">
                <pre className="min-w-0 flex-1 overflow-x-auto py-1.5 font-mono text-[0.8125rem] leading-6 text-white">
                  <code>{curl}</code>
                </pre>
                <div className="text-neutral-300 [&_button:hover]:bg-white/10 [&_button:hover]:text-white [&_button]:text-neutral-300">
                  <CopyButton value={curl} label={content.ui.copyInstall} copiedLabel={content.ui.copied} />
                </div>
              </div>
              <p className="mt-3 text-[0.9375rem]">
                <a href={cfg.installer.sourceUrl} className="font-medium underline underline-offset-[3px] hover:text-muted-foreground">
                  {s.terminal.sourceLabel}
                </a>
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
