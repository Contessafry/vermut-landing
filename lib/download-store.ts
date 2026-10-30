/**
 * Daily download counters in Vercel Blob. One JSON object per UTC day, updated
 * in place (allowOverwrite) so a click is never a new file. Isolate-local
 * queue coalesces concurrent clicks into a single read-modify-write.
 *
 * If Blob is not configured, recordDownloadClick() no-ops after one warning.
 * The download redirect must not depend on this module succeeding.
 */
import { BlobAccessError, get, put } from "@vercel/blob";
import type { DownloadChannel } from "./download-core";

export type ClickEvent = {
  channel: DownloadChannel;
  source: string;
  path: string;
};

export type DayCounts = {
  date: string;
  updatedAt: string;
  total: number;
  channels: Record<string, number>;
  sources: Record<string, number>;
  paths: Record<string, number>;
};

const PREFIX = "download-counts";
const KEY_CAP = 200;
const LOOKBACK_DAYS = 7;

type Access = "public" | "private";

let access: Access = process.env.BLOB_ACCESS === "public" ? "public" : "private";
let accessLocked = process.env.BLOB_ACCESS === "public" || process.env.BLOB_ACCESS === "private";
let warnedMissing = false;

let queue: ClickEvent[] = [];
let draining: Promise<void> | null = null;

const pathnameFor = (date: string) => `${PREFIX}/${date}.json`;

export const utcDate = (ms = Date.now()) => new Date(ms).toISOString().slice(0, 10);

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

function warnOnce(message: string) {
  if (warnedMissing) return;
  warnedMissing = true;
  console.warn(message);
}

function emptyDay(date: string): DayCounts {
  return { date, updatedAt: new Date().toISOString(), total: 0, channels: {}, sources: {}, paths: {} };
}

function bump(map: Record<string, number>, key: string) {
  if (map[key] != null) {
    map[key] += 1;
    return;
  }
  if (Object.keys(map).length >= KEY_CAP) {
    map.other = (map.other ?? 0) + 1;
    return;
  }
  map[key] = 1;
}

function apply(day: DayCounts, events: ClickEvent[]): DayCounts {
  const next: DayCounts = {
    date: day.date,
    updatedAt: new Date().toISOString(),
    total: day.total,
    channels: { ...day.channels },
    sources: { ...day.sources },
    paths: { ...day.paths },
  };
  for (const e of events) {
    next.total += 1;
    bump(next.channels, e.channel);
    bump(next.sources, e.source);
    bump(next.paths, e.path);
  }
  return next;
}

function parseDay(text: string, date: string): DayCounts {
  try {
    const raw = JSON.parse(text) as Partial<DayCounts>;
    if (!raw || typeof raw !== "object") return emptyDay(date);
    const numMap = (v: unknown): Record<string, number> => {
      if (!v || typeof v !== "object") return {};
      const out: Record<string, number> = {};
      for (const [k, n] of Object.entries(v as Record<string, unknown>)) {
        if (typeof n === "number" && Number.isFinite(n) && n >= 0) out[k] = Math.floor(n);
      }
      return out;
    };
    const channels = numMap(raw.channels);
    const sources = numMap(raw.sources);
    const paths = numMap(raw.paths);
    const summed = Object.values(channels).reduce((a, b) => a + b, 0);
    return {
      date,
      updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : new Date().toISOString(),
      total: typeof raw.total === "number" && Number.isFinite(raw.total) ? Math.max(0, Math.floor(raw.total)) : summed,
      channels,
      sources,
      paths,
    };
  } catch {
    return emptyDay(date);
  }
}

function isAccessMismatch(error: unknown): boolean {
  if (error instanceof BlobAccessError) return true;
  const msg = error instanceof Error ? error.message : String(error);
  return /access/i.test(msg) && /(public|private)/i.test(msg);
}

async function withAccess<T>(fn: (a: Access) => Promise<T>): Promise<T> {
  try {
    return await fn(access);
  } catch (error) {
    if (!accessLocked && isAccessMismatch(error)) {
      access = access === "private" ? "public" : "private";
      accessLocked = true;
      return await fn(access);
    }
    throw error;
  }
}

async function readDay(date: string): Promise<DayCounts> {
  const result = await withAccess((a) => get(pathnameFor(date), { access: a, useCache: false }));
  if (!result || result.statusCode !== 200 || !result.stream) return emptyDay(date);
  const text = await new Response(result.stream).text();
  return parseDay(text, date);
}

async function writeDay(day: DayCounts): Promise<void> {
  await withAccess((a) =>
    put(pathnameFor(day.date), JSON.stringify(day), {
      access: a,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    }),
  );
}

async function persistBatch(events: ClickEvent[]): Promise<void> {
  if (!events.length) return;
  const date = utcDate();
  const current = await readDay(date);
  await writeDay(apply(current, events));
}

async function drain(): Promise<void> {
  while (queue.length) {
    const batch = queue;
    queue = [];
    await persistBatch(batch);
  }
}

/** Queue one click and flush the day's JSON. Never throws to the caller. */
export async function recordDownloadClick(event: ClickEvent): Promise<void> {
  if (!isBlobConfigured()) {
    warnOnce("[download] Vercel Blob is not configured; skipping count, redirect still sent.");
    return;
  }
  queue.push(event);
  if (!draining) {
    draining = drain()
      .catch((error) => {
        warnOnce(
          `[download] Vercel Blob write failed; skipping count, redirect still sent. ${error instanceof Error ? error.message : ""}`.trim(),
        );
      })
      .finally(() => {
        draining = null;
      });
  }
  await draining;
}

export type StatsPayload = {
  today: DayCounts;
  last7Days: {
    from: string;
    to: string;
    total: number;
    channels: Record<string, number>;
    sources: Record<string, number>;
    paths: Record<string, number>;
    days: DayCounts[];
  };
};

function sumMaps(into: Record<string, number>, from: Record<string, number>) {
  for (const [k, n] of Object.entries(from)) into[k] = (into[k] ?? 0) + n;
}

export async function readStats(): Promise<StatsPayload> {
  const today = utcDate();
  const dates: string[] = [];
  for (let i = LOOKBACK_DAYS - 1; i >= 0; i--) {
    dates.push(utcDate(Date.now() - i * 86_400_000));
  }
  const days = await Promise.all(dates.map((d) => readDay(d)));
  const channels: Record<string, number> = {};
  const sources: Record<string, number> = {};
  const paths: Record<string, number> = {};
  let total = 0;
  for (const d of days) {
    total += d.total;
    sumMaps(channels, d.channels);
    sumMaps(sources, d.sources);
    sumMaps(paths, d.paths);
  }
  return {
    today: days[days.length - 1] ?? emptyDay(today),
    last7Days: {
      from: dates[0] ?? today,
      to: today,
      total,
      channels,
      sources,
      paths,
      days,
    },
  };
}
