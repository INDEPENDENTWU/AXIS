# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public release.

- exact merged `main` baseline: `26cdd0f6a060ec1056f8125c7f712f2e5303d232`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- preceding product change: PR **#112**, per-item built-in Object recording metric overrides
- PR #112 exact tested head: `5f027dad0c260c06337580cc2116f52f6e6d0307`
- PR #112 is merged and Production-certified on the existing Vercel AXIS project and EdgeOne Production, including exact artifact parity plus Chromium and iPhone-like WebKit product flows
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**

The merged 8.21 product already has one canonical Object schema/execution boundary, app-owned Session/Encounter persistence in `axis_v60_state`, v61 recording ownership, v82/v87 Active lifecycle, whole-item Flow, immutable Encounter metric/execution snapshots, and per-user Object metric overrides. This work extends Profile context and Session history only; none of those owners may move.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, and `axis.flow-provenance.v1`.

## Active change

**AXIS 8.21 — Profile / Goal Session Truth**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-profile-session-truth`
- intended pull request: **#113**
- exact base main SHA: `26cdd0f6a060ec1056f8125c7f712f2e5303d232`
- intended public release change: **none**
- intended persistence change: additive optional Profile facts and additive immutable Session context inside the existing app-owned `axis_v60_state`
- new Profile store / Session store / Encounter writer / Active owner / Flow owner / report owner: **none**

### Why this change comes before the detailed report

`app.js` already owns the user Profile and currently stores `height`, `weight`, `bodyFat`, `years`, `freq`, and `goal`. AXIS also already has a simple Training Report/JPG projection and a richer Trends layer. The missing truth boundary is historical context: current Profile/Goal values are mutable, while archived Sessions currently do not preserve what those values were when the workout began.

A future report must never use today's body or goal values to fabricate what was true for an old workout. Therefore the durable order is:

`Object Schema → Encounter Facts → Session Facts → Profile / Goal Snapshot → Training Report → PDF / Image projection`

This PR implements only the Profile / Goal Snapshot foundation.

### Profile ownership

Existing current facts keep their existing editable owner and storage location:

- `profile.height`
- `profile.weight`
- `profile.bodyFat`
- `profile.years`
- `profile.freq`
- `profile.goal`

They are not copied into a second editable `measurements` model.

New facts that previously had no owner are additive and optional:

```js
profile.measurements.waistCm
profile.targets.weightKg
profile.targets.bodyFatPct
profile.targets.waistCm
```

The Profile UI exposes one optional current waist measurement and three optional target values. Empty means unknown / not supplied. Existing Object preferences, custom equipment, memories and other Profile-owned data remain untouched by Profile saves.

### Session-time immutable context

Only a newly created Session receives context snapshots. Both established Session creation paths use the same app-owned constructor boundary:

- ordinary **开始训练**;
- Flow launch when no Session already exists.

At the exact stored Session start timestamp AXIS writes:

```js
session.profileSnapshot = {
  schema: 'axis.profile-snapshot.v1',
  version: 1,
  capturedAt: session.start,
  measurements: {
    heightCm,
    weightKg,
    bodyFatPct,
    waistCm
  },
  training: {
    years,
    weeklyFrequency
  }
}

session.goalSnapshot = {
  schema: 'axis.goal-snapshot.v1',
  version: 1,
  capturedAt: session.start,
  kind,
  targets: {
    weightKg,
    bodyFatPct,
    waistCm
  }
}
```

Optional numeric facts normalize to a finite number or `null`. `null` means no fact existed at Session start; it must never be rendered as zero.

Nickname, custom equipment, visual memories, Object recording overrides, media preferences and other unrelated mutable/profile-private state are deliberately excluded from these historical snapshots.

### Legacy and mutation semantics

- a Session that already existed without these snapshots remains without them;
- AXIS does **not** backfill a legacy Session using today's Profile;
- editing Profile or Goal during an active Session changes only future Sessions;
- the current Session keeps its Session-start snapshots unchanged;
- completion archives the same Session object through the existing app completion/storage owner, so snapshots are carried forward without a second completion path;
- Encounter facts remain independent and are not given Profile copies;
- Flow continues to own orchestration only; it delegates new Session creation to the same app-owned Session truth boundary.

### Cross-platform contract

This work adds portable additive schema identities:

- `axis.profile-snapshot.v1`
- `axis.goal-snapshot.v1`

They are Session context under `axis.domain.v1` / `axis.data.v1`, not a Web-only UI model. Old Web/iOS-compatible data without snapshots remains valid through explicit absence.

## Validation for this work

This work is mergeable only when the exact final PR head proves all of the following without weakening inherited assertions:

1. the complete deterministic AXIS 8.21 `canonical-single-runtime` build remains green;
2. existing Profile `height / weight / bodyFat / years / freq / goal` remain the only editable owners for those current facts;
3. Profile adds only optional current `waistCm` plus optional target `weightKg / bodyFatPct / waistCm`;
4. existing `objectMetricOverrides`, custom equipment, memories and unrelated Profile state survive Profile edits unchanged;
5. ordinary Session creation snapshots Profile and Goal exactly once at `session.start`;
6. Flow-created Session creation snapshots through the same app Session owner and the same schemas;
7. changing Profile/Goal during an active Session cannot mutate that Session's snapshots;
8. the next Session receives the updated Profile/Goal context;
9. completion archives the original snapshots unchanged;
10. a legacy Session without snapshots remains snapshot-absent after load/render/Profile edits; no current-value backfill is allowed;
11. snapshots exclude nickname, custom equipment, memories, Object metric overrides and unrelated preferences;
12. no new LocalStorage namespace, IndexedDB, server state, Session writer, Encounter writer, Active writer, Flow writer or report writer exists;
13. Chromium and iPhone-like WebKit physically prove Profile save → ordinary Session snapshot → mid-Session Profile change → immutable archive → Flow Session new-context snapshot → legacy absence;
14. Current Release, Universal Practice Object, Runtime, Runtime Foundation, Deep Compatibility, Repository, Work Continuity, Cross-Platform, EdgeOne, PR Convergence, Object Metric Override and Profile Session Truth gates are green on the same exact head;
15. after merge, the exact merged `main` SHA passes the existing AXIS Vercel Production deployment/fixed-alias proof, EdgeOne Production mirror, artifact parity, Chromium + iPhone-like WebKit production product flows, and clean runtime error verification.

A green test that copies current Profile values into old Sessions, keeps two editable owners for weight/body-fat, changes Encounter ownership, or makes the report itself authoritative does **not** satisfy this work.

## Next planned stage

Only after this Profile / Goal Session Truth PR is merged and Production-certified:

1. make Trends/report projections explicitly distinguish Session snapshot context from current Profile context;
2. add truthful detailed Session facts and report aggregations without changing their owners;
3. build the detailed Training Report as a read-only projection of Object/Encounter/Session/Profile snapshot truth;
4. add PDF / image export only after the report truth model is complete;
5. keep Node/toolchain convergence as a separate infrastructure change.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.
