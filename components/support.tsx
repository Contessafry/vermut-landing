import { Bug, Gamepad2, HeartHandshake, Share2, Star } from "lucide-react";
import { content } from "@/lib/content";
import { donate, site } from "@/site.config";
import { CopyButton } from "./copy-button";
import { SectionHeading } from "./section-heading";

const icons = { star: Star, bug: Bug, games: Gamepad2 } as const;
const linkClass = "font-medium text-foreground underline underline-offset-[3px] hover:text-muted-foreground";

export function Support() {
  const s = content.support;
  const url = site.url;
  const text = encodeURIComponent(s.share.text);
  const shareLinks = [
    { label: "X", href: `https://x.com/intent/post?text=${text}&url=${encodeURIComponent(url)}` },
    { label: "Bluesky", href: `https://bsky.app/intent/compose?text=${encodeURIComponent(`${s.share.text} ${url}`)}` },
    { label: "Reddit", href: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${text}` },
  ];
  return (
    <section id={s.id} aria-labelledby={`${s.id}-title`} className="scroll-mt-4 py-24 md:py-32">
      <div className="container-page grid-page gap-y-12">
        <SectionHeading id={s.id} eyebrow={s.eyebrow} title={s.title} lead={s.lead} />
        {donate.paypal ? (
          <div className="col-span-full flex flex-wrap items-center gap-x-4 gap-y-2 lg:col-span-5 lg:self-end lg:justify-self-end">
            <a
              href={donate.paypal}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-13 items-center gap-2.5 rounded-full bg-neutral-950 px-6 text-base font-semibold text-white transition-colors hover:bg-neutral-800"
            >
              <HeartHandshake className="size-5" aria-hidden="true" />
              {s.donateLabel}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <p className="text-[0.875rem] text-muted-foreground">{s.donateNote}</p>
          </div>
        ) : null}

        <div className="col-span-full">
          <h3 className="text-h3 font-semibold">{s.otherTitle}</h3>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {s.options.map((o) => {
              const Icon = icons[o.id];
              return (
                <li key={o.id} className="flex flex-col rounded-xl border bg-card p-6">
                  <Icon className="size-5 text-muted-foreground" aria-hidden="true" />
                  <p className="mt-4 font-semibold">{o.title}</p>
                  <p className="mt-1 flex-1 text-[0.9375rem] text-muted-foreground text-pretty">{o.body}</p>
                  <a href={o.href} className={`mt-4 text-[0.9375rem] ${linkClass}`}>
                    {o.label}
                  </a>
                </li>
              );
            })}
            <li className="flex flex-col rounded-xl border bg-card p-6">
              <Share2 className="size-5 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 font-semibold">{s.share.title}</p>
              <p className="mt-1 flex-1 text-[0.9375rem] text-muted-foreground text-pretty">{s.share.body}</p>
              <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9375rem]">
                {shareLinks.map((l) => (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {l.label}
                    <span className="sr-only"> (share, opens in a new tab)</span>
                  </a>
                ))}
                <CopyButton value={url} label="Copy link to Vermut" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
