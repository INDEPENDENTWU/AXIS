# Current Work

## Production baseline at start of this work

The current merged `main` baseline is `1fa5a51b29ecefe0c40d58c62b7498039469c8e5`, AXIS **8.21**, from PR #106 (`AXIS 8.21 — Production recording prepaint geometry stabilization`).

That baseline is Production-certified. Fixed Vercel Production is green for the exact merged release, EdgeOne Production mirror is green, and the merged-main Current Release, Runtime, Runtime Foundation, Deep Compatibility and Production browser verification completed successfully. Public identity remains **8.21**.

Product/runtime ownership is unchanged: Object/Session/Encounter truth is app-owned, recording remains on the canonical app/v61 route, ongoing execution remains v82/v87-owned, and Flow remains sequence/context rather than a second Active owner. This work is architecture governance only; it must not change factual, persistence or product behavior.

Repository governance still identifies the long-running active milestone as **AXIS 8.21 — Flow / Session Blueprint** on governed active branch `product/821-flow-session-blueprint`. PR #107 is a bounded child architecture cleanup and does not replace that milestone or branch authority.

The cross-platform foundation remains **axis-native-foundation-0** with native repository `INDEPENDENTWU/AXIS-iOS`. Portable Web/iOS semantics remain governed by `axis.domain.v1` and `axis.data.v1`; browser build/postbuild mechanics are implementation details and are not promoted into the portable domain model by this refactor.

## Active change

**AXIS 8.21 — source-own Active projection**

- active branch: `refactor/821-active-projection-source-owner`
- PR: `#107`
- governed active milestone: `AXIS 8.21 — Flow / Session Blueprint`
- governed active branch: `product/821-flow-session-blueprint`
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
7. Repository, Work Continuity, Cross-Platform Foundation and PR Run Convergence contracts pass;
8. EdgeOne package/parity validation remains green;
9. no factual, storage, recorder, Encounter, Active or Flow ownership changes are introduced.

A bounded one-time migration runner already completed syntax validation, `git diff --check`, and an exact deterministic release build before writing the final source-owner commit. The migration runner and workflow delete themselves and therefore do not remain in the PR diff.

## Next planned stage

After PR #107 is fully green, merge it with the exact tested head, then verify the merged `main` gates before starting the next architecture-governance slice.

The broader direction remains incremental and evidence-preserving: retire historical `prepare-*` / `postbuild-*` behavioral mutation one owner at a time, move behavior into explicit canonical source owners, and keep every bounded PR behavior-compatible and dual-engine green. Do not combine multiple ownership families into one large rewrite.

Chat history is not authoritative project memory. GitHub governance, contracts, exact `main`, deterministic build output and Production evidence are authoritative.


## AXIS 8.21 native Flow / recording convergence — active work

- Certified rollback baseline before this work: `a591f40d093280a30cb0991e3623aae30276e0db`.
- Single bounded branch: `fix/821-native-flow-recording-convergence`; no additional product branches are required.
- Scope: source-own Quick Record saved-item metadata in `v61.js`; enforce optical center/full-width metric geometry in the existing 8.21 metric-control owner; restore Flow semantics so one complete Object is the execution unit and `开始此项` starts the existing v82/v87 Active lifecycle directly rather than opening Quick Record; keep Quick Record only for explicit temporary/detour records; render Flow Active/timeline/queue as native Today content; add smart run-only item/gap estimates.
- Ownership constraints: no new persistence namespace, recorder, Encounter writer, Activity owner, Flow truth owner, or schema migration. Existing `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, and `axis.flow-provenance.v1` remain authoritative.
- Cross-platform foundation remains `axis-native-foundation-0` and native repository remains `INDEPENDENTWU/AXIS-iOS`. Governed milestone remains `AXIS 8.21 — Flow / Session Blueprint` on `product/821-flow-session-blueprint`.
- Source-owner repair after the first PR gate: the inherited 8.17 interaction build still requires the Quick media evidence hook. `ensureQuickMedia()` is now source-owned in `v61.js` beside the Quick shell/metadata owner instead of restoring the retired 8.8.2 Quick renderer mutation. No additional runtime or persistence owner was introduced.
- Metric generation repair after the second PR gate: optical-fit listeners are generated into the canonical `app.js` runtime instead of executing in the Node prepare script; initial numeric width is emitted with each quantity/time control, then the same runtime fit helper updates width after direct input, step and preset changes. The physical centering thresholds remain unchanged.
- Whole-item build-contract convergence: stale set-level Flow proof tokens were retired; Flow click/pointer/timer consumers now emit inside the canonical app lexical owner; the retired Flow `active-set` action no longer exists; the coordination scope explicitly proves zero app-private Flow consumer leakage after the app IIFE.
- Deterministic release proof: the clean formal source set completed `build-release.mjs` successfully after the ownership and verifier convergence. Generated build mutations were not published to the branch; the final net diff remains bounded to source/test/governance files only.
- Merge criterion: unchanged inherited suites plus new dual-engine whole-item Flow, Quick metadata and <=0.5px value/unit optical-center proofs; then exact Vercel fixed-Production and EdgeOne Production parity before sealing.
