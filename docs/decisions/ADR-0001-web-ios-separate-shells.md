# ADR-0001 — Web and iOS are separate native shells

- Status: Accepted
- Date: 2026-08-19

## Decision

Keep the existing AXIS Web product independently deployable and build AXIS iOS as a separate native Swift/SwiftUI product repository/release stream.

Web and iOS share versioned domain/data contracts and golden behavior fixtures, not UI implementation or production build chains.

## Why

- protects the stable Web product from Xcode/signing/native build churn;
- allows genuinely native iOS interaction instead of a WebView compromise;
- keeps platform release versions independent;
- avoids framework-driven shared-code architecture before domain boundaries are stable;
- preserves a clean path to watchOS/Android later.

## Rejected initial alternatives

- WKWebView wrapper — cheapest port but fails the native-experience objective and keeps browser constraints.
- React Native/Flutter/KMP as the first move — introduces framework/platform coupling before AXIS domain truth is extracted.
- one monorepo build pipeline for Web+iOS — increases release blast radius without current operational benefit.

## Consequences

- `INDEPENDENTWU/AXIS` remains Web production owner.
- target native repository is `INDEPENDENTWU/AXIS-iOS`.
- shared contract changes require compatibility evidence across participating shells.
- UI is intentionally reimplemented per platform.
