# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and next exact action.

## Production baseline at start of this work

- **AXIS 8.17.1 — Active Truth + Capture Polish is Production-sealed.**
- Exact sealed runtime SHA: `0cd7884b83289d052ea6450a7916ca95578246f6`.
- Final docs-only sealed repository tip before 8.18 work: `3b48e5861aa8a0341ce9561208d3347930145e81`.
- Vercel and EdgeOne both served the exact sealed revisions and passed real Chromium + iPhone WebKit Production flows.
- 8.17.1 remains the rollback-safe Production baseline while 8.18 is developed on a branch.

## Active change

**AXIS 8.18 — Object Truth + Focus Foundation**, branch `axis-818-object-focus-foundation`.

8.18 is not being implemented as a new isolated screen over unstable legacy assumptions. The first convergence closes three truth boundaries before the larger Evolution Library surface expands:

1. **Object Truth** — the object itself defines what is recorded;
2. **Route Truth** — one visible app route owns interaction after PWA resume;
3. **Capture Truth** — Photo / Scan / Video / facing / watermark / export remain one canonical capture lifecycle.

### Object Metric Schema

The historical `strength → weight/reps/sets` and `cardio → duration/intensity` split may not override an explicitly configured custom object.

A custom equipment / sport / movement / future object owns an explicit `metricSchema`: weight, reps, sets, duration, intensity, distance, resistance/level, pace/speed, hold time, or user-defined attributes.

If a user creates `靠墙站立` and selects only `时间`, future recording surfaces must not silently restore weight, reps or intensity.

Each new Encounter snapshots the schema into `metricSchemaSnapshot` and saves values in `metrics`. Historical Encounters keep their own snapshot when the object definition is edited later. Legacy Encounters remain readable, and the pre-8.18 `axis_v8124_custom_profiles` recording profile is migration input rather than a competing owner.

The canonical visible custom editor remains `v874`; 8.18 extends that owner instead of reviving retired v873/v876 duplicate custom editors.

### PWA Route Truth

Installed-web-app foreground recovery preserves the route that was visible before backgrounding. The active navigation target is authoritative if stale DOM state contains more than one `.view.active`. Route reconciliation physically leaves exactly one main view active. When Trends / History / another route is active, Today/Home Capture controls may not reappear over it. Inactive pages become `inert` and `aria-hidden`; Today-only dock/active layers are physically hidden and non-interactive; `pageshow`, `visibilitychange` and focus reassert the current route instead of defaulting Home. No new route persistence store is introduced.

### Capture preference model

`记录偏好` must match the real Capture Field rather than exposing Scan sampling as if it were the whole camera model:

- default Capture entry: `上次 / 照片 / 扫描 / 视频`;
- Scan sampling remains `3秒 / 5秒`;
- default camera: `上次 / 后置 / 前置`;
- first-ever fallback remains Photo + rear camera;
- Quick Record continues to delegate to the same canonical Capture owner.

### Camera / video convergence

The historical video path recorded directly from the physical camera stream and the old export compositor re-encoded at 20fps. 8.18 foundation records one logical video from a stable 30fps canvas stream. The physical `#cameraVideo` input may change from rear to front while the compositor stream remains stable, avoiding independent-blob concatenation or unsafe MediaRecorder track replacement.

The clean `SV-*` source remains the source-of-truth sidecar; `V-*` remains the presentation derivative. The final watermark path must not downgrade that 30fps source through a historical compositor.

### Watermark convergence

The watermark preview already shows a central AXIS brand, but 8.15.1 intentionally removed that physical center brand from saved photos. 8.18 intentionally supersedes that presentation decision while preserving the 8.15.1 single-compositor ownership rule.

- physical watermark owner remains `v8710-watermark`;
- clean source remains untouched;
- requested derivatives restore central `AXIS` controlled by configured opacity;
- old v85/v876/v877 physical watermark painters remain retired;
- video must use the same current design contract rather than an older watermark generation.

### Media export + Encounter deletion

An Encounter may contain multiple photos and one video. Detail export exposes independent `保存照片`, `保存视频`, and `保存全部` actions when relevant. Multi-file export uses browser file sharing when supported with a safe download fallback; it never mutates the Encounter.

A completed/sealed Encounter may be deleted independently. Deletion removes its event data, event-meta record, canonical `F/V` media and clean `S/SV` sidecars, then refreshes derived Timeline / History / Trends / Evolution state. A currently running item may not be silently deleted.

### Active Focus Layer

The existing `v87-direct-884` active-control owner remains canonical. 8.18 adds a presentation-only Focus Layer which never auto-opens. Running/remaining/rest timing becomes visually dominant; normal `完成一组` tap remains; a deliberate press-and-hold completion affordance delegates back to the canonical `#v87Primary` action. Object schemas that do not track sets must not gain a synthetic `完成一组` action merely because their historical type is `strength`. Estimated time remains a reminder only and never completes an item. v8710 remains the sole automatic sound owner.

### Evolution Library / Personal Object Shelf

8.18 starts the Object Shelf as a read-only projection over real Encounters. It creates no duplicate object records or persistence schema. Objects are derived by stable identity and factual recurrence, recency and real media density. Replay/editor scope remains downstream.

## Native / cross-platform foundation remains authoritative

The existing native foundation is not replaced by 8.18 web product work. The durable handoff remains **`axis-native-foundation-0`**, with the native repository **`INDEPENDENTWU/AXIS-iOS`** consuming the shared contracts **`axis.domain.v1`** and **`axis.data.v1`**. Web/iOS capability differences stay isolated behind the published platform capability and product-matrix contracts.

**Chat history is not authoritative project memory.** Repository contracts, ADRs, `CURRENT_RELEASE.md`, this file, and the shared contract artifacts remain the durable engineering source of truth.

## Validation for this work

8.18 must not merge until:

- deterministic canonical build succeeds;
- Object Metric Schema persistence + event snapshot behavior passes;
- a time-only custom object never renders or persists hidden legacy metrics as canonical truth;
- PWA background/foreground route regression passes, including deliberately duplicated stale active-view classes;
- Capture default-mode / Scan / facing preferences remain one app-owned model and actually affect the next Capture opening;
- front/rear switching works before recording and the compositor stays logically continuous during recording;
- photo/video/all export behavior passes;
- completed Encounter deletion removes F/V + S/SV and no unrelated data;
- current central AXIS watermark is present only on requested derivatives;
- watermarked video does not fall back to the historical low-frame-rate compositor;
- Chromium + iPhone WebKit pass new 8.18 smoke plus inherited 8.17 / 8.16 / 8.15.1 gates;
- Repository Contract, Work Continuity and native foundation seal pass;
- no timeout inflation, assertion weakening, second persistence owner, second recorder owner or v876 sound resurrection is used.

Only after merge does the exact final `main` SHA go through Vercel parity, EdgeOne exact prebuilt deployment, live API parity, real EdgeOne Chromium and iPhone WebKit Production flows.

## Next planned stage

After Object Truth, Route Truth and Capture Truth are sealed, continue expanding **AXIS 8.18 — Evolution Library / Personal Object Shelf** with object-first browsing at hundreds or thousands of Encounters. Evidence Sequence can then build on the stable media/camera compositor. Truthful Evolution Replay remains downstream rather than being pulled into this foundation.
