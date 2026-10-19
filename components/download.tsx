import { ArrowDownToLine, ShieldCheck } from "lucide-react";
import { content } from "@/lib/content";
import { SectionHeading } from "./section-heading";

export function Download() {
  const s = content.download;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-4 py-24 md:py-32">
      <div className="container-page grid-page gap-y-12">
        <SectionHeading id={s.id} eyebrow={s.eyebrow} title={s.title} lead={s.lead} className="md:col-span-full lg:col-span-full" />

        <div className="col-span-full lg:col-span-5">
          <a
            href={s.primary.href}
            className="inline-flex h-13 items-center gap-2.5 rounded-full bg-neutral-950 px-6 text-base font-semibold text-white transition-colors hover:bg-neutral-800"
          >
            <ArrowDownToLine className="size-5" aria-hidden="true" />
            {s.primary.label}
          </a>
          <dl className="mt-8 flex flex-col border-b">
            {s.facts.map((f) => (
              <div key={f.label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-t py-3">
                <dt className="font-mono text-[0.8125rem] leading-6 text-muted-foreground">{f.label}</dt>
                <dd className="text-[0.9375rem] leading-6">{f.value}</dd>
              </div>
            ))}
          </dl>
          <ul className="mt-6 flex flex-col gap-2 text-[0.9375rem]">
            {s.checksum ? (
              <li>
                <a href={s.checksum.href} className="inline-flex items-center gap-2 font-medium underline underline-offset-[3px] hover:text-muted-foreground">
                  <ShieldCheck className="size-4" aria-hidden="true" />
                  {s.checksum.label}
                </a>
              </li>
            ) : null}
            <li>
              <a href={s.allReleases.href} className="font-medium underline underline-offset-[3px] hover:text-muted-foreground">
                {s.allReleases.label}
              </a>
            </li>
          </ul>
          {s.brew ? (
            <div className="mt-6">
              <p className="text-[0.9375rem] text-muted-foreground">{s.brew.label}</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-neutral-950 px-4 py-3 font-mono text-[0.875rem] text-white">
                <code>{s.brew.command}</code>
              </pre>
            </div>
          ) : null}
        </div>

        <div className="col-span-full lg:col-span-6 lg:col-start-7">
          <h3 className="text-h3 font-semibold">{s.installTitle}</h3>
          <ol className="mt-5 flex flex-col gap-4">
            {s.steps.map((step, i) => (
              <li key={step} className="grid grid-cols-[2.25rem_1fr] items-baseline gap-2 text-body text-pretty">
                <span className="font-mono text-[0.8125rem] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {s.gatekeeper ? (
            <div className="mt-8 rounded-xl border bg-neutral-100/70 p-6">
              <h3 className="text-[1.0625rem] font-semibold">{s.gatekeeper.title}</h3>
              <p className="mt-2 text-body text-muted-foreground text-pretty">{s.gatekeeper.intro}</p>
              <ol className="mt-4 list-decimal space-y-2 pl-5 text-body text-pretty">
                {s.gatekeeper.steps.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ol>
              <p className="mt-4 text-[0.9375rem] text-muted-foreground text-pretty">{s.gatekeeper.note}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
