# AXIS 8.32 — EdgeOne-first official release transition

Status: **implementation candidate; not merged, not published, not a Production certificate**.

## Decision

From the next accepted AXIS production release, **EdgeOne is the primary release destination**. Do not use Vercel Preview or Vercel Production as an implicit development, approval or deployment prerequisite. CI and isolated browser checks remain the development verification plane; official hosting is a single, explicitly admitted release operation.

This policy changes *where releases are published*, not *what counts as a releasable product*. A green 8.32 PR candidate and a READY Preview cannot replace P01–P20 real-device/OS assistive/accessibility signoff, exact merged-main validation or an immutable governance seal.

## Live version and source of truth

- The current public product remains **8.31**. The desktop UI showing 8.31 is correct for the unchanged, certified public runtime; 8.32 is **not** released just because the candidate source embeds the next version.
- The currently sealed Product/runtime is 8.31, `dddce5401e80087a7ccceb43ec466f1ad7abb505`. `main` remains the documentation-only 8.32a head `c6a76b617b9df5fe43975354bdabba1d25c3d3e7` at this checkpoint.
- 8.32 candidate product is PR #174, at `c1b34ef3554035f34d027b336e6296dc35bd5951` before the release-infrastructure work in this branch.
- After real Production release, the desktop or installed PWA version must be verified against *both* the exact official-origin `axis-build.json` and the actual canonical UI. Do not fix a stale UI by hard-coding an 8.32 label or changing version without publishing matching runtime assets.
- Browser/PWA cache and service-worker upgrade behaviour must be checked on a real device after the approved official deployment, with old user data retained. A correct manifest on EdgeOne mirror alone does not prove the official origin has upgraded.

## New release topology (in this candidate branch)

1. **Disable automatic Vercel Git deployments** through `vercel.json`, including `main`. This is intentionally a candidate policy until merged and verified against provider account settings.
2. **Retire the inherited Vercel-dependent auto-EdgeOne push deploy** in `.github/workflows/axis-edgeone-production-mirror.yml`; its PR/source packaging contracts remain available. Publishing is no longer tied to an arbitrary merge or Vercel alias convergence.
3. **Use a single manually started official release workflow**: `.github/workflows/axis-edgeone-official-release.yml`. It checks out `main` and requires a full 40-character accepted release commit, with an independent JSON admission in secret `AXIS_EDGEONE_ADMISSION_JSON` and existing `EDGEONE_API_TOKEN`.
4. Exact canonical build and prebuilt verification → `axis-edgeone-fallback-release.mjs --check` (no publishing) → one authenticated EdgeOne Production publication → **EdgeOne exact manifest/runtime/API and official `axis.juele.fun` verification** → real Chromium/pinned WebKit critical public-origin flows.
5. Mark success only after release verification; complete a **separate governance-only immutable Product Production Seal**, capturing SHA, deployment ID, official-domain assets/source, original Encounter/data persistence and QA evidence. The release workflow itself cannot declare a governance seal.
6. If formal gates, credential, SHA or domain do not match, fail closed. Do not create a second deployment to 'fix' missing acceptance. If any post-publish check fails, treat the release as incomplete and restore the last known-good provider artifact or routing using the established rollback procedure; do not claim live certification.

## Release admission and production secrets

The independent, external release admission contract is defined in [AXIS_EDGEONE_FALLBACK.md](AXIS_EDGEONE_FALLBACK.md). Its strict `approved`, exact `sourceCommit`, all P01–P20 `pass`, pinned WebKit, accessibility, performance, visual and merged-main predicates are **not relaxed** for EdgeOne-first operation.

- `AXIS_EDGEONE_ADMISSION_JSON`: repository Actions secret containing the approved exact SHA admission JSON. This secret is not stored in Git and is only read by the explicitly dispatched official workflow. An absent or stale value fails safely before deployment.
- `EDGEONE_API_TOKEN`: existing private EdgeOne token; never echo, commit or publish. Admission, exact merged-main SHA and token are all required.
- The release operator enters the exact merged `main` commit SHA when dispatching the workflow; no one can release a draft branch or infer that an earlier commit is equivalent.
- The official hostname currently tracked is `https://axis.juele.fun`. If DNS or EdgeOne custom-domain mapping does not serve the exact released artifact, **Production release is not complete**, regardless of the mirror URL.

## Current 8.32 status and next action

**NO-GO for Production as of 2026-10-15.** The 8.32 candidate has exact-SHA 36/36 successful PR CI and the source-grounded d17 scroll-layer correction, but P11/P12/P15/P16/P17/P20 real hardware/assistive/font zoom/whole-screen optical/low-end long-tail release admission remains open. Original user-observed iPhone overlay requires an actual post-fix iPhone signoff. Do not synthesize any of these approvals.

Next: independently review this EdgeOne-first workflow and check its YAML/branch admission semantics → complete the physical acceptance matrix → merge the verified 8.32 release candidate through the expected-SHA policy → merge approved release orchestration → issue a deliberate **single official EdgeOne Production release** → verify the desktop/PWA release is 8.32 → independently seal the version.

No Vercel Preview, Vercel Production, EdgeOne Production, official-domain DNS, `main`, or public version is changed by creating this branch.
