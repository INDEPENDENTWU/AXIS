# AXIS Engineering Handoff

## Current release candidate and sealed baseline

AXIS **8.26 — Active Continuity** is the current Web release candidate. It is **not Production-sealed yet**.

Candidate delivery:

- release PR: **#152**
- exact sealed starting `main`: `f4d3d02e1a7b655185806b2dbb3bface804d93cc`
- bounded branch: `release/826-active-continuity`
- version decision: **8.25.1 → 8.26 / bump / sequence 13 / product-ui**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate graph: **88 deterministic top-level steps**

The last fully Production-sealed product/runtime is AXIS **8.25.1 — Inline Set Morph**:

- release PR: **#151**
- runtime seal baseline SHA: `f4d3d02e1a7b655185806b2dbb3bface804d93cc`
- canonical Vercel deployment `dpl_DUuJiQoy8VnxRwcQLoGqCDckj1UX` — READY / Production / exact main SHA
- Current Release Gate `34761564240` — Chromium + iPhone-like WebKit success
- Deep Compatibility Gate `34761564210` — success
- EdgeOne Production run `34761564206` — exact-prebuilt deploy + parity + Chromium/WebKit success
- governed custom-domain run `34761564467` — exact parity + Chromium/WebKit success
- combined Vercel + EdgeOne Production status — success

Those provider records are the 8.25.1 runtime seal snapshot and must not be relabeled as 8.26 evidence.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. No 8.26 work may migrate, clear, duplicate or rewrite them.

## AXIS 8.26 Active Continuity

This release is a bounded response to four real iPhone field failures/quality gaps.

### 1. Atomic save presentation

The established Encounter writer remains authoritative. After commit, the recorder may reset, but Home must not paint the short-lived state before v82 has decided whether canonical Active truth exists. 8.26 therefore waits for the existing v82 admission settlement signal and performs one Home render into the truthful next state; a bounded timeout is fail-safe only. Saving feedback stays local to the save button and undo feedback remains dock-safe. The old floating saving pill may not return.

### 2. Flow start that actually executes

`開始此項` now follows execution semantics instead of silently appearing inert. Ongoing modes (`sets`, `rounds`, `timed`, `hold`) enter the existing v82/v87 Active lifecycle immediately. One-shot modes (`single`, `complete`) remain canonical-recorder-owned because recording is their completion fact. If a foreign Active item exists, the existing switch path pauses/preserves it before starting the Flow item. Flow still owns intent only and may not become a second Active or Encounter writer.

### 3. Bounded kinetic set cue

The 8.25.1 inline set-progress morph remains Production-sealed factual presentation. After a real `completeSet()` commit, 8.26 may add one small `+1 組` kinetic numeral at the safe edge of the existing Active stage. It is non-layout, pointer-inert, reduced-motion-safe and must not intersect the clock, primary/secondary controls, Capture dock or bottom navigation. It cannot replace the canonical `第 n / total 組` truth or create another completion action.

### 4. Quieter Home hierarchy

Duplicate Active summary/compact metric surfaces and redundant full-width separators are retired. The same operational information remains available, but hierarchy is carried by typography, spacing and subtle tonal grouping rather than repeated cards and rules.

## Inherited ownership

- `app.js` remains canonical Session / Encounter / app-state owner.
- v61 remains classic repeated weight+reps set writer when immutable schema permits.
- v82/v87 remain Active lifecycle/action owners.
- Flow remains intent/orchestration only.
- 8.22 Replay, 8.23 Replay→Evidence, 8.24 Active Stage Tactile, 8.24.1 Dock Occlusion and 8.25.1 Inline Set Morph remain Production-sealed and inherited.
- v815 remains Media Evidence read/presentation owner.
- no new persistence namespace, database, network owner, AI owner, recorder, Session writer, Encounter writer or historical rewrite is allowed.

## Certification rule

One exact PR #152 head must pass all inherited contracts plus 8.26 physical proof in Chromium and iPhone-like WebKit. The release-blocking proof must verify:

1. no committed-but-not-yet-Active save flash;
2. ongoing Flow item starts exactly one existing Active while one-shot Flow stays canonical-recorder-owned;
3. foreign Active pause/preserve works without losing its progress;
4. set completion increments truth once and the kinetic cue remains non-overlapping, pointer-inert, reduced-motion-safe and geometry-neutral;
5. Home hierarchy simplification does not remove required actions or truth;
6. deterministic build remains 88 steps / one initial JS / zero dynamic runtime chunks;
7. Version Authority, Repository/Production governance, Work Continuity, Current Release, Deep Compatibility and inherited gates all settle green.

After merge, the exact merged `main` SHA must pass fixed Vercel Production, exact-prebuilt EdgeOne Production and `https://axis.juele.fun` parity plus Chromium/WebKit Production proof. Only then may AXIS 8.26 be described as Production-sealed.

Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain deferred from this bounded stage.

Authoritative resume order: `governance/project-state.json` → `governance/version-decision.json` → this handoff → `docs/CURRENT_RELEASE.md` → `docs/CURRENT_WORK.md` → owners/contracts/tests → exact Production evidence.
