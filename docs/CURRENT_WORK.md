# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- exact merged `main` baseline: `a51c178d63afa7c6184e0e5751875d365cacefb0`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- merged product change: PR **#118**, truthful custom-range professional paginated Training Report PDF export
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**
- PR #118 reached the fixed Vercel Production identity and the Public Production Alias / legacy 8.12.x deployment gates passed, but `AXIS Production Deployment Gate` run `33894702683` failed in the inherited real-Chromium product-foundation stage
- the post-merge failure was narrowed to an inherited Training Record presentation defect: `#musclePanel` entered its final `v875Tidy` geometry only after the initially-hidden panel became visible/mutated, so the first metric interaction could cause a one-time height shift

The merged product already has canonical Session / Encounter truth, immutable Profile / Goal snapshots, session-time truth, `axis.report-range.v1`, the truth-backed Training Report UI, and the downstream browser-print PDF projection. None of those factual owners move in this repair.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable domain/data/Flow/Object/metric/report contracts remain unchanged.

## Active change

**AXIS 8.21 — Production muscle-panel layout stability repair**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `fix/production-muscle-layout-stability`
- pull request: **#120**
- exact base main SHA: `a51c178d63afa7c6184e0e5751875d365cacefb0`
- intended public release change: **none**
- new LocalStorage namespace / IndexedDB / network state / Session writer / Encounter writer / recorder / Active owner / Flow owner / Profile owner / historical range owner: **none**
- new product capability: **none; this is a Production-certification repair only**

### Product rule

The final Training Record muscle-panel geometry must exist before the panel's first visible interaction. A user changing the first metric must not be the event that applies a different layout class or changes the panel's structural height.

The repair is deliberately owned in canonical source: `index.html` pre-arms `#musclePanel` with the already-existing `v875Tidy` presentation class. It does not add another `prepare-*` / `postbuild-*` mutation step, does not create a wrapper/runtime owner, and does not alter the existing `v875` behavior or data model.

### Scope boundary

This repair may change only initial presentation state. It must not change:

- Session / Encounter persistence or historical facts;
- metric values, units, controls, or object capability truth;
- `axis.session-time.v1` or `axis.report-range.v1`;
- Training Report aggregation, PDF range semantics, pagination, or optional export-time Profile behavior;
- Active lifecycle, Flow continuity, Quick Record ownership, media ownership, or watermark ownership;
- release identity, storage topology, network behavior, or canonical single-runtime architecture.

No assertion may be weakened and no wait may be added merely to hide layout movement.

## Validation for this work

This repair is mergeable only when the exact final PR head proves all of the following:

1. deterministic `node build-release.mjs` still completes with the existing canonical architecture and release identity;
2. inherited Chromium and iPhone-like WebKit compatibility gates remain green;
3. metric optical / recording / Object / Session truth / Report Range Truth / Training Report / PDF export gates remain green without changed truth expectations;
4. Work Continuity and Repository governance contracts remain green on the same exact head;
5. the PR contains no new release mutation step solely to patch generated output;
6. after merge, the exact merged `main` SHA is deployed to the existing fixed Vercel AXIS Production project and passes `AXIS Production Deployment Gate`, including the inherited real-Chromium product foundation that failed on `a51c178d...`;
7. Public Production Alias, legacy Production gates and EdgeOne exact-artifact mirror also pass on that same merged SHA;
8. final merged-main workflow state has no failure, queued, in-progress, or null-conclusion run relevant to the certification chain;
9. Production runtime verification remains free of error/fatal findings.

A change that merely relaxes geometry assertions, waits for the late class change, moves factual ownership, or adds another generated-output patch layer does **not** satisfy this repair.

## Next planned stage

Only after PR #120 is merged and the exact merged SHA is fully Production-certified:

1. close the #118 post-merge certification incident as resolved;
2. resume AXIS product work from the existing truthful Report/Flow/Object foundation rather than redesigning it;
3. evaluate the next downstream Report representation (share-card / long-image) only if it remains a projection of `axis.report-range.v1`, not a second report truth system;
4. keep post-release architecture-governance cleanup separate from new product capability work.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.
