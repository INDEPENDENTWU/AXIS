# AXIS 8.21 — Portable Backup WebKit Rollback Hotfix

## Exact base

- base `main`: `d3e4cb174a5230cfd216d7881af2f0999640b6c4`
- public/base release: `8.21`
- architecture: `canonical-single-runtime`
- intended product behavior change: none

## Failure owner

The iPhone-like WebKit portable-backup smoke used an out-of-band test mutation that replaced the live canonical `axis_v8_meta` value with a deliberately malformed object immediately before an injected restore failure. The running Activity/runtime compatibility owners are allowed to normalize their own metadata defaults while the page is live, so WebKit could add missing `events` / motion preference defaults between the test's `before` snapshot and the rollback transaction. That race made valid owner normalization look like backup rollback corruption.

The backup transport itself still verifies raw `axis_*` storage plus media at the mutation boundary, and the earlier round-trip portion of the same smoke exercises the real `axis_v8_meta` payload from the seeded AXIS state.

## Bounded correction

The rollback fixture uses a dedicated stable AXIS-namespace sentinel, `axis_test_rollback_sentinel`, instead of corrupting a live owner-managed metadata object. The sentinel participates in the same raw storage snapshot, so the gate still proves byte-for-byte rollback of AXIS-owned localStorage together with exact media rollback while canonical runtime owners remain free to maintain their legal metadata shape.

No assertion, timeout, storage owner, restore implementation, media implementation, schema, release identity, deployment topology, or product behavior is weakened or changed.

## Required proof

- static portable-backup contract remains green;
- Chromium full portable-backup smoke remains green;
- iPhone-like WebKit full portable-backup smoke becomes green on the exact head;
- corrupted digest reject-before-write, real state/media round trip, injected failure exact rollback, foreign storage preservation and active-session restore block remain required;
- merged exact `main` must again certify on Vercel, EdgeOne and `axis.juele.fun` before migration is called safe.
