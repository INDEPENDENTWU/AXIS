# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.1.
- Current Product main before this final seal: `ba47e32d7e3342704654dc23f873fe421a56fdfa`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Vercel Production: `dpl_AK74hVUcNG1hkw5adzLaM6NSGiNm`, READY on exact source commit `ba47e32d…`.
- Fixed Production manifest: version/base `8.12.1`, release hash `b6bc9d1b2a2e`, core `d4a06c85bcd4`, CSS `76a9e76610fc`, one initial JavaScript request, zero dynamic JavaScript and zero chunks.
- AXIS 8.12 Language Studio semantics and AXIS 8.13 Stage 3 Continue + Live Route remain inherited; Stage 3 remains read-only presentation.
- PR #41 established the 8.12.1 native Group Plan entry and PR #42 sealed native Settings typography / Cloud+AI geometry.

## Active change

**AXIS 8.12.1 Safari Group Plan activation + canonical field regression seal.**

The final iPhone-like WebKit regression isolated the real remaining P0: after the Group Plan entry had already become a native `<button>`, the hotfix still installed an extra `pointerup` handler that called `preventDefault()`, manually opened the planner and de-duplicated the later click. Chromium's click path worked, but WebKit `tap()` proved that the custom pointer layer could interfere with Safari's native touch→click activation.

The controlled correction is intentionally smaller:

- `.v875PlanEntry[data-v875-plan]` remains the sole Group Plan entry and is a native `button[type=button]`;
- `v874-set-bridge` remains the sole planner UI/click owner;
- Safari/WebKit now uses the browser's normal native button touch→click semantics;
- the custom `pointerup`, `preventDefault`, manual `openPlan()` and click de-duplication state are removed;
- `touch-action: manipulation` and tap-highlight suppression remain presentation-only;
- `window.__AXIS_RECORDING__.applyPlan` / v61 remain the only recording commit path;
- no new storage, Runtime, media, timer, planner or recording owner is introduced.

The dedicated field guard is also converged on current canonical owners only: inline Settings, real photo decode/review, visible `#v8710Cards` catalog, canonical Group Plan button, four-set apply and authoritative saved storage.

## Validation for this work

The `AXIS 8.12.1 Hotfix Gate` is release-blocking on the exact final head in Chromium and iPhone-like WebKit and must prove:

- Learning / Cloud+AI top-level typography exactly matches native Settings left-label / right-value hierarchy;
- Cloud/AI inner headings, facts and privacy rows remain readable at the hardened 12–13 px hierarchy with 40–48 px touch geometry;
- no extra Settings divider or nested Settings sheet returns;
- active workout → `拍摄记录` → real image decode/review succeeds;
- the visible canonical catalog opens and `胸推` can be selected;
- native Group Plan activation opens the planner by normal click/tap semantics;
- four sets plus a progression mode apply to four visible draft rows;
- `记下` persists a strength event with four sets in `axis_v60_state` and four set rows in `axis_v8_meta`;
- the hotfix remains `recordingOwner:false` and emits no page error.

Chromium on the immediately preceding candidate already completed this full canonical path successfully. The final candidate must additionally prove the same native activation path in iPhone-like WebKit after removal of the custom pointer layer, and all inherited repository/runtime/product gates must remain green.

After merge, Vercel Production and the fixed public alias must serve the exact merged SHA as AXIS 8.12.1 with canonical single runtime, one initial JavaScript request and zero dynamic chunks. The fixed-Production hotfix/browser gates and runtime error inspection must be clean before this release is considered sealed.

## Next planned stage

Only after this AXIS 8.12.1 field seal is Production-verified may controlled work continue to **AXIS 8.13 Stage 4 — Reality Actions**.

Stage 4 may alter temporary continuation intent such as `这个器械有人`, `我只剩 20 分钟`, or `今天到这里`. Historical workout facts remain authoritative and immutable.
