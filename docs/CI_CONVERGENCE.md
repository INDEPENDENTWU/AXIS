# CI convergence

This document records the evidence-driven migration from historical per-release workflow accumulation toward a smaller current CI system **without reducing release proof**.

Machine snapshot: [`../governance/ci-inventory.json`](../governance/ci-inventory.json).

## Current evidence

On PR #79, a governance/documentation-oriented Source Convergence change triggered **25 workflows** on one head SHA. The set spans historical labels from 8.8 through 8.18 plus current repository/runtime/cross-platform/provider gates.

That means a small follow-up commit can leave dozens of already-obsolete jobs queued or running for the previous PR head. During 8.18 this repeatedly delayed feedback on the actual latest candidate.

This is runner/feedback debt. It is not evidence that historical assertions are safe to delete.

## Classification rule

Every workflow receives one state:

- **current** — directly protects current repository/product/runtime truth;
- **provider-release** — provider packaging/deployment/Production policy;
- **compatibility-required-pending-equivalence-audit** — historical name but potentially current behavior; retain until mapped;
- **superseded** — equivalent current proof is explicit and retirement evidence exists;
- **historical-only** — no current executable/compatibility role remains.

Default for an old workflow is **not** “delete.” It is `compatibility-required-pending-equivalence-audit` until proven otherwise.

## First optimization — stale PR head cancellation

Before merging/deleting behavioral gates, AXIS added one orthogonal optimization:

> When a pull request gets a newer head SHA, cancel only still-active `pull_request` workflow runs that belong to the same PR but execute an older head SHA.

Implementation: `.github/workflows/axis-pr-run-convergence.yml` using official `actions/github-script@v9`.

### Safety boundary

Before cancellation, the workflow requires:

1. event is `pull_request`;
2. run belongs to the same PR number;
3. run belongs to the same head branch;
4. run head SHA is **not** the current PR head;
5. run is still queued/in-progress/requested/waiting/pending;
6. the cancellation workflow does not cancel itself.

It never queries `push` as its cancellation event class, so `main` / Production push runs are outside its cancellation set.

Fork PRs may receive a read-only token; a 403 cancellation response is logged as a warning rather than turning a contributor PR red.

### Verification record

The optimization is now **verified on PR #79**.

First execution:

- run `32626897002` — **success**;
- API/permission path succeeded;
- latest-head exclusion succeeded;
- no stale active run happened to remain at that instant.

Cross-head execution after the next meaningful evidence commit:

- run `32626975731` — **success**;
- current head: `1c30a3006fe1627838eac98ee133a3303a6cf509`;
- previous stale head: `df1b2507923083e49bde3602425194bccbc22f70`;
- stale active runs found: **10**;
- cancellation requests accepted: **8**;
- **2** runs completed before cancellation reached them and were left untouched;
- latest current head touched: **false**.

Accepted cancellations included stale-head instances of Runtime Gate, 8.18, 8.17, 8.13, 8.12 and 8.8-era gates. This is direct evidence that obsolete runner work can be removed without reducing latest-candidate coverage.

### Why this is safe

Coverage on the latest exact candidate does not change. Every existing workflow can still run on the latest head. Only results for a SHA that can no longer be merged as the PR head are discarded.

This improves feedback latency before harder workflow-consolidation decisions.

## Current workflow groups

### Current core

- AXIS Repository Contract
- AXIS Work Continuity Contract
- AXIS Runtime Gate
- AXIS Cross-Platform Foundation Gate
- AXIS 8.18 Object + Route + Capture + Focus

The 8.18 name is still version-shaped, but today it protects the current Production behavior baseline and therefore remains current until a version-neutral Current Product Matrix replaces it.

### Provider/release

- AXIS EdgeOne Production Mirror

Its PR package-contract responsibilities and `main`/Production responsibilities must be audited separately before any trigger change.

### Compatibility-required pending audit

Observed list includes:

- 8.17.1 Source Media
- 8.17 Interaction Convergence
- 8.16 Capture + Comparative Evidence
- 8.15.1 Regression Seal
- 8.15 Media Evidence
- 8.14 Evolution Objects
- 8.13 Runtime Core / Shadow Runtime / Live Route / Settings Convergence
- 8.12 Field Hardening / Field Hotfix / Settings / Field Polish / Learning Simplify
- 8.10.3 Gate
- 8.8 Reminder Layout Gate
- Home Transition Gate
- Inherited Web Release Gate

No item in this group is approved for deletion yet.

## Equivalence audit template

For each workflow, record:

| Question | Required answer |
| --- | --- |
| What user/product promise does it protect? | Concrete semantic behavior, not release name. |
| What source paths actually require it? | Exact paths/surfaces. |
| Does another current gate assert the same final behavior? | Name assertion/test and transient-state coverage. |
| Does it uniquely cover Chromium or WebKit? | Engine and exact path. |
| Does it uniquely cover old user data? | Storage/schema fixture. |
| Is its check name required by branch protection? | Must be known before rename/removal. |
| Can its assertion move into Current Product Matrix / Deep Compatibility Gate? | Exact destination. |
| What is the retirement proof? | Candidate SHA + green replacement evidence. |

Only after these answers are explicit can a workflow become `superseded`.

## Target CI architecture

### 1. Fast PR / repository gate

Cheap structural, syntax, governance, owner/retirement and focused smoke checks.

### 2. Current Product Matrix

Current semantics named by surface rather than historical version:

- Home/Today
- Capture / Quick Record
- Active Training / Focus
- History / detail
- Trends
- Evolution / Evidence
- Settings / archive
- Language Studio
- PWA route/foreground recovery

### 3. Deep Compatibility Gate

Explicit old-data and inherited-contract fixtures:

- `axis_v60_state`
- `axis_v8_meta`
- `axis_v89_speak`
- `axis_v42_media`
- custom object identity/aliases
- historical Encounter shapes

This is where old compatibility belongs once it no longer needs many separate release-era workflows.

### 4. Exact-SHA Production Seal

Keep strict provider/artifact/browser verification. This layer is not reduced for speed.

## Next audit priority

The next safest targets are not assertion deletion. Audit:

1. workflows with broad `pull_request: main` triggers and no path scoping;
2. duplicated `node build-release.mjs` work across one head;
3. assertions already present in Runtime Gate / current 8.18 gate;
4. historical gates whose unique value is old-data compatibility;
5. branch-protection check names before renaming/merging anything.

## Metrics

Track:

- workflows triggered per ordinary PR head;
- duplicate canonical builds per PR head;
- stale-head runs cancelled;
- time from push to first meaningful current-candidate result;
- version-shaped workflows remaining;
- assertions migrated to current semantic contracts;
- Chromium/WebKit coverage retained.

The objective is **less duplicate work, not less verification**.
