# AXIS 8.21 — Flow / Session Blueprint

Status: **current milestone architecture contract**

Baseline public identity: **AXIS 8.20.1** until the 8.21 product + Production seal is complete.

## 1. Product statement

AXIS Flow is a lightweight ordered sequence of reusable Practice Objects.

```text
Flow = intended continuity
Encounter = factual history
```

A Flow is not a second workout database, not a set planner, not a calendar, not a completion score and not another recorder.

The central 8.21 rule is:

> **In Flow execution, one Object / item is the minimum completion unit.**

For a Flow `A → B → C`, the user experience is:

```text
start Flow
  ↓
A current
  ↓ complete item
B current
  ↓ complete item
C current
  ↓ complete item
Flow complete
```

It is explicitly **not**:

```text
Flow → Quick Record setup → Object Active → set 1 → set 2 → ... → maybe next Flow step
```

That extra nesting is a standalone Object execution concern and is the wrong abstraction for Flow.

## 2. Existing truths that remain owned elsewhere

### Object

Object remains reusable identity and configuration truth. It may define recording properties such as weight, reps, duration, pace, intensity, rating or completion.

### Standalone Object execution

Camera Record and Quick Record keep existing Object execution semantics and owners:

```text
single | sets | rounds | timed | hold | complete
```

Classic strength Group Plan / set execution remains the standalone Object path. Flow does not duplicate or replace it.

### Encounter

Encounter remains immutable factual history. Existing snapshots remain authoritative:

- Object identity;
- `metricSchemaSnapshot`;
- `executionModeSnapshot`;
- metrics actually recorded;
- media/evidence references where applicable.

Flow may add frozen provenance, but it never becomes the owner of historical facts.

## 3. Flow domain model

```text
Flow
 ├─ id
 ├─ title?            optional
 └─ steps[]           ordered intent
     └─ FlowStep
         ├─ id
         └─ objectRef
```

Compatibility fields such as temporary metric/execution overrides may remain readable during 8.21 migration, but the user-visible item-unit Flow must not require a separate configuration screen before an item can be completed.

Runtime:

```text
FlowRun
 ├─ flowRef
 ├─ steps[]                 launch snapshot
 ├─ cursor                  current item index
 ├─ itemStartedAt
 ├─ consumedStepRefs[]
 ├─ skippedStepRefs[]
 └─ status                  active | complete
```

Flow definitions and the one current FlowRun continue to live in the existing app-owned `axis_v60_state` boundary. 8.21 does not add another database or localStorage namespace.

## 4. Start semantics

Starting a Flow must:

1. snapshot the ordered steps;
2. start/reuse the existing containing Session;
3. set cursor to item 1;
4. make item 1 immediately current on Today;
5. **not** open Quick Record;
6. **not** open Object property configuration;
7. **not** create a set/timed/hold Active lifecycle merely because the current Object normally supports one.

The user has already chosen the Object when composing the Flow. Starting it must therefore feel immediate.

## 5. Complete-current semantics

The primary Flow action is **完成此项**.

Completing the current item:

1. commits exactly one factual Encounter for that Object using the existing app-owned Encounter writer;
2. records one-shot Flow execution (`executionModeSnapshot: complete`);
3. freezes Flow provenance (`flowRef`, `flowStepRef`, `objectRef`, step snapshot);
4. may truthfully capture automatic facts such as item elapsed time / completion when the Object schema supports them;
5. must not fabricate weight, reps, sets, pace, intensity or other values from historical defaults;
6. marks that FlowStep consumed;
7. increments the cursor immediately;
8. sets the next item current with no confirmation/success interstitial;
9. completes the Flow after the last item.

The Object's configured metric schema may still be snapshotted for history/context. Optional future inline value entry may use the same canonical metric controls, but values cannot be mandatory for Flow progression and must never require a detour through standalone Quick Record.

## 6. Skip, detour and finish early

### Skip

Skip changes intent only:

- no Encounter;
- no fake failure;
- cursor moves to the next item.

### Temporary other

`临时记录其他` opens the ordinary standalone Quick Record path.

That Encounter:

- is normal factual history;
- has no Flow provenance;
- does not consume or advance the current Flow item;
- returns the user to the same Flow cursor afterwards.

### Finish early

Finishing early is valid. No percentage, grade, streak or failure state is required.

## 7. Flow vs Group Plan boundary

The two concepts must remain separate:

```text
Flow       = sequence of Objects / items
Group Plan = set-level execution inside a standalone compatible Object
```

A strength Object may still use Group Plan when launched independently through Quick Record. The same Object inside Flow is completed as one Flow item.

This distinction is deliberate: Flow is for continuity across activities; Group Plan is for detailed execution within one activity.

## 8. Today UI contract

Today is not a Flow feature landing page.

### No Flow

Flow occupies only a compact entry row:

```text
流程                         + 新建
```

No permanent explanatory marketing copy or large empty-state CTA.

### Saved, not running

A compact saved Flow surface may show:

- optional title, otherwise `N 个项目`;
- one non-duplicated chain summary;
- one clear `开始` action;
- edit/management as secondary action.

### Running

Running Flow earns prominent space because it is the user's current activity:

```text
流程 · 1 / 3                 全部
当前项目
槓片式胸推
接下来 · 槓铃卧推

[ 完成此项 ]

跳过      临时记录其他      结束
```

The next item is derived from the immutable launch snapshot (`run.steps[cursor + 1]`), not from stale UI hints.

### Complete

Completion is concise and factual. It may show completed/skipped item counts and a `收起` action. No gamified success screen is required.

## 9. History and truthfulness

A completed Flow item is one factual Encounter. The event may store additive `flowItem` timing facts such as:

```text
startedAt
completedAt
durationMs
```

Historical UI should describe it as an item completion, not render undefined legacy set values.

Editing, reordering or deleting the reusable Flow later must never mutate previous Encounter provenance.

Zero-property Objects are valid. Flow provenance therefore permits an empty `effectiveMetricIds` array.

## 10. Release-blocking invariants

8.21 must fail release if any of the following occurs:

- Flow current action opens Quick Record before the item can be completed;
- Flow exposes `完成一组` / set-level progression as its primary lifecycle;
- completing item 1 does not immediately make item 2 current;
- an ordinary Quick Record while Flow is active gains Flow provenance or advances the cursor;
- skip creates an Encounter;
- Flow creates a second Encounter writer, Session writer, Active owner, recorder or persistence store;
- a Flow item invents unconfirmed historical weight/reps/sets/metrics;
- first item of `1 / N` is labelled as the last item;
- empty Today is dominated by Flow education/marketing UI;
- Chromium and iPhone-like WebKit disagree on lifecycle or saved truth;
- fixed Vercel and EdgeOne Production artifacts fail the same physical Flow scenario.

## 11. Physical reference scenario

Use a three-item Flow `A → B → C`:

1. empty Today shows compact Flow entry;
2. save/compose A/B/C;
3. start → A is immediately `1 / 3`, no Quick Record sheet;
4. complete A → exactly one one-shot Encounter, then B is `2 / 3`;
5. ordinary Quick Record D → D has no Flow provenance, B remains current;
6. skip B → no B Encounter, C becomes `3 / 3`;
7. complete C → Flow complete;
8. no set-level Active metadata was created for A/C merely because they are strength Objects;
9. standalone Quick Record still behaves normally;
10. repeat on Chromium and iPhone-like WebKit, then on fixed Production URLs.

## 12. Release identity

The repository may contain 8.21 implementation work while the public release identity remains 8.20.1.

Only move the public version to **8.21** after:

- item-unit product semantics are physically green;
- recording-property UI remains green;
- Chromium + iPhone-like WebKit are green;
- Vercel exact main SHA is green;
- EdgeOne serves the same exact artifact and passes the same Flow checks.
