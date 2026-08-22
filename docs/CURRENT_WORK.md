# AXIS Current Work

> Canonical engineering handoff. `CURRENT_RELEASE.md` is the release contract; this file records the active engineering boundary and next exact action.

## Production baseline

- **AXIS 8.17.1 — Active Truth + Capture Polish is Production-sealed.**
- Exact sealed runtime SHA: `0cd7884b83289d052ea6450a7916ca95578246f6`.
- Final docs-only sealed repository tip before 8.18 work: `3b48e5861aa8a0341ce9561208d3347930145e81`.
- Vercel and EdgeOne both served the exact sealed revisions and passed real Chromium + iPhone WebKit Production flows.
- 8.17.1 remains the rollback-safe Production baseline while 8.18 is developed on a branch.

## Active branch — AXIS 8.18 Object + Focus Foundation

Branch: `axis-818-object-focus-foundation`.

8.18 is not being implemented as a new isolated screen over unstable legacy assumptions. The first convergence closes three truth boundaries before the larger Evolution Library surface expands:

1. **Object Truth** — the object itself defines what is recorded;
2. **Route Truth** — one visible app route owns interaction after PWA resume;
3. **Capture Truth** — Photo / Scan / Video / facing / watermark / export remain one canonical capture lifecycle.

## Object Metric Schema

The historical `strength → weight/reps/sets` and `cardio → duration/intensity` split is no longer allowed to override an explicitly configured custom object.

A custom equipment / sport / movement / future object owns an explicit `metricSchema` such as:

- weight;
- reps;
- sets;
- duration;
- intensity;
- distance;
- resistance / level;
- pace / speed;
- hold time;
- custom numeric/text attributes.

If a user creates `靠墙站立` and selects only `时间`, future recording surfaces must not silently restore weight, reps or intensity.

Each new Encounter snapshots the schema into `metricSchemaSnapshot` and saves the values in `metrics`. Historical Encounters keep their own snapshot when the object definition is later edited. Legacy records without snapshots remain readable through the old fields as compatibility fallback.

The canonical visible custom editor remains `v874`; 8.18 extends that owner instead of reviving the retired v873/v876 duplicate custom editors.

## PWA Route Truth

Installed-web-app foreground recovery must preserve the route that was visible before backgrounding.

When Trends / History / another route is active:

- Today/Home Capture controls may not reappear over it;
- inactive pages become `inert` and `aria-hidden`;
- Today-only dock / active card layers are physically hidden and non-interactive;
- `pageshow`, `visibilitychange` and window focus reassert the same route instead of defaulting to Home.

No new route persistence store is introduced.

## Capture preference model

`记录偏好` now needs to match the real 8.17+ Capture Field rather than exposing Scan sampling as if it were the entire camera model.

8.18 foundation adds:

- default Capture entry: `上次 / 照片 / 扫描 / 视频`;
- Scan sampling remains `3秒 / 5秒`;
- default camera: `上次 / 后置 / 前置`;
- first-ever fallback remains Photo + rear camera;
- Quick Record continues to delegate to the same canonical Capture owner.

No second camera, recorder or media database is introduced.

## Camera / video convergence

The historical video path recorded directly from the physical camera stream and the old exported watermark path re-encoded at 20fps. That cannot provide a reliable mid-record camera switch and is a likely source of visibly uneven saved video.

8.18 foundation records one logical video from a stable canvas stream at 30fps. The physical `#cameraVideo` input may change from rear to front while that compositor stream remains stable, so switching does not require concatenating independent video blobs or swapping the MediaRecorder source track underneath the recorder.

The clean `SV-*` source remains the source-of-truth sidecar; `V-*` remains the presentation derivative.

## Watermark convergence

The user-facing watermark preview already shows a central AXIS brand, but 8.15.1 intentionally removed the physical center brand from saved photos. 8.18 intentionally supersedes that presentation decision while preserving the 8.15.1 single-compositor ownership rule.

- physical watermark owner remains `v8710-watermark`;
- clean source remains untouched;
- saved watermarked media restores the central `AXIS` brand controlled by the configured brand opacity;
- old v85/v876/v877 physical watermark painters remain retired.

Video must use the same current design contract rather than an older watermark generation.

## Media export + Encounter deletion

An Encounter may contain multiple photos and one video. Detail export now has independent actions for:

- save photos;
- save video;
- save all media together when both exist.

Multi-file export uses the browser file-share capability when available and safe file-download fallback otherwise. Export never mutates the Encounter.

A completed/sealed Encounter may also be deleted independently. Deletion removes the Encounter, its event-meta record, canonical `F/V` media and clean `S/SV` sidecars, then refreshes derived Timeline / History / Trends / Evolution state. A currently running item may not be silently deleted.

## Active Focus Layer

The existing `v87-direct-884` active-control owner remains canonical. 8.18 adds a presentation-only Focus Layer:

- never auto-opens;
- tapping the active timing area may enter a full-screen focus view;
- running / remaining / rest timing is visually dominant;
- normal `完成一组` tap remains available;
- a deliberate press-and-hold completion affordance is available as a lower-misfire alternative;
- completion delegates back to the existing canonical `#v87Primary` action;
- reaching estimated time remains a reminder only and never completes an item;
- v8710 remains the sole automatic sound owner.

## Evolution Library / Personal Object Shelf

8.18 starts the Object Shelf as a read-only projection over real Encounters. It does not create duplicate object records or another persistence schema.

Objects are derived by stable equipment/object identity and expose factual recurrence, recency and real media density. This is the foundation for a richer object-first library after Object Truth and Capture Truth pass regression gates.

Replay/editor scope remains downstream.

## Validation boundary

8.18 must not merge until all of the following are true:

- deterministic canonical build succeeds;
- Object Metric Schema persistence + event snapshot behavior passes;
- time-only custom object never renders hidden legacy metrics as canonical truth;
- PWA background/foreground route regression passes;
- Capture default-mode / Scan / facing preferences remain one app-owned model;
- front/rear switching works before recording and the compositor path stays logically continuous during recording;
- photo/video/all export behavior passes;
- completed Encounter deletion removes F/V + S/SV and no unrelated data;
- current central AXIS watermark is present only on requested derivatives;
- Chromium + iPhone WebKit pass new 8.18 smoke plus inherited 8.17 / 8.16 / 8.15.1 gates;
- Repository Contract and Work Continuity pass;
- no timeout inflation, assertion weakening, second persistence owner, second recorder owner or v876 sound resurrection is used.

Only after merge does the exact final `main` SHA go through Vercel parity, EdgeOne exact prebuilt deployment, live API parity, real EdgeOne Chromium and iPhone WebKit Production flows.
