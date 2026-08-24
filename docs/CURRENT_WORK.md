# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine truth starts at [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Production: **AXIS 8.18**.
- Exact sealed main SHA: `65e3525e78f021afda7db19d27722626af9514d8`.
- Vercel Production deployment: `dpl_7mYETXKCQzXKh88ybocT65oLiJ1T` — **READY**, exact Git SHA above.
- EdgeOne Production Mirror run `32675374766` — **success**: exact-prebuilt deployment, Vercel/local artifact parity, Chromium real Production flow and iPhone WebKit real Production flow all passed.
- AXIS 8.18 remains the rollback/reference release while 8.19 is developed. Do not rewrite or migrate historical user data in place.

## Active change

**AXIS 8.19 — Universal Practice Objects** · branch `product/819-universal-practice-objects` · draft PR **#80**.

Current phase: **Phase 1 — Metric Schema + Recording Truth**.

Product goal:

`Object → Metric Schema → Recording Surface → authoritative metric facts → Encounter schema snapshot → History / Evolution`

The immediate product defect being fixed is structural: custom/built-in Objects can describe recording attributes, but current recording and History still largely collapse to hard-coded `strength = weight/reps/sets` or `cardio = duration/intensity`. 8.19 makes the Object definition executable without turning AXIS into a generic form builder.

### Completed · Slice 1 Metric Schema foundation

Commit `9f45c4ed3bfdad1fa113801b4af0e6d0355dfa8b` establishes:

- `axis.metric-schema.v1`;
- `axis.encounter-metrics.v1`;
- pure `lib/axis-metric-schema.mjs` resolver;
- nine portable metric primitives: `number / count / duration / distance / pace / percentage / rating / boolean / choice`;
- legacy profile mapping for `weight_reps`, `time_intensity`, and `time_level`;
- Recording Surface classification without storage ownership;
- immutable Encounter metric-schema snapshots;
- classic strength facts projected from authoritative `axis_v8_meta` sets;
- legacy cardio facts projected from authoritative `axis_v60_state` events;
- explicit `legacyOwner: v61` for the classic `weight × reps` surface.

Cross-Platform Foundation run `32676046208` passed the new Metric Schema contract. Slice 1 intentionally changes **no user-visible recording UI** yet.

### Current ownership boundaries

- `v61.js` remains the authoritative high-frequency writer for classic strength set facts.
- `app.js` remains the current base session/cardio event persistence owner until a separately proved handoff exists.
- `v874-professional.js` remains the visible custom-Object editor.
- Metric Schema resolution is pure; it is not a database, event writer, completion owner, or UI owner.
- History/Evolution will consume normalized metric truth read-only; they may not create facts.

### Durable compatibility

Preserve without destructive migration:

- `axis_v60_state`;
- `axis_v8_meta`;
- `axis_v89_speak`;
- `axis_v42_media`;
- historical custom equipment/object identities and aliases;
- historical Encounters recorded before Metric Schema existed.

Changing an Object's current schema later must never rewrite an older Encounter. The Encounter keeps the schema snapshot that was true when it was recorded.

### Next implementation slice

Persist executable Metric Schema on custom Objects first, before altering Recording UI:

1. existing custom Objects without `metricSchema` resolve through legacy type/profile defaults;
2. editing an Object reads its explicit schema when present;
3. saving writes normalized schema back into the same `axis_v60_state.profile.customEq` Object — no second object store;
4. legacy `type`, subtype/profile and identity fields remain for compatibility;
5. Object schema editing cannot mutate any existing session/event/meta record;
6. only after save/reload compatibility proof should Quick Record / Recording consume the resolver.

## Validation for this work

Every 8.19 slice must preserve one semantic owner and one authoritative fact store. No green CI through weaker assertions, timeout inflation, duplicate writers, fake compatibility fields, or destructive migration.

Required proof as the work advances:

- Metric Schema pure/deterministic contract;
- old strength/cardio/custom Objects resolve identically to 8.18 behavior;
- `v61` remains owner for classic weight/reps sets;
- custom schema save/reload is lossless and does not touch historical Encounters;
- generic metric recording writes exactly once through the existing event boundary;
- Encounter schema snapshot is immutable after later Object edits;
- History/Detail reads snapshot first with legacy fallback;
- Evolution reads normalized metric facts without persistence ownership;
- affected real flows pass Chromium and iPhone-like WebKit before merge;
- final merged 8.19 SHA requires exact Vercel + EdgeOne Production parity before release seal.

## Next planned stage

1. Seal this handoff update so Work Continuity is green on PR #80.
2. Implement custom-Object `metricSchema` persistence/reload in the existing `v874-professional.js` owner with explicit legacy fallback.
3. Add contract/browser proof that editing current Object schema never changes historical event/meta facts.
4. Integrate the Recording Surface Resolver into Quick Record/recording selection:
   - exact weight/reps → existing `v61` surface;
   - existing duration/intensity → existing app owner while compatible;
   - only unsupported metrics receive the new generic metric controls.
5. Commit normalized metric facts + immutable schema snapshot atomically at the authoritative recording boundary.
6. Make History/Detail schema-aware, then Evolution normalized/read-only.
7. Keep PR #80 Draft until the complete Object → Record → History loop is dual-engine sealed.

**Conversation history is supplemental only. GitHub handoff/contracts/tests are authoritative for this work.**
