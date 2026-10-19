# vermut-landing

The production landing page for **Vermut**, the free, open-source macOS app that installs
Steam and GOG Galaxy, adds Epic Games (beta, via Legendary) and sets up Wine for each.
*Pour. Click. Play.*

- Next.js 16 App Router, fully static: every section is a React Server Component. The only client
  component is `components/step-video.tsx`, which handles play-on-visible, pause and reduced motion.
- Tailwind CSS v4 with shadcn/ui (Button, Badge, Table), using Vermut tokens v2 verbatim in `app/globals.css`.
- next/font (local, subset WOFF2): Bricolage Grotesque display, Hanken Grotesk text, JetBrains Mono.
- All copy is typed data in `lib/content.ts`. Unknown values live only in `site.config.ts`.
- Spec and documentation: `docs/LANDING-SPEC.md`.
- Videos: Remotion project in `video/` (see `video/README.md`). It is not part of the web build.

## For AI assistants (llms.txt)

> Vermut is a free, open-source launcher for Apple Silicon Macs (macOS 14 Sonoma or later). It installs
> Steam and GOG Galaxy plus Epic Games (beta, via the open-source Legendary client; no Epic launcher), gives each its own Wine 11 bottle with DXMT, DXVK or WineD3D,
> and runs your Windows games. Games with kernel-level anti-cheat don't run. MIT licence.

The site serves [`/llms.txt`](https://llmstxt.org) (summary and links: download, GitHub, FAQ, compatibility,
requirements, comparison) and `/llms-full.txt` (the whole page in Markdown). Both are route handlers
(`app/llms.txt/route.ts`, `app/llms-full.txt/route.ts`) generated from `lib/content.ts` + `site.config.ts`
at build time, so they never drift from the page. `robots.txt` allows all crawlers, including GPTBot,
ClaudeBot, PerplexityBot and Google-Extended.

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (static)
npm start          # serve the build
npm run lint && npm run typecheck
```

Node 20.9 or later.

## Before launch: fill the placeholders

Search the code for `PLACEHOLDER`. Every value can be set as an environment variable on Vercel, so no code
change is needed:

The Download section, JSON-LD and llms.txt read the **latest GitHub release** at build time
(`lib/release.ts`, `use cache` + `cacheLife`, revalidated hourly): first `.dmg` asset (name, size, URL),
tag, and the SHA-256 parsed from the release notes. The values below are only the fallback.

| Variable | What | Default today |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production origin (canonical, OG, sitemap, robots, llms.txt) | Vercel production domain, else `https://vermut.example` |
| `NEXT_PUBLIC_GITHUB_URL` | App source repo | `https://github.com/Contessafry/Vermut` |
| `NEXT_PUBLIC_VERSION` | Fallback version | `1.0.0` |
| `NEXT_PUBLIC_DMG_NAME` / `NEXT_PUBLIC_DOWNLOAD_URL` | Fallback DMG name / URL | `Vermut-1.0.0.dmg` / v1.0.0 asset |
| `NEXT_PUBLIC_DMG_SIZE_BYTES` / `NEXT_PUBLIC_DMG_SHA256` | Fallback size / checksum | v1.0.0 values |
| `NEXT_PUBLIC_NOTARIZED` | `true` hides the Gatekeeper first-launch steps | `false` |
| `NEXT_PUBLIC_BREW_CASK` | Homebrew cask token; shows `brew install --cask …` | empty (hidden) |
| `NEXT_PUBLIC_INSTALL_SCRIPT_URL` | One-line installer script | `raw.githubusercontent.com/Contessafry/Vermut/main/install.sh` |
| `NEXT_PUBLIC_DONATE_PAYPAL_URL` | PayPal donate link for the Support section (new tab); also JSON-LD DonateAction and llms.txt | `https://www.paypal.me/contessafry` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console token | empty |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster token (`msvalidate.01`) | empty |

See `.env.example`.

Each release should attach one `.dmg` and put `SHA-256 (<name>.dmg): <hash>` in its notes.

## Deploy on Vercel

1. Push this folder to a Git repository (GitHub, GitLab or Bitbucket).
2. In Vercel, choose **Add New → Project**, import the repo, and keep framework **Next.js**, root `./`,
   build `next build` and output auto. `video/` is excluded by `.vercelignore` and `tsconfig.json`.
3. Under **Settings → Environment Variables**, add the variables above for Production (and Preview).
4. Deploy. Add the custom domain under **Settings → Domains**, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy.
5. Check `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/.well-known/security.txt`, `/opengraph-image.png`, and a share preview (for example
   opengraph.xyz), and run Lighthouse on the production URL.

Any static-capable Node host works too: run `npm run build && npm start`.
`next.config.ts` sets long-cache headers for `/videos` and `/brand` and basic security headers.

## Structure

```
app/            layout (fonts, metadata, JSON-LD), page, sitemap, robots, manifest, icons, OG image
components/     hero, site-header, how-it-works, step-video (client), compatibility,
                comparison, faq, site-footer, section-heading, rich-text, icons, ui/ (shadcn)
lib/content.ts  all copy, typed
site.config.ts  placeholders and known facts (min macOS 14.0 from Package.swift / Info.plist)
assets/screens/ hero screenshot (real app, optimised by next/image to AVIF/WebP)
public/videos/  step-{1,2,3}.{mp4,webm} and posters
public/brand/   SVG lockups
video/          Remotion template and flows
docs/           LANDING-SPEC.md
```

## Licence

MIT, same as Vermut.
