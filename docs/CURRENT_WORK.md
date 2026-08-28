# Current Work

## Production baseline at start of this work

The current merged `main` baseline is `1fa5a51b29ecefe0c40d58c62b7498039469c8e5`, AXIS **8.21**, from PR #106 (`AXIS 8.21 — Production recording prepaint geometry stabilization`).

That baseline is Production-certified. Fixed Vercel Production is green for the exact merged release, EdgeOne Production mirror is green, and the merged-main Current Release, Runtime, Runtime Foundation, Deep Compatibility and Production browser verification completed successfully. Public identity remains **8.21**.

Product/runtime ownership is unchanged: Object/Session/Encounter truth is app-owned, recording remains on the canonical app/v61 route, ongoing execution remains v82/v87-owned, and Flow remains sequence/context rather than a second Active owner. This work is architecture governance only; it must not change factual, persistence or product behavior.

## Active change

**AXIS 8.21 — source-own Active projection**

- active branch: `refactor/821-active-projection-source-owner`
- PR: `#107`
- base main SHA: `1fa5a51b29ecefe0c40d58c62b7498039469c8e5`
- intended public identity change: **none; remains 8.21**
- intended factual ownership change: **none**
- intended persistence ownership change: **none**
- source owners touched: `v82-runtime.js`, `v87-runtime.js`
- late build seal touched: `postbuild-821-executable-object-presentation-seal.mjs`

### Source-owner migration

Before this PR, the 8.21 final presentation seal injected two pieces of behavior into the already-built canonical runtime:

```text
v82 startActivity()
  → postbuild injects axis:active-truth-changed

v87 installEvents()
  → postbuild injects synchronous listener
```

This PR moves those two behaviors to their actual source owners:

```text
v82-runtime.js
  Active Truth creation
  → emit axis:active-truth-changed in source

v87-runtime.js
  installEvents()
  → consume axis:active-truth-changed in source
  → renderNow(true) + renderTimeline()
```

`postbuild-821-executable-object-presentation-seal.mjs` no longer mutates either of those functions. It only verifies that each source-owned contract exists exactly once and records `activeProjectionPostbuildMutation:false` in the release evidence.

No second Active owner, Encounter writer, recorder, storage writer, Flow owner or persistence owner is introduced. The event remains a presentation invalidation only; v82 remains the Active Truth creation owner and v87 remains the polished Active projection owner.

## Validation for this work

The PR is mergeable only when the exact final head proves all of the following without weakening inherited assertions:

1. deterministic `build-release.mjs` remains AXIS 8.21 / `canonical-single-runtime`;
2. `v82-runtime.js` contains exactly one source-owned `axis:active-truth-changed` emission for Active creation;
3. `v87-runtime.js` contains exactly one source-owned listener for that invalidation;
4. the final 8.21 presentation seal contains no build-time mutation of those two source functions;
5. same-task Active projection remains physically correct in Chromium and iPhone WebKit;
6. Current Release, Runtime, Runtime Foundation and Deep Compatibility gates pass;
7. Repository, Work Continuity and PR Run Convergence contracts pass;
8. EdgeOne package/parity validation remains green;
9. no factual, storage, recorder, Encounter, Active or Flow ownership changes are introduced.

A bounded one-time migration runner already completed syntax validation, `git diff --check`, and an exact deterministic release build before writing the final source-owner commit. The migration runner and workflow delete themselves and therefore do not remain in the PR diff.

## Next planned stage

After PR #107 is fully green, merge it with the exact tested head, then verify the merged `main` gates before starting the next architecture-governance slice.

The broader direction remains incremental and evidence-preserving: retire historical `prepare-*` / `postbuild-*` behavioral mutation one owner at a time, move behavior into explicit canonical source owners, and keep every bounded PR behavior-compatible and dual-engine green. Do not combine multiple ownership families into one large rewrite.

Conversation history is supplemental only. GitHub governance, contracts, exact `main`, deterministic build output and Production evidence are authoritative.
