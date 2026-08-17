## Problem / intent

What user-visible behavior, defect or engineering contract does this change address?

## Ownership

Which product/data owner changes? Which existing owner is preserved, replaced or retired?

## Verification

- [ ] `node build-release.mjs`
- [ ] Relevant contract/smoke tests
- [ ] Chromium path when user interaction changes
- [ ] iPhone-like WebKit path when critical/mobile interaction changes
- [ ] No new duplicate owner, shadow state or delayed cleanup path
- [ ] Existing local data remains compatible or has an explicit tested migration

## Review notes

Call out any compatibility transform, deployment implication, security boundary or follow-up that a reviewer should know about. Add before/after media only when it materially helps review.
