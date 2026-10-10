# Current Release — AXIS 8.31

**Status: Production-certified — Playable Runtime Foundation.** Product PR #170, governance-only confirmation sequence 32.

## Certified exact product/runtime SHA

```text
dddce5401e80087a7ccceb43ec466f1ad7abb505
```

Later governance-only commits and Vercel/EdgeOne redeployments do not replace the exact product/runtime SHA.

## Acceptance evidence

- PR #170 exact head `7f6396ff769c3d045d50cc6ff7403672d4a02bd5`: 35 successful workflows; 1 cancelled Branch hygiene run separately preserved, 0 failed.
- Exact merged-main `dddce5401e80087a7ccceb43ec466f1ad7abb505`: 33/33 workflows passed with no failures.
- Vercel Production `dpl_EwhKGdCcWn85LyN1gNPAR1Ybvmrq`, READY, main source `dddce5401e80087a7ccceb43ec466f1ad7abb505`, [Production gate](https://github.com/INDEPENDENTWU/AXIS/actions/runs/38063653692).
- EdgeOne Production `dpndawz2o9le`: exact prebuilt artifact/API parity and real Chromium/WebKit, [verification](https://github.com/INDEPENDENTWU/AXIS/actions/runs/38063617617).
- [axis.juele.fun](https://axis.juele.fun): exact parity, real Chromium/WebKit, [verification](https://github.com/INDEPENDENTWU/AXIS/actions/runs/38063617630).
- [Immutable 8.31 Production certificate](../governance/production-certifications/8.31.json) and [8.30 predecessor](../governance/production-certifications/8.30.json).

The **runtime seal baseline** is `dddce5401e80087a7ccceb43ec466f1ad7abb505`. 8.31's prior candidate state was **not a self-referential requirement** to be certified before testing; acceptance is now independently evidenced.

## Next bounded stage

8.32 PLAY THIS is planned but not part of 8.31. No second Encounter writer, store, recorder, automatic completion or AI/network authority was added by 8.31.
