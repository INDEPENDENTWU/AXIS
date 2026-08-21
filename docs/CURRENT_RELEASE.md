# Current Release

## AXIS 8.16 — Capture Field + Comparative Evidence

8.16 is the current Web release candidate.

It starts from the production-sealed 8.15.1 regression baseline and strengthens both ends of the Evolution loop without adding a new data owner: **Capture becomes a deliberate evidence field**, while Trends can compare more than only the first and latest visual Encounter.

Historical version-named modules remain compiler inputs. Final generated truth remains `axis-build.json`.

## Product position

AXIS is a **Personal Evolution Engine**.

The long-term loop remains:

`Capture / 留下` → truthful Encounter → time accumulation → `Reveal / 发现` → Evolution → later truthful Replay.

8.16 deliberately does **not** ship Replay yet. Capture density, Encounter identity, media binding and comparison semantics are sealed first so later Replay can only be assembled from truthful evidence.

## 8.16 Capture Field contract

The visible Capture surface is `v816-capture-field`, but existing `app.js` remains the sole canonical camera, MediaRecorder and IndexedDB persistence owner.

The same Capture Field is used by normal **拍摄记录** and Quick Record supplemental capture.

### Photos

- one Encounter may hold at most **12 photos**;
- photos may be captured/imported repeatedly into one transient draft before save;
- the draft rail exposes the real captured photos and allows deletion before commit;
- choosing a cover reorders a real draft photo to `frameRefs[0]`;
- no cover field or new event schema is introduced;
- the existing multi-photo `frameRefs[]` schema remains authoritative.

### Scan

The inherited short scan remains available and uses the existing persisted scan preference. It adds real sampled frames into the same 8.16 draft and respects the 12-photo bound.

### Video

- one explicit short video may be attached to one Encounter;
- the hard maximum is **60 seconds**;
- the recorder automatically stops at the 60-second boundary;
- the existing `clipRef` schema remains authoritative;
- 8.16 records video without audio, avoiding a new microphone permission/recorder ownership surface;
- video never autoplays in evidence views.

### Capture ownership

8.16 adds no second camera lifecycle, recorder, database or persistence format.

- camera owner: `app.js`;
- MediaRecorder owner: `app.js`;
- media persistence owner: `app.js`;
- existing database: `axis_v42_media`;
- existing event media schema: `frameRefs[]` + `clipRef`;
- no `axis_v816_*` media store;
- no new LocalStorage schema;
- no upload requirement;
- no AI requirement;
- closing/hiding the capture surface safely terminates an active draft recording.

## Comparative Evidence contract

`v815-media-evidence` remains the read-only Media Evidence owner. 8.16 expands its comparison semantics without creating a new persistence/network owner.

The user may compare **any two real photo-bearing Encounters** from the same Evolution Object.

Available presets are:

- endpoints — earliest ↔ latest;
- recent — the most recent two;
- adjacent — a neighboring pair.

Arbitrary comparison is explicit: the user first chooses the left or right comparison slot, then chooses another real Encounter from the evidence rail. A normal Encounter tap still means inspect that Encounter and is not hijacked by comparison mode.

Endpoint labels remain factual (`最早影像`, `最近影像`) only when the selected evidence is actually an endpoint. Other selections use real Encounter positions such as `第2次` or `第4次`.

Comparison remains factual and may not emit `进步 / 提升 / 改善 / 更好 / 评分 / 分数` verdicts.

## 8.15.1 regression inheritance

8.16 preserves the complete 8.15.1 seal:

- no historical Home semantic flash before canonical Home state resolves;
- `v8710-watermark` remains the sole saved-photo watermark compositor;
- historical centered AXIS raster/divider stays retired;
- the factual `AXIS / RECORD` card remains current;
- Media Evidence swaps remain stable in place;
- the previous visual remains until the next local media asset is ready;
- loading does not intentionally dim the stage or expose another page/sheet layer.

## Earlier Evolution inheritance

8.16 preserves:

- 8.13.1 truthful sealed Sessions, canonical activity metadata fallback, same-day distinctness, truthful `<1分钟`, lifecycle/navigation refresh and read-only Trends ownership;
- 8.14 Evolution Objects with encounter count, time span, first/latest Encounter, literal comparable facts and no interpretive score;
- 8.15 Encounter-bound photo/video evidence, read-only local media access, no autoplay, no creator workflow and complete data-only Evolution when media is absent.

All reliable training, Quick Record, Group Plan, Live Route, Settings, catalog, custom-equipment and Learning ownership contracts remain release-blocking.

## Production topology

AXIS 8.16 must ship as one canonical browser runtime:

- one `axis-core.js?v=<content hash>` request;
- one `axis-style.css?v=<content hash>` request;
- zero dynamic historical JavaScript chunks;
- architecture `canonical-single-runtime`;
- `version: 8.16`;
- `baseVersion: 8.16`.

`node build-release.mjs` is the sole release build entry point.

The final manifest must include the 8.16 gates for unified Capture, multi-photo bounds, cover reorder, <=60s single-recorder video, existing media-store ownership, Quick Record convergence, arbitrary comparative evidence, comparison presets, stable evidence swapping, factual-only semantics and Replay deferral.

`axis816` must identify:

- Capture surface `v816-capture-field`;
- camera/persistence owner `app.js`;
- media store `axis_v42_media`;
- photo max 12;
- one video max 60 seconds;
- no new storage/schema;
- evidence mode `arbitrary-two-point`;
- presets `ends / recent / adjacent`;
- no new training-state, persistence, network, AI or recorder owner;
- Replay false.

## Browser release gate

A candidate is incomplete until Chromium and iPhone WebKit both prove the real 8.16 behavior:

1. canonical 8.16 boot and Capture ownership markers;
2. the same Capture Field opens from the normal record route and Quick Record supplement route;
3. multiple photos accumulate in one draft and never exceed 12;
4. a real draft photo can become the cover by safe reorder;
5. draft photos can be removed without corrupting the remaining draft;
6. explicit video starts/stops through the one canonical recorder and remains <=60 seconds;
7. saved media persists only through existing `frameRefs[]`, `clipRef` and `axis_v42_media`;
8. review/evidence videos never autoplay;
9. four photo-bearing Encounters can perform endpoint, recent and arbitrary two-point comparison;
10. ordinary Encounter inspection still works after comparison;
11. Comparative Evidence mutates no training/metadata storage and calls no AXIS API;
12. Capture and Evidence remain mobile-safe and reduced-motion-safe;
13. all inherited 8.15.1, 8.15, 8.14, 8.13.1 and training/runtime gates remain green.

## Deployment contract

### Vercel

The fixed production endpoint remains `https://axis-five-puce.vercel.app`.

8.16 is not sealed until Vercel Production is `READY` for the exact merged `main` SHA and anonymously serves `/axis-build.json` with:

- `sourceCommit` equal to that exact SHA;
- `8.16 / 8.16`;
- `canonical-single-runtime`;
- all required inherited and 8.16 gates.

### EdgeOne Makers

The `axisfitness-mirror` project remains a mirror of the exact verified Vercel artifact. The main workflow must:

1. build/verify the exact 8.16 artifact;
2. wait for Vercel Production to expose the same exact main SHA and `8.16 / 8.16`;
3. require local/Vercel canonical artifact parity;
4. deploy the exact prebuilt artifact to EdgeOne Production;
5. verify authenticated EdgeOne/Vercel API parity;
6. run real EdgeOne Chromium and iPhone WebKit flows including the 8.16 Capture + Comparative Evidence smoke;
7. publish `EdgeOne Production` success only after every release flow passes.

## Next product stage

Replay remains downstream of truthful Capture and comparison semantics. The next stage may begin exploring a restrained private Replay only after 8.16 is production-sealed. It must use real Encounter-bound evidence, preserve dates/data/identity and refuse fabricated continuity when evidence is insufficient.

## Product behavior to preserve

- recording reality remains easier than maintaining an abstract system;
- a workout can be recorded and finished offline;
- AI/network failure never blocks local/manual recording;
- existing LocalStorage and IndexedDB history remains readable;
- media is optional evidence of time, not creator homework;
- literal evidence does not silently become a score;
- no social feed, ranking, publishing workflow or motivational-content pressure;
- Reveal is derived from truthful Encounters rather than invented history.

See [PRODUCT.md](PRODUCT.md), [ARCHITECTURE.md](ARCHITECTURE.md), [CURRENT_WORK.md](CURRENT_WORK.md), [AXIS_EVOLUTION_VISION.md](AXIS_EVOLUTION_VISION.md) and [ROADMAP.md](ROADMAP.md).
