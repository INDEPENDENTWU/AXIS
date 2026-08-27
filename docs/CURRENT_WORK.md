# Current Work

## Production baseline at start of this work

The exact code baseline is merged main `e0e0c7d3b7ddc72e07b3f92ab6955ffc14a8ad79`, the merged result of PR #101 **AXIS 8.21 — Flow / Active Experience Convergence**.

That SHA reached the fixed Vercel Production endpoint and exact manifest/artifact parity was proved before browser execution:

- Vercel fixed Production: `https://axis-five-puce.vercel.app`
- source commit served during the failed Production gate: `e0e0c7d3b7ddc72e07b3f92ab6955ffc14a8ad79`
- public/base release identity: **8.21**
- architecture: `canonical-single-runtime`
- exact Production browser gate then failed on a cold-boot `ReferenceError`, so this SHA is **not** considered Production-sealed
- EdgeOne fixed Production remains `https://axisfitness-mirror-9x91gveo.edgeone.cool`; a new dual-provider seal is required after this hotfix merges

The Production failure was useful evidence, not a reason to weaken a gate: the first Flow/Active convergence pass appended two lifecycle listeners outside the lexical region that owns their private Flow helpers. A first scope correction removed the original `D is not defined` symptom but exact-head Chromium/WebKit then proved the listeners still could not resolve `axis821FlowRecorderContextClear`. This hotfix fixes the lexical ownership boundary itself.

The governed active milestone remains **AXIS 8.21 — Flow / Session Blueprint** and the governed parent branch remains `product/821-flow-session-blueprint` until the exact 8.21 artifact is dual-provider Production-sealed. This bounded hotfix branch does not replace that governance identity.

Cross-platform continuity remains anchored by `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1` and `axis.flow-provenance.v1`.

## Active change

**AXIS 8.21 — Flow Active Boot Scope Hotfix**

- branch: `hotfix/821-flow-active-boot-scope`
- base: `e0e0c7d3b7ddc72e07b3f92ab6955ffc14a8ad79`
- PR: `#102`
- intended product behavior change: **none beyond making the already-designed Flow/Active lifecycle actually executable on cold boot**
- intended public identity change: **none; remains 8.21**

The product model remains the #101 convergence model:

- Flow owns sequence/context only;
- the existing canonical recorder owns current-item recording;
- v82/v87 remain the Active lifecycle owners for sets / rounds / timed / hold;
- Flow advances only after a matching canonical one-shot commit or established Active finish;
- `臨時記錄其他` is record-only and cannot skip the current Flow step or create a second Active item;
- exactly one app-owned Encounter append remains.

The hotfix moves the Flow close/finish subscriptions into the same private lexical region as `axis821FlowRecordingIntent`, `axis821FlowRecorderContextClear` and `axis821FlowOnActiveFinished`. It must not export those private helpers to `window` merely to make scope resolution work.

This hotfix must not add or change:

- a second Flow runtime/store;
- Object picker ownership;
- Quick Record / Capture ownership;
- Session or Encounter writers;
- Active state ownership;
- persistence namespaces/databases;
- media/evidence ownership;
- request/chunk/runtime topology.

Historical provenance remains truthful:

- 8.18 Object / Capture / Evidence foundations remain 8.18;
- 8.19 Universal Practice Object remains 8.19;
- 8.20 Executable Practice Objects remains 8.20;
- 8.20.1 Object reliability / Active lifecycle remains 8.20.1;
- 8.21 Flow, canonical recording-property surface, metric-control system, item-unit convergence and Flow/Active convergence remain 8.21 capabilities.

## Validation for this work

PR #102 is not mergeable until its exact head passes all triggered gates. The candidate must prove, without relaxing assertions:

- no uncaught `D is not defined` or `axis821FlowRecorderContextClear is not defined` page error in Chromium or WebKit;
- exactly one Flow recorder-close listener and one `axis:active-finished` listener;
- those listeners are emitted in the private Flow helper region before `axis821CompleteCurrentItem()`;
- no private Flow helper/state is exported globally;
- exactly one authoritative `state.active.events.push(` Encounter append remains;
- current Flow sets/rounds/timed/hold delegate to existing Active time, pause/resume, rest and finish controls;
- one-shot current items advance only after canonical Encounter commit;
- temporary-other recording does not advance/skip Flow and does not create another Active item;
- explicit zero-property Objects remain zero-property;
- Chromium and iPhone-like WebKit physical Flow proof both pass;
- inherited Universal Practice Object, Deep Compatibility, Runtime and Current Release gates stay green;
- recording control geometry remains unchanged by a value step. The existing geometry assertion must not be loosened.

The earlier Production run also observed a `-22.75px` recording-control Y shift after the app boot exception. After the lexical scope defect is removed, the exact same geometry smoke decides whether that was a secondary boot symptom or a separate real defect. If it survives, fix the geometry rather than changing the threshold.

## Merge / Production discipline

After exact-head green, merge PR #102. Do not call the work complete merely because the PR merged.

The resulting exact main SHA must then satisfy all of the following on the fixed public endpoints:

1. Vercel Production is READY for that exact main SHA and anonymously serves the exact local 8.21 manifest/artifact;
2. the full Production browser gate passes without cold-boot page errors and without recording geometry drift;
3. EdgeOne mirrors the same exact prebuilt artifact only after Vercel/main parity converges;
4. Vercel ↔ EdgeOne manifest/artifact parity remains strict;
5. real Chromium Production lifecycle passes;
6. real iPhone-like WebKit Production lifecycle passes.

Only after that exact dual-provider seal is 8.21 Production considered healthy enough for the next product stage.

## Next planned stage

After the Flow/Active hotfix is exact-head green, merged, and dual-provider Production-sealed, continue the 8.21 Flow / Session Blueprint from the governed product direction rather than adding another execution owner. The next refinement should build on the now-unified experience: Flow provides context/progress while the established Active surface provides execution.

Chat history is not authoritative project memory. Conversation history is supplemental only. GitHub governance, contracts, exact main, deterministic build output and Production evidence are authoritative.
