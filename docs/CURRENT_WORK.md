# AXIS Current Work

## Production baseline at start of this work

AXIS **8.26.1 — Active Rest State** remains the last fully Production-sealed release at exact product/runtime SHA `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` from PR **#153**. Its fixed Vercel, EdgeOne and `axis.juele.fun` certification evidence remains authoritative while the corrective candidate is unresolved.

AXIS **8.26.2** was merged to `main` at `7662d857fd5d442e3a7f775a430f0d4d8479bece` from PR **#155**, but it was never promoted to the Production seal. It is therefore merged provenance, not a replacement for the sealed 8.26.1 runtime.

## Active change

Active milestone: **AXIS 8.26.3 — Active Rest Convergence**.

governed target branch: `main`.

Bounded delivery branch: `fix/8262-rest-convergence` · PR **#156**.

Version decision: **8.26.2 → 8.26.3 / bump / sequence 19 / bug-fix**.

The correction is intentionally narrow. Running Active must have zero `.v87Rest` layout geometry. Paused Active must show one factual v87-owned `休息 mm:ss` rail with no duplicate paused label, no pill background/border/shadow, and no new animation or action owner. The rail is fixed to **32px** so enabling inherited Rest Speak reuses the same geometry instead of moving the Active card. Normal paused rest remains pointer-inert; inherited interactive rest-slot affordances (`.v87Rest.v89Speak` and `.v87Rest.v810SpeakPrompt`) preserve their existing explicit actions without changing the rail geometry.

Session, Encounter, Flow, recorder, set completion, pause/resume truth, rest-time calculation, storage, media, network and AI ownership remain unchanged.

## Validation for this work

The exact PR #156 head must pass repository/version/work-continuity contracts plus the full Current Release and Deep Compatibility families. Chromium and iPhone-like WebKit must prove running → pause → resume → pause under reduced motion, zero running rest geometry, one 32px paused rail, factual rest timer, no horizontal overflow, Rest Speak on/off Active-card geometry delta within the inherited tolerance, and continued click/tap access to the inherited 8.10 Speak Prompt while plain factual rest remains pointer-inert.

The existing 8.9 Rest Speak geometry assertion and 8.10 Speak Prompt interaction assertion are not to be weakened. The 8.16 Capture/Evidence smoke is also retained unchanged; if an isolated timeout recurs after this deterministic candidate is otherwise correct, investigate that exact job rather than relaxing the contract.

Historical 8.21 delivery contracts must validate current continuity metadata rather than require obsolete branch names or old main SHAs inside CURRENT_WORK; their behavioral, ownership and physical browser assertions remain unchanged.

## Inherited fail-closed provenance

The sealed 8.26.1 runtime SHA and provider evidence remain unchanged until this candidate completes post-merge certification. AXIS 8.26.2 remains merged-but-unsealed provenance for the canonical `.v87Rest` selector correction. AXIS 8.26, 8.25.1, 8.24.1, 8.24, 8.23 and the established v87 / Rest Speak / learning-prompt owners remain inherited; no second factual or interactive writer is introduced.

Cross-platform continuity also remains unchanged: foundation `axis-native-foundation-0`, native repository `INDEPENDENTWU/AXIS-iOS`, portable contracts `axis.domain.v1`, `axis.data.v1`, `axis.flow.v1`, `axis.flow-provenance.v1`, and `axis.report-range.v1`. Chat history is not authoritative project memory; repository governance remains authoritative.

## Next planned stage

After exact-head CI is green, merge PR #156 to `main` with the validated head SHA. Then certify that exact merged-main artifact through fixed Vercel Production, exact-prebuilt EdgeOne Production and `https://axis.juele.fun`, including Chromium and iPhone-like WebKit physical proofs. Only after those exact checks succeed may governance mark AXIS 8.26.3 Production-sealed and begin another product slice.
