# AXIS Engineering Handoff

**Governed milestone:** AXIS 8.29 — Recording Friction Collapse.
**Status:** Production-certified. **Governed target branch:** `main`.
**Product PR:** #164. **Version decision:** sequence **28**, `8.29 → 8.29`, `confirm`, `governance`.

## Authoritative product/runtime identity

```text
4a9c73b2ea5330b9cffad3f9e322eb6970dfe171
```

This is the **exact merged-main product/runtime SHA**, not the governance-only PR head or the latest deployment SHA. The immediate prior sealed product runtime was AXIS 8.28 at `df67fc0a20c0c34a79341315c8c85b5461acfe44` (product PR #162, governance PR #163).

## Verification and Production evidence

- Product PR #164 exact head: `8dc4d80f17c061b81a294963c4723f1d6d7e826e`; **33/33** PR workflows success.
- Exact merged product main: **28** push workflows, **27 success**, **1 cancelled** (Branch hygiene), **0 failed**. A cancelled hygiene run is not a failed production test.
- Vercel: existing project `prj_8JJhe0nj2CryZb4xHoHV1WBffn8f`, Git production deployment `dpl_BJz2iaThLqFnPbTDJ4RTQdDPKNY1` READY, source `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`; public `https://axis-five-puce.vercel.app`; current release run `37831475540`; deep compatibility run `37831475524`.
- EdgeOne: deployment `dpfctvvd321b`, proof run `37831475199` (Chromium and WebKit); mirror `https://axisfitness-mirror-9x91gveo.edgeone.cool`.
- Custom domain: `https://axis.juele.fun`, run `37831475553` attempt **2**, exact parity and Chromium/WebKit success.
- The exact provider/runtime evidence is stored in `governance/production-certifications/8.29.json`. The Vercel Production Gate run ID is deliberately `null`: no distinct exact-main run is asserted without a matching job.

## Inherited owner and factual boundaries

- `app.js` continues as canonical Session/Encounter persistence owner. `v61` retains established classic strength-set ownership.
- `lib/axis-recording-continuity.mjs` / `axis.recording-continuity.v1` is a pure, derived suggestion and draft-continuity contract only.
- Compatible prior-confirmed metrics are editable suggestions; no old Encounter is rewritten and the user still explicitly confirms any new fact.
- Same-recorder draft persistence and in-flight save suppression add no new owner, storage namespace, Session, Active lifecycle, media store, network or AI authority.
- Existing cross-platform Foundation `axis-native-foundation-0` and historical portable contracts remain inherited.
- Version authority remains in `governance/version-decision.json` and `governance/project-state.json`. Later governance commits or provider re-deploys must never replace `product.productionRuntimeSha`.

## Planned bounded next delivery — AXIS 8.30

**Object Identity Integrity.** This is an approved **next stage**, not completed work.

Evidence in current source: the search/picker projection in `prepare-8124-settings-catalog-polish.mjs` uses `pickId: x.baseId || x.id`. This can send separate displayed movements to the same recording identity; examples include `run`→`treadmill`, `seated-row` and `chest-row`→`row`, and three leg curl variants→`legcurl`. Other catalog extensions and historical records also require audit. These are code-identified collision paths, not an exhaustive user-data diagnosis.

Acceptance conditions:
1. Enumerate all built-in and extended Object IDs, aliases and baseIds, plus custom and historical fallbacks. One display entry must select and record its correct stable Object ID.
2. Separate semantic aliases from equipment templates and true movements. Do not merge distinct movements merely because they share a muscle, device, or base implementation.
3. Preserve immutable old Encounter provenance. Historical records with ambiguous identity must not be silently reassigned; explicit evidence or user confirmation is required before any attribution.
4. Test all catalog surfaces: search, Quick Record, Favorites/Recent, personal library, Object Recorder, Flow selection, History/Evolution; Chromium and iPhone-like WebKit.
5. Publish a release-specific version decision, owner change assessment, exact-head gate and exact merged-main Production certification. Use an isolated PR and independent governance closeout.

## Approved subsequent product direction — Playable Practice

- **PLAY THIS:** open a shared activity and execute immediately, without mandatory account or app install; safe versioned `PlayableSpec` and independent attempts.
- **AIR:** opt-in camera gesture control with dwell/confirmation, robust fallbacks, no independent writer.
- **TAKE:** supported movement demonstration → confirmed Object → reusable playable specification, without pretending arbitrary gestures can be learned reliably.
- **FORK:** immutable derived specification with provenance; distinct rule sets never share one misleading leaderboard.

Order: **8.31 Runtime → 8.32 local PLAY THIS → 8.33 shareable PLAY THIS → 8.34 AIR → 8.35 integration → 8.36 TAKE → 8.37 FORK → 8.38 launch convergence**. This roadmap is **not a claim of implementation**.

Do not introduce public sharing, new capture writers or Playable persistence in the 8.29 seal. Local-first core history remains private by default. Future shared challenge endpoints require minimized public data, expiration/revocation, abuse control, and cross-provider consistency.

## In-progress bounded branch — AXIS 8.30 Object Identity Integrity

`feature/830-object-identity-integrity` begins from governance-sealed AXIS 8.29 `6713b47576e902c2015c63b7bb82b23691ec7a3c`. It contains a read-only Object identity inventory and initial unreleased routing corrections in `prepare-8123-canonical-library-selection.mjs`, `prepare-8124-settings-catalog-polish.mjs` and `v873-smart-input.js`. These changes exist **only on the 8.30 development branch**; they do not change current public 8.29 or imply 8.30 is released. The current source candidate has **no built-product, Chromium, WebKit, provider or migration verification**. The source-level risks include legacy `baseId` routing and historical same-name selection fallback.

Authoritative next step: separately inspect, repair and physically prove every displayed catalog Object selects and persists its own stable identity. Legacy ambiguous Encounters remain immutable. When a product behavior change is admitted, issue a fresh sequence 29 version bump and preserve the exact-head / merged-main / governance-seal protocol. PLAY THIS and AIR remain planned after 8.30.

## AXIS 8.29 post-governance merged-main certification

- Governance PR [#165](https://github.com/INDEPENDENTWU/AXIS/pull/165) merged at `6713b47576e902c2015c63b7bb82b23691ec7a3c`; exact governance PR head 27/27 successful.
- Governance-main push workflow results: **27 total, 26 success, 1 cancelled Branch hygiene, 0 failure**.
- Vercel Git Production `dpl_8F4YQkfxRbVRRDZQw8CXkqSfPXrW` READY, exact governance-main commit `6713b47576e902c2015c63b7bb82b23691ec7a3c`; EdgeOne Production mirror run `37900944883` success; GitHub commit provider statuses success.
- Custom-domain run `37900945013` attempt **3** success, `axis.juele.fun` parity + Chromium/WebKit. Attempts 1 and 2 failed at the immediate post-reload UI text assertion in `scripts/axis-828-practice-loop-smoke.mjs:47` after runtime phase had restored; maintain a bounded UI-convergence check in subsequent governed test work.
- This post-governance verification does **not** change the certified AXIS 8.29 **product** runtime SHA `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`.
- Durable follow-up: [Object Identity Integrity — Issue #166](https://github.com/INDEPENDENTWU/AXIS/issues/166).


## Formal 8.30 product admission

**Version-decision sequence 29** · `8.29 → 8.30 / bump / product-runtime`. Candidate delivery `feature/830-object-identity-integrity`, tracked by [PR #167](https://github.com/INDEPENDENTWU/AXIS/pull/167) and [Issue #166](https://github.com/INDEPENDENTWU/AXIS/issues/166). **No merged 8.30 product SHA and no Production certification yet.** Preserve previous sealed 8.29 exact product/runtime `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`. The only permitted fact writers remain the existing app and classic owners. After exact-head testing, independently certify the merged product before performing any governance-only promotion.

## AXIS 8.30 handoff — 2026-10-10, unsealed PR #167

**Branch:** `feature/830-object-identity-integrity`; **latest recorded development head:** `6d4f9a661acb870dfb61a06bb056b9591cadf577` before this documentation-only commit. The authoritative head must be re-read from PR #167. AXIS 8.29 remains Production-sealed; 8.30 is **not published**.

**Confirmed progress:** a late build stage had overwritten the ID-preserving search projection with `byName` deduplication. Source changes alone could not fix the shipped candidate. The final assembled catalog convergence now restores an ID-keyed projection with native precedence. [Chromium job 114089101674](https://github.com/INDEPENDENTWU/AXIS/actions/runs/38010491087) reports zero missing native IDs and separate same-label `chest-row` and `custom-identity-proof` search candidates.

**Unresolved gates:** the same job then stopped on an invalid smoke-test entry assumption: `beginQuickRecorder` is reserved for explicit metric schemas, so native Quick Record needs the real Quick Record picker route. The updated smoke uses that route but has not yet passed. The separate inherited 8.8.2 Active presentation test still times out on both engines. Never infer full Encounter integrity from passing search indexing, and never suppress these failures.

**Next maintainer operation:** inspect the **latest exact-head CI** on PR #167. First correct the remaining real Quick Record or smoke routing failure, then physically prove native/custom IDs through selection, confirmed save, reload and unmodified historic facts in Chromium and WebKit. Diagnose the inherited Active transition separately and preserve its geometry and ownership contracts. Re-run all required CI, perform exact-head merge and merged-main provider Production certification, then issue an independent 8.30 Governance Seal. No 8.31 changes until that evidence is complete.
