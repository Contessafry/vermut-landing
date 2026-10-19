import { content } from "@/lib/content";
import { links } from "@/site.config";
import { GitHubIcon } from "./icons";

export function SiteHeader() {
  return (
    <header className="container-page relative z-10 flex h-18 items-center justify-between md:h-22">
      <a href="#top" className="-m-2 rounded-md p-2" aria-label="Vermut, back to top">
        {/* eslint-disable-next-line @next/next/no-img-element -- static SVG lockup, no optimisation needed */}
        <img src="/brand/vermut-lockup-white.svg" alt="" width={124} height={37} className="h-8 w-auto md:h-9" />
      </a>
      <nav aria-label="Primary" className="flex items-center gap-1">
        <ul className="hidden items-center gap-1 md:flex">
          {content.nav.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="rounded-md px-3 py-2 text-[0.9375rem] font-medium text-white/90 transition-colors hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href={links.github}
          className="ml-2 inline-flex h-10 items-center gap-2 rounded-full border border-white/35 px-4 text-[0.9375rem] font-medium text-white transition-colors hover:border-white hover:bg-white/10"
        >
          <GitHubIcon className="size-4" />
          <span>GitHub</span>
        </a>
      </nav>
    </header>
  );
}
