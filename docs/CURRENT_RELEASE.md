# Current Release

## AXIS 8.13.1

8.13.1 is the current release candidate. It is the first **Evolution Foundation** release: the existing training recorder remains authoritative, while the read-only Trends surface becomes a live projection of sealed real-world training evidence rather than a static explanatory screen.

This release does not introduce a new training writer, account requirement, social layer, AI chat surface or network dependency. Existing 8.13/8.12.x recording, Quick Record, camera/media, personal equipment, Live Route, Language Studio, local-first storage and canonical single-runtime behavior remain inherited.

## Confirmed production regression fixed

A completed workout can no longer exist in `记录` while `趋势` remains an inert empty skeleton.

The authoritative path is:

```text
completed workout
      ↓
axis_v60_state.sessions
      ↓
read-only Trends projection
      ↓
visible bearing / readout / fingerprint
```

`记录` and `趋势` therefore observe the same sealed session source. Trends does not maintain a second historical database.

When the user enters Trends, the surface re-reads sealed sessions without requiring a page reload. The lifecycle is intentionally small: navigation capture, `pageshow`, and an explicit read-only refresh hook. It does not add a persistent timer or observer.

Seven completed sessions on the same day remain seven distinct sessions and seven distinct bearings. A later eighth sealed session becomes visible when the user returns to Trends without reloading the app.

## Trends 8.13.1 contract

Trends remains read-only.

- Source of session truth: `axis_v60_state.sessions`.
- Activity timing evidence: event-local activity when present, otherwise canonical `axis_v8_meta.events[eventId].activity`.
- No LocalStorage/IndexedDB writes.
- No network requests.
- No training ownership.
- No sheet/modal navigation.
- Vertical page scrolling remains native.
- Horizontal scrub activates only after clear horizontal intent.
- The 24px left/right edge rail remains reserved for Safari/system gestures.
- Reduced-motion preferences remove structural transition motion.

The surface keeps the AXIS bearing/time-field visual language but removes instructional copy such as `左右滑动查看`, `点一下展开这次训练`, `留下几次训练后…` and similar coaching/explanation text.

Visible text is factual. Examples include:

- `暂无训练记录`
- `本次是当前范围内的首次训练记录。`
- `高位划船机重量不变，完成次数从 30 次增加到 36 次。`
- `本次和上一次的整体结构接近。`

Sub-minute completed sessions are represented truthfully as `<1分钟`; they are not rounded upward to a fictional one-minute workout.

## Evolution Foundation

8.13.1 adds a read-only projection that can turn repeated event evidence into Evolution objects without changing the historical schema.

For each repeated equipment/exercise identity, the projection can derive:

- first encounter time;
- latest encounter time;
- encounter count;
- elapsed span;
- first/latest strength or cardio evidence;
- available photo/video evidence count.

The projection is exposed as `window.__AXIS_8131_EVOLUTION_FOUNDATION__` for current diagnostics and future product work. It writes nothing. It is foundation for later Capture → Encounter → Evolution → Replay work, not a new dashboard shown prematurely in 8.13.1.

The long-term product direction is documented in [AXIS_EVOLUTION_VISION.md](AXIS_EVOLUTION_VISION.md) and the release foundation in [8.13.1_EVOLUTION_FOUNDATION.md](8.13.1_EVOLUTION_FOUNDATION.md).

## Existing training truth preserved

8.12.4 timing semantics remain release-blocking behavior:

- real activity intervals are preferred over event insertion order;
- pausing closes the current interval and resuming opens another;
- session effective time is the union of real activity intervals;
- total-workout completion seals remaining activity lifecycle evidence before archiving;
- project/session start/end facts remain derived from real recorded boundaries where available.

Quick Record remains direct for known/recent equipment. Live Route remains a read-only suggestion layer that delegates into the recording owner rather than writing completion itself.

## Product language rule

AXIS UI copy should not explain the interface, imitate an AI conversation or manufacture motivational language when the product can show the underlying fact directly.

Prefer complete, concrete statements. Avoid tutorial annotations, slogan fragments and decorative coaching. The interface should feel precise, relaxed and professional without becoming sterile or performatively minimal.

## Production topology

AXIS 8.13.1 ships one canonical browser runtime:

- `axis-core.js?v=<content hash>` — one initial JavaScript request;
- `axis-style.css?v=<content hash>` — one stylesheet;
- zero dynamic historical runtime chunks in the final canonical artifact;
- no runtime fallback to a previous public release.

`node build-release.mjs` remains the sole release build entry point. Generated truth is `axis-build.json`.

The final artifact must report:

- `version: 8.13.1`;
- `baseVersion: 8.13.1`;
- `architecture: canonical-single-runtime`;
- one initial JavaScript request and zero dynamic JavaScript requests;
- inherited training/Quick Record/Live Route/Settings/catalog gates;
- `trendsTimeField813`;
- `trendsSessionFingerprint813`;
- `trendsHorizontalScrub813`;
- `trendsEdgeSafe813`;
- `trendsReducedMotion813`;
- `trendsReadOnly813`;
- `trendsLiveProjection8131`;
- `trendsMetaActivity8131`;
- `trendsDirectCopy8131`;
- `evolutionFoundation8131`.

## Release verification

The dedicated 8.13.1 browser regression must pass on both Chromium and iPhone-like WebKit. Its core fixture reproduces the real failure class: seven same-day sealed sessions are added after boot, Trends must show seven interactive bearings, activity fingerprints must resolve from canonical metadata, and an eighth session added later must appear on return to Trends without reload.

Inherited real training flow, Live Route, Settings geometry, catalog/smart-create and repository contracts also remain required.

## Deployment contract

### Vercel

The fixed production endpoint remains `https://axis-five-puce.vercel.app`. Production is not considered sealed until `axis-build.json` serves the exact merged main SHA with `version/baseVersion: 8.13.1` and the expected canonical hashes/gates.

### EdgeOne

The `axisfitness-mirror` workflow publishes the same verified prebuilt artifact after Vercel has converged to the exact main SHA. It verifies manifest/runtime parity and runs the real 8.13.1 training + Trends flow on the runner-visible EdgeOne deployment in Chromium and iPhone WebKit.

EdgeOne project domains may still be subject to platform access/region authorization behavior. A durable mainland-facing address requires the appropriate custom-domain/access-region configuration; that is separate from artifact correctness.

## Next product boundary

8.13.1 deliberately stops before turning Evolution into a large new visible product area. The next product iteration can build on the now-testable projection to make repeated real-world activity accumulate into a distinctive personal Evolution object and, later, photo/video evidence and Replay—without requiring creator-style production work from the user.

See [PRODUCT.md](PRODUCT.md), [ARCHITECTURE.md](ARCHITECTURE.md), [ROADMAP.md](ROADMAP.md), [AXIS_EVOLUTION_VISION.md](AXIS_EVOLUTION_VISION.md) and [8.13.1_EVOLUTION_FOUNDATION.md](8.13.1_EVOLUTION_FOUNDATION.md).
