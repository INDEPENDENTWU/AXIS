# Current Work

## Production baseline

The exact Production baseline is merged main `621b93837b8d56982a990abb00d86b758b421337`, AXIS **8.21**.

That SHA is dual-provider Production-sealed:

- fixed Vercel Production serves the exact main artifact;
- fixed EdgeOne Production mirrors the same exact prebuilt artifact;
- Production Chromium and iPhone-like WebKit current-release flows pass;
- the previous recording-geometry investigation retained the strict `0.5px` stability threshold and its automatic diagnostic trigger is retired.

Fixed endpoints remain:

- Vercel Production: `https://axis-five-puce.vercel.app`
- EdgeOne Production: `https://axisfitness-mirror-9x91gveo.edgeone.cool`
- public/base release identity: **8.21**
- architecture: `canonical-single-runtime`

The governed milestone remains **AXIS 8.21 — Flow / Session Blueprint**.

## Active change

**AXIS 8.21 — Flow / Active Session Coordination**

- branch: `hotfix/821-flow-active-session-coordination`
- base: `621b93837b8d56982a990abb00d86b758b421337`
- intended public identity change: **none; remains 8.21**
- intended factual ownership change: **none**

Manual iPhone Production testing reproduced a real integration gap: a Flow may be waiting on `开始此项` while an unrelated standalone Activity is already running. Tapping the Flow action can silently fail for some current Objects, and the Flow surface does not yet coordinate the existing Active/paused lifecycle or present the current Flow item with the same mature execution language.

The architecture inspection confirms that existing v82/v87 Active truth already supports exactly the required safe model: one foreground Active Activity plus multiple paused Activities in the same canonical Session. Starting/resuming one Activity pauses the previous foreground Activity without finishing or discarding it. This work therefore **must reuse that owner** instead of introducing parallel Active state.

## Product contract for this work

Flow is a multi-Object Session Blueprint:

```text
Flow owns: ordered intent + current step + overall progress + planned duration context
Active owns: current Object timing + pause/resume + rest + sets/rounds/timed/hold execution + finish
Encounter owns: immutable factual record
```

For `A → B → C`:

1. Flow makes A current.
2. `开始此项` opens the existing canonical recorder for A only when a factual Encounter is needed.
3. If another Activity X is running, Flow must never silently fail and must never destroy X. A small coordination surface explains that starting A will pause X; cancellation leaves X untouched.
4. After the canonical A Encounter commits, existing v82/v87 starts A and automatically pauses X.
5. Flow links to A's Encounter. Flow does not create another timer or Activity record.
6. The Flow presentation may project the same Active state and delegate actions to v82/v87, but it must not write Active truth itself.
7. Pausing A, resuming X, then returning to A must preserve both Activities correctly and must not create another A Encounter.
8. Finishing A through the established long-hold Active finish is the signal that consumes the Flow step and makes B current.
9. One-shot `single/complete` items still advance only after their canonical Encounter commit.
10. `临时记录其他` remains record-only: it must not start another Active, replace the current Flow Encounter, or advance the Flow cursor.

## Duration contract

A FlowRun may carry launch-only expected-duration snapshots derived from existing Object/history truth. This is planning context, not historical fact and not another timer owner.

- total expected Flow duration = sum of step expected durations;
- the current step may replace its launch estimate with the canonical Active `estimateMs` once that Activity actually starts;
- Flow elapsed time is derived from `FlowRun.startedAt`;
- remaining planned work is derived from unconsumed step estimates and the existing Active elapsed time;
- later editing of the reusable Flow or Object must not rewrite historical Encounters.

## UI contract

When a Flow item has not started, Today shows current/next item, overall expected duration and one clear `开始此项` action.

When an unrelated Activity is already foregrounded, starting/resuming the Flow item uses a native coordination sheet rather than a silent no-op.

When the Flow item is executing, Today must feel like the established AXIS Active experience. A Flow-integrated projection may show:

- Flow position (`1 / 3`), current and next Object;
- current item elapsed / expected / remaining time;
- Flow total expected / planned remaining time;
- Active status (`进行中` / `已暂停`);
- existing set completion where the execution mode is sets;
- pause/resume delegated to the existing Active owner;
- the established **long-hold** finish gesture delegated to the existing Active owner.

The floating v87 card must not duplicate the same linked Flow Activity at the same time. If a different standalone Activity is foregrounded while the Flow Activity is paused, the existing v87 card remains visible for that foreground Activity while the Flow surface truthfully shows its own item as paused.

## Release-blocking validation

The physical proof must reproduce the reported state, not a simplified empty-session case:

1. standalone Activity X is already active;
2. a saved Flow A → B is launched;
3. tapping `开始此项` for A produces a visible coordination decision, never a silent no-op;
4. cancelling leaves X active and creates no Encounter;
5. confirming opens the canonical A recorder, including modern/custom Object selection;
6. after canonical save, X is paused and A is active under the existing v82/v87 owner;
7. Flow links to exactly one A Encounter and remains on step A until A actually finishes;
8. set completion, pause/rest, resume and long-hold finish use existing Active truth;
9. X can be resumed, which pauses A; returning to A resumes the same A Activity rather than recording A again;
10. finishing A advances to B;
11. temporary-other recording does not start Active or advance Flow;
12. total/remaining expected duration is present and derived from Flow/Active truth;
13. Chromium and iPhone-like WebKit agree;
14. no second picker, recorder, Active owner, Encounter writer, Session writer or persistence namespace is introduced.

## Merge / Production discipline

Do not merge until the exact PR head is green across Repository, Work Continuity, Cross-Platform, Runtime, Runtime Foundation, Current Release Chromium/WebKit and Deep Compatibility. After merge, do not call the work complete until the exact resulting main SHA is served by fixed Vercel Production, mirrored exactly to EdgeOne, and the same Flow/Active coordination scenario passes real Chromium and iPhone-like WebKit Production verification.

Chat history is not authoritative project memory. Conversation history is supplemental only. GitHub governance, contracts, exact main, deterministic build output and Production evidence are authoritative.
