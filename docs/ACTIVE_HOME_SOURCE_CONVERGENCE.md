# AXIS 8.21 — Active Home Source Convergence

## Scope

This is a bounded architecture-only follow-up to PR #130, rebased in product truth onto the certified post-backup main from PR #132.

- exact certified base `main` SHA: `b349c8b87a0e9b30916ba9959297897260de3882`
- historical pre-backup architecture-slice base: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- bounded delivery branch: `arch/821-active-home-source-convergence`
- public release identity: unchanged at **8.21**
- production architecture: unchanged at `canonical-single-runtime`
- intended user-visible behavior change: **none**

The purpose is to make the source/build topology match the already-proven Active Home runtime more closely. It is not a redesign and it does not add a new runtime owner. The certified `axis.backup.v1` transport from PR #132 remains intact and is not folded into this source-owner handoff.

## Source-owner handoff

Before this slice, the ordinary Active Home presentation was assembled by three sequential behavioral prepares:

1. `prepare-821-active-home-stage.mjs`
2. `prepare-821-active-home-stage-compat.mjs`
3. `prepare-821-active-home-visual-convergence.mjs`

After this slice:

1. `prepare-821-active-home-stage.mjs` owns the final flat Home rail, centered execution clock, balanced controls, tactile long-hold presentation, separate Adjust row and the single-visible-rest-clock projection. Its final visual rules come from the explicit source file `styles/axis-821-active-home.css`.
2. `prepare-821-active-home-stage-compat.mjs` remains only for inherited semantic compatibility: pause-owned rest/countdown semantics, execution-aware set controls, canonical glyph/label compatibility, standalone learning lifetime and the stable read-only Flow ticker.
3. `prepare-821-active-home-visual-convergence.mjs` remains in the repository as historical provenance but is **not imported by the canonical release chain**.

The stable runtime marker `window.__AXIS_821_ACTIVE_HOME_VISUAL__` and style element `#axis821ActiveStageRefineStyle` are retained so browser proofs validate the same public capability rather than an implementation rename.

## Ownership invariants

This slice creates no new:

- LocalStorage namespace or IndexedDB database;
- Session or Encounter writer;
- recorder or metric owner;
- Active lifecycle/action owner;
- Flow owner;
- timer/rest owner;
- network/API dependency.

`v87` remains the only ordinary Active pause/resume, set-completion, add-set and long-hold finish action owner. The canonical app remains Session/Encounter authority, and v61 remains the classic repeated weight/reps writer only where immutable Encounter schema grants that authority. Portable Backup remains transport-only and delegates media operations to the existing app-owned media store.

## Required equivalence proof

The exact candidate must prove all of the following before merge:

- deterministic `node build-release.mjs` succeeds;
- public/base release remains 8.21;
- canonical runtime remains one initial JS request and zero dynamic historical chunks;
- the late visual-convergence prepare is unreachable from the canonical release chain;
- the stage source owns the final visual CSS and visual marker;
- Chromium and iPhone-like WebKit preserve the existing flat rail, centered clock, balanced controls, tactile hold, single visible rest clock and isolated Adjust row;
- inherited Active Home semantic smoke remains green;
- `axis.backup.v1` contract and Chromium/WebKit round-trip remain green;
- no storage, Encounter, recorder, Active or Flow owner is added;
- all repository/work-continuity/deep-compatibility/current-release gates remain green.

## Production boundary

The exact base `b349c8b87a0e9b30916ba9959297897260de3882` is certified on the existing fixed Vercel Production project and exact EdgeOne mirror. Vercel reports `READY`, `source=git`, `target=production`, `aliasError=null`, and the fixed alias `/axis-build.json` reports the same source SHA with public/base 8.21 and `canonical-single-runtime`. The EdgeOne Production Mirror for the same SHA completed successfully.

After merge, the new merged `main` SHA must itself pass the same exact Vercel fixed-alias and EdgeOne artifact-parity chain. No alternate Vercel project, temporary production topology, or EdgeOne-only release is permitted.
