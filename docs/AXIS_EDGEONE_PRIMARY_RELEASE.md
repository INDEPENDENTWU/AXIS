# AXIS 8.32 — Deliberate dual-provider official Production

Status: **release-engineering candidate in stacked Draft PR #175**; no Production promotion or 8.32 governance seal is claimed.

## Policy

Vercel **and** EdgeOne both publish the same independently accepted, exact merged-main product version **only at final official release**. Vercel is not a daily CI/Preview runner. Vercel automatic Git deployments are disabled by `vercel.json` (`git.deploymentEnabled: false`); the final GitHub Actions `workflow_dispatch` is the sole intended new official deployment trigger. Avoid creating Preview deployments or separate deployment-trigger commits to test a branch.

The permanent public endpoints currently documented are:
- Vercel: `https://axis-five-puce.vercel.app`.
- EdgeOne mirror: `https://axisfitness-mirror-9x91gveo.edgeone.cool`.
- Official custom domain: `https://axis.juele.fun`. **Its actual provider routing cannot be inferred from the name alone.**
A Safari-added Home Screen app is bound to its installed origin. Updating another host does not migrate that installed app's storage. A version label by itself does not identify the provider.

## Source and admission

The last certified public product/runtime remains AXIS **8.31** at `dddce5401e80087a7ccceb43ec466f1ad7abb505`. The 8.32 product implementation remains Draft PR #174 and its exact pre-release product SHA `c1b34ef3554035f34d027b336e6296dc35bd5951`. The 8.32a documentation-only merged `main` cannot make the public app show 8.32.

Before anyone dispatches the official release:
1. Resolve P11/P12/P15/P16/P17/P20 with **real** physical iOS/Android, optical/safe-area, OS text zoom and screen-reader assessment and measured low-end tail performance. Record P01–P20 independently; no invented pass or waived evidence.
2. Run the complete canonical source/Chromium/pinned-WebKit release gates for the exact product Head. Review the stacked release-orchestration branch and merge the accepted product and verified orchestration into `main` using expected SHA protection.
3. Independently create an external `axis.release-admission.v1` JSON approval for the **exact merged-main SHA** with `approved:true`, the eight mandatory gates and all `P01`–`P20` equal to `pass`. Set it as GitHub Actions secret `AXIS_EDGEONE_ADMISSION_JSON`. Do not commit this approval, skip a check or fabricate device signoff.
4. Configure existing private `EDGEONE_API_TOKEN` and `VERCEL_API_TOKEN` in GitHub Actions secrets. No secrets in code, Issues, ChatGPT or logs.
5. Manually dispatch `.github/workflows/axis-edgeone-official-release.yml` using the full 40-character merged-main SHA, **once**. The workflow must reject a stale, partial or non-main admission **before either provider is touched**.

## Single official release workflow

1. Check out exact `main`, build the canonical 103-stage release once and verify the prebuilt artifact.
2. Verify the same independent P01–P20 admission using the existing `scripts/axis-edgeone-fallback-release.mjs --check`, which does not publish.
3. With a private Vercel API token, request **one Git-connected Production deployment** from the exact SHA through `scripts/axis-vercel-official-release.mjs`. Wait for READY and verify the fixed Vercel alias's manifest has the same version, SHA, architecture and immutable runtime hashes. If it already serves an identical artifact, re-use it without consuming a build.
4. Use the admitted EdgeOne standalone `--publish` path **once**, without waiting for Vercel in the legacy mirror job. Independently verify the EdgeOne served artifact, live JSON API routes and `axis.juele.fun` source/asset parity. Preserve the difference between deployment success and a fully certified product.
5. Run real Chromium and pinned WebKit on the **official domain and Vercel fixed alias**, including inherited practice/recording and state persistence checks. Verify both provider results at the same SHA, then perform a real-device installed-PWA version/cache/storage validation.
6. Complete an **independent 8.32 Production Governance Seal**, recording exact merged-main product runtime SHA, both deployments, custom-domain proof and real user data continuity.

A provider quota error, timeout, incomplete alias routing, failed browser test or inaccessible official site means **release incomplete**. Do not run automatic compensating Vercel builds. Use an established rollback to prior known-good deployment when necessary. A successful release must be observable from each *actual* installed origin, not asserted from a GitHub green badge alone.

## Handoff

At this checkpoint, both PR #174 and the stacked PR #175 remain Draft. No GitHub Actions on new release code, Vercel Preview/Production, EdgeOne Production, custom-domain or `main` mutation is asserted. Source policy and exact-release code are staged for review. The PWA currently showing **8.31** is consistent with the last certified public runtime; identifying the exact installed origin requires observing that specific installed app's actual hostname, not guessing from its icon.

The retired `.github/workflows/axis-edgeone-production-mirror.yml` retains source/package contract checks but cannot automatically deploy. Keep the independent `docs/AXIS_EDGEONE_FALLBACK.md` script contract as a lower-level EdgeOne provider utility, not as the governing dual-provider release policy.
