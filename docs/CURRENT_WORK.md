# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and next exact action.

## Production baseline at start of this work

- **AXIS 8.17 — Interaction Convergence** is the current Production-sealed baseline while 8.17.1 is validated.
- 8.17 Vercel and EdgeOne served the same canonical artifact and passed real EdgeOne Chromium + iPhone WebKit Production flows.
- 8.17 behavior remains the compatibility boundary: one Quick Capture supplement entry, Photo-first Capture, 3/5 second Scan sampling, one explicit <=60 second video, named two-slot Comparative Evidence, stable warm-before-commit media swap and time-first archive.

## Product direction

AXIS remains a **Personal Evolution Engine**.

`Capture / 留下` → truthful Encounter → time accumulation → `Reveal / 发现` → Evolution → later truthful Replay.

8.17.1 is a non-destructive Capture/media integrity patch. It does not add another creator/editor surface, recorder, database, object store, network owner or AI owner.

## Active change — AXIS 8.17.1 source-media integrity

PR #75 completes one clean-source media model on top of the already-converged 8.17.1 Capture polish.

### Media authority

- Existing local database remains `axis_v42_media` and remains owned by `app.js`.
- Clean photo sources use `sourceFrameRefs[]` → `S-*`.
- Clean video source uses `sourceClipRef` → `SV-*`.
- Existing canonical/presentation refs remain `frameRefs[]` → `F-*` and `clipRef` → `V-*`.
- No `F-RAW-*` / `V-RAW-*` competing scheme is allowed.
- Existing event pointers are not migrated or replaced.
- Historical records without source sidecars remain readable through canonical fallback.

### Processing contract

- `window.__AXIS_MEDIA_SOURCE__` is a read-only source resolver owned by `app.js`.
- Photo watermark regeneration reads the clean `S-*` source first and writes only the canonical `F-*` derivative.
- The final v8710 watermark compositor retains its frozen capture-time `shot` snapshot; 8.17.1 does not restore an older compositor.
- Media Evidence reads the clean source first and falls back to the canonical ref for historical records.
- Media Evidence remains read-only and gains no IndexedDB opener, local-storage writer, recorder, network or AI ownership.

### Build-order correction discovered during validation

The first 8.17.1 attempt ran runtime convergence too early, before the final 8.16/8.17 Capture and interaction structures existed. The release chain now keeps version preparation separate and runs 8.17.1 only after the final 8.17 interaction convergence.

A second inherited mismatch attempted to refine the retired v876 automatic reminder owner. That path remains retired; v8710 stays the single automatic sound owner.

A third mismatch targeted the pre-8.8.4 watermark loop. The 8.17.1 source-first patch now binds to the actual final frozen-`shot` compositor rather than weakening or replacing it.

## Validation for this work

PR #75 must not merge until all of the following are true:

1. deterministic release build completes with `8.17 / 8.17` and canonical single runtime;
2. 8.17.1 source-media postbuild ownership contract passes;
3. Chromium source-first media smoke passes photo source, video source and legacy fallback;
4. iPhone WebKit source-first media smoke passes the same behavior;
5. inherited 8.17 Interaction Convergence smoke passes;
6. inherited 8.16 Capture + Comparative Evidence smoke passes;
7. Repository Contract and Work Continuity Contract pass;
8. no timeout inflation, assertion weakening, second persistence owner or product rollback is used.

## Production seal after merge

After PR #75 is green and merged, the exact final `main` SHA must pass the normal Production path:

- Vercel exact-main success;
- canonical artifact parity;
- EdgeOne exact prebuilt deployment and live manifest/API parity;
- real EdgeOne Chromium Production flow;
- real EdgeOne iPhone WebKit Production flow;
- `EdgeOne Production` success on the exact final `main` revision.

Only after those checks pass is 8.17.1 Production-sealed.

## Next planned stage — 8.18

**AXIS 8.18 — Evolution Library / Personal Object Shelf** remains next after 8.17.1 is sealed.

The next scaling problem is an object-first personal world that remains usable after hundreds or thousands of Encounters. Replay remains downstream; do not pull Replay/editor scope into 8.17.1.

See `AXIS_817_818_DIRECTION.md` for the expansion contract.
