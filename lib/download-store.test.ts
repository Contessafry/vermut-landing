import assert from "node:assert/strict";
import { test } from "node:test";
import { BlobUnknownError } from "@vercel/blob";
import {
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

test("a hanging put consumes the shared flush deadline and leaves no orphan write", async () => {
  const io = createMemoryBlob();
  let aborted = 0;
  const hung: BlobEventIO = {
    ...io,
    async put(pathname, body, signal) {
      signal?.addEventListener("abort", () => {
        aborted += 1;
      });
      return hangUntilAbort(signal, () => io.files.set(pathname, body));
    },
  };
  const started = Date.now();
  await assert.rejects(() =>
    persistEvents(click(1), { io: hung, now, timeoutMs: 80, maxAttempts: 4, sleep: async () => {} }),
  );
  const elapsed = Date.now() - started;
  assert.ok(elapsed < 400, `flush must end within the 80ms deadline, took ${elapsed}ms`);
  assert.ok(aborted >= 1, "deadline must abort the in-flight put");
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

test("hung list returns a read error within the deadline, not an empty day", async () => {
  const io = createMemoryBlob();
  io.files.set(batchPath("2026-10-30", "a"), JSON.stringify({ date: "2026-10-30", total: 4, channels: {}, sources: {}, paths: {} }));
  const hung: BlobEventIO = {
    ...io,
    async list(_prefix, _cursor, signal) {
      return hangUntilAbort(signal);
    },
  };
  const started = Date.now();
  const read = await readCountedDay("2026-10-30", { io: hung, now, timeoutMs: 50 });
  assert.ok(Date.now() - started < 400, "list hang must not wait on the platform timeout");
  assert.equal(read.status, "error");
});

test("hung get returns a read error within the deadline, not an empty day", async () => {
  const io = createMemoryBlob();
  io.files.set(batchPath("2026-10-30", "a"), JSON.stringify({ date: "2026-10-30", total: 4, channels: {}, sources: {}, paths: {} }));
  const hung: BlobEventIO = {
    ...io,
    async get(_pathname, signal) {
      return hangUntilAbort(signal);
    },
  };
  const started = Date.now();
  const read = await readCountedDay("2026-10-30", { io: hung, now, timeoutMs: 50 });
  assert.ok(Date.now() - started < 400, "get hang must not wait on the platform timeout");
  assert.equal(read.status, "error");
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
