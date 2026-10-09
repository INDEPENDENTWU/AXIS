# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.30** · **Product-runtime candidate — not sealed** · **Production-sealed: 8.29** · [Open certified AXIS](https://axis.juele.fun) · [Engineering handoff](docs/HANDOFF.md)

AXIS is a Personal Evolution Engine. Object is reusable practice meaning; Flow is intent; Active is present execution; Encounter is confirmed fact; Evidence links to history; Evolution is read-only reflection.

## AXIS 8.30 — Object Identity Integrity (candidate)

- Native catalog, search, picker and classic recording must preserve each item's own stable ID. `baseId` is equipment/family metadata and may not become an item's recording identity.
- Explicit current selection precedes ambiguous historical name matches; old Encounters retain original `equipmentId`, name and evidence.
- Custom, personal, history-only and older generic Object identities remain supported. No hidden migration or fabricated attribution.
- Single existing app-owned Encounter writer, existing classic set writer, existing media ownership. No new storage namespace or network authority.

**Current governance: candidate.** AXIS 8.29 is the last Production-sealed runtime at `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171` (product PR #164, governance PR #165). This SHA is the **runtime seal baseline**, not a self-referential requirement for the future 8.30 merge. No 8.30 production certification is asserted.

Delivery: [PR #167](https://github.com/INDEPENDENTWU/AXIS/pull/167) (candidate; verification required) · [Issue #166](https://github.com/INDEPENDENTWU/AXIS/issues/166) · [8.30 scope](docs/AXIS_830_OBJECT_IDENTITY.md).

## Build and governance

`node build-release.mjs` builds the canonical single runtime. Core state is local-first. Existing Object, Session/Encounter, Active/Flow and media owners are not duplicated. All product candidates require exact-head green, SHA-protected merge, merged-main Vercel/EdgeOne/custom domain checks, and separate governance-only seal.

## Next

After 8.30 Product certification, Playable Practice proceeds as: **8.31 Runtime → 8.32 local PLAY THIS → 8.33 real sharing → 8.34 AIR → 8.35 convergence → 8.36 TAKE → 8.37 FORK → 8.38 launch convergence**. None of those future features is included in this candidate.
