# Deployment Policy

Product correctness and hosting completion are separate contracts.

## Branch policy

Automatic Vercel Git deployment is intentionally limited to `main`.

Feature, fix, test and documentation branches are validated in GitHub Actions. A hosting Preview is created only when a real hosted-environment check is necessary.

Provider configuration calls only:

```bash
node build-release.mjs
```

Vercel, EdgeOne and CI must not duplicate release constants or reconstruct the internal build sequence.

## Release path

1. Create a branch from the last intended Production baseline.
2. Build and validate the candidate in CI.
3. Pass the relevant Chromium and iPhone-like WebKit gates.
4. Merge the exact verified head to `main`.
5. Allow one Production build from `main`.
6. Verify the deployment artifact reports the exact merged source commit and current canonical release contract.
7. Verify the fixed public alias serves the same manifest and immutable assets.
8. Call the release complete only after those checks agree.

A green Preview, successful provider deployment or correct version label is not enough by itself.

## Production manifest

`axis-build.json` is the machine-readable deployment contract.

It must identify, at minimum:

- source commit;
- public version and stable base;
- architecture;
- canonical asset hashes;
- initial/dynamic JavaScript topology;
- current release gates;
- inherited compatibility gates required by the current release.

The public shell/manifest should use no-store semantics so release identity cannot be pinned by stale HTML/JSON caching. Content-hashed runtime assets may be cached as immutable.

## Fixed alias

The fixed public AXIS URL is part of release verification. If a deployment-specific URL is correct but the fixed public alias still serves an older manifest, Production is incomplete.

Do not repair alias/cache drift with a new product version or a no-op runtime change. Fix the hosting/deployment condition.

## Build-rate limits

GitHub Actions is the repeated validation plane; the hosting provider is not a test runner.

If a provider rate limit blocks a fresh Production build:

- stop creating no-op commits;
- continue verification in CI;
- promote an already verified ready artifact only when source identity and release contracts are identical;
- otherwise wait for the provider window and trigger one build;
- re-check the fixed alias afterward.

## Vercel

The current Vercel configuration keeps branch deployments main-only, applies no-store headers to release identity/shell resources, immutable caching to canonical assets, and baseline security/privacy headers.

A Vercel authentication/security checkpoint happens before AXIS runtime. Treat it as hosting accessibility/configuration, not as an application loading bug.

## EdgeOne

EdgeOne should consume the same canonical build command and resulting manifest. Provider-specific configuration may adapt routing/hosting but may not create an independent AXIS release definition.

## Deployment changes

Any change to build command, output directory, asset topology, source-SHA stamping, caching, serverless routes or fixed-alias verification is release engineering and should receive the same review discipline as product code.
