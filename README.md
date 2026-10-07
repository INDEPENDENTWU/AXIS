# AXIS

Local-first practice software built around what actually happened.

**Current release: 8.28** · **Release candidate** · last Production-sealed: **AXIS 8.27** · [Open AXIS](https://axis-five-puce.vercel.app) · [Engineering handoff](docs/HANDOFF.md) · [Current work](docs/CURRENT_WORK.md)

AXIS is a **Personal Evolution Engine**. Objects describe reusable practice, Flow describes intended continuity, Reality Route follows what is actually possible now, Encounters freeze what happened, Evidence anchors those facts, and Evolution reveals change without inventing a second history.

The exact Production runtime seal remains:

```text
d6044f0b30a92c007dd2fbab5792c2aa62dfd485
```

That SHA is AXIS 8.27 from PR #160. The bounded candidate is **AXIS 8.28 — Practice Loop Convergence**, PR **#162**.

## AXIS 8.28 — Practice Loop Convergence

8.28 makes the established product pieces behave like one continuous experience:

```text
Flow intent
→ Reality Route
→ current Active execution
→ Encounter fact
→ next real action
```

A user can launch a Flow, leave the app, return, continue the exact current item, pause it, return again, and remain on the same factual state without a new confirmation flow, duplicate Encounter, second Active owner, or new persistence namespace.

The portable projection is `axis.practice-loop.v1`. It derives UI phase only: ready, between-items, executing, paused, recovering, settling, or complete. It does not own facts.

## Product rules

**Reality is authoritative.** Intent never overwrites what actually happened.

**Local first.** Core practice works without account, network, or model calls.

**One fact, one owner.** Practice Loop is projection, not a second Session/Encounter/Active system.

**Continuity without fiction.** Reloading may restore presentation, never manufacture progress.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

Release build:

```bash
node build-release.mjs
```
