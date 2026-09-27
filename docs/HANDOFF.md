# AXIS Engineering Handoff

## Current release state

AXIS **8.26.4 — Active Rest Utility Rail** is the current Release candidate. AXIS **8.26.1 — Active Rest State** remains fully Production-sealed until an exact later merged-main artifact completes the certification chain.

AXIS **8.26.3** is merged-but-unsealed provenance at `ed418938c07383745d5485c2a46d37d20bfbebc7`. Real-device review after that merge exposed the remaining presentation defect now bounded by 8.26.4.

Candidate identity:

- candidate PR: **#157**
- bounded delivery branch: `fix/8264-active-rest-utility-rail`
- version decision: **8.26.3 → 8.26.4 / bump / sequence 20 / bug-fix**
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`

Sealed baseline identity:

- sealed release: **8.26.1**
- sealed PR: **#153**
- exact sealed product/runtime merge: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- canonical Vercel deployment `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9` — READY / Production
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Vercel Production Deployment Gate `35873771687` — success
- Vercel Public Production Alias Gate `35873771699` — success
- EdgeOne Production run `35873718809` — exact-prebuilt deploy + Vercel parity + Chromium/WebKit success
- governed custom-domain run `35873719011` — exact parity + Chromium/WebKit success

The sealed SHA above remains product/runtime authority while 8.26.4 is candidate. `latestDeploymentIsAuthority` remains false.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. This corrective release does not migrate, clear, duplicate or rewrite them.

## AXIS 8.26.4 Active Rest Utility Rail

8.26.3 successfully removed running rest geometry and stabilized the paused/Rest Speak height, but real-device review exposed two remaining composition errors:

1. `plan-complete` could fall through to historical `.v87Rest` pill styling and leave an empty framed/oval residue.
2. Paused `休息 mm:ss` rendered below the existing `调整` action rather than sharing a disciplined secondary row, making the Active composition visually loose and under-designed.

8.26.4 fixes these at the existing presentation boundary. The canonical `#v87Rest` node is moved into the existing `.axis821StageControls` grid. During pause, rest sits left and the existing Adjust action sits right on one 32px row. The rest text is more legible and deliberate, but remains transparent and frameless. `plan-complete` hides the rest node with zero geometry.

### Truth and action boundary

Existing v87 pause/resume state and timer remain authoritative. Existing `#v87AdjustBtn` remains the only adjustment action. Normal paused rest remains pointer-inert. Existing Rest Speak / learning prompt classes keep their already-established explicit interactions inside the same 32px slot.

8.26.4 does not change how pause starts, how resume works, how rest time is calculated, how sets complete, how Flow advances, or how Session/Encounter facts are stored. No new persistence namespace, database, Session writer, Encounter writer, recorder, Active owner, network owner or AI owner is introduced.

### Required proof

PR #157 must pass Version Authority with the exact **8.26.3 → 8.26.4 / sequence 20** decision, Work Continuity with this handoff/current-work state, and all inherited repository/runtime contracts.

Chromium and iPhone-like WebKit must physically prove same-row rest/Adjust alignment, zero running geometry, zero plan-complete rest geometry, transparent/no-pill paused treatment, reduced-motion safety, existing pause/resume truth, and stable Rest Speak interaction/geometry.

After PR validation, only the exact merged `main` artifact may become release authority, and only after fixed Vercel Production, exact-prebuilt EdgeOne Production and `axis.juele.fun` parity/behavior checks all pass.

## Next engineering rule

Do not create another parallel Active owner or decorative rest component. Complete 8.26.4 as the single corrective presentation candidate, certify it, and only then select the next bounded real-use problem.
