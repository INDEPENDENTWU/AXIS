# Current Work

## Production baseline at start of this work

The exact code baseline is merged main `5a76e94c87463f46c018eb0ccda79ed661623e64`, the merged result of PR #102 **AXIS 8.21 — Flow Active Boot Scope Hotfix**.

That SHA proves the Flow/Active cold-boot scope defect is fixed:

- main Current Release and Deep Compatibility Chromium/WebKit gates are green;
- Vercel fixed Production anonymously serves the exact 8.21 main manifest/artifact;
- the earlier `D is not defined` and `axis821FlowRecorderContextClear is not defined` failures no longer occur;
- Flow physical proof follows the established pause-owned-rest lifecycle.

A subsequent exact Vercel Production browser run reported one recording-layout shift after a weight value step. This bounded hotfix investigates that report without changing product ownership or weakening the geometry contract.

Fixed endpoints remain:

- Vercel Production: `https://axis-five-puce.vercel.app`
- EdgeOne Production: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- public/base release identity: **8.21**
- architecture: `canonical-single-runtime`

The governed active milestone remains **AXIS 8.21 — Flow / Session Blueprint** and the governed parent branch remains `product/821-flow-session-blueprint`. This bounded Production hotfix does not replace that governance identity.

Cross-platform continuity remains anchored by `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1` and `axis.flow-provenance.v1`.

## Active change

**AXIS 8.21 — Recording Geometry Stability Hotfix**

- branch: `hotfix/821-recording-geometry-stability`
- base: `5a76e94c87463f46c018eb0ccda79ed661623e64`
- PR: `#103`
- intended public identity change: **none; remains 8.21**
- intended ownership change: **none**

The original Production failure measured a shared upward displacement of roughly `28.5px` across `#axisSetControls`, `#v8Sets` and the Group Plan row while their own dimensions stayed unchanged. `#reviewStage` kept the same top edge, indicating a possible earlier/upper reflow rather than a control-size mutation.

The branch therefore added failure-only direct Review-child geometry evidence while preserving the existing `0.5px` stability assertion. A temporary branch-only workflow then ran the same fixed Vercel Production geometry operation **12 consecutive times**. Result: **12 / 12 passed with the unchanged `0.5px` threshold; the reported 28.5px displacement did not reproduce.** No CSS offset, minimum-height compensation or relaxed threshold was introduced.

During exact-head compatibility validation, two independent inherited browser harnesses were also found to be bypassing current physical interaction semantics:

- the 8.18 Object/Capture smoke removed the Settings `.show` class directly instead of using the canonical Settings close action, bypassing route/inert/dock reconciliation before attempting Capture;
- iPhone-like WebKit compatibility used desktop-style `.click()` for Rest learning and later pause/resume interactions even though the current mobile product path is touch-driven.

Those harnesses now use the real product interaction path: canonical Settings close and touch-capable WebKit `tap`, while Chromium retains its mouse path. Behavioral assertions, pause-owned-rest semantics, geometry thresholds and runtime ownership are unchanged. At exact head `6dde6784cebd380371e699dcdb482d0098a27bf7`, Current Release, Runtime, Runtime Foundation, Deep Compatibility Chromium/WebKit, Repository, Work Continuity, Cross-Platform and PR Convergence all pass; the temporary diagnostic workflow is removed before the final merge candidate is accepted.

The existing product model remains unchanged:

- Flow owns sequence/context only;
- the canonical recorder owns recording;
- v82/v87 own ongoing Active execution;
- pause owns rest;
- temporary-other Flow recording is record-only;
- exactly one app-owned Encounter append remains.

This hotfix does not add or change:

- a second recorder, picker, Flow runtime, Active owner or Encounter writer;
- persistence namespaces/databases;
- media/evidence ownership;
- request/chunk/runtime topology;
- the established recording geometry threshold.

## Validation for this work

Before merge, the clean exact PR head must prove:

- the unchanged `0.5px` recording geometry assertion remains green;
- failure-only geometry diagnostics remain available without altering layout;
- tapping weight `+` changes only the intended value/state, not `#v8Sets`, `#axisSetControls` or Group Plan geometry;
- in-progress recording values remain intact;
- canonical Object recording properties, including explicit zero-property Objects, remain unchanged;
- legacy weight/reps recording ownership remains v61 where applicable;
- Flow current recording, temporary-other detour, Active finish and pause-owned rest remain green;
- inherited Chromium and iPhone-like WebKit tests use their real interaction modalities;
- all inherited Repository, Work Continuity, Cross-Platform, Universal Practice Object, Runtime, Current Release and Deep Compatibility gates remain green;
- no temporary branch-only diagnostic workflow remains in the merge candidate.

## Merge / Production discipline

Do not merge until the clean exact PR head is green. After merge, do not call the work complete until the exact resulting main SHA satisfies all of the following:

1. Vercel fixed Production serves the exact local 8.21 manifest/artifact;
2. Production browser gate passes the unchanged recording geometry assertion;
3. no cold-boot or Flow lifecycle page error occurs;
4. EdgeOne mirrors the same exact prebuilt artifact only after Vercel/main parity converges;
5. Vercel ↔ EdgeOne manifest/artifact parity remains strict;
6. real Chromium Production lifecycle passes;
7. real iPhone-like WebKit Production lifecycle passes;
8. the resulting main SHA has no unexplained independent red check.

Only that dual-provider exact-artifact seal completes this hotfix and reopens the next 8.21 Flow / Session Blueprint stage.

## Next planned stage

After the exact geometry hotfix is merged and dual-provider Production-sealed, continue the governed **AXIS 8.21 — Flow / Session Blueprint** from `product/821-flow-session-blueprint`. Preserve the unified model already established: Flow provides sequence/context/progress, the canonical recorder records facts, and existing Active owns execution. Do not create another execution surface to solve later Flow refinements.

Chat history is not authoritative project memory. Conversation history is supplemental only. GitHub governance, contracts, exact main, deterministic build output and Production evidence are authoritative.
