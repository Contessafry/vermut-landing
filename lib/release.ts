import { cacheLife } from "next/cache";
import { release as cfg } from "@/site.config";

export type Release = {
  version: string;
  tag: string;
  dmgName: string;
  dmgUrl: string;
  sizeBytes: number;
  /** "1.9 MB" (MiB, one decimal). */
  sizeLabel: string;
  sha256: string | null;
  notesUrl: string;
  source: "github" | "fallback";
};

const sizeLabel = (b: number) => `${(b / 1048576).toFixed(1)} MB`;
const SHA = /\b[a-f0-9]{64}\b/i;

function fallback(): Release {
  const f = cfg.fallback;
  return {
    ...f,
    sizeLabel: sizeLabel(f.sizeBytes),
    notesUrl: `${cfg.releasesUrl}/tag/${f.tag}`,
    source: "fallback",
  };
}

type GhAsset = { name: string; size: number; browser_download_url: string };
type GhRelease = { tag_name: string; html_url: string; body?: string | null; assets: GhAsset[] };

/**
 * Latest GitHub release, read on the server at build time and revalidated
 * hourly (ISR). Never fetched on the client. Falls back to site.config.ts.
 */
export async function getRelease(): Promise<Release> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 3600, expire: 86400 });
  try {
    const res = await fetch(cfg.apiUrl, {
      headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return fallback();
    const r = (await res.json()) as GhRelease;
    const dmg = r.assets?.find((a) => a.name.toLowerCase().endsWith(".dmg"));
    if (!dmg) return fallback();
    const body = r.body ?? "";
    // Prefer a hash on a line naming this asset ("SHA-256 (Vermut-1.0.0.dmg): …"), else the first one.
    const line = body.split(/\r?\n/).find((l) => l.includes(dmg.name) && SHA.test(l));
    const sha = (line ?? body).match(SHA)?.[0]?.toLowerCase() ?? null;
    return {
      version: r.tag_name.replace(/^v/, ""),
      tag: r.tag_name,
      dmgName: dmg.name,
      dmgUrl: dmg.browser_download_url,
      sizeBytes: dmg.size,
      sizeLabel: sizeLabel(dmg.size),
      sha256: sha,
      notesUrl: r.html_url,
      source: "github",
    };
  } catch {
    return fallback();
  }
}
