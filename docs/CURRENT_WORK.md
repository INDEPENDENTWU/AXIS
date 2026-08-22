# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and next exact action.

## Production baseline at start of this work

- **AXIS 8.17.1 — Active Truth + Capture Polish** is the last fully Production-sealed rollback baseline at the start of the 8.18 work.
- Exact sealed 8.17.1 runtime SHA: `0cd7884b83289d052ea6450a7916ca95578246f6`.
- Final 8.17.1 docs-only repository tip: `3b48e5861aa8a0341ce9561208d3347930145e81`.
- Vercel and EdgeOne both served the exact sealed revisions and passed real Chromium + iPhone WebKit Production flows.
- 8.18 may supersede this baseline only after the exact merged `main` SHA passes the same two-provider Production mirror contract.

## Active change

**AXIS 8.18 — Final Capture Polish + Object Truth / Focus seal**, branch `axis-818-final-capture-polish`, PR #78.

The 8.18 product boundary is now one coherent release rather than an isolated foundation experiment. It keeps the existing canonical app/storage/media owners and closes the remaining field issues found during real-device use.

### Object Truth + Evolution Library

- Custom equipment / sport / movement objects define their actual `metricSchema`; explicitly time-only objects do not silently regain weight, reps, sets or intensity.
- New Encounters snapshot `metricSchemaSnapshot` and `metrics`; historical Encounters remain readable without being rewritten.
- The visible custom editor remains the existing `v874` owner.
- Evolution Library / Personal Object Shelf is derived read-only from real Encounters; it creates no second persistence schema or database.

### Route Truth + Focus

- PWA foreground recovery preserves the active route and physically converges to one active main view.
- Inactive routes are `inert` / `aria-hidden`; Today-only controls cannot leak over Trends, History or other routes.
- The 8.18 Focus layer remains presentation-only and delegates completion to the existing `v87-direct-884` owner.
- Schema types that do not track sets never gain a synthetic `完成一组` action.
- v8710 remains the sole automatic sound owner.

### Capture Truth

- Normal Capture supports Photo / Scan / Video with persisted default mode and default facing preferences.
- Scan sampling remains exactly `3秒 / 5秒` and is written by the canonical app state owner.
- The final physical 3/5 control uses direct pointer/touch handling so iPhone sheet gestures cannot swallow the preference change.
- The compatibility v876 setter delegates to the app-owned direct bridge; it may not recursively click the same control to set itself.
- The read-only `拍摄视频 / 最长60秒 · 自动保存` pseudo-setting is retired. The 60-second limit remains a Capture runtime capability, not a fake Settings option.

### Front / rear camera switching

- `#v8171CameraFlip` is a real physical control before and during recording.
- One logical MediaRecorder continues to record a fixed 30fps canvas compositor while the physical camera source changes beneath it.
- Camera switching does not create a second MediaRecorder, split the logical recording, or replace the recorder track mid-record.
- On iOS devices that do not permit two camera streams to overlap, the compositor keeps the last valid frame, releases the old camera, opens the requested facing, and recovers the previous facing if acquisition fails.
- Front-camera preview is mirrored for the user; stored source pixels remain governed by the canonical compositor/source-media contract.
- An immediate Record tap after opening Capture waits for the in-flight camera acquisition instead of failing because `state.stream` has not committed yet.

### Media / watermark integrity

- `axis_v42_media` remains the only media store and `app.js` remains its owner.
- Clean `S-* / SV-*` sidecars remain source truth; canonical `F-* / V-*` remain presentation derivatives.
- Watermark processing remains source-first and v8710-owned.
- 8.18 video remains a stable 30fps compositor path; no historical 15/20fps or 720p downgrade may return.
- Encounter export/delete remains additive to the existing data model and must remove corresponding F/V + S/SV refs only when the Encounter itself is deleted.

### Release freshness

- Optional stale-shell freshness remains event-driven rather than polled.
- The final browser freshness probe is same-origin and fail-open; a provider/WebKit cache or transport error cannot become a product runtime failure.

### Native / cross-platform foundation

- The durable native handoff remains **`axis-native-foundation-0`**.
- Native repository remains **`INDEPENDENTWU/AXIS-iOS`**.
- Shared durable contracts remain **`axis.domain.v1`** and **`axis.data.v1`**.
- 8.18 web work does not replace, weaken or merge Web/iOS runtime ownership; capability differences stay behind the published platform capability and product-matrix contracts.

## Validation for this work

8.18 must not merge until all of the following are true on the exact PR head:

- deterministic canonical build and 8.18 manifest contracts pass;
- physical Settings 3秒 → 5秒 → 3秒 interaction persists and repaints correctly in Chromium and iPhone WebKit;
- the retired video pseudo-setting is absent from the visible Settings surface;
- front/rear camera flip works before recording;
- mid-record front/rear flip keeps the same MediaRecorder identity and uninterrupted logical recording state;
- immediate Record after Capture opening waits for camera readiness instead of returning false;
- iOS exclusive-camera fallback and facing recovery remain fail-safe;
- Object Truth, Route Truth, Focus, Evolution Library, source-first media and 30fps watermark contracts pass;
- inherited 8.17.1 / 8.17 / 8.16 / 8.15 / 8.14 / 8.13 behavioral gates pass under public 8.18 identity;
- historical Chromium manifest gates recognize 8.18 as a valid inheriting public release instead of failing only on a stale version allow-list;
- Repository Contract, Work Continuity and native foundation seal pass;
- no timeout inflation, assertion weakening, second database/store/recorder owner or v876 sound resurrection is used.

After merge, the exact final `main` runtime SHA must reach Vercel Production and then EdgeOne Production with exact-artifact parity. Real EdgeOne Chromium and iPhone WebKit release flows must both pass before 8.18 is called Production-sealed.

## Next planned stage

After this PR is green and the exact merged 8.18 runtime is Production-sealed, update `CURRENT_RELEASE.md` / this handoff with the final runtime SHA and provider validation record. Further Evolution Replay or larger object-first browsing work is downstream and must not be mixed into this final 8.18 capture/release seal.
