# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified `main` baseline for this bounded source-convergence slice: `d2ccf4977dd5ae551c5575f8c42ca444e93b582a`
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

PR #137 is merged at `d2ccf4977dd5ae551c5575f8c42ca444e93b582a`. That exact merged artifact is the certified starting point for this slice: canonical Vercel Production, exact-prebuilt `axisfitness-mirror` EdgeOne Production, `axis.juele.fun` parity, Chromium and iPhone-like WebKit Production verification were completed before this branch began. PR #137 retired `prepare-810-learning-budget-fix.mjs` from canonical build authority and reduced the deterministic top-level release graph from 89 to 88 steps without changing user-visible behavior.

### Inherited bounded-stage continuity references

These identifiers are compatibility/provenance references required by already-sealed contracts. They are **historical continuity only**: they do not supersede the current bounded delivery branch or current Production baseline below.

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
- completed Learning Budget source-convergence branch: `arch/821-learning-budget-source-convergence`
- completed Learning Budget source-convergence PR: **#137**
- Learning Budget source-convergence certified main: `d2ccf4977dd5ae551c5575f8c42ca444e93b582a`

PR #129 established the flat, centered Home-integrated ordinary Active stage. PR #130 refined tactile hold/rest presentation. PR #132 added structural-owner portable backup transport. PR #131 retired the late Active Home visual prepare from canonical build authority. PR #133 retired the immediate Report PDF corrective scope prepare. PR #134 retired the corrective Flow Active boot-scope prepare. PR #136 converged the large-media backup safety path into the canonical portable-backup owner and removed the late hardening transform from authority. PR #137 converged Learning budget comparisons into the canonical 8.10 Learning engine source owner.

The inherited release gates, browser evidence, portable-backup transport and source-owner retirements remain release-blocking continuity. A source-convergence slice may remove one proven corrective build owner only after the responsibility is emitted directly by the canonical source owner and equivalent static plus Chromium/WebKit proof remains in place.

## Active change

**AXIS 8.21 — Learning Settings Entry Source Convergence**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `arch/821-learning-entry-source-convergence`
- exact certified base `main` SHA: `d2ccf4977dd5ae551c5575f8c42ca444e93b582a`
- intended public release change: **none; remains 8.21**
- intended user-visible behavior change: **none**
- deterministic top-level release steps at entry to this slice: **88**
- target after this bounded retirement: **87 deterministic top-level release steps**

The explicit corrective layer for this slice is `prepare-810-learning-entry-fix.mjs`. Historically it relocates the already-existing Learning schedule entry from the `#v89SpeakSettings` accessory container into the visible primary Settings list, broadens the CSS selector to the Settings surface, makes the summary lookup global to that row, and emits the diagnostic `window.__AXIS_810_SETTINGS_ENTRY__={owner:'settings-primary-list',surface:'dedicated-config-panel'}`.

Those semantics belong to the 8.10 Learning Settings source owner itself. This slice therefore makes `prepare-810-learning-settings.mjs` emit that already-proven final structure directly and removes `prepare-810-learning-entry-fix.mjs` from canonical `build-release.mjs` reachability. The historical corrective file remains repository provenance only; it is not deleted and may not regain Production authority.

The source-owner contract is `scripts/axis-810-learning-entry-source-contract.mjs`. It seals that:

1. `prepare-810-learning-settings.mjs` directly owns the visible primary Settings row, `settingLink v810ConfigEntry` identity, dedicated config panel, summary lookup and diagnostic;
2. the old accessory-container selector cannot return to the canonical Settings source;
3. `prepare-810-learning-settings.mjs` remains exactly once in the deterministic build graph;
4. `prepare-810-learning-entry-fix.mjs` is absent from canonical build reachability;
5. the retirement registry names the Learning Settings source as replacement owner and forbids Production authority for the historical corrective file;
6. the Learning Settings source gains no network, IndexedDB or Flow-storage ownership.

The existing **AXIS Deep Compatibility Gate** is reused rather than creating another workflow family. Its static job syntax-checks and executes both the already-sealed learning-budget contract and the new learning-entry source-owner contract. Its existing Chromium and iPhone-like WebKit 8.9→8.10.3 learning smokes, later Settings compatibility smokes and simplified local Learning smoke remain the behavioral proof.

## Validation for this work

Merge is blocked until the exact final PR head proves all of the following without weakening existing assertions:

1. deterministic `node build-release.mjs` succeeds with public/base AXIS 8.21 and `canonical-single-runtime` unchanged;
2. canonical top-level release steps fall from 88 to 87 only because `prepare-810-learning-entry-fix.mjs` loses build authority;
3. `scripts/axis-810-learning-entry-source-contract.mjs` passes and the retirement registry is consistent;
4. Deep Compatibility static, Chromium and iPhone-like WebKit jobs pass on the same exact head, including the inherited 8.9→8.10.3 Learning path and later Settings/Learning compatibility smokes;
5. all inherited Runtime, Current Release, Flow, Active Home, Session/Encounter, Object, Report, Portable Backup, Repository and Work Continuity gates remain green on that exact head;
6. no new storage namespace, IndexedDB database, network writer, Session/Encounter writer, recorder, Active owner, Flow owner or deployment project appears;
7. after merge, the exact merged `main` SHA must become the canonical Vercel golden; then the existing `axisfitness-mirror` EdgeOne Production path must publish the same prebuilt artifact and pass its exact-artifact/browser checks;
8. `axis.juele.fun` must converge to that same exact manifest/runtime identity and pass the existing real-host Chromium plus iPhone-like WebKit Production verification before this slice is called complete across both delivery sides.

A failure is fixed at the actual owner. No product assertion, timeout, browser action, historical compatibility requirement or deployment identity check may be weakened simply to make convergence green.

## Data and migration boundary

This architecture slice does **not** alter or clear the user's long-lived Vercel-origin data. The existing complete AXIS backup path remains the explicit bridge to `axis.juele.fun`: prepare and save the `.axisbackup`, then restore it into the custom-domain origin and reconcile Session count, Encounter count, photo/video counts and media bytes before treating the custom-domain installation as the user's daily-data successor.

No migration, cleanup or source-convergence operation may delete the Vercel-origin data before that reconciliation is complete.

## Next planned stage

Only after this exact source-convergence head is green, merged and Production-certified on Vercel, the fixed EdgeOne mirror and `axis.juele.fun`:

1. continue the original deterministic source-owner audit with the next smallest explicit corrective/refine/follow-up layer, one bounded owner handoff at a time;
2. keep public release 8.21 and user behavior unchanged unless a separately scoped product change is explicitly approved;
3. preserve `canonical-single-runtime`, historical Session/Encounter truth, `axis.backup.v1` import/API compatibility, `axis.report-range.v1`, v61 classic-set ownership, v82/v87 Active ownership and canonical Session/Encounter ownership;
4. keep real Vercel-origin data intact until the saved `.axisbackup` has been restored into `axis.juele.fun` and record/media counts reconcile;
5. handle the Node 20.18.0 → supported Node 20.19+ toolchain upgrade as a separate infrastructure slice, never mixed into source-owner convergence.

The target remains one AXIS product, one Git history, one canonical release artifact and governed parity across Vercel + EdgeOne/custom-domain delivery, while steadily removing late mutation layers from the runtime build.

Chat history is not authoritative project memory. Repository governance, exact `main`, deterministic build output and fixed Production evidence remain authoritative.
