# AXIS Golden Fixtures

These fixtures are normative cross-platform regression examples for `axis.domain.v1` and additive portable contracts.

Rules:

- Fixtures describe semantic input/evidence and expected output, not UI screenshots.
- Web and iOS implementations may use different code, but must agree with the same fixture expectations.
- A regression fix should add or strengthen a fixture when the defect is domain/data related.
- Existing fixture expectations are not changed merely to make a new implementation pass. Semantic changes require an explicit contract/version decision.
- Fixture event IDs are stable and duplicate application must be idempotent in journal-capable implementations.

Current foundation cases cover pause/resume active-only duration, A→B→A latest-real-activity gap semantics, incomplete strength switching, and overlapping legacy interval union.

`flow/` contains AXIS 8.21 portable Flow fixtures. These prove heterogeneous Object sequencing and temporary override non-mutation without introducing a persistence model, UI contract or second Session/Encounter truth.
