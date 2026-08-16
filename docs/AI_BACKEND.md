# AXIS AI v4 — Local-first frontier verification

AXIS users never enter an API key or choose a model. AI is a server-side owner capability. The client only sees product outcomes such as `已识别`, `请确认` or manual selection.

## Vision order

AXIS 8.9 uses:

`Local Vision v2 -> frontier vision -> optional ambiguity verification -> user confirmation`

Local recognition always runs first. A strong local result preselects immediately instead of making the user wait for a network model. Frontier vision verifies in the background when available.

## Provider configuration

`AXIS_VISION_PROVIDER=auto` is recommended. In auto mode the configured provider order is:

1. OpenAI
2. Gemini
3. Bailian

Only providers with a key are used.

### Highest-quality OpenAI path

```text
OPENAI_API_KEY=...
AXIS_OPENAI_VISION_MODEL=gpt-5.6-sol
AXIS_OPENAI_REASONING=low
```

### Optional independent verifier

```text
GEMINI_API_KEY=...
AXIS_GEMINI_VISION_MODEL=gemini-3.1-pro-preview
```

### Existing China-friendly fallback

```text
DASHSCOPE_API_KEY=...
AXIS_VISION_MODEL=qwen3.6-flash
AXIS_VISION_FALLBACK_MODEL=qwen3.7-plus
```

The existing Bailian configuration remains valid. `api/insight` continues to use the Bailian-compatible text path unless that route is changed separately.

## Recommended production settings

```text
AXIS_AI_ENABLED=true
AXIS_AI_VISION_ENABLED=true
AXIS_AI_QUALITY_ENABLED=true
AXIS_AI_ESCALATION_ENABLED=true
AXIS_AI_MAX_FRAMES=3
AXIS_AI_MIN_CONFIDENCE=0.60
AXIS_AI_ACCEPT_CONFIDENCE=0.82
AXIS_AI_ESCALATE_BELOW=0.78
AXIS_AI_ESCALATE_MIN_QUALITY=0.48
AXIS_AI_ARBITRATION_MARGIN=0.12
AXIS_AI_MAX_CATALOG=220
AXIS_AI_MAX_IMAGE_CHARS=2600000
AXIS_AI_VISION_RPM=12
AXIS_AI_TIMEOUT_MS=12000
```

## Canonical catalog contract

The browser sends a compact sanitized view of the exact AXIS equipment/exercise catalog currently available to the user:

```json
{"id":"machine-incline-press","name":"器械上斜胸推","type":"strength","muscles":["胸肌","肩部","肱三头肌"]}
```

The server builds a valid-ID set from that request. `equipmentId` and every candidate returned by a model are filtered through that set. A model-generated free-form equipment name is never accepted into product state.

Custom equipment may participate when it has a safe local ID/name. The AI still returns the exact client catalog ID.

## Ambiguity policy

A second configured provider/model is not called on every capture. AXIS escalates only when:

- top confidence is below the configured threshold;
- no top ID is returned; or
- a strong Local Vision prior materially conflicts with a non-dominant model result.

Agreement strengthens the result. A clear winner may replace the first result. Close disagreement deliberately returns `equipmentId: null` with up to three canonical candidates and `needsConfirmation: true`.

## Privacy boundary

Media remains stored locally in AXIS. Only up to three selected scan frames are sent to `/api/analyze`. The request also contains compact catalog rows, recent equipment IDs and Local Vision candidate scores. The user's local visual-memory database is never uploaded.

## Failure behavior

AI is not required for recording. If every configured provider is unavailable, times out or is rate-limited, AXIS preserves the local preselection when available and falls back to one-tap/manual confirmation.
