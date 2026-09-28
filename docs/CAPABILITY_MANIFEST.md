# AXIS Capability Manifest

This document describes product capabilities by durable domain responsibility rather than by historical release number. It is deliberately conservative: `production` means the repository currently contains a shipped/current implementation path; `foundation` means contracts or partial infrastructure exist but the capability is not yet a complete product; `planned` means it belongs to the accepted program but is not current product truth.

Release certification remains governed separately.

## Status vocabulary

- **production** — current product capability with an established owner/path and regression coverage.
- **foundation** — meaningful implementation/contracts exist, but the end-to-end user/business capability is incomplete.
- **planned** — accepted target capability; not current product truth.
- **isolated** — optional capability deliberately kept outside core execution ownership.
- **retired/forbidden** — must not regain authority without explicit governance.

## 1. Object and recording system

| Capability | Status | Current contract |
|---|---|---|
| Reusable practice/activity Objects | production | Objects identify what can be performed and recorded. |
| Custom Objects/equipment | production | User-defined activities can persist stable identity and recording properties. |
| Metric schema | production | Different Objects can expose different metrics instead of forcing one strength/cardio form. |
| Metric control families | production | Number, count, duration, hold, distance, pace, percentage, rating, boolean and choice families are represented in current regression coverage. |
| Execution modes | production | `single`, `sets`, `rounds`, `timed`, `hold`, `complete`. |
| Automatic execution-mode derivation | production | Runtime may derive an execution mode from an Object's effective metric schema. |
| Quick Record | production | Fast path from activity choice to factual recording. |
| Equipment memory | production | Known/custom equipment and useful recording context can be reused. |

## 2. Active execution

| Capability | Status | Current contract |
|---|---|---|
| Active session runtime | production | Current activity can start, continue, pause/resume and complete while preserving factual state. |
| Per-item completion | production | Item/set completion persists exactly once through the canonical owner. |
| Pause/rest timing | production | Rest remains a factual state owned by the existing active runtime rather than a second timer authority. |
| Canonical adjustment | production | Active adjustment has one current interaction owner. |
| Session completion | production | Finishing an item does not implicitly finish the whole Session. |
| Constraint-aware route adaptation | foundation | Flow/runtime contracts exist; broader reality-aware route projection remains a program target. |
| Semantic state-machine UI | planned | Running/paused/rest/complete/review geometry will become explicit design contracts. |

## 3. Flow and protocol intent

| Capability | Status | Current contract |
|---|---|---|
| Flow schema | production | `axis.flow.v1` identifies an ordered intended path over Objects. |
| Step metric override | production | A Flow step may temporarily override effective metrics with provenance. |
| Step execution override | production | A Flow step may temporarily override execution mode with provenance. |
| Repeat and next intent | production | Resolved steps preserve repeat and next-step intent. |
| Flow provenance snapshot | production | Encounter-facing provenance can preserve the effective step configuration. |
| Constraint model | planned | Time, equipment, priority and other explicit runtime constraints become portable protocol inputs. |
| Bounded substitution rules | planned | Alternative Objects must preserve intent/provenance rather than silently rewriting a Protocol. |
| Portable Protocol schema/DSL | planned | Flow evolves into a versioned integration surface suitable for external definition. |

## 4. Encounter, history and evidence

| Capability | Status | Current contract |
|---|---|---|
| Session history | production | Completed activity remains available as factual history. |
| Encounter-style factual records | production | Actual performed activity is preserved separately from future intent. |
| Local media evidence | production | Media is local-first and stored independently of cloud availability. |
| Exact Encounter evidence navigation | production | Replay selection can anchor to the exact Encounter without borrowing evidence from another occurrence. |
| Explicit no-evidence state | production | An Encounter without media remains truthfully evidence-free. |
| Read-only replay/evidence inspection | production | Inspecting history/evidence does not rewrite training truth or require network ownership. |
| Evidence provenance schema | planned | Artifact source, capture/import origin, timestamps, hashes and metric references become explicit first-class contracts. |
| External sensor/machine observations | planned | Wearables and machines enter as source-labelled observations, not as truth replacements. |

## 5. Evolution and reporting

| Capability | Status | Current contract |
|---|---|---|
| Trends | production | Recorded activity can be reviewed longitudinally. |
| Evolution replay | production | Chronology can be inspected at exact factual points. |
| Reports | production | Canonical report surfaces summarize recorded data without creating a second factual store. |
| Longitudinal performance graph | planned | Person/Goal/Capability/Object/Protocol/Encounter/Observation/Evidence/Outcome become explicit graph relationships. |
| Source-aware inference | planned | Inferences must preserve their evidence basis and uncertainty. |
| Opaque progress score as truth | forbidden | AXIS does not manufacture a hidden composite score and present it as factual history. |

## 6. Capture, media and local intelligence

| Capability | Status | Current contract |
|---|---|---|
| Photo capture | production | Available through the canonical capture path. |
| Video capture | production | Available through the canonical capture path. |
| Capture defaults | production | Capture default and scan sampling remain independent preferences. |
| Local Vision/catalog support | production | Current product contains local/catalog-bound visual assistance. |
| Server AI vision adapters | production | Same-origin server routes can use configured provider adapters; secrets remain server-side. |
| AI as factual writer | forbidden | Model output cannot become a second workout database or fabricate completed activity. |

## 7. Intelligence

| Capability | Status | Current contract |
|---|---|---|
| Optional AI infrastructure | production | AI capability is optional and fail-open. |
| Multiple provider adapters | production | Current architecture supports provider adapters including OpenAI, Gemini and Bailian according to server configuration. |
| Natural-language/ambiguous-input assistance | foundation | AI is suitable for ambiguity resolution but is not authoritative product state. |
| Recommendation object | planned | Recommendations will record state fingerprint, reasons, provider/model identity, uncertainty and proposed change. |
| Human accept/modify/reject | planned | Authoritative Protocol mutation will require explicit decision ownership. |
| Autonomous silent plan rewriting | forbidden | No model may silently rewrite factual history or authoritative intent. |

## 8. Storage, sync and portability

| Capability | Status | Current contract |
|---|---|---|
| Local training storage | production | Core training remains usable without network or account. |
| Local media storage | production | IndexedDB/local media path remains independent of mandatory cloud storage. |
| Backup/export foundations | production | Non-destructive local data controls exist. |
| Provider-neutral sync contracts | foundation | Revision/update time/device/tombstone/idempotency contracts exist. |
| Durable account sync product | planned | Identity, transport, persistence, conflict behavior and deletion lifecycle must be production-verified before claiming complete sync. |
| Platform adapter boundary | foundation | Browser/native capability boundaries exist; deeper domain portability remains in progress. |

## 9. Product shells

| Capability | Status | Current contract |
|---|---|---|
| Participant mobile/web experience | production | Quiet, execution-first surface centered on Today, recording, Active, History and Trends. |
| Language Studio | isolated | Optional secondary channel; it does not own training state, Home or workout Flow. |
| Coach Workspace | planned | Separate organization/coach surface for people, protocols, assignments, evidence and review. |
| Admin/organization console | planned | Tenancy, roles, policy and audit controls remain future enterprise work. |

## 10. Enterprise platform

| Capability | Status | Current contract |
|---|---|---|
| Organization / multi-tenancy | planned | Not current product truth. |
| RBAC | planned | Not current product truth. |
| Enterprise audit trail | planned | Domain event/audit model must precede enterprise claims. |
| SSO/OIDC/SAML | planned | Driven by validated enterprise need. |
| SCIM | planned | Driven by validated enterprise need. |
| Public API | planned | Stable domain contracts must exist before external platform claims. |
| Webhooks | planned | Event semantics must be durable before external delivery. |
| Runtime SDK | planned | Target platform surface over Object/Protocol/Runtime/Encounter/Evidence contracts. |
| Distributed abuse/rate controls | planned | Current baseline controls are not sufficient to claim enterprise-scale abuse protection. |
| Compliance package | planned | Retention, deletion, tenant isolation and operational controls must be implemented before compliance positioning. |

## 11. Engineering and release capabilities

| Capability | Status | Current contract |
|---|---|---|
| Canonical single runtime | production | Production build converges historical source into one browser artifact topology. |
| Deterministic build/release identity | production | Release artifacts are tied to exact source identity and machine-readable contracts. |
| Browser regression testing | production | Critical paths are exercised with real browser tests. |
| Chromium critical-path proof | production | Chromium alone is necessary but not sufficient. |
| iPhone-like WebKit proof | production | Critical mobile paths include WebKit release coverage. |
| Exact-SHA deployment verification | production | Deployment evidence is associated with exact source identity. |
| Capability-oriented test topology | planned | Permanent domain tests should gradually replace historical version-shaped test organization. |
| Historical source convergence | foundation | Production topology is clean; source still contains significant historical compatibility input. |

## 12. Product boundaries

The following are not accepted north-star directions unless a future evidence-based product decision changes this manifest:

- social feed;
- streak/XP-centered gamification;
- generic AI coach chat as the primary product;
- mandatory cloud execution;
- opaque readiness/recovery scores presented as fact;
- medical diagnosis;
- giant content-library competition;
- dashboards whose only value is presenting more data;
- a simultaneous multi-platform rewrite.

## Update rule

Every material capability added by future stages must be represented here with one of the status values above. A capability may move from `planned` → `foundation` → `production` only when implementation, ownership, failure behavior, tests and release evidence support that claim.
