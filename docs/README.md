# AXIS documentation

Start here when the repository is unfamiliar.

## Current product

- [`CURRENT_RELEASE.md`](CURRENT_RELEASE.md) — what is shipping now and which source owners matter.
- [`PRODUCT.md`](PRODUCT.md) — product contract and product boundaries.
- [`ARCHITECTURE.md`](ARCHITECTURE.md) — current architecture, debt and target architecture.
- [`RUNTIME_CONTRACT.md`](RUNTIME_CONTRACT.md) — release-blocking runtime invariants.
- [`ENGINEERING_PLAYBOOK.md`](ENGINEERING_PLAYBOOK.md) — how changes are designed, tested and released.

## Repository and delivery

- [`REPOSITORY_STRUCTURE.md`](REPOSITORY_STRUCTURE.md) — what belongs where and why the root still contains historical source owners.
- [`COMPATIBILITY_LEDGER.md`](COMPATIBILITY_LEDGER.md) — compatibility debt, current compiler eras and retirement criteria.
- [`CI_AND_RELEASE.md`](CI_AND_RELEASE.md) — CI layers, browser gates and Production verification.
- [`DEPLOYMENT_POLICY.md`](DEPLOYMENT_POLICY.md) — hosting and promotion policy.
- [`ROADMAP.md`](ROADMAP.md) — planned Runtime migration and source convergence direction.

## Specialized contracts

- [`AI_BACKEND.md`](AI_BACKEND.md) — current AI backend boundary.
- [`CLOUD_AI_811.md`](CLOUD_AI_811.md) — cloud/sync and AI foundation introduced in the 8.11 line.
- [`IOS_NATIVE_BRIDGE.md`](IOS_NATIVE_BRIDGE.md) — native capability bridge contract.
- [`WATERMARK_CONTRACT.md`](WATERMARK_CONTRACT.md) — watermark behavior and ownership.

## Release history

- [`releases/`](releases/) — release-specific notes that still carry useful implementation history.
- [`history/`](history/) — operational markers retained for provenance but no longer used as current product truth.

## Source of truth order

When documents or filenames appear to disagree, use this order:

1. `docs/CURRENT_RELEASE.md`
2. `docs/RUNTIME_CONTRACT.md`
3. `docs/PRODUCT.md`
4. `docs/ARCHITECTURE.md`
5. `build-release.mjs` and executable release contracts
6. historical release notes and version-like source filenames

Historical filenames are implementation provenance, not current release identity.
