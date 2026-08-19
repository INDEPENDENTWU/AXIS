# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` remains the product/release contract; this file records the active engineering boundary and the next exact action.

## Production baseline at start of this work

- Public Web release: **AXIS 8.12.4**.
- Base production `main`: `cf428199618a0e27e0fce5823bb251c761fd3d20`.
- Vercel Production: `https://axis-five-puce.vercel.app`.
- Architecture: `canonical-single-runtime`.
- PR #54 established truthful workout timing/direct training flow and canonical total-workout completion ownership.
- PR #55 added Settings-detail geometry convergence, recording Recent/My picker projections, single IME-aware equipment search ownership and professional exercise taxonomy enrichment without changing workout ownership.
- Existing Web production behavior must remain unaffected by Native Foundation work.

## Active change

- Branch: `axis-native-foundation-0`.
- PR: **#57 — AXIS Native Foundation 0 — contracts, fixtures, release rails**.
- Scope: cross-platform architecture/contracts/governance only; no Web runtime/product source changes.
- Objective: establish permanent domain/data/platform contracts, golden fixtures and engineering/release rails before Swift product implementation begins.

### Foundation decisions

- `INDEPENDENTWU/AXIS` remains the independent Web product/deployment repository.
- Target native repository: `INDEPENDENTWU/AXIS-iOS`.
- iOS will be true Swift/SwiftUI native, not a WKWebView wrapper.
- Web and iOS share versioned behavior/data contracts and golden fixtures, not UI code or production build chains.
- Domain: `axis.domain.v1`.
- Data: `axis.data.v1`.
- Exchange: `axis.exchange.v1`.
- Event: `axis.event.v1`.
- Media: `axis.media.v1`.
- Domain meaning/state transitions remain single-owner.
- Server/sync/AI/HealthKit are optional mirrors/adapters, never live-workout truth.
- A workout remains startable/recordable/finishable offline without account, AI or cloud.

### Foundation files

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

Machine-readable/shared/gates:

- `shared/contracts/*`
- `shared/fixtures/*`
- `scripts/axis-cross-platform-foundation-contract.mjs`
- `scripts/axis-native-foundation-seal.mjs`
- `.github/workflows/axis-cross-platform-foundation.yml`
- `.github/PULL_REQUEST_TEMPLATE.md`

### Non-regression boundaries

Do not change for this foundation:

- current Web runtime/build behavior;
- activity interval timing semantics;
- session interval-union timing;
- latest-real-activity project gap;
- incomplete-strength switch pause semantics;
- canonical total-workout completion ownership;
- direct Recent behavior;
- Live Route read-only/deviation-safe ownership;
- personal-equipment/history/media compatibility;
- manual/local recording when network/AI fails.

## Validation for this work

Before merge:

1. exact-head `AXIS Cross-Platform Foundation Gate` passes;
2. repository/continuity contracts show no unexplained regression;
3. changed-file review confirms no Web runtime/product source was modified;
4. PR states that normal Vercel Git integration may create a new source SHA even though runtime behavior is unchanged.

After merge:

1. verify exact merged `main` SHA;
2. verify fixed Vercel production URL still serves AXIS 8.12.4;
3. verify production manifest/source SHA and runtime identity;
4. verify no runtime errors;
5. preserve release evidence in PR #57 rather than creating an unnecessary follow-up production-only docs commit.

## Next planned stage

The connected GitHub tool can create branches/files/PRs inside existing repositories but cannot create a new repository.

Manual account-level action tracked in **issue #56**:

**Create GitHub repository `INDEPENDENTWU/AXIS-iOS` with default branch `main`.**

Repository protection/governance follow-up is tracked in **issue #58**.

After `AXIS-iOS` exists, initialize it with a minimal SwiftUI app + pure `AXISDomain` module and make Swift pass the same `axis.domain.v1` golden fixtures before building product UI.

For every new conversation/agent, inspect in this order:

1. `docs/CURRENT_RELEASE.md`;
2. this `docs/CURRENT_WORK.md`;
3. `docs/ARCHITECTURE.md`;
4. `docs/DOMAIN_CONTRACT.md` + `DATA_CONTRACT.md` + `PLATFORM_CONTRACT.md`;
5. active PR/branch and exact SHA;
6. exact failing test/log before making a fix.

Chat history is not authoritative project memory.
