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
- `axis.flow.v1` — ordered reusable Object intent with optional temporary step overrides; Flow is not historical truth or a second Session model
- `axis.flow-provenance.v1` — detached immutable Flow/step context suitable for additive Encounter provenance without replacing Encounter metric/execution snapshots
- `axis.normalized-state-fixture.v1` — strict typed input for normalized golden-state fixtures before semantic reduction

Version changes require an explicit compatibility/migration decision and corresponding golden fixtures. Metric and Flow contracts are additive to the existing domain/data v1 foundation: they do not replace the current Web persistence owners, create a second training store or reinterpret historical workout facts.
