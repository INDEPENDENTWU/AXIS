# AXIS Work Continuity Contract

AXIS must not depend on a chat transcript, one developer's memory, or an old deployment message to know what the product is, what is being changed, or what must happen next.

## Canonical handoff

Before any product, runtime, build, storage, interaction, AI, media, learning, deployment, or architecture change, read these in order:

1. `docs/CURRENT_WORK.md`
2. `docs/CURRENT_RELEASE.md`
3. `docs/RUNTIME_CONTRACT.md`
4. the stage-specific document referenced by `CURRENT_WORK.md` (currently `docs/RUNTIME_813.md`)
5. `docs/COMPATIBILITY_LEDGER.md` when touching inherited owners or transforms

The repository is authoritative. Conversation history is supplemental only.

## Every modifying PR must leave a handoff

A PR that changes executable product/runtime/build code must update `docs/CURRENT_WORK.md` in the same PR. The update must state, in concrete language:

- the production baseline the work started from;
- the exact problem or product objective;
- the owners/files whose behavior changes;
- the intended user-visible behavior;
- what remains deliberately unchanged;
- migration/rollback boundaries;
- validation added or rerun;
- the next planned stage after the PR.

Do not write vague entries such as “improve stability” or “optimize UX.” Record the observable contract.

## Facts versus plans

`CURRENT_RELEASE.md` describes what users actually run.

`CURRENT_WORK.md` describes the latest engineering handoff and active direction.

`RUNTIME_813.md` describes the 8.13 Runtime migration contract.

A future idea must never be written into `CURRENT_RELEASE.md` as if it already exists.

## Compatibility work must have a retirement path

Any temporary compatibility transform added to the inherited 8.x owner graph must name the future owner that will absorb it or the condition under which it can be removed. Compatibility patches are allowed to protect users; anonymous permanent patches are not.

## Verification is part of the record

A change is not complete merely because code was merged. The handoff should identify the gates that prove the change, and release-facing work should verify the exact merged main and public Production where applicable.

## CI enforcement

`.github/workflows/axis-work-continuity.yml` enforces that executable-code PRs also update `docs/CURRENT_WORK.md`, and validates the canonical handoff structure on pull requests and `main`.
