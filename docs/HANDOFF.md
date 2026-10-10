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

## Next stage

AXIS 8.32 local PLAY THIS UI is not shipped or sealed in 8.31; require a separate product scope and version decision.
