# AXIS Current Work

## Production baseline at start of this work

AXIS **8.26.1 — Active Rest State** remains the last fully Production-sealed release at exact product/runtime SHA `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` from PR **#153**. Its fixed Vercel, EdgeOne and `axis.juele.fun` certification evidence remains authoritative while the current corrective candidate is unresolved.

AXIS **8.26.3 — Active Rest Convergence** merged to `main` at `ed418938c07383745d5485c2a46d37d20bfbebc7` from PR **#156**, but real-device review found a remaining presentation defect before Production sealing. It is merged provenance, not a replacement for the sealed 8.26.1 runtime.

## Active change

Active milestone: **AXIS 8.26.4 — Active Rest Utility Rail**.

governed target branch: `main`.

Bounded delivery branch: `fix/8264-active-rest-utility-rail` · PR **#157**.

Version decision: **8.26.3 → 8.26.4 / bump / sequence 20 / bug-fix**.

The correction is intentionally narrow:

- Running Active keeps zero `.v87Rest` layout geometry.
- Paused Active uses the same canonical v87-owned `休息 mm:ss` truth, but the node now lives inside the existing `.axis821StageControls` grid.
- Paused rest is the left item and the existing `调整` action is the right item on one fixed **32px** secondary utility row.
- Rest status is visually present enough to read immediately, but remains transparent and frameless: no pill, border, radius, shadow or decorative container.
- `plan-complete` forces the rest node to zero geometry, eliminating the real-device empty oval/frame residue.
- Rest Speak and the inherited learning prompt reuse the same 32px slot and preserve their existing explicit actions.

Session, Encounter, Flow, recorder, set completion, pause/resume truth, rest-time calculation, storage, media, network and AI ownership remain unchanged.

## Validation for this work

The exact PR #157 head must pass repository/version/work-continuity contracts plus the full Current Release and Deep Compatibility families. Chromium and iPhone-like WebKit must prove:

- rest and Adjust are direct children of the existing utility grid;
- paused rest and Adjust share the same vertical center within 1.5px;
- paused rest stays left of Adjust, has deliberate secondary typography, and has no pill/frame/shadow;
- running rest geometry is zero;
- `plan-complete` rest geometry is zero;
- pause → resume truth remains v87-owned;
- reduced motion remains safe;
- Rest Speak on/off keeps the existing geometry tolerance and explicit interaction.

The existing 8.9 Rest Speak and 8.10 learning-prompt behavior assertions are not to be weakened. No new workflow family is required: the existing Active Rest physical proof is advanced by the deterministic 8.26.4 build step.

## Inherited fail-closed provenance

AXIS 8.26.3 remains merged-but-unsealed presentation provenance. AXIS 8.26.2 remains merged-but-unsealed selector-binding provenance. AXIS 8.26.1 remains the Production-sealed rest-state baseline. AXIS 8.26, 8.25.1, 8.24.1, 8.24 and 8.23 remain inherited without a new factual owner.

Cross-platform continuity also remains unchanged: foundation `axis-native-foundation-0`, native repository `INDEPENDENTWU/AXIS-iOS`, portable contracts `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, and `axis.report-range.v1`. Chat history is not authoritative project memory; repository governance remains authoritative.

## Next planned stage

After exact-head CI is green, merge PR #157 to `main` with the validated head SHA. Then certify that exact merged-main artifact through fixed Vercel Production, exact-prebuilt EdgeOne Production and `https://axis.juele.fun`, including Chromium and iPhone-like WebKit physical proofs. Only after those exact checks succeed may governance mark AXIS 8.26.4 Production-sealed and begin another product slice.
