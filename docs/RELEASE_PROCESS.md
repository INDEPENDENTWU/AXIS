# AXIS Release Process

## Principle

A release is complete only when an exact source revision has passed its required gates and the actual distributed artifact has been verified.

Source, CI, deployment and production are separate states.

## Web release

1. Scoped branch from known `main` SHA.
2. Implement at declared owner boundary.
3. Run unit/contract/browser gates.
4. Open PR with scope, ownership and non-regression statement.
5. Require exact-head critical gates before merge.
6. Merge with an exact expected head SHA.
7. Verify `main` merge SHA.
8. Verify Vercel production is READY for the exact merge SHA.
9. Verify production manifest/runtime identity and critical flow.
10. Verify EdgeOne mirror separately when its production run/access can be observed.
11. Record release seal without unnecessary source-only commits.

## iOS release

1. Scoped branch from known iOS `main` SHA.
2. Domain/fixture/migration tests.
3. Simulator UI tests.
4. Real-device critical workout smoke.
5. Archive from clean exact source revision.
6. Stamp app version, build number, Git SHA, domain contract and data contract.
7. Internal install/TestFlight candidate verification.
8. Verify crash/relaunch, offline workout and permission-denial paths.
9. Submit/distribute only the verified archive.
10. Record released build identity and App Store/TestFlight state.

## Shared-contract change

A shared domain/data contract change is higher risk than a shell-only release.

It requires:

- versioned contract change;
- golden fixtures;
- migration/compatibility plan when persistence semantics change;
- Web compatibility evidence;
- iOS compatibility evidence once iOS participates;
- explicit rollout ordering when one shell must ship first.

## Main branch rule

`main` should represent a releasable state.

Target repository protection:

- pull request required for production-affecting changes;
- required CI checks;
- no force push;
- no destructive history rewrite;
- exact-SHA releases.

## Release identities

Web release evidence:

- public version;
- Git SHA;
- runtime/artifact hash;
- domain/data contract versions.

Native release evidence:

- app semantic version;
- build number;
- Git SHA;
- domain/data contract versions.

## Rollback

Rollback is an explicit release operation, never an undocumented manual state mutation.

A rollback must preserve user-data readability. If a new schema was already written, the old binary/artifact must not be restored unless it can read that data or a safe recovery path is provided.

## Release blocker examples

- mismatched domain fixture;
- destructive/unversioned schema change;
- duplicate state owner;
- current-workout failure offline;
- WebKit critical-flow failure for Web;
- real-device critical-flow failure for iOS;
- exact deployed SHA mismatch;
- production artifact not attributable to source;
- secret/signing material committed to source.
