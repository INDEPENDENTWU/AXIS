# AXIS Current Work

> Canonical engineering handoff. Product truth remains in `CURRENT_RELEASE.md`; this file records the latest verified engineering state and the next controlled boundary.

## Production baseline at start of this work

- Public product: AXIS 8.12.2.
- Product main at the start of this release: `c55ae086577612af6ba8a6a794e680b46d1b6309`.
- Architecture: `canonical-single-runtime`.
- Fixed Production endpoint: `axis-five-puce.vercel.app`.
- Production 8.12.2 identity at the start of this work: release hash `aae183f5ac1b`, core `391de3b640c7`, CSS `b72ec8bd2ae4`, one initial JavaScript request, zero dynamic JavaScript and zero chunks.
- AXIS 8.12 Language Studio corpus, AXIS 8.12.1 Safari Group Plan native-button fix, AXIS 8.12.2 Settings ownership, and AXIS 8.13 Stage 3 read-only Live Route are inherited and must remain intact.

## Active change

**AXIS 8.12.3 — learning interaction simplification and Settings alignment only.**

The scope is intentionally narrow:

- align the top-level `学习安排` and `云端与AI` rows to the exact native Settings horizontal rhythm and baseline;
- remove nonessential helper copy from Learning and Cloud/AI Settings;
- retire the user-facing `学法` decision entirely;
- keep the primary Learning decisions as `目标 / 强度 / 难度 / 对话`, with the existing reduced fine-tune surface below them;
- retire all current-product `跟读 / 影子 / A/B 对比 / 开始影子 + 录音` mode UI and event entry points;
- replace learning practice modes with one stable three-action surface: `听原声 / 录音 / 听我的`;
- preserve best-available local system voice routing, ephemeral local MediaRecorder capture, in-memory replay, no upload and no autoplay;
- preserve `axis_v89_speak` as the only learning store; an old `method` preference may remain readable for compatibility but no longer controls current presentation;
- preserve `axis_v811_services` as the Cloud/AI store and preserve user-invoked status network semantics.

Explicitly out of scope and unchanged: workout recording, scan/review, Group Plan commit/touch ownership, `axis_v60_state`, `axis_v8_meta`, IndexedDB media, camera, watermark, active-session timers, State Field, Reality Runtime and Live Route ownership.

## Validation for this work

The dedicated `AXIS 8.12.3 Learning Simplify Gate` is release-blocking in Chromium and iPhone-like WebKit. It must prove:

- public identity `8.12.3 / 8.12.3` with canonical single runtime, one initial JS and zero dynamic chunks;
- top-level Learning/Cloud rows align with a native Settings row within a tight geometry tolerance and introduce no extra divider;
- Learning core shows exactly `目标 / 强度 / 难度 / 对话` and exposes no `学法` control;
- helper strings such as `大脑用什么方式练`, `每天出现多少`, `表达复杂度`, `一次练到多完整`, `一次决定可发送的数据类型` are absent from visible Settings;
- an existing legacy `method: shadow` preference cannot bring back shadow/repeat UI;
- a learning card exposes exactly `听原声 / 录音 / 听我的`, with no mode tabs, method lab, `影子`, `跟读`, or `A/B` copy;
- listening uses the inherited local system voice route without autoplay;
- recording requests the microphone only after explicit user action, remains in memory, can be replayed locally, and performs no upload;
- Settings and learning interactions leave `axis_v60_state` and `axis_v8_meta` byte-identical;
- inherited real scan/review Group Plan regression still passes in Chromium and iPhone-like WebKit;
- existing 8.12 Language Studio content counts and AXIS 8.13 Stage 3 read-only ownership remain green.

Historical release gates may continue to record that older 8.10.x releases once implemented echo/shadow workflows. AXIS 8.12.3 adds explicit retirement gates so those historical markers do not imply a current user-facing owner.

## Next planned stage

Only after AXIS 8.12.3 is Production-verified may controlled AXIS 8.13 work continue. The next planned product migration remains **AXIS 8.13 Stage 4 — Reality Actions**; historical workout facts and current recording ownership remain authoritative.
