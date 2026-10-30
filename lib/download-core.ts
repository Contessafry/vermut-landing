/**
 * Pure download-attribution helpers. No Next, no Blob, no I/O — safe to unit-test
 * and to import from the client (first-touch capture) and the server (route).
 *
 * Source labels are English keys, not copy. Nothing here stores IP, UA, cookies,
 * or a full referrer URL.
 */

export const DOWNLOAD_CHANNELS = ["stable", "releases"] as const;
export type DownloadChannel = (typeof DOWNLOAD_CHANNELS)[number];

export const STORAGE_KEY = "vermut-src";

const SOURCE_MAX = 80;
const PATH_MAX = 120;
const TOKEN_MAX = 32;
const HOST_MAX = 64;

/** Known referring hosts → short English labels. Longer suffixes first. */
const HOST_LABELS: readonly [string, string][] = [
  ["news.ycombinator.com", "hacker-news"],
  ["producthunt.com", "producthunt"],
  ["duckduckgo.com", "duckduckgo"],
  ["facebook.com", "facebook"],
  ["instagram.com", "instagram"],
  ["linkedin.com", "linkedin"],
  ["youtube.com", "youtube"],
  ["github.com", "github"],
  ["reddit.com", "reddit"],
  ["twitter.com", "x"],
  ["google.", "google"], // google.com, google.co.uk, www.google.it, …
  ["bing.com", "bing"],
  ["yandex.", "yandex"],
  ["baidu.com", "baidu"],
  ["yahoo.com", "yahoo"],
  ["t.co", "x"],
  ["x.com", "x"],
];

const TOKEN = /^[a-z0-9._-]{1,32}$/;
const SOURCE = /^[a-z0-9._:/-]{1,80}$/;
const PATH = /^\/[-a-zA-Z0-9/_]*$/;

export function parseChannel(raw: string | null | undefined): DownloadChannel {
  return raw?.trim().toLowerCase() === "releases" ? "releases" : "stable";
}

/** First-party counted href. `src` is added by the client from sessionStorage. */
export function downloadHref(channel: DownloadChannel, path: string): string {
  const q = new URLSearchParams({ channel, path: sanitizePath(path) });
  return `/api/download?${q}`;
}

export function sanitizeToken(raw: string | null | undefined): string {
  if (!raw) return "";
  const t = raw.trim().toLowerCase().slice(0, TOKEN_MAX);
  return TOKEN.test(t) ? t : "";
}

export function sanitizeSource(raw: string | null | undefined): string {
  if (!raw) return "unknown";
  const s = raw.trim().toLowerCase().slice(0, SOURCE_MAX);
  return SOURCE.test(s) ? s : "unknown";
}

export function sanitizePath(raw: string | null | undefined): string {
  if (!raw) return "/";
  let path = raw.trim();
  try {
    path = decodeURIComponent(path);
  } catch {
    return "other";
  }
  path = path.split("?")[0]?.split("#")[0] ?? "/";
  if (!path.startsWith("/")) path = `/${path}`;
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  if (path.length > PATH_MAX || !PATH.test(path)) return "other";
  return path || "/";
}

/**
 * First-touch label for this browser session. UTMs and gclid win over the
 * referring hostname. Same-site referrers and empty referrers are `direct`.
 * The gclid value itself is never stored — only the `google-ads` key.
 */
export function firstTouchLabel(input: { search: string; referrer: string; pageHost: string }): string {
  const q = input.search.startsWith("?") ? input.search.slice(1) : input.search;
  const p = new URLSearchParams(q);
  const source = sanitizeToken(p.get("utm_source"));
  const medium = sanitizeToken(p.get("utm_medium"));
  const campaign = sanitizeToken(p.get("utm_campaign"));
  if (source || medium || campaign) {
    return `utm:${[source, medium, campaign].filter(Boolean).join("/")}`;
  }
  if (p.get("gclid")?.trim()) return "google-ads";
  return referrerLabel(input.referrer, input.pageHost);
}

export function referrerLabel(referrer: string, pageHost: string): string {
  const raw = referrer.trim();
  if (!raw) return "direct";
  let host: string;
  try {
    host = new URL(raw).hostname.toLowerCase();
  } catch {
    return "direct";
  }
  if (!host || host.length > HOST_MAX) return "direct";
  const page = pageHost.toLowerCase().replace(/^www\./, "");
  const stripped = host.replace(/^www\./, "");
  if (stripped === page) return "direct";
  for (const [match, label] of HOST_LABELS) {
    if (match.endsWith(".")) {
      if (stripped === match.slice(0, -1) || stripped.startsWith(match) || stripped.includes(`.${match}`)) {
        return label;
      }
      continue;
    }
    if (stripped === match || stripped.endsWith(`.${match}`)) return label;
  }
  if (/^[a-z0-9.-]+$/.test(stripped)) return stripped.slice(0, HOST_MAX);
  return "other";
}

/**
 * Only https GitHub URLs under our own repo. Hostname must be exactly
 * `github.com` (case-insensitive; WHATWG normalises it). Rejected: any
 * backslash (literal or `%5c`), username/password, explicit port other than
 * the default HTTPS port, query string, hash. Port `:443` is allowed because
 * it is the default HTTPS port — Node's URL parser already strips it, so
 * `https://github.com:443/…` and `https://github.com/…` compare equal.
 */
export function isSafeGithubRedirect(url: string, repoUrl: string): boolean {
  if (/\\|%5c/i.test(url)) return false;
  let target: URL;
  let repo: URL;
  try {
    target = new URL(url);
    repo = new URL(repoUrl);
  } catch {
    return false;
  }
  if (target.protocol !== "https:" || repo.protocol !== "https:") return false;
  if (target.username || target.password) return false;
  if (target.hostname.toLowerCase() !== "github.com") return false;
  if (repo.hostname.toLowerCase() !== "github.com") return false;
  if (target.port !== "" && target.port !== "443") return false;
  if (target.search !== "" || target.hash !== "") return false;
  if (/\\|%5c/i.test(target.pathname) || /\\|%5c/i.test(target.href)) return false;
  const repoPath = repo.pathname.replace(/\/+$/, "") || "/";
  const path = target.pathname.replace(/\/+$/, "") || "/";
  return path === repoPath || path.startsWith(`${repoPath}/`);
}
