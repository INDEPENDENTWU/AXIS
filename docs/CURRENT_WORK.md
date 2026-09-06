# Current Work

## Current public baseline

AXIS **8.21** remains the current public Web release.

- canonical repository: `INDEPENDENTWU/AXIS`
- governed public/base release: **8.21 / 8.21**
- architecture: **`canonical-single-runtime`**
- production request topology: **1 initial JS / 0 dynamic JS chunks**
- fixed public Vercel URL: `https://axis-five-puce.vercel.app`
- fixed public EdgeOne URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- governed durable product/runtime seal baseline: `8f1f1331e751a7868d390f986d77d5779732ad51`
- exact merged `main` base for this source-convergence slice: `c434a4a78530669d5a47be9799d40f5049b57a2d`
- current bounded branch: `arch/821-active-home-source-convergence`
- intended public/product behavior change: **none**

PR #130 is merged at `c434a4a78530669d5a47be9799d40f5049b57a2d`. Its repository/browser contracts are the behavioral baseline for this architecture-only follow-up. The exact merged base still requires fixed Vercel Production + exact EdgeOne certification after Vercel's external Hobby build-rate limit clears; this branch must not merge before that base certification succeeds.

## Active change

**AXIS 8.21 — Active Home Source Convergence**

This is the first bounded source-owner migration under the governed post-release architecture phase. It removes a late behavioral build mutation without changing the proven runtime contract.

Before this slice, ordinary Active Home was assembled by three sequential prepare layers:

1. `prepare-821-active-home-stage.mjs`
2. `prepare-821-active-home-stage-compat.mjs`
3. `prepare-821-active-home-visual-convergence.mjs`

After this slice:

1. `prepare-821-active-home-stage.mjs` owns the final presentation and loads its explicit source stylesheet from `styles/axis-821-active-home.css`.
2. `prepare-821-active-home-stage-compat.mjs` is semantic compatibility only: inherited countdown/rest behavior, execution-aware set controls, visible pause/resume label compatibility, standalone learning lifetime and a read-only Flow ticker.
3. `prepare-821-active-home-visual-convergence.mjs` remains historical provenance but is unreachable from the canonical release chain.

The runtime capability identity is deliberately stable: `window.__AXIS_821_ACTIVE_HOME_VISUAL__` and `#axis821ActiveStageRefineStyle` remain the same so existing real-browser proofs verify equivalent behavior rather than an implementation rename.

### Product behavior that must remain exact

- ordinary Active is a flat Home-integrated rail rather than a floating card;
- the execution clock remains strictly centered;
- pause/resume and the execution-aware primary action remain balanced large controls;
- `调整` remains a separate tertiary row with no overlap;
- `按住结束` keeps the existing v87 long-hold action and tactile presentation;
- paused rest duration is visible in exactly one place through the inherited passive rest presenter;
- Rest Speak cannot move the Active stage;
- Flow-integrated Active remains isolated from ordinary `#v87Now`;
- no transient duplicate action, second timer, or delayed geometry repair is acceptable.

Execution-aware set controls are preserved. `v87` remains the ordinary Active pause/resume/finish and set-action owner; `v82`/`v87` continue the established Active lifecycle. Continuous metric execution remains governed by the existing execution-mode owners; ordinary single/complete behavior remains one-shot outside the already-proven Flow whole-item exception. Automatic sound remains v8710-owned. The inherited 5-second sustained positional shake behavior and the sealed 30fps media path remain outside this slice and unchanged. Chromium and iPhone-like WebKit remain equal release gates.

## Ownership / migration boundary

This slice adds no:

- LocalStorage namespace or IndexedDB database;
- Session or Encounter writer;
- recorder or metric fact owner;
- Active lifecycle/action owner;
- Flow state owner;
- timer/rest owner;
- network/API dependency;
- historical Session/Encounter rewrite.

The canonical app remains Session/Encounter authority. v61 remains the classic repeated weight/reps writer only when immutable Encounter schema grants that authority. Flow remains orchestration/intent rather than history. Source convergence may shorten the build path; it may not create a parallel implementation while doing so.

Rollback is architectural and bounded: restore the late visual prepare to build reachability and remove the stage-owned source stylesheet handoff. No data rollback or migration is involved.

## Required proof before this branch may merge

The exact PR head must prove all of the following without relaxing existing assertions:

1. `node build-release.mjs` succeeds deterministically with public/base 8.21 and `canonical-single-runtime` unchanged;
2. static source contract proves final visual CSS/marker ownership has moved into the stage source and the late visual prepare is unreachable;
3. existing Active Home Stage contract remains green;
4. real Chromium and iPhone-like WebKit preserve the flat rail, centered clock, balanced controls, tactile hold, isolated Adjust row and single visible rest clock;
5. inherited pause/resume, set completion, pause-owned rest, long-hold finish, Rest Speak, Flow isolation, Learning lifetime and sound contracts remain green;
6. Deep Compatibility, Runtime, Current Release, Cross-Platform, Repository Contract and Work Continuity gates remain green on the same exact head;
7. the exact base `c434a4a78530669d5a47be9799d40f5049b57a2d` is first certified on the existing fixed Vercel Production project and EdgeOne mirror;
8. after merge, the new merged `main` SHA itself passes fixed Vercel alias parity and the exact-prebuilt EdgeOne Chromium/WebKit mirror chain.

Provider rate limits or hosting configuration are not product defects and must not be bypassed by creating another Vercel project, changing the fixed public URL, publishing EdgeOne independently, or weakening exact-artifact parity.

## Historical continuity references required by sealed 8.21 contracts

These identifiers are compatibility/proof provenance, not current delivery authority:

- bounded delivery branch: `feat/821-active-home-stage`
- exact base main SHA: `c09d22fc992efd4f1f94bc0857c91442a211094f`
- bounded Active Home visual-convergence branch: `feat/821-active-home-visual-convergence`
- exact Active Home visual-convergence base `main` SHA: `9eaf90d0f94023218feb452b085da48c9f027276`
- PR #127 and source proof SHA `8368` remain historical Active Home continuity evidence where inherited contracts refer to them.
- PR #129 established the flat, centered Home-integrated stage.
- PR #130 refined tactile hold/rest presentation and merged as `c434a4a78530669d5a47be9799d40f5049b57a2d`.

## Exit condition / next stage

This slice is complete only when its exact merged `main` artifact is certified on both fixed providers. Only then should the next bounded source-owner audit begin. The next candidate should be selected from the remaining behavioral `prepare-*` / `postbuild-*` mutations by reachability and ownership risk, not by visual novelty.

The target remains a strangler migration: fewer live mutation layers, clearer source owners, the same user-visible 8.21 product, the same storage/history compatibility and the same canonical runtime topology.

Chat history is supplementary. Repository governance, exact source, deterministic build evidence and fixed Production proof remain authoritative.
