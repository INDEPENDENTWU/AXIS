## Problem / intent

What user-visible behavior, defect or engineering contract does this change address? Keep the scope narrow.

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

## Verification

- [ ] Relevant unit/domain/contract tests
- [ ] Golden fixture when domain semantics change or a domain regression is fixed
- [ ] Migration fixture/idempotency test when persistent schema changes
- [ ] `node build-release.mjs` when Web runtime/release output changes
- [ ] Chromium path when Web interaction changes
- [ ] iPhone-like WebKit path when critical/mobile Web interaction changes
- [ ] iOS simulator + real-device critical smoke when native interaction changes
- [ ] No new duplicate owner, shadow state or delayed cleanup path
- [ ] Existing local data remains compatible or has an explicit tested migration

## Release identity

- Base SHA:
- Exact candidate SHA:
- Public/app version:
- Domain contract:
- Data contract:

## Non-regression statement

Explicitly list important behavior/owners this change must not modify.

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

## Review notes

Call out any compatibility transform, deployment implication, security boundary or follow-up that a reviewer should know about. Add before/after media only when it materially helps review.
