# AXIS 8.21 — Flow / Session Blueprint

Status: **current milestone architecture contract**

Public/base identity: **AXIS 8.21**

## 1. Product statement

AXIS Flow is a lightweight ordered Session Blueprint made from reusable Objects.

```text
Flow      = intended continuity across Objects
Active    = execution truth for one foreground Object plus paused Objects
Encounter = immutable factual history
```

A Flow is not a second workout database, not a second recorder, not a replacement for Object execution and not a new Active system.

The central rule remains:

> **One Object / item is the minimum Flow completion unit.**

But “item is the Flow unit” does **not** mean discarding the mature execution lifecycle inside that Object. The correct composition is:

```text
Flow A → B → C
      │
      ├─ A uses existing Active execution
      │    timing / sets / pause / rest / resume / long-hold finish
      │
      ├─ A finish consumes Flow step A
      ↓
      B becomes current
```

Flow owns sequencing. Existing v82/v87 owns execution.

## 2. Existing truths that remain authoritative

### Object

Object remains reusable identity/configuration truth. It may define recording properties and execution semantics such as:

```text
single | sets | rounds | timed | hold | complete
```

### Session / Encounter

`app.js` / `axis_v60_state` remains canonical Session/Object/Encounter truth. Exactly one existing Encounter append path remains authoritative.

### Active

Existing v82/v87 remains Active lifecycle truth. The established model already supports:

- one foreground `active` Activity;
- multiple `paused` Activities in the same canonical Session;
- switching/resuming by pausing the previous foreground Activity rather than silently finishing it;
- elapsed intervals;
- expected duration;
- set completion where applicable;
- pause-owned rest behavior;
- long-hold finish.

Flow must reuse this capability rather than introducing parallel Active state.

### Classic set facts

Where the immutable Encounter schema permits, existing v61 / `axis_v8_meta` classic set ownership remains unchanged.

## 3. Flow domain model

Reusable definition:

```text
Flow
 ├─ id
 ├─ title?                 optional
 └─ steps[]                ordered intent
     └─ FlowStep
         ├─ id
         └─ objectRef
```

Runtime snapshot:

```text
FlowRun
 ├─ flowRef
 ├─ startedAt
 ├─ steps[]                launch snapshot
 │    └─ expectedDurationMs? planning snapshot only
 ├─ expectedTotalMs?       sum of planning snapshots
 ├─ cursor
 ├─ currentEncounterId?    current Flow item's factual Encounter
 ├─ currentStepRef?
 ├─ consumedStepRefs[]
 ├─ skippedStepRefs[]
 └─ status                 active | complete
```

Flow definitions and the one current FlowRun remain inside existing app-owned `axis_v60_state`. There is no new database or localStorage namespace.

Expected-duration fields are planning context only. They are not historical truth and do not create a second timer owner.

## 4. Launch semantics

Starting a Flow:

1. snapshots the ordered steps;
2. snapshots reasonable per-step expected durations from existing Object/history truth;
3. starts/reuses the canonical containing Session;
4. makes step 1 current;
5. does **not** fabricate an Encounter;
6. does **not** fabricate an Active Activity;
7. does not disturb an unrelated Activity that is already running.

At this point Flow is ready; the first Object has not yet become factual execution.

## 5. Starting the current Flow item

### No other Activity is foregrounded

`开始此项` enters the existing canonical recorder for that Object. The recorder is still the only place that commits the factual Encounter needed by existing Active execution.

The Flow context may simplify the recorder presentation and preselect the correct Object, but must not add another recorder or writer.

### Another Activity is already foregrounded

This is a normal supported state, not an error.

Flow must not silently fail and must not destroy the running Activity. A native coordination surface explains the transition:

```text
正在进行
拉伸放松 · 15:41

开始 杠片式胸推 后，拉伸放松会暂停并保留进度。

[ 暂停当前并开始 ]
[ 继续当前项目 ]
```

Cancellation changes nothing.

Confirmation does not prematurely mutate Active truth. The old Activity is paused by the existing Active owner only after the new Flow Encounter is canonically committed and its Activity starts. Therefore cancelling the recorder also leaves the old Activity untouched.

## 6. Flow item execution

For ongoing modes (`sets`, `rounds`, `timed`, `hold`):

1. canonical Encounter commits;
2. existing v82/v87 creates/starts Activity for that Encounter;
3. existing Active owner pauses any previously foregrounded Activity;
4. Flow links `currentEncounterId` to this exact Encounter;
5. Flow cursor does not advance yet;
6. all execution semantics remain owned by Active.

The Flow surface may **project** the same Active state so the experience feels native and coherent. Projection is allowed to show and delegate:

- item elapsed time;
- item expected / remaining time;
- set progress where applicable;
- Active status;
- pause / resume;
- rest state;
- complete-set action where applicable;
- the existing long-hold finish gesture.

Projection must call the existing Active owner. It must never write Active metadata directly.

The floating v87 card must not simultaneously duplicate the same linked Flow Activity. If another standalone Activity is foregrounded while the Flow Activity is paused, v87 remains visible for that other Activity and Flow truthfully shows its own item as paused.

## 7. Switching between Flow and standalone Activities

Suppose Flow item A is running, then the user resumes paused standalone X:

```text
A active → resume X → A paused, X active
```

Flow remains on A and retains the same `currentEncounterId`.

Returning to Flow A:

```text
A paused + X active
  ↓
user chooses Continue A
  ↓
existing Active owner pauses X and resumes A
```

No second A Encounter is created. Flow never advances from switching alone.

## 8. Completing an item

For ongoing modes, the only Flow completion signal is the **existing Active finish** for the matching `currentEncounterId`.

After authoritative Active finish:

1. matching Flow step is consumed;
2. cursor increments;
3. the next Object becomes current;
4. the next Object is **ready**, not automatically fabricated as Active;
5. after the final matching finish, Flow becomes complete.

For one-shot `single` / `complete` modes, there is no persistent Activity. The step advances only after its canonical Encounter commit.

## 9. Skip, temporary other and early Flow finish

### Skip

Skip is available only before the current Flow item has started.

- no Encounter;
- no fake failure;
- cursor advances.

Once the Flow item has a linked Activity, users use the mature Active finish/switch controls rather than pretending the item never started.

### Temporary other

`临时记录其他` is a factual detour.

It uses the existing picker + recorder but is **record-only**:

- normal Encounter history;
- no Flow provenance;
- no Flow cursor advance;
- no replacement of `currentEncounterId`;
- no new Active Activity, even when the chosen Object would normally be ongoing.

### Finish Flow early

Ending Flow early removes Flow orchestration only. It must not silently finish or corrupt a currently running Activity. If a Flow-linked Activity is still active, the UI must state that the item remains a normal standalone Active unless the user separately finishes it.

## 10. Expected duration

A Flow provides useful planning time without becoming another timer owner.

At launch:

- each run step receives a best-effort `expectedDurationMs` snapshot derived from existing Object/history truth;
- `expectedTotalMs` is the sum.

When a linked Activity actually starts, the current step adopts the canonical Active `estimateMs`, because that is more authoritative than the launch guess.

Display may derive:

```text
Flow elapsed            = now - FlowRun.startedAt
Current item elapsed    = existing Active elapsed intervals
Current item remaining  = max(0, estimate - Active elapsed)
Planned Flow remaining  = remaining current estimate + future step estimates
```

Labels must remain approximate (`约`, `预计`, `计划剩余`) where appropriate. These values are planning context, not immutable Encounter facts.

## 11. Today UI contract

### No Flow

Compact entry only:

```text
流程                                      + 新建
```

### Saved, not running

Show one concise saved Flow summary and clear start/edit actions.

### Running, item not started

```text
流程 · 1 / 3                              全部
当前项目
杠片式胸推
接下来 · 杠铃卧推

预计总时长 约42分 · 计划剩余约42分

[ 开始此项 ]
```

If another Activity is running, add a restrained factual hint rather than disabling the button.

### Running, linked item executing

The Flow surface becomes an integrated projection of the existing Active state:

```text
流程 · 1 / 3                              全部
杠片式胸推
接下来 · 杠铃卧推

进行中                         本项 03:42 / 约15分
计划剩余约34分
──────── progress ────────

[ 完成一组 ]        休息 / 组信息
[ 暂停 ]            [ 长按完成此项 ]
```

Exact controls depend on execution mode. There is no fake `完成一组` for timed/hold/complete items.

### Linked Flow item paused while another Activity runs

Flow shows `已暂停` and a clear `继续此项`. The ordinary Active surface remains visible for whichever different Activity is actually foregrounded.

### Complete

Concise factual completion. No score, streak or forced success screen.

## 12. Truthfulness and history

- Flow never fabricates weight, reps, sets, pace, intensity or other unconfirmed values.
- Flow definitions edited later never rewrite historical Encounter provenance.
- zero-property Objects remain valid.
- temporary-other Encounters remain ordinary facts without Flow provenance.
- Active timing remains Active truth; Flow planning time remains run context.

## 13. Release-blocking invariants

8.21 must fail release if any of the following occurs:

- `开始此项` silently does nothing for a valid current Object;
- modern/custom Objects cannot be opened reliably through the canonical Quick Record route;
- starting a Flow item destroys or finishes an unrelated active Activity;
- cancelling a Flow start pauses the unrelated Activity;
- starting Flow item A creates more than one A Encounter;
- resuming a paused A creates another A Encounter;
- switching Activities advances Flow;
- a matching ongoing Flow step advances before authoritative Active finish;
- `临时记录其他` starts another Active or advances/replaces Flow current state;
- Flow writes Active metadata directly;
- Flow creates a second recorder, picker, Active owner, Encounter writer, Session writer or persistence store;
- the same linked Flow Activity is rendered simultaneously as two competing Active surfaces;
- Chromium and iPhone-like WebKit disagree on switching, pause/resume, finish or saved truth;
- fixed Vercel and EdgeOne Production artifacts fail the same physical coordination scenario.

## 14. Physical reference scenario

Use existing standalone Activity X plus Flow `A → B`:

1. X is already active with elapsed time;
2. launch Flow; A is ready, X remains active;
3. tap `开始此项` → coordination surface appears;
4. cancel → X remains active, no A Encounter;
5. tap again, confirm → canonical recorder opens directly on A;
6. save A → one A Encounter, X becomes paused, A becomes active;
7. Flow shows A runtime from existing Active truth; no duplicate A v87 surface;
8. complete one set where applicable; Flow stays on A;
9. pause/resume retains A state;
10. resume X → A pauses, X becomes active, Flow stays on A;
11. choose `继续此项` → X pauses, same A resumes, no extra A Encounter;
12. long-hold finish A → A finishes, Flow moves to B;
13. temporary-other ongoing Object records history but creates no Activity and does not move B;
14. total expected / remaining duration remains coherent;
15. repeat in Chromium and iPhone-like WebKit, then fixed Vercel and EdgeOne Production.
