# AXIS ownership registry

Human-readable companion to [`../governance/owners.json`](../governance/owners.json). The JSON registry is machine-readable; this document explains the engineering meaning.

## Ownership rules

1. One semantic action has one interactive writer.
2. One current training fact has one authoritative store.
3. Compatibility code delegates; it does not regain authority.
4. Read-only projections do not create persistence.
5. Replacing an owner requires explicit handoff and retirement proof.

## Critical owners at the 8.18 baseline

| Capability | Status | Current owner | Persistence / delegation |
| --- | --- | --- | --- |
| Base training/session/profile/preferences | authoritative | `app.js` | `axis_v60_state` |
| Strength/set recording | authoritative | `v61.js` | `axis_v8_meta` |
| Camera, MediaRecorder, media persistence | authoritative | `app.js` | `axis_v42_media` |
| Clean-source media resolver | derived read-only | `window.__AXIS_MEDIA_SOURCE__` via `app.js` | reads `axis_v42_media`, canonical fallback |
| Visible custom object editor | authoritative visible owner | `v874-professional.js` | existing custom-object persistence path |
| Automatic sound | authoritative | established v8710 sound owner | no competing reminder loop |
| Watermark compositor | authoritative | `v8710-watermark.js` | source-first, shared painter |
| Active Focus | presentation-only | 8.18 Focus | delegates completion to `v87-direct-884` |
| Evolution Library | derived read-only | 8.18 projection | no new database/schema |
| Language Studio state | isolated-domain authority | Language Studio runtime | `axis_v89_speak` |
| Historical v876 Capture preference setter | compatibility-only | v876 bridge | delegates to app-owned current preference |

## Change protocol

Before changing an owner, record:

- current owner and proposed owner;
- semantic action/state being handed off;
- persistence impact;
- old writer retirement condition;
- current-state and transient-state tests;
- Chromium/WebKit evidence when user-visible;
- canonical artifact result.

Adding a second writer “temporarily” is not a safe migration strategy. Use shadow read/compare or a narrow delegating bridge instead.
