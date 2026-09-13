# AXIS Engineering Handoff

## Current release candidate and sealed baseline

AXIS **8.25.1 — Inline Set Morph** is the current Web release candidate. It is **not Production-sealed yet**.

Candidate delivery:

- release PR: **#151**
- exact sealed starting `main`: `e28f0411288e42fc68e70a79a4180a06f7d18ee3`
- bounded branch: `axis-8251-inline-set-morph`
- version decision: **8.25 → 8.25.1 / bump / sequence 12 / product-ui**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate graph: **87 deterministic top-level steps**; Inline Set Morph is chained after 8.25 inside the existing late 8.24.1 step, not a new release topology

The last fully Production-sealed product/runtime is AXIS **8.25 — Set Lock Interaction**:

- release PR: **#150**
- runtime seal baseline SHA: `e28f0411288e42fc68e70a79a4180a06f7d18ee3`
- canonical Vercel deployment `dpl_HjrgujidrdBxDo9n243jnaoi4w5k` — READY / Production / exact main SHA
- Vercel Production gate `34747540811` — success
- Vercel Public Production Alias Gate `34747540777` — success
- EdgeOne deployment `dplc6t1yw7ho`, run `34747525787` — success
- governed custom-domain run `34747525811` — exact parity plus Chromium and iPhone-like WebKit success
- combined Vercel + EdgeOne Production commit status — success

The 8.25 SHA and provider records are the current **runtime seal baseline** and are not a self-referential requirement for the 8.25.1 candidate. They must not be relabeled as 8.25.1 evidence.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. No 8.25.1 work may migrate, clear, duplicate or rewrite them.

## AXIS 8.25.1 Inline Set Morph

The 8.25 completion boundary is factually correct, but its body-level fixed overlay competes with the Active interface and can visually cover information the user still needs. 8.25.1 corrects the presentation architecture rather than adding another layer.

The bounded interaction is:

- the existing v87 `completeSet()` remains the only set-completion action and writes its existing facts first;
- the established Active render boundary observes `done > prevDone`; only there does Inline Set Morph begin;
- the existing `.axis821StageFact` row stays at the same height and temporarily becomes the completion surface;
- its normal facts crossfade out while a compact `01 / 04 · 已完成` status lands in the same grid row;
- the existing progress rail receives a short lock pulse, the primary button settles from its press, and the clock receives a very small micro-settle;
- the fact row then returns to the canonical next progress state without changing stage height or introducing a second visual plane;
- final-set completion uses `本動作完成` in the same bounded row;
- the existing bounded two-beat haptic patterns remain on supported devices;
- the old `#axis825SetLock` body-level overlay is explicitly hidden and its active trigger is retired;
- `prefers-reduced-motion` uses a short in-place fade only.

The completion moment may not use fixed/absolute positioning, independent z-index takeover, fullscreen interception, confetti, badge, synthetic score or a second completion button.

Ownership remains bounded: no new Session/Encounter/media writer, persistence namespace, database, network owner, AI owner, Active lifecycle owner, recorder or historical rewrite. Inline Set Morph must never call a training-state writer.

## Inherited product/runtime foundation

- `app.js` remains canonical Session / Encounter / recorder owner.
- v61 remains classic repeated weight+reps set writer when immutable schema permits.
- v82/v87 remain Active lifecycle/action owners.
- 8.21 whole-item Flow remains intent/orchestration only.
- 8.22 Replay remains Production-sealed derived chronology.
- 8.23 Replay → Media Evidence continuity is Production-sealed and inherited unchanged.
- 8.24 Active Stage Tactile is Production-sealed and inherited.
- 8.24.1 Dock Occlusion is Production-sealed and inherited; fixed dock containment must remain `none` at computed style and its occlusion curtain opaque.
- 8.25 Set Lock factual timing and haptic boundary are Production-sealed; only its full-screen visual treatment is superseded.
- v815 remains the existing Media Evidence read/presentation owner.
- ordinary `single/complete` Objects remain one-shot outside a proven Flow whole-item.
- applicable numeric optical-center tolerance remains ≤ 0.5 CSS px.

## Certification rule

One exact PR #151 head must pass all inherited contracts plus the AXIS 8.25.1 Inline Set Morph physical smoke in Chromium and iPhone-like WebKit. Physical proof must verify the completion moment stays inside the fact-row bounds, does not intersect the timer or either Active control, keeps stage geometry stable, advances the canonical set truth exactly once and has no horizontal overflow.

After merge, the exact merged `main` SHA must pass:

1. fixed Vercel Production exact manifest/artifact parity and Chromium current-release flow including Inline Set Morph;
2. exact-prebuilt EdgeOne Production parity plus Chromium and iPhone-like WebKit current-release flow including Inline Set Morph;
3. `https://axis.juele.fun` exact parity plus Chromium and iPhone-like WebKit Inline Set Morph proof;
4. final combined Vercel + EdgeOne Production success with no unresolved main-push failure.

Only then may AXIS 8.25.1 be described as Production-sealed.

Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain deferred from this bounded stage.

Authoritative resume order: `governance/project-state.json` → `governance/version-decision.json` → this handoff → `docs/CURRENT_RELEASE.md` → `docs/CURRENT_WORK.md` → owners/contracts/tests → exact Production evidence.
