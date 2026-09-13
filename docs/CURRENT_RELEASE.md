# Current Release — AXIS 8.26

**Status: Release candidate — Production seal pending**

AXIS **8.26 — Active Continuity** is the current Web release candidate. It converges record-save visual settlement, Flow-to-Active execution, bounded set-completion motion and Home hierarchy while preserving the existing Session / Encounter / recorder / Active / storage ownership model.

## Exact candidate identity

- release PR: **#152**
- delivery branch: `release/826-active-continuity`
- exact sealed starting `main`: `f4d3d02e1a7b655185806b2dbb3bface804d93cc`
- version decision: **8.25.1 → 8.26 / bump / sequence 13 / product-ui**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate graph: **88 deterministic top-level steps**
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Last sealed runtime baseline

AXIS **8.25.1 — Inline Set Morph** remains the Production baseline until 8.26 completes merged-main certification.

- sealed `main`: `f4d3d02e1a7b655185806b2dbb3bface804d93cc`
- release PR: **#151**
- Vercel deployment: `dpl_DUuJiQoy8VnxRwcQLoGqCDckj1UX` — READY / Production / exact source SHA
- Current Release Gate `34761564240` — Chromium + iPhone-like WebKit success
- Deep Compatibility Gate `34761564210` — success
- EdgeOne Production run `34761564206` — exact-prebuilt deploy, Vercel parity, Chromium and WebKit success
- `axis.juele.fun` run `34761564467` — exact parity, Chromium and WebKit success
- combined Vercel + EdgeOne Production status — success

## What 8.26 changes

### Atomic save settlement

After the existing Encounter writer commits a record, the UI no longer renders a short-lived intermediate Home state before v82 decides whether canonical Active truth should exist. The recorder resets locally, v82 performs its existing admission, emits a settlement signal, and Home renders once into the truthful next state. A bounded timeout is fail-safe only. Saving feedback stays local to the save button; the old floating saving pill is retired and undo feedback remains outside the fixed Capture control geometry.

### Flow execution continuity

`開始此項` now has explicit execution semantics. Ongoing modes (`sets`, `rounds`, `timed`, `hold`) enter the existing v82/v87 Active lifecycle immediately. One-shot modes remain canonical-recorder-owned because recording is their completion fact. If another Active item exists, the established switch path pauses/preserves it before the Flow item starts; no second Active or Encounter writer is introduced.

### Kinetic set-completion cue

The Production-sealed 8.25.1 inline set-progress morph remains the factual presentation boundary. 8.26 adds a small `+1 組` kinetic numeral only after the existing `completeSet()` fact is committed. The cue is non-layout, pointer-inert, bounded, reduced-motion-safe and constrained to a stage-edge safe zone that must not overlap the clock, primary/secondary controls, Capture dock or bottom navigation.

### Quieter Home hierarchy

Duplicate Active summary and compact metric surfaces are removed from the visible composition. Repeated full-width dividers are reduced; hierarchy is carried by spacing, typography and subtle tonal grouping. No information needed to operate the current item or Flow is removed.

## Ownership boundary

8.26 creates no new factual authority. `app.js` remains the Session/Encounter and app-state owner, v61 remains the classic repeated-set owner, v82/v87 remain the Active lifecycle/action owners, and the existing media/database owners remain unchanged. Flow remains intent/orchestration rather than history. The 8.26 presentation and coordination layer has no independent persistence, network or AI authority.

## Release-blocking proof

The exact PR #152 head must pass Version Authority, Repository/Production governance, Work Continuity, Current Release Chromium + iPhone-like WebKit, Deep Compatibility and all inherited product gates. Physical proof must cover: no intermediate save flash; ongoing Flow direct Active; one-shot Flow canonical recorder; foreign Active pause/preserve; one factual set increment; safe non-overlapping kinetic cue; stable Active geometry; reduced motion; no viewport overflow; and unchanged single-owner facts.

After merge, the exact merged SHA must be the Vercel Production artifact, then the same exact prebuilt artifact must pass EdgeOne and `axis.juele.fun` parity plus Chromium/WebKit Production proof. 8.26 is not called Production-sealed before that chain settles green.

Existing stores `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media` remain protected.
