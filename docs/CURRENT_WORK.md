# Current Work

## Production baseline at start of this work

AXIS **8.24 — Active Stage Tactile Convergence** is the fully Production-sealed Web runtime inherited by this work.

- canonical repository: `INDEPENDENTWU/AXIS`
- exact sealed 8.24 `main`: `321647b9aaca783b7f6ba99ec66616941208c698`
- release PR: **#148**
- architecture: `canonical-single-runtime`
- Vercel Production gate `34700744685` — success
- Vercel Public Production Alias Gate `34700744673` — success
- EdgeOne exact-prebuilt deployment `dp7e6rlpyczu`, run `34700727554` — success
- `axis.juele.fun` run `34700727551` — success
- fixed Vercel: `https://axis-five-puce.vercel.app`
- EdgeOne: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed custom domain: `https://axis.juele.fun`
- protected stores: `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, `axis_v42_media`

Chat history is not authoritative project memory; repository contracts, exact commits, built artifacts and provider certification are authoritative.

## Active change

**AXIS 8.24.1 — Dock Occlusion Hotfix** is the current **Release candidate**, bounded to a real fixed-dock paint/compositing defect reported after 8.24 reached Production.

- governed active branch: `main`
- governed target branch: `main`
- delivery branch: `hotfix/8241-dock-occlusion`
- release PR: **#149**
- exact base: `321647b9aaca783b7f6ba99ec66616941208c698`
- release transition: **8.24 → 8.24.1**
- version decision: `bump`
- sequence: **10**
- change class: `product-ui`
- intended user-visible behavior change: **yes, visual defect correction only**

The root cause is bounded and concrete: 8.24 gave `.captureDock` `contain: layout style paint` while its underlay extended above the dock with a negative top offset. Paint containment can clip that overscan. The same underlay used a transparent-to-opaque gradient, leaving a window in which a one-pixel scrolling separator could remain visible. Deleting valid separators would be the wrong owner fix.

8.24.1 therefore:

- removes only `paint` containment from the dock boundary;
- makes the fixed dock itself opaque;
- uses an opaque 16px top / 6px bottom overscan curtain;
- removes the translucent curtain gradient;
- leaves Capture / Quick Record controls above the curtain;
- adds computed-style Chromium + iPhone WebKit proof for opacity, geometry and stacking;
- preserves every v87 action and all training/storage/Encounter/Active ownership.

AXIS 8.24 Active Stage Tactile and AXIS 8.23 Replay Evidence Continuity remain Production-sealed and are inherited unchanged.

## Inherited fail-closed governance provenance

The current release candidate is 8.24.1; the entries below are immutable historical provenance required by inherited contracts. They do not reactivate historical branches or change current authority.

- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- native foundation id: `axis-native-foundation-0`
- native repository: `INDEPENDENTWU/AXIS-iOS`
- portable contracts retained: `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`
- AXIS 8.24 sealed main: `321647b9aaca783b7f6ba99ec66616941208c698`
- AXIS 8.23 sealed main: `2418103c786f2d0865aece49d738e9ed9161ef55`

## Validation for this work

Merge is blocked until one exact PR #149 head proves all of the following without weakening inherited assertions:

1. `node build-release.mjs` produces public/base release **8.24.1**, `canonical-single-runtime`, one initial JavaScript request and zero dynamic runtime chunks.
2. AXIS Version Authority proves **8.24 → 8.24.1 / bump / sequence 10 / product-ui** against the exact 8.24 base.
3. the canonical product graph is exactly **87** top-level deterministic steps, with the 8.24.1 prepare after inherited 8.24 construction and before canonical build emission.
4. the 8.24.1 contract proves opaque dock + opaque overscan, no paint containment and no translucent curtain without new factual ownership.
5. Chromium and iPhone-like WebKit computed-style smoke proves the actual rendered dock boundary, stacking order and no viewport overflow.
6. inherited Runtime, Current Release, Deep Compatibility, Runtime Foundation, Object/UPO, Flow, Active, Session/Encounter, Report, Portable Backup, Repository, Work Continuity and Cross-Platform gates remain green.
7. Production workflow contracts explicitly carry the 8.24.1 smoke into fixed Vercel Chromium proof and EdgeOne / `axis.juele.fun` Chromium + iPhone-like WebKit proof.
8. after merge, the exact merged `main` SHA must be the artifact served by fixed Vercel Production.
9. the same exact canonical artifact must deploy to EdgeOne Production and resolve at `axis.juele.fun`.
10. Vercel, EdgeOne and custom-domain Production proofs must settle green before 8.24.1 is called Production-sealed.

Failures are fixed at the actual owner. User data, browser assertions and ownership boundaries may not be weakened merely to make certification pass.

## Next planned stage

Do not start another product, architecture, backup/account, Node/toolchain or native/iOS slice until AXIS 8.24.1 is fully Production-certified on the exact final merged main artifact.

After the live 8.24.1 stage is sealed, inspect the reported dock boundary on the real user-facing domain again before choosing any further Active-stage work.
