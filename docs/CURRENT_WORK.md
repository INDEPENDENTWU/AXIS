# AXIS Current Work

**Governed milestone:** AXIS 8.31 — Playable Runtime Foundation.
governed target branch: `main`.
Bounded delivery branch: `feature/831-playable-runtime-foundation` · PR **#170**.
Version decision: **8.30 → 8.31 / bump / sequence 31 / product-runtime**.
**Status:** Draft product candidate; not merged, published, Production-certified or governed as a seal.

**Current sealed baseline:** AXIS 8.30 is Production-sealed; AXIS 8.31 remains an unsealed candidate.

## Production baseline at start of this work

Certified AXIS 8.30 product Runtime `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f`, product PR #167 and independent governance PR #168 (governance merged-main `7eb7aa3a16723119d7f15f6243ce18a0d98b734a`). After 28/28 governance-main CI plus Vercel/EdgeOne/`axis.juele.fun` Chromium/WebKit, 8.30 is formally sealed. Prior 8.29 product `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171` and 8.28 `df67fc0a20c0c34a79341315c8c85b5461acfe44` remain immutable historical seals.

## Active change

8.31b — `axis.playable.v1` canonical Object/Flow schema, pure execution projection, idempotent explicitly gated command envelopes, and narrow app-owned Flow/Active/Encounter adapter. No new Writer, storage key, network, timer, session lifecycle, automatic fact acceptance or AI authority. Real user interface and owner browser acceptance remain mandatory.

## Validation for this work

8.31a Source Proof [#38016839079](https://github.com/INDEPENDENTWU/AXIS/actions/runs/38016839079) succeeded. 8.31b source proof #38017367334 succeeded with pure projection and owner adapter contracts. Full 8.31 product gate and Chromium/WebKit validation still pending: no exact-head success, merger, Production claim or governance seal implied.

## Authority

`axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.playable.v1`, `axis.report-range.v1`, existing app.js/v61 Session/Encounter facts and portable `axis-native-foundation-0` in `INDEPENDENTWU/AXIS-iOS` are inherited, not redefined. The repository governance remains authoritative for release truth; chat history is supplemental. Chat history is not authoritative project memory. Conversation history is supplemental only.

## Next planned stage

**8.31c** — exact canonical-owner real Chromium/WebKit interactions, duplicate-command and reload verification, first-use UI without competing Owner, complete CI. **8.31 Final** — exact PR green, merged-main and Vercel/EdgeOne/custom-domain proofs, independent 8.31 seal. Only then start 8.32 local PLAY THIS.
