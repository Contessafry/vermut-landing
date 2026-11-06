<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# vermut-landing — agent notes

Do not edit, move, or delete the Next.js markers above. `next dev` upserts that marked range in place and keeps text before/after it.

## Develop and test

- Node `>=20.9`. App Router lives at the repo root; `video/` is Remotion and is not part of `next build`.
- Before writing Next code, read the matching guide under `node_modules/next/dist/docs/` (this is Next 16.4; APIs differ from older training data).
- Commands: `npm install`, `npm run dev` (http://localhost:3000), `npm test`, `npm run lint && npm run typecheck`, `npm run build`.
- `npm test` is Node's test runner on `lib/download-core.test.ts` and `lib/download-store.test.ts` only (type-stripping flags are added for older Node). It uses an in-memory `BlobEventIO`. Do not add a test runner or extra packages unless asked.
- Counter work: extend those two test files and `lib/download-store.ts`. Keep `BlobEventIO` as the I/O seam. Do not call production Blob or `GET /api/download-stats`. Do not use production tokens, merge, or deploy.
- Leave SEO, UI, i18n, tracking, and `/api/download` redirect behavior alone unless a counter change is impossible without them. `HEAD /api/download` must not increment. Counting stays in `after()` after the 302.

## Download counter

Hobby plan, Vercel Blob only. No Redis, KV, Edge Config, extra services, or plan change.

### Current read path (why `/api/download-stats` 503s)

Click writes stay append-only: one object per isolate flush at `download-counts/YYYY-MM-DD/<batchId>.json`. `batchId` is minted once; retries reuse pathname + body with `allowOverwrite: true`. There is no shared counter object on the write path.

`readCountedDay` lists the day prefix (paginated, `LIST_PAGE` 1000) then **`get`s every batch serially**. `readStats` already runs the 7 lookback days in parallel on one `AbortSignal`. Shared budget is `READ_BUDGET_MS` (10s); route `maxDuration` is 15. Expiry is `503 { error: "blob_unavailable" }`, never a day of zeros. Write drain: `WRITE_BUDGET_MS` 20s under `/api/download` `maxDuration` 30. Prune (`RETENTION_DAYS` 90) has its own `PRUNE_BUDGET_MS` 8s and must not block the count.

Unverified external diagnosis (re-check with mocked I/O, not prod): ~129 batches, serial `get` ~47s, concurrency 8 ~7s. Token/store are believed reachable; the timeout is the serial fold.

Keep day/source/path maps (`DayCounts`, `KEY_CAP` 200 → `other`). Payload shape of `/api/download-stats` stays.

### Approved stats fix (read path only)

One persistent summary of the last successful fold, then increment by **new batch objects only**, **plus** a small bounded concurrency on those `get`s. Do not change the click-write algorithm unless a read-only fix cannot meet the 10s budget.

- Snapshot is additive. Do not delete in-window historical batches in production while this ships (including during migration). Existing prune of days older than 90 stays as-is.
- Fold by `batchId` set union. Never add two snapshots' `total`/`channels`/`sources`/`paths` together. Interrupted snapshot `put` must leave the previous summary and every source batch intact (no rename/copy+delete fold).
- Concurrent snapshot writers, overlapping reads, and a crash between list and put must not drop or double-count events. First snapshot create and later updates must be idempotent on the same batch set.
- Migration: missing summary → full batch fold (bounded-parallel `get`) → persist summary. Later reads: load summary + `get` only unlisted batches → persist. Overlap during deploy is the same as concurrent readers.

### Official Blob primitives (`@vercel/blob` ^2.8.2)

Use these if a shared summary is written: `put` + `ifMatch` (ETag from `head` / previous `put`; implies overwrite; `BlobPreconditionFailedError` on conflict), `allowOverwrite: false` for first create, `get`/`list`/`list({ mode: "folded" })`, `abortSignal`. `ifMatch` is single-object optimistic concurrency, not a lock and not a multi-key transaction. `list` is not atomic with `put`.

There is no distributed lock, no compare-and-swap across several pathnames, and no transactional fold in the SDK. Do not invent lock files, sleep-retry mutexes, or homemade CAS. If a snapshot write cannot be made safe with `ifMatch` + batchId idempotency + keeping source batches, stop and say so — do not ship an unlocked shared overwrite.

### Tests the fix must keep or add

Keep existing persist/retry/abort/prune/`readStats` 503-not-zeros/7-day-parallel/list-pagination/legacy-ignore tests.

Add (mocked `BlobEventIO`, no live store): bounded-concurrency `get` finishes N delayed batches inside `READ_BUDGET_MS` where serial would miss; summary + only-new-batches equals a full fold; two concurrent folds of overlapping batches do not double-count or drop maps; aborted snapshot put leaves batches and the previous summary; first-create vs `ifMatch` update; in-window batches are not deleted.
