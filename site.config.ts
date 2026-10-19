/**
 * The ONLY place with values we don't know yet.
 * Every value can be overridden with an environment variable on Vercel
 * (Project → Settings → Environment Variables), so no code change is needed
 * once the repo and the first release exist.
 *
 * Search the codebase for `PLACEHOLDER` before launch.
 */

const env = (key: string) => process.env[key]?.trim() || undefined;

/** PLACEHOLDER: public GitHub repository (no trailing slash). */
const githubUrl = env("NEXT_PUBLIC_GITHUB_URL") ?? "https://github.com/PLACEHOLDER/vermut";

/**
 * Release / download details. All optional env vars; anything unknown stays
 * hidden on the page instead of showing an invented value.
 */
const dmgName = env("NEXT_PUBLIC_DMG_NAME") ?? "Vermut.dmg"; // PLACEHOLDER: release asset name
const dmgUrl = env("NEXT_PUBLIC_DOWNLOAD_URL") ?? `${githubUrl}/releases/latest/download/${dmgName}`;

export const release = {
  dmgName,
  dmgUrl,
  /** PLACEHOLDER: e.g. "48 MB". Hidden when empty. */
  dmgSize: env("NEXT_PUBLIC_DMG_SIZE") ?? "",
  /** SHA-256 checksum file published next to the DMG. Hidden when "off". */
  checksumUrl:
    env("NEXT_PUBLIC_CHECKSUM_URL") === "off"
      ? ""
      : (env("NEXT_PUBLIC_CHECKSUM_URL") ?? `${githubUrl}/releases/latest/download/${dmgName}.sha256`),
  releasesUrl: `${githubUrl}/releases`,
  /** PLACEHOLDER: true once releases are signed + notarized (build.sh has no notarization step today). */
  notarized: env("NEXT_PUBLIC_NOTARIZED") === "true",
  /** PLACEHOLDER: Homebrew cask token, e.g. "vermut". Line hidden when empty. */
  brewCask: env("NEXT_PUBLIC_BREW_CASK") ?? "",
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

  /** Direct .dmg link (see `release` below). */
  downloadUrl: release.dmgUrl,

  /** PLACEHOLDER: public release version (the app bundle currently says 1.0.0). */
  version: env("NEXT_PUBLIC_VERSION") ?? "1.0.0",

  /** Known facts (from Package.swift / build.sh Info.plist and LICENSE). */
  minMacOS: "14.0",
  minMacOSName: "Sonoma",
  license: "MIT",
  brandAssets: "/brand/vermut-brand-assets.zip",
} as const;

export const links = {
  github: site.githubUrl,
  download: release.dmgUrl,
  downloadSection: "#download",
  releases: `${site.githubUrl}/releases`,
  issues: `${site.githubUrl}/issues`,
  newIssue: `${site.githubUrl}/issues/new`,
  contributing: `${site.githubUrl}/blob/main/CONTRIBUTING.md`,
  license: `${site.githubUrl}/blob/main/LICENSE`,
} as const;

/** True while any public placeholder is still in use (shown in README check). */
export const hasPlaceholders = [site.url, site.githubUrl].some(
  (v) => v.includes("PLACEHOLDER") || v.includes("vermut.example"),
);
