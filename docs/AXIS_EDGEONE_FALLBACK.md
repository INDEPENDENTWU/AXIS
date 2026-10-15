# AXIS — EdgeOne direct Production fallback

## Policy

EdgeOne is an **authorized fallback provider**, not an exemption from source, UX or data-integrity acceptance. Use this path when Vercel Production building/deployment is unavailable due to quota or an equivalent hosting outage, after **8.32 has passed independent release admission**. Do not create a Preview, deploy a feature branch, promote a stale prebuilt artifact or bypass the canonical Active/Flow/Encounter owner.

The existing EdgeOne mirror GitHub workflow waits for a new Vercel Production manifest; that **cannot** serve as the fallback if Vercel builds are blocked. The historical `scripts/edgeone-prebuilt-verify.mjs` source starts with 8.15.1 intentionally; the canonical 103-step build upgrades it to the current 8.32 contract. Never edit that historical input directly. The independent direct path is `scripts/axis-edgeone-fallback-release.mjs`. It deliberately does not call Vercel and does not depend on GitHub Actions minutes. It invokes the already-established `edgeone pages deploy . -n axisfitness-mirror -e production`, then checks the EdgeOne live artifact and the **actual official domain**.

## Immutable admission

The operator supplies `AXIS_RELEASE_SHA` as the exact 40-character **merged main HEAD**. The release command checks it against the local checkout, the actual remote `main` ref, the Version Authority, the immutable prebuilt artifact's stamped `sourceCommit` and an **external** approval file supplied through `AXIS_EDGEONE_ADMISSION_FILE`. Keeping the approval outside the Git tree avoids a self-referential commit-SHA mismatch.

The approval file must have this structure, using the exact verified merged-main SHA and the current version:

```json
{
  "schema": "axis.release-admission.v1",
  "version": "8.32",
  "sourceCommit": "<40-character exact merged-main SHA>",
  "approved": true,
  "gates": {
    "exactHeadGate": true,
    "chromium": true,
    "pinnedWebKit": true,
    "visual": true,
    "accessibility": true,
    "offlineEncounter": true,
    "performance": true,
    "mainMerged": true
  },
  "acceptance": {
    "P01": "pass",
    "P02": "pass",
    "P03": "pass",
    "P04": "pass",
    "P05": "pass",
    "P06": "pass",
    "P07": "pass",
    "P08": "pass",
    "P09": "pass",
    "P10": "pass",
    "P11": "pass",
    "P12": "pass",
    "P13": "pass",
    "P14": "pass",
    "P15": "pass",
    "P16": "pass",
    "P17": "pass",
    "P18": "pass",
    "P19": "pass",
    "P20": "pass"
  }
}
```

Only create this admission when evidence independently establishes every claim. It is **not currently issued**: 8.32 PR #174 is Draft and P11/P12/P15/P16/P17/P20 plus pinned WebKit compatibility have outstanding scope. In particular, Playwright 1.64 is not interchangeable with pinned WebKit 1.55.

## Release procedure (after admission, in a trusted operator environment)

1. Check out and verify the exact remote `main` commit. Confirm the previous Production source and availability for rollback; changes to a local-first persistence schema must remain backward-readable.
2. Build the canonical release with `GITHUB_SHA` set to that exact commit: `GITHUB_SHA="$AXIS_RELEASE_SHA" node build-release.mjs`. Do not inject version constants or generate artifacts in a second build system.
3. Make the external approved admission file available without committing it. Set `AXIS_RELEASE_SHA` and `AXIS_EDGEONE_ADMISSION_FILE`; run `node scripts/axis-edgeone-fallback-release.mjs --check`. This requires no EdgeOne token and cannot deploy.
4. In that trusted environment only, provide `EDGEONE_API_TOKEN` via a private secret manager or runtime variable. Set `AXIS_EDGEONE_CONFIRM_SHA` to the **same approved SHA**, then run `node scripts/axis-edgeone-fallback-release.mjs --publish`. Do not paste tokens into GitHub, chat, diagnostics or the source tree. CLI `edgeone` must be installed and authenticated for the existing `axisfitness-mirror` project.
5. The command must verify the exact deployed EdgeOne runtime marker and `axis-build.json` source/asset parity; it checks all seven API routes return JSON contracts without depending on Vercel. The CLI's credential-bearing temporary deployment evidence is restricted and redacted after verification.
6. Ensure `axis.juele.fun` actually resolves to the intended provider and serves that same SHA. The public domain proof is mandatory: an EdgeOne mirror-only release with the old official site still visible is **not finished**.
7. Run real Chromium/WebKit critical flows on the final public domain, validate persisted data after reload and record the independent Production Governance Seal. If the official-domain or runtime check fails, the release remains incomplete; preserve or restore the previously certified public version.

## Fail-closed behavior

- No exact merged-main SHA, matching source stamp, externally admitted P01–P20, browser/visual evidence or EdgeOne credentials: **no deployment**.
- A Preview or PR head is never admitted as the Production source.
- If Vercel's quota is **not** exhausted, the ordinary established release path remains available; using EdgeOne is a provider choice, not proof Vercel is out of quota.
- No EdgeOne connector/credential is exposed to this conversation. Preparation of this fallback is not a claim that any EdgeOne deployment has been executed.
- The historical Vercel-parity verifier remains the default for normal mirror releases. Only the explicit standalone mode replaces cross-provider API comparisons with independent exact-source and API checks.
