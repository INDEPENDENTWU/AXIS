# ADR-0002 — Contract + Fixture + Gate is cross-platform truth

- Status: Accepted
- Date: 2026-08-19

## Decision

Cross-platform equivalence is defined by three artifacts:

1. versioned contract documents/schemas;
2. deterministic golden fixtures;
3. automated release gates that reject incompatible behavior.

Chat history, screenshots and duplicated implementation code are not authoritative cross-platform truth.

## Why

Web and native shells will use different UI frameworks and storage adapters. Sharing UI code would not guarantee semantic equivalence. Deterministic inputs/outputs do.

## Consequences

- every semantic regression should become a fixture/test;
- Web/iOS may implement the contract differently internally;
- a shared contract version changes only deliberately;
- CI must fail when fixture expectations diverge;
- production claims require actual artifact verification beyond CI.
