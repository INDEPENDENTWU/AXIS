# AXIS governance

This directory contains machine-readable engineering truth for the current AXIS repository.

It exists to make project continuity independent of any chat thread, individual developer memory, historical filename, or generated build artifact.

## Files

- `project-state.json` — current Production release, exact sealed baseline, active engineering milestone, compatibility foundation, planned locales/themes and authority order.
- `owners.json` — verified critical capability owners and compatibility-only bridges.
- `retirements.json` — capabilities/surfaces that may not regain current authority, plus the evidence required before physical deletion.

## Authority

For current project state, read `project-state.json` first, then `docs/HANDOFF.md` and the current product/runtime contracts. Historical release notes document provenance; they do not override current governance.

`release-contract.json` is currently a mutable legacy build seed. The deterministic release chain advances it during compilation. Until source convergence replaces that mechanism, it must not be treated as the repository's checked-in current-release record.

## Update rules

1. Production release fields change only after an exact merged `main` SHA is accepted by the release process.
2. An owner may change only with an explicit handoff and regression evidence.
3. A retirement entry is a guard against authority returning; it is not permission to delete executable code without reachability and compatibility proof.
4. Chat history may explain intent but never overrides repository governance.
5. This directory contains no credentials, provider secrets or user data.

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

Historical transforms should decrease over time. New product work must not add a permanent version-specific patch layer when direct current ownership can be established safely.
