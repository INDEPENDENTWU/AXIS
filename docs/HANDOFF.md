# AXIS engineering handoff

> **Read this first.** Machine-readable current truth lives in [`../governance/project-state.json`](../governance/project-state.json). Chat history is supplementary, not project authority.

## 1. Current Production

- Product: **AXIS — Personal Evolution Engine**
- Current public Production release: **AXIS 8.18**
- Exact sealed merged-main SHA: `65e3525e78f021afda7db19d27722626af9514d8`
- Architecture: `canonical-single-runtime`
- Release build: `node build-release.mjs`
- Vercel Production deployment: `dpl_7mYETXKCQzXKh88ybocT65oLiJ1T` — **READY**, exact SHA above
- Vercel public endpoint: `https://axis-five-puce.vercel.app`
- EdgeOne public endpoint: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- EdgeOne exact-artifact Production seal: workflow run `32675374766` — **success**
- That EdgeOne seal includes Vercel/local canonical artifact parity, exact prebuilt deployment, live verification, Chromium Production flow, and iPhone-like WebKit Production flow.

AXIS 8.18 is the rollback/reference truth while AXIS 8.19 is developed. Do not mutate historical user data in place to make a new feature easier to implement.

## 2. Previous engineering milestone is sealed

PR #79 **AXIS Source Convergence — Governance + CI Foundation** is merged into the Production SHA above.

It completed governance/handoff + CI convergence without intended product behavior change:

- 20 historical automatic workflow files retired after replacement proof;
- 9 broad responsibility-based CI families retained;
- `AXIS 8.12 Browser Gate` intentionally retained as a path-scoped specialist;
- retired workflow resurrection guarded;
- exact merged-main Vercel + EdgeOne Production proof completed.

Source/build historical transform debt still exists in `build-release.mjs`; it is separate from current 8.19 product truth and must not be mixed into product work casually.

## 3. Active product work

**Milestone:** `AXIS 8.19 — Universal Practice Objects`

**Branch:** `product/819-universal-practice-objects`

**Draft PR:** `#80`

**Current phase:** `Phase 1 — Metric Schema + Recording Truth`

Product pipeline:

```text
Object
  ↓
Metric Schema
  ↓
Recording Surface
  ↓
authoritative metric facts
  ↓
Encounter schema snapshot
  ↓
History / Evolution
```

The structural defect being fixed: an Object may describe what it should record, but current recording/history still largely collapse to hard-coded strength (`weight/reps/sets`) or cardio (`duration/intensity`) shapes. 8.19 makes the Object definition executable without turning AXIS into a generic form builder.

## 4. 8.19 Metric Schema foundation

Foundation commit: `9f45c4ed3bfdad1fa113801b4af0e6d0355dfa8b`

Machine contracts:

- `axis.metric-schema.v1`
- `axis.encounter-metrics.v1`

Pure resolver:

- `lib/axis-metric-schema.mjs`

Portable metric primitives:

- `number`
- `count`
- `duration`
- `distance`
- `pace`
- `percentage`
- `rating`
- `boolean`
- `choice`

Legacy compatibility:

- classic strength resolves to `weight + reps` and explicitly keeps `v61` as writer;
- legacy cardio resolves to `duration + intensity`;
- existing custom profiles such as `time_level` remain readable;
- Encounter metric projections deep-copy the governing schema so later Object edits cannot rewrite old Encounter truth.

Cross-Platform Foundation run `32676046208` passed the Metric Schema foundation contract.

## 5. Critical ownership — do not duplicate

- `app.js` — base session/profile/preferences state and current base/cardio event persistence; canonical camera/media persistence.
- `v61.js` — authoritative high-frequency classic strength set writer in `axis_v8_meta`.
- `v874-professional.js` — visible custom Object editor; 8.19 custom schema persistence must extend this owner rather than create another editor/store.
- v8710 — sole automatic sound owner.
- 8.18 Focus — presentation only; delegates factual completion.
- Evolution Library — derived/read-only.
- Metric Schema resolver — pure semantic resolver only; **not** a store, event writer, completion owner, or UI owner.

One semantic action gets one interactive writer. One training fact gets one authoritative store.

## 6. User truth that must survive 8.19

Preserve:

- `axis_v60_state`
- `axis_v8_meta`
- `axis_v89_speak`
- `axis_v42_media`
- custom equipment/Object identity and aliases
- historical sessions/events/Encounter shapes

Current custom Object schema changes must never rewrite historical Encounter facts or their schema snapshot.

## 7. Immediate implementation sequence

1. Persist normalized `metricSchema` on custom Objects through the existing `v874-professional.js` owner and the same `axis_v60_state.profile.customEq` objects.
2. Existing custom Objects without explicit schema continue to resolve through their legacy type/profile.
3. Prove save/reload losslessness and prove no historical event/meta mutation.
4. Connect the Recording Surface Resolver:
   - exact weight/reps → existing `v61` UI/writer;
   - established duration/intensity → existing app owner while compatible;
   - only truly unsupported metrics receive new generic metric controls.
5. Commit normalized metric facts + immutable schema snapshot at the existing authoritative recording boundary.
6. Make History/Detail schema-aware with legacy fallback.
7. Make Evolution consume normalized metric facts read-only.
8. Dual-engine Chromium + iPhone-like WebKit proof before PR #80 can leave Draft.
9. Exact merged 8.19 SHA must receive Vercel + EdgeOne Production parity and real-browser proof before release seal.

## 8. Native / cross-platform foundation remains authoritative

The native handoff remains anchored by `axis-native-foundation-0` and repository `INDEPENDENTWU/AXIS-iOS`.

Shared portable foundations remain:

- `axis.domain.v1`
- `axis.data.v1`

Web/iOS capability differences stay isolated behind platform contracts; shared domain semantics must not be inferred from Web implementation accidents.

## 9. Future presentation foundation

Planned UI locales remain exactly:

- `zh-Hans` — **简体中文**
- `zh-Hant` — **繁體中文**
- `en` — **English**

Theme preference remains exactly `system / light / dark` using semantic tokens. Presentation-foundation work comes after the recording-truth foundation is stable.

## 10. What a future developer/agent reads first

1. `governance/project-state.json`
2. this `docs/HANDOFF.md`
3. `docs/CURRENT_WORK.md`
4. `governance/owners.json` / `docs/OWNERSHIP.md`
5. `governance/retirements.json` / `docs/RETIREMENTS.md`
6. `docs/PRODUCT.md`, `docs/RUNTIME_CONTRACT.md`, `docs/ARCHITECTURE.md`
7. shared contracts and current tests before changing domain or persistence semantics

**Chat history is not authoritative project memory.** If chat disagrees with Git/Production, verify reality and update repository truth.
