# AXIS

Local-first practice software built around what actually happened.

**Current public release: 8.30 — Production-sealed** · [Open AXIS](https://axis.juele.fun) · [Engineering handoff](docs/HANDOFF.md).

**Next product candidate: AXIS 8.31 — Playable Runtime Foundation** ([Draft PR #170](https://github.com/INDEPENDENTWU/AXIS/pull/170)). 8.31 is not released. It introduces a bounded PlayableSpec execution protocol that resolves exact native/custom Object identity, projects execution from existing Flow/Active/Encounter facts and delegates only explicitly requested commands to existing app owners. It creates no independent history, storage, recorder, Active lifecycle or AI/network dependency.

Certified 8.30 **product/runtime**: `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f`. Independent 8.30 Governance SHA: `7eb7aa3a16723119d7f15f6243ce18a0d98b734a`. The former—not a later governance/deployment SHA—remains Production authority until 8.31 is independently certified.

[Playable Runtime design](docs/AXIS_831_PLAYABLE_RUNTIME.md) · [Current Release](docs/CURRENT_RELEASE.md) · [8.30 production certificate](governance/production-certifications/8.30.json) · [8.31 delivery issue](https://github.com/INDEPENDENTWU/AXIS/issues/169).

## Architecture

AXIS is a Personal Evolution Engine: **Object → Flow → Active → Encounter → Evidence → Evolution**. Object/Flow express reusable intent; existing app.js and v61/v82/v87 authorities commit actual facts. Historic generic Encounter IDs remain immutable. Versioned portable contracts are additive to `axis.domain.v1` and `axis.data.v1`.

## Release discipline

One public version decision per bounded product stage, deterministic canonical build, exact-head browser/compatibility CI, SHA-protected merge, merged-main Vercel/EdgeOne/`axis.juele.fun` certification and separate governance seal. AXIS 8.31b remains a Draft candidate; 8.32 local PLAY THIS, public sharing, AIR, TAKE and FORK remain planned.
