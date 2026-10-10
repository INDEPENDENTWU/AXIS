# AXIS 8.30 — Object Identity Integrity

**Status:** Governed 8.30 product-runtime candidate and version bump integrated on Draft PR #167. Final assembled search-ID repair has browser evidence; confirmed Encounter/Quick Record and inherited Active browser gates remain open. **Not merged, not shipped, not certified.**
**Baseline:** AXIS 8.29 exact Production-sealed runtime `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`, governance PR #165.
**Target branch:** `feature/830-object-identity-integrity`.

## AXIS 8.29 post-governance merged-main certification

- Governance PR [#165](https://github.com/INDEPENDENTWU/AXIS/pull/165) merged at `6713b47576e902c2015c63b7bb82b23691ec7a3c`; exact governance PR head 27/27 successful.
- Governance-main push workflow results: **27 total, 26 success, 1 cancelled Branch hygiene, 0 failure**.
- Vercel Git Production `dpl_8F4YQkfxRbVRRDZQw8CXkqSfPXrW` READY, exact governance-main commit `6713b47576e902c2015c63b7bb82b23691ec7a3c`; EdgeOne Production mirror run `37900944883` success; GitHub commit provider statuses success.
- Custom-domain run `37900945013` attempt **3** success, `axis.juele.fun` parity + Chromium/WebKit. Attempts 1 and 2 failed at the immediate post-reload UI text assertion in `scripts/axis-828-practice-loop-smoke.mjs:47` after runtime phase had restored; maintain a bounded UI-convergence check in subsequent governed test work.
- This post-governance verification does **not** change the certified AXIS 8.29 **product** runtime SHA `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`.
- Durable follow-up: [Object Identity Integrity — Issue #166](https://github.com/INDEPENDENTWU/AXIS/issues/166).

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

## Original source baseline

Initial source-only patch `7396cf07dacfa5e4a58f074156d47fab2894b60e` changes the legacy canonical catalog builder, ranked search picker, direct smart input, and read-only source risk probe. It routes selection by `id` and prefers explicit active Object identity. **Not yet tested as a built product, not merged, not certified.** Full category, historical fallback, classic writing, Flow and WebKit evidence is still required; additional integration fixes may be needed. The 8.30 version bump and CI are an admission condition before a normal merge.

## Next product direction

Once 8.30 is sealed, AXIS can safely introduce **Playable Practice**: PLAY THIS → AIR → TAKE → FORK. Shared challenge attempts must not inherit mistaken Object identity. These are planned capabilities, not implemented 8.30 functions.

## Release governance

The audit slice is intentionally **non-runtime** and does not change the governed 8.29 product version. Subsequent behavior-changing 8.30 commits require a new `version-decision.json` sequence 29 `bump` / `product-runtime`, bounded new release identity, independent test gates and Production certification before merge. `main` remains on exact sealed 8.29 until then.

## Exact-head engineering evidence — 2026-10-10

The original `prepare-8124` canonical-ID source projection was overwritten later in the assembled build by a `byName` catalog. That late owner collapsed same-label entries and omitted the native `chest-row` and `ski` IDs from search. The 8.30 convergence now explicitly converts the **final runtime** back to an ID-keyed projection and reconciles native IDs as authoritative. In Chromium run `38010491087`, the actual search debug returned `nativeMissing: []` and separate native/personal `chest-row` / `custom-identity-proof` candidates.

This result does **not** certify confirmed Encounter persistence. That run next exposed a test-path mismatch: the 8.20 `beginQuickRecorder` method is deliberately limited to Objects with explicit metric schemas; native Objects use normal Quick Record. The candidate browser smoke has been switched to the visible UI workflow for native IDs, pending exact-head engine results. Inherited 8.8.2 Active-state failure is separately unresolved in both engines.

Acceptance remains fail-closed: green source/build contracts and successful search indexing cannot substitute for a real selection → save → reload proof, historic fact immutability or the inherited Runtime Gate. Do not merge or seal until all required CI succeeds.
