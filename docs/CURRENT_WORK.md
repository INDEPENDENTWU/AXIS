# Current Work

## Production baseline at start of this work

The baseline for this bounded slice is merged main `e8467319a4fd28d42c590e92f9bea5b094808349`, which contains Production-sealed PR #91 **AXIS 8.21 — Flow User Surface**.

That baseline has already converged as one exact artifact across the fixed Production endpoints:

- Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`

The exact merged PR #91 artifact passed real Chromium and iPhone-like WebKit verification on both Production mirrors. It includes the app-owned Flow runtime, canonical Object recording-property surface and user-visible Today Flow composition/run surface while retaining the public 8.20.1 release identity.

The architecture remains deliberately single-owner:

- Flow definitions and one FlowRun: existing `axis_v60_state` app owner;
- Object identity/schema: existing Object Truth;
- Object picker: existing canonical `eqSheet`;
- Quick Record: existing `v61.js` + app recorder lifecycle;
- Session/Encounter truth: existing app writer;
- Active truth: existing Active owners;
- media: existing source-first/media owners.

No child slice may add a second storage namespace, picker, recorder, Active owner, Session writer or Encounter writer merely to advance 8.21.

Cross-platform continuity remains anchored by `axis-native-foundation-0`, `INDEPENDENTWU/AXIS-iOS`, `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1` and `axis.flow-provenance.v1`.

## Governed parent milestone

The governed milestone remains **AXIS 8.21 — Flow / Session Blueprint**.

The governed active branch remains `product/821-flow-session-blueprint`; PR #92 is a bounded convergence child branch and does not replace that parent governance identity.

This PR is a bounded convergence child slice after the merged user surface. It exists to prove the real-world deviation path before public release identity is advanced to 8.21.

## Active change

**AXIS 8.21 — Flow Reality Seal**

- branch: `product/821-flow-reality-seal`
- PR: **#92**
- base: merged/Production-sealed PR #91 main `e8467319a4fd28d42c590e92f9bea5b094808349`

This slice adds no new product runtime behavior owner. It extends the physical proof chain to the field path users actually need when reality diverges from a Flow:

`Flow 当前项 → 临时记录其他 → ordinary Quick Record → real non-Flow Encounter → 返回原 Flow 当前项 → 记录当前 → matching real Flow Encounter → advance/complete → 收起`

The required semantics are:

- `临时记录其他` is a normal factual Encounter and must not inherit Flow provenance;
- an ordinary detour Encounter must not advance the Flow cursor, set Flow `lastEncounterId`, skip the intended current Object or silently finish the Flow;
- after that detour, the original current Flow Object remains visibly current;
- only explicit `记录当前` establishes the UI-owned pending step intent;
- only the subsequently committed matching Encounter with immutable Flow provenance may advance that step;
- completed Flow remains explicit until the user chooses `收起`;
- `收起` clears only FlowRun intent and must preserve the saved Flow definition and all factual Encounter provenance.

The new proof is `scripts/axis-821-flow-reality-smoke.mjs`. It runs through the same dual-engine physical chain as the existing recording-property and Flow user-surface proofs. `prepare-821-flow-user-surface-proof.mjs` now appends that reality proof after the existing user-surface proof.

## Validation for this work

PR #92 is not mergeable until its exact latest head proves:

- deterministic build and repository contracts remain unchanged;
- Work Continuity sees this handoff update in the same executable-code PR;
- Runtime, Runtime Foundation, Deep Compatibility, Current Release, Cross-Platform Foundation and Universal Practice Object gates are green;
- Chromium and iPhone-like WebKit both execute the existing 8.21 Flow runtime and recording-property proofs;
- Chromium and iPhone-like WebKit both execute the existing Flow composition/run proof;
- Chromium and iPhone-like WebKit both execute the new real-world detour proof;
- the detour Encounter is committed exactly once and has no Flow provenance;
- the Flow cursor/current step remain unchanged after the detour;
- the matching `记录当前` Encounter carries exact `flowRef` and `flowStepRef` provenance and is the only fact allowed to advance the step;
- the two factual Encounters remain ordered as detour then intended current Encounter;
- explicit dismissal clears only FlowRun while preserving the saved Flow and byte-stable historical provenance;
- no page errors or duplicate product owners appear.

An inherited browser check may be rerun only when logs demonstrate a pre-existing timing/environment flake unrelated to this slice; product assertions themselves must not be weakened to obtain green CI.

After merge, the exact main artifact must again converge on the fixed Vercel Production URL and the same exact prebuilt artifact must pass real Chromium and iPhone-like WebKit verification on EdgeOne before the reality seal is considered complete.

## Next planned stage

Only after PR #92 is merged and Production-sealed should the public release identity converge from **8.20.1 → 8.21**.

That release-convergence slice should:

1. advance only the current public/base release owner and current release contracts;
2. preserve historical 8.18 / 8.19 / 8.20 / 8.20.1 module provenance rather than relabeling old capabilities;
3. include the Flow runtime, canonical recording-property surface, Flow user surface and reality/deviation proof in the governed current-release boundary;
4. prove exact Vercel + EdgeOne parity in Chromium and iPhone-like WebKit after merge;
5. stop there — do not introduce 8.22 adaptive behavior until 8.21 is fully sealed as one factual product release.

Chat history is not authoritative project memory. Conversation history is supplemental only. GitHub governance, contracts, tests, current main and Production evidence are authoritative.
