/**
 * Append-only download event log in Vercel Blob.
 *
 * Each isolate flush writes one new object:
 *   download-counts/YYYY-MM-DD/<batchId>.json
 * The batch id is generated once (not per retry). The same pathname can be
 * overwritten with the same body, so a retry after an ambiguous timeout does
 * not double-count. Click writes do not use a shared object, etag, or ifMatch.
 *
 * /api/download-stats loads one optional snapshot at `download-counts/snapshot.json`
 * (daily DayCounts + incorporated batch ids), lists the 7-day window, and gets
 * only batches not yet in that set. New-batch gets share one per-request
 * concurrency cap (not cap × days). The snapshot is a read acceleration: source
 * batches stay until retention prune. Snapshot put is conditional (create:
 * allowOverwrite false; update: ifMatch of the body just read). Conflict retry
 * re-reads the snapshot and merges by batch id — not a multi-key transaction.
 *
 * At most one prune pass per isolate per UTC day: one folded list of
 * `download-counts/` finds every day that exists (holes included), then
 * expired day prefixes are listed and deleted (delete is free). Legacy
 * `download-counts/<date>.json` objects are deleted in the same pass.
 * The snapshot pathname is not a dated blob and is not pruned.
 *
 * If Blob is not configured, recordDownloadClick() skips counting. The download
 * redirect must not depend on this module succeeding.
 */
import { BlobAccessError, BlobPreconditionFailedError, del, get, list, put } from "@vercel/blob";
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

export type BlobPutOptions = { allowOverwrite?: boolean; ifMatch?: string };

export type BlobGetResult = { body: string; etag: string };

export type FoldedPage = {
  folders: string[];
  blobs: string[];
  cursor?: string;
};

export type BlobEventIO = {
  put: (pathname: string, body: string, signal?: AbortSignal, opts?: BlobPutOptions) => Promise<void>;
  get: (pathname: string, signal?: AbortSignal) => Promise<BlobGetResult | null>;
  list: (prefix: string, cursor?: string, signal?: AbortSignal) => Promise<{ pathnames: string[]; cursor?: string }>;
  /** Folded listing (`mode: 'folded'`). Folders are day prefixes; blobs are top-level objects. */
  listFolded: (prefix: string, cursor?: string, signal?: AbortSignal) => Promise<FoldedPage>;
  del: (pathnames: string[], signal?: AbortSignal) => Promise<void>;
};

export type SnapshotFile = {
  v: 1;
  updatedAt: string;
  days: Record<string, DayCounts>;
  incorporated: Record<string, string[]>;
};

export type PersistOptions = {
  io?: BlobEventIO;
  batchId?: string;
  maxAttempts?: number;
  sleep?: (ms: number) => Promise<void>;
  now?: () => number;
  /** Shared wall-clock budget. Default WRITE_BUDGET_MS. Ignored when `deadlineAt` is set. */
  timeoutMs?: number;
  /** Absolute Date.now() cut-off shared across attempts (and, for the recorder, across flushes). */
  deadlineAt?: number;
};

export type ReadOptions = {
  io?: BlobEventIO;
  now?: () => number;
  /** Used when `signal` is omitted: wrap this day's IO in runWithDeadline. */
  timeoutMs?: number;
  /** Shared abort from readStats. When set, this day does not start its own timer. */
  signal?: AbortSignal;
};

export type RecorderOptions = PersistOptions & {
  prune?: boolean;
  /** Shared budget for the whole stats read (all 7 days). Default READ_BUDGET_MS. */
  readTimeoutMs?: number;
  /** Own prune deadline. Default PRUNE_BUDGET_MS. Not the after() wave signal. */
  pruneTimeoutMs?: number;
};

export const PREFIX = "download-counts";
export const SNAPSHOT_PATH = `${PREFIX}/snapshot.json`;
export const SNAPSHOT_VERSION = 1;
export const RETENTION_DAYS = 90;
export const LIST_PAGE = 1000;
const KEY_CAP = 200;
export const LOOKBACK_DAYS = 7;
const MAX_ATTEMPTS = 4;
export const SNAPSHOT_MAX_ATTEMPTS = 4;
/** Per-request cap for stats/day batch gets (and the 7-day lists). Not cap × days. */
export const READ_CONCURRENCY = 8;
/**
 * Shared deadline for the whole after() drain — every flush and retry
 * consume whatever time is left; under 10ms remaining no put is started.
 * 20s total, not 20s per attempt and not 20s per flush. Route maxDuration is
 * 30s; 10s of headroom is left so after() is not killed mid-write.
 * Prune has its own budget (PRUNE_BUDGET_MS) and does not use this signal.
 */
export const WRITE_BUDGET_MS = 20_000;
/**
 * Dedicated prune deadline. Inside after() / maxDuration 30s, not unlimited
 * and not the write-wave signal — a later click must not abort a pass.
 */
export const PRUNE_BUDGET_MS = 8_000;
/**
 * Shared deadline for one /api/download-stats call (all 7 days, one signal).
 * Not 10s per day. The stats route maxDuration is 15s.
 */
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

export function batchIdFromPathname(pathname: string, date: string): string | null {
  const prefix = dayPrefix(date);
  if (!pathname.startsWith(prefix) || !pathname.endsWith(".json")) return null;
  const id = pathname.slice(prefix.length, -".json".length);
  if (!id || id.includes("/") || id.includes("\\")) return null;
  return id;
}

export function isSnapshotWriteConflict(error: unknown): boolean {
  if (error instanceof BlobPreconditionFailedError) return true;
  if (error instanceof Error && /already exists|cannot be overwritten/i.test(error.message)) return true;
  return false;
}

/**
 * Bound in-flight work across one stats/day read. Empty input returns [].
 * Abort throws DeadlineError — same as list/get wrappers.
 */
export async function mapLimit<T, R>(
  items: readonly T[],
  limit: number,
  mapper: (item: T, index: number) => Promise<R>,
  signal?: AbortSignal,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  if (items.length === 0) return results;
  const cap = Math.max(1, Math.min(limit, items.length));
  let next = 0;
  const run = async () => {
    for (;;) {
      if (signal?.aborted) throw new DeadlineError(READ_BUDGET_MS);
      const index = next++;
      if (index >= items.length) return;
      results[index] = await mapper(items[index], index);
    }
  };
  await Promise.all(Array.from({ length: cap }, () => run()));
  return results;
}

/** Old RMW path. Not written anymore; prune deletes any leftover. */
export function legacyDayPath(date: string): string {
  return `${PREFIX}/${date}.json`;
}

const DAY_FOLDER_RE = /(?:^|\/)(\d{4}-\d{2}-\d{2})\/?$/;
const LEGACY_JSON_RE = /(?:^|\/)(\d{4}-\d{2}-\d{2})\.json$/;

export function dateFromDayFolder(folder: string): string | null {
  const m = DAY_FOLDER_RE.exec(folder.trim());
  if (!m) return null;
  const parsed = parseUtcDate(m[1]);
  return parsed.ok ? parsed.date : null;
}

export function dateFromLegacyBlob(pathname: string): string | null {
  const m = LEGACY_JSON_RE.exec(pathname);
  if (!m) return null;
  const parsed = parseUtcDate(m[1]);
  return parsed.ok ? parsed.date : null;
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

export function parseSnapshot(text: string): SnapshotFile | null {
  try {
    const raw = JSON.parse(text) as unknown;
    if (!raw || typeof raw !== "object") return null;
    const rec = raw as Record<string, unknown>;
    if (rec.v !== SNAPSHOT_VERSION) return null;
    if (typeof rec.updatedAt !== "string") return null;
    if (!rec.days || typeof rec.days !== "object" || Array.isArray(rec.days)) return null;
    if (!rec.incorporated || typeof rec.incorporated !== "object" || Array.isArray(rec.incorporated)) return null;
    const days: Record<string, DayCounts> = {};
    for (const [date, value] of Object.entries(rec.days as Record<string, unknown>)) {
      const parsedDate = parseUtcDate(date);
      if (!parsedDate.ok) return null;
      const parsed = parseDayCounts(JSON.stringify(value), parsedDate.date);
      if (!parsed.ok) return null;
      days[parsedDate.date] = parsed.day;
    }
    const incorporated: Record<string, string[]> = {};
    for (const [date, ids] of Object.entries(rec.incorporated as Record<string, unknown>)) {
      const parsedDate = parseUtcDate(date);
      if (!parsedDate.ok) return null;
      if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string" || id.length === 0)) return null;
      incorporated[parsedDate.date] = [...new Set(ids as string[])];
      if (!days[parsedDate.date]) return null;
    }
    for (const date of Object.keys(days)) {
      if (!incorporated[date]) incorporated[date] = [];
    }
    return { v: SNAPSHOT_VERSION, updatedAt: rec.updatedAt, days, incorporated };
  } catch {
    return null;
  }
}

type LoadedSnapshot =
  | { kind: "missing" }
  | { kind: "ok"; file: SnapshotFile; etag: string }
  | { kind: "corrupt"; etag: string };

async function loadSnapshot(io: BlobEventIO, signal?: AbortSignal): Promise<LoadedSnapshot> {
  const got = await io.get(SNAPSHOT_PATH, signal);
  if (got == null) return { kind: "missing" };
  const file = parseSnapshot(got.body);
  if (!file) {
    warnOnce("snapshot_corrupt", "[download] ignoring unreadable stats snapshot; folding from batch objects.");
    return { kind: "corrupt", etag: got.etag };
  }
  return { kind: "ok", file, etag: got.etag };
}

function lookbackDates(now: () => number): string[] {
  const dates: string[] = [];
  for (let i = LOOKBACK_DAYS - 1; i >= 0; i--) {
    dates.push(utcDate(now() - i * 86_400_000));
  }
  return dates;
}

function statsPayload(dates: string[], daysByDate: Record<string, DayCounts>, now: () => number): StatsPayload {
  const today = utcDate(now());
  const days = dates.map((d) => daysByDate[d] ?? emptyDay(d, now()));
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
}

function incorporatedChanged(
  snap: LoadedSnapshot,
  dates: string[],
  nextInc: Record<string, string[]>,
): boolean {
  if (snap.kind !== "ok") return true;
  if (Object.keys(snap.file.days).some((d) => !dates.includes(d))) return true;
  for (const date of dates) {
    if (!snap.file.days[date]) return true;
    const prev = new Set(snap.file.incorporated[date] ?? []);
    const next = nextInc[date] ?? [];
    if (prev.size !== next.length) return true;
    for (const id of next) {
      if (!prev.has(id)) return true;
    }
  }
  return false;
}

async function getParsedBatch(
  io: BlobEventIO,
  pathname: string,
  date: string,
  signal: AbortSignal,
): Promise<DayCounts | null> {
  try {
    const got = await io.get(pathname, signal);
    if (got == null) return null;
    const parsedBatch = parseDayCounts(got.body, date);
    if (!parsedBatch.ok) {
      warnOnce("batch_corrupt", `[download] skipping unreadable batch ${pathname}.`);
      return null;
    }
    return parsedBatch.day;
  } catch (error) {
    if (signal.aborted || error instanceof DeadlineError) throw error;
    warnOnce(
      "batch_read",
      `[download] skipping unread batch ${pathname}. ${error instanceof Error ? error.message : ""}`.trim(),
    );
    return null;
  }
}

/**
 * 7-day stats fold. Snapshot is acceleration only; source batches stay.
 * Conflict on snapshot put re-reads and merges by batch id (not a transaction).
 */
export async function foldLookbackStats(
  io: BlobEventIO,
  now: () => number,
  signal: AbortSignal,
  concurrency = READ_CONCURRENCY,
): Promise<StatsPayload> {
  const dates = lookbackDates(now);
  const fetched = new Map<string, DayCounts>();
  let lastError: unknown;

  for (let attempt = 1; attempt <= SNAPSHOT_MAX_ATTEMPTS; attempt++) {
    if (signal.aborted) throw new DeadlineError(READ_BUDGET_MS);
    try {
      const snap = await loadSnapshot(io, signal);
      const baseDays = snap.kind === "ok" ? snap.file.days : {};
      const incorporated: Record<string, Set<string>> = {};
      if (snap.kind === "ok") {
        for (const [date, ids] of Object.entries(snap.file.incorporated)) {
          incorporated[date] = new Set(ids);
        }
      }

      const listings = await mapLimit(dates, concurrency, (date) => listAll(io, dayPrefix(date), signal), signal);
      const jobs: { date: string; pathname: string; batchId: string }[] = [];
      const listedIds: Record<string, Set<string>> = {};
      dates.forEach((date, i) => {
        listedIds[date] = new Set();
        for (const pathname of listings[i] ?? []) {
          if (pathname === legacyDayPath(date)) continue;
          const batchId = batchIdFromPathname(pathname, date);
          if (!batchId) continue;
          listedIds[date].add(batchId);
          const key = `${date}/${batchId}`;
          if (incorporated[date]?.has(batchId) || fetched.has(key)) continue;
          jobs.push({ date, pathname, batchId });
        }
      });

      await mapLimit(
        jobs,
        concurrency,
        async (job) => {
          const day = await getParsedBatch(io, job.pathname, job.date, signal);
          if (day) fetched.set(`${job.date}/${job.batchId}`, day);
        },
        signal,
      );

      const nextDays: Record<string, DayCounts> = {};
      const nextInc: Record<string, string[]> = {};
      for (const date of dates) {
        const already = incorporated[date] ?? new Set<string>();
        const additions: DayCounts[] = [];
        const inc = new Set<string>(already);
        for (const id of listedIds[date] ?? []) {
          if (already.has(id)) continue;
          const extra = fetched.get(`${date}/${id}`);
          if (!extra) continue;
          additions.push(extra);
          inc.add(id);
        }
        const base = baseDays[date] ?? emptyDay(date, now());
        nextDays[date] = mergeDays(date, [base, ...additions], now());
        nextInc[date] = [...inc].sort();
      }

      if (incorporatedChanged(snap, dates, nextInc)) {
        if (snap.kind !== "missing" && !snap.etag) {
          throw new Error("snapshot etag missing; refusing an unprotected overwrite");
        }
        const file: SnapshotFile = {
          v: SNAPSHOT_VERSION,
          updatedAt: new Date(now()).toISOString(),
          days: nextDays,
          incorporated: nextInc,
        };
        const opts: BlobPutOptions =
          snap.kind === "missing" ? { allowOverwrite: false } : { allowOverwrite: true, ifMatch: snap.etag };
        await io.put(SNAPSHOT_PATH, JSON.stringify(file), signal, opts);
      }

      return statsPayload(dates, nextDays, now);
    } catch (error) {
      lastError = error;
      if (signal.aborted || error instanceof DeadlineError) throw error;
      if (!isSnapshotWriteConflict(error) || attempt >= SNAPSHOT_MAX_ATTEMPTS) throw error;
    }
  }

  throw lastError instanceof Error ? lastError : new DeadlineError(READ_BUDGET_MS);
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

/** Shared put flags. `allowOverwrite: true` is the retry-safe invariant — do not flip. */
export function blobPutOptions(signal?: AbortSignal) {
  return {
    addRandomSuffix: false as const,
    allowOverwrite: true as const,
    contentType: "application/json",
    cacheControlMaxAge: 60,
    abortSignal: signal,
  };
}

/**
 * Exact options object passed to `@vercel/blob` `get`. Tests spy on this
 * call site. `useCache: false` reads origin. `Accept-Encoding: identity`
 * keeps the object ETag strong: CDN gzip returns `W/"…"` and Blob `ifMatch`
 * uses strong comparison, so a weak validator 412s every snapshot update.
 */
export function vercelGetLibraryOptions(access: "public" | "private", signal?: AbortSignal) {
  return {
    access,
    useCache: false as const,
    abortSignal: signal,
    headers: { "Accept-Encoding": "identity" as const },
  };
}

/**
 * Exact options object passed to `@vercel/blob` `put`. Tests spy on this
 * call site — do not add a second `allowOverwrite` after spreading this.
 */
export function vercelPutLibraryOptions(
  access: "public" | "private",
  signal?: AbortSignal,
  opts?: BlobPutOptions,
) {
  const write = blobPutOptions(signal);
  const options: {
    access: "public" | "private";
    addRandomSuffix: false;
    allowOverwrite: boolean;
    contentType: string;
    cacheControlMaxAge: number;
    abortSignal: AbortSignal | undefined;
    ifMatch?: string;
  } = {
    access,
    addRandomSuffix: write.addRandomSuffix,
    allowOverwrite: opts?.allowOverwrite ?? write.allowOverwrite,
    contentType: write.contentType,
    cacheControlMaxAge: write.cacheControlMaxAge,
    abortSignal: write.abortSignal,
  };
  if (opts?.ifMatch) options.ifMatch = opts.ifMatch;
  return options;
}

export type BlobLibraryPut = (
  pathname: string,
  body: string,
  options: ReturnType<typeof vercelPutLibraryOptions>,
) => Promise<unknown>;

export async function vercelPut(
  pathname: string,
  body: string,
  signal?: AbortSignal,
  opts?: BlobPutOptions,
  putImpl: BlobLibraryPut = put as BlobLibraryPut,
): Promise<void> {
  await withAccess((a) => putImpl(pathname, body, vercelPutLibraryOptions(a, signal, opts)));
}

export async function vercelGet(pathname: string, signal?: AbortSignal): Promise<BlobGetResult | null> {
  const result = await withAccess((a) => get(pathname, vercelGetLibraryOptions(a, signal)));
  if (result === null) return null;
  if (result.statusCode !== 200 || !result.stream) {
    throw new Error(`blob get status ${result.statusCode}`);
  }
  const body = await new Response(result.stream).text();
  return { body, etag: result.blob.etag };
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

export async function vercelListFolded(
  prefix: string,
  cursor?: string,
  signal?: AbortSignal,
): Promise<FoldedPage> {
  const page = await list({
    prefix,
    cursor,
    limit: LIST_PAGE,
    mode: "folded",
    abortSignal: signal,
  });
  return {
    folders: page.folders ?? [],
    blobs: page.blobs.map((b) => b.pathname),
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
  listFolded: vercelListFolded,
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
  const load = async (signal: AbortSignal): Promise<CountedDay> => {
    if (signal.aborted) throw new DeadlineError(options.timeoutMs ?? READ_BUDGET_MS);
    const pathnames = await listAll(io, dayPrefix(parsed.date), signal);
    if (signal.aborted) throw new DeadlineError(options.timeoutMs ?? READ_BUDGET_MS);
    const jobs = pathnames.filter(
      (pathname) => pathname !== legacyDayPath(parsed.date) && batchIdFromPathname(pathname, parsed.date),
    );
    const loaded = await mapLimit(
      jobs,
      READ_CONCURRENCY,
      (pathname) => getParsedBatch(io, pathname, parsed.date, signal),
      signal,
    );
    const batches = loaded.filter((day): day is DayCounts => day != null);
    return { status: "ok", day: mergeDays(parsed.date, batches, now()), batches: batches.length };
  };

  try {
    if (options.signal) return await load(options.signal);
    return await runWithDeadline(options.timeoutMs ?? READ_BUDGET_MS, load);
  } catch (error) {
    return { status: "error", error };
  }
}

/**
 * Write one flush. Pathname is `batchId` (generated by the caller, once).
 * Retries reuse that pathname and the same body. `deadlineAt` (or timeoutMs
 * from now) is shared across attempts — not reset per try.
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
  const deadlineAt = options.deadlineAt ?? Date.now() + budgetMs;

  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const remaining = deadlineAt - Date.now();
    if (remaining < 10) break;
    try {
      await runWithDeadline(remaining, (signal) =>
        io.put(pathname, body, signal, { allowOverwrite: blobPutOptions(signal).allowOverwrite }),
      );
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

export async function listAllFolded(
  io: BlobEventIO,
  prefix: string,
  signal?: AbortSignal,
): Promise<{ folders: string[]; blobs: string[] }> {
  const folders: string[] = [];
  const blobs: string[] = [];
  let cursor: string | undefined;
  do {
    const page = await io.listFolded(prefix, cursor, signal);
    folders.push(...page.folders);
    blobs.push(...page.blobs);
    cursor = page.cursor;
  } while (cursor);
  return { folders, blobs };
}

/**
 * One discovery list (`mode: 'folded'` on `download-counts/`) then delete
 * every day older than RETENTION_DAYS, including leftover legacy
 * `download-counts/<date>.json` for those same expired days. In-window
 * legacy (today and the last 90 days) is left in place. Stops on the first
 * list/delete error so a later click can retry. Delete is free.
 * Returns true only when the pass finished without abort or error.
 */
export async function pruneExpired(
  io: BlobEventIO,
  now = Date.now(),
  signal?: AbortSignal,
): Promise<boolean> {
  if (signal?.aborted) return false;
  try {
    const discovered = await listAllFolded(io, `${PREFIX}/`, signal);
    if (signal?.aborted) return false;

    const legacy = discovered.blobs.filter((pathname) => {
      const date = dateFromLegacyBlob(pathname);
      return date != null && isOutOfRetention(date, now);
    });
    if (legacy.length) {
      await io.del(legacy, signal);
      if (signal?.aborted) return false;
    }

    for (const folder of discovered.folders) {
      if (signal?.aborted) return false;
      const date = dateFromDayFolder(folder);
      if (!date || !isOutOfRetention(date, now)) continue;
      const pathnames = await listAll(io, dayPrefix(date), signal);
      if (signal?.aborted) return false;
      await io.del(pathnames, signal);
    }
    return !signal?.aborted;
  } catch (error) {
    if (signal?.aborted) return false;
    warnOnce(
      "prune",
      `[download] prune failed. ${error instanceof Error ? error.message : ""}`.trim(),
    );
    return false;
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
 * events that arrived while it was in flight: the loop continues on `queue`
 * until the shared drain deadline is exhausted.
 */
export function createRecorder(options: RecorderOptions): ClickRecorder {
  const io = options.io ?? vercelIO;
  const now = options.now ?? Date.now;
  const shouldPrune = options.prune !== false;
  const writeBudget = options.timeoutMs ?? WRITE_BUDGET_MS;
  const readBudget = options.readTimeoutMs ?? READ_BUDGET_MS;
  const pruneBudget = options.pruneTimeoutMs ?? PRUNE_BUDGET_MS;
  let queue: ClickEvent[] = [];
  let draining: Promise<void> | null = null;
  /** One wall-clock cut-off for every flush kicked while this isolate is draining. */
  let waveDeadlineAt: number | null = null;
  let waveAbort: AbortController | null = null;
  let waveAbortTimer: ReturnType<typeof setTimeout> | undefined;
  /** UTC date of a prune pass that finished in this isolate. Unset on abort/error. */
  let lastPruneUtcDay: string | null = null;
  /** In-memory join for concurrent kickers in this isolate. Not a Blob lock. */
  let pruneInFlight: Promise<void> | null = null;

  function kickPrune(): void {
    const today = utcDate(now());
    if (lastPruneUtcDay === today) return;
    if (pruneInFlight) return;
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), Math.max(1, pruneBudget));
    timer.unref?.();
    pruneInFlight = pruneExpired(io, now(), ac.signal)
      .then((finished) => {
        if (finished) lastPruneUtcDay = today;
      })
      .finally(() => {
        clearTimeout(timer);
        pruneInFlight = null;
      });
  }

  function beginWave(end: number): AbortSignal {
    if (waveAbortTimer) clearTimeout(waveAbortTimer);
    waveAbort?.abort();
    waveAbort = new AbortController();
    const timer = setTimeout(() => waveAbort?.abort(), Math.max(1, end - Date.now()));
    timer.unref?.();
    waveAbortTimer = timer;
    return waveAbort.signal;
  }

  async function drain(deadlineAt: number): Promise<void> {
    while (queue.length) {
      if (deadlineAt - Date.now() < 10) {
        warnOnce("drain_deadline", `[download] drain deadline reached; ${queue.length} event(s) left for a later request.`);
        return;
      }
      const events = queue;
      queue = [];
      const batchId = randomUUID();
      try {
        await persistEvents(events, { ...options, io, batchId, now, deadlineAt });
        if (shouldPrune) kickPrune();
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
    const end = waveDeadlineAt ?? Date.now() + writeBudget;
    if (waveDeadlineAt == null || !waveAbort) beginWave(end);
    waveDeadlineAt = end;
    if (end - Date.now() < 10) {
      return Promise.resolve();
    }
    if (draining) {
      return draining.then(() => (queue.length && end - Date.now() >= 10 ? kick() : undefined));
    }
    draining = drain(end)
      .catch((error) => {
        warnOnce(
          "drain",
          `[download] drain failed. ${error instanceof Error ? error.message : ""}`.trim(),
        );
      })
      .finally(() => {
        draining = null;
      });
    return draining.then(() => {
      if (queue.length && end - Date.now() >= 10) return kick();
      // Wave over: leftover events wait for a later request (fresh budget).
      // Prune has its own controller — it does not die with this wave.
      waveDeadlineAt = null;
    });
  }

  return {
    record(event) {
      queue.push(event);
      return kick();
    },
    readDay(date) {
      return readCountedDay(date, { io, now, timeoutMs: readBudget });
    },
    async readStats() {
      return runWithDeadline(readBudget, (signal) => foldLookbackStats(io, now, signal, READ_CONCURRENCY));
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
