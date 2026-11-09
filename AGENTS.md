<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# vermut-landing

Production landing for Vermut. Next.js 16 App Router, static. Node `>=20.9`.
Spec: `docs/LANDING-SPEC.md`. Locale rationale: `docs/I18N.md`.

## Repo map

- `app/[locale]/` — pages. English is the internal `en` segment; `next.config.ts` rewrites `/` → `/en` and 308-redirects `/en` → `/`. Other locales live at `/<locale>/`. Guide slugs stay English: `/<slug>` (en) and `/<locale>/<slug>` (same rewrite/redirect).
- `lib/i18n/dictionaries/<locale>.ts` — landing copy. Seven locales: `en` (source of truth), `it`, `de`, `fr`, `es`, `ja`, `zh`. Non-English files are `Translation` objects run through `lib/i18n/build.ts`. **Array lengths must match English or the module throws and `npm run build` fails.**
- `lib/content.ts` — 10-line re-export of English for `llms.txt` / `llms-full.txt`. Do not edit copy here.
- `lib/guide-content/<locale>.ts` (`*-more.ts` for extra guides) — guide copy. Types, slugs, URL helpers: `lib/guides.ts`.
- `lib/i18n/config.ts` — locale list, `localePath`, hreflang.
- `site.config.ts` — values that are not words (URLs, version fallbacks, min macOS). Override with `NEXT_PUBLIC_*`.
- `components/` — RSC sections. Client: `step-video.tsx`, `copy-button.tsx`, `locale-suggest.tsx`, `attribution.tsx`.
- `video/` — separate Remotion project (`video/README.md`). Outside the web build (`tsconfig.json`, eslint, `.vercelignore`).

## Commands

```bash
npm install
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

`video/` is a separate package (`npm --prefix video …`). Do not run it for web-only work.

## Gate

`npm run build` is the real gate (static prerender of all locales; also runs `build()` so mismatched i18n arrays fail). `npm run lint` and `npm run typecheck` are the other checks.

`npm test` exists: `node --test` on `lib/download-core.test.ts` and `lib/download-store.test.ts` only (download URL/count helpers). There is no page, i18n, or UI test suite. Anything the build cannot catch must be stated as unverified, not claimed as tested.

## Easy to break

- Never translate product/store/tool names (Vermut, Steam, Epic Games, GOG Galaxy, Wine, DXMT, …) or **Pour. Click. Play.** (`hero.title` is English-only, inherited via `build()`; the H1 is `lang="en"`). App UI labels (Stores, Library, Play, Run .exe, Danger zone) stay English; the app is English-only.
- Change English first (`dictionaries/en.ts` or `guide-content/en.ts`). Keep facts identical across locales. A translated list of a different length fails the build.
