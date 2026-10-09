# AXIS 8.30 — Object Identity Integrity

**Status:** Phase A identity inventory committed; initial Phase B source corrections committed and awaiting governed 8.30 version bump, build, automated proof and release certification. **Not shipped.**
**Baseline:** AXIS 8.29 exact Production-sealed runtime `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`, governance PR #165.
**Target branch:** `feature/830-object-identity-integrity`.

## Problem and evidence

Distinct native catalog entries can select the same older base equipment ID. This is a factual integrity defect, not a naming/translation defect. Confirmed source risk points:

- `prepare-8123-canonical-library-selection.mjs`: classic recorder resolves a name through past events before consulting current canonical selection, and may use `lib.baseId || lib.id`; Library selection also uses `item.baseId || item.id`.
- `prepare-8124-settings-catalog-polish.mjs`: ranked search assigns `pickId: x.baseId || x.id` and a resolver may select the first match on `baseId`.
- `v873-smart-input.js`: legacy smart selection routes by `item.baseId`.
- `v873-exercise-library.js`: base families legitimately group multiple separate movements. `run` and `treadmill`; `seated-row` and `chest-row`; `leg-curl`, `seated-curl`, and `lying-curl` are distinct canonically named movements.

`baseId` may remain implementation / equipment family metadata, but **must never silently become the recorded Object identity**. Aliases are search vocabulary, not an instruction to merge different Objects.

## Identity and provenance contract

1. Each native or custom Object has exactly one stable canonical `id`; a UI selection retains that `id` through detail, Quick Record, classic recording, Flow, Active, Encounter and Evolution.
2. Distinct canonical IDs may share aliases, muscle groups or equipment families. Search results must not collapse such entries into the same recording target.
3. Explicitly selected Object ID takes precedence over historical events with matching display name; the classic recorder remains the canonical writer in its existing bounded domain.
4. `eqById` resolves an exact Object first. Historical fallback stays read-only, preserves the original `equipmentId`, and never invents a more specific exercise solely from `baseId`.
5. Previously committed ambiguous `row`, `treadmill` or `legcurl` Encounters **must not be silently migrated or relabeled**. An old generic ID cannot prove which exact movement occurred. Future attribution requires independent evidence or explicit user consent; keep original facts.
6. No new storage namespace, media store, Session/Encounter writer, network dependency or AI authority is introduced.

## Delivery slices

### A. Inventory and invariant design
- Enumerate all native IDs, names, base families, aliases, custom prefixes and history fallbacks.
- Run `node scripts/axis-830-object-identity-audit.mjs --json` to capture reproducible collision evidence.
- Move the audit to `--enforce` only when every identified route is fixed.

### B. Exact-path corrections — source patch in progress
- Route native Library and ranked search selection by `id`, not by `baseId`.
- Expose a read-only current selection projection for classic recording; historical same-name data cannot override explicit current selection.
- Keep metadata/metric-schema fallback separate from event identity; avoid creating duplicate custom Objects as a selection workaround.
- Preserve valid history-only IDs and custom Object identity.

### C. Physical proof
- Cross-check native catalog selections, personal/custom overlap, Quick Record and regular Recorder, recent/history fallback, Flow, Active and Evolution.
- Specifically assert two distinct displayed movements create two distinct new Encounter `equipmentId` values, and existing stored events are unchanged.
- Chromium and iPhone-like WebKit; repeat after page reload, PWA-style reentry and edited schema.
- Exact-head green → protected merge → Vercel, EdgeOne, custom-domain certification → governance-only seal.

## Current implementation head

Initial source-only patch `7396cf07dacfa5e4a58f074156d47fab2894b60e` changes the legacy canonical catalog builder, ranked search picker, direct smart input, and read-only source risk probe. It routes selection by `id` and prefers explicit active Object identity. **Not yet tested as a built product, not merged, not certified.** Full category, historical fallback, classic writing, Flow and WebKit evidence is still required; additional integration fixes may be needed. The 8.30 version bump and CI are an admission condition before a normal merge.

## Next product direction

Once 8.30 is sealed, AXIS can safely introduce **Playable Practice**: PLAY THIS → AIR → TAKE → FORK. Shared challenge attempts must not inherit mistaken Object identity. These are planned capabilities, not implemented 8.30 functions.

## Release governance

The audit slice is intentionally **non-runtime** and does not change the governed 8.29 product version. Subsequent behavior-changing 8.30 commits require a new `version-decision.json` sequence 29 `bump` / `product-runtime`, bounded new release identity, independent test gates and Production certification before merge. `main` remains on exact sealed 8.29 until then.
