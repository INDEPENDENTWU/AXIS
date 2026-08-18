# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.1.
- Current verified Product main for this guard work: `ba47e32d7e3342704654dc23f873fe421a56fdfa`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Vercel Production: `dpl_AK74hVUcNG1hkw5adzLaM6NSGiNm`, READY on exact source commit `ba47e32d…`.
- Fixed Production manifest: version/base `8.12.1`, release hash `b6bc9d1b2a2e`, core `d4a06c85bcd4`, CSS `76a9e76610fc`, one initial JavaScript request, zero dynamic JavaScript and zero chunks.
- AXIS 8.12 Language Studio semantics and AXIS 8.13 Stage 3 Continue + Live Route remain inherited; Stage 3 remains read-only presentation.
- PR #41 established the 8.12.1 Group Plan touch hardening. PR #42 sealed native Settings typography and Cloud/AI geometry without changing recording ownership.

## Active change

**AXIS 8.12.1 canonical field regression seal.**

This change is test/governance only. It does not alter the Production product artifact, UI, Runtime, storage, media, sound, cloud/AI or planner behavior.

The dedicated `scripts/axis-8121-hotfix-smoke.mjs` is being converged away from retired internal DOM toward the current canonical user path:

- Settings validation uses the current inline Learning and Cloud/AI owners;
- image review uses a browser-stable normal RGB image fixture and still exercises `photoInput → frameFromFile → reviewFrames`;
- equipment selection uses the visible canonical `#v8710Cards` catalog rather than retired hidden `#eqList`;
- Group Plan uses the sole canonical `.v875PlanEntry[data-v875-plan]` / `.v8121PlanButton` entry;
- plan application is verified by four visible draft rows and, after `记下`, the authoritative `axis_v60_state` event plus `axis_v8_meta` four-set metadata;
- no test-only state injection is permitted after the image-review entry point and no hidden legacy catalog may stand in for the user-visible flow.

## Validation for this work

The `AXIS 8.12.1 Hotfix Gate` remains release-blocking and must pass the exact final test head in Chromium and iPhone-like WebKit.

It must prove:

- Learning top-level label matches the native Settings left-label typography;
- Learning and Cloud/AI top-level summaries match the native Settings right-value typography;
- Learning/Cloud outer dividers remain removed;
- Learning and Cloud/AI inner controls preserve readable 12–13 px hierarchy and 40–48 px touch geometry;
- one Settings sheet remains the only Settings surface;
- active workout → `拍摄记录` → valid image review succeeds;
- the visible canonical equipment catalog opens and `胸推` can be selected;
- the canonical Group Plan entry is a single touch-safe button and opens the planner;
- selecting four sets plus a progression mode and applying produces four visible set rows;
- `记下` persists a strength event with four sets in `axis_v60_state` and four set rows in `axis_v8_meta`;
- the 8.12.1 hotfix remains `recordingOwner:false` and no page error is emitted.

After this guard is merged, the fixed Production alias must continue serving AXIS 8.12.1 with the same product behavior. Any future Product change affecting this path must keep this canonical Chromium/WebKit regression green.

## Next planned stage

Only after this 8.12.1 field seal is fully green may controlled work continue to **AXIS 8.13 Stage 4 — Reality Actions**.

Stage 4 may alter temporary continuation intent such as `这个器械有人`, `我只剩 20 分钟`, or `今天到这里`. Historical workout facts remain authoritative and immutable.
