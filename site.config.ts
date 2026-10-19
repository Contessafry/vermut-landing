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

  /** PLACEHOLDER: direct .dmg link or the latest-release page. */
  downloadUrl: env("NEXT_PUBLIC_DOWNLOAD_URL") ?? `${githubUrl}/releases/latest`,

  /** PLACEHOLDER: public release version (the app bundle currently says 1.0.0). */
  version: env("NEXT_PUBLIC_VERSION") ?? "1.0.0",

  /** Known facts (from Package.swift / build.sh Info.plist and LICENSE). */
  minMacOS: "14.0",
  minMacOSName: "Sonoma",
  license: "MIT",
} as const;

export const links = {
  github: site.githubUrl,
  download: site.downloadUrl,
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
