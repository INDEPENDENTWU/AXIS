# AXIS Shared Contracts

This directory contains machine-readable cross-platform contract artifacts.

Authoritative human-readable semantics live in:

- `docs/DOMAIN_CONTRACT.md`
- `docs/DATA_CONTRACT.md`
- `docs/PLATFORM_CONTRACT.md`

Machine-readable artifacts support CI and future native implementations. They are not a second source of semantic meaning.

Current versions:

- `axis.domain.v1`
- `axis.data.v1`
- `axis.exchange.v1`
- `axis.event.v1`
- `axis.media.v1`
- `axis.metric-schema.v1` — reusable Object recording metrics and presentation-neutral semantics
- `axis.encounter-metrics.v1` — normalized Encounter metric projection with an immutable schema snapshot
- `axis.normalized-state-fixture.v1` — strict typed input for normalized golden-state fixtures before semantic reduction

Version changes require an explicit compatibility/migration decision and corresponding golden fixtures. Metric contracts are additive to the existing domain/data v1 foundation: they do not replace the current Web persistence owners or reinterpret historical workout facts.
