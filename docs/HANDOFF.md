# AXIS Engineering Handoff

## Current release state

AXIS **8.26.3 — Active Rest Convergence** is the current Release candidate. AXIS **8.26.1 — Active Rest State** remains fully Production-sealed until the exact 8.26.3 merged-main artifact completes the certification chain. AXIS **8.26.2** is merged-but-unsealed provenance at `7662d857fd5d442e3a7f775a430f0d4d8479bece`; it does not replace the sealed runtime.

Candidate identity:

- candidate PR: **#156**
- bounded delivery branch: `fix/8262-rest-convergence`
- version decision: **8.26.2 → 8.26.3 / bump / sequence 19 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`

Sealed baseline identity:

- sealed release: **8.26.1**
- sealed PR: **#153**
- exact sealed product/runtime merge: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- canonical Vercel deployment `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production / exact 8.26.1 product/runtime SHA
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deploy + Vercel parity + Chromium/WebKit success
- governed custom-domain run `35873719011` — exact parity + Chromium/WebKit success

The sealed SHA above remains product/runtime authority while 8.26.3 is candidate. `latestDeploymentIsAuthority` remains false.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. This corrective release does not migrate, clear, duplicate or rewrite them.

## AXIS 8.26.3 Active Rest Convergence

The 8.26.2 selector correction successfully targeted the canonical `.v87Rest` node, but the physical Deep Compatibility proof exposed a second, concrete defect: the high-specificity paused-state presentation overrode inherited Rest Speak geometry, moving the Active card when Rest Speak was enabled.

8.26.3 closes that defect at the existing presentation boundary. Running has zero rest geometry. Paused Active has one transparent 32px factual rest rail. Inherited Rest Speak uses the same 32px rail so toggling the learning content does not change stage geometry.

### Truth and action boundary

Existing v87 pause/resume state and timer remain authoritative. Normal paused rest remains pointer-inert. When the existing Rest Speak class is present, its already-established explicit speak interaction remains available; this is preservation of an inherited action, not a new owner.

8.26.3 does not change how pause starts, how resume works, how rest time is calculated, how sets complete, how Flow advances, or how Session/Encounter facts are stored. No new persistence namespace, database, Session writer, Encounter writer, recorder, Active owner, network owner or AI owner is introduced.

### Required proof

PR #156 must pass Version Authority with the exact **8.26.2 → 8.26.3 / sequence 19** decision, Work Continuity with this handoff/current-work state, and all inherited repository/runtime contracts.

Chromium and iPhone-like WebKit must physically prove zero rest geometry while running; one 32px factual paused rail; no duplicate paused label; no pill background/border/shadow; reduced-motion safety; pause/resume truth in the existing `axis_v8_meta` activity owner; and Rest Speak on/off Active-card geometry delta within the inherited tolerance.

After PR validation, only the exact merged `main` artifact may become release authority, and only after fixed Vercel Production, exact-prebuilt EdgeOne Production and `axis.juele.fun` parity/behavior checks all pass.

## Inherited behavior

AXIS 8.26.2 remains merged selector-correction provenance. AXIS 8.26.1 remains the last sealed rest-state boundary. AXIS 8.26 remains Production-sealed and authoritative for atomic save settlement, ongoing Flow direct Active admission, one-shot canonical recorder semantics, foreign Active pause/preserve coordination, post-fact set feedback and the quieter Home hierarchy. 8.26.3 inherits all of these without re-owning them.

## Next engineering rule

Do not start another architecture branch or parallel owner while 8.26.3 is unresolved. Complete the exact corrective candidate, merge, and Production certification first. Only after it is sealed should the next bounded real-use audit select another concrete user problem.
