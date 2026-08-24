# Localization and theme foundation

This contract defines the presentation architecture planned after source governance convergence. It is not permission to patch translations/themes directly into the 8.18 runtime.

## Locales

AXIS will support exactly these initial UI locales:

| Locale | Display name | Requirement |
| --- | --- | --- |
| `zh-Hans` | **简体中文** | Actual professional Simplified Chinese. Never ship Traditional Chinese under this locale. |
| `zh-Hant` | **繁體中文** | Professional Traditional Chinese localization. Never rely on mechanical script conversion alone. |
| `en` | **English** | Natural product English that preserves meaning, not literal word-for-word translation. |

### Localization architecture

User-facing strings should move to one locale-key model, for example:

```text
locales/
  zh-Hans.json
  zh-Hant.json
  en.json
```

Runtime UI should request semantic keys such as `capture.scan.duration5`, not embed visible language in business logic.

Required engineering gates:

- exact key parity across all three locales;
- missing keys fail CI rather than silently falling back into another language;
- new hard-coded user-facing UI strings are rejected outside approved content/data surfaces;
- dates/numbers use locale-aware formatting;
- units remain a separate user preference from language;
- layout tests cover longer English and CJK text without clipping/overflow;
- glossary terminology is reviewed semantically, not by character conversion.

See [`GLOSSARY.md`](GLOSSARY.md).

## Themes

Initial theme preference:

- `system`
- `light`
- `dark`

Theme implementation must use semantic design tokens rather than component-by-component `.light` / `.dark` patches.

Core token families should cover:

```text
background / surface
text primary / secondary / tertiary
line / separator
accent
success / warning / danger
icon / logo
overlay / shadow
focus / selected / disabled
```

### Media and watermark rule

App theme and captured-media contrast are separate semantic domains. A Light app theme must not force dark watermark treatment onto an arbitrary photo, and a Dark app theme must not force white-only media treatment.

Watermark/media overlay tokens need their own contrast policy.

### First-paint rule

Theme preference must resolve early enough that a Dark launch does not paint a white frame before JavaScript convergence. AXIS treats an incorrect transient frame as a defect.

## Validation matrix

Before the foundation is considered complete, exercise at least:

- Today/Home
- Capture
- Quick Record
- Active training / Focus
- History + Encounter detail
- Trends
- Evolution Library / Evidence
- Settings / storage
- Language Studio
- sheets, dialogs, toasts and empty/error states

Across:

- `zh-Hans`, `zh-Hant`, `en`;
- Light and Dark visual output, plus System preference behavior;
- Chromium and iPhone-like WebKit.

Release-blocking presentation failures include:

- missing or wrong-language text;
- accidental Simplified/Traditional mixing;
- clipped/wrapped controls that break interaction;
- horizontal overflow;
- wrong logo/icon/symbol contrast;
- invisible selected/disabled states;
- wrong-theme first-paint flash;
- route/layout changes caused only by locale/theme switching.

## Non-goal

Localization and themes must not create parallel product logic. They are projections of the same product state and actions.
