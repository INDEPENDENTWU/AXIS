# AXIS documentation

Start here when the repository is unfamiliar. Current project state must be recoverable from GitHub without relying on a chat transcript.

## Read first

1. [`../governance/project-state.json`](../governance/project-state.json) — machine-readable current Production and engineering state.
2. [`HANDOFF.md`](HANDOFF.md) — human/agent handoff: exact baseline, active work, invariants and next action.
3. [`CURRENT_RELEASE.md`](CURRENT_RELEASE.md) — what is shipping now.
4. [`CURRENT_WORK.md`](CURRENT_WORK.md) — the active engineering slice and exit criteria.

## Product and architecture

- [`PRODUCT.md`](PRODUCT.md) — product contract and user-facing boundaries.
- [`RUNTIME_CONTRACT.md`](RUNTIME_CONTRACT.md) — release-blocking runtime invariants.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — current architecture, debt and target architecture.
- [`OWNERSHIP.md`](OWNERSHIP.md) — current critical owners and owner-handoff protocol.
- [`RETIREMENTS.md`](RETIREMENTS.md) — retired authority and physical deletion gates.
- [`LOCALIZATION_AND_THEME.md`](LOCALIZATION_AND_THEME.md) — planned `zh-Hans` / `zh-Hant` / `en` and System/Light/Dark presentation contract.
- [`GLOSSARY.md`](GLOSSARY.md) — canonical three-language product terminology.

Machine-readable companions live in [`../governance/`](../governance/).

## Repository and delivery

- [`ENGINEERING_PLAYBOOK.md`](ENGINEERING_PLAYBOOK.md) — how changes are designed, tested and released.
- [`REPOSITORY_STRUCTURE.md`](REPOSITORY_STRUCTURE.md) — what belongs where and why inherited source still exists at the root.
- [`COMPATIBILITY_LEDGER.md`](COMPATIBILITY_LEDGER.md) — compatibility debt and retirement criteria.
- [`CI_AND_RELEASE.md`](CI_AND_RELEASE.md) — current CI/release layers and Production verification.
- [`CI_CONVERGENCE.md`](CI_CONVERGENCE.md) — evidence-driven workflow consolidation and runner-latency reduction.
- [`DEPLOYMENT_POLICY.md`](DEPLOYMENT_POLICY.md) — hosting and promotion policy.
- [`ROADMAP.md`](ROADMAP.md) — product/runtime direction.

## Specialized contracts

- [`AI_BACKEND.md`](AI_BACKEND.md) — AI backend boundary.
- [`CLOUD_AI_811.md`](CLOUD_AI_811.md) — cloud/sync and AI foundation provenance.
- [`IOS_NATIVE_BRIDGE.md`](IOS_NATIVE_BRIDGE.md) — native capability bridge contract.
- [`WATERMARK_CONTRACT.md`](WATERMARK_CONTRACT.md) — watermark behavior and ownership.

## Release and historical material

- [`releases/`](releases/) — release-specific implementation/provenance notes.
- [`history/`](history/) — operational history retained for provenance only.

Historical content may explain why a current contract exists. It does not become current authority merely because it is still present in the repository.

## Source-of-truth order

When sources disagree, verify the real Git/Production state and use this order:

1. `governance/project-state.json`
2. `docs/HANDOFF.md`
3. `docs/CURRENT_RELEASE.md`
4. `docs/CURRENT_WORK.md`
5. `governance/owners.json` / `governance/retirements.json` / `governance/ci-inventory.json`
6. `docs/RUNTIME_CONTRACT.md`
7. `docs/PRODUCT.md`
8. `docs/ARCHITECTURE.md`
9. deterministic build/release contracts
10. release history and version-like source filenames

`release-contract.json` is currently a mutable legacy build seed. It is not the checked-in current-release authority.

If a verified Production or engineering-governance fact changes, update machine governance and current handoff in the same engineering change so this hierarchy does not drift.
