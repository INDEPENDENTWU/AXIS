# Current Release — AXIS 8.28

**Status: Production-sealed**

AXIS **8.28 — Practice Loop Convergence** is the Production-certified release.

## Exact release identity

- product release PR: **#162**
- exact green PR head: `dee53456da37beff3dae815407c77ba2598c0887` — **31 / 31 SUCCESS**
- exact merged-main product/runtime SHA:

```text
df67fc0a20c0c34a79341315c8c85b5461acfe44
```

- product version decision: **8.27 → 8.28 / bump / sequence 25 / product-runtime**
- governance closeout decision: **8.28 → 8.28 / confirm / sequence 26 / governance**
- governance closeout: **PR #163**; governance-only merge commits are not product-runtime authority
- deterministic release build: `node build-release.mjs`
- architecture: `canonical-single-runtime`, **1 initial JavaScript request / 0 dynamic runtime chunks**

## Exact Production certification

All provider evidence below refers to product/runtime SHA `df67fc0a20c0c34a79341315c8c85b5461acfe44`.

| Surface | Exact evidence |
| --- | --- |
| Vercel | production deployment `dpl_3FLstNd9rvptfaA3YP1THwWfoazF` · READY · `https://axis-five-puce.vercel.app` |
| Vercel fixed Production Gate | run `37759655524` · exact 8.28 manifest parity · Chromium Practice Loop |
| Public Production Alias Gate | run `37759655542` · exact alias/source parity |
| EdgeOne | deployment `dpxaahz57drn` · run `37759608127` · `https://axisfitness-mirror-9x91gveo.edgeone.cool` |
| EdgeOne browser proof | same 8.28 manifest/source, 7 API contracts parity, Chromium and iPhone-like WebKit Practice Loop |
| Custom domain | run `37759608391` · `https://axis.juele.fun` · exact 8.28 manifest/runtime, 7 API contracts parity, Chromium and iPhone-like WebKit Practice Loop |

Merged-main release family: **30 / 30 SUCCESS**, including Current Release `37759608238`, Deep Compatibility `37759608259`, and Practice Loop `37759608066` gates.

## Sealed behavior

Practice Loop is a pure platform-neutral projection over Reality Route, FlowRun, Active and Session truth. It derives `ready`, `between-items`, `executing`, `paused`, `recovering`, `settling` and `complete` states.

Returning from the background or reloading reprojects the stored factual state without prompting, fabricating an Encounter, modifying Flow intent or adding a second Active/Session/recorder/storage owner.

The previous 8.27 Reality Route seal remains a historical certified product baseline at `d6044f0b30a92c007dd2fbab5792c2aa62dfd485`.

## Production authority

The exact Production product/runtime SHA above is authoritative. **Later governance-only commits or provider redeploys do not replace this runtime authority.** `latestDeploymentIsAuthority=false` is preserved in repository governance.
