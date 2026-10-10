# AXIS 8.31 — Playable Runtime Foundation

**Authoritative closeout:** [8.31 Production certificate](../governance/production-certifications/8.31.json) · exact runtime `dddce5401e80087a7ccceb43ec466f1ad7abb505`. Candidate-phase notes below are historical engineering evidence.

**Status:** 8.31b product-runtime Draft candidate PR #170, version decision sequence 31; not Production-certified. Pure execution projection and existing app Flow/Active/Encounter bridge admitted, browser and full release validation pending. This document does not promote the public release: AXIS 8.30 stays the only Production-sealed release until an explicit, independently certified 8.31 product merge.

**Admission:** AXIS 8.30 Governance PR #168 merged-main `7eb7aa3a16723119d7f15f6243ce18a0d98b734a`, 28/28 push gates green; Vercel, EdgeOne and `axis.juele.fun` certified. Immutable AXIS 8.30 **product/runtime** `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f`. [Delivery issue #169](https://github.com/INDEPENDENTWU/AXIS/issues/169).

## Product purpose

A **PlayableSpec** is bounded, safe, locally executable *intent*. It is not an Encounter, Session, proof of achievement, AI decision, public challenge or source of historical truth. The intended later experience is: open a practice, understand what it entails and start immediately without an account, complex setup or obligatory installation. AXIS 8.31 establishes semantics, not that finished user experience.

## Owner boundaries

| Concern | Existing authority | Playable responsibility |
| --- | --- | --- |
| Object identity | 8.30 canonical Object `id` | exact stable reference; never family `baseId` or ambiguous matching |
| Ordered reusable steps | `axis.flow.v1` | read-only, bounded resolved step snapshot |
| Recording metrics/modes | `axis.metric-schema.v1`, `axis.resolved-flow-step.v1` | copy effective schema and mode, no new writer |
| Actual execution | existing `v82/v87` Active / app-owned Flow runtime | future command projection/adapter; no independent timer |
| Completed fact | existing app-owned Encounter, `v61` set writer | can report completion only from confirmed canonical evidence |
| Local history/media | `axis_v60_state`, current IndexedDB/media owners | no reads/writes/migration in the pure compiler |
| Native platform | `axis-native-foundation-0`, `axis.domain.v1` | platform-neutral portable contract |

## 8.31a compiler contract

- `compilePlayableSpec({playableId,source,objects,heading?})` accepts exactly `source.kind='object'` with `objectId` or `source.kind='flow'` with a real `axis.flow.v1` document.
- The resolver delegates to existing `normalizeFlow` / `resolveFlowStep`, checks each selected ID against the *exact* canonical Object ID, and snapshots effective metric schema/execution/repeat.
- An Object and its family `baseId` may differ. Two Objects may share display names or equipment families but never collapse to one step ID. If a reference is missing, compilation fails explicitly; it does not fabricate a new Object or reinterpret historical Encounter.
- 1–32 steps, per-step repeat 1–99, max 128-character opaque identifiers, defensive JSON depth/size limits, no executable fields, arbitrary URLs or script/HTML entrypoints. Static intent is deeply immutable once compiled; caller Objects and Flow remain unchanged.
- `assertPlayableSpec` validates the bounded portable envelope and restores a detached immutable copy. **No browser storage, DOM, time, network, account, AI, active action or Encounter mutation** is invoked by the compiler.
- `compilerVersion: 8.31a` is a **contract-stage compiler marker**, not the public AXIS runtime version. No 8.31 release status is claimed.

## Staged admission

**8.31a** — this document, machine-readable `axis.playable.v1`, pure compiler and adversarial node proof. **8.31b** — explicit `8.30 → 8.31` product-runtime bump, canonical build integration and pure attempt command/state projection (idempotent and reload-safe). **8.31c** — existing runtime owner bridge with real Chromium/WebKit evidence, no duplicated Session/Encounter. **8.31 Final** — exact-head green, protected merge, merged-main Vercel/EdgeOne/domain evidence and separate governance seal.

## Explicit non-goals

No 8.32 PLAY THIS local UI claim, 8.33 sharing, 8.34 AIR gesture control, 8.36 TAKE inference, 8.37 FORK or public ranking. No new data writer, storage namespace, backend or product analytics. A failure to resolve an Object, confirm execution or recover ownership must be surfaced honestly.
