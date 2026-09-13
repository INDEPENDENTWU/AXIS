# Current Work

## Production baseline at start of this work

AXIS **8.25 — Set Lock Interaction** is the fully Production-sealed Web runtime inherited by this work.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact sealed 8.25 `main`: `e28f0411288e42fc68e70a79a4180a06f7d18ee3`
- release PR: **#150**
- architecture: `canonical-single-runtime`
- canonical Vercel deployment: `dpl_HjrgujidrdBxDo9n243jnaoi4w5k`
- Vercel Production gate `34747540811` — success
- Vercel Public Production Alias Gate `34747540777` — success
- EdgeOne exact-prebuilt deployment `dplc6t1yw7ho`, run `34747525787` — success
- `axis.juele.fun` run `34747525811` — exact parity plus Chromium and iPhone-like WebKit success
- fixed Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`
- protected stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

Chat history is not authoritative project memory; repository contracts, exact commits, built artifacts and provider certification are authoritative.

## Active change

**AXIS 8.25.1 — Inline Set Morph** is the current **Release candidate**, bounded to the user-visible completion moment for an in-progress repeated-set activity.

- governed active branch: `main`
- governed target branch: `main`
- delivery branch: `axis-8251-inline-set-morph`
- release PR: **#151**
- exact base: `e28f0411288e42fc68e70a79a4180a06f7d18ee3`
- release transition: **8.25 → 8.25.1**
- version decision: `bump`
- sequence: **12**
- change class: `product-ui`
- intended user-visible behavior change: **yes, completion presentation architecture and motion**

The design problem is spatial: 8.25 correctly waits for an actual completed-set fact, but its body-level fixed Set Lock creates a separate visual plane over the Active screen. That makes a tactile event feel heavier than the interface and can visually compete with the clock and controls. 8.25.1 keeps the factual timing and haptic boundary while retiring the overlay itself.

8.25.1 therefore:

- keeps v87 `completeSet()` as the sole action and fact writer;
- starts feedback only at the existing post-fact render condition `done > prevDone`;
- explicitly hides the old `#axis825SetLock` body-level overlay and removes its active trigger;
- reuses the existing `.axis821StageFact` grid row as the only completion presentation surface;
- crossfades normal facts into compact `01 / 04 · 已完成` status without changing row height;
- pulses the existing progress rail instead of introducing clamps/halo over the page;
- lets the existing primary control spring back from its press and gives the clock a restrained micro-settle;
- returns directly to the canonical `第 2 / 4 组` state after the bounded confirmation;
- uses `本動作完成` for the final set in the same row rather than a fullscreen takeover;
- retains bounded two-beat haptic signatures where supported;
- includes explicit `prefers-reduced-motion` behavior with a short in-place fade only;
- preserves every v87 action and all training/storage/Encounter/Active ownership.

AXIS 8.23 Replay Evidence Continuity, AXIS 8.24 Active Stage Tactile, AXIS 8.24.1 Dock Occlusion and the AXIS 8.25 factual/haptic completion boundary remain Production-sealed and inherited.

## Inherited fail-closed governance provenance

The current release candidate is 8.25.1; the entries below are immutable historical provenance required by inherited contracts. They do not reactivate historical branches, make them current work, or change current authority.

- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- native foundation id: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts retained: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.report-range.v1`
- AXIS 8.25 sealed main: `e28f0411288e42fc68e70a79a4180a06f7d18ee3`
- AXIS 8.24.1 sealed main: `d4b009c327f6fa9c4900eaa41d7195f10f6ed425`
- AXIS 8.24 sealed main: `321647b9aaca783b7f6ba99ec66616941208c698`
- AXIS 8.23 sealed main: `2418103c786f2d0865aece49d738e9ed9161ef55`
- AXIS 8.21 Active Home historical bounded delivery branch: `feat/821-active-home-stage`; exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`
- AXIS 8.21 Flow step recording historical bounded delivery branch: `feat/821-flow-step-recording-intent`; exact certified base main SHA: `b65bce78d48dab162c25c028602e0bbd10ce6d78`
- AXIS 8.21 Flow step execution historical bounded delivery branch: `feat/821-flow-step-execution-intent`; exact certified historical Flow execution base: `396241c41b2f8eea80d45ca582352ea593c47036`
- AXIS 8.21 Training Report historical exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`; bounded delivery branch: `feat/821-report-pdf-export`
- AXIS 8.21 Report Share Card historical bounded delivery branch: `feat/821-report-share-card`; exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`
- completed Report PDF scope source-convergence branch: `arch/821-report-pdf-scope-convergence`
- completed Report PDF scope source-convergence PR: **#133**
- Report PDF scope source-convergence certified main: `1d9e08ae40f555151133a9fce4bc343f18359af2`

## Validation for this work

Merge is blocked until one exact PR #151 head proves all of the following without weakening inherited assertions:

1. `node build-release.mjs` produces public/base release **8.25.1**, `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks.
2. AXIS Version Authority proves **8.25 → 8.25.1 / bump / sequence 12 / product-ui** against the exact sealed 8.25 base.
3. the canonical product graph remains exactly **87** top-level deterministic steps; the 8.25.1 prepare is chained after 8.25 inside the existing late 8.24.1 step and before canonical build emission.
4. the 8.25.1 contract proves the full-screen 8.25 trigger is inactive, the completion moment remains in normal stage grid flow, and exactly one existing `completeSet()` action owner remains.
5. Chromium and iPhone-like WebKit physical smoke proves `01 / 04 · 已完成`, one factual increment, the completion moment fully contained inside the fact row, zero geometric intersection with the clock / primary / secondary controls, stable stage height, resulting `第 2 / 4 组`, reduced-motion support and no viewport overflow.
6. inherited Runtime, Current Release, Deep Compatibility, Runtime Foundation, Object/UPO, Flow, Active, Session/Encounter, Report, Portable Backup, Repository, Work Continuity and Cross-Platform gates remain green.
7. the 8.24.1 physical smoke remains explicit in fixed Vercel / EdgeOne / custom-domain workflows and chains directly into the 8.25.1 Inline Set Morph smoke without reactivating the superseded 8.25 fullscreen overlay.
8. after merge, the exact merged `main` SHA must be the artifact served by fixed Vercel Production.
9. the same exact canonical artifact must deploy to EdgeOne Production and resolve at `axis.juele.fun`.
10. Vercel, EdgeOne and custom-domain Production proofs must settle green before 8.25.1 is called Production-sealed.

Failures are fixed at the actual owner. User data, browser assertions and ownership boundaries may not be weakened merely to make certification pass.

## Next planned stage

Do not start another product, architecture, backup/account, Node/toolchain or native/iOS slice until AXIS 8.25.1 is fully Production-certified on the exact final merged main artifact.

After the live 8.25.1 stage is sealed, inspect the actual timing and tactile density on the real user-facing domain before choosing any further Active-stage refinement.
