# AXIS AI v3 — Owner configuration

AXIS users never enter an API key or choose a model. The product owner configures AI once in the hosting environment. The client only exposes product-level switches: 器械识别、画面检查、训练洞察。

## Required

- `DASHSCOPE_API_KEY` — Alibaba Cloud Model Studio / 百炼 API key. Never expose this value to the browser or repository.

## Recommended production configuration

```text
AXIS_AI_ENABLED=true
AXIS_AI_VISION_ENABLED=true
AXIS_AI_QUALITY_ENABLED=true
AXIS_AI_INSIGHT_ENABLED=true
AXIS_VISION_MODEL=qwen3.6-flash
AXIS_INSIGHT_MODEL=qwen3.6-flash
AXIS_AI_MAX_FRAMES=2
AXIS_AI_MIN_CONFIDENCE=0.58
AXIS_AI_MAX_IMAGE_CHARS=1800000
AXIS_AI_VISION_RPM=12
AXIS_AI_INSIGHT_RPM=8
AXIS_AI_TIMEOUT_MS=12000
```

Optional high-accuracy escalation is implemented but intentionally off by default:

```text
AXIS_AI_ESCALATION_ENABLED=false
AXIS_VISION_FALLBACK_MODEL=qwen3.7-plus
AXIS_AI_ESCALATE_BELOW=0.46
AXIS_AI_ESCALATE_MIN_QUALITY=0.62
```

When enabled, AXIS only retries with the stronger model when the Flash result is genuinely ambiguous but the capture itself is clear. Low-quality captures are not escalated; the user receives a short re-scan hint instead. This keeps the default public experience low-cost while retaining a server-side quality ceiling switch.

Optional endpoint override:

```text
BAILIAN_BASE_URL=https://<WorkspaceId>.cn-beijing.maas.aliyuncs.com/compatible-mode/v1
```

Use the business-space-specific endpoint when available. The application falls back to the public DashScope compatible endpoint when this variable is not set.

## Cost and latency strategy

1. Personal visual memory runs first on-device. A strong match skips the model call.
2. Visual AI receives at most two compressed key frames, not the whole 3–5 second clip.
3. `qwen3.6-flash` is the default vision and text model.
4. Thinking mode is explicitly disabled for capture recognition and short training insight.
5. Visual outputs use JSON mode and strict small schemas.
6. Training insight is generated at most once per completed session and cached on the user's device.
7. If AI is unavailable, AXIS keeps working with manual confirmation and deterministic local insight.
8. Server routes apply soft per-IP rate limits. For large public scale, move quotas to a durable KV/rate-limit service without changing the client contract.
9. Optional model escalation is confidence- and image-quality-gated rather than applied to every request.

## API contract

- `GET /api/ai-status` — public capability status; never returns provider credentials or internal model configuration.
- `POST /api/analyze` — equipment, readable load/cardio values, candidates, confidence, capture-quality feedback.
- `POST /api/insight` — receives compact workout statistics only; no photos or videos. Returns one headline, one observation and one next action.

## Privacy boundary

Media is stored locally in the current AXIS Web build. Only the selected compressed scan frames are temporarily sent to the vision endpoint when 器械识别 is enabled. Training insight receives aggregated workout fields, not media.

## iOS migration

`platform-v7.js` is the platform boundary. The future native shell can expose `window.AXISNative` methods for Photos writing, haptics, Passkey identity and background upload. Product logic and Vercel AI routes remain unchanged.
