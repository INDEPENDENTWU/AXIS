# AXIS

Local-first practice software built around what actually happened.

**Current candidate: 8.29 — Recording Friction Collapse** · **Last Production-sealed: AXIS 8.28** · [Open AXIS](https://axis-five-puce.vercel.app) · [Current release](docs/CURRENT_RELEASE.md) · [Engineering handoff](docs/HANDOFF.md)

AXIS is a **Personal Evolution Engine**. Object is reusable practice semantics, Flow is intent, Reality Route follows actual constraints, Active is present execution, Encounter is frozen fact, Evidence is attached to actual history, and Evolution is a read-only projection of change.

## AXIS 8.29 — Recording Friction Collapse

A focused refinement of the existing app-owned Recorder:

- Previously confirmed Encounter values are available as clearly identified *suggestions*, not as new facts.
- The projection reuses only metric keys with matching historical metric type and unit; invalid or incompatible values are excluded.
- Live edits in the same recorder are not lost merely because presentation re-renders.
- Rapid duplicate save attempts cannot enter two concurrent canonical save transactions.
- A user must still confirm the current Encounter using the existing save action.
- No new recorder, Session, Active, Encounter or storage owner is introduced.

Pure portable contract: `axis.recording-continuity.v1`.

**Release status:** 8.29 candidate, PR #164; Production authority remains the exact AXIS 8.28 runtime:

```text
df67fc0a20c0c34a79341315c8c85b5461acfe44
```

AXIS 8.28 was delivered by PR #162 and Production-sealed by governance PR #163; its Vercel, EdgeOne and custom-domain certification remains authoritative until the 8.29 candidate completes the same exact merged-main certification chain.

## Product rules

**Reality before intent.** An old value is a suggestion, never this time's confirmed fact.

**Local first.** Practice doesn't depend on account, network or AI.

**One fact, one owner.** The canonical app recorder remains the sole Encounter writer.

Authoritative stores stay `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`.

Build: `node build-release.mjs`.
