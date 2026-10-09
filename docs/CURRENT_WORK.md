# AXIS Current Work

Governed active milestone: `AXIS 8.29 — Recording Friction Collapse`.
governed target branch: `main`.

Bounded delivery branch: `governance/829-production-seal` · PR **#165**.
Version decision: **8.29 → 8.29 / confirm / sequence 28 / governance**.
repository governance remains authoritative over conversation history.
Chat history is not authoritative project memory. Conversation history is supplemental only; the exact repository state and verified provider evidence are the project source of truth.

**Status: 8.29 Production-certified.** Product PR **#164** merged; exact product/runtime SHA:

```text
4a9c73b2ea5330b9cffad3f9e322eb6970dfe171
```

Repository governance, artifact identity and provider evidence are authoritative; conversation history is not project governance.

## Production baseline at start of this work

Prior AXIS 8.28 Production-sealed runtime: `df67fc0a20c0c34a79341315c8c85b5461acfe44` (product PR #162, governance PR #163). Product 8.29 runtime was promoted separately by PR #164; this governance PR is a non-product seal closeout.

## Active change

8.29 Recording Friction Collapse is the product change already merged and provider verified. This governance-only closeout certifies that existing product without adding behavior or factual writers.

## Validation for this work

- Version decision **sequence 28**: `8.29 → 8.29 / confirm / governance`. No product/runtime behavior change in this closeout.
- Product PR exact head `8dc4d80f17c061b81a294963c4723f1d6d7e826e`: **33/33** successful PR workflows.
- Product exact merged-main push runs: **28** total, **27 success / 1 cancelled (Branch hygiene) / 0 failed**.
- Vercel `dpl_BJz2iaThLqFnPbTDJ4RTQdDPKNY1` READY, source commit exact; Current Release `37831475540` and Deep Compatibility `37831475524`.
- EdgeOne `dpfctvvd321b`, verification run `37831475199` including Chromium and WebKit.
- `axis.juele.fun` exact parity + Chromium/WebKit success, run `37831475553`, **attempt 2**.
- Certificate: `governance/production-certifications/8.29.json`. Later governance-only commits do not alter product/runtime SHA.
- Prior sealed AXIS 8.28 exact runtime: `df67fc0a20c0c34a79341315c8c85b5461acfe44` (product PR #162, governance PR #163).

AXIS 8.29 implemented safe previous-value suggestions, same-recorder draft continuity, and an in-flight save guard, without creating any competing Encounter, Session, Active, media or storage writer.

## Next planned stage

### Approved milestone — NOT YET STARTED

**AXIS 8.30 — Object Identity Integrity.** Preserve correct per-item identity across full catalog, suggestions, search, Quick selection, recent, custom objects, Object Recorder, Flow, History and Evolution. Protect historical fact provenance and do not silently split ambiguous old events.

Object IDs discovered as a risk at the catalog projection include `run` versus `treadmill`, `seated-row` versus `chest-row`, and `leg-curl` versus `seated-curl` and `lying-curl` due to shared baseId selection.

After 8.30 is Production-sealed, the separately governed Playable Practice sequence is: **8.31 Playable Runtime, 8.32 local PLAY THIS, 8.33 real sharing, 8.34 AIR, 8.35 PLAY THIS × AIR, 8.36 TAKE, 8.37 FORK, 8.38 Product Convergence**.

Each product release requires a fresh decision, bounded PR, pure invariants, Chromium/WebKit tests, exact-head green, exact merged-main Production verification, and separate governance-only seal. Do not preemptively upgrade this 8.29 governance commit to release 8.30 or add new product behavior.

## Inherited cross-platform authority

Portable contracts include `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.reality-route.v1`, `axis.execution-constraints.v1`, `axis.practice-loop.v1`, `axis.recording-continuity.v1`, and `axis.report-range.v1`. Cross-platform foundation is `axis-native-foundation-0` in `INDEPENDENTWU/AXIS-iOS`; no new native owner is created by this governance closeout.
