# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact `main` baseline for this bounded follow-up: `69e1051ed3cd9f79bedd3407fa1637574c39542d`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- public release identity: **unchanged; 8.21**
- architecture: **unchanged; `canonical-single-runtime`**
- fixed public Vercel URL: `https://axis-five-puce.vercel.app`
- deployment topology: one existing Git-connected AXIS Vercel Project on `main`, with EdgeOne mirroring the exact certified artifact
- existing Active truth/action owner: `v87` over `axis_v8_meta`
- existing Session/Encounter writer: canonical app owner
- existing rest truth: the current Activity lifecycle; no new timer or rest store is permitted
- cross-platform foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts preserved: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`

PR #129 is already merged into this baseline and made ordinary Active a flat, centered, Home-integrated execution stage. This follow-up starts from that certified structure instead of introducing another card, runtime or presentation owner.

## Active change

**AXIS 8.21 — Active Home tactile/rest cleanup**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `fix/821-active-home-tactile-rest-cleanup`
- PR: **#130**
- exact base `main` SHA: `69e1051ed3cd9f79bedd3407fa1637574c39542d`
- intended public release change: **none; remains 8.21**
- product objective: remove the remaining presentation debt visible in real mobile use without changing Active semantics
- executable refinement owner: `prepare-821-active-home-visual-convergence.mjs`, compiled after the certified Active Home compatibility pass
- affected proof surfaces: `scripts/axis-821-active-home-visual-contract.mjs` and `scripts/axis-821-active-home-visual-smoke.mjs`
- stage contract: `docs/ACTIVE_HOME_VISUAL_CONVERGENCE.md`

### User-visible behavior

1. `按住结束` keeps the existing v87 long-hold action but gains a restrained AXIS tactile treatment: branded accent/progress, compact depth, diamond cue, pressed state and focus state.
2. Paused rest duration is visible in exactly one place. The fact rail no longer paints a second rest clock; the inherited passive `#v87Rest` presenter remains the single visible rest-clock / Rest Speak slot.
3. Plain paused rest and Rest Speak use the same reserved paused-slot height so enabling Rest Speak cannot move the Active stage.
4. The flat Home rail, strict centered clock, balanced primary controls and separate `调整` row from PR #129 remain unchanged.

### Ownership and debt audit

This follow-up intentionally adds **no** LocalStorage namespace, IndexedDB database, API, network state, Session writer, Encounter writer, recorder, Active owner, Flow owner, timer owner or rest owner.

The duplicate rest display was presentation debt, not duplicate truth. The fix therefore removes the duplicate projection instead of creating synchronization logic. The long-hold visual refinement delegates to the already-existing v87 gesture/action owner. Flow-integrated Active remains isolated from the ordinary `#v87Now` stage.

The current compatibility pipeline is still intentionally layered: stage → compatibility → final visual convergence. This follow-up does not broaden scope by deleting historical prepare/postbuild transforms before reachability proof. That larger source-convergence work has its own next stage and exit criteria.

### Migration / rollback boundary

- no data migration;
- no historical Session/Encounter rewrite;
- no storage-key change;
- no deployment-topology change;
- rollback is limited to the bounded final visual-convergence source and its tests/docs;
- existing v87 Active semantics remain the rollback-safe authority throughout.

## Validation for this work

Merge is blocked until the exact final PR head proves all of the following:

1. deterministic `node build-release.mjs` succeeds with AXIS 8.21 and canonical single-runtime topology unchanged;
2. the static Active Home visual contract proves no storage/write/action owner was introduced;
3. real Chromium and iPhone-like WebKit prove the tactile hold geometry and existing v87 hold semantics;
4. real paused state exposes exactly one visible `休息 mm:ss` clock;
5. Rest Speak on/off is geometry-neutral in the integrated Active stage;
6. inherited Active Home semantic tests still prove pause/resume, set completion, pause-owned rest and hold-to-finish;
7. Deep Compatibility, Runtime, Flow/Object, Report, Repository Contract and Work Continuity gates remain green on the same exact head;
8. after merge, the exact merged `main` SHA must reach the existing AXIS Vercel Production project, pass the fixed-public-alias real-browser gate, and EdgeOne must mirror the same exact artifact with Chromium and iPhone-like WebKit verification.

A failure is fixed at its actual owner. Tests, compatibility gates and deployment checks must not be weakened merely to make this PR green.

## Next planned stage

Only after PR #130 is merged and the exact merged `main` artifact is Production-certified on both Vercel and EdgeOne:

1. begin the already-governed **Source Convergence / architecture-debt stage** rather than adding another UI wrapper;
2. audit the deterministic release pipeline by behavioral owner, starting with the Active/Home family touched by 8.21;
3. identify compatibility transforms that are now presentation-only or fully superseded, then retire them incrementally only with reachability and dual-engine regression proof;
4. preserve `canonical-single-runtime`, all current storage/history compatibility, v61 classic-set ownership, v82/v87 Active ownership, canonical Session/Encounter ownership and current public behavior;
5. reduce source/build indirection without changing the user-visible 8.21 contract unless a separately scoped product change is explicitly approved.

The target is not a rewrite. The target is fewer live mutation layers, clearer final owners, and a release pipeline whose source structure matches the already-proven runtime architecture.

Chat history is not authoritative project memory. Repository governance, exact `main`, deterministic build output and Production evidence remain authoritative.
