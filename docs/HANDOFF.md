# AXIS Engineering Handoff

## Current Production release

AXIS **8.26.1 — Active Rest State** is the current fully Production-sealed Web release.

- release PR: **#153**
- exact product/runtime seal SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- original bounded delivery branch: `fix/8261-active-rest-state`
- architecture: `canonical-single-runtime`
- deterministic build: `node build-release.mjs`
- build graph: **89 deterministic top-level steps**
- product version decision: **8.26 → 8.26.1 / bump / sequence 14 / bug-fix**
- Production-evidence reconciliation: **8.26.1 → 8.26.1 / confirm / sequence 15 / governance**

The governance reconciliation records already-certified evidence only. Its own commit SHA must never replace the product/runtime authority above.

## Production seal snapshot

### Vercel

- fixed Production URL: `https://axis-five-puce.vercel.app`
- deployment: `dpl_CAsYMm12YjN9etr8YV7CrQG5QGV9`
- exact source SHA: `d187123dfdb2c0de0e5d202cf62bd6672586a8e7`
- Current Release Gate `35873718900` — success
- Deep Compatibility Gate `35873718880` — success
- Production Deployment Gate `35873771687` — success
- Public Production Alias Gate `35873771699` — success

### EdgeOne

- fixed Production URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- project: `axisfitness-mirror` / `makers-bxiu1vmyd0ba`
- deployment: `dpgow7txb8og`
- verification run `35873718809` — success
- verification artifact `10756197062`
- artifact SHA-256 `04d6923b737ac5b4a1ed584b7e552534aac93bd9b5d01aa87f237a2bb392fbac`
- exact Vercel parity, Chromium and iPhone-like WebKit — success

### Governed custom domain

- URL: `https://axis.juele.fun`
- verification run `35873719011` — success
- verification artifact `10757291650`
- artifact SHA-256 `fb6fc74ccb26ec8961f8180c459365d1e6b917f3e664be578755373662bf3fb5`
- exact parity, Chromium and iPhone-like WebKit — success

The exact runtime commit has Vercel **success** and EdgeOne Production **success** provider statuses.

## Product model to preserve

Reality is authoritative. Objects describe reusable semantics; Encounters freeze actual facts; Flow describes intent only; Evidence is anchored to real Encounters; Evolution is a derived read-only Reveal.

Authoritative stores remain `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak`, and `axis_v42_media`. Do not migrate, clear, duplicate or rewrite them without a separately proved ownership/migration stage.

## AXIS 8.26.1 Active Rest State

The existing v87 paused/rest presentation now has deliberate upper breathing room and one restrained `休息 + 計時` state treatment. It remains inside the established Active stage, creates no second card/modal/action owner, and is reduced-motion-safe.

The existing v87 pause/resume state and timer remain authoritative. 8.26.1 does not change how pause starts, how resume works, how rest time is calculated, how sets complete, how Flow advances, or how Session/Encounter facts are stored.

No new persistence namespace, database, Session writer, Encounter writer, recorder, Active owner, network owner or AI owner was introduced.

## Inherited 8.26 behavior

AXIS 8.26 remains inherited and Production-sealed for atomic save settlement, ongoing Flow direct Active admission, one-shot canonical recorder semantics, foreign Active pause/preserve coordination, the post-fact kinetic set cue and the quieter Home hierarchy.

## Resume rule for the next stage

Do not reopen 8.26.1 or create a parallel runtime. Start from exact sealed product/runtime SHA `d187123dfdb2c0de0e5d202cf62bd6672586a8e7` plus the governance record on `main`.

The next product stage should first audit real daily use of the existing **Object → Flow → Active → Encounter → Evidence → Replay → Evolution** loop. Select one bounded highest-value UX/product slice, preserve existing factual owners, and require the same exact-head Chromium/WebKit + Production certification discipline before calling another release sealed.

Backup/account expansion, Node/toolchain migration and unrelated native/iOS work remain outside this completed 8.26.1 stage unless explicitly selected as a future bounded slice.
