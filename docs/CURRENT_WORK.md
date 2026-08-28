# Current Work

## Production baseline at start of this work

The exact Production baseline for this governance slice is merged main `75f2798d694a5e450398be19f97c491cdf4c1c2f`, AXIS **8.21**.

That SHA is Production-sealed before this change:

- fixed Vercel Production serves the exact merged main artifact;
- fixed EdgeOne Production mirrors the same exact prebuilt artifact;
- Current Release, Runtime, Universal Practice Object, Deep Compatibility, Runtime Foundation, Cross-Platform Foundation, Repository and Work Continuity gates are green on the sealed release evidence;
- Production Chromium and iPhone-like WebKit flows pass on both providers;
- Vercel reported no runtime-error clusters in the post-release observation window;
- architecture remains `canonical-single-runtime`, one JavaScript request and zero dynamic runtime chunks.

The product/runtime ownership baseline is unchanged: Object/Session/Encounter truth remains app-owned, recording remains on the canonical app/v61 route, ongoing execution remains v82/v87-owned, and Flow remains sequence/context rather than a second Active owner.

Repository governance still identifies the long-running product milestone as **AXIS 8.21 — Flow / Session Blueprint** on governed active branch `product/821-flow-session-blueprint`. PR #105 is a bounded post-release child fix and does not replace that milestone identity.

The cross-platform foundation remains **axis-native-foundation-0**. Its native repository is `INDEPENDENTWU/AXIS-iOS`. Portable product/data/Flow semantics remain governed by `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1` and `axis.flow-provenance.v1`; Web DOM/CSS timing is an implementation detail and must not become a portable domain contract.

## Active change

**AXIS 8.21 — deterministic recording layout settle / first post-release source-governance slice**

- active branch: `fix/821-production-layout-stability`
- PR: `#105`
- base Production SHA: `75f2798d694a5e450398be19f97c491cdf4c1c2f`
- governed milestone: `AXIS 8.21 — Flow / Session Blueprint`
- governed milestone branch: `product/821-flow-session-blueprint`
- intended public identity change: **none; remains 8.21**
- intended factual ownership change: **none**
- executable diff: one source line in `v874-professional.js`

The sealed main Runtime Gate exposed one Chromium-only race that then passed on an isolated rerun. The failure was still useful evidence: the inherited recording surface could apply the already-intended `v874Tidy` presentation class roughly 35 ms after `#equipmentName` changed. A sufficiently fast first weight interaction could therefore observe a 5 px vertical settle even though the underlying recording value update was correct.

The source cause was an arbitrary timer inside the existing equipment-name MutationObserver:

```text
equipment identity mutation
  → wait 35 ms
  → tidyMusclePanel()
  → patchSetPlan()
```

PR #105 removes only that timer. The same existing v874 owner now performs the idempotent presentation convergence synchronously in the MutationObserver microtask:

```text
equipment identity mutation
  → tidyMusclePanel()
  → patchSetPlan()
```

The review-stage observer remains an idempotent lifecycle backup. No new observer, timer, CSS owner, persistence path, recorder, Encounter writer, Active owner or Flow owner is introduced.

This is intentionally a source-owner fix rather than a test relaxation. The strict existing recording-geometry assertion remains unchanged and must continue to require no more than `0.5px` movement across a first value interaction.

## Validation for this work

PR #105 is mergeable only if the exact head proves all of the following without weakening inherited assertions:

1. deterministic release build remains valid and AXIS identity remains 8.21;
2. the existing Chromium completion/recording geometry smoke passes unchanged, including the first weight-step geometry comparison;
3. iPhone-like WebKit inherited recording flows remain green;
4. Current Release Chromium/WebKit remain green through the 8.21 executable Object system;
5. Universal Practice Object and exhaustive Object capability contracts remain green;
6. Runtime Foundation, Deep Compatibility, Repository, Work Continuity and Cross-Platform Foundation gates remain green;
7. `axis-native-foundation-0` and the native `INDEPENDENTWU/AXIS-iOS` portability boundary remain unchanged;
8. no ownership or persistence contract changes are introduced by the presentation timing fix.

The critical regression invariant is deliberately unchanged:

```text
first recording value interaction
  must not rebuild the active row
  must not move the canonical recording controls by > 0.5 px
```

A green result therefore proves deterministic source convergence rather than hiding the original timing race with an added test wait.

## Next planned stage

After PR #105 is fully green and merged, re-verify the resulting exact main artifact on fixed Vercel and EdgeOne before beginning broader architecture cleanup.

The next governance phase will be incremental and evidence-preserving. It will inventory the current deterministic build pipeline and move runtime behavior out of historical `prepare-*` / `postbuild-*` string-rewrite stages into explicit source owners in small independent PRs. Priority order:

1. remove timer/observer-driven presentation convergence where the same owner can update synchronously or from a direct lifecycle signal;
2. identify postbuild behavioral rewrites that duplicate or supersede source logic;
3. move each behavior back to its canonical source owner before deleting the corresponding rewrite;
4. keep one factual/interaction owner for Recorder, Encounter, Active, Route, Flow, History and media domains;
5. preserve one-JS / zero-dynamic-chunk production behavior unless a separately reviewed architecture change proves a better result;
6. add governance gates that prevent new runtime behavioral mutation from being introduced in postbuild stages.

No broad refactor is allowed to ride inside a release/hotfix PR. Every cleanup slice must retain exact behavioral parity and pass Chromium + iPhone-like WebKit release evidence before merge.

Chat history is not authoritative project memory. GitHub governance, this handoff, contracts, exact main, deterministic build output and Production evidence are authoritative.
