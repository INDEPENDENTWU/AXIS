# AXIS AI Development Protocol

This protocol applies to ChatGPT, Codex, other AI coding agents and human-assisted AI workflows.

## Before coding

1. Read `docs/CURRENT_RELEASE.md`.
2. Read `docs/CURRENT_WORK.md`.
3. Read `docs/ARCHITECTURE.md`.
4. Read `docs/DOMAIN_CONTRACT.md`, `docs/DATA_CONTRACT.md` and `docs/PLATFORM_CONTRACT.md` for cross-platform work.
5. Inspect the current `main` SHA and active PR/branch.
6. Identify the current semantic owner, persistence owner, UI owner and network/media owners involved.
7. Reproduce the problem or characterize the intended behavior before editing.

## During coding

- Do not introduce a second authoritative writer for the same semantic fact.
- Do not create undocumented storage keys or schemas.
- Do not silently mutate persisted schema.
- Do not make AI/network availability required for manual workout recording.
- Do not scrape rendered text/geometry as a substitute for domain state.
- Do not weaken, delete or skip a failing regression merely to make CI green.
- Prefer narrow changes at the current owner boundary.
- Preserve old-user-data compatibility unless an explicit tested migration accompanies the change.
- Keep platform-only APIs outside pure domain logic.

## Tests required by change type

### Domain behavior

Add/update deterministic unit or golden-fixture coverage.

### Persistence/schema

Add migration + idempotency + old-data fixture coverage.

### Web interaction

Add/retain Chromium and iPhone-like WebKit coverage for critical paths.

### iOS interaction

Add pure domain tests, simulator UI coverage and real-device smoke for release-critical paths.

### Cross-platform contract

The same fixture must pass in all participating platform implementations before the contract is considered implemented.

## Before merge

1. Confirm exact PR head.
2. Confirm ownership remains single and documented.
3. Run relevant contract/fixture/migration/browser/native gates.
4. Inspect generated release/build metadata.
5. Check no secret/private signing material was added.
6. Check release notes accurately describe behavior and non-regressions.
7. Do not claim a queued/in-progress gate passed.

## After merge

1. Verify the exact merged SHA.
2. Verify the actual production artifact/binary, not source assumptions.
3. Verify version/contract/build identity.
4. Check runtime/crash signals where available.
5. Record a release seal without creating unnecessary production-only documentation churn.
6. If a regression occurred, preserve it as a test/fixture so the same class cannot silently return.

## Conversation continuity

Chat history is not authoritative project memory.

When a conversation becomes long or is replaced, the next agent must recover from GitHub truth first. `CURRENT_WORK.md` is the handoff, not a prose diary.

A good handoff contains only:

- stable baseline;
- active branch/PR;
- problem/scope;
- owners;
- changes already made;
- invariants that must not change;
- tests/status;
- blocker;
- next exact action.

## Incident behavior

For a production defect:

`reproduce → identify owner → add failing regression → fix owner → pass gates → exact release → production verify → record root cause`

Do not stack speculative fixes across unrelated owners.

## Prohibited claims

An agent must not say:

- production is fixed merely because source changed;
- a workflow passed while it is queued/running;
- a deployment is public/reachable without verifying the relevant platform policy/path;
- a migration is safe without testing representative old data;
- Web and iOS are equivalent without shared contract/fixture evidence.
