# Current Release — AXIS 8.24

**Status: Release candidate — Production seal pending**

AXIS **8.24 — Active Stage Tactile Convergence** is the current Web release candidate. It is not Production-sealed until the exact merged `main` SHA completes the Vercel → EdgeOne → `axis.juele.fun` certification chain.

## Exact candidate identity

- release: **AXIS 8.24 — Active Stage Tactile Convergence**
- release PR: **#148**
- exact certified starting `main`: `2418103c786f2d0865aece49d738e9ed9161ef55`
- delivery branch: `axis-824-active-stage-tactile`
- version decision: **8.23 → 8.24 / bump / sequence 9 / product-ui**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate build graph: **86 deterministic top-level steps**
- topology: **1 initial JavaScript request / 0 dynamic runtime chunks**

## Last sealed runtime baseline

AXIS **8.23 — Replay Evidence Continuity** is the last fully Production-sealed runtime until 8.24 is certified.

- product behavior PR: **#146**
- final certification/infrastructure merge: **#147**
- runtime seal baseline SHA: `2418103c786f2d0865aece49d738e9ed9161ef55`
- Vercel Production gate `34685665958` — success
- Vercel Public Production Alias Gate `34685665973` — success
- EdgeOne deployment `dp2z63vp6fz9`, verification run `34685651257` — success
- `axis.juele.fun` verification run `34685651239` — success

That 8.23 SHA is the durable **runtime seal baseline**, **not a self-referential requirement** that the 8.24 candidate use the same SHA. Provider evidence is replaced only after exact 8.24 merged-main certification.

## What 8.24 changes

Active execution is visually and tactically converged around the existing v87 action boundary.

- strength has one set-progress truth: `第 n / total 组`, then `已完成 n / total 组`;
- remaining/estimated time is presented independently and no longer repeats set count;
- bounded press, rebound and active/completion micro-motion improve tactile state feedback;
- Capture / Quick Record fixed controls own an isolated opaque layer so scrolling separators cannot paint across the dock;
- reduced-motion users retain a stable non-animated presentation;
- existing pause, set completion, add-set and hold semantics remain unchanged.

## Ownership boundary

AXIS 8.24 adds no factual owner:

- no Session writer;
- no Encounter writer;
- no media writer;
- no new storage namespace or database;
- no recorder or Active lifecycle owner;
- no network or AI owner;
- no historical rewrite.

v87 remains the Active action/presentation boundary. Existing app/v61/v82/v87 owners remain authoritative. AXIS 8.23 Replay → Evidence continuity remains Production-sealed and inherited unchanged.

## Release-blocking proof

The exact PR #148 head must prove inherited behavior plus the 8.24 tactile contract without weakening browser, storage or ownership assertions.

After merge, the exact merged SHA must prove fixed Vercel Production parity and Chromium current-release flow including 8.24, exact-prebuilt EdgeOne Chromium/WebKit current-release flow including 8.24, and `axis.juele.fun` Chromium/WebKit 8.24 proof. Final combined Vercel + EdgeOne Production status and all relevant main-push workflows must settle without unresolved failure.

Existing real user stores `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media` remain protected. Backup/account expansion remains deferred.
