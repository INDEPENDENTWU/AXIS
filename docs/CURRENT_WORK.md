# AXIS Current Work

> Canonical active-work handoff. Read [`HANDOFF.md`](HANDOFF.md) first; machine truth starts at [`../governance/project-state.json`](../governance/project-state.json).

## Production baseline at start of this work

- Formal runtime release is **AXIS 8.20.1 — Executable Object Reliability**.
- Product PR **#84** was sealed only after the exact release head passed Repository, Continuity, Runtime Foundation, Current Release, Runtime, Deep Compatibility, Cross-Platform and Universal Practice Object gates on Chromium and iPhone-like WebKit.
- Subsequent PRs **#85** and **#86** changed deployment verification/governance only; neither changed product runtime behavior.
- Current exact `main` baseline before this convergence PR is **`199900ba6b82432c67fd7d25ba50616c03012978`**.
- Vercel Production `https://axis-five-puce.vercel.app` is READY on that SHA and serves `version = 8.20.1`, `baseVersion = 8.20.1`, `architecture = canonical-single-runtime`, core `1269a6183152`, CSS `fc372a0bf2f9`, one initial JavaScript request and zero dynamic JavaScript requests.
- The current Vercel **AXIS Production Deployment Gate** has already passed exact local/remote manifest parity, immutable asset checks, inherited real Chromium product foundations and the current release chain through the 8.20.1 Object reliability smoke on `199900ba…`.
- EdgeOne CLI deployment for `199900ba…` itself returned **Deploy Success**, but the first immediate fixed-domain verification still observed previous sourceCommit `5b9d92d10088cef7378ce8224234b70f4e18b835`; this identified an EdgeOne propagation window in the verifier, not an artifact/runtime mismatch.
- AXIS 8.19 capture default-entry hotfix PR **#82** remains inherited: default Photo / Scan / Video resolution is app-owned, while Scan 3/5 seconds is an independent sampling preference.

Machine-governance compatibility note: `governance/project-state.json` retains the governed historical line **AXIS 8.19 — Universal Practice Objects** on branch `product/819-universal-practice-objects`. Those exact historical strings remain required by repository continuity checks until governance is advanced through a coordinated release record; this file records newer runtime/deployment truth without rewriting historical provenance.

## Active change

**AXIS 8.20.1 — Production Verification Convergence Seal** · branch `fix/8201-retire-812x-production-trigger` · PR **#87**.

The 8.20.1 product runtime is not being changed. This work closes two deployment-verification defects discovered only after exact Production deployment:

1. The historical **AXIS 8.12.x Production Gate** is subscribed to every successful Production deployment but intentionally supports only 8.12.1–8.12.4. It therefore produced a false failure on 8.20.1 (`unsupported 8.12 patch 8.20.1/8.20.1`). The fix preserves the complete historical 8.12.1–8.12.4 checks when that historical scope is active, while later releases explicitly skip those historical browser steps successfully.
2. EdgeOne can report deployment completion before the fixed project domain has globally converged to the new release. The old verifier sampled the fixed domain once immediately after `Deploy Success`. The new verifier performs a bounded convergence wait and still requires exact release parity before API or browser verification begins.

EdgeOne convergence remains strict:

- deployment log must contain a valid EdgeOne Deploy URL;
- fixed project origin is checked with authenticated no-cache/cache-busting requests;
- convergence is bounded to 30 attempts with 4-second intervals, never infinite or fail-open;
- root must expose the current canonical runtime marker;
- `version`, `baseVersion`, `sourceCommit`, `architecture`, core hash, CSS hash, runtime hash, initial-JavaScript topology and dynamic-JavaScript topology must all equal the exact local main artifact;
- after convergence, existing EdgeOne/Vercel API parity remains mandatory;
- only then may real Chromium and iPhone WebKit current-release flows run, including `axis-8201-object-reliability-smoke.mjs`;
- failure to converge to the exact main artifact inside the bounded window remains a hard Production failure.

The historical 8.12.x gate remains equally strict inside its own scope: 8.12.1–8.12.4 must have matching public/base identity and still run their original Production browser regressions. The fix does not relabel later releases as 8.12.x and does not weaken historical assertions.

Authoritative persistence remains `axis_v60_state`, `axis_v8_meta`, `axis_v89_speak` and `axis_v42_media`. The native/cross-platform handoff remains anchored by `axis-native-foundation-0` and repository `INDEPENDENTWU/AXIS-iOS`, with portable contracts `axis.domain.v1` and `axis.data.v1`.

**Chat history is not authoritative project memory. GitHub governance, contracts, tests and deployment truth remain authoritative.**

## Validation for this work

PR #87 may merge only when the exact head proves:

- Repository Contract and Work Continuity are green with this handoff update;
- Runtime Foundation, Runtime Gate, Current Release and Deep Compatibility remain green with no product runtime changes;
- EdgeOne package-contract remains green;
- `scripts/edgeone-live-verify.mjs` preserves every existing exact parity field and adds only bounded release-convergence semantics;
- the historical 8.12.x Production gate still rejects invalid base/public identity when active but safely skips later releases instead of producing a false failure;
- no product runtime, UI, persistence owner, schema, Capture behavior, Active lifecycle, Evolution, media, learning, sound or API behavior is altered.

After merge, the new exact main SHA must prove all Production layers again:

- fixed Vercel alias READY on the exact main SHA with `version/baseVersion = 8.20.1` and canonical artifact parity;
- current **AXIS Production Deployment Gate** success, including exact manifest/assets and real Chromium current-release flow through 8.20.1;
- historical **AXIS 8.12.x Production Gate** success-by-scope on 8.20.1, with historical browser work intentionally skipped;
- EdgeOne package + deployment success, bounded convergence to the exact main SHA, EdgeOne/Vercel API parity, real Chromium current-release flow and real iPhone WebKit current-release flow through 8.20.1;
- fixed EdgeOne URL `https://axisfitness-mirror-9x91gveo.edgeone.cool/axis-build.json` must report the same exact main SHA and canonical release identity;
- no relevant unexplained red Production/deployment check may remain on the final main SHA.

## Next planned stage

1. Merge PR #87 only from an exact all-green head.
2. Treat the resulting merge SHA as the only final 8.20.1 Production candidate; previous successful provider deployments are evidence, not the final seal.
3. Re-run and verify Vercel fixed alias, current Production Deployment Gate, historical 8.12.x scoped gate and EdgeOne dual-engine Production on that exact SHA.
4. Close **AXIS 8.20.1 Production** only when both providers and all relevant deployment gates agree on the same exact SHA with no unexplained red check.
5. Only then continue to **8.21 Flow / Session Blueprint**. Flow must build on the proven Object → Recorder → Active/one-shot → immutable Encounter chain rather than masking ownership defects.

**Conversation history is supplemental only. GitHub handoff/contracts/tests are authoritative for this work.**
