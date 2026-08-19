## Scope

<!-- What user-visible or engineering problem does this PR solve? Keep the boundary narrow. -->

## Ownership map

- Semantic/state owner:
- Persistence owner:
- UI/projection owner:
- Network owner:
- Media/platform owner:
- Owners intentionally unchanged:

> A semantic fact must not have two authoritative writers.

## Contract impact

- [ ] No shared domain/data contract change
- [ ] `axis.domain.v1` compatible
- [ ] `axis.data.v1` compatible
- [ ] Shared contract version change is explicit and documented

If persistence/schema changes:

- migration path:
- old-data fixture:
- idempotency test:
- rollback/recovery note:

## Local-first / failure behavior

- [ ] Manual workout recording remains usable offline
- [ ] AI/network failure does not block manual recording
- [ ] Optional platform capability denial/failure has a fail-open path

## Regression evidence

- Unit/domain:
- Golden fixture:
- Migration:
- Chromium/WebKit:
- iOS simulator/real device (when applicable):

## Release identity

- Base SHA:
- Exact candidate SHA:
- Public/app version:
- Domain contract:
- Data contract:

## Non-regression statement

<!-- Explicitly list important behavior/owners this change must not modify. -->

## Before merge

- [ ] Exact-head required gates passed
- [ ] No unexplained red regression
- [ ] No secret/signing material committed
- [ ] Generated artifact/manifest inspected when applicable
- [ ] Queued/running checks are not described as passed

## After merge

- [ ] Verify exact merged SHA
- [ ] Verify actual production artifact/binary
- [ ] Verify runtime/crash signals where available
- [ ] Preserve any production regression as an automated guard
