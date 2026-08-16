# AXIS Deployment Policy

This document is the deployment handoff for AXIS. Product correctness and hosting promotion are separate contracts.

## Automatic deployment policy

Vercel Git deployments are deliberately restricted:

- `main` is the only branch allowed to deploy automatically.
- All other branches are blocked from automatic Vercel Git deployments by `vercel.json`.
- Pull requests, test-only commits, CI diagnostics and documentation changes are validated by GitHub Actions without consuming Vercel build quota.
- A Preview deployment is created only when it is explicitly needed for real-host validation.

The Vercel branch rule is:

```json
{
  "git": {
    "deploymentEnabled": {
      "**": false,
      "main": true
    }
  }
}
```

Vercel uses minimatch rules and deploys when any matching rule is `true`, so `main` remains deployable while every other branch is skipped.

## Release flow

Normal product work follows this sequence:

1. Create a development/fix branch.
2. Run deterministic `node build-release.mjs` through CI.
3. Pass Chromium Runtime Gate, iPhone/WebKit Gate and all surface-specific regressions.
4. Merge the verified PR to `main`.
5. Vercel builds `main` once for Production.
6. The deployment-specific Production gate verifies the exact deployed commit and canonical runtime contract.
7. The fixed-public-alias gate verifies `https://axis-five-puce.vercel.app/axis-build.json` serves the same exact commit and required canonical gates.
8. Only after steps 6 and 7 pass is Production considered complete.

A green Preview is not a completed release. A public version label is not a completed release. The fixed production alias must serve the exact intended source commit.

## Preview policy

Automatic Preview builds are intentionally disabled for non-main branches. When a real Vercel Preview is genuinely useful, create it explicitly and test that single deployment. Do not re-enable build-on-every-commit behavior.

If a verified Preview must be promoted urgently while a fresh Production build is rate-limited, Vercel supports promoting an existing READY deployment without rebuilding it. Promotion is acceptable only after the Preview artifact has passed the same release contract; subsequent `main` Production should still converge to the same product source.

## Production manifest contract

`https://axis-five-puce.vercel.app/axis-build.json` is the machine-verifiable source of truth for the fixed public URL. At minimum it must report:

- the intended `sourceCommit`;
- `version: 8.8` for the 8.8 release line;
- `baseVersion: 8.8`;
- `architecture: canonical-single-runtime`;
- one initial JavaScript runtime and zero dynamic JavaScript chunks;
- `canonicalSingleRuntime: true`;
- `noDynamicRuntimeChunks: true`;
- `noVersionFallback: true`;
- `singleActiveAdjustmentOwner: true`;
- `catalogCategorySingleOwner: true`;
- `capturePreferenceSingleOwner: true`;
- `canonicalReplacementPreservesDoubleDollar: true`;
- `sourceCommitStamped: true`;
- exactly one retired catalog writer for the current 8.8 catalog convergence.

If the fixed alias serves an older manifest after a new deployment succeeds, the release is incomplete even if the deployment-specific URL is correct.

## Build-rate-limit prevention

Do not create no-op commits to force deployments. Do not use Vercel as the primary test runner. GitHub Actions owns repeated browser testing; Vercel owns hosting verified builds.

If Vercel reports `build-rate-limit`:

1. stop creating additional Git commits solely to trigger deployment;
2. continue product verification in GitHub Actions;
3. if a READY verified deployment already exists, promote it instead of rebuilding when appropriate;
4. otherwise wait for the provider limit to reset and trigger only one `main` Production build;
5. verify the fixed alias manifest before declaring success.

## EdgeOne

EdgeOne and Vercel must both invoke only `node build-release.mjs`. Provider-specific scripts must not duplicate release constants or reconstruct the build sequence. The same `axis-build.json` contract is used to verify that each provider serves the same canonical product.
