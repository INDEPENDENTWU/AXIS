# AXIS Enterprise Boundaries

This document defines what must exist before AXIS is described or sold as an enterprise product, and how enterprise capability must remain separated from the participant execution experience.

## Positioning

The enterprise direction is not "another wellness dashboard" and not "an AI coach for employees".

The target value is **execution truth and evidence for human-performance protocols**:

```text
Protocol → Assignment → Execution → Encounter → Evidence → Review → Decision → Next Protocol
```

AXIS should enter organizations where the gap between prescribed work and actual performed work is costly, hard to observe, or currently reconstructed through spreadsheets, messaging, disconnected training apps and media.

## Initial commercial wedge

The first organizational buyers should be small enough to adopt a new execution layer and close enough to the work to feel the problem directly:

- independent coaches with multiple active clients;
- strength and conditioning studios;
- athlete/performance academies;
- remote coaching teams;
- specialized performance facilities.

Larger professional organizations become a later target after the workflow is proven. AXIS should integrate with established athlete/performance management systems rather than attempting to replace every analytics, medical and operational system at once.

## Product shell separation

### Participant

Participant owns the live execution experience. It remains local-first, quiet and optimized for low interaction cost.

It may receive assigned Protocol intent, but it must still preserve reality when the performed session diverges from that intent.

### Workspace

Workspace owns organizational administration and review. Future responsibilities include:

- people/members;
- Protocol library and versions;
- assignments;
- execution exceptions/deviations;
- Evidence review;
- outcomes;
- recommendation review;
- audit history;
- integration administration.

Workspace does not become the live workout truth owner. It consumes synchronized domain facts and creates authorized organizational intent/decisions.

## Minimum enterprise domain model

Enterprise development should not begin with dashboards. It begins with explicit entities and authority.

```text
Organization
Workspace
Membership
Role
Person
Protocol
ProtocolVersion
Assignment
Session
Encounter
Observation
EvidenceArtifact
Deviation
Outcome
Recommendation
Decision
AuditEvent
Integration
```

Every tenant-owned entity must have an organization/workspace boundary and a durable identifier independent of display labels.

## Authority model

Enterprise state must distinguish at least:

- **participant factual authority** — what the person actually performed/recorded;
- **organizational intent authority** — assigned Protocols and policy;
- **review authority** — coach/reviewer decisions over recommendations or exceptions;
- **system-derived projections** — read-only derived views;
- **AI recommendations** — non-authoritative proposals until accepted.

A coach may prescribe a Protocol. That does not grant the coach or server permission to rewrite the participant's historical Encounter.

## Identity and tenancy requirements

AXIS must not claim enterprise readiness until the following are production-verified:

- organization/workspace tenancy;
- tenant isolation for persisted server data;
- explicit membership lifecycle;
- role-based authorization;
- server-side authorization on every tenant resource;
- audit events for privileged changes;
- safe account recovery and session management;
- data export and deletion lifecycle;
- explicit retention rules.

SSO/OIDC/SAML and SCIM belong after the core tenancy/authorization model is proven and should be added based on real customer need.

## Sync boundary

Local execution remains authoritative for the live session.

Cloud sync is a durable convergence layer. It may distribute Protocol intent and synchronize completed facts, but temporary network failure may not prevent recording or completing core work.

Sync should preserve:

- revision/version;
- device identity where needed for reconciliation;
- update time;
- idempotent request identity;
- tombstone/delete semantics;
- conflict rules;
- source/provenance where facts enter from external systems.

## Evidence governance

Evidence is private by default.

Enterprise Evidence requires explicit answers to:

- who can view an artifact;
- which Encounter it belongs to;
- where it came from;
- whether it was captured, imported or generated;
- retention/deletion behavior;
- export behavior;
- whether an integration can access it;
- whether AI is allowed to process it.

A future `EvidenceArtifact` should include source/provenance metadata and content integrity identifiers where useful. This is conventional provenance, not blockchain.

## Audit model

Audit is separate from workout history.

Workout/Encounter history answers: **what happened in performance execution?**

Audit history answers: **who changed an authoritative organizational object, when, and through which surface/integration?**

Examples of auditable actions:

- Protocol version published;
- assignment created/cancelled;
- role changed;
- recommendation accepted/modified/rejected;
- Evidence access/export where policy requires it;
- integration credential/configuration changes;
- retention/deletion administration.

## Intelligence boundary

Enterprise AI must remain a bounded proposal layer.

A recommendation object should be traceable to the exact factual inputs or a stable input fingerprint and should record the model/provider/version when a model contributed.

The organizational workflow should support:

```text
Recommendation
  ├─ Accept → authorized decision / new intent
  ├─ Modify → authorized edited decision
  └─ Reject → no authoritative mutation
```

AI availability must not be required to view factual history, execute assigned work, record an Encounter, review Evidence or finish a Session.

## API and integration boundary

Public API design should follow stable domain contracts rather than expose internal DOM/storage structures.

Initial integration value is likely to include:

- Protocol/assignment intake;
- completed Encounter export;
- evidence metadata links where authorized;
- member identity mapping;
- outcome/review status;
- webhooks over durable domain events.

AXIS should not promise broad integrations until the underlying domain events and authorization boundaries are stable.

## Enterprise UX metrics

Useful organizational measures include:

- protocol assignment completion;
- prescribed-versus-performed variance capture;
- evidence coverage;
- incomplete or interrupted execution rate;
- adjustment/substitution frequency;
- manual data-entry time;
- coach review time/time-to-review;
- data completeness;
- recommendation accept/modify/reject rate;
- continuation success after interruption;
- interaction cost per completed useful session.

These metrics should remain interpretable. AXIS should prefer direct operational measures over opaque composite "performance scores".

## Security and operational gate

Before broader enterprise rollout, the product must have evidence for:

- server-side authorization and tenant isolation;
- secrets management and credential rotation paths;
- durable abuse/rate control appropriate to deployment topology;
- private media access control;
- audit durability;
- backup/recovery for server-owned enterprise metadata;
- data export/deletion behavior;
- observability for critical server paths;
- incident response ownership;
- dependency/update policy;
- production SLOs appropriate to the service actually sold.

Formal compliance work should follow the real data flows and target customers; certification should not be used as a substitute for basic architecture.

## Commercial packaging boundary

Potential product lines are intentionally separated:

- **AXIS Personal** — individual product/subscription;
- **AXIS Coach** — workspace for coaches/studios with active participants;
- **AXIS Team** — organizational performance workflows;
- **AXIS Enterprise** — advanced identity, policy, integrations and support;
- **AXIS Runtime / API / SDK** — platform/OEM licensing.

Packaging is a commercial decision. Domain truth must remain shared across these tiers so pricing never creates multiple incompatible histories.

## Claim discipline

Until the required foundations exist, use precise language:

- acceptable: "enterprise direction", "enterprise foundation", "organization-ready domain contracts";
- not acceptable yet: "enterprise-grade platform", "complete multi-tenant SaaS", "compliant with X" unless corresponding implementation and evidence exist.

The enterprise strategy succeeds when AXIS can enter an organization without turning Participant into an administrative dashboard and without weakening the factual boundary between intent, performed reality and evidence.
