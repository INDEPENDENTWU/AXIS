# AXIS 8.11 — Cloud Sync + AI Foundation

Status: architecture foundation. This document defines product ownership, data contracts, security boundaries, and provider adapters before any cloud account is provisioned.

## 1. Non-negotiable product ownership

AXIS remains local-first.

The browser owns the immediate training experience and must keep working with no account, no network, no AI, and no cloud provider:

- `axis_v60_state` — canonical training state
- `axis_v8_meta` — training metadata, timers, sets, preferences
- `axis_v89_speak` — isolated learning state
- IndexedDB media store — local photos/video/audio when the product explicitly persists them

Cloud sync is a durable mirror and cross-device convergence layer. AI is an accessory capability layer. Neither may become the owner of training timers, recording buttons, active-item status, local visual memory, or the ability to finish/save a workout.

## 2. Product surfaces

### 云端同步

Top-level Settings row: `云端同步`.

States:

- `关闭` — default; AXIS remains entirely local
- `数据` — sync profile, training records, preferences and learning progress
- `数据 + 媒体` — additionally sync user-approved photos/video/media

The row displays one compact status only: `关闭`, `待同步`, `刚刚同步`, `离线`, or `需处理`.

Dedicated sheet:

- account/session state
- selected sync scope
- last successful sync
- this device name
- pending outbox count
- media sync separately controlled
- explicit `立即同步`
- `退出云端` does not erase local records
- `删除云端数据` is a separate destructive action with confirmation

No account prompt is allowed in the main training flow. Sign-in appears only after the user explicitly enables cloud sync.

### AXIS AI

Top-level Settings row: `AXIS AI`.

Modes:

- `关闭`
- `辅助` — recommended; local result first, AI verifies/enriches only when useful
- `智能` — may proactively produce summaries or richer language practice inside user-enabled scopes, but never takes training ownership

Capabilities are independently scoped:

- 器械识别验证
- 训练总结与趋势
- 自然语音
- 发音反馈
- 动态对话

Data permissions are explicit by modality:

- 文字与训练数据
- 图片
- 音频

A capability cannot send a modality that the user has not enabled.

## 3. Cloud provider architecture

Use a provider-neutral server adapter selected by environment variable:

`AXIS_CLOUD_PROVIDER=cloudbase|off`

CloudBase is the first recommended production adapter for the China-facing deployment because it provides authentication, document/MySQL database, object storage and serverless compute in one platform. AXIS must not couple browser product code directly to CloudBase APIs; the browser talks only to same-origin AXIS endpoints.

Provider boundary:

```text
Browser
  -> /api/account/*
  -> /api/sync/*
  -> /api/media/*
       |
       v
AXIS server contracts
       |
       +-> CloudBase adapter
       +-> future adapter(s)
```

This allows Vercel and EdgeOne frontends to keep the same browser contract while cloud infrastructure can move without rewriting product state.

## 4. Sync model

AXIS uses an outbox + revision model rather than treating the cloud as a live database for every tap.

Each syncable entity has:

```json
{
  "entityType": "session",
  "entityId": "S...",
  "deviceId": "D...",
  "revision": 12,
  "updatedAt": 1786892400000,
  "deleted": false,
  "payload": {}
}
```

Local mutations append a compact outbox item. Background sync is allowed only when it does not interfere with the active training UI. Explicit `立即同步` bypasses the background delay.

### Conflict rules

1. Immutable completed exercise/event facts converge by entity ID and revision.
2. Preferences use latest explicit user edit (`updatedAt`, then deterministic device ID tie-break).
3. Learning exposure/mastery merges monotonically where possible; review scheduling uses the newest review event.
4. Media metadata may merge before the binary upload completes.
5. Deletion uses tombstones; a stale device cannot silently resurrect deleted cloud data.
6. Any conflict that cannot be deterministically resolved is retained as a server conflict record and shown as `需处理`; training is never blocked.

## 5. Suggested collections / tables

Provider-neutral logical schema:

- `axis_users`
- `axis_devices`
- `axis_entities`
- `axis_sync_journal`
- `axis_learning_progress`
- `axis_media_objects`
- `axis_conflicts`
- `axis_ai_preferences`

`axis_entities` may hold normalized JSON documents initially. If reporting/analytics later needs SQL, the adapter may project durable records into relational tables without changing the browser sync contract.

Every user-owned record includes `userId`. Browser access never receives a server/admin credential. Provider security rules must enforce user isolation even if an AXIS endpoint is miscalled.

## 6. Media sync

Media is independent from metadata sync.

Flow:

```text
local media
 -> request upload intent
 -> server authorizes user + object path
 -> direct/signed upload
 -> commit media metadata
```

Object keys are opaque and user-scoped. Public buckets are forbidden for private training media. The sync journal contains metadata/hashes, never raw binary blobs.

The existing ephemeral language-practice recording remains non-persistent by default. It is not included in media sync unless a future explicit `保存练习录音` product action is added.

## 7. AI server boundary

All paid/provider AI secrets remain server-side. The browser never accepts or stores provider API keys.

Recommended environment contract:

```text
AXIS_AI_ENABLED=true
AXIS_AI_MODE=assist
AXIS_AI_VISION_ENABLED=true
AXIS_AI_INSIGHT_ENABLED=true
AXIS_AI_VOICE_ENABLED=true
AXIS_AI_PRONUNCIATION_ENABLED=true
AXIS_AI_DIALOGUE_ENABLED=true

AXIS_VOICE_PROVIDER=openai|system
AXIS_TRANSCRIBE_PROVIDER=openai|off
AXIS_DIALOGUE_PROVIDER=openai|off
```

The zero-network fallback always remains available:

- vision -> Local Vision v2 / manual confirmation
- voice -> best available system voice
- pronunciation -> local A/B playback and timing comparison
- dialogue -> curated deterministic dialogue units
- insight -> local statistics

## 8. Natural voice

Cloud voice is optional and user-triggered. It exists to make English, Japanese, Korean and Chinese more consistent across devices than browser system voices alone.

Server endpoint:

`POST /api/ai/voice`

Request contract:

```json
{
  "text": "I have one more set.",
  "language": "en",
  "style": "natural-conversation",
  "speed": "natural",
  "context": "gym-dialogue"
}
```

The server maps language/style to the configured provider. The browser never chooses a raw model ID.

Cache key may use `(provider, language, voiceProfile, normalizedText, styleVersion)`. Cache only reusable curriculum speech, not private user content, unless policy explicitly allows it.

## 9. Pronunciation feedback

Do not reduce speaking quality to one fake confidence score.

`POST /api/ai/pronunciation`

Inputs:

- target text
- target language
- short user recording
- optional reference duration/word timing

Output:

```json
{
  "transcript": "I have one more set.",
  "lexical": {"matched": true, "notes": []},
  "timing": {"referenceMs": 1620, "userMs": 1810, "deltaMs": 190},
  "rhythm": {"summary": "第二个语块稍慢"},
  "pronunciationNotes": ["have one 可连得更自然"],
  "nextAction": "再影子跟读一次，保持 one more 为同一语块"
}
```

The feedback must distinguish transcription certainty from coaching inference.

## 10. Dynamic dialogue

Curated content remains the default because it is predictable, fast and offline-capable.

Dynamic dialogue is an opt-in extension. It receives only the minimum context necessary:

- learning language
- level
- selected topic/track
- current curriculum phrase(s)
- recent learning mistakes when the user enabled learning-history AI

It must not receive unrelated training history just because training data exists.

## 11. Realtime conversation

Realtime voice conversation is a later 8.11.x capability, not a prerequisite for sync.

When enabled, it should use a short-lived server-created session/token, language-specific instructions, near-field noise handling for phone/headset practice, and turn detection. The browser must never hold a long-lived provider secret.

## 12. API surface

Initial same-origin contracts:

```text
GET  /api/cloud-status
POST /api/account/session
POST /api/account/logout
POST /api/sync/bootstrap
POST /api/sync/push
POST /api/sync/pull
POST /api/sync/media-intent
GET  /api/ai-capabilities
POST /api/ai/voice
POST /api/ai/pronunciation
POST /api/ai/dialogue
```

Every write uses request IDs / idempotency keys. Sync endpoints use bounded payload sizes and pagination/cursors.

## 13. 8.11 implementation sequence

1. Cloud/AI public capability status + server configuration contracts.
2. Stable device ID, sync journal/outbox and deterministic merge code; no provider required yet.
3. CloudBase adapter + authentication + database security rules.
4. Data-only sync beta.
5. Media upload/sync as a separate opt-in.
6. Cloud natural voice + transcription/pronunciation endpoint.
7. Dynamic dialogue.
8. Optional Realtime conversation after the non-realtime path is stable.

A failed cloud or AI request must always degrade to the existing AXIS local experience.
