import { Plus } from "lucide-react";
import { content } from "@/lib/content";
import { getRelease } from "@/lib/release";
import { RichText } from "./rich-text";
import { SectionHeading } from "./section-heading";

/** Native <details>: accessible disclosure, zero JS. */
export async function Faq() {
  const s = content.faq;
  const r = await getRelease();
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="bg-neutral-100/70 py-24 md:py-32">
      <div className="container-page grid-page gap-y-12">
        <SectionHeading id={s.id} eyebrow={s.eyebrow} title={s.title} />
        <div className="col-span-full lg:col-span-7">
          <ul className="border-b border-neutral-300">
            {s.items.map((item) => (
              <li key={item.q} className="border-t border-neutral-300">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[1.125rem] font-semibold text-foreground">
                    <span>{item.q}</span>
                    <Plus
                      className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45"
                      aria-hidden="true"
                    />
                  </summary>
                  <p className="max-w-[62ch] pb-6 text-body text-muted-foreground text-pretty">
                    <RichText value={item.a} />
                  </p>
                </details>
              </li>
            ))}
          </ul>
        </div>
        <aside
          aria-labelledby="requirements-title"
          className="col-span-full self-start rounded-xl bg-neutral-950 p-7 text-white lg:sticky lg:top-8 lg:col-span-4 lg:col-start-9"
        >
          <h3 id="requirements-title" className="font-display text-[2rem] leading-none font-extrabold">
            {s.requirements.title}
          </h3>
          <dl className="mt-6 flex flex-col">
            {s.requirements.items.map((r) => (
              <div key={r.label} className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-white/12 py-3.5">
                <dt className="font-mono text-[0.8125rem] leading-6 text-neutral-400">{r.label}</dt>
                <dd className="text-[0.9375rem] leading-6">{r.value}</dd>
              </div>
            ))}
            <div className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-white/12 py-3.5">
              <dt className="font-mono text-[0.8125rem] leading-6 text-neutral-400">Latest</dt>
              <dd className="text-[0.9375rem] leading-6">
                <a href={r.notesUrl} className="underline underline-offset-[3px] hover:text-neutral-300">
                  Vermut {r.version} release notes
                </a>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
    </section>
  );
}
