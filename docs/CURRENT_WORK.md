# AXIS Current Work

**Governed milestone:** AXIS 8.30 — Object Identity Integrity.
governed target branch: `main`.
**Status:** Production-sealed at exact product/runtime `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f`.
**Product PR:** #167 · **Independent governance decision:** 8.30 → 8.30 / confirm / sequence 30 / governance.

## Completed delivery

Native/custom Object identity is preserved through real catalog search, UI selection, Quick Record save and reload in Chromium and iPhone-like WebKit. Six native Objects and one same-label custom Object were checked against confirmed Encounter `equipmentId`; old generic historical facts remained unchanged.

Exact PR head: `31fdcaf5b78ef15968c3540821e5d32cf3806dd3`, 34/34 workflows success.
Exact merged-main product SHA: `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f`, 30/30 successful push workflows after EdgeOne attempt-2 completion, no remaining failures.
Providers: Vercel READY `dpl_ASBJRgKpMJonNnNBtd1XeumdZ36T`; EdgeOne `dpb4uzrph6wm` verified in run #38013000237 attempt 2; `axis.juele.fun` parity and Chromium/WebKit verified in run #38013000220.

The initial EdgeOne attempt-1 WebKit transient failure remains in its workflow history and certification record. It was resolved by rerunning the same exact SHA; no runtime/test assertion was relaxed. Certified provider evidence is stored in `governance/production-certifications/8.30.json`.

## Authority

`app.js` remains the Encounter/Session writer; `v61` remains the classic set writer. `axis.object-identity.v1` is derived resolution only. No historic mutation, new recorder writer, data migration, new storage or AI/network authority. The prior 8.29 product/runtime `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171` and certificate remain immutable.

## Next planned stage

**AXIS 8.31 — Playable Runtime Foundation.** Start only as a separately governed product candidate; PLAY THIS, AIR, TAKE and FORK require independent admission and proof. The foundation remains `axis-native-foundation-0` in `INDEPENDENTWU/AXIS-iOS`; portable contracts and local-first history remain authoritative.
