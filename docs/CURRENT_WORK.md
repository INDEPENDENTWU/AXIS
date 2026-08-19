# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` remains the product/release contract; this file records the active engineering boundary and the next exact action.

## Stable production baseline

- Public Web release: **AXIS 8.12.4**.
- Stable production `main`: `cf428199618a0e27e0fce5823bb251c761fd3d20`.
- Vercel Production: `https://axis-five-puce.vercel.app`.
- Architecture: `canonical-single-runtime`.
- PR #54 established truthful workout timing/direct training flow and canonical total-workout completion ownership.
- PR #55 added Settings-detail geometry convergence, recording Recent/My picker projections, single IME-aware equipment search ownership and professional exercise taxonomy enrichment without changing workout ownership.
- Existing Web production behavior must remain unaffected by Native Foundation work.

## Active branch

- Branch: `axis-native-foundation-0`.
- Scope: cross-platform architecture/contracts only; no Web runtime/product code changes.
- Objective: establish permanent domain/data/platform contracts, golden fixtures and engineering/release rails before Swift product implementation begins.

## Foundation decisions

### Separate shells / releases

- `INDEPENDENTWU/AXIS` remains the independent Web product/deployment repository.
- Target native repository: `INDEPENDENTWU/AXIS-iOS`.
- iOS will be true Swift/SwiftUI native, not a WKWebView wrapper.
- Web and iOS share versioned behavior/data contracts and golden fixtures, not UI code or production build chains.

### Contract identities

- Domain: `axis.domain.v1`
- Data: `axis.data.v1`
- Exchange: `axis.exchange.v1`
- Event: `axis.event.v1`
- Media: `axis.media.v1`

### Ownership

- Domain meaning/state transitions remain single-owner.
- Platform shells are projections/adapters.
- Local persistence mechanics are platform-specific adapters.
- Server/sync/AI/HealthKit are optional mirrors/adapters, never live-workout truth.
- A workout remains startable/recordable/finishable offline without account, AI or cloud.

## Files added in Native Foundation 0

Human-readable contracts/policies:

- `docs/DOMAIN_CONTRACT.md`
- `docs/DATA_CONTRACT.md`
- `docs/PLATFORM_CONTRACT.md`
- `docs/IOS_ARCHITECTURE.md`
- `docs/AI_DEVELOPMENT_PROTOCOL.md`
- `docs/RELEASE_PROCESS.md`
- `docs/MIGRATION_POLICY.md`
- `docs/INCIDENT_POLICY.md`
- `docs/NATIVE_FOUNDATION_CHECKLIST.md`
- `docs/decisions/ADR-0001-web-ios-separate-shells.md`
- `docs/decisions/ADR-0002-contract-fixture-gate.md`
- `docs/decisions/ADR-0003-event-journal-after-domain-stability.md`
- `docs/decisions/ADR-0004-native-local-first-no-account.md`

Machine-readable shared foundation:

- `shared/contracts/axis-contract-manifest.json`
- `shared/contracts/axis-event-v1.schema.json`
- `shared/contracts/axis-exchange-v1.schema.json`
- `shared/contracts/axis-platform-capabilities-v1.json`
- `shared/contracts/axis-product-matrix-v1.json`
- `shared/contracts/README.md`
- `shared/fixtures/README.md`
- `shared/fixtures/workout-basic-pause-resume.json`
- `shared/fixtures/workout-a-b-a.json`
- `shared/fixtures/workout-switch-incomplete-strength.json`
- `shared/fixtures/workout-overlap-union.json`

Gate:

- `scripts/axis-cross-platform-foundation-contract.mjs`
- `.github/workflows/axis-cross-platform-foundation.yml`

## Non-regression boundaries

Native Foundation work must not change:

- current Web runtime/build artifacts;
- activity interval timing semantics;
- session interval-union timing;
- latest-real-activity project gap;
- incomplete-strength switch pause semantics;
- canonical total-workout completion ownership;
- direct Recent behavior;
- Live Route read-only/deviation-safe ownership;
- personal-equipment/history/media compatibility;
- manual/local recording when network/AI fails.

## Validation / merge boundary

Before merging this foundation PR:

1. cross-platform contract/fixture gate passes on exact PR head;
2. repository/continuity contracts show no unexplained regression;
3. changed-file review confirms no Web runtime/product source was modified;
4. PR explicitly states that merging may create a new production source SHA through normal Vercel Git deployment even though runtime behavior is unchanged;
5. after merge, verify the fixed Vercel production URL still serves AXIS 8.12.4 and the exact new source SHA with no runtime errors.

## External blocker / next exact action

The current GitHub connector can create branches/files/PRs inside existing repositories but cannot create a new repository.

Therefore the only account-level manual step before Swift source work is:

**Create GitHub repository `INDEPENDENTWU/AXIS-iOS` with default branch `main`.**

After that, the next engineering action is to initialize the native repository with a minimal SwiftUI app + pure `AXISDomain` module and make Swift pass the same `axis.domain.v1` golden fixtures before building product UI.

## Continuity rule

For every new conversation/agent, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. this `docs/CURRENT_WORK.md`;
3. `docs/ARCHITECTURE.md`;
4. `docs/DOMAIN_CONTRACT.md` + `DATA_CONTRACT.md` + `PLATFORM_CONTRACT.md`;
5. active PR/branch and exact SHA;
6. exact failing test/log before making a fix.

Chat history is not authoritative project memory.
