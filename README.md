# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.30** · **Production-sealed** · [Open AXIS](https://axis.juele.fun) · [Engineering handoff](docs/HANDOFF.md)

AXIS is a Personal Evolution Engine. Object represents reusable practice meaning; Flow describes intent; Active represents execution; Encounter is confirmed fact; Evidence attaches to history; Evolution is read-only reflection.

## AXIS 8.30 — Object Identity Integrity

- Every native or custom Object retains its own canonical ID across catalog, search, selection, Quick Record, Encounter persistence and reload.
- `baseId` remains family metadata, never a substitute for a selected Object's ID.
- Same-name personal/native Objects remain distinct; ambiguous historical generic IDs stay unchanged.
- The existing app and classic owners remain the only fact writers. No new storage, network or AI authority.

**Certified product/runtime SHA:** `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f` (product PR [#167](https://github.com/INDEPENDENTWU/AXIS/pull/167)). Governance-only commits and later provider redeploys do not change this exact runtime authority.

[Production certificate](governance/production-certifications/8.30.json) · [Current Release](docs/CURRENT_RELEASE.md) · [Object identity contract](docs/AXIS_830_OBJECT_IDENTITY.md).

## Build and governance

`node build-release.mjs` produces the canonical single runtime. Product release approval requires exact-head PR CI, exact merged-main CI, Vercel and EdgeOne deployments, and independent custom-domain Chromium/WebKit production checks. Governance is sealed separately from product code.

## Next

**AXIS 8.31 — Playable Runtime Foundation**, preceding local PLAY THIS, shareable PLAY THIS, AIR, TAKE and FORK. None of those future features is included in AXIS 8.30.
