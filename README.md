# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.31** · **Production-sealed** · [Open AXIS](https://axis.juele.fun) · [Engineering handoff](docs/HANDOFF.md).

## AXIS 8.31 — Playable Runtime Foundation

`axis.playable.v1` compiles portable canonical Object/Flow intent; deterministic projection and explicit command dispatch use existing app-owned Flow, Active and Encounter truth. Real confirmed Encounter + reload and replay safety were validated on Chromium and iPhone-like WebKit. No parallel history, storage, Active owner, fact writer, AI authority or network dependency.

Certified exact merged-main **product/runtime SHA**: `dddce5401e80087a7ccceb43ec466f1ad7abb505` · product [PR #170](https://github.com/INDEPENDENTWU/AXIS/pull/170). Later governance-only commits and redeployments never replace this identity.

[8.31 immutable Production certificate](governance/production-certifications/8.31.json) · [Current Release](docs/CURRENT_RELEASE.md) · [Playable design](docs/AXIS_831_PLAYABLE_RUNTIME.md) · [Issue #169](https://github.com/INDEPENDENTWU/AXIS/issues/169).

Previously Production-sealed AXIS 8.30: `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f` ([immutable certificate](governance/production-certifications/8.30.json)).

## Architecture

Object → Flow → Active → Encounter → Evidence → Evolution. Reusable intent is not history. Existing app.js and v61/v82/v87 own confirmed facts. Generic historical Encounters are never silently rewritten.

## Release discipline

Exact-head CI → protected product merge → merged-main Vercel/EdgeOne/`axis.juele.fun` real browser acceptance → independent governance seal. 8.32 local PLAY THIS, sharing, AIR, TAKE and FORK are future bounded stages not contained in 8.31.
