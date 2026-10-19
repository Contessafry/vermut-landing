/**
 * The ONLY place with values we don't know yet.
 * Every value can be overridden with an environment variable on Vercel
 * (Project → Settings → Environment Variables), so no code change is needed
 * once the repo and the first release exist.
 *
 * Search the codebase for `PLACEHOLDER` before launch.
 */

const env = (key: string) => process.env[key]?.trim() || undefined;

/** App source repository (no trailing slash). */
const githubUrl = env("NEXT_PUBLIC_GITHUB_URL") ?? "https://github.com/Contessafry/Vermut";
const repoSlug = githubUrl.replace(/^https:\/\/github\.com\//, "");

/**
 * Release / download details. `lib/release.ts` reads the latest GitHub release
 * at build time (revalidated hourly); these values are the fallback when the
 * API is unreachable. Facts from release v1.0.0 (19 Oct 2026).
 */
export const release = {
  repoSlug,
  apiUrl: `https://api.github.com/repos/${repoSlug}/releases/latest`,
  releasesUrl: `${githubUrl}/releases`,
  fallback: {
    version: env("NEXT_PUBLIC_VERSION") ?? "1.0.0",
    tag: "v1.0.0",
    dmgName: env("NEXT_PUBLIC_DMG_NAME") ?? "Vermut-1.0.0.dmg",
    dmgUrl: env("NEXT_PUBLIC_DOWNLOAD_URL") ?? `${githubUrl}/releases/download/v1.0.0/Vermut-1.0.0.dmg`,
    sizeBytes: Number(env("NEXT_PUBLIC_DMG_SIZE_BYTES") ?? 1987245),
    sha256: env("NEXT_PUBLIC_DMG_SHA256") ?? "d854610fe444b76ad24fa55ee1c392464ec2e46705a2f384814dc33fa8e3d279",
  },
  /** Releases are unsigned and not notarized today, so Gatekeeper steps are shown. */
  notarized: env("NEXT_PUBLIC_NOTARIZED") === "true",
  /** Homebrew cask token; the brew line is hidden while empty (no cask exists). */
  brewCask: env("NEXT_PUBLIC_BREW_CASK") ?? "",
  /** One-line Terminal installer (secondary option). Empty URL hides it. */
  installer: {
    scriptUrl: env("NEXT_PUBLIC_INSTALL_SCRIPT_URL") ?? `https://raw.githubusercontent.com/${repoSlug}/main/install.sh`,
    sourceUrl: `${githubUrl}/blob/main/install.sh`,
  },
} as const;

/** Search engine verification tokens (metadata.verification). Omitted when empty. */
export const verification = {
  google: env("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),
  bing: env("NEXT_PUBLIC_BING_SITE_VERIFICATION"),
} as const;

/** Date the page content was last reviewed (sitemap lastModified, llms.txt). */
export const contentUpdated = "2026-10-19";


export const site = {
  name: "Vermut",
  tagline: "Pour. Click. Play.",

  /**
   * PLACEHOLDER: production origin. Falls back to Vercel's production domain,
   * then to a dummy origin so local builds still work.
   */
  url:
    env("NEXT_PUBLIC_SITE_URL") ??
    (env("VERCEL_PROJECT_PRODUCTION_URL")
      ? `https://${env("VERCEL_PROJECT_PRODUCTION_URL")}`
      : "https://vermut.example"),

  githubUrl,

  /** Fallback DMG link; the page uses lib/release.ts (latest GitHub release). */
  downloadUrl: release.fallback.dmgUrl,

  /** Public release version (fallback; the Download section shows the live tag). */
  version: release.fallback.version,

  /** Known facts (from Package.swift / build.sh Info.plist and LICENSE). */
  minMacOS: "14.0",
  minMacOSName: "Sonoma",
  license: "MIT",
  brandAssets: "/brand/vermut-brand-assets.zip",
} as const;

export const links = {
  github: site.githubUrl,
  download: release.fallback.dmgUrl,
  downloadSection: "#download",
  releases: `${site.githubUrl}/releases`,
  issues: `${site.githubUrl}/issues`,
  newIssue: `${site.githubUrl}/issues/new`,
  contributing: `${site.githubUrl}/blob/main/CONTRIBUTING.md`,
  license: `${site.githubUrl}/blob/main/LICENSE`,
} as const;

/** True while any public placeholder is still in use (shown in README check). */
export const hasPlaceholders = [site.url].some(
  (v) => v.includes("PLACEHOLDER") || v.includes("vermut.example"),
);
