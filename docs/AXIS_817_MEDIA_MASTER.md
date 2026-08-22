# AXIS 8.17 — Non-destructive Media Master Refinement

## Problem

Watermarking is useful for an AXIS record that is immediately saved or shared, but a permanently baked watermark is the wrong source for future comparison, composition, crop, edit or Evolution Replay work. The original camera/recorder result should not be lost just because the user chose to show an AXIS watermark today.

## Product decision

When watermark mode is enabled, AXIS now treats media as two roles without adding a second user workflow:

- **clean master** — the untouched captured photo/video kept privately for future factual analysis and editing;
- **canonical derivative** — the existing AXIS media pointer used by current UI, carrying the configured watermark when applicable.

The user does not have to choose between "record proof" and "keep a useful original" at capture time.

## Storage contract

No new database, object store, recorder, account or upload path is introduced.

The existing `axis_v42_media` object store remains the single media persistence owner. Existing event pointers remain unchanged:

- photos: `frameRefs[]` still point to `F-<event>-<index>`;
- video: `clipRef` still points to `V-<event>`.

When a watermark is enabled, the clean master is retained beside that canonical asset under a deterministic companion key:

- `F-<event>-<index>` → `F-RAW-<event>-<index>`;
- `V-<event>` → `V-RAW-<event>`.

This is deliberately not a second event-media schema. Old records remain valid without migration.

## Failure behavior

Clean-master retention is best-effort and must never make the canonical record fail. If local storage quota or another IndexedDB write error prevents retaining the extra master, AXIS continues saving the normal record and logs the local retention failure.

This protects the primary training/capture workflow from a storage-pressure regression.

## Watermark behavior

The visible saved AXIS photo remains the canonical derivative, preserving all existing UI and sharing behavior.

The final watermark compositor reads the clean master first when it exists, then falls back to the canonical asset. This prevents repeated watermark rasterization from becoming the source for later stamping.

Explicit recorded video keeps the untouched recorder blob before the existing optional watermark render is produced.

## Evidence behavior

Comparative Evidence is factual analysis rather than publishing. It therefore resolves the clean master first and falls back to the canonical media when no master exists.

This means current and future comparison surfaces are not visually polluted by the watermark while remaining fully compatible with historical AXIS records.

Media Evidence remains read-only and does not gain IndexedDB, LocalStorage, network, AI or recorder ownership.

## Lifecycle parity

Deleting a session deletes both canonical media and deterministic clean-master companions. Clearing saved videos deletes both the canonical video and its clean master. Clearing all data still deletes the existing media database as before.

No hidden orphan store is created.

## Validation

The refinement is sealed by:

- `prepare-817-media-master.mjs`;
- `postbuild-817-media-master-contract.mjs`;
- `scripts/axis-817-media-master-smoke.mjs`;
- the inherited `axis-817-interaction-gate.yml` on Chromium and iPhone WebKit.

Required manifest gates:

- `mediaMasterRetained817`;
- `watermarkNonDestructive817`;
- `mediaMasterSameStore817`;
- `mediaMasterNoSchemaChange817`;
- `mediaMasterDeleteParity817`;
- `evidencePrefersCleanMaster817`;
- `canonicalWatermarkDerivative817`.

## Boundary

This refinement is not Replay, not a creator editor and not a media-library redesign. It only makes current Capture safer for future AXIS capabilities by preserving the highest-value source material non-destructively.
