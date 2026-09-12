# AXIS Engineering Handoff

## Current release candidate and sealed baseline

AXIS **8.24 — Active Stage Tactile Convergence** is the current Web release candidate. It is **not Production-sealed yet**.

Candidate delivery:

- release PR: **#148**
- exact certified starting `main`: `2418103c786f2d0865aece49d738e9ed9161ef55`
- bounded branch: `axis-824-active-stage-tactile`
- version decision: **8.23 → 8.24 / bump / sequence 9 / product-ui**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate graph: **86 deterministic top-level steps**

The last fully Production-sealed product/runtime is AXIS **8.23 — Replay Evidence Continuity**:

- product behavior PR: **#146**
- final certification/infrastructure merge: **#147**
- runtime seal baseline SHA: `2418103c786f2d0865aece49d738e9ed9161ef55`
- Vercel Production gate `34685665958` — success
- Vercel Public Production Alias Gate `34685665973` — success
- EdgeOne deployment `dp2z63vp6fz9`, run `34685651257` — success
- governed custom-domain run `34685651239` — success

The 8.23 SHA and provider records are the current **runtime seal baseline** and are not a self-referential requirement for the 8.24 candidate. They must not be relabeled as 8.24 evidence.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. No 8.24 work may migrate, clear, duplicate or rewrite them.

## AXIS 8.24 Active Stage Tactile Convergence

8.24 is deliberately bounded to the Active presentation layer. It improves clarity and tactile confidence without introducing another action or fact owner.

- v87 remains the only Active action boundary for pause/toggle, set completion, add-set and hold interactions.
- strength progress has one primary presentation: `第 n / total 组`, then `已完成 n / total 组`.
- time meta presents remaining/estimated time and no longer duplicates set count.
- press, rebound, completion and active-state micro-motion provide bounded feedback.
- Capture / Quick Record fixed controls are isolated as an opaque stacking plane so scrolling separators cannot paint through the dock.
- `prefers-reduced-motion` disables non-essential motion.
- ordinary `single/complete`, Flow, Session, Encounter, recorder, persistence and Evidence semantics remain unchanged.

Ownership remains bounded: no new Session/Encounter/media writer, persistence namespace, database, network owner, AI owner, Active lifecycle owner or historical rewrite.

## Inherited product/runtime foundation

- `app.js` remains canonical Session / Encounter / recorder owner.
- v61 remains classic repeated weight+reps set writer when immutable schema permits.
- v82/v87 remain Active lifecycle/action owners.
- 8.21 whole-item Flow remains intent/orchestration only.
- 8.22 Replay remains Production-sealed derived chronology.
- 8.23 Replay → Media Evidence continuity is Production-sealed and inherited unchanged.
- v815 remains the existing Media Evidence read/presentation owner.
- ordinary `single/complete` Objects remain one-shot outside a proven Flow whole-item.
- applicable numeric optical-center tolerance remains ≤ 0.5 CSS px.

## Certification rule

One exact PR #148 head must pass all inherited contracts plus the AXIS 8.24 tactile product smoke. After merge, the exact merged `main` SHA must pass:

1. fixed Vercel Production exact manifest/artifact parity and Chromium current-release flow including 8.24;
2. exact-prebuilt EdgeOne Production parity plus Chromium and iPhone-like WebKit current-release flow including 8.24;
3. `https://axis.juele.fun` exact parity plus Chromium and iPhone-like WebKit 8.24 proof;
4. final combined Vercel + EdgeOne Production success with no unresolved main-push failure.

Only then may AXIS 8.24 be described as Production-sealed.

Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain deferred from this bounded stage.

Authoritative resume order: `governance/project-state.json` → `governance/version-decision.json` → this handoff → `docs/CURRENT_RELEASE.md` → `docs/CURRENT_WORK.md` → owners/contracts/tests → exact Production evidence.
