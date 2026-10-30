import { timingSafeEqual } from "node:crypto";
import { connection, NextResponse } from "next/server";
import { isBlobConfigured, readStats } from "@/lib/download-store";

function secretsEqual(provided: string, expected: string): boolean {
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function providedSecret(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (header && /^bearer\s+/i.test(header)) {
    const token = header.replace(/^bearer\s+/i, "").trim();
    if (token) return token;
  }
  const alt = request.headers.get("x-download-stats-key")?.trim();
  return alt || null;
}

/**
 * Today's counts and the last 7 UTC days, as JSON. Guarded by DOWNLOAD_STATS_SECRET.
 * Unconfigured secret → 404 (the endpoint does not advertise itself).
 * No date query: out-of-retention and invalid-date cases are not reachable here.
 * They are handled by readCountedDay() for the later range-query PR.
 */
export async function GET(request: Request) {
  await connection();
  const expected = process.env.DOWNLOAD_STATS_SECRET?.trim();
  if (!expected) {
    return new NextResponse(null, { status: 404 });
  }
  const provided = providedSecret(request);
  if (!provided || !secretsEqual(provided, expected)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  }
  if (!isBlobConfigured()) {
    return NextResponse.json(
      { error: "blob_unconfigured" },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }
  try {
    const stats = await readStats();
    return NextResponse.json(stats, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json(
      { error: "blob_unavailable" },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}
