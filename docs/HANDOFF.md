# AXIS Engineering Handoff

## Current release candidate and sealed baseline

AXIS **8.24.1 — Dock Occlusion Hotfix** is the current Web release candidate. It is **not Production-sealed yet**.

Candidate delivery:

- release PR: **#149**
- exact certified starting `main`: `321647b9aaca783b7f6ba99ec66616941208c698`
- bounded branch: `hotfix/8241-dock-occlusion`
- version decision: **8.24 → 8.24.1 / bump / sequence 10 / product-ui**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- candidate graph: **87 deterministic top-level steps**

The last fully Production-sealed product/runtime is AXIS **8.24 — Active Stage Tactile Convergence**:

- release PR: **#148**
- runtime seal baseline SHA: `321647b9aaca783b7f6ba99ec66616941208c698`
- Vercel Production gate `34700744685` — success
- Vercel Public Production Alias Gate `34700744673` — success
- EdgeOne deployment `dp7e6rlpyczu`, run `34700727554` — success
- governed custom-domain run `34700727551` — success

The 8.24 SHA and provider records are the current **runtime seal baseline** and are not a self-referential requirement for the 8.24.1 candidate. They must not be relabeled as 8.24.1 evidence.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. No 8.24.1 work may migrate, clear, duplicate or rewrite them.

## AXIS 8.24.1 Dock Occlusion Hotfix

The post-8.24 visual report is treated as a concrete paint/compositing defect. The fixed Capture / Quick Record dock had an underlay extending above the dock, but `contain: paint` could clip that negative-top overscan. The underlay also started transparent, so a one-pixel scrolling separator could remain visible even though the 8.24 structural layering test passed.

The bounded correction is:

- keep the fixed dock in the existing v87 presentation/action boundary;
- remove only paint containment while retaining layout/style containment;
- make the dock background fully opaque;
- replace the translucent gradient underlay with an opaque overscan curtain extending 16 CSS px above and 6 CSS px below the dock edge;
- keep Capture / Quick Record controls explicitly above the curtain;
- prove actual computed opacity, geometry and stacking in Chromium and iPhone-like WebKit;
- preserve reduced-motion, set-progress and tactile semantics inherited from Production-sealed 8.24.

Ownership remains bounded: no new Session/Encounter/media writer, persistence namespace, database, network owner, AI owner, Active lifecycle owner, recorder or historical rewrite.

## Inherited product/runtime foundation

- `app.js` remains canonical Session / Encounter / recorder owner.
- v61 remains classic repeated weight+reps set writer when immutable schema permits.
- v82/v87 remain Active lifecycle/action owners.
- 8.21 whole-item Flow remains intent/orchestration only.
- 8.22 Replay remains Production-sealed derived chronology.
- 8.23 Replay → Media Evidence continuity is Production-sealed and inherited unchanged.
- 8.24 Active Stage Tactile is Production-sealed and inherited unchanged except for the bounded dock paint correction.
- v815 remains the existing Media Evidence read/presentation owner.
- ordinary `single/complete` Objects remain one-shot outside a proven Flow whole-item.
- applicable numeric optical-center tolerance remains ≤ 0.5 CSS px.

## Certification rule

One exact PR #149 head must pass all inherited contracts plus the AXIS 8.24.1 dock-occlusion product smoke in both engines. After merge, the exact merged `main` SHA must pass:

1. fixed Vercel Production exact manifest/artifact parity and Chromium current-release flow including 8.24.1;
2. exact-prebuilt EdgeOne Production parity plus Chromium and iPhone-like WebKit current-release flow including 8.24.1;
3. `https://axis.juele.fun` exact parity plus Chromium and iPhone-like WebKit 8.24.1 proof;
4. final combined Vercel + EdgeOne Production success with no unresolved main-push failure.

Only then may AXIS 8.24.1 be described as Production-sealed.

Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain deferred from this bounded stage.

Authoritative resume order: `governance/project-state.json` → `governance/version-decision.json` → this handoff → `docs/CURRENT_RELEASE.md` → `docs/CURRENT_WORK.md` → owners/contracts/tests → exact Production evidence.
