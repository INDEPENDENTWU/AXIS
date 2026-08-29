# Current Work

## Production baseline

AXIS **8.21** is Production-sealed.

- release PR: **#108**
- sealed runtime baseline SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- architecture: `canonical-single-runtime`
- Vercel seal deployment: `dpl_4ac8LR615ULNWJ45m1kSB7A6q9jX`
- Vercel Production gate: `33278987731` — success
- EdgeOne seal deployment: `dpysj966i0hh`
- EdgeOne verification run: `33278965885` — success
- Chromium current-release / Production proof: success
- iPhone-like WebKit current-release / EdgeOne live proof: success
- post-seal Vercel runtime errors: none found

The runtime baseline SHA is durable product release evidence. It is intentionally not defined as “the latest documentation/governance deployment SHA,” because a governance-only commit can itself cause a new provider deployment without changing product runtime behavior.

## Product state already sealed

The following 8.21 behavior is complete and must be preserved:

- source-owned localized Quick Record saved-item metadata
- explicit Object metric/execution semantics with immutable Encounter snapshots
- one complete Object as the Flow completion unit
- direct Flow current-item start through existing v82/v87 Active owners
- pause/resume/hold-finish delegation through those owners
- explicit Quick Record detours that do not consume/advance the Flow item
- ordinary `single/complete` one-shot behavior outside Flow
- narrow immutable Flow whole-item reuse of the existing Active lifecycle
- smart run-only item/gap planning and native Today Flow projection
- quantity/time/pace/scale/choice metric controls under the existing recorder owner
- applicable number/unit optical centering physically asserted at **≤ 0.5 CSS px**
- symmetric/full-width preset geometry
- no new Session, Encounter, Active, recorder, database or persistence owner

All ten formal PR workflow families passed on the exact PR #108 head before merge. Merged-main Vercel and EdgeOne Production verification also passed.

## Active milestone

**AXIS 8.21 — Post-release Architecture Governance**

- governed active branch: `main`
- public identity change: **none; remains 8.21**
- intended product behavior change: **none**
- intended persistence/factual ownership change: **none**
- cross-platform foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`

## Current bounded change

**Production governance truth reconciliation**

This change is governance-only. It repairs stale repository authority that still described 8.20.1 after the real 8.21 product had already been sealed.

Required outcomes:

1. `governance/project-state.json`, README, HANDOFF and CURRENT_RELEASE all identify AXIS 8.21 as current.
2. owner and retirement registries use 8.21 as their baseline and capture the final whole-item Flow ownership/retirement rules.
3. provider IDs are explicitly described as the **8.21 product/runtime seal evidence snapshot**, not a self-referential promise to equal every later governance-only deployment.
4. a dedicated Production Governance Contract independently reads the actual current release owner and fails if governed current release drifts behind it again.
5. the existing Repository Contract, build/runtime/product gates and canonical artifact behavior remain unchanged.
6. no runtime, storage, recorder, Object, Encounter, Active or Flow product code changes occur in this governance reconciliation.

## Next planned stage

After this governance reconciliation is fully green and merged:

1. perform a **separate toolchain-only Node upgrade** because the current EdgeOne CLI dependency graph now warns that repository Node `20.18.0` is below multiple supported-engine minima; inventory all Node pins and converge them to one supported Node 20.19+ baseline, then run the full release/Production chain;
2. resume the architecture-governance program by auditing all **89 deterministic release steps**, classifying every `prepare-*` and `postbuild-*` by source owner and behavior;
3. move runtime behavior out of historical build-time string/regex mutation into explicit canonical source owners one bounded slice at a time;
4. eventually restrict postbuild work to artifact assembly/minification/hash/manifest responsibilities where possible, while keeping data migration/compatibility proof explicit;
5. preserve one factual/interaction owner per capability, historical data readability, Chromium + iPhone-like WebKit proof and exact Production parity throughout.

Do not combine the Node toolchain change with source-owner governance. Do not perform a giant rewrite. Each bounded change must be independently reversible and green.

Chat history is supplementary context. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.
