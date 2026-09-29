# AXIS Engineering Handoff

## Current release state

AXIS **8.26.5 — Recording Review Geometry Stability** is the current Release candidate. AXIS **8.26.1 — Active Rest State** remains fully Production-sealed until an exact later merged-main artifact completes the certification chain.

AXIS **8.26.4** merged to `main` at `61ff52383eb8103cb3aeca985bfb9b1c50b04a23` from PR **#157**, but fixed Vercel Production run **36333871883** failed the inherited Chromium product-foundation geometry assertion. Before the first weight edit `#axisSetControls` was at y=602; after that edit it moved to y=579.25, a **−22.75px** shift. The before/after Review snapshot showed the cause directly: `#v82Estimate` was absent before the edit and then inserted as a 54px row with 8px top margin.

Candidate identity:

- candidate PR: **#158**
- bounded delivery branch: `fix/8265-recording-review-geometry`
- version decision: **8.26.4 → 8.26.5 / bump / sequence 21 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`

Sealed baseline identity:

- sealed release: **8.26.1**
- sealed PR: **#153**
- exact sealed product/runtime merge: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- canonical Vercel deployment `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deploy + Vercel parity + Chromium/WebKit success
- governed custom-domain run `35873719011` — exact parity + Chromium/WebKit success

The sealed SHA above remains product/runtime authority while 8.26.5 is candidate. `latestDeploymentIsAuthority` remains false.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. This corrective release does not migrate, clear, duplicate or rewrite them.

## AXIS 8.26.5 Recording Review Geometry Stability

8.26.4 itself passed its exact-head Active Rest candidate gates. The post-merge Production failure was an inherited Review-composition race: v82 owned the estimate control but created the control lazily. A user could therefore reach editable set controls before the estimate row existed; the first metric edit caused a DOM mutation, v82 then inserted the estimate row, and the bottom-anchored sheet shifted already-interactive controls.

8.26.5 removes the race rather than weakening the test. The Review shell owns the structural slot, while v82 remains the only estimate presentation/action owner. `renderEstimateControl()` now binds and updates the existing slot instead of inserting one. The structural CSS matches the existing 54px + 8px geometry from the first interactive frame.

### Truth and action boundary

The estimate row is presentation and planning context only. Existing metric controls remain the factual recording path; v82 keeps the existing estimate-sheet action. There is no new Session, Encounter, Flow, Active, recorder, persistence, network or AI writer.

### Required proof

PR #158 must pass Version Authority with the exact **8.26.4 → 8.26.5 / sequence 21** decision, Work Continuity, repository/runtime contracts, and inherited release gates.

The existing Active Rest physical path chains a dedicated 8.26.5 Review geometry smoke in both Chromium and iPhone-like WebKit. It must prove the estimate row exists before editability, the first weight edit changes the fact exactly once, both estimate/control DOM identities survive, and all x/y/width/height deltas stay within **0.5px**.

After PR validation, only the exact merged `main` artifact may become release authority, and only after fixed Vercel Production, exact-prebuilt EdgeOne Production and `axis.juele.fun` parity/behavior checks all pass.

## Next engineering rule

Do not add another corrective UI layer after this seal. Once 8.26.5 is Production-certified, move into the planned product-convergence program: capability-oriented architecture and semantic UI around **Intent → Execution → Evidence → Evolution**, then Domain Runtime, provenance, Workspace/enterprise foundations, bounded intelligence and SDK work in governed stages.
