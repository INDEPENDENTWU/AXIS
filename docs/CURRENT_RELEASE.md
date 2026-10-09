# Current Release — AXIS 8.30

**Status: product-runtime candidate — Object Identity Integrity.** Not merged, not Production-sealed.

Product target **PR #167**: distinct displayed native Object IDs must be maintained through search/picker, selected Equipment, Quick and classic recording, saved Encounter and History/Evolution. Any old ambiguous base-family Encounter remains an immutable historical fact; no unsupported reassignment.

## Production baseline (currently certified)

AXIS **8.29** remains the Production-sealed release. Its exact **product/runtime SHA** is:

```text
4a9c73b2ea5330b9cffad3f9e322eb6970dfe171
```

Product PR #164, governance PR #165 (exact merged governance-main `6713b47576e902c2015c63b7bb82b23691ec7a3c`). Vercel `dpl_BJz2iaThLqFnPbTDJ4RTQdDPKNY1`, EdgeOne `dpfctvvd321b` and `axis.juele.fun` were certified for that product runtime; post-governance merge 26 successful workflows, 1 cancelled Branch hygiene, no failures. Latest governance merge deployment is not a new product SHA.

This `8.29` exact certified product SHA is the **runtime seal baseline**, **not a self-referential requirement** for an 8.30 product PR; only after a new exact merged-main product SHA is verified may Production authority advance.

## 8.30 candidate contract

- Canonical `id` is authoritative for every new selection and persisted Encounter; `baseId` is only optional family metadata.
- Ambiguous alias/name never silently chooses an unrelated history Object; explicit selection prevails.
- Read-only identity audit, exact build contract, Chromium/WebKit actual save/reload proof and provenance mutation checks.
- No historical Encounter rewrite, second Recorder, new storage, network or AI dependency.
- Existing Flow/Active/Session and Evidence remain authoritative.

## Promotion criteria

Exact green PR head for #167 → protected merged-main → Vercel, EdgeOne and `axis.juele.fun` → governance certificate and independent seal. No candidate is marked Production-certified ahead of those steps.

## Planned successor

AXIS **8.31 Playable Runtime**, then PLAY THIS and AIR, subject to measured product acceptance.
