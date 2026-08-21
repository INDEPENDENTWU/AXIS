# AXIS Evolution Vision

## Position

AXIS is not designed to become another fitness dashboard, workout logger, AI coach, or social content platform.

The long-term direction is a personal evolution system: a product that captures low-friction evidence of real-world practice and gradually turns repeated experiences into a personal record of change.

The first domain is training. The underlying model is broader: repeated activities where a person returns, practices, changes, or recovers.

Examples:

- strength training
- running and walking routes
- swimming
- climbing
- rehabilitation
- skill practice
- other repeatable physical activities

## Core model

AXIS should be built around four concepts:

### Capture

A real moment is captured with minimal effort.

Possible evidence:

- structured training data
- photo
- video
- Live Photo
- location context
- wearable data
- manual confirmation

The user should not feel like they are creating content. They are simply leaving a trace of something that happened.

### Encounter

A single real interaction with an activity, object, place, or practice.

Examples:

- one workout session
- one run
- one attempt at a climbing route
- one rehabilitation exercise

### Evolution

Repeated encounters with the same activity gradually form an understandable personal object.

Not a table of dates. Not a generic chart.

A growing record of how something changed over time.

### Replay

AXIS can eventually transform accumulated evidence into meaningful personal outputs.

Examples:

- evolution replay
- before/after comparison
- time-compressed progress video
- visual history of a skill or activity

Replay must remain downstream of truthful Capture → Encounter → Evolution semantics. Generated output is not a substitute for real evidence identity.

## Current implementation state

### 8.13.1 — truthful Encounter foundation

8.13.1 makes sealed Sessions visible as a time field and proves that real activity evidence can be recovered from canonical training metadata without inventing missing time. Same-day sessions remain distinct, sub-minute sessions remain truthful, and `window.__AXIS_EVOLUTION__` exposes a read-only semantic projection of first/latest encounter, encounter count, span and media evidence.

### 8.14 — first Evolution Objects

8.14 is the first product step where Evolution becomes something directly perceivable rather than only a resolver/API concept.

Inside an expanded real Session, a recorded activity becomes a semantic object entry. Tapping it reveals, in place:

- how many real encounters exist;
- how long the evidence spans;
- the first recorded encounter;
- the latest recorded encounter;
- existing media evidence;
- only literal, directly comparable change between factual endpoints.

The object does not open a dashboard, ask the user to maintain another database, call an AI service, write training state, or claim that a change is good/bad. First-only encounters stay first-only.

This establishes the intended direction: **the user records reality once; AXIS progressively makes the accumulated object more legible.**

## Product principle

The user should not think:

"I need to maintain my records."

The user should think:

"I want to see what this has become."

Long-term value comes from the accumulated result, not from forcing daily input.

## Recording philosophy

Recording should become progressively lower friction.

The product should move from:

Input everything

→ Confirm what changed

→ Confirm the important moments

→ Capture only meaningful differences

AXIS should not fabricate precision. If the user did not provide exact information, the product should preserve uncertainty instead of inventing data.

## Identity philosophy

Evolution requires stable identity across repeated reality.

Identity should come from existing canonical IDs where possible, then careful historical compatibility evidence. Display names alone are fallback evidence, not a reason to silently merge unrelated things.

Future work should improve identity continuity across imperfect historical records before adding ambitious Replay generation.

## Media philosophy

Photos and videos are not social content inside AXIS.

They are evidence of time.

AXIS should avoid creator workflows:

- no editing pressure
- no performance pressure
- no templates requiring effort
- no social ranking

The system organizes naturally captured material into useful personal outputs.

## Web phase

The web app should establish the foundation:

- reliable session model
- truthful Encounter semantics
- Evolution objects
- media evidence layer
- history projection
- low-friction capture flows
- deterministic local-first architecture

The goal is proving the product concept, not replicating native iOS behavior.

## iOS phase

Native iOS expands the experience through:

- Camera integration
- Live Photo
- Apple Watch
- HealthKit
- haptics
- widgets
- background context

The iOS version should feel less like a form and more like a personal instrument.

## UX language

AXIS copy should be:

- direct
- factual
- professional
- calm
- human

Avoid:

- tutorials inside the interface
- motivational slogans
- AI assistant language
- vague promises
- evaluative claims without evidence

Prefer:

"首次记录：25kg"

"最近一次：40kg"

"共记录 18 次，跨度 76 天"

A literal `25kg → 40kg` may be shown when both facts exist. AXIS should not automatically translate that into "变强了" or a score.

## Boundaries

AXIS should not become:

- a social feed
- a ranking system
- a generic life journal
- a task manager
- a chat-based AI coach

The product remains focused on one idea:

Real experiences accumulate into a personal evolution record.
