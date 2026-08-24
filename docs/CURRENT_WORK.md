# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine truth starts at [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Formal public Production is **AXIS 8.20 — Executable Practice Objects**.
- PR **#83** merged to `main` as **`4be22ce9eb43a72dd208b9cdb835b43b93a62581`**.
- Vercel Production `dpl_57AteLo7fx3D6HNMrJrhjS9y8VQ8` is READY at `https://axis-five-puce.vercel.app` and serves exact `sourceCommit = 4be22ce9eb43a72dd208b9cdb835b43b93a62581`, `version = 8.20`, `baseVersion = 8.20`, `architecture = canonical-single-runtime`.
- EdgeOne Production `https://axisfitness-mirror-9x91gveo.edgeone.cool` serves the same canonical artifact; exact Vercel/EdgeOne parity and Chromium + iPhone WebKit Production flows passed for 8.20.
- AXIS 8.19 capture default-entry hotfix PR **#82** remains inherited: default Photo / Scan / Video resolution is app-owned, while Scan 3/5 seconds is an independent sampling preference.

Machine-governance compatibility note: `governance/project-state.json` retains the governed historical line **AXIS 8.19 — Universal Practice Objects** on branch `product/819-universal-practice-objects`. Those exact historical strings remain required by repository continuity checks until governance is advanced through a coordinated release record; this file records the newer runtime truth without rewriting historical provenance.

## Active change

**AXIS 8.20.1 — Executable Object Reliability** · branch `fix/8201-executable-object-reliability`.

This hotfix is opened by three real Production failures observed on the 8.20 user path, not by a speculative feature request:

1. A newly created/edited custom Object can persist an explicit schema such as **速度 / 配速**, while the immediately opened Quick Record surface still shows **重量 / 次数 / 组数**. Root cause: the 8.18 editor wrote the richer `metricSchema` to `axis_v60_state` after a delayed timer, but `app.js` retained a stale in-memory custom Object. 8.20 correctly trusted Object Truth; the live Object Truth itself had not yet received the editor change.
2. A non-classic executable Object such as **靠墙站立** can save an Encounter but fail to enter the polished single-item **进行中** surface. Root cause: the 8.19 Active Truth safety seal intentionally allowed activity metadata only for immutable classic weight+reps Encounter schemas. 8.20 generalized Recording but did not yet supersede that classic-only lifecycle restriction.
3. Chinese picker surfaces can expose stable internal enum IDs such as `strength` / `cardio`. Persisted enum IDs are valid internal data and must remain stable, but visible Chinese presentation must not leak them.

8.20.1 closes these gaps without creating a new recorder, activity owner, database or persistence store:

- the existing v874 custom editor remains the one visible Object editor;
- editor schema persistence publishes one authoritative `axis:object-schema-changed` event after canonical custom save;
- `app.js`, still the Object Truth/state owner, consumes that event into live `state.profile.customEq` immediately and persists the same truth, preventing a later stale state save from undoing the schema;
- the complete 8.18 metric vocabulary remains available: weight, reps, sets, duration, intensity, distance, resistance, pace, hold and custom metrics;
- `recording.metrics` is updated only as a compatibility projection (`version: 2`); authoritative recording semantics remain `metricSchema`;
- persistent Active lifecycle is controlled by executable semantics: `sets`, `rounds`, `timed`, `hold` are ongoing; `single`, `complete` are one-shot and must not create false ongoing state;
- v82 remains the Active Truth creation owner and v87 remains the polished Active presentation/action owner;
- set-only UI such as **完成一组**, set counts and add-set behavior is shown only for `sets`, never merely because an Object carries the historical coarse type `strength`;
- the 8.19 immutable Encounter-schema restriction on v61 metadata remains untouched: v61 may write classic metadata only for immutable weight+reps Encounter schemas;
- `strength` and `cardio` remain internal stable IDs, while visible Chinese picker presentation maps them to **力量** and **有氧** only.

Authoritative persistence remains `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak` and `axis_v42_media`. The native/cross-platform handoff remains anchored by `axis-native-foundation-0` and repository `INDEPENDENTWU/AXIS-iOS`, with portable contracts `axis.domain.v1` and `axis.data.v1`.

**Chat history is not authoritative project memory. GitHub governance, contracts, tests and deployment truth remain authoritative.**

## Required validation

8.20.1 may merge only when the exact head proves the physical user flows on Chromium and iPhone-like WebKit:

- actual no-match Quick Record search → **+ 新建自定义** → choose only **速度 / 配速** → Save → without reload the selected Object is explicit Object Truth and the recorder shows only the schema-driven `pace` field, with legacy strength/cardio fields suppressed;
- saving that pace-only Object freezes `metricSchemaSnapshot = [pace]`, `executionModeSnapshot = single`, preserves the pace value and creates no false persistent Active lifecycle;
- actual custom **靠墙站立** with duration-only schema → Quick Record → **记下** creates `executionModeSnapshot = timed`, writes app-owned activity metadata and displays the v87 **进行中** surface with pause/finish but no set-completion or add-set controls;
- legacy/classic strength fallback still enters the existing set Active flow;
- Chinese picker presentation contains no standalone visible `strength` / `cardio` labels while internal persisted IDs remain unchanged;
- 8.20 immutable Encounter semantics, 8.19 v61 schema authority, Capture defaults, Evolution, Media Evidence, Runtime, Repository, Work Continuity and Cross-Platform gates remain green;
- no second persistence owner, duplicate Active owner, new database, hidden migration or historical capability relabeling is introduced.

## Release plan

1. Keep public identity **8.20** while the behavior patch is under exact-head CI so failures are repaired without pretending an unsealed hotfix is Production.
2. Once Chromium + iPhone WebKit and inherited gates are green, seal formal public/base identity as **8.20.1** through a dedicated release step; do not relabel 8.18/8.19/8.20 capability provenance.
3. Re-run the full exact-head release matrix after the identity seal.
4. Merge only the exact green SHA. Verify Vercel Production serves that merged-main SHA with `version/baseVersion = 8.20.1`.
5. Require EdgeOne exact-artifact/API parity plus real Chromium and iPhone WebKit Production flows before declaring the hotfix complete.
6. Only then continue to **8.21 Flow / Session Blueprint**. Flow must build on a proven Object → Recorder → Active/one-shot → immutable Encounter chain rather than masking these ownership defects.

**Conversation history is supplemental only. GitHub handoff/contracts/tests are authoritative for this work.**
