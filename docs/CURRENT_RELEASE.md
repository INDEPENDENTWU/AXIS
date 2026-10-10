# Current Release — AXIS 8.31

**Status: product-runtime candidate; NOT Production-sealed.** AXIS 8.31 — Playable Runtime Foundation, Draft PR #170, version decision sequence 31 `8.30 → 8.31 / bump / product-runtime`.

## Previous sealed production authority — AXIS 8.30

Certified exact product/runtime: `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f`. Product PR #167. Governance PR #168 merged at `7eb7aa3a16723119d7f15f6243ce18a0d98b734a`. The governance merged-main completed 28/28 CI and Vercel/EdgeOne/custom-domain Chromium/WebKit acceptance. [Immutable 8.30 production certificate](../governance/production-certifications/8.30.json) retains product SHA, provider evidence and the original EdgeOne attempt-1 failure followed by attempt-2 success.

The inherited AXIS 8.29 Runtime `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171` remains historically sealed in its own certificate. No old generic Encounter ID is rewritten by this candidate.

## 8.31 candidate scope

- Versioned `axis.playable.v1` spec, exact canonical Object/Flow intent and deep immutable metric snapshot.
- `axis.playable-execution.v1` pure state projection from the existing FlowRun/Active/current Encounter truth; `axis.playable-command.v1` gate re-evaluates each explicitly requested action against the latest canonical owner state.
- Existing app.js Flow API owns `launch`, `selectCurrent`, `advance`; app.js Encounter and v61/v82/v87 owners remain responsible for confirmed facts and execution. No parallel timer or new durable store.
- Not 8.32 PLAY THIS UI, not sharing, AIR, TAKE, FORK or a new account/cloud service.

**Release blocker:** 8.31 Draft PR #170 requires full exact-head green, real Chromium/iPhone-like WebKit recording/reload proof, protected merge, merged-main Vercel/EdgeOne/`axis.juele.fun` certification and a separate Governance Seal. No claim of public 8.31 availability is valid until then.
