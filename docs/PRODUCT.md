# Product

AXIS is a local-first training tool for real workouts.

It is not defined by a camera, a dashboard, an AI model or a training plan. Those are capabilities. The product is defined by a simpler contract: record what actually happened, preserve continuity, and reduce the amount of management required to keep training useful.

## Current product — 8.12

8.12 is the current compatibility and release baseline. It includes training recording, active-session execution, media capture, equipment memory, Local Vision, State Field, reports, reminders, optional AI/cloud foundations and an isolated Language Studio.

Language Studio is a secondary channel. It does not own Home, training state or the user's workout flow.

## Direction

The next product step is **AXIS 8.13 · Runtime**.

The product-level idea is:

> The plan follows reality. Reality does not have to follow the plan.

A workout should remain coherent when equipment is occupied, time becomes shorter, the user chooses a different exercise, the session stops early, or the user returns after a long gap.

This is not a promise that AXIS always knows the ideal workout. When evidence is weak, AXIS should stay conservative and accept the user's decision.

## Principles

### Reality is authoritative

The user's actual action is the source of truth. Suggestions are projections, not obligations.

An early finish is a valid session. A manually chosen exercise is valid. A gap in training is data, not a failure state.

### Local first

The core workout path must remain available without sign-in, connectivity or AI. Network services may enrich an action, but may not own the ability to record, continue or finish training.

### Interaction should decay

Repeated use should remove work from the user. Known weights, equipment settings, common structures and preferences should be reused when confidence is sufficient.

A useful internal metric is interaction cost per completed useful workout. Over time, that cost should fall rather than grow.

### One action, one owner

Duplicate state, duplicate controls and delayed cleanup are product defects. If a new implementation replaces an old one, retirement is part of the same change.

### Evidence before interpretation

Prefer concrete records and behavior shapes over scores, motivational copy or speculative recovery claims.

### AI handles ambiguity, not authority

AI is appropriate for fuzzy input: image recognition, natural-language constraint extraction, optional dialogue and summarization. Deterministic product state remains outside the model.

AI may not fabricate completed work, silently rewrite history, infer injury/recovery without evidence, or override an explicit user decision.

### Fail open

Optional capability failure must degrade to a usable path:

- visual recognition → local memory / manual selection;
- cloud → local data;
- model insight → deterministic local evidence;
- voice → available system voice;
- uncertain recommendation → no forced recommendation.

### Small outside, rigorous inside

The visible product should remain restrained even as its internals become more capable. New settings, cards and explanatory text are not evidence of a better system.

## Product boundaries

AXIS should not become:

- a mandatory workout planner;
- a social feed;
- a gamified streak/XP system;
- a generic AI coach chat surface;
- a second language-learning product attached to training navigation;
- a cloud-dependent workout client.

A new capability needs a clear relationship to training continuity, recording friction, evidence, or a deliberately isolated optional channel.

## Runtime signature

The intended 8.13 signature is a visible change in the workout itself rather than a paragraph explaining intelligence.

Examples:

- mark a machine occupied → the remaining route reorders;
- move the leave time earlier → the route contracts;
- choose “less” → lower-priority work falls away;
- choose an unplanned exercise → AXIS accepts it and continues from the new reality.

The change is the feedback. Explanations stay available for diagnostics and testing through reason codes, not as compulsory user-facing copy.
