# Current Release

## AXIS 8.14 — Evolution Objects

8.14 is the current Web release candidate.

It advances the 8.13.1 truthful Evolution foundation without changing the authoritative training writer or persistence model. AXIS still records reality first; 8.14 adds the first directly perceptible **Evolution Object** inside Trends so a repeated real activity can reveal its own history without becoming a dashboard, score, plan, or AI interpretation.

This file is the product/release handoff entry point. Historical version-named modules remain compiler inputs and are not reliable ownership documentation by themselves. Final generated truth remains `axis-build.json`.

## Evolution Object contract

The top-level Trends presentation owner remains `v8131-evolution-field`. 8.14 adds the narrow sub-owner `v814-evolution-objects`.

When a user expands a sealed Session and taps one of its recorded activities, the object appears **in place inside the same Trends surface**. It does not open a sheet, modal, second dashboard, or independent navigation layer.

The object may project only evidence already available in canonical records:

- stable activity identity (`equipmentId`, `exerciseId`, then recorded name fallback);
- encounter count;
- elapsed time span from first to latest encounter;
- first encounter;
- latest encounter;
- existing media-evidence count from `frameRefs` / `clipRef`;
- literal comparable change where both endpoints expose the same measurable field.

Examples of allowed literal evidence presentation are `重量 30kg → 35kg`, `总次数 30 → 36`, or a cardio duration/intensity before→after. These are not a score and do not imply that higher/lower is better.

A one-time activity must render a factual first-only state such as `第一次 · 也是最近一次`. It must not fabricate progress, trend, trajectory quality, or a missing previous encounter.

The 8.14 owner must not generate evaluative copy such as `进步`, `提升`, `改善`, `更好`, `评分` or `分数`.

## 8.13.1 Evolution foundation inheritance

8.14 inherits and must preserve all 8.13.1 guarantees:

- sealed Sessions project into the Trends time field;
- same-day Sessions remain distinct;
- activity evidence resolves from embedded event activity first, then canonical `axis_v8_meta.events[eventId].activity` fallback;
- session-end evidence, activity intervals, continuity and fingerprints use the same resolved activity evidence;
- sub-minute sealed Sessions remain truthful as `<1分钟` rather than being fabricated as one minute;
- `axis:state-changed`, storage events, navigation re-entry and `pageshow` keep the projection fresh;
- horizontal scrub, Safari edge safety and reduced-motion behavior remain intact;
- `window.__AXIS_EVOLUTION__` remains read-only.

## Ownership / data contract

8.14 adds no new canonical data writer.

- `app.js` and the inherited recording owners remain authoritative for workout/session state.
- `axis_v60_state` remains existing training/session storage.
- `axis_v8_meta` remains existing metadata/activity evidence storage.
- `v814-evolution-objects` reads those records but never calls `localStorage.setItem` or `sessionStorage.setItem`.
- No new persistence schema is introduced.
- No network request is required to resolve or open an Evolution Object.
- No AI service is required or invoked by the object owner.
- No polling, MutationObserver, ResizeObserver, or persistent timer is introduced by the object owner.
- 8.14 does not own training completion, Quick Record, Live Route, Settings, media persistence, sound, camera/watermark, or Learning.
- Replay / generated video is explicitly deferred.

## Training-flow inheritance

The reliable training contracts from 8.12.4 / 8.12.5 remain release-blocking:

- real activity intervals are preferred timing evidence;
- session effective training time is the union of activity intervals;
- project-gap timing starts from the latest real activity boundary;
- total-workout completion seals remaining activity state before archival;
- Quick Record Recent items remain direct actions;
- custom/native/historical equipment identity remains stable;
- Group Plan remains an atomic recording-owner transaction;
- Live Route remains read-only and deviation-safe;
- Settings geometry and the personal-equipment/photo/search contracts remain inherited;
- local recording remains functional when AI/network is unavailable.

## Learning / Cloud & AI inheritance

Learning remains independent of training ownership. The simplified practice surface, Language Studio corpus, local-first behavior, no required autoplay/upload, and existing Cloud/AI explicit-user-check semantics are inherited unchanged.

Evolution Objects do not consume Learning state, Cloud/AI settings, or remote AI output.

## Production topology

AXIS 8.14 ships one canonical browser runtime:

- `axis-core.js?v=<content hash>` — one initial JavaScript request;
- `axis-style.css?v=<content hash>` — one stylesheet;
- zero dynamic historical runtime chunks;
- no runtime fallback to a previous public release.

`node build-release.mjs` is the sole release build entry point.

The final artifact must report at least:

- `version: 8.14`;
- `baseVersion: 8.14`;
- architecture `canonical-single-runtime`;
- one initial JavaScript request and zero dynamic JavaScript requests;
- inherited 8.13.1 Evolution gates including `trendsMetaActivity8131`, `trendsNavigationRefresh8131`, and `trendsTruthfulDuration8131`;
- `evolutionObjects814`;
- `evolutionObjectFirstLatest814`;
- `evolutionObjectEncounterCount814`;
- `evolutionObjectFactualDelta814`;
- `evolutionObjectMediaEvidence814`;
- `evolutionObjectReadOnly814`;
- `evolutionObjectNoNetwork814`;
- `evolutionObjectInPlace814`;
- `axis814.trends.topLevelOwner = v8131-evolution-field`;
- `axis814.trends.objectOwner = v814-evolution-objects`;
- `axis814.ownership.persistence/network/ai = false`.

## Browser release gate

A candidate is incomplete until Chromium and iPhone WebKit both prove:

1. inherited 8.13.1 metadata-only Evolution behavior still passes;
2. a repeated stable item resolves all real encounters and correct first/latest evidence;
3. the encounter trail retains every seeded encounter, including same-day distinctions;
4. media evidence is counted from existing references only;
5. first-only items do not fabricate before/after change;
6. the interaction opens in place and does not open a sheet;
7. `axis_v60_state` and `axis_v8_meta` are byte-for-byte unchanged by object interaction;
8. no AXIS API request occurs after Evolution Object interaction begins;
9. mobile geometry does not introduce horizontal overflow;
10. reduced-motion mode preserves functionality.

All inherited Runtime, recording, Group Plan, Live Route, Settings, catalog, smart-create, repository and work-continuity gates remain required.

## Deployment contract

### Vercel

The fixed production endpoint remains `https://axis-five-puce.vercel.app`. 8.14 is not sealed until that endpoint reports `READY` for the exact merged `main` SHA and anonymously serves an `axis-build.json` whose `sourceCommit` exactly equals that SHA, with `8.14 / 8.14`, canonical hashes/topology, `axis814`, and all required 8.14 gates.

### EdgeOne Makers

The `axisfitness-mirror` project remains a production mirror of the exact verified Vercel artifact. The main-branch workflow must:

1. build and verify the exact 8.14 prebuilt artifact;
2. wait for Vercel Production to expose the same exact main SHA;
3. require local/Vercel canonical manifest and asset parity;
4. deploy the prebuilt artifact to EdgeOne Production;
5. verify the authenticated EdgeOne manifest and Vercel API parity;
6. run real EdgeOne Chromium and iPhone WebKit flows for inherited 8.12.4 training, 8.13.1 Evolution foundation and 8.14 Evolution Objects;
7. publish `EdgeOne Production` success only after those checks pass.

EdgeOne project/deployment domains can still be subject to region/authentication behavior. Durable mainland user access is a custom-domain/access-region concern separate from artifact correctness.

## Product behavior to preserve

- Recording reality remains easier than maintaining an abstract system.
- A workout can be recorded and finished offline.
- AI/network failure never blocks manual/local recording.
- Existing LocalStorage and IndexedDB history remains readable.
- User activity, not recommendation compliance, remains factual workout truth.
- Evolution is derived from encounters; it does not become a user-authored database.
- Literal evidence must not silently become a performance score.
- Training and Language Studio remain independent ownership domains.

## Current architecture debt

Continue reducing rather than extending:

- long exact-signature `prepare-*` compatibility transforms;
- historical modules remaining executable compiler inputs after current owners retire;
- release truth that is easier to understand in generated artifacts than source;
- duplicated current-version allowlists across historical CI workflows;
- tool versions distributed across workflows rather than one dependency manifest.

See [PRODUCT.md](PRODUCT.md), [ARCHITECTURE.md](ARCHITECTURE.md), [CURRENT_WORK.md](CURRENT_WORK.md), [AXIS_EVOLUTION_VISION.md](AXIS_EVOLUTION_VISION.md) and [ROADMAP.md](ROADMAP.md).
