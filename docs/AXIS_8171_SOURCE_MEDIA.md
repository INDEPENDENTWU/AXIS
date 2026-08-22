# AXIS 8.17.1 — Clean-source Media Authority

## Goal

Watermarking is a presentation choice, not a destructive edit to the best captured source.

AXIS 8.17.1 already introduces untouched capture sidecars in the existing local media store. This refinement completes that model by making the sidecar the preferred input for watermark regeneration, factual Evidence and future media processing.

## One media model

AXIS keeps one database and one capture owner:

- database: `axis_v42_media`;
- capture / persistence owner: `app.js`;
- photo clean source: `sourceFrameRefs[]` → `S-*`;
- video clean source: `sourceClipRef` → `SV-*`;
- canonical photo refs: `frameRefs[]` → `F-*`;
- canonical video ref: `clipRef` → `V-*`.

No `F-RAW-*`, `V-RAW-*`, second IndexedDB database, second object store, second recorder or upload system is introduced.

## Source versus derivative

`S-*` and `SV-*` are the untouched local source assets captured before the AXIS compositor.

`F-*` and `V-*` remain the canonical compatibility / presentation assets used by existing AXIS records and UI. If a watermark is enabled, the canonical asset may contain the configured watermark; the clean source does not.

Existing event pointers are not migrated or replaced.

## Read bridge

`window.__AXIS_MEDIA_SOURCE__` is a read-only resolver owned by `app.js`.

For a canonical ref it resolves the matching clean sidecar when one exists, reads it from `axis_v42_media`, and falls back to the canonical ref for historical records or any record without a clean sidecar.

This creates one stable future-facing read contract without transferring persistence ownership to Evidence or another feature.

## Watermark contract

The v8710 watermark compositor writes only to the canonical `frameRefs[]` output.

Its input is now:

1. the corresponding `sourceFrameRefs[index]` clean photo when available;
2. otherwise the canonical photo, for backward compatibility.

Therefore changing or regenerating a watermark never needs to treat an already-watermarked derivative as the original source.

## Evidence contract

Media Evidence remains read-only. It asks the clean-source bridge for a blob first, then uses the inherited canonical media bridge as fallback.

The user sees the least-obstructed factual image for comparison while current record thumbnails, sharing behavior and historical records remain compatible.

Evidence gains no IndexedDB opener, LocalStorage writer, network owner, AI owner or recorder owner.

## Backward compatibility

Records created before clean sidecars existed continue to work unchanged:

- a missing `sourceFrameRefs[]` entry resolves to the existing `frameRefs[]` item;
- a missing `sourceClipRef` resolves to the existing `clipRef`;
- no migration is required.

## Scope boundary

This is not Replay and not a creator/editor surface. It only ensures that today’s watermark choice cannot unnecessarily reduce tomorrow’s media quality or flexibility.

## Validation

- `prepare-8171-source-first-media.mjs`
- `postbuild-8171-source-first-media-contract.mjs`
- `scripts/axis-8171-source-first-media-smoke.mjs`
- `.github/workflows/axis-8171-source-media-gate.yml`

Required gates:

- `captureCleanSourceSidecar8171`
- `mediaSourceBridge8171`
- `watermarkSourceFirst8171`
- `evidenceSourceFirst8171`
- `mediaCanonicalFallback8171`
- `mediaEventPointersUnchanged8171`
- `mediaNoNewPersistence8171`
