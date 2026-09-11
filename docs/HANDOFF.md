# AXIS Engineering Handoff

## Current release candidate and sealed baseline

AXIS **8.23 — Replay Evidence Continuity** is the current Web release candidate. It is **not Production-sealed yet**.

Candidate delivery:

- release PR: **#146**
- exact certified starting `main`: `cbcecfe9f7bfd18c8f05ced2bd760a60a03b15b5`
- bounded branch: `product/823-replay-evidence-continuity`
- version decision: **8.22 → 8.23 / bump / sequence 7 / product-runtime**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate graph: **86 deterministic top-level steps**

The last fully Production-sealed product/runtime remains AXIS **8.22 — Truthful Evolution Replay**:

- sealed product PR: **#144**
- runtime seal baseline SHA: `abba7ed3e66bcfdff7b6ed3142e2a59e8b58d631`
- Vercel Production gate `34612916951` — success
- Vercel Public Production Alias Gate `34612916591` — success
- EdgeOne deployment `dpp90dvhamrl`, run `34612882892` — success
- governed custom-domain run `34612882890` — success

The 8.22 SHA and provider records are the current **runtime seal baseline** and are not a self-referential requirement for the 8.23 candidate. They must not be relabeled as 8.23 evidence.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. No 8.23 work may migrate, clear, duplicate or rewrite them.

## AXIS 8.23 Replay Evidence Continuity

The live 8.22 implementation had two individually factual but independent selectors: Replay could focus one Encounter while Media Evidence could still display another evidence-bearing Encounter. AXIS 8.23 closes that presentation-truth gap.

- v822 Replay emits transient exact Encounter identity through `axis:evolution-replay-selection`.
- identity uses eventId first, with sessionId/time fallback.
- existing v815 Media Evidence consumes that transient selection and remains the only Evidence read/presentation owner.
- if the selected Encounter has media, v815 shows that exact evidence.
- if the selected Encounter has no media but the Object has evidence elsewhere, v815 shows **“这一次没有留下影像证据”** and does not silently display another date.
- wholly no-media Objects retain the existing data-only/no-capture-pressure state.
- explicit manual Evidence inspection remains possible; a later Replay selection re-anchors Evidence.

Ownership remains bounded: no new Session/Encounter/media writer, persistence namespace, database, network owner, AI owner, score, prediction, advice or historical rewrite.

## Inherited product/runtime foundation

- `app.js` remains canonical Session / Encounter / recorder owner.
- v61 remains classic repeated weight+reps set writer when immutable schema permits.
- v82/v87 remain Active lifecycle owners.
- 8.21 whole-item Flow remains intent/orchestration only.
- 8.22 Replay remains Production-sealed derived chronology.
- v815 remains the existing Media Evidence owner.
- ordinary `single/complete` Objects remain one-shot outside a proven Flow whole-item.
- applicable numeric optical-center tolerance remains ≤ 0.5 CSS px.

## Certification rule

One exact PR head must pass all inherited contracts plus AXIS 8.23 in Chromium and iPhone-like WebKit. After merge, the exact merged `main` SHA must pass:

1. fixed Vercel Production exact manifest/artifact parity and Chromium 8.23 flow;
2. exact-prebuilt EdgeOne Production parity plus Chromium and iPhone-like WebKit 8.23 flow;
3. `https://axis.juele.fun` exact parity plus Chromium and iPhone-like WebKit 8.23 flow;
4. final combined Vercel + EdgeOne Production success with no unresolved main-push failure.

Only then may AXIS 8.23 be described as Production-sealed.

Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain deferred from this bounded stage.

Authoritative resume order: `governance/project-state.json` → `governance/version-decision.json` → this handoff → `docs/CURRENT_RELEASE.md` → `docs/CURRENT_WORK.md` → owners/contracts/tests → exact Production evidence.
