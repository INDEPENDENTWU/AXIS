# AXIS Engineering Handoff

## Current release candidate and sealed baseline

AXIS **8.25 — Set Lock Interaction** is the current Web release candidate. It is **not Production-sealed yet**.

Candidate delivery:

- release PR: **#150**
- exact sealed starting `main`: `d4b009c327f6fa9c4900eaa41d7195f10f6ed425`
- bounded branch: `axis-825-set-lock`
- version decision: **8.24.1 → 8.25 / bump / sequence 11 / product-ui**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate graph: **87 deterministic top-level steps**; Set Lock is chained from the existing late 8.24.1 step, not a new release topology

The last fully Production-sealed product/runtime is AXIS **8.24.1 — Dock Occlusion Hotfix**:

- release PR: **#149**
- runtime seal baseline SHA: `d4b009c327f6fa9c4900eaa41d7195f10f6ed425`
- canonical Vercel deployment `dpl_5P7gF35XDzSAkHoLwmpJ3PQJsT2w` — READY / Production / exact main SHA
- Vercel Production gate `34744363573` — success
- Vercel Public Production Alias Gate `34744363564` — success
- EdgeOne deployment `dpp8w54o5vox`, run `34744342607` — success
- governed custom-domain run `34744342633` — success
- Chromium and iPhone-like WebKit Production proofs — success

The 8.24.1 SHA and provider records are the current **runtime seal baseline** and are not a self-referential requirement for the 8.25 candidate. They must not be relabeled as 8.25 evidence.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. No 8.25 work may migrate, clear, duplicate or rewrite them.

## AXIS 8.25 Set Lock Interaction

The product problem is not that set completion lacks an animation; it is that the physical action currently has too little consequence on screen. Set Lock therefore makes a successful completion feel like a fact being locked into the session, while leaving the existing factual owner untouched.

The bounded interaction is:

- `#v87Primary` gains visibly deeper physical press travel and faster release;
- the existing v87 `completeSet()` remains the only set-completion action and writes its existing facts first;
- the established Active render boundary already observes `done > prevDone`; only there does Set Lock begin;
- a large completed-set numeral such as `01 / 04` lands near screen center with a short perspective settle;
- two side clamps converge around the numeral while a broad pressure halo expands and the Active stage gives a restrained recoil;
- after the lock moment, that numeral scales/translates toward `#axis821StageProgressText`, so the completion resolves into the canonical progress state rather than a detached toast;
- normal and final-set completions use bounded two-beat haptic patterns on supported devices;
- one reusable pointer-inert overlay is timer-reset on subsequent completion, preventing visual stacking;
- `prefers-reduced-motion` removes clamp/pressure/travel motion and preserves only a short static transition.

There is deliberately no confetti, badge, synthetic score, fullscreen interception or second completion button.

Ownership remains bounded: no new Session/Encounter/media writer, persistence namespace, database, network owner, AI owner, Active lifecycle owner, recorder or historical rewrite. Set Lock must never call a training-state writer.

## Inherited product/runtime foundation

- `app.js` remains canonical Session / Encounter / recorder owner.
- v61 remains classic repeated weight+reps set writer when immutable schema permits.
- v82/v87 remain Active lifecycle/action owners.
- 8.21 whole-item Flow remains intent/orchestration only.
- 8.22 Replay remains Production-sealed derived chronology.
- 8.23 Replay → Media Evidence continuity is Production-sealed and inherited unchanged.
- 8.24 Active Stage Tactile is Production-sealed and inherited.
- 8.24.1 Dock Occlusion is Production-sealed and inherited; fixed dock containment must remain `none` at computed style and its occlusion curtain opaque.
- v815 remains the existing Media Evidence read/presentation owner.
- ordinary `single/complete` Objects remain one-shot outside a proven Flow whole-item.
- applicable numeric optical-center tolerance remains ≤ 0.5 CSS px.

## Certification rule

One exact PR #150 head must pass all inherited contracts plus the AXIS 8.25 Set Lock physical smoke in Chromium and iPhone-like WebKit. The smoke is intentionally chained through the inherited 8.24.1 physical proof so every existing production surface that certifies 8.24.1 also physically certifies Set Lock without adding a parallel release workflow.

After merge, the exact merged `main` SHA must pass:

1. fixed Vercel Production exact manifest/artifact parity and Chromium current-release flow including Set Lock;
2. exact-prebuilt EdgeOne Production parity plus Chromium and iPhone-like WebKit current-release flow including Set Lock;
3. `https://axis.juele.fun` exact parity plus Chromium and iPhone-like WebKit Set Lock proof;
4. final combined Vercel + EdgeOne Production success with no unresolved main-push failure.

Only then may AXIS 8.25 be described as Production-sealed.

Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain deferred from this bounded stage.

Authoritative resume order: `governance/project-state.json` → `governance/version-decision.json` → this handoff → `docs/CURRENT_RELEASE.md` → `docs/CURRENT_WORK.md` → owners/contracts/tests → exact Production evidence.
