# Current Work

## Production baseline at start of this work

AXIS **8.21** is the last fully Production-sealed Web runtime. The 8.22 work starts only from the exact certified `main` after PR #143:

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified starting `main`: `a9e747b55eb47c156287c4b4a32fdb6e1ac7446f`
- last sealed product/runtime release: **8.21**
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- last sealed runtime SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- last sealed release PR: **#108**
- architecture: `canonical-single-runtime`
- starting deterministic top-level graph: **84 steps** after PR #143
- fixed Vercel Production: `https://axis-five-puce.vercel.app`
- exact-prebuilt EdgeOne Production: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`
- authoritative stores preserved: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`
- existing Session/Encounter writer: canonical app owner
- existing Active owner: v82/v87 lifecycle; no new Active owner is permitted
- cross-platform foundation: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts preserved: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`, `axis.backup.v1`; user-facing backup transport may emit `axis.backup.v2` while retaining v1 import/API compatibility

PR #143 completed the bounded 8.8.4 source-owner convergence and reduced the graph from 85 to 84 without changing public behavior. That architecture slice is complete. This work deliberately stops doing endless source convergence and moves into a true product release.

The provider IDs recorded in governance remain **8.21 seal evidence only** until 8.22 is merged and the exact merged artifact passes the complete Production chain. No file in this PR may imply that the candidate is already Production-sealed.

### Inherited continuity references

These entries are historical provenance and compatibility references, not competing Production baselines or active branches. Existing release contracts intentionally use several of these exact identities to prove that a later product release has not erased earlier certified ownership, browser evidence or source handoffs.

- AXIS 8.21 product/runtime seal: `8f1f1331e751a7868d390f986d77d5779732ad51`
- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- bounded delivery branch: `feat/821-report-pdf-export`
- bounded delivery branch: `feat/821-report-share-card`
- exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`
- bounded delivery branch: `feat/821-flow-step-recording-intent`
- exact certified historical Flow recording base: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- bounded delivery branch: `feat/821-flow-step-execution-intent`
- exact certified historical Flow execution base: `396241c41b2f8eea80d45ca582352ea593c47036`
- bounded delivery branch: `feat/821-active-home-stage`
- exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`
- completed Active Home visual convergence branch: `feat/821-active-home-visual-convergence`
- Active Home visual convergence certified main: `9eaf90d0f94023218feb452b085da48c9f027276`
- completed portable backup/origin migration branch: `feat/821-portable-backup-origin-migration`
- portable backup/origin migration historical base: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- portable backup/origin migration continuity: `b349c8b87a0e9b30916ba9959297897260de3882`
- completed Active Home source-convergence branch: `arch/821-active-home-source-convergence`
- completed Active Home source-convergence PR: **#131**
- Active Home source-convergence certified main: `3877d91`
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`
- completed Flow Active boot source-convergence branch: `arch/821-flow-active-boot-source-convergence`
- completed Flow Active boot source-convergence PR: **#134**
- Flow Active boot source-convergence certified main: `1ed1b53`
- portable-backup/cold-start certified main after PR #136: `72503cd9b3f49cdbeb797ec14343791a5a482815`
- Learning Budget source-convergence PR #137: `d2ccf4977dd5ae551c5575f8c42ca444e93b582a`
- Learning Settings Entry source-convergence PR #138: `f1a5dbfb593429859a83fee783610f29396762e9`
- Explicit Version Decision Contract PR #139: `bb28d8b8419a6e05c7eb087fe41ac1246272260f`
- Watermark Brand source-convergence PR #141: `3972850bd0fc27779e1f2da223e8c463b1541ea0`
- Watermark Four-Switch source-convergence PR #142: `76e6720118f04fb10c11649692d70d862f58246b`
- 8.8.4 Runtime Follow-up source-convergence PR #143 exact certified main: `a9e747b55eb47c156287c4b4a32fdb6e1ac7446f`

The inherited release gates, browser evidence, portable-backup transport, source-owner retirements and factual ownership boundaries remain release-blocking continuity. Historical branch names above are retained only so fail-closed contracts can verify provenance; they do not become current delivery branches or runtime owners.

## Active change

**AXIS 8.22 — Truthful Evolution Replay**

- governed milestone: `AXIS 8.22 — Truthful Evolution Replay`
- governed active branch: `main`
- governed target branch: `main`
- bounded delivery branch: `product/822-truthful-evolution-replay`
- pull request: **#144**
- exact base: `a9e747b55eb47c156287c4b4a32fdb6e1ac7446f`
- intended user-visible behavior change: **yes**
- version decision: **bump**
- version decision sequence: **5**
- base release: **8.21**
- candidate release: **8.22**
- change class: `product-runtime`
- deterministic top-level graph target: **84 → 85** because the true behavior release adds one explicit 8.22 postbuild contract; this is not another corrective owner layer

### Product behavior

Replay is a derived read-only chronology inside the existing Evolution Object. It does not create a new history model.

For an Object with multiple real Encounters, Replay orders them deterministically by:

`time → sessionStart → eventId`

and lets the user move through the actual chronology while seeing factual time, saved summary and Evidence count.

For an Object with only one Encounter, Replay must state that there is only one real record and no before/after comparison. A single record must never be reframed as progress.

### Ownership boundary

Owner: `v822-evolution-replay.js / window.__AXIS_EVOLUTION_REPLAY__`

Replay may read the existing Evolution Object projection and inherited Evidence context, but it may not:

- write `axis_v60_state` or `axis_v8_meta`;
- create a new LocalStorage/IndexedDB namespace;
- append or rewrite Session/Encounter facts;
- write/delete media;
- become an Active/Flow/recorder owner;
- call network APIs or AI;
- generate progress scores, rankings, predictions or advice;
- persist Replay selection/cursor state.

Existing 8.14 Evolution Object, 8.15 Media Evidence, app/v61/v82/v87 and media ownership remain unchanged.

### Source and proof added in this slice

- `v822-evolution-replay.js` — derived read-only Replay runtime
- `prepare-822-evolution-replay.mjs` — 8.21 → 8.22 release promotion + canonical module integration
- `postbuild-822-evolution-replay-contract.mjs` — artifact/ownership gates
- `scripts/axis-822-evolution-replay-contract.mjs` — fail-closed source/CI ownership contract
- `scripts/axis-822-evolution-replay-smoke.mjs` — deterministic factual Replay proof
- the existing **AXIS Current Release Gate** remains the automatic product family and now proves Replay in Chromium + iPhone-like WebKit; no new version-specific workflow family is introduced
- Vercel Production, EdgeOne Production and custom-domain gates extend their current-release proof to Replay

## Validation for this work

Merge is blocked until one exact PR head proves all of the following without weakening inherited assertions:

1. `node build-release.mjs` succeeds and emits public/base release **8.22**, architecture `canonical-single-runtime`, one initial JavaScript request and zero dynamic JavaScript chunks;
2. AXIS Version Authority proves `8.21 → 8.22`, `decision=bump`, `sequence=5`, `change_class=product-runtime`;
3. source and compiled-runtime contracts prove one derived Replay owner and no storage/network/AI/Session/Encounter/media authority;
4. Replay ordering is deterministic by `time → sessionStart → eventId` and direct/previous/next navigation remains factual;
5. one-Encounter Objects render an explicit no-comparison state and never fabricate change, progress, score, prediction or advice;
6. Replay interaction leaves `axis_v60_state` and `axis_v8_meta` byte-for-byte unchanged and triggers no API request;
7. mobile geometry, reduced motion, Chromium and iPhone-like WebKit all pass on the same exact PR head;
8. every inherited Runtime, Current Release, Deep Compatibility, Runtime Foundation, UPO/Object, Flow, Active Home, Session/Encounter, Report, Portable Backup, Repository, Work Continuity and Cross-Platform gate remains green;
9. no real user data is migrated, cleared, copied into a new store or rewritten;
10. after merge, the exact merged `main` SHA passes fixed Vercel Production manifest/artifact + Chromium Replay, exact-prebuilt EdgeOne Chromium/WebKit Replay, and `axis.juele.fun` Chromium/WebKit Replay;
11. final combined statuses and main-push workflows settle without unresolved failure before 8.22 is called complete.

Failures are fixed at the actual owner. Browser assertions, ownership boundaries, data-safety requirements and deployment identity checks may not be weakened merely to make the release pass.

## Next planned stage

Do not start another product or architecture branch until AXIS 8.22 has an exact merged-main Production seal.

After that seal, perform a small governance-only reconciliation if needed to replace the provisional 8.21 provider evidence snapshot with the exact 8.22 merged SHA/deployment/run IDs. That reconciliation must use a fresh version decision and must not change product behavior.

Then continue the durable product backlog one bounded slice at a time, prioritizing Capture friction and real-world runtime adaptation before broad backup/account work. Existing portable backup compatibility remains protected, but a larger backup/account system is intentionally deferred until the product is more stable.

Chat history is not authoritative project memory. It is supplementary context only. Repository governance, exact source, deterministic build output and exact Production evidence are authoritative.
