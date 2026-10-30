/**
 * Append-only download event log in Vercel Blob.
 *
 * Each isolate flush writes one new object:
 *   download-counts/YYYY-MM-DD/<batchId>.json
 * The batch id is generated once (not per retry). The same pathname can be
 * overwritten with the same body, so a retry after an ambiguous timeout does
 * not double-count. There is no shared object, no etag, no ifMatch.
 *
 * /api/download-stats lists each day prefix (paginated) and sums the batches.
 * Objects older than RETENTION_DAYS are deleted (delete is free). No daily
 * rollup — a rollup would be a shared write.
 *
 * If Blob is not configured, recordDownloadClick() skips counting. The download
 * redirect must not depend on this module succeeding.
 */
import { BlobAccessError, del, get, list, put } from "@vercel/blob";
import { randomUUID } from "node:crypto";
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

export type BatchRecord = DayCounts & { batchId: string };

export type BlobEventIO = {
  put: (pathname: string, body: string, signal?: AbortSignal) => Promise<void>;
  get: (pathname: string, signal?: AbortSignal) => Promise<string | null>;
  list: (prefix: string, cursor?: string, signal?: AbortSignal) => Promise<{ pathnames: string[]; cursor?: string }>;
  del: (pathnames: string[], signal?: AbortSignal) => Promise<void>;
};

export type PersistOptions = {
  io?: BlobEventIO;
  batchId?: string;
  maxAttempts?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  /** Shared deadline for the whole flush (all retries). Default WRITE_BUDGET_MS. */
  timeoutMs?: number;
};

export type ReadOptions = {
  io?: BlobEventIO;
  now?: () => number;
  /** Shared deadline for list + every get of one day. Default READ_BUDGET_MS. */
  timeoutMs?: number;
};

export type RecorderOptions = PersistOptions & {
  prune?: boolean;
};

export const PREFIX = "download-counts";
export const RETENTION_DAYS = 90;
export const LIST_PAGE = 1000;
const KEY_CAP = 200;
const LOOKBACK_DAYS = 7;
const MAX_ATTEMPTS = 4;
/**
 * Shared deadline for one flush: every retry consumes whatever time is left,
 * the last attempt is aborted when this elapses. 20s total, not 20s per try,
 * so 4 attempts cannot run to 80s. Route maxDuration is 30s; 10s of headroom
 * is left so after() is not killed mid-write.
 */
export const WRITE_BUDGET_MS = 20_000;
/** Shared deadline for one day's list + gets. Hung Blob → error, never an empty day. */
export const READ_BUDGET_MS = 10_000;

export class DeadlineError extends Error {
  constructor(ms: number) {
    super(`deadline exceeded after ${ms}ms`);
    this.name = "DeadlineError";
  }
}

type Access = "public" | "private";

let access: Access = process.env.BLOB_ACCESS === "public" ? "public" : "private";
let accessLocked = process.env.BLOB_ACCESS === "public" || process.env.BLOB_ACCESS === "private";
const warnedKinds = new Set<string>();
const prunedDates = new Set<string>();

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

export function batchPath(date: string, batchId: string): string {
  return `${PREFIX}/${date}/${batchId}.json`;
}

export function dayPrefix(date: string): string {
  return `${PREFIX}/${date}/`;
}

const DATE_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Calendar-true UTC date. Rejects 2026-02-31: we build the UTC date and require
 * the fields to round-trip. `new Date('2026-02-31')` is not used.
 */
export function parseUtcDate(raw: string): { ok: true; date: string } | { ok: false } {
  const m = DATE_RE.exec(raw.trim());
  if (!m) return { ok: false };
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);
  const dt = new Date(Date.UTC(year, month - 1, day));
  if (dt.getUTCFullYear() !== year || dt.getUTCMonth() !== month - 1 || dt.getUTCDate() !== day) {
    return { ok: false };
  }
  return { ok: true, date: `${m[1]}-${m[2]}-${m[3]}` };
}

export function utcDayMs(date: string): number {
  return Date.UTC(Number(date.slice(0, 4)), Number(date.slice(5, 7)) - 1, Number(date.slice(8, 10)));
}

/** Whole UTC days from `date` to the UTC day of `now`. Negative = future. */
export function daysFromToday(date: string, now = Date.now()): number {
  const today = utcDayMs(utcDate(now));
  return Math.round((today - utcDayMs(date)) / 86_400_000);
}

export function isOutOfRetention(date: string, now = Date.now()): boolean {
  return daysFromToday(date, now) > RETENTION_DAYS;
}

export function isFutureDate(date: string, now = Date.now()): boolean {
  return daysFromToday(date, now) < 0;
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

function addMaps(into: Record<string, number>, from: Record<string, number>) {
  for (const [k, n] of Object.entries(from)) {
    if (into[k] != null) {
      into[k] += n;
      continue;
    }
    if (Object.keys(into).length >= KEY_CAP) {
      into.other = (into.other ?? 0) + n;
      continue;
    }
    into[k] = n;
  }
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

export function mergeDays(date: string, batches: DayCounts[], now = Date.now()): DayCounts {
  const next = emptyDay(date, now);
  for (const b of batches) {
    next.total += b.total;
    addMaps(next.channels, b.channels);
    addMaps(next.sources, b.sources);
    addMaps(next.paths, b.paths);
    if (b.updatedAt > next.updatedAt) next.updatedAt = b.updatedAt;
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

/**
 * Abort `signal` at `ms` and reject even if `fn` ignores the abort.
 * Callers that honor the signal (put/get/list) cancel in-flight work so
 * nothing lands after we give up.
 */
export async function runWithDeadline<T>(ms: number, fn: (signal: AbortSignal) => Promise<T>): Promise<T> {
  const ac = new AbortController();
  const budget = Math.max(1, ms);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      ac.abort();
      reject(new DeadlineError(budget));
    }, budget);
  });
  try {
    return await Promise.race([fn(ac.signal), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export async function vercelPut(pathname: string, body: string, signal?: AbortSignal): Promise<void> {
  await withAccess((a) =>
    put(pathname, body, {
      access: a,
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
      abortSignal: signal,
    }),
  );
}

export async function vercelGet(pathname: string, signal?: AbortSignal): Promise<string | null> {
  const result = await withAccess((a) => get(pathname, { access: a, useCache: false, abortSignal: signal }));
  if (result === null) return null;
  if (result.statusCode !== 200 || !result.stream) {
    throw new Error(`blob get status ${result.statusCode}`);
  }
  return await new Response(result.stream).text();
}

export async function vercelList(
  prefix: string,
  cursor?: string,
  signal?: AbortSignal,
): Promise<{ pathnames: string[]; cursor?: string }> {
  const page = await list({ prefix, cursor, limit: LIST_PAGE, abortSignal: signal });
  return {
    pathnames: page.blobs.map((b) => b.pathname),
    cursor: page.hasMore ? page.cursor : undefined,
  };
}

export async function vercelDel(pathnames: string[], signal?: AbortSignal): Promise<void> {
  if (!pathnames.length) return;
  await del(pathnames, { abortSignal: signal });
}

export const vercelIO: BlobEventIO = {
  put: vercelPut,
  get: vercelGet,
  list: vercelList,
  del: vercelDel,
};

export type CountedDay =
  | { status: "ok"; day: DayCounts; batches: number }
  | { status: "out_of_retention"; date: string; retentionDays: number }
  | { status: "invalid_date"; date: string }
  | { status: "error"; error: unknown };

export async function listAll(io: BlobEventIO, prefix: string, signal?: AbortSignal): Promise<string[]> {
  const pathnames: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await io.list(prefix, cursor, signal);
    pathnames.push(...page.pathnames);
    cursor = page.cursor;
  } while (cursor);
  return pathnames;
}

/**
 * Read one UTC day. Never returns a zero DayCounts for a date we cannot know:
 * out-of-retention and invalid dates are distinct statuses, not empty days.
 * Future dates are valid empty days (no clicks can exist yet).
 */
export async function readCountedDay(date: string, options: ReadOptions = {}): Promise<CountedDay> {
  const parsed = parseUtcDate(date);
  if (!parsed.ok) return { status: "invalid_date", date };
  const io = options.io ?? vercelIO;
  const now = options.now ?? Date.now;
  if (isOutOfRetention(parsed.date, now())) {
    return { status: "out_of_retention", date: parsed.date, retentionDays: RETENTION_DAYS };
  }
  if (isFutureDate(parsed.date, now())) {
    return { status: "ok", day: emptyDay(parsed.date, now()), batches: 0 };
  }
  const budget = options.timeoutMs ?? READ_BUDGET_MS;
  try {
    return await runWithDeadline(budget, async (signal) => {
      const pathnames = await listAll(io, dayPrefix(parsed.date), signal);
      if (signal.aborted) throw new DeadlineError(budget);
      const batches: DayCounts[] = [];
      for (const pathname of pathnames) {
        if (signal.aborted) throw new DeadlineError(budget);
        try {
          const text = await io.get(pathname, signal);
          if (text == null) continue;
          const parsedBatch = parseDayCounts(text, parsed.date);
          if (!parsedBatch.ok) {
            warnOnce("batch_corrupt", `[download] skipping unreadable batch ${pathname}.`);
            continue;
          }
          batches.push(parsedBatch.day);
        } catch (error) {
          if (signal.aborted || error instanceof DeadlineError) throw error;
          warnOnce(
            "batch_read",
            `[download] skipping unread batch ${pathname}. ${error instanceof Error ? error.message : ""}`.trim(),
          );
        }
      }
      return { status: "ok" as const, day: mergeDays(parsed.date, batches, now()), batches: batches.length };
    });
  } catch (error) {
    return { status: "error", error };
  }
}

/**
 * Write one flush. Pathname is `batchId` (generated by the caller, once).
 * Retries reuse that pathname and the same body. One shared deadline covers
 * every attempt; a hung put is aborted when that deadline elapses.
 */
export async function persistEvents(events: ClickEvent[], options: PersistOptions = {}): Promise<void> {
  if (!events.length) return;
  const io = options.io ?? vercelIO;
  const maxAttempts = options.maxAttempts ?? MAX_ATTEMPTS;
  const sleep = options.sleep ?? defaultSleep;
  const now = options.now ?? Date.now;
  const budgetMs = options.timeoutMs ?? WRITE_BUDGET_MS;
  const date = utcDate(now());
  const batchId = options.batchId ?? randomUUID();
  const pathname = batchPath(date, batchId);
  const body = JSON.stringify({ ...applyEvents(emptyDay(date, now()), events, now()), batchId });
  const deadlineAt = Date.now() + budgetMs;

  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const remaining = deadlineAt - Date.now();
    if (remaining < 10) break;
    try {
      await runWithDeadline(remaining, (signal) => io.put(pathname, body, signal));
      return;
    } catch (error) {
      lastError = error;
      const left = deadlineAt - Date.now();
      if (left < 10 || attempt >= maxAttempts) break;
      const backoff = Math.min(400, 25 * 2 ** (attempt - 1), left);
      if (backoff > 0) await sleep(backoff);
    }
  }
  throw lastError instanceof Error ? lastError : new DeadlineError(budgetMs);
}

export async function pruneExpired(
  io: BlobEventIO,
  now = Date.now(),
): Promise<void> {
  for (let age = RETENTION_DAYS + 1; age <= RETENTION_DAYS + 7; age++) {
    const date = utcDate(now - age * 86_400_000);
    if (prunedDates.has(date)) continue;
    try {
      const pathnames = await listAll(io, dayPrefix(date));
      await io.del(pathnames);
      prunedDates.add(date);
    } catch (error) {
      warnOnce(
        "prune",
        `[download] prune of ${date} failed. ${error instanceof Error ? error.message : ""}`.trim(),
      );
    }
  }
}

export type StatsPayload = {
  retentionDays: number;
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

export type ClickRecorder = {
  record: (event: ClickEvent) => Promise<void>;
  readDay: (date: string) => Promise<CountedDay>;
  readStats: () => Promise<StatsPayload>;
};

/**
 * Per-isolate queue + one Blob object per flush. A failed flush does not drop
 * events that arrived while it was in flight: the loop continues on `queue`.
 */
export function createRecorder(options: RecorderOptions): ClickRecorder {
  const io = options.io ?? vercelIO;
  const now = options.now ?? Date.now;
  const shouldPrune = options.prune !== false;
  let queue: ClickEvent[] = [];
  let draining: Promise<void> | null = null;

  async function drain(): Promise<void> {
    while (queue.length) {
      const events = queue;
      queue = [];
      const batchId = randomUUID();
      try {
        await persistEvents(events, { ...options, io, batchId, now });
        if (shouldPrune) void pruneExpired(io, now());
      } catch (error) {
        const kind = error instanceof Error ? error.name || "write_failed" : "write_failed";
        warnOnce(
          kind,
          `[download] Vercel Blob write failed; skipping this flush. ${error instanceof Error ? error.message : ""}`.trim(),
        );
      }
    }
  }

  function kick(): Promise<void> {
    if (draining) {
      return draining.then(() => (queue.length ? kick() : undefined));
    }
    draining = drain()
      .catch((error) => {
        warnOnce(
          "drain",
          `[download] drain failed. ${error instanceof Error ? error.message : ""}`.trim(),
        );
      })
      .finally(() => {
        draining = null;
      });
    return draining.then(() => (queue.length ? kick() : undefined));
  }

  return {
    record(event) {
      queue.push(event);
      return kick();
    },
    readDay(date) {
      return readCountedDay(date, { io, now, timeoutMs: options.timeoutMs });
    },
    async readStats() {
      const today = utcDate(now());
      const dates: string[] = [];
      for (let i = LOOKBACK_DAYS - 1; i >= 0; i--) {
        dates.push(utcDate(now() - i * 86_400_000));
      }
      const days: DayCounts[] = [];
      for (const d of dates) {
        const read = await readCountedDay(d, { io, now, timeoutMs: options.timeoutMs });
        if (read.status === "error") {
          throw read.error instanceof Error ? read.error : new Error(String(read.error));
        }
        if (read.status !== "ok") {
          throw new Error(`stats window hit ${read.status} for ${d}`);
        }
        days.push(read.day);
      }
      const channels: Record<string, number> = {};
      const sources: Record<string, number> = {};
      const paths: Record<string, number> = {};
      let total = 0;
      for (const d of days) {
        total += d.total;
        addMaps(channels, d.channels);
        addMaps(sources, d.sources);
        addMaps(paths, d.paths);
      }
      return {
        retentionDays: RETENTION_DAYS,
        today: days[days.length - 1] ?? emptyDay(today, now()),
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
    },
  };
}

const live = createRecorder({ io: vercelIO, prune: true });

/** Queue one click and flush a batch object. Never throws to the caller. */
export async function recordDownloadClick(event: ClickEvent): Promise<void> {
  if (!isBlobConfigured()) {
    warnOnce("unconfigured", "[download] Vercel Blob is not configured; skipping count, redirect still sent.");
    return;
  }
  await live.record(event);
}

export async function readStats(): Promise<StatsPayload> {
  return live.readStats();
}
