# Current Release — AXIS 8.25.1

**Status: Release candidate — Production seal pending**

AXIS **8.25.1 — Inline Set Morph** is the current Web release candidate. It replaces the 8.25 body-level full-screen completion overlay with a stage-native, non-overlapping completion morph. It is not Production-sealed until the exact merged `main` SHA completes the Vercel → EdgeOne → `axis.juele.fun` certification chain.

## Exact candidate identity

- release: **AXIS 8.25.1 — Inline Set Morph**
- release PR: **#151**
- exact sealed starting `main`: `e28f0411288e42fc68e70a79a4180a06f7d18ee3`
- delivery branch: `axis-8251-inline-set-morph`
- version decision: **8.25 → 8.25.1 / bump / sequence 12 / product-ui**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate build graph: **87 deterministic top-level steps**; 8.25.1 is chained after 8.25 inside the existing late 8.24.1 release step rather than creating a parallel release path
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Last sealed runtime baseline

AXIS **8.25 — Set Lock Interaction** is the last fully Production-sealed runtime until 8.25.1 is certified.

- release PR: **#150**
- runtime seal baseline SHA: `e28f0411288e42fc68e70a79a4180a06f7d18ee3`
- canonical Vercel deployment: `dpl_HjrgujidrdBxDo9n243jnaoi4w5k` — READY / Production / exact main SHA
- Vercel Production gate `34747540811` — success
- Vercel Public Production Alias Gate `34747540777` — success
- EdgeOne deployment `dplc6t1yw7ho`, verification run `34747525787` — success
- EdgeOne verification artifact `10314134869`, SHA-256 `ce5215d42a6f78c1b8ff56d847bcea92b4e7325c35bebdc90ebada984fb3bfcb`
- `axis.juele.fun` verification run `34747525811` — exact parity plus Chromium and iPhone-like WebKit success
- combined Vercel + EdgeOne Production commit status — success

That 8.25 SHA is the durable **runtime seal baseline** and is not a requirement that the 8.25.1 candidate share the same SHA. Provider evidence is replaced only after exact 8.25.1 merged-main certification.

## What 8.25.1 changes

The problem with the 8.25 presentation is spatial rather than factual: a large fixed overlay can cover the same Active interface the user is still operating. 8.25.1 removes that visual-plane conflict instead of merely making the overlay smaller.

After the existing `completeSet()` has committed the set fact and the existing render boundary observes `done > prevDone`:

- the ordinary fact row stays in its existing grid position and keeps its height;
- its normal two-column facts briefly crossfade out in place;
- a compact centered confirmation such as `01 / 04 · 已完成` appears in that same row;
- the existing progress rail receives a short luminance/lock pulse;
- the existing primary button settles back from the physical press and the clock receives a restrained micro-settle;
- the confirmation fades back into the canonical next-state facts without moving the stage, timer or controls;
- final-set completion uses `本動作完成` in the same bounded row rather than taking over the screen;
- the existing bounded two-beat haptic signature is retained where vibration is supported;
- `prefers-reduced-motion` reduces the interaction to a short in-place fade.

The previous `#axis825SetLock` overlay is explicitly hidden by the 8.25.1 presentation layer and its trigger is retired. No completion moment may use fixed/absolute positioning or an independent z-index plane.

## Ownership boundary

AXIS 8.25.1 adds no factual owner. Existing v87 `completeSet()` remains the sole set-completion action/truth boundary and continues to own `completedSets`, set timestamps and rest transition. The new morph is pointer-inert presentation only, triggered after that fact exists.

There is no new Session writer, Encounter writer, media writer, storage namespace/database, recorder, Active lifecycle owner, network owner, AI owner or historical rewrite. AXIS 8.24 tactile convergence, AXIS 8.24.1 dock occlusion and the AXIS 8.25 factual/haptic boundary remain Production-sealed and inherited.

## Release-blocking proof

The exact PR #151 head must prove inherited behavior plus Inline Set Morph in Chromium and iPhone-like WebKit. Physical proof must show one factual completion, `01 / 04 · 已完成`, the legacy full-screen overlay hidden, the completion moment contained inside the existing fact-row bounds, zero intersection with the clock and both Active controls, stable stage height, resulting `第 2 / 4 组`, reduced-motion support, pointer-inert presentation and no viewport overflow.

After merge, the exact merged SHA must prove fixed Vercel Production parity/current-release flow, exact-prebuilt EdgeOne Chromium/WebKit current-release flow, and `axis.juele.fun` Chromium/WebKit proof. Final combined Vercel + EdgeOne Production status and all relevant main-push workflows must settle without unresolved failure.

Existing real user stores `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media` remain protected. Backup/account expansion remains deferred.
