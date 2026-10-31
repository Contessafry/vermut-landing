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
 * At most one prune pass per isolate per UTC day: one folded list of
 * `download-counts/` finds every day that exists (holes included), then
 * expired day prefixes are listed and deleted (delete is free). Legacy
 * `download-counts/<date>.json` objects are deleted in the same pass.
 * No daily rollup — a rollup would be a shared write.
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

export type BlobPutOptions = { allowOverwrite: boolean };

export type FoldedPage = {
  folders: string[];
  blobs: string[];
  cursor?: string;
};

export type BlobEventIO = {
  put: (pathname: string, body: string, signal?: AbortSignal, opts?: BlobPutOptions) => Promise<void>;
  get: (pathname: string, signal?: AbortSignal) => Promise<string | null>;
  list: (prefix: string, cursor?: string, signal?: AbortSignal) => Promise<{ pathnames: string[]; cursor?: string }>;
  /** Folded listing (`mode: 'folded'`). Folders are day prefixes; blobs are top-level objects. */
  listFolded: (prefix: string, cursor?: string, signal?: AbortSignal) => Promise<FoldedPage>;
  del: (pathnames: string[], signal?: AbortSignal) => Promise<void>;
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
};

export const PREFIX = "download-counts";
export const RETENTION_DAYS = 90;
export const LIST_PAGE = 1000;
const KEY_CAP = 200;
export const LOOKBACK_DAYS = 7;
const MAX_ATTEMPTS = 4;
/**
 * Shared deadline for the whole after() drain — every flush, retry, and prune
 * consume whatever time is left; under 10ms remaining no put is started.
 * 20s total, not 20s per attempt and not 20s per flush. Route maxDuration is
 * 30s; 10s of headroom is left so after() is not killed mid-write.
 */
export const WRITE_BUDGET_MS = 20_000;
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
 * Exact options object passed to `@vercel/blob` `put`. Tests spy on this
 * call site — do not add a second `allowOverwrite` after spreading this.
 */
export function vercelPutLibraryOptions(
  access: "public" | "private",
  signal?: AbortSignal,
  opts?: BlobPutOptions,
) {
  const write = blobPutOptions(signal);
  return {
    access,
    addRandomSuffix: write.addRandomSuffix,
    allowOverwrite: opts?.allowOverwrite ?? write.allowOverwrite,
    contentType: write.contentType,
    cacheControlMaxAge: write.cacheControlMaxAge,
    abortSignal: write.abortSignal,
  };
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
    const batches: DayCounts[] = [];
    for (const pathname of pathnames) {
      if (pathname === legacyDayPath(parsed.date)) continue;
      if (signal.aborted) throw new DeadlineError(options.timeoutMs ?? READ_BUDGET_MS);
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
 * every day older than RETENTION_DAYS and every leftover legacy
 * `download-counts/<date>.json`. Stops on the first list/delete error so
 * the next UTC day (or a later isolate) can retry. Delete is free.
 */
export async function pruneExpired(
  io: BlobEventIO,
  now = Date.now(),
  signal?: AbortSignal,
): Promise<void> {
  if (signal?.aborted) return;
  try {
    const discovered = await listAllFolded(io, `${PREFIX}/`, signal);
    if (signal?.aborted) return;

    const legacy = discovered.blobs.filter((pathname) => dateFromLegacyBlob(pathname));
    if (legacy.length) {
      await io.del(legacy, signal);
      if (signal?.aborted) return;
    }

    for (const folder of discovered.folders) {
      if (signal?.aborted) return;
      const date = dateFromDayFolder(folder);
      if (!date || !isOutOfRetention(date, now)) continue;
      const pathnames = await listAll(io, dayPrefix(date), signal);
      if (signal?.aborted) return;
      await io.del(pathnames, signal);
    }
  } catch (error) {
    if (signal?.aborted) return;
    warnOnce(
      "prune",
      `[download] prune failed. ${error instanceof Error ? error.message : ""}`.trim(),
    );
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
  let queue: ClickEvent[] = [];
  let draining: Promise<void> | null = null;
  /** One wall-clock cut-off for every flush kicked while this isolate is draining. */
  let waveDeadlineAt: number | null = null;
  let waveAbort: AbortController | null = null;
  let waveAbortTimer: ReturnType<typeof setTimeout> | undefined;
  /** UTC date of the prune pass that already started in this isolate. */
  let lastPruneUtcDay: string | null = null;

  function beginWave(end: number): AbortSignal {
    if (waveAbortTimer) clearTimeout(waveAbortTimer);
    waveAbort?.abort();
    waveAbort = new AbortController();
    const timer = setTimeout(() => waveAbort?.abort(), Math.max(1, end - Date.now()));
    timer.unref?.();
    waveAbortTimer = timer;
    return waveAbort.signal;
  }

  async function drain(deadlineAt: number, signal: AbortSignal): Promise<void> {
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
        // At most one prune pass per isolate per UTC day. Flag is set when
        // the pass starts, not before persist. A failed pass retries tomorrow.
        const today = utcDate(now());
        if (shouldPrune && lastPruneUtcDay !== today) {
          lastPruneUtcDay = today;
          void pruneExpired(io, now(), signal);
        }
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
    const signal = waveDeadlineAt == null ? beginWave(end) : (waveAbort?.signal ?? beginWave(end));
    waveDeadlineAt = end;
    if (end - Date.now() < 10) {
      return Promise.resolve();
    }
    if (draining) {
      return draining.then(() => (queue.length && end - Date.now() >= 10 ? kick() : undefined));
    }
    draining = drain(end, signal)
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
      // Keep waveAbort/timer so an in-flight prune still dies at the deadline.
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
      const today = utcDate(now());
      const dates: string[] = [];
      for (let i = LOOKBACK_DAYS - 1; i >= 0; i--) {
        dates.push(utcDate(now() - i * 86_400_000));
      }
      return runWithDeadline(readBudget, async (signal) => {
        const reads = await Promise.all(dates.map((d) => readCountedDay(d, { io, now, signal })));
        const days: DayCounts[] = [];
        for (const read of reads) {
          if (read.status === "error") {
            throw read.error instanceof Error ? read.error : new Error(String(read.error));
          }
          if (read.status !== "ok") {
            throw new Error(`stats window hit ${read.status}`);
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
      });
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
