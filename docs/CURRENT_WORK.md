# Current Work

## Production baseline at start of this work

AXIS **8.21** remains the current public Web release.

- exact merged `main` baseline: `fce02e0238186c0a9df77f447bb979a1429c4c4f`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- merged product change: PR **#118**, truthful custom-range professional paginated Training Report PDF export
- merged Production repair: PR **#120**, first-edit Training Record muscle-panel geometry stabilization
- architecture: `canonical-single-runtime`
- one initial JavaScript request / zero dynamic runtime chunks remains required
- public identity change for this work: **none; remains 8.21**
- Vercel Production serves the exact merged `main` SHA `fce02e0238186c0a9df77f447bb979a1429c4c4f` from the canonical Git-connected AXIS project
- the exact merged SHA passed the fixed-Production real-Chromium Deployment Gate, Public Production Alias Gate, legacy Production gate, inherited product/runtime gates, and the EdgeOne exact-artifact Production mirror including Chromium and iPhone-like WebKit verification
- the #118 post-merge Production-certification incident is therefore **resolved**; the inherited one-time `#musclePanel` layout shift no longer blocks the certified baseline

The merged product already has canonical Session / Encounter truth, immutable Profile / Goal snapshots, session-time truth, `axis.report-range.v1`, the truth-backed Training Report UI, and the downstream native browser-print PDF projection. Those factual owners remain the only source for Report work.

Cross-platform foundation remains `axis-native-foundation-0`, native repository remains `INDEPENDENTWU/AXIS-iOS`, and portable contracts remain `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, `axis.object-capabilities.v1`, `axis.metric-schema.v1`, `axis.session-time.v1`, `axis.profile-snapshot.v1`, `axis.goal-snapshot.v1`, and `axis.report-range.v1`.

### Inherited Report-stage continuity references

The following two lines are retained as historical bounded-stage identifiers required by the sealed #117 Training Report UI contract; they are **not** the current Production baseline or active delivery branch:

- exact merged `main` baseline: `b6b236f8c7096f8dc93c2fba94e08d618c611d01`
- bounded delivery branch: `feat/821-report-pdf-export`

The current Production baseline and current bounded branch remain the values stated in the active sections of this document.

## Active change

**AXIS 8.21 — Truth-backed Training Report Share Card**

- governed active milestone: `AXIS 8.21 — Post-release Architecture Governance`
- governed active branch: `main`
- bounded delivery branch: `feat/821-report-share-card`
- exact base main SHA: `fce02e0238186c0a9df77f447bb979a1429c4c4f`
- intended public release change: **none; remains 8.21**
- new LocalStorage namespace / IndexedDB / network state / Session writer / Encounter writer / recorder / Active owner / Flow owner / Profile owner / historical range owner: **none**
- new product capability: **one user-invoked PNG Report summary image projection**

### Product rule

The share image is a downstream representation of the already-selected canonical Training Report view. It must consume `axis821ReportView()` / `axis.report-range.v1`; it may not filter `state.sessions`, rebuild metrics, invent a second range model, or become a second historical truth system.

The image is deliberately a **summary share card**, not a screenshot of the Report DOM and not a replacement for the full Report/PDF. It may show truthful summary counts, canonical time facts, snapshot coverage, and the selected Report scope. Full historical per-Session detail remains in the Training Report and paginated PDF.

### UX contract

- `分享图片` lives beside the existing `导出 PDF` action inside the Training Report export area.
- `全部`, custom inclusive local-date range, and single-Session routes continue to be owned by the existing Report view; the Share Card follows whichever route is currently selected.
- the existing export identity control becomes format-neutral copy: `导出时包含个人信息`.
- personal information is **off by default**. When explicitly enabled, the Share Card may include current Profile values only as clearly labeled export-time identity, matching the PDF policy.
- historical body/goal facts are never rewritten from current Profile. The card states that historical training remains governed by the saved Session snapshots.
- the card uses a deliberate 1080px portrait PNG canvas, native Web Share when available, and the existing local file-download fallback otherwise.
- an empty Report range produces no image and gives a local user-facing message.

### Scope boundary

This work may add only a downstream image projection and its presentation controls. It must not change:

- Session / Encounter persistence or historical facts;
- metric values, units, controls, object capability truth, or metric schema ownership;
- `axis.session-time.v1`, `axis.profile-snapshot.v1`, `axis.goal-snapshot.v1`, or `axis.report-range.v1`;
- Training Report aggregation or custom range semantics;
- PDF cover/body semantics, A4 pagination, browser-print ownership, or optional export-time identity policy;
- Active lifecycle, Flow continuity, Quick Record ownership, media ownership, or watermark ownership;
- release identity, storage topology, network behavior, or canonical single-runtime architecture.

No `html2canvas`, DOM screenshot rasterizer, PDF library, new network export service, or new persisted Report cache is allowed. Canvas rasterization is intentional only because the product output is itself a shareable PNG image.

## Validation for this work

This change is mergeable only when the exact final PR head proves all of the following:

1. deterministic `node build-release.mjs` still completes with the existing canonical architecture and 8.21 release identity;
2. a dedicated Share Card contract proves `axis821ReportView()` / `axis.report-range.v1` ownership, PNG output, no parallel range aggregation, and no storage/network writer;
3. real Chromium and iPhone-like WebKit both generate a non-empty PNG from the same custom Report range and preserve the same Session scope;
4. optional export-time identity is absent when unchecked and included only when explicitly checked, without contaminating the historical on-screen Report;
5. the Share Card action works at 390px without horizontal overflow and leaves canonical LocalStorage unchanged;
6. inherited Report Range Truth, Training Report UI, PDF export, Session Truth, Flow/Object, compatibility, Work Continuity and repository-governance gates remain green on the same exact head;
7. the change introduces no second Report truth owner, no screenshot-of-DOM dependency, no new release wrapper, and no generated-output-only patch layer;
8. after merge, the exact merged `main` SHA must reach the existing fixed Vercel AXIS Production project and pass the normal Production Deployment / public alias certification chain; EdgeOne must mirror the same exact artifact successfully.

## Next planned stage

Only after the Share Card is merged and Production-certified:

1. keep the Report truth stack sealed: `axis.report-range.v1` → Training Report → PDF / Share Card projections;
2. evaluate a detailed long-image representation only if it solves a real sharing need that the compact Share Card and PDF do not, and only as another projection of the same Report view;
3. resume broader Flow/Object product work separately from Report representation work;
4. keep post-release architecture-governance cleanup separate from new user capability delivery.

Chat history is not authoritative project memory. GitHub governance, current contracts, exact `main`, deterministic build output and Production evidence are authoritative.
