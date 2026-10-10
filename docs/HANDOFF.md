# AXIS Engineering Handoff

**Governed candidate:** AXIS 8.31 — Playable Runtime Foundation · version decision `8.30 → 8.31` / `bump` / sequence **31** / `product-runtime`.

**Delivery:** `feature/831-playable-runtime-foundation` · Draft PR [#170](https://github.com/INDEPENDENTWU/AXIS/pull/170) · [Issue #169](https://github.com/INDEPENDENTWU/AXIS/issues/169). **No 8.31 product/runtime merged or shipped yet.**

## Exact sealed predecessor

8.30 certified product/runtime SHA `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f`, product PR #167, independent governance PR #168 merged at `7eb7aa3a16723119d7f15f6243ce18a0d98b734a`. 28/28 governance-main CI and Vercel, EdgeOne and `axis.juele.fun` production proof succeeded after seal. 8.30 certificate: `governance/production-certifications/8.30.json`. 8.29 prior product/runtime `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171` retains its own certificate. Never conflate the governance merge, latest redeploy and the certified product/runtime authority.

## 8.31b implementation contract

`lib/axis-playable.mjs` exact Object/Flow compiler; `axis.playable.v1` portable contract. `lib/axis-playable-execution.mjs` pure, deterministic `projectPlayableExecution`, `planPlayableCommand`, `dispatchPlayableCommand`. `scripts/prepare-831-playable-integration.mjs` injects the app-owned bridge `window.__AXIS_831_PLAYABLE__` in the canonical single Runtime, with no dynamic import or extra network request.

The only allowed dispatch targets are existing Flow API `launch`, `selectCurrent`, `advance` or existing exact Object selection. Confirmed Encounter facts are matched by exact `event.id`, `equipmentId`, `flowProvenance.flowRef` and `flowStepRef`; a stored `lastEncounterId` or family `baseId` alone never authorizes progression. Duplicate/replayed commands are re-projected from live owner state; no Playable-local transaction store, Session writer, Encounter writer, AI authority or parallel timer.

8.31b source-stage tests succeeded; full deterministic 8.31 build, all CI, browser verification and provider certifications still require evidence and correction. This remains a Draft product PR.

## Real validation and closeout

Pure compiler/projection adversarial test, build-chain contract, canonical assembled single Runtime, real native/custom Object/Flow selection and user-confirmed fact in Chromium and iPhone-like WebKit, reload/replay, stale command rejection, no duplicate Encounter, no revised historical generic facts. After exact-head green only, SHA-leased merge, merged-main Production Vercel READY, EdgeOne exact prebuilt mirror and `axis.juele.fun` live browser parity. Independent governance-only 8.31 seal retains the certified product SHA.

## Cross-platform and roadmap

Preserve `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis-native-foundation-0` in `INDEPENDENTWU/AXIS-iOS`; no unversioned native semantic fork. 8.32 PLAY THIS local, 8.33 sharing, AIR, TAKE and FORK are future bounded stages, none included now.
