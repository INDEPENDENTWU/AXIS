# AXIS Native Foundation 0

## Objective

Establish the permanent cross-platform engineering rails before native feature implementation begins, while leaving current Web production behavior unchanged.

## Foundation scope

- [x] Domain contract v1 documented.
- [x] Data contract v1 documented.
- [x] Platform boundary documented.
- [x] Native iOS architecture documented.
- [x] AI/agent development protocol documented.
- [x] Release process documented.
- [x] Migration policy documented.
- [x] Incident policy documented.
- [x] Architectural decisions recorded.
- [x] Machine-readable contract manifest added.
- [x] Event schema v1 added.
- [x] Exchange schema v1 added.
- [x] Golden cross-platform fixtures added.
- [x] Automated contract/fixture gate added.

## External/native repository step

Target repository: `INDEPENDENTWU/AXIS-iOS`.

The GitHub connector used for this foundation can create branches/files/PRs inside existing repositories but cannot create a brand-new GitHub repository. Therefore repository creation is the only manual account-level action still required before Swift source can be committed there.

When created, initialize it with:

- default branch `main`;
- no generated sample app code committed until the architecture skeleton is deliberate;
- SwiftUI app target;
- pure `AXISDomain` package/module;
- contract/fixture import or pinned mirror from this repository;
- CI for Swift domain fixtures first;
- no WebView product shell;
- no cloud/account dependency in milestone 1.

## First iOS engineering milestone

The first accepted native milestone must prove on iPhone:

`start → record → pause → switch → resume → finish → force-kill/relaunch → history`

and match the same `axis.domain.v1` golden expectations.

## Explicitly deferred

Until the core path is stable:

- App Store commercial model;
- mandatory account;
- cross-device cloud sync;
- Apple Watch;
- HealthKit-derived product decisions;
- Live Activity controls;
- AI-required recording;
- Android.

These are future adapters/surfaces, not prerequisites for a correct native foundation.
