# Vermut landing page: specification of the shipped site

Status: **shipped as code** in `vermut-landing/` (Next.js 16.4, React 19.3, Tailwind 4, shadcn/ui).
This document describes what is built and the rules for changing it. The source of truth for copy is
`lib/content.ts`. The source of truth for unknown values is `site.config.ts`.
Last updated 19 October 2026.

> **Videos re-recorded 19 Oct 2026** from 2x Retina screenshots of the revised app (build ec56b94); see video/README.md to re-record again.

---

## 1. Goals

1. A Mac gamer understands in 5 seconds what Vermut does: it puts Steam, Epic and GOG on an Apple Silicon Mac via Wine, free.
2. They see the real app working (hero screenshot plus 3 clips), not a promise.
3. They trust it, because the page is honest about what won't run (anti-cheat) and fair to alternatives, with cited sources.
4. They act: **Download** (primary) or **Star on GitHub** (secondary).

Non-goals: no newsletter, no pricing, no testimonials, no logo wall, no analytics script.

## 2. Audience

GitHub and Reddit Mac gamers (r/macgaming, r/macgaming wiki readers, Hacker News). They are technical, allergic to
marketing fluff, and know Whisky, CrossOver, Heroic, GPTK and anti-cheat. The tone is plain, specific and slightly dry.
No exclamation marks, no emoji, no superlatives. The claim "Pour. Click. Play." always stays in English.
The page uses no aperitivo imagery.

## 3. Page structure and copy

Order is fixed (approved by Francesco). The exact strings are in `lib/content.ts`, summarised here.

| # | Section (anchor) | Layout | Key copy |
|---|---|---|---|
| 0 | Header (inside hero) | Lockup left; nav right (How it works · Compatibility · Compare · FAQ) plus GitHub pill. On mobile the nav links are hidden and the GitHub pill stays. | |
| 1 | Hero `#top` | Full-bleed **brand red**. Text in cols 1–6, real screenshot in cols 7–12 bleeding off the right edge. On mobile the text comes first, then the screenshot bleeds right. | Eyebrow "Free · Open source · Apple Silicon"; H1 "Pour. / Click. / Play."; lead "Vermut installs Steam, Epic Games Store and GOG Galaxy on your Mac and sets up Wine for each one, so your Windows games launch with a click."; CTAs "Download for Mac" and "Star on GitHub"; meta "Version {v} · macOS 14 Sonoma or later · Apple Silicon · MIT licence" |
| 2 | How it works `#how-it-works` | Section header in cols 1–7. Three steps, each with text in cols 1–4 and the video in cols 5–12 (lg). Below lg they stack. | H2 "Three steps. No Terminal." 01 Pick a store · 02 Vermut sets up Wine · 03 Play |
| 3 | Compatibility `#compatibility` | zinc-100/70 band. Three cards: Usually runs / Needs extra setup / Won't run. | Anti-cheat named explicitly (Valorant, Fortnite, Call of Duty); GPTK is user-installed; links to areweanticheatyet.com and the CodeWeavers compatibility DB |
| 4 | Compare `#compare` | Table at md and up (Vermut column inked zinc-950). Below md it switches to one card per criterion. Then the fairness aside and numbered sources. | Rows: Price, Open source, Maintained, Sets up Steam/Epic/GOG, Wine engine, Works without Terminal, Support |
| 5 | FAQ `#faq` | zinc-100/70 band. Native `<details>` list in cols 1–7, dark Requirements card in cols 9–12 (sticky on lg). | 9 questions; requirements: Apple Silicon M1+, macOS 14 Sonoma+, 10 GB free plus games, Rosetta 2 (installed for you), internet |
| 6 | Footer | zinc-950. Lockup, one-line statement, claim, Download; Project and Contribute link columns; legal line plus version. | "Not affiliated with Valve, Epic Games, GOG, CodeWeavers or Apple…" |

### Fact sources

- **Minimum macOS 14.0.** From `Package.swift` (`.macOS(.v14)`) and `build.sh` Info.plist (`LSMinimumSystemVersion 14.0`).
- **Version 1.0.0.** From `CFBundleShortVersionString`. It is a placeholder for the public release.
- **Licence.** `LICENSE` is MIT.
- **Requirements.** From the README: 10 GB, and Rosetta 2 installed automatically.
- **Engines and backends.** From the README and the running app: Wine 11, DXMT, DXVK, WineD3D, and D3DMetal only when GPTK is detected.
- **Competitors** (checked 19 Oct 2026; also cited on the page):
  - [1] Whisky maintenance notice: https://docs.getwhisky.app/maintenance-notice (no Wine 8+, no game fixes)
  - [2] Whisky-App/Whisky repo, archived 9 April 2025, GPL-3.0: https://github.com/Whisky-App/Whisky. The community fork frankea/Whisky exists.
  - [3] CodeWeavers store, CrossOver+ $74 with 12 months of updates and support; CrossOver Life $494: https://www.codeweavers.com/store
  - [4] CrossOver licences explained (14-day trial, $34 renewal): https://www.codeweavers.com/blog/balfour/2025/10/9/dont-panic-how-crossover-licenses-work
  - [5] CrossOver 26 release, 10 Feb 2026: https://www.codeweavers.com/blog/mjohnson/2026/02/10/crossover-26-cures-artificial-incompatibility-with-windows-games-on-mac
  - [6] Heroic FAQ (Epic, GOG, Amazon; GPL-3.0; macOS 14+): https://heroicgameslauncher.com/faq
  - [7] Heroic releases (v2.22.4, 15 Oct 2026): https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/releases
  - [8] Heroic on Mac (Wine-Crossover, Wine-Staging, GPTK, CrossOver): https://github.com/Heroic-Games-Launcher/HeroicGamesLauncher/wiki/Using-Heroic-on-a-Mac-computer
  - [9] CrossOver installs Steam from its catalogue: https://www.codeweavers.com/blog/mjohnson/2023/3/8/three-game-clients-that-work-on-macos-with-crossover
  - [10] CrossOver 25 adds Epic and GOG support: https://www.codeweavers.com/blog/mjohnson/2025/3/11/experience-next-level-gaming-on-mac-with-crossover-25
- **Fairness rule.** The comparison must never claim an advantage that isn't true. "Works without Terminal" is **Yes for all four** and is kept because people ask. Re-check every competitor cell and its source before each release, and update the "checked" date.

## 4. Grid and layout

- Container: content max **1200 px**. Gutters **20 px** (< 768) and **32 px** (≥ 768). Utility: `container-page`.
- Grid: **4 columns** below 768 px, **12 columns** at 768 px and up. Column gap 16 / 24 px. Utility: `grid-page`.
- Everything is left-aligned. Nothing is centred except icon glyphs inside buttons.
- Section padding: 96 px (mobile) and 128 px (md+). Header height: 72 / 88 px.
- Bands alternate white → zinc-100/70 → white → zinc-100/70 → zinc-950 footer. Hero is brand red.

## 5. Type and spacing scale (marketing)

| Token | Use | Size | Line height | Font |
|---|---|---|---|---|
| `text-display` | H1 | clamp(68 px → 160 px) | 0.86 | Bricolage Grotesque 800, instanced opsz 96 / wdth 75 |
| `text-h2` | Section H2 | clamp(40 px → 68 px) | 0.95 | Bricolage 800 |
| step H3 | Step titles | 32 / 40 px | 1.0 | Bricolage 800 |
| `text-h3` | Card titles | 22 px | 1.25 | Hanken Grotesk 600 |
| `text-lead` | Leads | clamp(18 px → 22 px) | 1.5 | Hanken 400 |
| `text-body` | Body | 17 px | 1.6 | Hanken 400 |
| `text-eyebrow` | Eyebrows, meta | 13 px, uppercase, +0.08 em | 1.4 | JetBrains Mono |

- Measure: leads 60ch max, body 46–72ch.
- Spacing follows the 4/8 pt scale (Tailwind default). Heading → lead is 20 px, header → content is 56–80 px, and steps are 80 / 112 px apart.
- Fonts are self-hosted through `next/font/local` as Latin-subset WOFF2: Bricolage 29 KB, Hanken 30 KB, Mono 36 KB (mono is not preloaded). Each has a metric-adjusted fallback.

## 6. Colour

- Tokens v2 are pasted verbatim in `app/globals.css`, with zinc neutrals.
- **Brand red `#CE003E`** (`bg-brand`, `text-brand`) is allowed on marketing only: the hero band and the step numbers with their rule.
- Brand red is never used for buttons on white, for links, or for focus states.
- **Error red is never used** on this page. There are no error states.
- "Won't run" uses the neutral muted tone with a ban icon, not red.
- Status hues come from tokens: success-subtle-foreground (runs, yes), warning-subtle-foreground (needs setup), muted (no).
- Contrast: white on brand is 5.6:1. All text passes AA, and Lighthouse a11y scores 100.
- Light theme only (`color-scheme: light`). The app screenshots are dark, which gives the contrast against the page.

## 7. Breakpoints and mobile behaviour

These are the Tailwind defaults: sm 640, md 768, lg 1024, xl 1280.

| Area | < 768 | 768–1023 | ≥ 1024 |
|---|---|---|---|
| Header | Lockup and GitHub pill | Full nav | Full nav |
| Hero | Stacked; screenshot 118% wide, bleeding right, top corners rounded | Stacked | Two columns; screenshot bleeds to the viewport edge |
| Steps | Text, then video | Text, then video | Text in cols 1–4, video in cols 5–12 |
| Compatibility | 1 column of cards | 3 columns | 3 columns |
| Compare | One card per criterion (Vermut row highlighted) | Table | Table |
| FAQ | List, then requirements card | List, then requirements card | List in cols 1–7, sticky card in cols 9–12 |
| Footer | Stacked; link columns two-up | 6 + 3 + 3 | 5 + 2 + 2 |

## 8. Components

| Component | File | Type | Notes |
|---|---|---|---|
| Hero and SiteHeader | `components/hero.tsx`, `site-header.tsx` | RSC | The `next/image` hero has `fetchPriority="high"`, eager loading and AVIF/WebP |
| SectionHeading | `section-heading.tsx` | RSC | Eyebrow, H2 (`id="{section}-title"`) and lead |
| HowItWorks | `how-it-works.tsx` | RSC | `<ol>`; each step is a `<figure>` with a video |
| **StepVideo** | `step-video.tsx` | **Client** | The only client component (see §9) |
| Compatibility | `compatibility.tsx` | RSC | Lucide icons, all `aria-hidden` |
| Comparison | `comparison.tsx` | RSC | shadcn Table (its `"use client"` was removed; the markup is pure). Has a caption, `scope` and row headers |
| Faq | `faq.tsx` | RSC | Native `<details>`/`<summary>` with no JS. The requirements card is a `<dl>` |
| SiteFooter | `site-footer.tsx` | RSC | |
| RichText | `rich-text.tsx` | RSC | Renders typed inline copy |

Buttons are rounded-full pills, 52 px in the hero and 48 px in the footer. The primary is white on red; the secondary is a white outline.

## 9. Motion rules

- The page itself has no scroll animations, parallax or entrance effects. The motion is in the videos.
- Micro-interactions are colour transitions on hover (≈150 ms), the FAQ plus icon rotating 45°, and a 1 px press on the hero buttons.
- `prefers-reduced-motion: reduce` disables smooth scroll, CSS transitions and animations, and video autoplay.
- **StepVideo:**
  - `preload="none"`, `muted`, `loop`, `playsInline`.
  - An IntersectionObserver (threshold 0.4) plays the clip while it's visible and pauses it off-screen.
  - Under reduced motion it never autoplays and shows the poster.
  - A Pause/Play button (36 px, top-right, `aria-pressed`, labelled) is always visible, which meets WCAG 2.2.2.
  - If the user pauses, the clip doesn't resume until they press Play.

## 10. Video spec

| Property | Value |
|---|---|
| Canvas | 1600×1000 (16:10); the window is 1280×800 at about 1.07× inside 7% padding |
| Look | zinc-100→200 vertical gradient; 12 px window radius; soft two-layer shadow; 1 px ring |
| Cursor | macOS arrow at 1.35×, eased glide (bezier .65,0,.35,1) with a slight arc, 14% press dip |
| Click | White ripple 8→36 px over 0.55 s, fading out |
| Zoom | Spring (damping 200) in 0.9 s, hold, out 0.9 s. Scale 1.3–1.6, edges clamped so the window always fills the frame |
| Frame rate and length | 60 fps; 8 s, 8.5 s and 8 s. Seamless loop: cursor returns to rest and a 0.45 s crossfade goes back to frame 0 |
| Encodes | MP4 H.264 High, yuv420p, CRF 20, `+faststart`. WebM VP9 CRF 34. No audio track |
| Budget | ≤ 2.5 MB per file; actual 0.66–1.23 MB (enforced by `render-all.sh`) |
| Poster | Representative frame with no zoom. PNG master; 1200 px WebP on the site (15–23 KB) |
| Loading | Lazy (`preload="none"`); bytes load only when a clip first plays |
| Accessibility | `aria-label` plus `aria-describedby` pointing to a visually hidden description of what the clip shows. No audio, so no captions are needed. Pause control |

Flows, all from real screenshots:
1. **Pick a store.** On Stores, the pointer moves GOG → Epic → Steam and clicks Open Steam (zoom 1.6).
2. **Vermut sets up Wine.** It opens the Steam bottle, switches to the Graphics tab, and points at the DXMT backend (zoom 1.55).
3. **Play.** It opens the Library, passes the Mewgenics cover, and clicks Play (zoom 1.32).

## 11. Assets

| Asset | Path | Source |
|---|---|---|
| Hero screenshot | `assets/screens/library-dark.png` (1280×800, served as AVIF ≈ 9–25 KB) | `brandkit v2/review/real/dark-library.png` |
| Video shots | `video/public/shots/*.png` | `review/real/dark-stores, dark-bottle-steam-general, dark-bottle-steam-graphics, dark-library` |
| Clips and posters | `public/videos/step-{1,2,3}.{mp4,webm}`, `step-N-poster.webp` | Remotion |
| Lockups | `public/brand/vermut-lockup-{white,black}.svg` (SVGO, 12 KB) | `v2/logo/lockup/` |
| Favicons | `app/favicon.ico`, `app/icon.svg`, `app/apple-icon.png`, `public/icon-{192,512}.png` | `v2/logo/favicon/` |
| OG and Twitter | `app/opengraph-image.png`, `app/twitter-image.png` (1280×640) plus `.alt.txt` | `v2/marketing/github-social-1280x640.png` |

## 12. Performance budget, with values measured 19 Oct 2026

The measurements come from Lighthouse 12 on `next start`, locally.

| Metric | Budget | Mobile (simulated 4G) | Desktop |
|---|---|---|---|
| Performance score | ≥ 90 | **93–95** | **100** |
| LCP | ≤ 2.5 s (field) | 2.9–3.2 s simulated (observed 0.1 s); the LCP element is the hero image | 0.7 s |
| CLS | ≤ 0.05 | **0** | **0** |
| TBT | ≤ 200 ms | 50 ms | 0 ms |
| JS (transfer) | ≤ 170 KB | ≈ 155 KB (React and Next runtime, plus the ~3 KB StepVideo) | same |
| CSS | ≤ 20 KB | 11 KB | |
| Fonts preloaded | ≤ 70 KB | 59 KB | |
| Initial page weight | ≤ 500 KB | 403 KB (videos excluded; they lazy-load) | |

All routes are static (○), and the build has no dynamic APIs. If the mobile LCP misses its budget in field data,
first try a smaller mobile crop of the hero screenshot.

## 13. Accessibility (WCAG 2.2 AA)

- **Structure and keyboard.**
  - There is one H1, and sections are labelled by their H2 ids.
  - A "Skip to content" link targets `#main`.
  - Landmarks are header, nav ×3 (Primary, Project, Contribute), main and footer.
- **Focus.** The focus ring is 2 px solid foreground with a 3 px offset (white on the brand band), and is visible on every link, button and summary.
- **Contrast.** All text passes AA, and non-text icons are 3:1 or better. Lighthouse a11y scores 100.
- **Video.** See §9 and §10: the clips are labelled and described, have a pause control, and respect reduced motion.
- **Table.** It has a caption (sr-only), `scope="col"` and `scope="row"`, and icons are paired with text, so meaning never relies on colour alone.
- **Images.** The hero alt text describes the screen. Decorative SVGs are `aria-hidden`.
- **Targets.** Interactive elements are at least 36 px, which exceeds the WCAG 2.5.8 minimum of 24 px.

## 14. SEO and sharing

- **Metadata.**
  - `metadataBase = site.url`; canonical is `/`.
  - Title: "Vermut: Steam, Epic Games and GOG on your Mac".
  - Description: ≤ 160 characters, mentioning Apple Silicon and Wine.
- **Open Graph and Twitter.** `summary_large_image` uses `opengraph-image.png` and `twitter-image.png` (the GitHub social card).
- **Structured data.** JSON-LD `SoftwareApplication` with price 0, MIT licence, OS macOS 14+ on Apple Silicon, version, downloadUrl and codeRepository.
- **Other routes.** `sitemap.xml`, `robots.txt` (allow all, sitemap link) and `manifest.webmanifest`. Theme colour is `#CE003E`.
- **Lighthouse.** SEO scores 100 and best practices 100.

## 15. Placeholders

These are the only values we don't know. All of them are in `site.config.ts` and can be overridden with environment variables.

| Key | Env | Current |
|---|---|---|
| Site URL | `NEXT_PUBLIC_SITE_URL` (falls back to `VERCEL_PROJECT_PRODUCTION_URL`) | `https://vermut.example` |
| GitHub URL | `NEXT_PUBLIC_GITHUB_URL` | `https://github.com/Contessafry/Vermut` |
| Download URL | `NEXT_PUBLIC_DOWNLOAD_URL` | `{github}/releases/latest` |
| Version | `NEXT_PUBLIC_VERSION` | `1.1.0` (latest release fallback; live value from the GitHub API) |

## 16. Review checklist (run before every release)

- [ ] Placeholders filled (`rg PLACEHOLDER`, and `vermut.example` no longer appears in the built HTML).
- [ ] Videos and hero screenshot re-captured from the **revised** app: no Fortnite copy, no "grapple-wine", no CaskLauncher path.
- [ ] Version, min macOS and requirements match `Package.swift`, Info.plist and README.
- [ ] Competitor cells re-verified against sources [1]–[10]; "checked" date updated in `content.ts`.
- [ ] Compatibility examples still correct (check areweanticheatyet.com).
- [ ] `npm run lint && npm run typecheck && npm run build` are clean, and every route is static.
- [ ] Lighthouse mobile ≥ 90 performance and 100 for a11y, best practices and SEO; desktop 100.
- [ ] Keyboard pass: skip link, nav, both CTAs, every FAQ item, the video pause buttons, footer links.
- [ ] Reduced motion: no autoplay, posters visible, Play works.
- [ ] 390 px and 1440 px full-page screenshots reviewed: no horizontal scroll except intentional bleed, no orphaned words in H2s.
- [ ] Brand red only on the hero and step numbers. No error red anywhere.
- [ ] No purple gradients, glassmorphism, emoji, centred-everything or fake logo walls.
- [ ] Every clip is ≤ 2.5 MB, and MP4s are faststart.
- [ ] The OG image renders in a share preview.
