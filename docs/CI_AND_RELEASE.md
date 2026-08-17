# CI and release gates

AXIS separates candidate correctness from hosting correctness. A successful build is necessary but does not by itself mean Production is complete.

## Gate layers

### 1. Repository contract

`.github/workflows/axis-repository-contract.yml` checks repository-level invariants without changing or building the product:

- canonical documents exist;
- 8.12 is represented consistently as the current documented baseline;
- both hosting providers use `node build-release.mjs`;
- Vercel deploys automatically from `main` only;
- every build step named by `build-release.mjs` exists;
- generated canonical artifacts are not committed as source;
- one-off historical markers stay out of the repository root.

This gate is intentionally fast and dependency-free.

### 2. Canonical runtime gate

`.github/workflows/axis-runtime-gate.yml` is the broad candidate baseline. It builds the canonical release and exercises the current product through Chromium and iPhone-like WebKit.

It covers artifact topology, ownership diagnostics, first paint, recording, active adjustment, completion, catalog, watermarking, inherited release behavior and the full product operation matrix.

This is the most important general regression gate.

### 3. Current release surface gates

The 8.12 workflows are intentionally focused:

- `axis-812-experience-gate.yml` — syntax, corpus/dialogue/pedagogy contract and deterministic 8.12 build.
- `axis-812-browser-gate.yml` — current Language Studio behavior in Chromium and WebKit.

They are path-scoped so unrelated documentation or repository housekeeping does not needlessly run the whole surface-specific suite.

### 4. Inherited compatibility gates

Some workflows still carry older version names, including 8.11, 8.9 and 8.8-era behavior. Their names are historical; the behavior they protect may still be current.

Examples:

- 8.11 learning/multilingual/State Field/cloud foundation checks;
- 8.9 detail/vision/Rest Speak regressions;
- reminder/home-transition regressions introduced during 8.8-era convergence.

Do not delete an inherited workflow just because its filename is old. It may be retired or merged only after equivalent current coverage is explicit.

### 5. Deployment policy gate

`axis-deployment-policy-gate.yml` verifies the main-only Vercel deployment rule and keeps browser assertions aligned with the release contract.

Vercel is hosting, not the primary test runner. Non-main branches remain blocked from automatic Vercel Git deployment.

### 6. Production gates

`axis-production-deployment-gate.yml` reacts to a successful Production deployment, checks out the exact deployed SHA, rebuilds the expected release identity, waits for the fixed Production URL to converge, verifies the manifest and immutable assets, then runs real browser product gates against Production.

`axis-public-production-alias-gate.yml` independently verifies that the fixed public alias serves the exact intended source SHA, version, architecture and required release gates.

A deployment-specific URL being green does not compensate for a stale fixed public alias.

## Release sequence

```text
branch
  ↓
repository + focused checks
  ↓
canonical build
  ↓
Chromium + WebKit candidate gates
  ↓
pull request merge to main
  ↓
one Production build
  ↓
exact deployed SHA verification
  ↓
fixed public alias verification
  ↓
real Production browser gates
```

## Required discipline

- `main` represents the last accepted Production source.
- Build and browser checks run on the same candidate being reviewed.
- Production is identified by exact source SHA plus manifest contract, not by a visible version label alone.
- A transient duplicate action, first-paint flash or stale owner is a real regression even when the final DOM looks correct.
- WebKit coverage is release-blocking for user-facing runtime changes.
- Provider build quotas are not a reason to bypass CI; repeated testing belongs in GitHub Actions.

## Workflow convergence policy

The workflow directory should become simpler over time, but coverage comes before aesthetics.

When two workflows are consolidated, the replacement must preserve:

1. trigger coverage for the affected source paths;
2. every release-blocking assertion that is still current;
3. Chromium coverage where previously required;
4. WebKit coverage where previously required;
5. Production exact-SHA verification where applicable.

The desired long-term shape is a small set of reusable current workflows plus explicit compatibility tests, not a permanent workflow per historical version.
