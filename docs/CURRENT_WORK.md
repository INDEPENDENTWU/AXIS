# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified `main` baseline for this bounded source-convergence slice: `72503cd9b3f49cdbeb797ec14343791a5a482815`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- public release identity: **unchanged; 8.21**
- architecture: **unchanged; `canonical-single-runtime`**
- fixed public Vercel URL: `https://axis-five-puce.vercel.app`
- fixed public EdgeOne project URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed mainland-facing alias: `https://axis.juele.fun`
- deployment topology: one existing Git-connected AXIS Vercel Project on `main`; the existing `axisfitness-mirror` EdgeOne project publishes the exact Vercel-golden artifact; `axis.juele.fun` is an alias of that same governed Production environment, never another AXIS runtime/project
- existing Session/Encounter writer: canonical app owner
- existing Active owner: v82/v87 lifecycle; no new Active owner is permitted
- existing learning accessory store: `axis_v89_speak`; learning remains isolated from training truth
- cross-platform foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts preserved: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`, `axis.backup.v1`; user-facing backup transport may emit `axis.backup.v2` while retaining v1 import/API compatibility

PR #136 is merged at `72503cd9b3f49cdbeb797ec14343791a5a482815` and the exact merged artifact has already passed canonical Vercel Production, exact-prebuilt EdgeOne mirror, `axis.juele.fun` parity, Chromium and iPhone-like WebKit Production verification. Portable backup v2 and the WebKit large-media/cold-start protections are therefore part of the certified starting baseline for this work.

### Inherited bounded-stage continuity references

These identifiers are compatibility/provenance references required by already-sealed contracts. They are not competing Production baselines or active delivery branches:

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
- bounded portable-backup branch: `feat/821-portable-backup-origin-migration`
- portable-backup exact historical base: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- portable-backup merged/certified main: `b349c8b87a0e9b30916ba9959297897260de3882`
- completed Active Home source-convergence branch: `arch/821-active-home-source-convergence`
- completed Active Home source-convergence PR: **#131**
- Active Home source-convergence certified main: `3877d91cc6f17a3db5add414fed44495c64d3cf4`
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`
- completed Flow Active boot source-convergence branch: `arch/821-flow-active-boot-source-convergence`
- bounded delivery branch: `arch/821-flow-active-boot-source-convergence`
- completed Flow Active boot source-convergence PR: **#134**
- Flow Active boot source-convergence certified main: `1ed1b53e4a1ced7e32c0a91d058bccd6abfcd71c`
- completed portable-backup WebKit/canonical-source follow-up: PR **#136**
- certified portable-backup/cold-start main: `72503cd9b3f49cdbeb797ec14343791a5a482815`

PR #129 established the flat, centered Home-integrated ordinary Active stage. PR #130 refined tactile hold/rest presentation. PR #132 added structural-owner portable backup transport. PR #131 retired the late Active Home visual prepare from canonical build authority. PR #133 retired the immediate Report PDF corrective scope prepare. PR #134 retired the corrective Flow Active boot-scope prepare. PR #136 converged the large-media backup safety path into the canonical portable-backup owner and removed the late hardening transform from authority.

## Active change

**AXIS 8.21 — Learning Budget Source Convergence**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `arch/821-learning-budget-source-convergence`
- exact certified base `main` SHA: `72503cd9b3f49cdbeb797ec14343791a5a482815`
- intended public release change: **none; remains 8.21**
- intended user-visible behavior change: **none**
- original architecture-audit baseline: **89 deterministic release steps**
- target after this bounded retirement: **88 deterministic release steps**

The next explicit corrective layer is `prepare-810-learning-budget-fix.mjs`. It exists only to repair JavaScript operator precedence immediately after `prepare-810-learning-engine.mjs` emits two budget comparisons. The correction belongs to the 8.10 learning engine source itself, not to a later behavioral mutation.

This slice therefore moves the already-proven parenthesized daily/session budget comparisons directly into `prepare-810-learning-engine.mjs`, removes `prepare-810-learning-budget-fix.mjs` from canonical `build-release.mjs` reachability, and records that old file as provenance-only. It does not change cadence, targets, phrase selection, exposure counts, review behavior, storage schema, training truth, visible copy, timers, network behavior, or any deployment topology.

The source-owner contract is `scripts/axis-810-learning-budget-source-contract.mjs`. It seals that:

1. the engine emits the correct parenthesized daily and session exposure-cap comparisons exactly once;
2. the ambiguous pre-fix expressions cannot return;
3. the learning engine remains exactly once in the canonical release list;
4. the retired corrective prepare cannot return to canonical build reachability;
5. the retirement registry names the learning engine as replacement owner;
6. no new network/database/Flow-storage owner is introduced.

The existing Deep Compatibility gate is reused rather than adding another workflow family. Its static job runs the new source-owner contract, while its existing Chromium and iPhone-like WebKit 8.9→8.10.3 learning smokes remain the behavioral proof.

## Validation for this work

Merge is blocked until the exact final PR head proves all of the following without weakening existing assertions:

1. deterministic `node build-release.mjs` succeeds with public/base AXIS 8.21 and `canonical-single-runtime` unchanged;
2. canonical top-level release steps fall from 89 to 88 only because `prepare-810-learning-budget-fix.mjs` loses build authority;
3. `scripts/axis-810-learning-budget-source-contract.mjs` passes and the retirement registry is consistent;
4. Deep Compatibility static, Chromium and iPhone-like WebKit jobs pass on the same exact head, including `axis-810-smoke.mjs` and the inherited 8.9→8.10.3 learning path;
5. all inherited Runtime, Current Release, Flow, Active Home, Session/Encounter, Object, Report, Portable Backup, Repository and Work Continuity gates remain green on that exact head;
6. no new storage namespace, IndexedDB database, network writer, Session/Encounter writer, recorder, Active owner or Flow owner appears;
7. after merge, the exact merged `main` SHA must become the Vercel golden, then the existing `axisfitness-mirror` EdgeOne Production deployment must publish the same prebuilt artifact and pass Chromium + iPhone-like WebKit;
8. `axis.juele.fun` must converge to that same exact manifest/runtime identity and pass its existing real-host Production gate before the slice is called complete across both delivery sides.

A failure is fixed at the actual owner. No product assertion, timeout, browser action, historical compatibility requirement or deployment identity check may be weakened simply to make the convergence green.

## Next planned stage

Only after this exact source-convergence head is green, merged and Production-certified on Vercel, the fixed EdgeOne mirror and `axis.juele.fun`:

1. continue the original 89-step source-owner audit with the next smallest explicit corrective/refine/follow-up layer, one bounded owner handoff at a time;
2. keep public release 8.21 and user behavior unchanged unless a separately scoped product change is explicitly approved;
3. preserve `canonical-single-runtime`, historical Session/Encounter truth, `axis.backup.v1` import/API compatibility, `axis.report-range.v1`, v61 classic-set ownership, v82/v87 Active ownership and canonical Session/Encounter ownership;
4. keep real Vercel-origin data intact until the operator has restored the saved `.axisbackup` into `axis.juele.fun` and reconciled record/media counts;
5. handle the Node 20.18.0 → supported Node 20.19+ toolchain upgrade as a separate infrastructure slice, never mixed into source-owner convergence.

The target remains one AXIS product, one Git history, one canonical release artifact and governed parity across Vercel + EdgeOne/custom-domain delivery, while steadily removing late mutation layers from the runtime build.

Chat history is not authoritative project memory. Repository governance, exact `main`, deterministic build output and fixed Production evidence remain authoritative.
