import assert from "node:assert/strict";
import { test } from "node:test";
import { BlobPreconditionFailedError } from "@vercel/blob";
import {
  applyEvents,
  emptyDay,
  isConflictError,
  parseDayCounts,
  persistEvents,
  type BlobDayIO,
  type ClickEvent,
  type DayCounts,
} from "./download-store.ts";

const click = (n = 1, source = "direct"): ClickEvent[] =>
  Array.from({ length: n }, () => ({ channel: "stable" as const, source, path: "/" }));

test("applyEvents increments total, channel, source and path", () => {
  const day = emptyDay("2026-10-30", Date.parse("2026-10-30T00:00:00.000Z"));
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

function createFakeBlob(initial?: DayCounts): BlobDayIO & { writes: DayCounts[]; reads: number; backups: string[] } {
  let cell: { text: string; etag: string } | null = initial
    ? { text: JSON.stringify(initial), etag: '"etag-1"' }
    : null;
  let etagSeq = 1;
  const writes: DayCounts[] = [];
  const backups: string[] = [];
  const io: BlobDayIO & { writes: DayCounts[]; reads: number; backups: string[] } = {
    writes,
    backups,
    reads: 0,
    async readDay(date) {
      io.reads += 1;
      if (!cell) return { kind: "missing" };
      const parsed = parseDayCounts(cell.text, date);
      if (!parsed.ok) return { kind: "corrupt", text: cell.text, etag: cell.etag };
      return { kind: "ok", day: parsed.day, etag: cell.etag };
    },
    async writeDay(day, ifMatch) {
      if (cell) {
        if (!ifMatch || ifMatch !== cell.etag) throw new BlobPreconditionFailedError();
      } else if (ifMatch) {
        throw new BlobPreconditionFailedError();
      }
      etagSeq += 1;
      cell = { text: JSON.stringify(day), etag: `"etag-${etagSeq}"` };
      writes.push(day);
    },
    async saveCorrupt(_date, text) {
      backups.push(text);
    },
  };
  return io;
}

test("isConflictError recognises BlobPreconditionFailedError and 409 text", () => {
  assert.equal(isConflictError(new BlobPreconditionFailedError()), true);
  assert.equal(isConflictError(new Error("HTTP 409 Precondition Failed")), true);
  assert.equal(isConflictError(new Error("network down")), false);
});

test("persistEvents: 10 concurrent batches on a fake Blob land on total=10 (10 trials)", async () => {
  const date = "2026-10-30";
  const now = () => Date.parse(`${date}T12:00:00.000Z`);
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, Math.min(ms, 20)));
  const totals: number[] = [];
  for (let trial = 0; trial < 10; trial++) {
    const io = createFakeBlob();
    await Promise.all(Array.from({ length: 10 }, () => persistEvents(click(1), { io, sleep, now })));
    const read = await io.readDay(date);
    totals.push(read.kind === "ok" ? read.day.total : -1);
  }
  assert.deepEqual(totals, Array.from({ length: 10 }, () => 10), `concurrent totals: ${totals.join(",")}`);
});

test("persistEvents: stale etag retries, both clicks survive", async () => {
  const start: DayCounts = {
    date: "2026-10-30",
    updatedAt: "2026-10-30T00:00:00.000Z",
    total: 4,
    channels: { stable: 4 },
    sources: { direct: 4 },
    paths: { "/": 4 },
  };
  const io = createFakeBlob(start);
  let firstRead = true;
  const wrapped: BlobDayIO = {
    async readDay(date) {
      const result = await io.readDay(date);
      if (firstRead && result.kind === "ok") {
        firstRead = false;
        return { ...result, etag: '"stale"' };
      }
      return result;
    },
    writeDay: (day, ifMatch) => io.writeDay(day, ifMatch),
    saveCorrupt: (date, text) => io.saveCorrupt(date, text),
  };
  await persistEvents(click(1, "reddit"), { io: wrapped, sleep: async () => {}, now: () => Date.parse("2026-10-30T12:00:00.000Z") });
  const read = await io.readDay("2026-10-30");
  assert.equal(read.kind, "ok");
  if (read.kind === "ok") {
    assert.equal(read.day.total, 5);
    assert.equal(read.day.sources.reddit, 1);
    assert.equal(read.day.sources.direct, 4);
  }
});

test("persistEvents: a thrown GET does not write total=1 over an existing day", async () => {
  const start: DayCounts = {
    date: "2026-10-30",
    updatedAt: "2026-10-30T00:00:00.000Z",
    total: 60,
    channels: { stable: 60 },
    sources: { direct: 60 },
    paths: { "/": 60 },
  };
  const io = createFakeBlob(start);
  const failing: BlobDayIO = {
    async readDay() {
      return { kind: "error", error: new Error("503 Service Unavailable") };
    },
    writeDay: (day, ifMatch) => io.writeDay(day, ifMatch),
    saveCorrupt: (date, text) => io.saveCorrupt(date, text),
  };
  await assert.rejects(() => persistEvents(click(1), { io: failing, sleep: async () => {} }));
  const read = await io.readDay("2026-10-30");
  assert.equal(read.kind, "ok");
  if (read.kind === "ok") assert.equal(read.day.total, 60);
  assert.equal(io.writes.length, 0);
});

test("persistEvents: after 5 etag conflicts the batch is skipped, not guessed", async () => {
  const start: DayCounts = {
    date: "2026-10-30",
    updatedAt: "2026-10-30T00:00:00.000Z",
    total: 8,
    channels: { stable: 8 },
    sources: { direct: 8 },
    paths: { "/": 8 },
  };
  const io = createFakeBlob(start);
  const alwaysStale: BlobDayIO = {
    async readDay(date) {
      const result = await io.readDay(date);
      if (result.kind === "ok") return { ...result, etag: '"never-matches"' };
      return result;
    },
    writeDay: (day, ifMatch) => io.writeDay(day, ifMatch),
    saveCorrupt: (date, text) => io.saveCorrupt(date, text),
  };
  let writes = 0;
  const counting: BlobDayIO = {
    readDay: (date) => alwaysStale.readDay(date),
    async writeDay(day, ifMatch) {
      writes += 1;
      return alwaysStale.writeDay(day, ifMatch);
    },
    saveCorrupt: (date, text) => alwaysStale.saveCorrupt(date, text),
  };
  await persistEvents(click(1), { io: counting, sleep: async () => {}, now: () => Date.parse("2026-10-30T12:00:00.000Z") });
  assert.equal(writes, 5);
  const read = await io.readDay("2026-10-30");
  assert.equal(read.kind, "ok");
  if (read.kind === "ok") assert.equal(read.day.total, 8);
});

test("persistEvents: a hung Blob write is abandoned after timeoutMs", async () => {
  const hung: BlobDayIO = {
    async readDay() {
      return { kind: "missing" };
    },
    writeDay() {
      return new Promise((resolve) => {
        const timer = setTimeout(resolve, 60_000);
        timer.unref();
      });
    },
    async saveCorrupt() {},
  };
  const started = Date.now();
  await persistEvents(click(1), {
    io: hung,
    timeoutMs: 40,
    sleep: async () => {},
    now: () => Date.parse("2026-10-30T12:00:00.000Z"),
  });
  assert.ok(Date.now() - started < 1000, "timeout must not wait on the hung write");
});

test("persistEvents: corrupt JSON is backed up and not overwritten with total=0", async () => {
  const io = createFakeBlob();
  const wrapped: BlobDayIO = {
    async readDay() {
      return { kind: "corrupt", text: "{not json", etag: '"e1"' };
    },
    writeDay: (day, ifMatch) => io.writeDay(day, ifMatch),
    saveCorrupt: (date, text) => io.saveCorrupt(date, text),
  };
  await persistEvents(click(1), { io: wrapped, sleep: async () => {}, now: () => Date.parse("2026-10-30T12:00:00.000Z") });
  assert.deepEqual(io.backups, ["{not json"]);
  assert.equal(io.writes.length, 0);
});
