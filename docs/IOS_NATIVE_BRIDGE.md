# AXIS iOS native bridge contract

The Web product keeps product logic in JavaScript and routes platform-only abilities through `window.AXISNative`. A future iOS shell can be Swift/WKWebView or Capacitor without rewriting the AXIS interaction model.

## Bridge surface

```js
window.AXISNative = {
  async saveToPhotos({ name, type, data }) {},
  haptic(kind) {},
  async passkey() {},
  async backgroundUpload(payload) {}
}
```

### `saveToPhotos`

Input `data` is base64 without the Data URL prefix. Native code requests Photos add-only permission once and writes the finalized watermarked photo/video directly to Photos. Return `{ ok: true }` or `{ ok: false, error }`.

### `haptic`

Accepted product intents: `light`, `medium`, `success`, `warning`. Map to UIKit/Core Haptics; do not let UI code choose device APIs directly.

### `passkey`

Create or retrieve the user's AXIS identity using AuthenticationServices. The web layer should only receive an opaque authenticated session result, never private credential material.

### `backgroundUpload`

Reserved for future cloud sync. Native code may use background URLSession; product code stays unaware of transport details.

## Migration order

1. Wrap current production URL in WKWebView/native shell.
2. Implement direct Photos write and haptics first; no product UI redesign required.
3. Add Passkey identity and cloud sync behind the same local-first data model.
4. Replace camera capture with native AVFoundation only if measurement shows a meaningful benefit. The current web capture contract can stay as fallback.

The native shell should not introduce an account gate before first use. Anonymous/local use remains the default; identity is attached after the user has real data worth preserving.
