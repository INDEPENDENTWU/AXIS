# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact `main` baseline for this bounded follow-up: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- public release identity: **unchanged; 8.21**
- architecture: **unchanged; `canonical-single-runtime`**
- production request topology: **1 initial JS / 0 dynamic JS chunks**
- fixed public Vercel URL: `https://axis-five-puce.vercel.app`
- fixed public EdgeOne URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- deployment topology: one existing Git-connected AXIS Vercel Project on `main`, with EdgeOne mirroring the exact certified artifact
- existing Active truth/action owner: `v87` over `axis_v8_meta`
- existing Session/Encounter writer: canonical app owner
- existing rest truth: the current Activity lifecycle; no new timer or rest store is permitted
- cross-platform foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts preserved: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`

PR #130 is merged at `c434a4a78530669d5a47be9799d40f5049b57a2d`. Its repository and dual-engine product contracts are the exact behavioral base for this architecture-only follow-up. The fixed Vercel/EdgeOne certification of that merged base remains an external merge gate while Vercel's Hobby build-rate limit is active; this branch may be proved completely but must not merge before that provider gate clears.

### Inherited bounded-stage continuity references

These are historical compatibility identifiers required by already-sealed 8.21 contracts. They are **not** the current Production baseline or active delivery branch:

- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- bounded delivery branch: `feat/821-report-pdf-export`
- bounded delivery branch: `feat/821-report-share-card`
- exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`
- bounded Flow step recording intent branch: `feat/821-flow-step-recording-intent`
- certified Flow step recording intent base: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- bounded Flow step execution intent branch: `feat/821-flow-step-execution-intent`
- certified Flow step execution intent base: `396241c41b2f8eea80d45ca582352ea593c47036`
- bounded delivery branch: `feat/821-active-home-stage`
- exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`
- bounded Active Home visual-convergence branch: `feat/821-active-home-visual-convergence`
- exact Active Home visual-convergence base `main` SHA: `9eaf90d0f94023218feb452b085da48c9f027276`

PR #129 established the flat, centered, Home-integrated ordinary Active stage. PR #130 retained that structure while refining the tactile hold/rest presentation. This source-convergence work starts from those certified semantics rather than adding another UI/runtime owner.

## Active change

**AXIS 8.21 — Active Home Source Convergence**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `arch/821-active-home-source-convergence`
- PR: **#131**
- exact base `main` SHA: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- intended public release change: **none; remains 8.21**
- intended user-visible behavior change: **none**
- source-owner objective: remove the late Active Home visual mutation from canonical build reachability and move the already-proven final visual contract into the stage source owner
- explicit visual source: `styles/axis-821-active-home.css`
- stable runtime capability identity: `window.__AXIS_821_ACTIVE_HOME_VISUAL__`
- stable style compatibility identity: `#axis821ActiveStageRefineStyle`
- source proof: `scripts/axis-821-active-home-visual-contract.mjs`
- dual-engine behavior proof: `scripts/axis-821-active-home-visual-smoke.mjs` plus inherited `scripts/axis-821-active-home-stage-smoke.mjs`
- architecture handoff: `docs/ACTIVE_HOME_SOURCE_CONVERGENCE.md`

### Source-owner handoff

Before this slice, ordinary Active Home presentation was assembled by three sequential behavioral prepares:

1. `prepare-821-active-home-stage.mjs`
2. `prepare-821-active-home-stage-compat.mjs`
3. `prepare-821-active-home-visual-convergence.mjs`

After this slice:

1. `prepare-821-active-home-stage.mjs` owns the final flat Home rail, centered execution clock, balanced controls, tactile long-hold presentation, separate Adjust row and single-visible-rest projection, using `styles/axis-821-active-home.css` as explicit visual source.
2. `prepare-821-active-home-stage-compat.mjs` remains only for inherited semantics: pause-owned rest/countdown truth, execution-aware set controls, canonical pause/resume label compatibility, standalone Learning lifetime and the stable read-only Flow ticker.
3. `prepare-821-active-home-visual-convergence.mjs` remains repository provenance but is unreachable from the canonical release chain.

Execution-aware set controls are preserved. The runtime marker and style identity remain stable so existing browser proofs validate the same public capability rather than an implementation rename.

### User-visible behavior that must remain exact

1. Ordinary Active remains a flat Home-integrated rail, not a floating card.
2. The execution clock remains strictly centered.
3. Pause/resume and the execution-aware primary action remain balanced large controls.
4. `调整` remains a separate tertiary row with no overlap.
5. `按住结束` keeps the existing v87 long-hold action and tactile presentation.
6. Paused rest duration is visible in exactly one place through the inherited passive `#v87Rest` presenter; the fact rail may not regain a second rest clock.
7. Rest Speak on/off remains geometry-neutral.
8. Flow-integrated Active remains isolated from ordinary `#v87Now`.
9. No transient duplicate action, second timer, delayed geometry repair or replacement writer is permitted.

### Ownership and migration boundary

This source convergence intentionally adds **no** LocalStorage namespace, IndexedDB database, API, network state, Session writer, Encounter writer, recorder, metric fact owner, Active owner, Flow owner, timer owner or rest owner.

`v87` remains the ordinary Active pause/resume, set completion, add-set and long-hold finish action owner. `v82`/`v87` remain the established Active lifecycle. The canonical app remains Session/Encounter authority. v61 remains the classic repeated weight/reps writer only when immutable Encounter schema grants that authority. Flow remains intent/orchestration rather than historical truth. Automatic sound remains v8710-owned. The inherited 5-second sustained positional shake behavior and sealed 30fps media path are outside this slice and unchanged.

No data migration, historical Session/Encounter rewrite, storage-key change or deployment-topology change is permitted. Rollback is bounded to restoring the late visual prepare's build reachability and removing the stage-owned visual source handoff; no user-data rollback is involved.

## Validation for this work

Merge is blocked until the exact final PR head proves all of the following without weakening existing behavioral assertions:

1. deterministic `node build-release.mjs` succeeds with public/base AXIS 8.21 and `canonical-single-runtime` unchanged;
2. the static source contract proves the final visual CSS/marker are stage-source-owned and `prepare-821-active-home-visual-convergence.mjs` is unreachable from the canonical release chain;
3. the inherited Active Home Stage contract remains green;
4. real Chromium and iPhone-like WebKit preserve the flat rail, centered clock, balanced controls, tactile hold, isolated Adjust row and single visible rest clock;
5. inherited pause/resume, set completion, pause-owned rest, long-hold finish, Rest Speak, Flow isolation, Learning lifetime and sound contracts remain green;
6. Deep Compatibility, Runtime, Current Release, Cross-Platform, Repository Contract and Work Continuity gates remain green on the same exact head;
7. the exact base `c434a4a78530669d5a47be9799d40f5049b57a2d` is first certified on the existing fixed Vercel Production project and exact EdgeOne mirror;
8. after merge, the new merged `main` SHA itself must pass fixed Vercel alias parity and the exact-prebuilt EdgeOne Chromium/WebKit mirror chain.

A failure is fixed at its actual owner. Tests, timeouts, product semantics and deployment parity must not be weakened merely to make this PR green. Provider rate limits are hosting-layer gates and must not be bypassed by creating another Vercel project, changing the fixed public URL or publishing EdgeOne independently.

## Next planned stage

Only after PR #131 is merged and the exact merged `main` artifact is Production-certified on both fixed providers:

1. select the next bounded source-owner migration from the remaining behavioral `prepare-*` / `postbuild-*` mutations by reachability and ownership risk;
2. continue retiring only demonstrably superseded build mutations, one exact owner family at a time;
3. preserve `canonical-single-runtime`, current storage/history compatibility, v61 classic-set ownership, v82/v87 Active ownership, canonical Session/Encounter ownership and current public behavior;
4. require deterministic build, static reachability proof and equal Chromium/iPhone-like WebKit evidence for every user-visible source-owner handoff;
5. keep shrinking source/build indirection without a framework rewrite or a second product truth path.

The target remains a strangler migration: fewer live mutation layers, clearer final owners, and source structure that increasingly matches the already-proven runtime architecture.

Chat history is not authoritative project memory. Repository governance, exact `main`, deterministic build output and fixed Production evidence remain authoritative.