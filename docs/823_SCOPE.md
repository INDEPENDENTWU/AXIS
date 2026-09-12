# AXIS 8.23 — Replay Evidence Continuity

Bounded product stage selected from the live AXIS 8.22 implementation.

## Product problem

AXIS 8.22 Replay can move through every real Encounter, while the existing Media Evidence lens maintains its own independent visual selection. That can leave the Replay chronology focused on one Encounter while the Evidence surface is showing media from another Encounter. Even when both surfaces are individually factual, that separation weakens the Reveal and can make the visual evidence appear associated with the wrong moment.

## 8.23 behavior

Replay selection becomes the presentation anchor for Media Evidence:

- selecting a Replay point asks the existing v815 Evidence owner to align to that exact Encounter;
- if that Encounter has media, v815 shows that Encounter's existing evidence;
- if that Encounter has no media, v815 explicitly shows that this selected Encounter has no visual evidence instead of silently falling back to another date;
- the user may still deliberately choose another evidence-bearing Encounter inside the existing Evidence rail;
- selection remains transient UI state only.

## Ownership boundary

No new factual owner is introduced. v822 owns Replay chronology/selection presentation; v815 remains the Media Evidence presentation/read owner. AXIS 8.23 adds only a transient presentation handoff between those established owners.

No new storage, database, Session/Encounter writer, media writer, network call, AI call, scoring, ranking, prediction or historical rewrite is permitted.

## Release decision

This is a user-visible behavior change and therefore requires a public release bump from AXIS 8.22 to AXIS 8.23.
