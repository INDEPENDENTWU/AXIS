# AXIS Current Work

> Canonical engineering handoff. Read this before modifying AXIS. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest development state and next controlled step.

## Production baseline at start of this work

- Public product: AXIS 8.12
- Baseline `main`: `398ce5ddcf6ebf2480c501ef41b5036756b020b8`
- Architecture: `canonical-single-runtime`
- Verified release hash: `66d8097f7b56`
- Verified canonical runtime marker: `faf1d2f88421`
- Verified CSS marker: `b59f3946c3e5`
- AXIS 8.13 Runtime Stage 0/1 is merged but is not a production owner.

## Active change

PR #36 repairs field behavior discovered before Stage 2 Shadow Runtime begins.

### 1. Group plan source and availability

Current problem:

- `v61.js` rebuilds the entire `#v8Sets` surface after set-count/weight/reps changes.
- `v874-set-bridge.js` injects the Group Plan entry afterward, leaving a transient owner gap.
- Group Plan can therefore become temporarily unclickable and may reopen with a stale first-set baseline such as 20 kg / 10 reps even after the user changed the first set.

Target contract:

- the current `v61` strength draft is the only first-set baseline for Group Plan;
- after every draft rebuild, Group Plan is rebound synchronously;
- increasing/decreasing set count or editing first-set weight/reps must not make Group Plan unavailable;
- opening Group Plan must show the current first-set values, never a stale hidden control value.

Implemented convergence:

- `window.__AXIS_RECORDING__.first()` is the read-only first-set snapshot exposed by the existing recording owner;
- both the legacy Group Plan entry and the canonical `v8712` plan surface read that owner;
- the build manifest requires `groupPlanUsesRecordingOwner=true` so future DOM-derived regression fails the release build.

### 2. Active adjustment must follow the current event

Current problem:

`v879-runtime.js` creates the active adjustment button once and its click closure captures the event id that was current at creation time. When the active event changes, the same button can open the previous event and therefore show the wrong field model (for example cardio time/intensity for a strength activity).

Target contract:

- every adjustment invocation resolves `activeId()` at click time;
- strength exposes strength fields;
- cardio exposes cardio fields;
- the visible current event and edited event must always be identical.

The postbuild contract now protects current-event resolution rather than the retired captured-id implementation.

### 3. Rest belongs to pause, not set completion

Current problem:

- completing a strength set previously assigned `restStartedAt`;
- pausing previously cleared it.

That incorrectly equated “completed a set” with “entered rest.”

Current 8.12 compatibility contract:

- completing a set records only set completion;
- pause starts a rest interval;
- resume settles that interval;
- repeated pauses accumulate rest time on that activity;
- finishing a paused activity settles the open rest interval;
- existing active-time intervals remain the source of actual exercise time;
- learning/rest surfaces may use explicit paused rest, not inferred set completion.

Compatibility representation during 8.12:

- `restStartedAt`: current open paused-rest start, otherwise `null`;
- `restAccumulatedMs`: cumulative settled paused-rest duration.

Stage 2+ Runtime must absorb this semantic before the temporary compatibility transform is retired.

### 4. Pause visual continuity

Current contract:

- pausing must not remove/recreate the active card for a frame;
- the current event id remains stable through the state transition;
- native Safari tap highlight is removed from the pause control;
- state changes are rendered in place;
- the first paused frame is already the final rest presentation: `休息 00:00` at zero elapsed time, never the transient legacy copy `实际时间已暂停` followed by a second repaint.

The last point was added after the full Chromium Runtime Gate exposed a one-frame intermediate state even though the dedicated steady-state Field Gate already passed. This is treated as a product continuity defect, not hidden with an extra test delay.

### 5. Safari Home Screen learning continuity

Observed field issue:

Learning content appears in normal Safari but can disappear when AXIS is launched as an Add-to-Home-Screen standalone web app.

Hardening in this PR:

- learning surfaces remount on event-driven `pageshow`, visible `visibilitychange`, and window `focus` lifecycle boundaries;
- no polling is introduced;
- learning keeps no training ownership;
- learning preferences remain exclusively in the isolated `axis_v89_speak` store; the lifecycle bridge does not read or migrate training metadata;
- Chromium and iPhone-like WebKit tests explicitly emulate `navigator.standalone` / `display-mode: standalone` and verify a learning surface survives resume.

This is a compatibility/lifecycle fix, not a claim that browser storage containers are universally identical across all iOS versions.

### 6. Inherited test contracts follow current product semantics

The release test convergence now explicitly aligns historical browser fixtures to the current 8.12 product contract instead of preserving retired assumptions:

- 8.9 / 8.9.1 / 8.10 learning rest fixtures use explicit `status:'paused' + restStartedAt`;
- 8.10.1 is chained through the same release test-flow and verifies the 8.12 top-level learning summary `智能 · 混合` while separately requiring the non-default cadence to remain visible as `已自定` fine-tune state;
- inherited 8.8.2 verifies set completion stays active and explicit pause owns rest timing;
- no inherited test is allowed to force the product back to “完成一组 = 自动休息.”

## Implementation boundary

The product fixes above are consolidated in one final inherited-runtime transform:

`prepare-812-field-hardening.mjs`

It runs after 8.12 learning transforms and before `build-hardened.mjs`.

This file is intentionally temporary compatibility infrastructure. Do not duplicate these semantics in another prepare/postbuild patch. The 8.13 Runtime migration must eventually absorb them into proper owners.

Test-only compatibility alignment is kept under `scripts/prepare-*-test-flow.mjs` and must not become product ownership.

## Validation for this work

Dedicated gate:

`AXIS 8.12 Field Hardening Gate`

It runs the exact release build and dedicated regression in both:

- Chromium
- iPhone-like WebKit

Coverage includes:

- first-set Group Plan baseline after weight/reps changes;
- Group Plan availability after set-count rebuild;
- current-event adjustment type;
- no rest on set completion;
- pause-owned rest start/resume accumulation;
- multiple-pause cumulative rest;
- pause card continuity / no native tap highlight / no transient paused copy;
- Home Screen standalone learning lifecycle.

Before the final PR is merged, the exact PR head must have all inherited AXIS Runtime, Home, Reminder, 8.10.3, 8.11 and 8.12 gates green. Earlier successful runs are not reused after a subsequent code or contract commit.

## What remains deliberately unchanged

- Public version remains 8.12 for this repair.
- Stage 0/1 pure Runtime remains non-owning.
- No 8.13 Continue UI yet.
- No Live Route UI yet.
- No Reality Action gestures yet.
- No event journal or storage-owner migration yet.
- Camera, watermark, media store, AI, Language Studio corpus, sync and current production topology are outside this change unless a regression test proves an unintended interaction.

## Next planned stage

After this repair is merged and exact-main Production is verified:

**AXIS 8.13 Stage 2 — Shadow Runtime**

The Shadow Runtime may read real 8.12 snapshots and compute projections/diagnostics, but must not:

- render product UI;
- write training or accessory storage;
- alter routing/recommendations;
- take DOM ownership;
- perform network requests;
- change recording behavior.

Its first purpose is to compare projected continuation against real-world 8.12 sessions safely before any user-visible Runtime ownership transfer.
