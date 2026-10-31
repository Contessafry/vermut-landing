# vermut-landing

The production landing page for **Vermut**, the free, open-source macOS app that installs
Steam and GOG Galaxy, adds Epic Games (beta, via Legendary) and sets up Wine for each.
*Pour. Click. Play.*

- Next.js 16 App Router, fully static: every section is a React Server Component. The only client
  component is `components/step-video.tsx`, which handles play-on-visible, pause and reduced motion.
- Tailwind CSS v4 with shadcn/ui (Button, Badge, Table), using Vermut tokens v2 verbatim in `app/globals.css`.
- next/font (local, subset WOFF2): Bricolage Grotesque display, Hanken Grotesk text, JetBrains Mono.
- Landing copy is typed data in `lib/i18n/dictionaries/<locale>.ts` (seven locales); guides live in `lib/guide-content/`. `lib/content.ts` re-exports English for llms.txt. Unknown values live only in `site.config.ts`.
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
| `NEXT_PUBLIC_SITE_URL` | Production origin (canonical, OG, sitemap, robots, llms.txt) | `VERCEL_PROJECT_PRODUCTION_URL`, else `http://localhost:3000` (local only; production HTML uses `https://vermut.vercel.app`) |
| `NEXT_PUBLIC_GITHUB_URL` | App source repo | `https://github.com/Contessafry/Vermut` |
| `NEXT_PUBLIC_VERSION` | Fallback version | `1.1.2` |
| `NEXT_PUBLIC_DMG_NAME` / `NEXT_PUBLIC_DOWNLOAD_URL` | Fallback DMG name / URL | `Vermut-1.1.2.dmg` / `releases/latest` |
| `NEXT_PUBLIC_DMG_SIZE_BYTES` / `NEXT_PUBLIC_DMG_SHA256` | Fallback size / checksum | v1.1.2 values |
| `NEXT_PUBLIC_NOTARIZED` | `true` hides the Gatekeeper first-launch steps | `false` |
| `NEXT_PUBLIC_BREW_CASK` | Homebrew cask token; shows `brew install --cask …` | empty (hidden) |
| `NEXT_PUBLIC_INSTALL_SCRIPT_URL` | One-line installer script | `raw.githubusercontent.com/Contessafry/Vermut/main/install.sh` |
| `NEXT_PUBLIC_DONATE_PAYPAL_URL` | PayPal donate link for the Support section (new tab); also JSON-LD DonateAction and llms.txt | `https://www.paypal.me/contessafry` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console token | empty |
| `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Bing Webmaster token (`msvalidate.01`) | empty |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob read/write token for download click counts (auto-set when a Blob store is connected) | empty (counting skipped; downloads still redirect) |
| `BLOB_STORE_ID` | Blob store id (auto-set on Vercel when the store is connected; used with OIDC) | empty |
| `BLOB_ACCESS` | `private` (default) or `public`, matching how the Blob store was created | `private` |
| `DOWNLOAD_STATS_SECRET` | Shared secret for `GET /api/download-stats` | empty (endpoint 404s) |

See `.env.example`.

### Download click counts (Vercel Blob)

Counted download buttons go through `/api/download?channel=stable|releases`, which 302s to the GitHub DMG or the releases page. The count runs in `after()` after the 302 is sent (it does not delay the download). Each isolate flush writes **one new object** at `download-counts/YYYY-MM-DD/<batchId>.json` — no shared file, no etag. The batch id is generated once so a retry overwrites the same object and cannot double-count. The whole `after()` drain shares one 20s deadline for every flush, retry, and prune (under the route `maxDuration` of 30s); leftover events under 10ms remaining wait for a later request. Prune runs at most once per isolate per UTC day: one folded `list` of `download-counts/` finds every day that exists (including traffic holes), then expired days and leftover `download-counts/<date>.json` objects are deleted (delete is free). A hung prune is aborted by the wave signal and retried the next UTC day; it never blocks the count. `/api/download-stats` uses one 10s deadline for all 7 days (route `maxDuration` 15s) and returns an error if it expires, never an empty day. Hung `put`/`get`/`list` are aborted via `AbortSignal`. First-touch `utm_source` / `utm_medium` / `utm_campaign` / `gclid` (presence only) live in `sessionStorage` on the client; the route only receives a short English source label.

One-time setup on Vercel:

1. Project → Storage → Create / connect a **Blob** store (Hobby 1 GB included). Production and Preview; add Development if you want local counts via `vercel env pull`.
2. Redeploy so `BLOB_READ_WRITE_TOKEN` (and `BLOB_STORE_ID`) are present. Do not commit the token.
3. Add `DOWNLOAD_STATS_SECRET` (a long random string) and redeploy if you want to read counts.

Read today's and the last 7 days' totals (header only — do not put the secret in the URL, it ends up in logs):

```bash
curl -sS -H "Authorization: Bearer $DOWNLOAD_STATS_SECRET" https://<your-domain>/api/download-stats
# or: -H "x-download-stats-key: $DOWNLOAD_STATS_SECRET"
```

Deployments with Vercel Authentication need the protection-bypass header as well. If Blob is not configured, `/api/download` still redirects and counting is skipped.

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
lib/i18n/       landing copy per locale; lib/content.ts re-exports English for llms.txt
site.config.ts  placeholders and known facts (min macOS 14.0 from Package.swift / Info.plist)
assets/screens/ hero screenshot (real app, optimised by next/image to AVIF/WebP)
public/videos/  step-{1,2,3}.{mp4,webm} and posters
public/brand/   SVG lockups
video/          Remotion template and flows
docs/           LANDING-SPEC.md
```

## Licence

MIT, same as Vermut.
