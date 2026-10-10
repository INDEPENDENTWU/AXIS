# AXIS Current Work

**Governed milestone:** AXIS 8.31 — Playable Runtime Foundation.
governed target branch: `main`.
Bounded delivery branch: `governance/831-exact-production-seal` · PR **#171**.
Product PR #170 was exact-head merged; PR #171 is governance-only.
Version decision: **8.31 → 8.31 / confirm / sequence 32 / governance**.
**Status:** Production-sealed at exact product/runtime `dddce5401e80087a7ccceb43ec466f1ad7abb505`, independent governance-only PR undergoing separate CI acceptance.

## Production baseline at start of this work

Previous certified product/runtime AXIS 8.30 remains `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f` as immutable history.

## Active change

Governance-only confirmation of already merged and deployed AXIS 8.31; no functional or factual runtime changes.

## Validation for this work

Full product, merged-main and provider evidence follows; governance PR must independently pass exact-head checks before merge.

## Evidence and immutable authority

Previous 8.30 certified runtime `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f`, product PR #167 and governance PR #168; 8.30 certificate remains immutable.

8.31 PR #170 head `7f6396ff769c3d045d50cc6ff7403672d4a02bd5`: 35 successes plus 1 cancelled hygiene, 0 failures. Merged-main `dddce5401e80087a7ccceb43ec466f1ad7abb505`: 33/33 workflow success. Vercel READY, EdgeOne Production exact prebuilt mirror, `axis.juele.fun` real Chromium/WebKit. [8.31 immutable certificate](../governance/production-certifications/8.31.json).

The inherited Training Report, PDF export and Share Card continue to consume `axis.report-range.v1` as the one canonical read-only Report projection. No alternate aggregation, Session/Encounter writer, live Profile historical lookup or export-owned persistence is introduced by the 8.31 governance confirmation.

The native foundation `axis-native-foundation-0` is shared with `INDEPENDENTWU/AXIS-iOS`. One app-owned Flow/Active/Encounter factual authority; PlayableSpec is derived executable intent, no extra storage, Session/Encounter writer, implicit completion, network, AI or timer. The portable contracts `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.playable.v1` retain exact semantics. The repository governance remains authoritative for release state. Chat history is not authoritative project memory.

## Next planned stage

8.32 — PLAY THIS local interaction surface, explicitly outside this governance-only seal.

Historical 8.29 recording certification remains at `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171`.
