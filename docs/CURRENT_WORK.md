# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.1.
- Verified `main` at the start of this seal: `ce010ae5c23f26b5458050426e42724559bb4c82`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Vercel Production: `dpl_BzTuDgvfEwf7xDPtrVbCC1ysNgnG`, READY on exact source commit `ce010ae5…`.
- Fixed Production manifest: version/base `8.12.1`, release hash `63e34eaf485c`, core `c4d6b67854b2`, CSS `76a9e76610fc`, one initial JavaScript request, zero dynamic JavaScript and zero chunks.
- AXIS 8.12 Language Studio semantics and AXIS 8.13 Stage 3 Continue + Live Route remain inherited; Stage 3 remains read-only presentation.
- PR #41 shipped the 8.12.1 Group Plan touch hardening and Settings refinement, but its dedicated Chromium field gate found one remaining visual mismatch before reaching the Group Plan scenario: the top-level Learning/Cloud Settings row typography rendered at 15 px while the native Settings sibling renders at 13 px.

## Active change

**AXIS 8.12.1 native Settings typography seal.**

This is a minimal follow-up to the already deployed 8.12.1 field hotfix. It changes no training, Runtime, storage, media, sound, cloud/AI or planner ownership.

The only product correction is:

- `学习安排` and `云端与 AI` top-level inline Settings row label/value typography must match the native AXIS Settings sibling exactly at 13 px;
- inner controls remain at the already hardened 13 px hierarchy with 42 px option touch targets;
- the canonical Group Plan touch hardening from PR #41 remains unchanged: the existing `.v875PlanEntry[data-v875-plan]` remains the sole planner entry, with touch-safe activation and canonical `v874-set-bridge` / `window.__AXIS_RECORDING__.applyPlan` ownership;
- no second planner entry, no new writer and no new runtime chunk may be introduced.

## Validation for this work

The existing dedicated `AXIS 8.12.1 Hotfix Gate` is release-blocking on the exact follow-up head and must pass in both Chromium and iPhone-like WebKit.

It must prove the complete field path, not just the typography fix:

- Learning and Cloud/AI top-level Settings text exactly matches the native Settings fold typography;
- Learning/Cloud outer gate borders remain removed and layout remains aligned without horizontal overflow;
- inner option controls preserve engineered 40–44 px touch geometry and readable hierarchy;
- one Settings sheet remains the only Settings surface;
- seed an active workout;
- open the normal `拍摄记录` flow;
- supply an image into review;
- select a strength machine;
- perform a real touch/click on the canonical `组计划` entry;
- change the planner to four sets and a progression mode;
- apply through the canonical planner and save the record;
- verify `axis_v60_state` and `axis_v8_meta` contain the factual four-set result;
- verify `recordingOwner:false` for the hotfix and zero page errors.

After merge, the fixed Production alias must still report AXIS 8.12.1, the exact merged main SHA, canonical single runtime, one JavaScript request and zero dynamic chunks. The dedicated Production hotfix/browser gate and Production runtime error inspection must be clean.

## Next planned stage

Only after this 8.12.1 seal is Production-verified may controlled work continue to **AXIS 8.13 Stage 4 — Reality Actions**.

Stage 4 may alter temporary continuation intent such as `这个器械有人`, `我只剩 20 分钟`, or `今天到这里`. Historical workout facts remain authoritative and immutable.
