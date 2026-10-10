# AXIS 8.32 PLAY THIS — acceptance scenarios
#
# Contract-stage only. These scenarios are NOT yet wired to a runner and are
# NOT evidence that a user-facing 8.32 surface exists. 8.32b must implement
# a Playwright/Gherkin-equivalent executable runner against the canonical
# assembled runtime and retain scenario IDs in reports.
#
# Sources: docs/AXIS_832_PLAY_THIS_EXPERIENCE.md,
#          docs/EXPERIENCE_QUALITY_STANDARD.md
# Test harness setup MUST record:
#   - exact source HEAD, built release/manifest and Chromium/WebKit engine
#   - canonical state before/after each explicit action
#   - real click/tap count and time to existing interactive owner
#   - screenshots at requested viewport/theme/locale
# Never assert success from a simulated Encounter, mock owner acknowledgement,
# Playable projection alone, or an optimistic UI flag.

@axis832 @contract
Feature: PLAY THIS enters truthful local practice from familiar AXIS surfaces

  Background:
    Given the canonical single-runtime AXIS release is loaded locally
    And optional AI, account, camera and network services are unavailable
    And canonical Encounter, Session, FlowRun and Recorder writers remain existing owners

  @P01 @object @native
  Scenario: Native Object enters practice without an extra dashboard
    Given a unique native Object with exact canonical ID "chest-row" is visible
    And no Active or FlowRun conflict exists
    When the user activates "开始练习" from that Object
    Then the existing recording or Active owner becomes interactive within two intentional actions
    And the selected Object ID is exactly "chest-row"
    And no Encounter is committed before real user confirmation
    And no new standalone page, timer or recording owner is mounted

  @P02 @object @custom
  Scenario: Custom Object retains its exact ID and resolved metric schema
    Given a saved custom Object with ID "custom-practice-832" and a metric override
    And no other exercise is active
    When the user starts it from its real canonical library context
    Then the existing Recorder opens with ID "custom-practice-832"
    And the appropriate existing metric and execution schema is used
    And no native item sharing its name is silently substituted

  @P03 @object @identity
  Scenario: Matching names and shared family IDs never collapse identity
    Given two native Objects have different canonical IDs and identical display names
    And both share a non-authoritative family baseId
    When the user starts the second exact Object
    Then the resulting existing Recorder selection uses the second canonical ID
    And the family baseId is never treated as the Encounter equipmentId

  @P04 @flow @multi
  Scenario: Saved Flow starts from its existing Home rail
    Given a valid saved Flow has two distinct canonical Object references
    And no current FlowRun or Active conflict exists
    When the user activates "开始练习" on the existing Flow section
    Then the existing FlowRun owns the exact Flow definition and ordered steps
    And the first item's existing Recorder or Active owner is interactive within two deliberate taps
    And only one visible primary start action belongs to this flow
    And an intent launch has not yet fabricated an Encounter

  @P05 @flow @fact
  Scenario: Only canonical Encounter provenance advances a Flow
    Given a Flow is currently executing its first step
    When the existing Recorder confirms a real Encounter for its exact Object
    Then the canonical FlowRun is updated only on exact committed Encounter evidence
    And Flow provenance contains the exact flowRef, flowStepRef and objectRef
    And no earlier history item or display-name match can advance the current Flow

  @P06 @conflict @flow
  Scenario: A different active Flow never gets replaced without consent
    Given Flow "flow-a" already owns an active run
    When the user requests PLAY THIS on Flow "flow-b"
    Then the current practice remains Flow "flow-a"
    And "继续当前练习" is a clear primary recovery action
    And no launch, finish, reset, reordering or Encounter write occurs for "flow-b"

  @P07 @conflict @active
  Scenario: A different Active exercise remains authoritative
    Given an existing Active exercise owns an in-progress Encounter
    When the user requests a different Object using PLAY THIS
    Then the Active exercise continues unchanged
    And the UI visibly explains that a practice is already running
    And a direct switch is not offered as the default action

  @P08 @resume @same
  Scenario: The same currently executing practice uses Continue
    Given the requested exact Object or Flow is already executing
    When its entry surface is rendered
    Then "继续当前练习" is the single primary action
    And starting it again cannot create another FlowRun or canonical Encounter

  @P09 @missing @object
  Scenario: A removed Object does not fall back to same-name or family identity
    Given a saved Flow refers to a removed canonical Object ID
    And another Object has a similar name or family baseId
    When the user requests PLAY THIS
    Then the entry shows a recoverable unavailable Object state
    And no implicit substitution, mutation or owner dispatch happens
    And the valid current Session or Flow is preserved

  @P10 @invalid @flow
  Scenario: An empty, unsupported or excessively large Flow does not start
    Given a Flow is empty, exceeds the bounded step count, or has unsupported execution semantics
    When the user tries to start it
    Then an explicit recoverable validation state appears
    And no FlowRun, Encounter or stored attempt is created

  @P11 @idempotency @rapid
  Scenario: Rapid double activation creates no duplicate owner effect
    Given a valid Object or Flow is ready to start
    When the user activates the primary action twice in rapid succession
    Then at most one canonical transition into the existing owner is accepted
    And the button remains stable in pending and disabled visual states
    And there are no duplicate Encounters or Flow step advances

  @P12 @stale @reload
  Scenario: Reload discards stale UI intent and uses persisted owner truth
    Given a valid Flow is partially executed with a confirmed Encounter
    When the app reloads while an old PLAY THIS request is pending
    Then current FlowRun and canonical Encounter history determine the next action
    And a stale command is rejected without an automatic retry side effect
    And the user can continue the next real step
    And no earlier completed step replays

  @P13 @offline
  Scenario: Launch and confirmation work without a network or account
    Given all optional HTTP requests fail and no account is configured
    And a native Object and saved Flow exist locally
    When the user begins, records and returns to the existing training view
    Then the canonical local Recorder/Active/Encounter chain remains usable
    And the UI never blocks on AI, camera, sensor or cloud availability

  @P14 @cancel @purity
  Scenario: Preview, escape, cancellation and invalid command do not write history
    Given a ready Flow with no active execution
    When the user opens and dismisses PLAY THIS without beginning
    Then the canonical persisted Session, Encounter and FlowRun facts are unchanged
    And no independent PLAY THIS storage namespace appears

  @P15 @visual @responsive
  Scenario Outline: Flow and Object controls retain AXIS geometry
    Given an exact native or custom Object and a saved Flow have long localized labels
    And the viewport is "<width>" CSS pixels wide
    When each local entry is rendered in "<theme>" with "<locale>"
    Then the entry aligns with the current AXIS Home or Object content rail
    And no horizontal overflow, clipped label, overlaid dock or layout shift affects interaction
    And the touch target is at least 44 CSS pixels in both dimensions
    And no competing visually dominant primary action or duplicate timer is visible
    And the browser screenshot is captured for optical review
    Examples:
      | width | theme | locale  |
      | 320   | dark  | zh-Hans |
      | 360   | light | en      |
      | 390   | dark  | zh-Hant |
      | 430   | light | zh-Hans |

  @P16 @visual @accessibility
  Scenario: Focus, enlarged text and reduced motion remain usable
    Given the user enables reduced motion and larger text
    When PLAY THIS and its recovery states are navigated with keyboard and touch
    Then focus order and return location are predictable and visible
    And the control remains reachable and readable above safe-area and navigation regions
    And active/disabled/warning states are not distinguishable only by color
    And no decorative animation or motion-dependent success replaces a factual state

  @P17 @visual @theme
  Scenario: Theme first paint and user-visible vocabulary fit AXIS
    Given the app is configured for light or dark appearance
    When a cold local load renders PLAY THIS in any supported locale
    Then no wrong-theme flash or mixed-language control is displayed
    And the surface uses the existing AXIS design tokens and optical hierarchy
    And neither "PlayableSpec" nor "FlowRun" nor internal command/error IDs appear as visible copy

  @P18 @flow @repeat
  Scenario: Repeating a completed Flow begins only by explicit new intent
    Given a completed Flow has already produced exact canonical Encounters
    When the completed Flow becomes visible again after reload
    Then it is not automatically active
    And no new attempt can claim those historical Encounters as new completion
    And a repeat requires an explicit new user action and fresh owner preflight

  @P19 @visual @handoff
  Scenario: Ownership handoff removes the entry while recording is interactive
    Given PLAY THIS has successfully handed control to the existing Recorder or Active owner
    When the recording interface becomes interactive
    Then no competing PLAY THIS primary button, timer or overlay obscures it
    And the original safe-area, focus and recording layout remain visually stable

  @P20 @performance @measurement
  Scenario: Real timing evidence is recorded instead of guessed
    Given a cold launch and a warm in-progress session are tested in Chromium and iPhone-like WebKit
    When an Object and Flow PLAY THIS entry each open the existing interactive owner
    Then the test report records deliberate action count and measured input-to-interactive latency
    And the report records CSS viewport, engine, locale, theme, layout shifts and source SHA
    And no invented benchmark or unverified aesthetic pass is asserted
