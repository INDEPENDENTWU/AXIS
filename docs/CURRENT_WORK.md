# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.1.
- Current Product main: `a7b29bf3d9e117dbb1c6f1d813bfbf62028f103d`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Vercel Production: `dpl_61GsV6YmwpxL1A2uqdWfcfnKDZ6S`, READY on exact source commit `a7b29bf3…`.
- Fixed Production manifest: version/base `8.12.1`, release hash `11dd55544804`, core `f86c16349f02`, CSS `76a9e76610fc`, one initial JavaScript request, zero dynamic JavaScript and zero chunks.
- AXIS 8.12 Language Studio semantics and AXIS 8.13 Stage 3 Continue + Live Route remain inherited; Stage 3 remains read-only presentation.
- The Safari Group Plan P0 is fixed in main by removing the custom `pointerup/preventDefault` layer and using the native button touch→click path owned by the existing v874 click handler.

## Active change

**AXIS 8.12.1 final field regression guard seal.**

Product behavior is already corrected and Production-deployed. This remaining change is test/governance only and aligns one Chromium-only Settings assertion with the actual progressive-disclosure UI.

The dedicated final-head WebKit run has already proved the complete real user path after the native activation fix:

- inline Learning / Cloud+AI Settings;
- valid photo decode/review;
- visible canonical `#v8710Cards` catalog;
- select `胸推`;
- real iPhone-like tap on the sole native `.v875PlanEntry[data-v875-plan]` / `.v8121PlanButton`;
- planner opens;
- four-set progression applies;
- `记下` persists the factual four-set result.

The same exact-head Chromium run stopped earlier in Settings because it measured the height of a `能力状态` fact row while that progressive-disclosure `<details>` block was still collapsed. That row is not an interactive touch target and has zero visible geometry while collapsed, so the guard is corrected to explicitly open the capability disclosure before measuring its visible 13 px / 46 px presentation. Product code is unchanged by this guard correction.

## Validation for this work

The `AXIS 8.12.1 Hotfix Gate` remains the canonical field guard and must pass in Chromium and iPhone-like WebKit with these rules:

- Learning / Cloud+AI top-level typography matches native Settings left-label / right-value hierarchy;
- Cloud/AI inner headings, facts and privacy rows preserve the hardened readable hierarchy;
- geometry assertions apply only to visible content; collapsed progressive-disclosure content is opened before visible-row geometry is measured;
- no extra Settings divider or nested Settings sheet returns;
- active workout → `拍摄记录` → real image decode/review succeeds;
- the visible canonical catalog opens and `胸推` can be selected;
- native Group Plan activation opens the planner by normal click/tap semantics;
- four sets plus a progression mode apply to four visible draft rows;
- `记下` persists a strength event with four sets in `axis_v60_state` and four set rows in `axis_v8_meta`;
- the hotfix remains `recordingOwner:false` and emits no page error.

After this guard-only change is merged, the Product artifact must remain behaviorally unchanged: AXIS 8.12.1, canonical single runtime, one initial JavaScript request, zero dynamic JavaScript and no new training/storage/planner owner. Production runtime error inspection must remain clean.

## Next planned stage

Only after this AXIS 8.12.1 field guard is fully green may controlled work continue to **AXIS 8.13 Stage 4 — Reality Actions**.

Stage 4 may alter temporary continuation intent such as `这个器械有人`, `我只剩 20 分钟`, or `今天到这里`. Historical workout facts remain authoritative and immutable.
