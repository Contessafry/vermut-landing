# vermut-landing

The production landing page for **Vermut**, the free, open-source macOS app that installs
Steam, Epic Games Store and GOG Galaxy and sets up Wine for each.
*Pour. Click. Play.*

- Next.js 16 App Router, fully static: every section is a React Server Component. The only client
  component is `components/step-video.tsx`, which handles play-on-visible, pause and reduced motion.
- Tailwind CSS v4 with shadcn/ui (Button, Badge, Table), using Vermut tokens v2 verbatim in `app/globals.css`.
- next/font (local, subset WOFF2): Bricolage Grotesque display, Hanken Grotesk text, JetBrains Mono.
- All copy is typed data in `lib/content.ts`. Unknown values live only in `site.config.ts`.
- Spec and documentation: `docs/LANDING-SPEC.md`.
- Videos: Remotion project in `video/` (see `video/README.md`). It is not part of the web build.

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

| Variable | What | Default today |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Production origin, used for canonical, OG, sitemap and robots | Vercel production domain, else `https://vermut.example` |
| `NEXT_PUBLIC_GITHUB_URL` | Public repo URL | `https://github.com/PLACEHOLDER/vermut` |
| `NEXT_PUBLIC_DOWNLOAD_URL` | `.dmg` link or latest-release page | `${GITHUB_URL}/releases/latest` |
| `NEXT_PUBLIC_VERSION` | Public release version | `1.0.0` |

Also re-record the three videos from the revised app (`video/README.md`).

## Deploy on Vercel

1. Push this folder to a Git repository (GitHub, GitLab or Bitbucket).
2. In Vercel, choose **Add New → Project**, import the repo, and keep framework **Next.js**, root `./`,
   build `next build` and output auto. `video/` is excluded by `.vercelignore` and `tsconfig.json`.
3. Under **Settings → Environment Variables**, add the four variables above for Production (and Preview).
4. Deploy. Add the custom domain under **Settings → Domains**, then set `NEXT_PUBLIC_SITE_URL` to it and redeploy.
5. Check `/robots.txt`, `/sitemap.xml`, `/opengraph-image.png`, and a share preview (for example
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
