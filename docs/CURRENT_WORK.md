# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine truth starts at [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Formal public Production is **AXIS 8.19**.
- AXIS 8.19 capability PR **#80** merged as `d97b483f5b297e4bc9483a7484da5587cc4f17d8`; formal release-seal PR **#81** merged as `430c919e1609589a26864868692ae20cf6ce9617`.
- Capture default-entry correctness PR **#82** merged to `main` as **`20284a2022d683f2c441197b8348d1de19d82fe2`**.
- Vercel Production `dpl_5782KLckoN9ZMG9W81eXSronTzsx` is READY at `https://axis-five-puce.vercel.app` and serves the exact PR #82 merged SHA with `version = 8.19`, `baseVersion = 8.19`, `architecture = canonical-single-runtime` and `upo819 = true`.
- EdgeOne Production Mirror for the PR #82 hotfix is required to reach exact-SHA parity before that mirror is treated as the updated rollback baseline; the prior 8.19 EdgeOne artifact remains the last fully verified mirror meanwhile.

## Active change

**AXIS 8.20 — Executable Practice Objects** · branch `product/820-executable-practice-objects`.

The user-visible regression that opens this milestone is concrete: an Object can be created/edited with an explicit recording schema such as **时间 + 强度**, while the real **快速记录** path still classifies the Object by coarse `strength/cardio` type and renders **重量 + 次数 + 组数**. Capture/Review already understands explicit Object Truth from 8.19; Quick Record does not. Editing the Object therefore appears to have no practical effect in the high-frequency path.

8.20 closes that split without adding another data store or another Encounter writer:

- persisted explicit `metricSchema` is executable truth, not descriptive metadata;
- Quick Record, Capture/Review and future recording entries resolve the same Object Truth schema;
- explicit schema wins over coarse category/type; legacy category defaults are fallback only when no explicit schema exists;
- measurement facts and execution semantics are separated through an execution-mode resolver (`single`, `sets`, `rounds`, `timed`, `hold`, `complete`) while retaining old records and legacy UI compatibility;
- a duration/intensity Object derives `timed` even when its historical coarse category is `strength`;
- classic `v61` weight/reps/sets UI remains only for legacy objects or a genuinely classic explicit weight+reps Object with sets execution;
- a saved Encounter freezes both `metricSchemaSnapshot` and `executionModeSnapshot`; editing the Object later affects future records only and can never rewrite historical facts;
- no destructive migration is allowed. Existing explicit schemas, legacy events and historical 8.18/8.19 provenance remain readable.

The native/cross-platform handoff remains anchored by `axis-native-foundation-0` and repository `INDEPENDENTWU/AXIS-iOS`, with portable contracts `axis.domain.v1` and `axis.data.v1`. 8.20 may extend portable semantics, but must not create a Web-only persistence truth that prevents later native convergence.

Authoritative persistence remains `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak` and `axis_v42_media`. `app.js` remains the canonical base session/Encounter persistence and camera/media owner. `v61.js` remains the classic high-frequency strength-set presentation/metadata owner only when the immutable Object/Encounter schema grants it that ownership.

**Chat history is not authoritative project memory.** GitHub governance, contracts, tests and deployment truth remain authoritative.

## Validation for this work

8.20 may merge only when the exact head proves the real user path, not only source-string contracts.

Required proof:

- a custom Object whose coarse type is `strength` but whose explicit schema is `duration + intensity` opens through the real **快速记录** entry with only 时间 + 强度 controls;
- weight/reps/sets controls are not visible or writable for that non-classic explicit Object;
- saving produces authoritative `metrics.duration` / `metrics.intensity`, an exact immutable `metricSchemaSnapshot`, and an `executionModeSnapshot` of `timed` without stale weight/reps/sets facts;
- after editing the Object schema, the next Quick Record uses the new schema immediately while the previous Encounter snapshot and metrics remain unchanged;
- legacy catalog strength objects retain the existing fast set recorder;
- the same executable-Object regression passes Chromium and iPhone-like WebKit;
- inherited AXIS 8.19 Universal Practice Object, Active Truth, Capture, runtime, repository, work-continuity and cross-platform gates remain green;
- no second persistence owner, duplicate recorder owner, destructive migration or historical marker relabeling is introduced.

## Next planned stage

1. Finish the 8.20 source bridge and exact Quick Record executable-object regression on `product/820-executable-practice-objects`.
2. Run both Chromium and iPhone-like WebKit against the same built artifact; repair real ownership/runtime failures rather than weakening assertions.
3. Seal formal public/base identity as **8.20** only after executable-object behavior is green, preserving all historical 8.18/8.19 capability provenance.
4. Merge only the exact tested head, confirm Vercel Production serves the merged-main SHA and 8.20 manifest, then require EdgeOne exact-artifact parity and both live browser flows.
5. Use the sealed 8.20 Object → executable recorder → immutable Encounter chain as the foundation for **8.21 Flow / Session Blueprint**, where several Objects may be arranged without making every Object simultaneously Active.

**Conversation history is supplemental only. GitHub handoff/contracts/tests are authoritative for this work.**
