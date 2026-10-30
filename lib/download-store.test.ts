import assert from "node:assert/strict";
import { test } from "node:test";
import { BlobUnknownError } from "@vercel/blob";
import {
  LOOKBACK_DAYS,
  RETENTION_DAYS,
  applyEvents,
  batchPath,
  createRecorder,
  dayPrefix,
  emptyDay,
  isFutureDate,
  isOutOfRetention,
  mergeDays,
  parseDayCounts,
  parseUtcDate,
  LIST_PAGE,
  persistEvents,
  pruneExpired,
  readCountedDay,
  utcDate,
  type BlobEventIO,
  type ClickEvent,
  type DayCounts,
} from "./download-store.ts";

const click = (n = 1, source = "direct", path = "/"): ClickEvent[] =>
  Array.from({ length: n }, () => ({ channel: "stable" as const, source, path }));

const NOON = Date.parse("2026-10-30T12:00:00.000Z");
const now = () => NOON;

test("applyEvents increments total, channel, source and path", () => {
  const day = emptyDay("2026-10-30", NOON);
  const next = applyEvents(day, [...click(3, "reddit"), ...click(2, "direct")]);
  assert.equal(next.total, 5);
  assert.equal(next.channels.stable, 5);
  assert.equal(next.sources.reddit, 3);
  assert.equal(next.sources.direct, 2);
  assert.equal(next.paths["/"], 5);
  assert.equal(day.total, 0);
});

test("applyEvents stacked on an existing day adds, never resets", () => {
  const start: DayCounts = {
    date: "2026-10-30",
    updatedAt: "2026-10-30T00:00:00.000Z",
    total: 60,
    channels: { stable: 60 },
    sources: { direct: 60 },
    paths: { "/": 60 },
  };
  const next = applyEvents(start, click(1));
  assert.equal(next.total, 61);
  assert.equal(next.channels.stable, 61);
});

test("parseDayCounts rejects unreadable JSON and accepts a real day", () => {
  assert.equal(parseDayCounts("not-json", "2026-10-30").ok, false);
  assert.equal(parseDayCounts("null", "2026-10-30").ok, false);
  const ok = parseDayCounts(JSON.stringify({ total: 4, channels: { stable: 4 }, sources: {}, paths: {} }), "2026-10-30");
  assert.equal(ok.ok, true);
  if (ok.ok) assert.equal(ok.day.total, 4);
});

test("parseUtcDate is calendar-true and rejects 2026-02-31", () => {
  assert.equal(parseUtcDate("2026-10-30").ok, true);
  assert.equal(parseUtcDate("2026-02-31").ok, false);
  assert.equal(parseUtcDate("2026-13-01").ok, false);
  assert.equal(parseUtcDate("not-a-date").ok, false);
  assert.equal(parseUtcDate("2026-02-31T00:00:00.000Z").ok, false);
});

test("retention helpers: 91 days ago is out, tomorrow is future", () => {
  assert.equal(isOutOfRetention("2026-07-31", NOON), true);
  assert.equal(isOutOfRetention("2026-10-01", NOON), false);
  assert.equal(isFutureDate("2026-10-31", NOON), true);
  assert.equal(isFutureDate("2026-10-30", NOON), false);
});

function createMemoryBlob(): BlobEventIO & { files: Map<string, string>; puts: number; lists: number } {
  const files = new Map<string, string>();
  const io: BlobEventIO & { files: Map<string, string>; puts: number; lists: number } = {
    files,
    puts: 0,
    lists: 0,
    async put(pathname, body) {
      io.puts += 1;
      files.set(pathname, body);
    },
    async get(pathname) {
      return files.has(pathname) ? (files.get(pathname) as string) : null;
    },
    async list(prefix, cursor) {
      io.lists += 1;
      if (cursor) return { pathnames: [] };
      return { pathnames: [...files.keys()].filter((k) => k.startsWith(prefix)) };
    },
    async del(pathnames) {
      for (const p of pathnames) files.delete(p);
    },
  };
  return io;
}

test("new day, no objects, 10 concurrent isolate flushes land on total=10 (10 trials)", async () => {
  const totals: number[] = [];
  for (let trial = 0; trial < 10; trial++) {
    const io = createMemoryBlob();
    await Promise.all(
      Array.from({ length: 10 }, (_, i) =>
        persistEvents(click(1, `iso-${i}`), { io, now, sleep: async () => {}, timeoutMs: 200 }),
      ),
    );
    const read = await readCountedDay("2026-10-30", { io, now });
    totals.push(read.status === "ok" ? read.day.total : -1);
  }
  assert.deepEqual(totals, Array.from({ length: 10 }, () => 10), `concurrent totals: ${totals.join(",")}`);
});

test("BlobUnknownError on one isolate write does not clobber other batches", async () => {
  const io = createMemoryBlob();
  await persistEvents(click(1, "kept"), { io, now, batchId: "kept", sleep: async () => {}, timeoutMs: 200 });
  const failing: BlobEventIO = {
    ...io,
    async put() {
      throw new BlobUnknownError();
    },
  };
  await assert.rejects(() =>
    persistEvents(click(1, "lost"), { io: failing, now, batchId: "lost", sleep: async () => {}, timeoutMs: 50, maxAttempts: 2 }),
  );
  const read = await readCountedDay("2026-10-30", { io, now });
  assert.equal(read.status, "ok");
  if (read.status === "ok") {
    assert.equal(read.day.total, 1);
    assert.equal(read.day.sources.kept, 1);
    assert.equal(read.day.sources.lost, undefined);
  }
});

test("a transient put error plus a late overwrite of the same batchId does not double-count", async () => {
  const io = createMemoryBlob();
  let first = true;
  const racing: BlobEventIO = {
    ...io,
    async put(pathname, body, signal) {
      if (first) {
        first = false;
        setTimeout(() => io.files.set(pathname, body), 30).unref();
        throw new BlobUnknownError();
      }
      await io.put(pathname, body, signal);
    },
  };
  await persistEvents(click(1, "once"), {
    io: racing,
    now,
    batchId: "same-id",
    timeoutMs: 200,
    maxAttempts: 3,
    sleep: async () => {},
  });
  await new Promise((r) => setTimeout(r, 50));
  assert.equal(io.files.size, 1);
  assert.equal(io.files.has(batchPath("2026-10-30", "same-id")), true);
  const read = await readCountedDay("2026-10-30", { io, now });
  assert.equal(read.status, "ok");
  if (read.status === "ok") assert.equal(read.day.total, 1);
});

function hangUntilAbort(signal: AbortSignal | undefined, onLand?: () => void): Promise<never> {
  return new Promise((_, reject) => {
    const land = onLand ? setTimeout(onLand, 5_000) : undefined;
    const fail = () => {
      if (land) clearTimeout(land);
      reject(Object.assign(new Error("The request was aborted."), { name: "AbortError" }));
    };
    if (!signal) return;
    if (signal.aborted) {
      fail();
      return;
    }
    signal.addEventListener("abort", fail);
  });
}

type AbortProbe = { called: number; signalDefined: number; aborted: number };

function emptyProbe(): AbortProbe {
  return { called: 0, signalDefined: 0, aborted: 0 };
}

function trackAbort(probe: AbortProbe, signal: AbortSignal | undefined): void {
  probe.called += 1;
  if (signal == null) return;
  probe.signalDefined += 1;
  const mark = () => {
    probe.aborted += 1;
  };
  if (signal.aborted) {
    mark();
    return;
  }
  signal.addEventListener("abort", mark);
}

test("a hanging put consumes the shared write budget once, not per attempt", async () => {
  const io = createMemoryBlob();
  const putProbe = emptyProbe();
  const hung: BlobEventIO = {
    ...io,
    async put(pathname, body, signal) {
      trackAbort(putProbe, signal);
      return hangUntilAbort(signal, () => io.files.set(pathname, body));
    },
  };
  const timeoutMs = 40;
  const started = Date.now();
  await assert.rejects(() =>
    persistEvents(click(1), { io: hung, now, timeoutMs, maxAttempts: 4, sleep: async () => {} }),
  );
  const elapsed = Date.now() - started;
  assert.ok(elapsed < 2 * timeoutMs, `shared 40ms budget, took ${elapsed}ms (per-attempt mutant is ~160ms)`);
  assert.equal(putProbe.called, 1, "budget leftover under 10ms must not start another put");
  assert.equal(putProbe.signalDefined, 1, "put must receive a signal");
  assert.equal(putProbe.aborted, 1, "exactly one in-flight put is aborted");
  await new Promise((r) => setTimeout(r, 60));
  assert.equal(io.files.size, 0, "aborted put must not land later");
});

test("hung put is aborted via signal and does not wait on the in-flight call", async () => {
  let aborted = false;
  const hung: BlobEventIO = {
    async put(_p, _b, signal) {
      await new Promise<void>((_resolve, reject) => {
        const timer = setTimeout(() => {}, 60_000);
        timer.unref();
        signal?.addEventListener("abort", () => {
          aborted = true;
          reject(Object.assign(new Error("The request was aborted."), { name: "AbortError" }));
        });
      });
    },
    async get() {
      return null;
    },
    async list() {
      return { pathnames: [] };
    },
    async del() {},
  };
  const started = Date.now();
  await assert.rejects(() =>
    persistEvents(click(1), { io: hung, now, timeoutMs: 40, maxAttempts: 1, sleep: async () => {} }),
  );
  assert.ok(Date.now() - started < 1000, "must abort instead of waiting on the hung put");
  assert.equal(aborted, true);
});

test("list failure is an error, not a legitimate empty day", async () => {
  const io = createMemoryBlob();
  await persistEvents(click(4, "kept"), { io, now, batchId: "kept", sleep: async () => {}, timeoutMs: 200 });
  const failing: BlobEventIO = {
    ...io,
    async list() {
      throw new Error("503 Service Unavailable");
    },
  };
  const read = await readCountedDay("2026-10-30", { io: failing, now });
  assert.equal(read.status, "error");
  const rec = createRecorder({ io: failing, now, prune: false, sleep: async () => {}, timeoutMs: 200 });
  await assert.rejects(() => rec.readStats());
  const still = await readCountedDay("2026-10-30", { io, now });
  assert.equal(still.status, "ok");
  if (still.status === "ok") assert.equal(still.day.total, 4);
});

test("readCountedDay: in-window clicks, in-window empty, out of retention, future, invalid", async () => {
  const io = createMemoryBlob();
  await persistEvents(click(2, "reddit"), { io, now, batchId: "a", sleep: async () => {}, timeoutMs: 200 });

  const withClicks = await readCountedDay("2026-10-30", { io, now });
  assert.equal(withClicks.status, "ok");
  if (withClicks.status === "ok") {
    assert.equal(withClicks.day.total, 2);
    assert.equal(withClicks.batches, 1);
  }

  const empty = await readCountedDay("2026-10-29", { io, now });
  assert.equal(empty.status, "ok");
  if (empty.status === "ok") {
    assert.equal(empty.day.total, 0);
    assert.equal(empty.batches, 0);
  }

  const gone = await readCountedDay("2026-07-31", { io, now });
  assert.equal(gone.status, "out_of_retention");
  if (gone.status === "out_of_retention") {
    assert.equal(gone.retentionDays, RETENTION_DAYS);
    assert.equal(gone.date, "2026-07-31");
  }

  const future = await readCountedDay("2026-10-31", { io, now });
  assert.equal(future.status, "ok");
  if (future.status === "ok") {
    assert.equal(future.day.total, 0);
    assert.equal(future.batches, 0);
  }

  const invalid = await readCountedDay("2026-02-31", { io, now });
  assert.equal(invalid.status, "invalid_date");
  if (invalid.status === "invalid_date") assert.equal(invalid.date, "2026-02-31");
});

test("a failed flush does not drop events that arrived while it was in flight", async () => {
  const io = createMemoryBlob();
  let release!: () => void;
  const gate = new Promise<void>((r) => {
    release = r;
  });
  let puts = 0;
  const gated: BlobEventIO = {
    ...io,
    async put(pathname, body, signal) {
      puts += 1;
      if (puts === 1) {
        await gate;
        throw new BlobUnknownError();
      }
      return io.put(pathname, body, signal);
    },
  };
  const rec = createRecorder({ io: gated, now, prune: false, sleep: async () => {}, timeoutMs: 200, maxAttempts: 1 });
  const first = rec.record({ channel: "stable", source: "lost", path: "/" });
  while (puts < 1) await new Promise((r) => setTimeout(r, 1));
  const second = rec.record({ channel: "stable", source: "kept", path: "/" });
  release();
  await Promise.all([first, second]);
  const read = await rec.readDay("2026-10-30");
  assert.equal(read.status, "ok");
  if (read.status === "ok") {
    assert.equal(read.day.sources.kept, 1);
    assert.equal(read.day.sources.lost, undefined);
    assert.equal(read.day.total, 1);
  }
});

test("readStats sums batches and keeps the same day shape, plus retentionDays", async () => {
  const io = createMemoryBlob();
  const rec = createRecorder({ io, now, prune: false, sleep: async () => {}, timeoutMs: 200 });
  await rec.record({ channel: "stable", source: "direct", path: "/" });
  await rec.record({ channel: "releases", source: "reddit", path: "/it" });
  const stats = await rec.readStats();
  assert.equal(stats.retentionDays, RETENTION_DAYS);
  assert.equal(stats.today.total, 2);
  assert.equal(stats.last7Days.total, 2);
  assert.equal(stats.last7Days.days.length, 7);
  assert.equal(stats.last7Days.to, "2026-10-30");
  assert.equal(stats.last7Days.from, "2026-10-24");
});

test("pruneExpired deletes objects older than 90 days and never writes a rollup", async () => {
  const io = createMemoryBlob();
  const old = utcDate(NOON - 91 * 86_400_000);
  io.files.set(batchPath(old, "stale"), JSON.stringify({ date: old, total: 9, channels: {}, sources: {}, paths: {} }));
  io.files.set(batchPath("2026-10-30", "fresh"), JSON.stringify({ date: "2026-10-30", total: 1, channels: {}, sources: {}, paths: {} }));
  await pruneExpired(io, NOON);
  assert.equal(io.files.has(batchPath(old, "stale")), false);
  assert.equal(io.files.has(batchPath("2026-10-30", "fresh")), true);
  assert.equal([...io.files.keys()].some((k) => k.endsWith("rollup.json") || k === `${dayPrefix("2026-10-30").slice(0, -1)}.json`), false);
});

test("mergeDays adds batches and does not reset", () => {
  const a = applyEvents(emptyDay("2026-10-30", NOON), click(2, "a"));
  const b = applyEvents(emptyDay("2026-10-30", NOON), click(3, "b"));
  const merged = mergeDays("2026-10-30", [a, b], NOON);
  assert.equal(merged.total, 5);
  assert.equal(merged.sources.a, 2);
  assert.equal(merged.sources.b, 3);
});

test("hung list returns a read error and the list signal is defined then aborted", async () => {
  const io = createMemoryBlob();
  io.files.set(batchPath("2026-10-30", "a"), JSON.stringify({ date: "2026-10-30", total: 4, channels: {}, sources: {}, paths: {} }));
  const listProbe = emptyProbe();
  const hung: BlobEventIO = {
    ...io,
    async list(_prefix, _cursor, signal) {
      trackAbort(listProbe, signal);
      return hangUntilAbort(signal);
    },
  };
  const timeoutMs = 50;
  const started = Date.now();
  const read = await readCountedDay("2026-10-30", { io: hung, now, timeoutMs });
  const elapsed = Date.now() - started;
  assert.ok(elapsed < 2 * timeoutMs, `list hang must end within the budget, took ${elapsed}ms`);
  assert.equal(read.status, "error");
  assert.equal(listProbe.called, 1);
  assert.equal(listProbe.signalDefined, 1, "listAll must pass signal; this fails if list is called without it");
  assert.equal(listProbe.aborted, 1, "deadline must abort list; Promise.race alone is not enough");
});

test("hung get returns a read error and both list and get receive an aborted signal", async () => {
  const io = createMemoryBlob();
  io.files.set(batchPath("2026-10-30", "a"), JSON.stringify({ date: "2026-10-30", total: 4, channels: {}, sources: {}, paths: {} }));
  const listProbe = emptyProbe();
  const getProbe = emptyProbe();
  const hung: BlobEventIO = {
    ...io,
    async list(prefix, cursor, signal) {
      trackAbort(listProbe, signal);
      return io.list(prefix, cursor, signal);
    },
    async get(_pathname, signal) {
      trackAbort(getProbe, signal);
      return hangUntilAbort(signal);
    },
  };
  const timeoutMs = 50;
  const started = Date.now();
  const read = await readCountedDay("2026-10-30", { io: hung, now, timeoutMs });
  const elapsed = Date.now() - started;
  assert.ok(elapsed < 2 * timeoutMs, `get hang must end within the budget, took ${elapsed}ms`);
  assert.equal(read.status, "error");
  assert.equal(listProbe.called, 1);
  assert.equal(listProbe.signalDefined, 1, "listAll must pass signal");
  assert.equal(getProbe.called, 1);
  assert.equal(getProbe.signalDefined, 1, "io.get must receive signal; this fails if get is called without it");
  assert.equal(getProbe.aborted, 1, "deadline must abort get; Promise.race alone is not enough");
});

test("two queued hanging flushes share one drain budget and skip the second under 10ms leftover", async () => {
  const io = createMemoryBlob();
  const putProbe = emptyProbe();
  const hung: BlobEventIO = {
    ...io,
    async put(_pathname, _body, signal) {
      trackAbort(putProbe, signal);
      return hangUntilAbort(signal);
    },
  };
  const timeoutMs = 50;
  const rec = createRecorder({ io: hung, now, prune: false, timeoutMs, maxAttempts: 4, sleep: async () => {} });
  const started = Date.now();
  const first = rec.record({ channel: "stable", source: "one", path: "/" });
  while (putProbe.called < 1) await new Promise((r) => setTimeout(r, 1));
  const second = rec.record({ channel: "stable", source: "two", path: "/" });
  await Promise.all([first, second]);
  const elapsed = Date.now() - started;
  assert.ok(elapsed < 2 * timeoutMs, `two queued flushes must end within one ${timeoutMs}ms drain, took ${elapsed}ms`);
  assert.equal(putProbe.called, 1, "second flush must not start when leftover is under 10ms");
  assert.equal(putProbe.signalDefined, 1);
  assert.equal(putProbe.aborted, 1);
});

test("two queued flushes: the second consumes the drain remainder, not a fresh timeoutMs", async () => {
  const io = createMemoryBlob();
  const putProbe = emptyProbe();
  let puts = 0;
  const firstDelayMs = 40;
  const hung: BlobEventIO = {
    ...io,
    async put(pathname, body, signal) {
      puts += 1;
      trackAbort(putProbe, signal);
      if (puts === 1) {
        await new Promise((r) => setTimeout(r, firstDelayMs));
        return io.put(pathname, body, signal);
      }
      return hangUntilAbort(signal);
    },
  };
  const timeoutMs = 80;
  const rec = createRecorder({ io: hung, now, prune: false, timeoutMs, maxAttempts: 1, sleep: async () => {} });
  const started = Date.now();
  const first = rec.record({ channel: "stable", source: "one", path: "/" });
  while (puts < 1) await new Promise((r) => setTimeout(r, 1));
  const second = rec.record({ channel: "stable", source: "two", path: "/" });
  await Promise.all([first, second]);
  const elapsed = Date.now() - started;
  assert.ok(
    elapsed < timeoutMs + 40,
    `second flush must use the leftover (~40ms), not a fresh ${timeoutMs}ms; took ${elapsed}ms`,
  );
  assert.ok(elapsed >= firstDelayMs, `elapsed ${elapsed}ms should include the first flush`);
  assert.equal(puts, 2, "both flushes must run so a per-flush deadline would be visible");
  assert.equal(putProbe.signalDefined, 2);
  assert.equal(putProbe.aborted, 1, "only the second (hanging) put is aborted");
});

test("readStats hanging list fails within the shared 7-day budget, never with empty days", async () => {
  const listProbe = emptyProbe();
  const signals = new Set<AbortSignal>();
  const hung: BlobEventIO = {
    async put() {},
    async get() {
      return null;
    },
    async list(_prefix, _cursor, signal) {
      trackAbort(listProbe, signal);
      if (signal) signals.add(signal);
      return hangUntilAbort(signal);
    },
    async del() {},
  };
  const readTimeoutMs = 80;
  const rec = createRecorder({
    io: hung,
    now,
    prune: false,
    timeoutMs: 80,
    readTimeoutMs,
    sleep: async () => {},
  });
  const started = Date.now();
  await assert.rejects(() => rec.readStats(), /deadline exceeded|aborted/i);
  const elapsed = Date.now() - started;
  assert.ok(
    elapsed < 2 * readTimeoutMs,
    `7 hanging days must share one ${readTimeoutMs}ms budget (not 7×); took ${elapsed}ms`,
  );
  assert.ok(listProbe.called >= 1);
  assert.equal(listProbe.signalDefined, listProbe.called, "every day list must receive the shared signal");
  assert.ok(listProbe.aborted >= 1, "shared deadline must abort in-flight lists");
  assert.equal(signals.size, 1, "one signal across all LOOKBACK_DAYS; per-day timers would create many");
  assert.ok(listProbe.called <= LOOKBACK_DAYS);
});

test("download-stats route declares maxDuration for one shared read, not 7×10s", async () => {
  const { readFile } = await import("node:fs/promises");
  const src = await readFile(new URL("../app/api/download-stats/route.ts", import.meta.url), "utf8");
  assert.match(src, /export const maxDuration = 15/);
});

function createPagedBlob(files: Map<string, string>, pageSize = LIST_PAGE): BlobEventIO & { lists: number } {
  const io: BlobEventIO & { lists: number } = {
    lists: 0,
    async put(pathname, body) {
      files.set(pathname, body);
    },
    async get(pathname) {
      return files.get(pathname) ?? null;
    },
    async list(prefix, cursor) {
      io.lists += 1;
      const all = [...files.keys()].filter((k) => k.startsWith(prefix)).sort();
      const start = cursor ? Number(cursor) : 0;
      const slice = all.slice(start, start + pageSize);
      const next = start + pageSize < all.length ? String(start + pageSize) : undefined;
      return { pathnames: slice, cursor: next };
    },
    async del(pathnames) {
      for (const p of pathnames) files.delete(p);
    },
  };
  return io;
}

test("listAll follows cursors: 2500 batches take 3 list pages and sum to 2500", async () => {
  const files = new Map<string, string>();
  for (let i = 0; i < 2500; i++) {
    const id = `b${String(i).padStart(4, "0")}`;
    files.set(
      batchPath("2026-10-30", id),
      JSON.stringify({ date: "2026-10-30", total: 1, channels: { stable: 1 }, sources: { direct: 1 }, paths: { "/": 1 } }),
    );
  }
  const probe = createPagedBlob(files, LIST_PAGE);
  const firstPage = await probe.list(dayPrefix("2026-10-30"));
  assert.equal(firstPage.pathnames.length, LIST_PAGE);
  assert.ok(firstPage.cursor, "more pages remain after the first");

  const io = createPagedBlob(files, LIST_PAGE);
  const read = await readCountedDay("2026-10-30", { io, now, timeoutMs: 5_000 });
  assert.equal(read.status, "ok");
  if (read.status === "ok") {
    assert.equal(io.lists, 3, "1000 + 1000 + 500");
    assert.equal(read.batches, 2500);
    assert.equal(read.day.total, 2500);
    assert.notEqual(
      read.day.total,
      firstPage.pathnames.length,
      "first page alone is 1000; this assertion fails if listAll stops there",
    );
  }
});
