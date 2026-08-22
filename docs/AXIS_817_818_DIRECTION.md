# AXIS 8.17 → 8.18 Product Direction

## Product thesis

AXIS is a **Personal Evolution Engine**.

The broad market does not come from adding separate Fitness / Running / Rehab / Climbing / Dance / Music tabs. It comes from one universal primitive:

**repeated Encounter + truthful evidence + time + observable change**.

The user should not maintain a system. Reality happens, AXIS keeps the evidence and the relationship becomes legible later.

## 8.17 — Interaction Convergence

8.17 removes old interaction concepts that survived after the underlying product had already moved forward.

### Capture

One place should answer one question: **do I want to leave evidence of this Encounter?**

Quick Record therefore has one supplemental entry. The Capture Field itself owns the choice between Photo, Scan and Video. Settings describes capability, not historical capture implementations.

### Evidence comparison

A normal user should not reason about `left/right selection mode`.

The visible model is:

**起点 ↔ 对照**

`对照` is the natural active point. Tapping time replaces it. Changing `起点` is an intentional secondary action. The images never disappear while the next real evidence is loading.

### Archive

The first scaling axis is time. Month grouping is enough to keep raw session history manageable without inventing folders or metadata work for the user.

8.17 is successful when the product feels simpler even though it can do more.

---

## 8.18 — Evolution Library / Personal Object Shelf

8.18 should solve the next real scaling problem: after hundreds or thousands of Encounters, **what has all of this become?**

The answer is not a longer Record list. It is a library of stable Evolution Objects.

### One universal object

An Evolution Object represents one repeated relationship in reality.

Examples:

| Domain | Evolution Object |
| --- | --- |
| Strength training | 高位下拉 / 深蹲 / a specific machine |
| Running | a recurring route or segment |
| Climbing | a route/problem |
| Rehabilitation | a repeated movement or range task |
| Dance | a movement / sequence |
| Sport | a repeated skill or drill |
| Music | a passage / technique |

The UI does not need a category switch to understand these as different products. Domain adapters only change the factual summary of the same underlying object.

### The Shelf

The primary 8.18 surface should feel closer to a private collection of things that have accumulated history than a dashboard.

Suggested states:

- **最近更新** — objects with a recent truthful Encounter;
- **长期形成** — objects with meaningful time span / recurrence;
- **暂时停下** — objects with real history but no recent Encounter.

These are projections, not folders. The object exists once.

### What an object shows

At shelf level, keep it extremely restrained:

- name / identity;
- latest real Encounter date;
- number of Encounters;
- relationship span;
- evidence presence / density where useful;
- one real visual if available.

Do not show a generic score, streak pressure, improvement verdict or motivational copy.

Opening the object enters the existing Evolution surface: factual first/latest, Evidence timeline, Compare, and later Replay.

### User control

The user may eventually:

- pin an important object;
- rename or reconcile identity when reality produced duplicate names;
- archive an object from the active shelf without deleting its history.

The user should not be asked to manually create folders, tags or content collections.

### Identity continuity

8.18 must begin hardening stable identity across imperfect historical IDs / names. This is necessary for broad-domain use.

Identity resolution should prefer real canonical IDs when they exist, then restrained deterministic aliases/context. It must never silently merge obviously different real-world objects merely because their names look similar.

### Evolution Portrait

8.18 can introduce the first static **Evolution Portrait** as an object artifact:

- factual start / latest endpoints;
- time span;
- Encounter count;
- real evidence count;
- domain-appropriate factual deltas where comparable;
- no score;
- no motivational sentence;
- no creator editing.

This gives the user a strong Reveal even when Replay evidence is not yet dense enough.

---

## 8.19 — Truthful Evolution Replay

Replay should come after Capture, selection semantics and object identity are stable.

Replay is not a video editor. It is **time compression of one Evolution Object**.

Rules:

- use real Encounter-bound evidence only;
- no fake missing moments;
- 0/1 media Encounter: no Replay;
- 2 media Encounters: truthful endpoint sequence;
- 3+ media Encounters: first + temporally representative middle evidence + latest;
- multiple photos from one Encounter remain one timeline moment;
- real dates and factual summaries stay attached;
- user explicitly starts playback;
- no autoplay, BGM, templates, publishing workflow or generated motivation.

---

## Wider potential users

AXIS should broaden by supporting more forms of repeated reality without increasing conceptual weight.

The same person may use AXIS for strength training today, a running route tomorrow and rehabilitation later. The product should not force them to understand three separate tracking systems. Each repeated thing simply acquires Encounters and becomes an Evolution Object over time.

The differentiator is therefore not `more kinds of tracking`. It is:

> **AXIS turns repeated real-world encounters into private personal objects that become more valuable with time.**

That direction is compatible with future native capabilities such as Camera, Live Photo, route/motion context, Watch, HealthKit, widgets and haptics, while keeping the core product useful locally and without AI/network dependency.
