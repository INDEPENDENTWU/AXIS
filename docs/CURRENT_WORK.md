# AXIS Current Work

## Production baseline at start of this work

AXIS **8.26.1 — Active Rest State** remains the last fully Production-sealed release at exact product/runtime SHA `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` from PR **#153**. Its fixed Vercel, EdgeOne and `axis.juele.fun` certification evidence remains authoritative until a later exact merged-main artifact earns a complete Production seal.

AXIS **8.26.4 — Active Rest Utility Rail** merged to `main` at `61ff52383eb8103cb3aeca985bfb9b1c50b04a23` from PR **#157** after exact-head Chromium and iPhone-like WebKit validation. Post-merge provider verification then exposed a separate inherited Review geometry defect in fixed Vercel Production run **36333871883**: the first weight edit caused `#v82Estimate` to be inserted late, increasing Review content height and moving `#axisSetControls` upward by **22.75px**. 8.26.4 therefore remains merged-but-unsealed provenance rather than Production authority.

## Active change

Active milestone: **AXIS 8.26.5 — Recording Review Geometry Stability** · **Release candidate**.

governed target branch: `main`.

Bounded delivery branch: `fix/8265-recording-review-geometry` · PR **#158**.

Version decision: **8.26.4 → 8.26.5 / bump / sequence 21 / bug-fix**.

The correction is intentionally narrow:

- The existing `#v82Estimate` row is structural in the Review shell before Review becomes interactive.
- Its established v82 owner binds and updates that row; v82 may no longer insert the row after a metric interaction.
- The row preserves its existing 54px height + 8px top spacing from the first interactive frame, so the first weight/reps edit cannot change Review composition.
- The existing `#axisSetControls` identity and x/y/width/height must remain stable within **0.5px** across the first metric edit.
- The estimate row itself must retain DOM identity and geometry across that edit.
- AXIS 8.26.4 Active Rest Utility Rail behavior remains inherited unchanged.

Training facts, metric values, recorder ownership, Session, Encounter, Flow, Active state, persistence, media, network and AI ownership remain unchanged.

## Validation for this work

The exact PR #158 head must pass Repository, Version Authority and Work Continuity contracts plus the full inherited Current Release / Deep Compatibility families. The existing Active Rest selector physical proof chains the new 8.26.5 Review geometry smoke so the already-required Chromium and iPhone-like WebKit paths prove:

- `#v82Estimate` exists at full structural height before recording controls are first editable;
- first weight edit changes the factual value exactly once;
- `#axisSetControls` is not rebuilt and its x/y/width/height each remain within 0.5px;
- `#v82Estimate` is not rebuilt and its x/y/width/height each remain within 0.5px;
- no uncaught browser error is introduced;
- inherited 8.26.4 running / paused / plan-complete Rest geometry remains green.

The 22.75px Production failure is a real product regression and the existing strict geometry assertion is not relaxed.

## Inherited platform continuity

Cross-platform continuity remains unchanged: foundation `axis-native-foundation-0`, native repository `INDEPENDENTWU/AXIS-iOS`, portable contracts `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, and `axis.report-range.v1`. Chat history is not authoritative project memory; repository governance remains authoritative.

## Next planned stage

After exact-head CI is green, merge PR #158 to `main` with the validated head SHA. Then certify that exact merged-main artifact through fixed Vercel Production, exact-prebuilt EdgeOne Production and `https://axis.juele.fun`, including Chromium and iPhone-like WebKit physical proofs. Only when all provider and physical gates are green may governance mark **AXIS 8.26.5 Production-sealed**. After that seal, begin the broader product-convergence roadmap around **Intent → Execution → Evidence → Evolution** rather than adding another corrective UI slice.
