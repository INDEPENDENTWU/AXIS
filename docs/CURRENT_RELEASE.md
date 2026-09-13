# Current Release — AXIS 8.25.1

**Status: Release candidate — Production seal pending**

AXIS **8.25.1 — Inline Set Morph** is the current Web release candidate. It retires the 8.25 body-level full-screen Set Lock presentation and converges set-completion feedback into the existing Active fact row without introducing a replacement text layer. It is not Production-sealed until the exact merged `main` SHA completes the Vercel → EdgeOne → `axis.juele.fun` certification chain.

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

That 8.25 SHA is the durable **runtime seal baseline**. It is **not a self-referential requirement** that the 8.25.1 candidate share the same SHA; provider evidence is replaced only after exact 8.25.1 merged-main certification.

## What 8.25.1 changes

The problem with the 8.25 presentation is spatial rather than factual: a large fixed completion overlay competes with the same Active interface the user is still operating. 8.25.1 removes that second visual plane entirely.

After the existing `completeSet()` has committed the set fact and the existing render boundary observes `done > prevDone`:

- the canonical set progress remains visible and is immediately the next truthful state, for example `第 2 / 4 组`;
- the progress text is never hidden, faded out or replaced by another completion sentence;
- the same fact row receives a small in-row completion node/check with no additional row height;
- a short bounded sweep travels across that existing fact row without covering text;
- the existing progress rail receives a restrained confirmation pulse;
- the existing primary button returns from the physical press while the clock receives only a micro-settle inside its own geometry;
- final-set completion strengthens the same node/rail confirmation rather than taking over the screen;
- the existing bounded two-beat haptic signature is retained where vibration is supported;
- `prefers-reduced-motion` removes sweep/recoil motion and keeps only a short local state confirmation.

The previous `#axis825SetLock` full-screen overlay is explicitly hidden and its trigger is retired. The earlier replacement `axis8251SetMoment` layer is also presentation-retired and forced out of layout. No completion feedback may use fixed/absolute positioning, obscure the timer/controls, or create an independent z-index plane.

## Ownership boundary

AXIS 8.25.1 adds no factual owner. Existing v87 `completeSet()` remains the sole set-completion action/truth boundary and continues to own `completedSets`, set timestamps and rest transition. The Inline Set Morph layer is pointer-inert presentation only and is triggered after that fact exists.

There is no new Session writer, Encounter writer, media writer, storage namespace/database, recorder, Active lifecycle owner, network owner, AI owner or historical rewrite. AXIS 8.24 tactile convergence, AXIS 8.24.1 dock occlusion and the AXIS 8.25 factual/haptic boundary remain Production-sealed and inherited.

## Release-blocking proof

The exact PR #151 head must prove inherited behavior plus the refined Inline Set Morph in Chromium and iPhone-like WebKit. Physical proof must show one factual completion, canonical progress advancing to `第 2 / 4 组` while remaining visible throughout feedback, the legacy full-screen overlay hidden, the replacement completion layer hidden, the feedback node contained inside the existing fact-row bounds, zero intersection with the clock and both Active controls, stable stage height, reduced-motion support, pointer-inert presentation and no viewport overflow.

After merge, the exact merged SHA must prove fixed Vercel Production parity/current-release flow, exact-prebuilt EdgeOne Chromium/WebKit current-release flow, and `axis.juele.fun` Chromium/WebKit proof. Final combined Vercel + EdgeOne Production status and all relevant main-push workflows must settle without unresolved failure.

Existing real user stores `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media` remain protected. Backup/account expansion remains deferred.
