# AXIS 8.21 — Full Portable Backup & Origin Migration

## Bounded baseline

- GitHub base: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- Branch: `feat/821-portable-backup-origin-migration`
- Public release identity stays AXIS 8.21.
- Architecture stays `canonical-single-runtime`.
- This phase does not merge with or depend on PR #131.

## Product purpose

A Safari-installed AXIS on one web origin must be able to hand the user's defined durable AXIS data to another AXIS web origin without cloud sync, account state or hidden server transfer. The concrete target is migration from the existing Vercel origin to `https://axis.juele.fun`, but the file is origin-independent.

Browser same-origin rules mean the destination cannot directly read the source origin's `localStorage` or IndexedDB. Migration is therefore an explicit local export/import boundary.

## Exact completeness claim

`axis.backup.v1` is lossless for the durable Web stores AXIS owns in this release:

1. every `localStorage` entry whose key begins with `axis_`, preserved as its exact raw string;
2. every entry in the canonical AXIS media store, preserved as exact decoded media bytes plus MIME type.

It intentionally does **not** claim to back up arbitrary browser state. Service Worker/cache state, Safari UI state, cookies belonging to unrelated services, temporary camera streams, transient in-memory UI state and non-AXIS origin storage are excluded.

The backup transport is not a workout, session, Activity, SetRecord, media or sync truth owner.

## File contract

- Schema: `axis.backup.v1`
- Extension: `.axisbackup`
- MIME: `application/vnd.axis.backup+json`
- Integrity: SHA-256 over deterministic canonical serialization of the payload excluding the `integrity` object.
- Media encoding in v1: base64. Array order is preserved and object keys are canonicalized for digesting.
- Source identity records Web origin and the AXIS domain/data/exchange contract identities.

The schema lives at `shared/contracts/axis-backup-v1.schema.json`.

## Media ownership

`app.js` remains the sole direct owner of IndexedDB media persistence. This phase extends the existing `window.__AXIS_MEDIA_STORE__` bridge with transport-only `entries()` and `replaceAll()` capabilities implemented inside that owner.

The backup runtime itself must not call `indexedDB.open`, `indexedDB.deleteDatabase`, or create another media persistence path.

## Export protocol

1. Flush the current canonical Web state with the existing save owner.
2. Snapshot all current `axis_*` localStorage raw values.
3. Ask the canonical media owner for all media entries.
4. Encode exact media bytes and MIME types.
5. Calculate counts and byte totals.
6. SHA-256 seal the deterministic payload.
7. Prefer the platform file share sheet when Safari permits file sharing from the current user activation.
8. Fall back to a normal `.axisbackup` file download when file sharing is unavailable or rejected.

Export is local only. No upload, fetch, XHR, WebSocket or beacon is introduced.

## Restore protocol

Restore is blocked while the canonical Web workout session is active.

For an idle destination:

1. user selects an `.axisbackup` file;
2. schema shape, AXIS key namespace, duplicate keys, media descriptors, manifest counts and SHA-256 integrity are verified before any mutation;
3. the UI previews source, training/event counts, AXIS storage count and media bytes;
4. after explicit confirmation, AXIS snapshots the destination's current AXIS storage and media as a rollback image;
5. incoming media is decoded and replaced through the canonical media owner;
6. AXIS-owned localStorage is replaced exactly; non-AXIS localStorage is left alone;
7. destination storage and media are read again and compared byte-for-byte/raw-string-for-raw-string with the incoming snapshot;
8. only after exact verification does the restore succeed and reload the app;
9. if any mutation or verification fails, the pre-restore destination snapshot is restored and re-verified.

There is no false cross-API atomicity claim. The guarantee is staged mutation plus verified rollback.

## User-facing contract

Settings → Data & Space exposes:

- `建立完整 AXIS 备份`
- `从 AXIS 备份恢复`

Before destructive restore, a dedicated preview shows integrity status and counts. A successful restore reports exact restored storage/media counts before the app reloads.

## Release gates

The phase is not complete until all of the following pass on the exact PR head:

- static ownership/network/schema contract;
- deterministic `node build-release.mjs`;
- Chromium round-trip smoke;
- iPhone WebKit round-trip smoke;
- corrupted digest rejected before mutation;
- injected restore failure returns to the exact pre-restore storage/media snapshot;
- active workout restore is blocked;
- foreign/non-AXIS localStorage survives restore;
- no new direct media DB owner.

Deployment is a separate release decision. `axis.juele.fun` must receive the exact same approved main artifact/SHA as the canonical AXIS release, never a China-only code fork.
