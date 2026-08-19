# AXIS Platform Contract v1

## Purpose

AXIS product truth must survive multiple shells without forking. Platform code supplies capabilities; it does not redefine workout semantics.

## Shells

### Web

Owns:

- DOM rendering;
- browser navigation/sheets;
- browser camera/media adapters;
- LocalStorage/IndexedDB adapters;
- browser notifications and Web APIs;
- Vercel/EdgeOne delivery.

Does not own platform-neutral workout semantics.

### iOS

Planned native shell using Swift/SwiftUI.

Owns:

- SwiftUI navigation/presentation;
- native camera through AVFoundation;
- Photos integration;
- haptics;
- native notifications/background-safe projections;
- ActivityKit/Live Activities;
- App Intents/Controls;
- HealthKit mirror/integration;
- SwiftData/native persistence adapter;
- later watchOS companion surfaces.

Does not create alternate workout semantics.

## Capability ports

Platform implementations should expose narrow capabilities rather than leaking framework APIs into the domain:

- `ClockPort`
- `PersistencePort`
- `MediaStorePort`
- `CameraPort`
- `HapticsPort`
- `NotificationPort`
- `HealthPort`
- `LiveActivityPort`
- `IntentPort`
- `SyncPort`
- `AIServicePort`

Domain logic receives normalized values/events and emits effects/requests. It never imports DOM, SwiftUI, AVFoundation, HealthKit, ActivityKit, CloudKit or deployment-provider code.

## Gesture rule

Gestures are shell concerns.

Examples:

- long press;
- swipe;
- Digital Crown movement;
- keyboard shortcut;
- Control Center action.

A gesture may dispatch one semantic domain action. It may not directly update a second persistence path.

## Projection rule

Each shell may present the same facts differently.

Examples:

- Web Home hero;
- iPhone workout screen;
- Lock Screen Live Activity;
- Dynamic Island;
- Apple Watch compact workout view.

All are projections. None may independently complete a set/workout merely because its visual state changed.

## Native-first interaction rule

The iOS shell is not a WebView port. It should use native controls, navigation, accessibility, haptics and OS capabilities where they improve the experience.

UI code is intentionally not shared with Web.

## Server rule

Server/API responsibilities may include:

- AI inference/proxying;
- account/session identity;
- optional sync transport;
- remote persistence/mirror;
- abuse/rate controls.

The server must not become required for recording or finishing the current workout.

## HealthKit rule

HealthKit is an integration/mirror, not AXIS workout truth.

AXIS may write a completed workout and may read permitted health signals. Equipment, sets, activity intervals, project gap and AXIS session completion remain AXIS-owned facts.

## Live Activity / Intent rule

Lock Screen, Dynamic Island, Control Center and App Intents may invoke domain actions through one action boundary.

They may never write SwiftData/workout snapshots directly.

## Failure isolation

A platform capability failure must degrade locally:

- camera failure → manual recording remains;
- AI failure → manual selection remains;
- HealthKit denial → workout remains fully usable;
- Live Activity failure → in-app workout remains correct;
- sync failure → local workout remains correct;
- media failure → workout facts remain recoverable where possible.

## Versioning

Platform shells carry independent app versions while declaring compatible shared contracts.

Example:

```text
Web 8.12.4
Domain axis.domain.v1
Data axis.data.v1

AXIS iOS 1.0
Domain axis.domain.v1
Data axis.data.v1
```

A shell update does not force a release of another shell unless the shared contract version actually changes.
