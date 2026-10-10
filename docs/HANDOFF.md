# AXIS Engineering Handoff

**Current governed release:** AXIS 8.31 — Playable Runtime Foundation.
**Production status:** Production-certified. **Governed target branch:** `main`.
**Product PR:** #170. **Independent confirmation:** sequence 32, `8.31 → 8.31 / confirm / governance`.

## Certified product/runtime SHA

```text
dddce5401e80087a7ccceb43ec466f1ad7abb505
```

This is the exact merged-main product/runtime SHA, not the governance PR head/merge commit or a later Vercel deploy. Previously certified 8.30 runtime `eb38bb5cf3c47b6bdee44c5d0f2588f610aced6f` remains immutable.

## Production verification

- Product PR #170 exact head `7f6396ff769c3d045d50cc6ff7403672d4a02bd5`: 35 success, one cancelled Branch hygiene, no failed gates.
- Product merged-main `dddce5401e80087a7ccceb43ec466f1ad7abb505`: 33/33 passed, Chromium/iPhone-like WebKit Playable → confirmed Encounter → reload → idempotent Flow advancement.
- Vercel READY `dpl_EwhKGdCcWn85LyN1gNPAR1Ybvmrq`, exact main SHA; Production gate #38063653692.
- EdgeOne Production `dpndawz2o9le`, exact prebuilt/API parity and Chromium/WebKit #38063617617.
- `axis.juele.fun` exact domain parity, Chromium/WebKit #38063617630.

[Immutable production certificate](../governance/production-certifications/8.31.json) and historical [8.30 certificate](../governance/production-certifications/8.30.json) hold authoritative links and proof.

## Runtime contract and factual ownership

`axis.playable.v1`, `axis.playable-execution.v1`, `axis.playable-command.v1` are derived. Existing app.js FlowRun, Encounter, v61 recording, v82/v87 Active and Media owners remain authoritative. Exact canonical Object IDs and real provenance/timestamp are mandatory. No second writer, automatic completion, AI or network authority.


## Current engineering work — AXIS 8.32a (contract-only)

The 8.31 Production seal is **closed**, not still awaiting certification: product PR #170; governance PR #171 merged into `f0cd8fbd86d1d63b7b8b14e705abbfed1ff2843b`, exact governance PR 29/29 successful, governance merged-main 29/29 push plus 3/3 deployment-status workflow successes. Vercel Git Production READY, EdgeOne and `axis.juele.fun` Chromium and iPhone-like WebKit green. Issue #169 is closed.

The current unshipped design stage is **8.32a — Local PLAY THIS Experience Contract**, Issue [#172](https://github.com/INDEPENDENTWU/AXIS/issues/172), delivery branch `design/832a-play-this-experience-contract`. Its output is the [source-grounded experience/audit contract](AXIS_832_PLAY_THIS_EXPERIENCE.md), [AXIS-wide presentation standard](EXPERIENCE_QUALITY_STANDARD.md) and [20 acceptance scenarios](../tests/acceptance/axis-832-play-this.feature).

**There are no 8.32 runtime or UI changes in this stage**. The 8.31 exact product/runtime SHA and Production certificate remain unchanged. `governance/version-decision.json` sequence **32** is retained while this documentation-only design PR is under review; next executable product iteration must make sequence **33**, `8.31 → 8.32 / bump / product-runtime`, and update the authoritative `docs/CURRENT_WORK.md` with the then-current feature branch and real product contract. The Gherkin scenarios are **not yet wired to a browser runner** and must not be reported as passing automated UI tests.

### Exact next action for 8.32b

1. Audit final canonical build order and add only the missing safe browser-side compiler/entry adapter without a new fact owner.
2. Replace or delegate the existing Object/Flow action *in place*; preserve one action owner and the already shipped Home/Active geometry, focus, safe-area and locale/theme semantics.
3. Require actual Encounter/FlowRun owner acknowledgements; no synthetic completion or blind stale command replay.
4. Implement and execute the 20-scenario acceptance matrix and real 320–430px Chromium/iPhone-like WebKit visual checks. The experience-standard aesthetic review remains a human-inspected release gate.
5. Product PR exact Head all required CI green → SHA-leased merge → merged-main Production verification on canonical Vercel, EdgeOne and official domain → independent governance seal.

**Continuing risk:** `main` branch protection is still disabled. Do not treat an open PR or CI success as permission for an unleased merge. Track this as repository governance debt separately from the product release.

## Next stage

AXIS 8.32 local PLAY THIS UI is not shipped or sealed in 8.31; require a separate product scope and version decision.

Historical AXIS 8.29 production runtime: `4a9c73b2ea5330b9cffad3f9e322eb6970dfe171` (immutable preceding seal).
