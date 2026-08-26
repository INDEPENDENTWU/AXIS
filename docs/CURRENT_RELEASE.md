# Current Release — AXIS 8.20.1

**Status: Production sealed**

AXIS 8.20.1 is the current public Web release and the baseline for AXIS 8.21 development.

## Exact release identity

- release: **8.20.1 — Executable Object Reliability**
- exact merged-main SHA: `fdbfea738489fca6b19b3c8c7b502977373e4e4f`
- architecture: `canonical-single-runtime`
- release build: `node build-release.mjs`
- core hash: `1269a6183152`
- CSS hash: `fc372a0bf2f9`
- initial JavaScript requests: `1`
- dynamic JavaScript requests: `0`

## Production providers

### Vercel

- fixed URL: `https://axis-five-puce.vercel.app`
- deployment: `dpl_HWt8nGboTeNGBTdkqqJv9wsyMJaD`
- state: **READY**
- target: `production`
- source SHA: `fdbfea738489fca6b19b3c8c7b502977373e4e4f`
- Public Production Alias Gate: **success**
- current Production Deployment Gate run `32812905314`: **success**
- exact local/remote manifest + immutable asset verification: **success**
- real Chromium inherited foundation + current 8.20.1 flow: **success**

### EdgeOne

- fixed URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- deployment: `dpemq8bxjopa`
- verification workflow run: `32812883590`
- source SHA: `fdbfea738489fca6b19b3c8c7b502977373e4e4f`
- package contract: **success**
- exact prebuilt deployment: **success**
- bounded fixed-domain release convergence: **success**
- Vercel canonical/API parity: **success**
- real Chromium current-release flow: **success**
- real iPhone-like WebKit current-release flow: **success**
- final `EdgeOne Production` GitHub status: **success**

The EdgeOne mirror publishes the already-verified prebuilt artifact. It is not allowed to reinterpret product source independently.

## Product fixes sealed in 8.20.1

### 1. Explicit Object schema is executable truth

A custom Object configured for fields such as `pace` or `duration + intensity` must immediately record those fields. It must not fall back to weight/reps/sets merely because an inherited coarse kind is `strength` or `cardio`.

The visible custom editor remains the established owner. Schema persistence waits for canonical Object creation and then converges live Object Truth without creating a second store.

### 2. Active lifecycle follows execution semantics

`metricSchema` answers **what to record**.

`executionMode` answers **how the action progresses**.

Current modes:

- `single`
- `sets`
- `rounds`
- `timed`
- `hold`
- `complete`

Ongoing lifecycle:

- `sets`
- `rounds`
- `timed`
- `hold`

One-shot lifecycle:

- `single`
- `complete`

A duration-only Object such as a wall stand can therefore enter the polished existing `进行中` surface without pretending to be a set exercise. A pace-only one-shot record does not create false Active state.

Set-only UI such as `完成一组` / add-set behavior is allowed only when effective execution is actually `sets`.

### 3. Classic ownership is preserved

8.20.1 does not replace the proven classic strength path.

`v61.js` remains authoritative for classic set metadata only when the immutable Encounter schema is genuinely weight+reps. The 8.19 immutable Encounter-schema authority remains intact.

### 4. Internal enums stay internal

Persisted compatibility IDs such as `strength`, `cardio` and `relative` remain stable internal data. Chinese visible product surfaces map them to product language rather than leaking raw enum strings.

The derived Evolution/Object shelf remains read-only and uses user-facing product language.

## Preserved owners and stores

Authoritative persistence remains:

- `axis_v60_state`
- `axis_v8_meta`
- `axis_v89_speak`
- `axis_v42_media`

No 8.20.1 product or deployment fix added a new database, recorder, Active owner, Encounter writer, media owner or sound owner.

## Inherited capabilities still release-blocking

The sealed release continues to protect:

- Capture defaults and Scan 3/5-second sampling separation;
- 30fps source-first media/watermark path;
- Route Truth / foreground recovery;
- Focus presentation-only semantics;
- Media Evidence and factual Evolution;
- Learning/Language Studio isolation;
- historical session/data readability;
- classic Group Plan and set behavior;
- WebKit-safe media store behavior;
- exact canonical topology.

## Final verification shape

The exact release candidate/main was accepted only after current Runtime, Current Release, Deep Compatibility, Repository, Work Continuity, Cross-Platform and Production verification completed without an unexplained red check.

Historical Production workflows are now scope-aware. In particular, the historical `AXIS 8.12.x Production Gate` still runs its original checks for 8.12.1–8.12.4 but safely skips later releases instead of declaring them invalid.

Current Production verification is release-agnostic: exact source SHA, current local manifest, immutable assets, runtime topology and capability contracts are authoritative rather than a manually maintained version allowlist.

## Development baseline

All AXIS 8.21 work must branch from or remain compatible with this exact sealed baseline unless a newer Production seal explicitly supersedes it.

Current work: [`CURRENT_WORK.md`](CURRENT_WORK.md)
