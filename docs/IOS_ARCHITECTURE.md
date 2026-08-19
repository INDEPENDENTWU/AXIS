# AXIS iOS Architecture

## Goal

Build a true native AXIS shell without disturbing the current Web product or duplicating workout truth.

The planned iOS product is not a WebView wrapper. It is a Swift/SwiftUI shell around the same domain/data contracts used to characterize Web behavior.

## Repository boundary

Target long-term repository layout:

- `INDEPENDENTWU/AXIS` — Web product and shared contract source-of-truth until a dedicated contracts package/repository becomes justified.
- `INDEPENDENTWU/AXIS-iOS` — independent native app repository and release lifecycle.

The Web production build must never depend on the iOS repository, Xcode, Swift packages or Apple signing.

## Native module shape

```text
AXISApp
  ├─ AXISDomain
  ├─ AXISData
  ├─ AXISCamera
  ├─ AXISPlatform
  ├─ AXISHealth
  ├─ AXISLiveActivity
  ├─ AXISWidgets
  └─ AXISTests
```

### AXISDomain

Pure Swift package/module.

Allowed:

- value types;
- reducers/state machines;
- deterministic projections;
- contract parsing/validation;
- domain tests.

Forbidden imports/knowledge:

- SwiftUI;
- UIKit;
- SwiftData;
- AVFoundation;
- HealthKit;
- ActivityKit;
- CloudKit;
- URLSession/provider-specific services.

Conceptual interface:

```swift
let nextState = reducer.reduce(state, event)
let projection = projector.project(nextState, context)
```

### AXISData

Owns local persistence mechanics.

Initial target:

- SwiftData for indexed/native model storage;
- append-only domain event journal for new native actions;
- compatibility snapshots for fast restore and migration;
- media references only, not large media blobs embedded in workout state.

Requirements:

- crash-safe writes;
- idempotent event application;
- deterministic restore;
- schema versioning;
- migration fixtures.

### AXISCamera

AVFoundation-based camera pipeline.

Owns capture session, frame sampling, focus/exposure and capture UX. It may request recognition through local/server adapters but does not write workout facts directly.

### AXISPlatform

Narrow adapters for:

- haptics;
- notifications;
- Photos;
- background-safe system capabilities;
- device identity where needed.

### AXISHealth

HealthKit adapter/mirror.

It may read user-authorized signals and write completed workout summaries, but AXIS activity intervals/sets/equipment/session completion remain AXISDomain facts.

### AXISLiveActivity

ActivityKit projection of an authoritative active workout.

Interactive actions dispatch domain intents/actions through the same action boundary as the in-app UI.

### AXISWidgets / App Intents

Widgets, Controls, Shortcuts, Action Button and Siri/Spotlight actions must delegate to declared domain commands. They never mutate persistence directly.

## State flow

```text
User/platform intent
       ↓
Domain action/event boundary
       ↓
AXISDomain reducer
       ↓
New domain state + effects
       ↓
AXISData commit
       ↓
Projection
       ↓
SwiftUI / Live Activity / Watch / Widget
```

No UI surface owns a parallel workout model.

## First native milestone

The first production-quality milestone is intentionally narrow:

1. launch app;
2. start workout;
3. select/recent/search equipment;
4. record strength/cardio work;
5. pause/resume/switch A→B→A;
6. finish activity;
7. finish workout;
8. force-kill/relaunch recovery;
9. history shows identical factual result;
10. all core golden fixtures match Web contract expectations.

No account, cloud dependency, subscription or Apple Watch is required for this milestone.

## Native enhancement order

After the core path is stable:

1. native camera;
2. haptic language;
3. Live Activity / Dynamic Island / Lock Screen;
4. HealthKit mirror;
5. App Intents / Controls;
6. TestFlight hardening;
7. Apple Watch;
8. optional cross-device sync;
9. optional commercial surfaces.

## Release identity

Every iOS build should expose diagnostic identity:

- semantic app version;
- build number;
- Git SHA;
- `axis.domain.v1` compatibility;
- `axis.data.v1` compatibility.

A user report must be attributable to an exact binary/source revision.

## Quality gates

Before public iOS release:

- pure domain tests pass;
- shared golden fixtures pass;
- migration/import tests pass;
- Swift concurrency warnings/errors are resolved;
- core UI tests pass in simulator;
- critical workout flow passes on real iPhone;
- kill/relaunch recovery passes;
- offline workout completion passes;
- camera/AI/HealthKit denial paths fail open;
- release archive is tied to exact Git SHA.
