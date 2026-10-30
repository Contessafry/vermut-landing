/**
 * Daily download counters in Vercel Blob. One JSON object per UTC day.
 * Writes use ifMatch/etag so concurrent isolates cannot clobber each other.
 * An in-process queue still coalesces clicks on the same isolate; correctness
 * comes from the etag, not from the queue.
 *
 * If Blob is not configured, recordDownloadClick() skips counting. The download
 * redirect must not depend on this module succeeding.
 */
import { BlobAccessError, BlobPreconditionFailedError, get, put } from "@vercel/blob";
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

export type ReadDayResult =
  | { kind: "missing" }
  | { kind: "ok"; day: DayCounts; etag: string }
  | { kind: "corrupt"; text: string; etag: string }
  | { kind: "error"; error: unknown };

export type BlobDayIO = {
  readDay: (date: string) => Promise<ReadDayResult>;
  writeDay: (day: DayCounts, ifMatch: string | null) => Promise<void>;
  saveCorrupt: (date: string, text: string) => Promise<void>;
};

export type PersistOptions = {
  io?: BlobDayIO;
  maxAttempts?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
};

const PREFIX = "download-counts";
const KEY_CAP = 200;
const LOOKBACK_DAYS = 7;
const MAX_ATTEMPTS = 5;

type Access = "public" | "private";

let access: Access = process.env.BLOB_ACCESS === "public" ? "public" : "private";
let accessLocked = process.env.BLOB_ACCESS === "public" || process.env.BLOB_ACCESS === "private";
const warnedKinds = new Set<string>();

let queue: ClickEvent[] = [];
let draining: Promise<void> | null = null;

const pathnameFor = (date: string) => `${PREFIX}/${date}.json`;

export const utcDate = (ms = Date.now()) => new Date(ms).toISOString().slice(0, 10);

export function isBlobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
}

/** One warning per distinct kind — not a single warning for the whole process. */
export function warnOnce(kind: string, message: string) {
  if (warnedKinds.has(kind)) return;
  warnedKinds.add(kind);
  console.warn(message);
}

export function emptyDay(date: string, now = Date.now()): DayCounts {
  return { date, updatedAt: new Date(now).toISOString(), total: 0, channels: {}, sources: {}, paths: {} };
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

/** Pure: apply a batch of clicks onto a day's totals. Never mutates `day`. */
export function applyEvents(day: DayCounts, events: ClickEvent[], now = Date.now()): DayCounts {
  const next: DayCounts = {
    date: day.date,
    updatedAt: new Date(now).toISOString(),
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

export type ParseDayResult = { ok: true; day: DayCounts } | { ok: false };

export function parseDayCounts(text: string, date: string): ParseDayResult {
  try {
    const raw = JSON.parse(text) as unknown;
    if (!raw || typeof raw !== "object") return { ok: false };
    const rec = raw as Partial<DayCounts>;
    const numMap = (v: unknown): Record<string, number> => {
      if (!v || typeof v !== "object") return {};
      const out: Record<string, number> = {};
      for (const [k, n] of Object.entries(v as Record<string, unknown>)) {
        if (typeof n === "number" && Number.isFinite(n) && n >= 0) out[k] = Math.floor(n);
      }
      return out;
    };
    const channels = numMap(rec.channels);
    const sources = numMap(rec.sources);
    const paths = numMap(rec.paths);
    const summed = Object.values(channels).reduce((a, b) => a + b, 0);
    return {
      ok: true,
      day: {
        date,
        updatedAt: typeof rec.updatedAt === "string" ? rec.updatedAt : new Date().toISOString(),
        total: typeof rec.total === "number" && Number.isFinite(rec.total) ? Math.max(0, Math.floor(rec.total)) : summed,
        channels,
        sources,
        paths,
      },
    };
  } catch {
    return { ok: false };
  }
}

export function isConflictError(error: unknown): boolean {
  if (error instanceof BlobPreconditionFailedError) return true;
  const msg = error instanceof Error ? error.message : String(error);
  return /precondition|409|already exists|cannot overwrite|if-?match/i.test(msg);
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

const defaultSleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function vercelReadDay(date: string): Promise<ReadDayResult> {
  let result: Awaited<ReturnType<typeof get>>;
  try {
    result = await withAccess((a) => get(pathnameFor(date), { access: a, useCache: false }));
  } catch (error) {
    return { kind: "error", error };
  }
  if (result === null) return { kind: "missing" };
  if (result.statusCode !== 200 || !result.stream) {
    return { kind: "error", error: new Error(`blob get status ${result.statusCode}`) };
  }
  const text = await new Response(result.stream).text();
  const parsed = parseDayCounts(text, date);
  if (!parsed.ok) return { kind: "corrupt", text, etag: result.blob.etag };
  return { kind: "ok", day: parsed.day, etag: result.blob.etag };
}

export async function vercelWriteDay(day: DayCounts, ifMatch: string | null): Promise<void> {
  await withAccess((a) =>
    put(pathnameFor(day.date), JSON.stringify(day), {
      access: a,
      addRandomSuffix: false,
      allowOverwrite: ifMatch !== null,
      ...(ifMatch ? { ifMatch } : {}),
      contentType: "application/json",
      cacheControlMaxAge: 60,
    }),
  );
}

export async function vercelSaveCorrupt(date: string, text: string): Promise<void> {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  await withAccess((a) =>
    put(`${PREFIX}/corrupt/${date}-${stamp}.json`, text, {
      access: a,
      addRandomSuffix: false,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    }),
  );
}

const vercelIO: BlobDayIO = {
  readDay: vercelReadDay,
  writeDay: vercelWriteDay,
  saveCorrupt: vercelSaveCorrupt,
};

/**
 * Read-modify-write one day's JSON with etag/ifMatch. On 409, re-read and retry
 * with backoff (max 5). Never overwrites a higher same-day total with a lower one.
 * Network / 5xx / corrupt JSON skip the batch instead of resetting the file to 0.
 */
export async function persistEvents(events: ClickEvent[], options: PersistOptions = {}): Promise<void> {
  if (!events.length) return;
  const io = options.io ?? vercelIO;
  const maxAttempts = options.maxAttempts ?? MAX_ATTEMPTS;
  const sleep = options.sleep ?? defaultSleep;
  const now = options.now ?? Date.now;
  const date = utcDate(now());

  let floor = 0;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const read = await io.readDay(date);
    if (read.kind === "error") {
      throw read.error instanceof Error ? read.error : new Error(String(read.error));
    }
    if (read.kind === "corrupt") {
      try {
        await io.saveCorrupt(date, read.text);
      } catch (error) {
        warnOnce(
          "corrupt_backup",
          `[download] could not back up corrupt day ${date}; skipping count. ${error instanceof Error ? error.message : ""}`.trim(),
        );
      }
      warnOnce("corrupt", `[download] day ${date} JSON is unreadable; left in place and skipped this batch.`);
      return;
    }

    const current = read.kind === "ok" ? read.day : emptyDay(date, now());
    const etag = read.kind === "ok" ? read.etag : null;
    const next = applyEvents(current, events, now());

    if (next.date === current.date && next.total < current.total) {
      warnOnce(
        "lower_total",
        `[download] refusing to write total ${next.total} over existing ${current.total} for ${date}; skipped batch.`,
      );
      return;
    }
    if (next.date === date && next.total < floor) {
      warnOnce(
        "lower_total",
        `[download] re-read total would write ${next.total} after intending ${floor} for ${date}; skipped batch to avoid clobber.`,
      );
      return;
    }
    floor = Math.max(floor, next.total);

    try {
      await io.writeDay(next, etag);
      return;
    } catch (error) {
      if (isConflictError(error) && attempt < maxAttempts) {
        const backoff = Math.min(400, 25 * 2 ** (attempt - 1));
        await sleep(backoff + Math.floor(Math.random() * backoff));
        continue;
      }
      if (isConflictError(error)) {
        warnOnce("conflict", `[download] etag conflict on ${date} after ${maxAttempts} attempts; skipped batch.`);
        return;
      }
      throw error;
    }
  }
}

async function drain(): Promise<void> {
  while (queue.length) {
    const batch = queue;
    queue = [];
    await persistEvents(batch);
  }
}

/** Queue one click and flush the day's JSON. Never throws to the caller. */
export async function recordDownloadClick(event: ClickEvent): Promise<void> {
  if (!isBlobConfigured()) {
    warnOnce("unconfigured", "[download] Vercel Blob is not configured; skipping count, redirect still sent.");
    return;
  }
  queue.push(event);
  if (!draining) {
    draining = drain()
      .catch((error) => {
        const kind = error instanceof Error ? error.name || "write_failed" : "write_failed";
        warnOnce(
          kind,
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
  const days: DayCounts[] = [];
  for (const d of dates) {
    const read = await vercelReadDay(d);
    if (read.kind === "error") {
      throw read.error instanceof Error ? read.error : new Error(String(read.error));
    }
    if (read.kind === "corrupt") {
      warnOnce("stats_corrupt", `[download] stats: skipping unreadable day ${d}.`);
      days.push(emptyDay(d));
      continue;
    }
    days.push(read.kind === "ok" ? read.day : emptyDay(d));
  }
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
