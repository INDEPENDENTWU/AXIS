# AXIS Deployment Policy — official dual-provider release

Effective for the forthcoming AXIS 8.32 release after the reviewed release-orchestration PR is merged. Until then the current certified public product remains **8.31**.

## Release topology

The only routine development release plane is source build + GitHub/local Chromium/WebKit gate. Neither provider is a daily test runner.

- `vercel.json` disables all **automatic** Git deployment triggers via `git.deploymentEnabled: false`.
- Only a deliberate, externally admitted `workflow_dispatch` of `.github/workflows/axis-edgeone-official-release.yml` may publish the exact merged-main release to **both Vercel and EdgeOne**.
- The existing Vercel-coupled EdgeOne push-publisher is retired; PR package/CI testing may still run.
- A change to main, docs or an unmerged feature branch is **not** itself permission to deploy.
- No routine Preview, no Vercel quota spend to check a PR, no dummy commit to trigger a production deployment.

## Admission and quality

Preserve the release acceptance: exact Head full CI, real Chromium and supported pinned WebKit, P01–P20, physical iOS/Android and accessibility/optical/low-end performance signoff, explicit release decision, expected-SHA merge. The final workflow requires exact merged-main SHA and external approval. It rejects absent secrets or source mismatches before publishing.

## Canonical runtime and providers

Both providers must compile the existing `node build-release.mjs` product topology; do not duplicate product code or version constants. `axis-build.json` is the machine-readable source/version/assets authority. Final checks compare source SHA, version/baseVersion, canonical runtime and immutable asset hashes on both the **fixed public Vercel alias** and the EdgeOne mirror and official `axis.juele.fun` custom domain.

The fixed public origins must return fresh HTML and build manifests, while content-addressed assets can remain immutable. A stale installed Safari PWA or service worker needs source-attributed diagnosis, never a fabricated version bump.

## Release and rollback

A release is complete only after **both providers and the official domain** expose the exact approved SHA and the critical real browser/factual Encounter tests pass. Save separate provider evidence; seal the immutable product/runtime commit in a governance-only PR after production verification. A failed provider or mismatching domain leaves the release unsealed. Use existing rollback procedures and preserve previous user data; never automatically retry a costly hosting build.

Full workflow: [AXIS_EDGEONE_PRIMARY_RELEASE.md](AXIS_EDGEONE_PRIMARY_RELEASE.md).
