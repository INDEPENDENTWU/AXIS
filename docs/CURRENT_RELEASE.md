# Current Release — AXIS 8.21

**Status: Production sealed**

AXIS 8.21 is the current public Web release and the exact baseline for the next product milestone.

## Exact release identity

- release: **8.21 — Flow / Canonical Recording Property Surface**
- exact merged-main SHA: `4edc5f9ad37e51f3d1ae43fdc3912bf935703d1d`
- architecture: `canonical-single-runtime`
- release build: `node build-release.mjs`
- release hash: `8fe7eb766721`
- core/runtime hash: `66ede67e8b84`
- CSS hash: `cd3d3fbe0f29`
- initial JavaScript requests: `1`
- dynamic JavaScript requests: `0`

The fixed Vercel `axis-build.json` serves `version/baseVersion = 8.21`, exact source commit `4edc5f9ad37e51f3d1ae43fdc3912bf935703d1d`, and the hashes above.

## Production providers

### Vercel

- fixed URL: `https://axis-five-puce.vercel.app`
- deployment: `dpl_GJDst6J8hHCtvn2AYjLLDe4yozCh`
- state: **READY**
- target: `production`
- source SHA: `4edc5f9ad37e51f3d1ae43fdc3912bf935703d1d`
- Public Production Alias Gate run `33028649168`: **success**
- Production Deployment Gate run `33028649208`: **success**
- exact local/remote manifest + immutable asset verification: **success**
- real Chromium inherited foundation + current 8.21 flow against the fixed Production URL: **success**

### EdgeOne

- fixed URL: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- deployment: `dp6r0jcmk58a`
- verification workflow run: `33028633067`
- verification artifact: `9629477102`
- source SHA: `4edc5f9ad37e51f3d1ae43fdc3912bf935703d1d`
- package contract: **success**
- exact prebuilt deployment: **success**
- bounded fixed-domain release convergence: **success**
- Vercel canonical/API parity: **success**
- real Chromium current-release lifecycle: **success**
- real iPhone-like WebKit current-release lifecycle: **success**
- final `EdgeOne Production` GitHub status: **success**

The EdgeOne mirror publishes the already-verified Vercel/main-equivalent prebuilt artifact. It does not reinterpret product source independently.

## Product behavior sealed in 8.21

### 1. Recording properties belong to Object truth

Recording-property configuration lives on canonical Object create/edit surfaces, not on `记下` / Record.

An Object can explicitly configure properties such as weight, reps, duration, hold, distance, pace, speed, intensity, resistance, level, incline, rating or completion. The Record surface renders only value controls for the properties actually configured on that Object.

An explicit empty schema is valid truth. If a user clears every property, AXIS keeps `metricSchema: []`; it does **not** silently reselect duration or inject a legacy/default field.

Legacy fallback remains available only for old Objects that genuinely have no explicit schema.

### 2. Canonical recording controls are semantic, not one-off widgets

The established recorder remains the single recorder owner. 8.21 adds one canonical value-control system rather than property-specific mini-recorders.

Current control families cover:

- quantity / numeric stepping and direct entry;
- time / duration controls and quick presets;
- pace entry and stepping;
- bounded scale/rating controls;
- boolean/choice completion controls.

The Record page does not own schema selection. It only collects current values.

### 3. Flow sequences Objects at item granularity

Flow is intent/orchestration. Encounter remains factual history.

For a Flow `A → B → C`, the sealed lifecycle is:

```text
start
  ↓
A current
  ↓ 完成此项
B current
  ↓ 完成此项
C current
  ↓ 完成此项
Flow complete
```

One Object/item is the minimum Flow completion unit. Flow no longer routes through standalone `记下 → Quick Record → 完成一组` before it can progress.

Completing a Flow item:

- commits exactly one factual Encounter through the existing app-owned writer;
- freezes additive Flow provenance;
- advances immediately to the next item;
- does not fabricate unconfirmed weight/reps/sets/pace/intensity values;
- may truthfully record automatic facts such as completion or elapsed duration where the Object schema allows them.

### 4. Standalone Quick Record / Group Plan remain separate

Classic strength Group Plan and `完成一组` remain valid for standalone compatible Object execution.

During an active Flow, `临时记录其他` may open ordinary Quick Record. That Encounter is normal standalone history: it receives no false Flow provenance and does not consume or advance the Flow cursor.

Skip changes Flow intent only and creates no Encounter.

### 5. Existing ownership remains intact

8.21 did not add a second Session writer, Encounter writer, recorder, Active owner, media owner, or training database.

Authoritative persistence remains:

- `axis_v60_state`
- `axis_v8_meta`
- `axis_v89_speak`
- `axis_v42_media`

Flow definitions and one current FlowRun extend the existing app-owned `axis_v60_state`; there is no `axis_flow_*` namespace or new IndexedDB database.

## Historical capability provenance preserved

The public release is 8.21, but prior capability provenance remains truthful:

- 8.18 — Object/Capture/Evidence foundations;
- 8.19 — Universal Practice Object authority;
- 8.20 — Executable Practice Objects;
- 8.20.1 — Object reliability and executionMode-led Active lifecycle;
- 8.21 — canonical recording-property surface, Flow UI/runtime and item-unit completion.

The 8.21 release-only convergence did not relabel those historical owners.

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
- exact canonical topology;
- zero-property Object truth;
- one authoritative Encounter append boundary.

## Final verification shape

The exact merged main was accepted only after Runtime, Runtime Foundation, Current Release, Deep Compatibility, Repository, Work Continuity, Cross-Platform and Production verification completed without an unexplained red check.

Vercel fixed Production first converged to the exact 8.21 main artifact. EdgeOne then mirrored that exact prebuilt artifact and proved Vercel/EdgeOne parity plus real Chromium and iPhone-like WebKit Production lifecycles.

Current Production verification remains release-agnostic: exact source SHA, current local manifest, immutable assets, runtime topology and capability contracts are authoritative rather than a manually maintained version allowlist.

## Development baseline

All new AXIS product work must branch from or remain compatible with exact sealed 8.21 main `4edc5f9ad37e51f3d1ae43fdc3912bf935703d1d` unless a newer Production seal explicitly supersedes it.

Current work: [`CURRENT_WORK.md`](CURRENT_WORK.md)
