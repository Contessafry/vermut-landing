import { Ban, CircleCheck, Wrench } from "lucide-react";
import { content, type CompatGroup } from "@/lib/content";
import { RichText } from "./rich-text";
import { SectionHeading } from "./section-heading";

const tone: Record<CompatGroup["id"], { icon: typeof CircleCheck; className: string }> = {
  runs: { icon: CircleCheck, className: "text-success-subtle-foreground" },
  setup: { icon: Wrench, className: "text-warning-subtle-foreground" },
  no: { icon: Ban, className: "text-muted-foreground" },
};

export function Compatibility() {
  const s = content.compatibility;
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="bg-neutral-100/70 py-24 md:py-32">
      <div className="container-page grid-page gap-y-14">
        <SectionHeading id={s.id} eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        <ul className="col-span-full grid gap-4 md:grid-cols-3 md:gap-6">
          {s.groups.map((g) => {
            const { icon: Icon, className } = tone[g.id];
            return (
              <li key={g.id} className="flex flex-col rounded-xl border bg-card p-6 md:p-7">
                <h3 className="flex items-center gap-2.5 text-h3 font-semibold">
                  <Icon className={`size-5 shrink-0 ${className}`} aria-hidden="true" />
                  {g.title}
                </h3>
                <ul className="mt-5 flex flex-col gap-4 text-body text-muted-foreground">
                  {g.items.map((item, i) => (
                    <li key={i} className="border-t pt-4 text-pretty first:border-t-0 first:pt-0">
                      <RichText value={item} />
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
        <p className="col-span-full max-w-[72ch] text-body text-muted-foreground md:col-span-9">
          <RichText value={s.footnote} />
        </p>
      </div>
    </section>
  );
}
