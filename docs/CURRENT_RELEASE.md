# Current Release

## AXIS 8.12.4

8.12.4 is the current release candidate.

It is a controlled training-flow reliability release over the complete 8.12.3 surface. Personal equipment photos and visual memory, Group Plan, Learning simplification, Cloud/AI, Training Report, camera/watermark, Language Studio and the canonical single-runtime topology remain inherited. The new boundary corrects workout time semantics, makes Recent Quick Record genuinely direct, makes the read-only `接下来` route actionable, fixes the total-workout start/end fact, and restores Learning / Cloud & AI to the exact native Settings row geometry.

This file is the product/release handoff entry point. Historical version-named source modules remain compiler inputs and are not a reliable description of current ownership by themselves.

## 8.12.4 training time contract

Real activity intervals are the preferred source of truth.

- Each equipment/exercise activity can contain one or more `{start,end}` intervals.
- Pausing closes the current interval; resuming opens a new interval.
- Switching away from an incomplete strength item pauses it.
- Switching away from a strength item whose complete planned set count has been reached finishes that item at the switch boundary.
- Switching away from cardio pauses it unless the user explicitly finishes it.
- A project's effective duration is the sum of its real active intervals.
- Session effective training time is the union of real activity intervals, so overlapping or interleaved items are never double-counted.
- Session blank time is the uncovered time inside the real session span.
- Legacy `doneAt` / duration heuristics are fallback evidence only when old records have no activity intervals.

`项目间歇` means time since the latest real activity boundary while no item is active. It must not be derived from event insertion order. For A → B → A, after the final A ends, the interval begins at final A's real end, not B's earlier end.

Total-workout completion seals remaining activity lifecycle state before archiving the session. The archived session preserves/reconstructs its real start and end evidence from the stored session and activity intervals. Home completion displays distinct factual `开始 HH:MM` and `完成 HH:MM` values when the workout actually spans different times.

## Quick Record contract

Recent items are direct actions.

- Tapping a Recent equipment/exercise resolves its existing canonical, custom, extended-library, or historical `equipmentId` identity.
- A resolved Recent item opens the existing Quick editor directly.
- It must not visibly detour through the full `器械 / 运动` catalog merely to reconfirm an item the user already selected.
- The full catalog remains available from `其他器械 / 运动` when the user actually wants to browse/search.
- Historical identity fallback may restore a known item before the extended library has hydrated, but it does not create a duplicate custom item.

## `接下来` / Live Route contract

AXIS 8.13 Stage 3 Live Route remains a read-only projection layer embedded in the current 8.12.4 product.

- `接下来` may suggest future equipment/exercises based on actual history, current activity, recency, adjacency and available time evidence.
- A suggestion is not a mandatory workout plan.
- Ignoring or replacing a suggestion has no penalty and does not mark the workout as wrong or incomplete.
- The next projection recalculates from what the user actually records.
- Tapping a suggestion delegates into the same Quick Record path for that item.
- Merely tapping a suggestion does not write workout state, storage state, completion state or network state; the user's explicit record/save action remains authoritative.
- Live Route remains `recordingOwner:false`, `storageOwner:false`, `networkOwner:false`.

Future AI assistance may enrich recommendation evidence, but factual training state must continue to come from actual user records rather than recommendation compliance.

## Settings geometry contract

`学习安排` and `云端与AI` remain inline folds in the one canonical Settings sheet, but their visible entry row must use the same native geometry as neighboring Settings entries:

- same row height / minimum height;
- same vertical text center;
- same vertical chevron center;
- same left text column and right chevron column;
- no independent vertical nudge or alternate 64px/54px gate rhythm.

The dedicated 8.12.4 browser gate compares row height, text center-Y and chevron center-Y to `#profileBtn` within 0.5 CSS px in Chromium and iPhone-like WebKit.

The 8.12.3 divider-free rules remain: `学习安排`, `云端与AI`, `提醒与声音`, and `训练报告` do not regain the retired requested separators.

## Personal equipment and Group Plan inheritance

The 8.12.3 personal equipment layer remains intact:

- native/custom IDs remain authoritative;
- historical event `equipmentId` relationships are preserved;
- dedicated equipment photos use the existing `axis_v42_media` IndexedDB owner;
- `profile.equipmentPhotos` stores references/metadata rather than blobs;
- confirmed equipment photos may feed the existing `profile.memories` visual-recognition owner;
- personal-library removal preserves workout history;
- cover selection and dedicated photo deletion do not mutate historical training frames.

Group Plan remains committed atomically through `window.__AXIS_RECORDING__` / the v61 recording owner. Repeated open/reopen after set-count, weight or reps changes remains an inherited release-blocking path.

## Learning / Cloud & AI inheritance

Learning retains the 8.12.3 simplified user-facing practice surface:

- primary decisions: `目标`, `强度`, `难度`, `对话深度`;
- retired current selector: `学法`;
- practice actions: `听原声`, `录音`, `听我的`;
- no current `跟读`, `影子`, shadow auto-record or A/B comparison surface;
- no autoplay, audio upload or training-state ownership.

8.12 Language Studio content remains inherited: 25,716 available units, 4/8/12-turn dialogue depths, local-first operation and no required training owner.

Cloud/AI retains the existing local-first Settings ownership and explicit user-invoked service checks. The EdgeOne mirror includes matching `ai-capabilities` and `cloud-status` function surfaces without publishing secret-shaped fields.

## Production topology

AXIS 8.12.4 ships one canonical browser runtime:

- `axis-core.js?v=<content hash>` — one initial JavaScript request;
- `axis-style.css?v=<content hash>` — one stylesheet;
- zero dynamic historical runtime chunks;
- no runtime fallback to a previous public release.

`node build-release.mjs` is the sole release build entry point. Final generated truth is `axis-build.json`.

The final artifact must report:

- `version: 8.12.4`;
- `baseVersion: 8.12.4`;
- architecture `canonical-single-runtime`;
- one initial JavaScript request and zero dynamic JavaScript requests;
- all inherited 8.12.3 personal-equipment, Group Plan, Learning and Settings gates;
- `trainingIntervalUnion8124`;
- `projectGapLatestActivity8124`;
- `sessionStartEndBounds8124`;
- `sessionActivitySeal8124`;
- `quickRecordDirectRecent8124`;
- `liveRouteActionDelegate8124`;
- `liveRouteDeviationSafe8124`;
- `settingsVerticalNative8124`.

## Deployment contract

### Vercel

The fixed production endpoint remains `https://axis-five-puce.vercel.app`. A release is not sealed until that endpoint anonymously serves the exact merged source SHA, 8.12.4 manifest, canonical runtime marker and immutable asset hashes, then passes the Production browser gate including the dedicated 8.12.4 real-flow smoke.

### EdgeOne Makers

The existing `axisfitness-mirror` EdgeOne project is a production mirror of the exact verified Vercel artifact. The main-branch deployment workflow:

1. builds and verifies the exact canonical 8.12.4 artifact;
2. waits for the fixed Vercel Production endpoint to serve the same main SHA;
3. requires core/CSS/runtime-hash/request-topology parity;
4. publishes the already-verified artifact to EdgeOne rather than rebuilding product runtime independently;
5. verifies the authenticated deployment manifest and API parity;
6. runs the real 8.12.4 flow in Chromium and iPhone WebKit from the EdgeOne deployment where the runner can access the project domain.

EdgeOne project/deployment domains are not represented as permanent anonymous mainland URLs. EdgeOne's platform access rules can return 401 for project domains in mainland networks or after preview authorization expiry. Durable user-facing access therefore requires an appropriate EdgeOne custom domain/access-region configuration; that platform/domain requirement is separate from whether the AXIS artifact deployed successfully.

## Current product behavior to preserve

- A workout can be recorded and finished offline.
- AI or network failure never blocks manual/local recording.
- Existing LocalStorage and IndexedDB history remains readable.
- User activity, not recommendation compliance, is factual workout truth.
- A route suggestion never becomes a training-state write until the user explicitly records/saves.
- Quick Recent stays direct; full catalog browsing remains explicit.
- Project/session timing must remain interval-based where interval evidence exists.
- Settings/learning may not acquire training ownership.
- Training and Language Studio remain independent ownership domains.

## Release verification

A candidate is incomplete until the exact PR head passes the dedicated 8.12.4 Chromium + iPhone WebKit flow gate and relevant inherited product/repository contracts. Production correctness is separately verified after merge on the exact deployed SHA for Vercel, and the EdgeOne production mirror must then match that canonical artifact.

## Current architecture debt

Known debt to reduce rather than extend:

- long exact-signature `prepare-*` compatibility transforms;
- historical modules remaining as executable compiler inputs after current owners retire;
- release truth that is easier to understand in the generated artifact than in source;
- tool versions distributed across workflows rather than one dependency manifest.

These are migration targets, not reasons for an unrelated rewrite.

See [PRODUCT.md](PRODUCT.md), [ARCHITECTURE.md](ARCHITECTURE.md), [CURRENT_WORK.md](CURRENT_WORK.md) and [ROADMAP.md](ROADMAP.md).
