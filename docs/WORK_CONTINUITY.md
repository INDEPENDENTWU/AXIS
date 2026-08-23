# AXIS Work Continuity Contract

AXIS must not depend on a chat transcript, one developer's memory, or an old deployment message to know what the product is, what is being changed, or what must happen next.

The repository is authoritative. **Conversation history is supplemental only.**

## Canonical handoff

Before any product, runtime, build, storage, interaction, AI, media, learning, deployment, localization/theme, or architecture change, read in this order:

1. `governance/project-state.json` — machine-readable Production and active engineering state;
2. `docs/HANDOFF.md` — human/agent project handoff;
3. `docs/CURRENT_WORK.md` — active change and exact next stage;
4. `docs/CURRENT_RELEASE.md` — what users actually run;
5. `docs/OWNERSHIP.md` and `governance/owners.json` when changing a writer/authority;
6. `docs/RETIREMENTS.md` and `governance/retirements.json` when touching historical/compatibility behavior;
7. `docs/RUNTIME_CONTRACT.md`, `docs/PRODUCT.md`, and `docs/ARCHITECTURE.md` before changing product/runtime semantics;
8. stage-specific documents referenced by `CURRENT_WORK.md`.

A historical release note or version-like filename is provenance. It does not override current governance.

## Every modifying PR must leave a handoff

A PR that changes executable product/runtime/build code must update `docs/CURRENT_WORK.md` in the same PR. The update must state, concretely:

- Production baseline and exact reference SHA;
- problem/product objective;
- owners/files whose behavior changes;
- intended user-visible behavior;
- behavior intentionally unchanged;
- migration/rollback boundaries;
- validation added/rerun;
- next planned stage.

If a PR changes current Production identity, owner authority, retirement state, supported locale/theme contract, or active milestone, update the corresponding file under `governance/` in the same change.

Do not write vague handoffs such as “improve stability” or “optimize UX.” Record the observable contract.

## Facts versus plans

- `governance/project-state.json` records machine current state.
- `CURRENT_RELEASE.md` describes what users actually run.
- `CURRENT_WORK.md` describes active engineering work.
- `ROADMAP.md` describes future direction.
- release/history notes describe provenance.

A future idea must never be written into current-release truth as if it already exists.

## Ownership and compatibility work must have an exit path

Any temporary compatibility transform must identify either:

- the current/future owner that will absorb it; or
- the evidence/condition under which it can be removed.

Compatibility patches are allowed to protect users. Anonymous permanent patches are not.

A retirement entry prevents old authority from returning; it is not permission for immediate source deletion. Physical deletion needs reachability, data compatibility and regression proof.

## Verification is part of project memory

A change is not complete merely because code was merged. The handoff must identify the gates that prove it. Release-facing work must verify the exact merged `main` source/artifact on Production providers where applicable.

Critical user-facing runtime changes continue to require Chromium and iPhone-like WebKit proof.

## CI enforcement

`.github/workflows/axis-work-continuity.yml` currently verifies the canonical `CURRENT_WORK.md` structure and requires executable-code PRs to update that file.

During Source Convergence, this workflow should migrate from fixed text-shape checks toward governance/current-contract validation. Until that migration is reviewed and green, the established section headings remain compatibility API for CI.
