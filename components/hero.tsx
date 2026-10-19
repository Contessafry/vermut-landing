import Image from "next/image";
import { ArrowDownToLine } from "lucide-react";
import libraryShot from "@/assets/screens/library-dark.png";
import { content } from "@/lib/content";
import { GitHubIcon } from "./icons";
import { SiteHeader } from "./site-header";

export function Hero() {
  const { hero } = content;
  return (
    <section id="top" aria-labelledby="hero-title" className="on-brand relative overflow-hidden bg-brand text-white">
      <SiteHeader />
      <div className="container-page grid-page items-center pt-10 pb-0 md:pt-16 lg:pt-20 lg:pb-24">
        <div className="col-span-full lg:col-span-6">
          <p className="font-mono text-eyebrow uppercase text-white">{hero.eyebrow}</p>
          <h1 id="hero-title" className="mt-6 font-display text-display font-extrabold">
            {hero.title.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-[34ch] text-lead text-white text-pretty md:max-w-[40ch]">{hero.lead}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href={hero.primary.href}
              className="inline-flex h-13 items-center gap-2.5 rounded-full bg-white px-6 text-base font-semibold text-neutral-950 shadow-[0_1px_0_rgb(0_0_0/0.08),0_8px_24px_-8px_rgb(66_3_19/0.5)] transition-[background-color,transform] hover:bg-neutral-100 active:translate-y-px"
            >
              <ArrowDownToLine className="size-5" aria-hidden="true" />
              {hero.primary.label}
            </a>
            <a
              href={hero.secondary.href}
              className="inline-flex h-13 items-center gap-2.5 rounded-full border border-white/45 px-6 text-base font-semibold text-white transition-colors hover:border-white hover:bg-white/10"
            >
              <GitHubIcon className="size-5" />
              {hero.secondary.label}
            </a>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.8125rem] text-white" aria-label="Release details">
            {hero.meta.map((m, i) => (
              <li key={m} className="flex items-center gap-3">
                {i > 0 ? <span aria-hidden="true" className="text-white/60">·</span> : null}
                {m}
              </li>
            ))}
          </ul>
        </div>

        {/* Real app screenshot. Bleeds off the right edge on large screens. */}
        <div className="col-span-full mt-14 -mr-[var(--gutter,1.25rem)] lg:col-span-6 lg:mt-0 lg:mr-[calc(50%-50vw)]">
          <div className="relative w-[118%] max-w-none overflow-hidden rounded-t-[14px] shadow-[0_40px_80px_-20px_rgb(66_3_19/0.55)] sm:w-[108%] lg:w-[min(1040px,calc(100%+12rem))] lg:rounded-[14px]">
            <Image
              src={libraryShot}
              alt={hero.screenshotAlt}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 760px, 110vw"
              quality={85}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
