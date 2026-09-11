# Current Work

## Production baseline at start of this work

AXIS **8.21** is the last fully Production-sealed Web runtime. The 8.22 work starts only from the exact certified `main` after PR #143:

- canonical repository: `INDEPENDENTWU/AXIS`
- exact certified starting `main`: `a9e747b55eb47c156287c4b4a32fdb6e1ac7446f`
- last sealed product/runtime release: **8.21**
- last sealed runtime SHA: `8f1f1331e751a7868d390f986d77d5779732ad51`
- last sealed release PR: **#108**
- architecture: `canonical-single-runtime`
- starting deterministic top-level graph: **84 steps** after PR #143
- fixed Vercel Production: `https://axis-five-puce.vercel.app`
- exact-prebuilt EdgeOne Production: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`
- authoritative stores preserved: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

PR #143 completed the bounded 8.8.4 source-owner convergence and reduced the graph from 85 to 84 without changing public behavior. That architecture slice is complete. This work deliberately stops doing endless source convergence and moves into a true product release.

The provider IDs recorded in governance remain **8.21 seal evidence only** until 8.22 is merged and the exact merged artifact passes the complete Production chain. No file in this PR may imply that the candidate is already Production-sealed.

## Active change

**AXIS 8.22 — Truthful Evolution Replay**

- governed milestone: `AXIS 8.22 — Truthful Evolution Replay`
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

Chat history is supplementary context. Repository governance, exact source, deterministic build output and exact Production evidence are authoritative.
