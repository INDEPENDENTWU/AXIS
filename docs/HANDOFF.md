# AXIS Engineering Handoff

## Current release state

AXIS **8.26.2 — Active Rest Selector Binding** is the current Release candidate. AXIS **8.26.1 — Active Rest State** remains fully Production-sealed until the exact 8.26.2 merged-main artifact completes the complete certification chain.

Candidate identity:

- candidate PR: **#155**
- bounded delivery branch: `fix/8262-active-rest-selector`
- version decision: **8.26.1 → 8.26.2 / bump / sequence 18 / bug-fix**
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

The sealed SHA above remains product/runtime authority while 8.26.2 is candidate. `latestDeploymentIsAuthority` remains false.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. Future work may not migrate, clear, duplicate or rewrite them without an explicit governed migration.

## AXIS 8.26.2 Active Rest Selector Binding

The bounded real-use audit across Active / Flow / Evolution found a concrete release defect before any broader product slice was started: the 8.26.1 rest-state CSS targeted `.v87-restline`, but the canonical integrated Active Home stage renders the existing v87-owned rest node as `.v87Rest`.

8.26.2 corrects only that binding. The intended breathing room, restrained state capsule, tonal grouping and reduced-motion-safe entry feedback now target the node that actually exists.

### Truth boundary

The existing v87 pause/resume state and timer remain authoritative. 8.26.2 does not change how pause starts, how resume works, how rest time is calculated, how sets complete, how Flow advances, or how Session/Encounter facts are stored.

No new persistence namespace, database, Session writer, Encounter writer, recorder, Active owner, network owner or AI owner is introduced.

### Required proof

PR #155 must prove the canonical `.v87Rest` node receives the intended computed presentation in both Chromium and iPhone-like WebKit, prove reduced-motion disables the transition, and prove pause/resume still changes the existing `axis_v8_meta` activity owner rather than any new state.

After PR validation, only the exact merged `main` artifact may become release authority, and only after fixed Vercel Production, exact-prebuilt EdgeOne Production and `axis.juele.fun` parity/behavior checks all pass.

## Inherited behavior

AXIS 8.26.1 remains the sealed rest-state presentation boundary. AXIS 8.26 remains Production-sealed and authoritative for atomic save settlement, ongoing Flow direct Active admission, one-shot canonical recorder semantics, foreign Active pause/preserve coordination, post-fact set feedback and the quieter Home hierarchy. 8.26.2 inherits these capabilities without re-owning them.

## Next engineering rule

Do not start another architecture branch or parallel owner while 8.26.2 is unresolved. Complete the exact selector-fix candidate and Production certification first. Only after it is sealed should the next bounded real-use audit select another concrete user problem.

Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain outside this bounded stage unless separately governed.
