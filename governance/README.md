# AXIS governance

This directory contains machine-readable engineering and product-program truth for the current AXIS repository.

It exists to make project continuity independent of any chat thread, individual developer memory, historical filename, or generated build artifact.

## Files

- `project-state.json` — current Production release, exact sealed baseline, active engineering milestone/phase, compatibility foundation, planned locales/themes and authority order.
- `product-program.json` — long-range AXIS Performance OS product program, stage order, north star, non-negotiables, commercial sequence and explicit non-goals.
- `owners.json` — verified critical capability owners and compatibility-only bridges.
- `retirements.json` — capabilities/surfaces that may not regain current authority, plus evidence required before physical deletion.
- `ci-inventory.json` — observed workflow fan-out, current classifications, proof runs and CI-convergence safety boundaries.
- `version-decision.json` — current governed release/version decision record.

## Authority

For current release/project state, read `project-state.json` first, then `docs/HANDOFF.md` and the current product/runtime contracts.

For long-range product direction and stage sequencing, read `product-program.json`, then `docs/PRODUCT_PROGRAM.md`, `docs/PRODUCT.md`, `docs/CAPABILITY_MANIFEST.md`, `docs/DESIGN_CONTRACT.md` and `docs/ENTERPRISE_BOUNDARIES.md`.

These two authority classes do not override each other: the product program describes accepted direction; project/release state describes what is actually implemented, merged, deployed and certified now. Historical release notes document provenance and do not override either authority.

`release-contract.json` is currently a mutable legacy build seed. The deterministic release chain advances it during compilation. Until source convergence replaces that mechanism, it must not be treated as the repository's checked-in current-release record.

## Update rules

1. Production release fields change only after an exact merged `main` SHA is accepted by the release process.
2. An owner may change only with an explicit handoff and regression evidence.
3. A retirement entry is a guard against authority returning; it is not permission to delete executable code without reachability and compatibility proof.
4. CI classification can become `superseded` only after equivalent current semantics, browser/data coverage and check-name implications are recorded.
5. Product-program stages may advance only when the exit conditions in `product-program.json` are supported by repository evidence.
6. `planned` product capability is not current product truth. Documentation and commercial claims must distinguish planned, foundation, production, deployed and Production-certified states.
7. Chat history may explain intent but never overrides repository governance.
8. This directory contains no credentials, provider secrets or user data.

## Source convergence rule

The target direction is:

```text
current source truth
    ↓
explicit compatibility adapters
    ↓
deterministic build
    ↓
current product contracts
    ↓
canonical runtime
```

Historical transforms and workflow duplication should decrease over time. New product work must not add a permanent version-specific patch layer when direct current ownership can be established safely.

## Product convergence rule

New product work should fit the durable chain:

```text
Intent → Execution → Encounter → Evidence → Evolution
```

A capability outside this chain must either support an accepted platform layer (`intelligence`, `sync-identity`, `workspace`, `api-sdk`) or be explicitly isolated. New capability must not create a second factual owner, make AI authoritative, make network access mandatory for core execution, or add unexplained permanent UI complexity.
