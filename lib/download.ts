import { getRelease } from "@/lib/release";
import { release, site } from "@/site.config";
import { isSafeGithubRedirect, type DownloadChannel } from "./download-core";

export { downloadHref, parseChannel, sanitizePath, sanitizeSource, type DownloadChannel } from "./download-core";

const HARDCODED_LATEST = "https://github.com/Contessafry/Vermut/releases/latest";

/**
 * Server-side destination for a counted channel. The URL never comes from the
 * query string: latest DMG from lib/release.ts (GitHub API, cached), or the
 * releases index from site.config.ts. Anything that is not our GitHub repo is
 * rejected and replaced with a hardcoded fallback.
 */
export async function destinationFor(channel: DownloadChannel): Promise<string> {
  let candidate: string;
  if (channel === "releases") {
    candidate = release.releasesUrl;
  } else {
    try {
      candidate = (await getRelease()).dmgUrl;
    } catch {
      candidate = release.fallback.dmgUrl;
    }
  }
  if (isSafeGithubRedirect(candidate, site.githubUrl)) return candidate;
  if (isSafeGithubRedirect(release.releasesUrl, site.githubUrl)) return release.releasesUrl;
  return HARDCODED_LATEST;
}
