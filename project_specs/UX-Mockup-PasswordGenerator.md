# UX Mockup: Password Generator

**Project:** Password Generator
**Generated:** 2026-05-04
**Based on:** UserStories-PasswordGenerator.md, JOURNEYS-PasswordGenerator.md, PRD-PasswordGenerator.md, FRD-PasswordGenerator.md
**WCAG Target:** 2.1 AA

---

## Overview

The Password Generator is a single-screen tool with one job: produce a strong password and get it into the user's clipboard in under 10 seconds. The UX is organized around a single page divided into three vertical zones:

1. **Output Zone** — the password display and copy action (highest visual priority)
2. **Configuration Zone** — length and character set controls
3. **Action Zone** — the Generate button and strength indicator

Design principles driving every decision:
- **Zero clicks to first result** — a password is pre-generated on page load so Alex can copy immediately without configuring anything.
- **Auto-regenerate on change** — any configuration change (slider, toggle) instantly produces a new password, eliminating "did the toggle take effect?" ambiguity for Alex (JRN-01.2) and Maya (JRN-02.1).
- **Keyboard-first parity** — every action is reachable and operable without a mouse, with a logical tab order: Length → Toggles → Generate → Copy (JRN-03.1).
- **Trust signals everywhere** — monospace font, entropy-based strength label, silent network, readable source code.

---

## User Flows

### Flow 1: Instant Generate and Copy (Zero-Configuration)

**Trigger:** User lands on the page
**User Stories:** US-0.1, US-1.4, US-2.6, US-3.1, US-3.2, US-4.1, US-5.1, US-5.2, US-6.1
**Journeys:** JRN-01.1 (Alex — new signup)

```
[Page Load]
    │
    ▼
[Auto-generate password with defaults]
[Length=16, all 4 sets enabled]
    │
    ▼
[Password Display shows result]
[Strength Bar shows "Very Strong" / green]
    │
    ▼
[User clicks "Copy" button]
    │
    ├── Success ──▶ [Button shows "Copied!" for 2s]
    │                    │
    │                    ▼
    │              [Label reverts to "Copy"]
    │              [User pastes into signup form]
    │
    └── Both APIs fail ──▶ [Inline error: "Copy failed. Please select
                            and copy the password manually." — 5s dismiss]
```

**Steps:**
1. Page loads; generation engine runs immediately with `{ length: 16, enabledSets: ["uppercase","lowercase","numbers","symbols"] }`.
2. Password output field displays the generated password in monospace font.
3. Strength bar displays at 100% width, green, labeled "Very Strong".
4. User clicks "Copy" — `navigator.clipboard.writeText()` is called.
5. Button label changes to "Copied!" with a checkmark icon for exactly 2 seconds.
6. Label reverts to "Copy"; user switches to signup form and pastes.

---

### Flow 2: Adjust Configuration and Re-generate

**Trigger:** User needs to comply with site character restrictions or set an exact length
**User Stories:** US-1.1, US-1.2, US-1.3, US-2.1–US-2.4, US-2.5, US-3.1, US-5.4
**Journeys:** JRN-01.2 (Alex — restrictions), JRN-02.1 (Maya — provisioning)

```
[Existing password displayed]
    │
    ├── User drags Length Slider ──▶ [Slider & numeric input sync instantly]
    │                                [Length label updates: "Length: NN"]
    │                                [New password auto-generated]
    │                                [Strength bar updates]
    │
    ├── User types in Length Input ──▶ [On blur: value clamped to [8,128]]
    │                                  [Slider syncs to clamped value]
    │                                  [New password auto-generated]
    │
    └── User toggles a character set
            │
            ├── Not last set ──▶ [Toggle unchecks]
            │                    [enabledSets updated]
            │                    [New password auto-generated]
            │                    [Strength bar updates]
            │
            └── Last set ──▶ [Toggle stays checked — snaps back]
                              [Inline message: "At least one character
                               set must be selected." — 3s dismiss]
```

**Steps:**
1. User arrives at the page with a previously generated password still visible.
2. To change length: drags slider or types in numeric field — both controls stay in sync at all times.
3. To restrict character types: unchecks the appropriate toggle(s); password updates immediately on each change.
4. Attempting to uncheck the last active toggle shows the Last Active Guard message and the toggle snaps back to checked.
5. Strength indicator reflects the new configuration in real time — user can see projected strength before clicking Generate.
6. User copies the updated password.

---

### Flow 3: Keyboard-Only Generate and Copy

**Trigger:** User wants to complete the full workflow without touching the mouse
**User Stories:** US-6.2, US-4.4, US-1.1, US-2.1–US-2.4
**Journeys:** JRN-03.1 (Jordan — keyboard-first mid-sprint)

```
[Focus enters page]
    │
    ▼
[Tab] ──▶ Length Slider focused
    │      (ArrowLeft/Right adjusts value)
    │
[Tab] ──▶ Length Numeric Input focused
    │
[Tab] ──▶ Uppercase Toggle focused (Space toggles)
[Tab] ──▶ Lowercase Toggle focused (Space toggles)
[Tab] ──▶ Numbers Toggle focused (Space toggles)
[Tab] ──▶ Symbols Toggle focused (Space toggles)
    │
[Tab] ──▶ Generate Button focused
    │
[Enter/Space] ──▶ Password generated
    │              Focus returns to Generate button
    │
[Tab] ──▶ Copy Button focused
    │
[Enter/Space] ──▶ Password copied; "Copied!" shown
    │
[Tab] ──▶ Password Display focused
    │      (Ctrl+C / Cmd+C also copies from here)
```

**Steps:**
1. User tabs into the page — first focusable element is the Length Slider.
2. Tab order follows reading order: Slider → Numeric Input → four toggles → Generate → Copy → Password Display.
3. Enter or Space on Generate produces a new password; focus is returned to the Generate button so the user can press Enter again immediately.
4. One Tab moves focus to Copy; Enter/Space copies to clipboard.
5. Entire flow completes in ≤ 5 keystrokes from Generate to clipboard (Tab → Enter [Generate] → Tab → Enter [Copy]).

---

### Flow 4: Batch Sequential Generation

**Trigger:** User needs to generate multiple distinct passwords in one session
**User Stories:** US-0.4, US-3.1, US-4.1, US-6.1
**Journeys:** JRN-03.2 (Jordan — seeding test data)

```
[Configure once: length=32, all sets on]
    │
    ▼
[Click/press Generate] ──▶ [Password 1 displayed]
    │
[Click/press Copy] ──▶ [Copied! — paste into script]
    │
[Click/press Generate] ──▶ [Password 2 displayed — distinct from Password 1]
    │
[Click/press Copy] ──▶ [Copied! — paste into script]
    │
    ... (repeat N times) ...
    │
    ▼
[Settings have not changed — no reconfiguration needed]
```

**Steps:**
1. User configures length and sets once at the start of the session.
2. Clicks/presses Generate; a distinct new password appears in < 50ms — no page reload, no spinner.
3. Copies and pastes; then immediately generates again — the previous password is replaced with a new one.
4. Configuration persists unchanged throughout all iterations.

---

### Flow 5: Error Recovery

**Trigger:** An error occurs during generation or copy
**User Stories:** US-0.2, US-4.2, US-6.4
**Journeys:** JRN-02.1, JRN-02.2

```
[User clicks Generate]
    │
    ├── CRYPTO_UNAVAILABLE ──▶ [Persistent inline error below button:
    │                           "Secure generation unavailable.
    │                            Please use a modern browser."]
    │                           [No password generated or displayed]
    │
    └── Unexpected error ──▶ [Inline error: "Password generation failed.
                               Please try again." — 5s dismiss]

[User clicks Copy]
    │
    ├── navigator.clipboard fails ──▶ [Silent fallback to execCommand]
    │                                  [If execCommand succeeds: "Copied!" shown]
    │
    └── Both methods fail ──▶ [Inline error: "Copy failed. Please select
                                and copy the password manually." — 5s dismiss]
```

---

## Screen Design

### Screen: Password Generator (Single Page)

**Purpose:** All functionality lives on one page — configure, generate, copy.
**User Stories:** All (US-0.1 through US-6.4)

---

#### Layout — Desktop (>1024px)

```
┌─────────────────────────────────────────────────────────────┐
│  [PAGE HEADER]                                              │
│  Password Generator                    [optional tagline]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  PASSWORD OUTPUT ZONE                                 │  │
│  │                                                       │  │
│  │  ┌────────────────────────────────────┐  ┌────────┐  │  │
│  │  │  [monospace password / placeholder] │  │  Copy  │  │  │
│  │  └────────────────────────────────────┘  └────────┘  │  │
│  │                                                       │  │
│  │  [Strength Bar ████████████░░░] Very Strong           │  │
│  │                                                       │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  CONFIGURATION ZONE                                   │  │
│  │                                                       │  │
│  │  Length: 16                                           │  │
│  │  [════════════●════════════════] [  16  ]             │  │
│  │   8                          128                      │  │
│  │                                                       │  │
│  │  Character Sets                                       │  │
│  │  [✓] Uppercase letters (A–Z)                          │  │
│  │  [✓] Lowercase letters (a–z)                          │  │
│  │  [✓] Numbers (0–9)                                    │  │
│  │  [✓] Symbols (!@#$%…)                                 │  │
│  │                                                       │  │
│  │  [inline validation message area — hidden by default] │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  ACTION ZONE                                          │  │
│  │                                                       │  │
│  │        ┌─────────────────────────┐                    │  │
│  │        │   Generate Password     │                    │  │
│  │        └─────────────────────────┘                    │  │
│  │                                                       │  │
│  │  [inline error message area — hidden by default]      │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

#### Layout — Mobile (<768px)

```
┌──────────────────────────────┐
│  Password Generator          │
├──────────────────────────────┤
│                              │
│  ┌────────────────────────┐  │
│  │  [password / placeholder│  │
│  │   — wraps or scrolls]  │  │
│  └────────────────────────┘  │
│  ┌────────────────────────┐  │
│  │        Copy            │  │
│  └────────────────────────┘  │
│                              │
│  [Strength Bar ████░░░]      │
│  Very Strong                 │
│                              │
│  Length: 16                  │
│  [════●════════════] [ 16 ]  │
│                              │
│  [✓] Uppercase (A–Z)         │
│  [✓] Lowercase (a–z)         │
│  [✓] Numbers (0–9)           │
│  [✓] Symbols (!@#$%…)        │
│                              │
│  [validation message area]   │
│                              │
│  ┌────────────────────────┐  │
│  │   Generate Password    │  │
│  └────────────────────────┘  │
│  [error message area]        │
│                              │
└──────────────────────────────┘
```

---

#### Information Hierarchy

| Priority | Content | Placement | Rationale |
|----------|---------|-----------|-----------|
| Primary | Generated password text | Top of content area, full width | The output is the core value; must be immediately visible (US-3.1, JRN-01.1) |
| Primary | Copy button | Immediately adjacent to password field | Single most common action after generation (US-4.1) |
| Primary | Strength indicator | Directly below password output | Provides instant confidence signal before copying (US-5.1, US-5.2, JRN-01.1 Verify stage) |
| Secondary | Generate Password button | Below configuration, prominent styling | Clear CTA; below config because user configures then generates (US-6.1) |
| Secondary | Length control (slider + input + label) | Top of configuration zone | Most commonly adjusted setting; slider is fast, input is precise (US-1.1, US-1.2, US-1.3) |
| Secondary | Character set toggles | Below length control | Less frequently adjusted than length for most users (US-2.1–US-2.4) |
| Tertiary | Inline validation / error messages | Adjacent to the control that triggered them | Contextual; only appear when needed (US-2.5, US-6.4) |

---

## Component Designs

### Component: Password Output Field

**User Stories:** US-3.1, US-3.2, US-3.3, US-4.4
**Feature:** F3

```
┌──────────────────────────────────────────────────────────┐
│  k#9Lm$vQ2rXpT8nJ@wYc5dZ!bF6hA                 [cursor] │
└──────────────────────────────────────────────────────────┘
```

**Specifications:**
- Element: `<input type="text" readonly>` (enables native Ctrl+C/Cmd+C copy via keyboard)
- Font: `font-family: 'Courier New', Consolas, 'Lucida Console', monospace`
- `font-size`: Large enough to read comfortably — suggested `1.1rem` desktop, `0.95rem` mobile
- `overflow-x: auto` — full password accessible via horizontal scroll; never truncated
- `user-select: all` on focus to make keyboard copy frictionless
- `aria-label="Generated password"`, `aria-live="polite"`
- Scroll position resets to `scrollLeft = 0` on each new generation (start of password visible)

#### States

| State | Appearance | Content |
|-------|------------|---------|
| **Initial (no password)** | Lighter text color / italic | "Click Generate to create a password" |
| **Has password** | Normal text color, monospace | Generated password string |
| **Focused** | 2px high-contrast outline visible | Same as Has password |
| **Placeholder** (fallback if empty string returned) | Lighter text color / italic | "Click Generate to create a password" |

---

### Component: Copy Button

**User Stories:** US-4.1, US-4.2, US-4.3, US-4.4
**Feature:** F4

```
Default:     [ Copy ]
Copied:      [ ✓ Copied! ]
Inert:       [ Copy ]   ← no visual change; click is a no-op
Error:       [ Copy ]   + inline error below
```

**Specifications:**
- Element: `<button>` (native keyboard activation via Enter/Space)
- Position: Immediately to the right of the password output field (desktop); full width below it (mobile)
- `aria-label="Copy password to clipboard"`
- Label transitions: "Copy" → "✓ Copied!" on success; reverts after exactly 2000ms
- Re-clicking during the "Copied!" window resets the 2-second timer (no double "Copied!")
- When `appState.currentPassword` is null/empty: click is a no-op; no visual feedback (US-4.3)

#### States

| State | Button Label | Button Style | Behavior |
|-------|-------------|-------------|---------|
| **Default** | "Copy" | Standard style | Copies on click/Enter/Space |
| **Copied confirmation** | "✓ Copied!" | Green accent or success tint | No additional action; timer running |
| **Inert (no password yet)** | "Copy" | Standard style (no disabled attr) | Click → no-op; no change |
| **Copy failed** | "Copy" | Standard style | Inline error message appears below |

> **Note:** The Copy button is NOT set to `disabled` in the inert state — it remains visually enabled but functionally silent. This avoids confusing users who might not know a password hasn't been generated yet.

---

### Component: Password Strength Indicator

**User Stories:** US-5.1, US-5.2, US-5.3, US-5.4, US-5.5
**Feature:** F5

```
Desktop:
┌──────────────────────────────────────┐
│ [████████████████████████████░░░░░░] │  Strong
└──────────────────────────────────────┘

Mobile:
[████████████████████░░░░░░░░░░░░░░░░]  Strong
```

**Bar Element:**
- `role="meter"`, `aria-valuemin="1"`, `aria-valuemax="4"`, `aria-valuenow="{score}"`
- `aria-label="Password strength: {level}"` — updated on every change
- Bar width transitions smoothly (CSS `transition: width 0.2s ease`)

**Strength Levels:**

| Score | Label | Bar Color | Bar Width | Hex | When (typical) |
|-------|-------|-----------|-----------|-----|----------------|
| 1 | Weak | Red | 25% | `#e53e3e` | Short length, few sets |
| 2 | Fair | Orange | 50% | `#dd6b20` | Length 8–12, 2 sets |
| 3 | Strong | Yellow/amber | 75% | `#d69e2e` | Length ~16, 2–3 sets |
| 4 | Very Strong | Green | 100% | `#38a169` | Length ≥16, all sets (default) |

**Formula:** `entropy = length × log₂(poolSize)` — thresholds: <40 → Weak, <60 → Fair, <80 → Strong, ≥80 → Very Strong

**Placement:** Directly below the password output field and above the configuration zone — always visible, always current. Updates on: slider move, numeric input blur, any toggle change, every Generate click.

#### States

| State | Behavior |
|-------|----------|
| **Page load (default)** | "Very Strong" / green (length=16, all 4 sets = entropy ≈ 102 bits) |
| **Config change** | Updates immediately — no Generate click required (US-5.4) |
| **Low entropy config** | Bar shrinks and color degrades toward red |
| **No sets (edge case)** | Score=1 / Weak / red; Generate button is disabled |

---

### Component: Length Control

**User Stories:** US-1.1, US-1.2, US-1.3, US-1.4
**Feature:** F1

```
Length: 16
[○────────●──────────────────────────────] [ 16 ]
 8                                        128
```

**Slider (`<input type="range">`):**
- `min="8"`, `max="128"`, `step="1"`, `value="16"` on load
- `role="slider"`, `aria-valuemin="8"`, `aria-valuemax="128"`, `aria-valuenow="{length}"`, `aria-label="Password length"`
- Responds to `ArrowLeft` / `ArrowRight` for keyboard adjustment
- Every `input` event (drag) updates the label and numeric input in real time

**Numeric Input (`<input type="number">`):**
- `min="8"`, `max="128"`, `value="16"` on load
- `aria-label="Password length in characters"`
- Clamping happens on `blur`, not on every keystroke — allows mid-typing states like "12" without premature correction
- Non-numeric or empty input reverts to previous valid value on blur

**Length Label:**
- Text format: `"Length: {N}"`
- Updates on every slider `input` event and every numeric input `blur`
- Positioned above or inline-left of the slider for immediate reading context

#### States

| State | Appearance | Behavior |
|-------|------------|---------|
| **Default** | "Length: 16", slider at 16/128 position | — |
| **Slider drag** | Label updates in real time; numeric input updates in real time | Password auto-regenerates |
| **Numeric input (typing)** | No immediate sync during typing | Slider syncs on blur |
| **Out-of-range entry** | Numeric input shows entered value while typing | Clamped silently on blur |
| **Non-numeric entry** | Numeric input shows entered value while typing | Reverted silently on blur |

---

### Component: Character Set Toggles

**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-2.5, US-2.6
**Feature:** F2

```
Character Sets
[✓] Uppercase letters (A–Z)
[✓] Lowercase letters (a–z)
[✓] Numbers (0–9)
[✓] Symbols (!@#$%^&*…)

[inline] ⚠ At least one character set must be selected.  [auto-dismiss 3s]
```

**Toggle Controls:**
- Element: `<input type="checkbox">` with visible custom styling (or a styled `<label>`)
- All four start `checked` on page load (US-2.6)
- Activated by click or Space key
- Each has its own `aria-label`: "Include uppercase letters", "Include lowercase letters", "Include numbers", "Include symbols"

**Last Active Guard (US-2.5):**
- When only 1 set remains checked and user attempts to uncheck it:
  - The checkbox is immediately re-checked (state snaps back)
  - Inline validation message appears: "At least one character set must be selected."
  - Message dismisses after 3 seconds automatically
  - `appState.enabledSets` is never emptied by this guard

#### States per Toggle

| State | Visual | Behavior |
|-------|--------|---------|
| **Checked (default)** | Filled checkbox, label normal weight | Set included in generation |
| **Unchecked** | Empty checkbox, label slightly muted | Set excluded from generation |
| **Last active (guard)** | Checked, momentarily flashes | Snaps back; shows warning message |
| **Focused** | Visible focus ring (2px outline) | Space activates |

---

### Component: Generate Button

**User Stories:** US-6.1, US-6.2, US-6.3, US-6.4
**Feature:** F6

```
Active:   [    Generate Password    ]   ← prominent, high contrast
Disabled: [    Generate Password    ]   ← greyed out, cursor: not-allowed
Focused:  [    Generate Password    ]   ← 2px high-contrast focus ring
```

**Specifications:**
- Element: `<button type="button">` — native Enter/Space activation
- `aria-label="Generate password"`
- Visually dominant: the largest, highest-contrast interactive element on the page
- Focus ring: minimum 2px, high-contrast color, always visible (US-6.2)
- After generation: focus returns to the Generate button (US-6.2, JRN-03.1)
- Disabled when `appState.enabledSets.length === 0`: `disabled` attribute + `aria-disabled="true"` (not just CSS)

#### States

| State | HTML | Visual | Keyboard |
|-------|------|--------|---------|
| **Active** | No `disabled` attribute | Full color, normal cursor | Enter/Space triggers generation |
| **Focused** | No `disabled` attribute | 2px outline visible | — |
| **Disabled** | `disabled`, `aria-disabled="true"` | Greyed out, `cursor: not-allowed` | Enter/Space ignored |
| **Post-generation** | No `disabled` attribute | Focus returned here | User can immediately press Enter again |

---

### Component: Inline Error / Validation Messages

**User Stories:** US-2.5, US-4.2, US-6.4, US-0.2
**Feature:** F0, F2, F4, F6

```
┌──────────────────────────────────────────────────────┐
│ ⚠  [Error message text here]                         │
└──────────────────────────────────────────────────────┘
```

**Placement Rules:**
- Character set guard message: directly below the character set toggles section
- Copy failure message: directly below the Copy button
- Generation error message: directly below the Generate button
- Crypto unavailable message: directly below the Generate button (persistent, no dismiss)

**Styling:**
- Red left border or red icon (`⚠`) + message text
- Subtle red/pink background tint
- `role="alert"`, `aria-live="assertive"` for immediate screen reader announcement
- Font size: slightly smaller than body but not small enough to miss

**Consolidated Error Messages:**

| Trigger | Message | Dismiss |
|---------|---------|---------|
| Last set disabled (F2) | "At least one character set must be selected." | 3s auto |
| Copy failed — both methods (F4) | "Copy failed. Please select and copy the password manually." | 5s auto |
| Crypto API unavailable (F0) | "Secure generation unavailable. Please use a modern browser." | Never (persistent) |
| Unexpected generation error (F6) | "Password generation failed. Please try again." | 5s auto |
| Length auto-adjusted (F0) | "Length increased to fit all selected character sets." | 3s auto (informational, softer style) |

---

## Interaction Patterns

### Pattern 1: Auto-Regenerate on Configuration Change

**When to use:** Any time the user changes length or toggles a character set
**Behavior:** The generation engine is called immediately on every `input` event from the slider and every `change` event from a toggle. The password display updates in < 50ms. No separate Generate click is needed to see the effect.
**User stories:** US-1.1, US-2.1–US-2.4, US-5.4
**Journeys:** JRN-01.2 (Disable Symbols stage), JRN-02.1 (Disable Symbols stage)
**Rationale:** Eliminates the single biggest ambiguity in the UX — "did my toggle change take effect?" — for all three personas.

---

### Pattern 2: Copy Button Confirmation Reset

**When to use:** User clicks Copy while "Copied!" state is already active
**Behavior:** The 2-second timer resets. The button remains in the "Copied!" state for another full 2 seconds from the moment of the second click. No flicker or transition back to "Copy" occurs.
**User stories:** US-4.1
**Rationale:** Power users who double-click Copy should not see a confusing flash of the default label.

---

### Pattern 3: Slider / Numeric Input Bidirectional Sync

**When to use:** Any time either the slider or the numeric input is changed
**Behavior:**
- Slider `input` event → numeric input value updates in real time (while dragging)
- Numeric input `blur` event → value is clamped, then slider syncs to clamped value
- Both updating `appState.length` from the same shared value prevents drift
**User stories:** US-1.1, US-1.2, US-1.3
**Journeys:** JRN-02.1 (Configure Length stage — Maya types "48", expects exact control)

---

### Pattern 4: Last Active Guard

**When to use:** User attempts to uncheck the only remaining active toggle
**Behavior:**
1. The `change` event fires.
2. Code checks `appState.enabledSets.length === 1`.
3. If true: `event.preventDefault()`, re-check the checkbox programmatically.
4. Display the inline validation message immediately.
5. Start a 3-second auto-dismiss timer.
6. No state change occurs; `appState.enabledSets` is unchanged.
**User stories:** US-2.5
**Journeys:** JRN-01.2 (risk scenario — Alex trying to turn off all sets)

---

### Pattern 5: Keyboard Copy via Focused Output Field

**When to use:** User has the password output field focused and presses Ctrl+C / Cmd+C
**Behavior:**
1. The native browser copy behavior fires (field is `readonly` but focusable and selectable).
2. Additionally, a `keydown` listener triggers the Copy button's visual confirmation ("Copied!" for 2s).
**User stories:** US-4.4, US-3.3
**Journeys:** JRN-03.1 (Navigate to Copy stage)

---

### Pattern 6: Focus Return After Generation

**When to use:** User triggers generation via click or keyboard
**Behavior:** After the generation engine returns and the DOM is updated, `focus()` is explicitly called on the Generate button. This allows: Enter → [new password] → Enter → [new password] with no mouse interaction required.
**User stories:** US-6.2
**Journeys:** JRN-03.1, JRN-03.2

---

## States Reference

### Page Load State

| Element | Value |
|---------|-------|
| Password display | Placeholder: "Click Generate to create a password" |
| Copy button | "Copy" (inert — no password yet) |
| Strength bar | Reflects default config (length=16, all sets) → "Very Strong" / green / 100% |
| Length slider | Position: 16 |
| Numeric input | 16 |
| Length label | "Length: 16" |
| All four toggles | Checked |
| Generate button | Active / enabled |

> **Design Decision:** The strength indicator is active on page load even before first generation (US-5.4). This signals to Jordan (JRN-03.1) and Maya (JRN-02.1) what strength the default configuration will produce before they click anything. The password display still shows placeholder text to make it clear no password has been copied yet.

---

### After First Generation

| Element | Value |
|---------|-------|
| Password display | Generated password string (monospace) |
| Copy button | "Copy" (now functional) |
| Strength bar | Same as pre-generation (config hasn't changed) |
| All controls | Unchanged from their current settings |

---

### Mid-Configuration (Changes, No Generate Needed)

| Element | Value |
|---------|-------|
| Password display | New password (auto-regenerated on each change) |
| Strength bar | Updated to reflect new config |
| Length label | Updated to reflect current length |
| Slider + numeric input | In sync with each other |

---

## Tab Order (Logical Reading Order)

The tab order follows the visual top-to-bottom, left-to-right reading order:

```
1. Length Slider             (ArrowLeft/Right to adjust)
2. Length Numeric Input      (type to enter exact value)
3. Uppercase Toggle          (Space to toggle)
4. Lowercase Toggle          (Space to toggle)
5. Numbers Toggle            (Space to toggle)
6. Symbols Toggle            (Space to toggle)
7. Generate Password Button  (Enter/Space to generate)
8. Copy Button               (Enter/Space to copy)
9. Password Output Field     (Tab to focus; Ctrl+C/Cmd+C to copy)
```

> The Copy button (8) comes before the Password Display (9) in tab order. This lets Jordan complete the generate → copy cycle in the fewest keystrokes: Tab from Generate to Copy, then Enter. The output field is still reachable at position 9 for users who prefer keyboard selection + Ctrl+C.

---

## Responsive Considerations

### Desktop (>1024px)

- Password output field and Copy button are side by side in a single row.
- Strength bar spans the full width of the output field (not including Copy button).
- Length slider and numeric input are in the same row (slider takes remaining space, input is fixed width ~60px).
- Character set toggles are in a single column (4 rows).
- Generate button is centered or left-aligned below configuration, with comfortable padding.
- Maximum content width: ~600–700px, centered on large screens (prevents over-stretching on ultrawide).

### Tablet (768px – 1024px)

- Same layout as desktop; spacing slightly tightened.
- Slider touch target: ensure `min-height: 44px` for the slider track area (WCAG touch target recommendation).
- Copy button remains beside the password field if space allows; stacks below if needed.

### Mobile (<768px)

- Password output field: full width.
- Copy button: full width, stacked below the output field.
- Strength bar: full width below Copy button.
- Length slider: full width; numeric input below or inline-right (shorter input, ~50px).
- Character set toggles: full width, stacked vertically — touch target `min-height: 44px` each.
- Generate button: full width, large tap target (min height 48px).
- All text remains legible at base font size; no content hidden or collapsed.

---

## Accessibility Notes

### Color Contrast

- All body text and labels: minimum 4.5:1 contrast ratio against background (WCAG AA).
- Generate button text on button background: minimum 4.5:1.
- Strength bar text labels ("Weak", "Fair", "Strong", "Very Strong"): color alone is never the sole indicator (US-5.2, US-5.5) — text label always accompanies the bar.
- Placeholder text in the password output: must still meet 4.5:1 (do not use default browser placeholder styles which often fail contrast).
- Error message text: minimum 4.5:1 against error background; red icon (`⚠`) is supplementary.

### ARIA Labels (Complete Reference)

| Component | ARIA Attribute(s) |
|-----------|-------------------|
| Length Slider | `role="slider"`, `aria-label="Password length"`, `aria-valuemin="8"`, `aria-valuemax="128"`, `aria-valuenow="{N}"` |
| Length Input | `aria-label="Password length in characters"` |
| Uppercase Toggle | `aria-label="Include uppercase letters"` |
| Lowercase Toggle | `aria-label="Include lowercase letters"` |
| Numbers Toggle | `aria-label="Include numbers"` |
| Symbols Toggle | `aria-label="Include symbols"` |
| Password Output | `aria-label="Generated password"`, `aria-live="polite"` |
| Copy Button | `aria-label="Copy password to clipboard"` |
| Strength Bar | `role="meter"`, `aria-label="Password strength: {level}"`, `aria-valuemin="1"`, `aria-valuemax="4"`, `aria-valuenow="{1–4}"` |
| Generate Button | `aria-label="Generate password"`, `aria-disabled="true"` (when disabled) |
| Inline Error Messages | `role="alert"`, `aria-live="assertive"` |

### Keyboard Navigation

- No keyboard traps anywhere in the application.
- Slider keyboard support: `ArrowLeft` (−1), `ArrowRight` (+1), `Home` (→ 8), `End` (→ 128).
- Toggle checkboxes: Space to toggle; Tab to move between toggles.
- Generate button: Enter or Space when focused.
- Copy button: Enter or Space when focused.
- Password display: Tab to focus; native Ctrl+C/Cmd+C for copy.

### Screen Reader Behavior

- Password display has `aria-live="polite"` — screen reader announces the new password after generation without interrupting other speech.
- Error messages have `role="alert"` + `aria-live="assertive"` — announced immediately when they appear.
- Strength bar `aria-label` updates on every configuration change — "Password strength: Very Strong" is re-announced on meaningful changes.
- The strength bar's `aria-valuenow` provides a numeric score (1–4) for screen readers that read meter values.

### Focus Management

- After clicking Generate: focus returns to the Generate button (US-6.2).
- After a Last Active Guard fires: focus stays on the toggle that was attempted (no unexpected jump).
- After a Copy failure error appears: focus is not moved; user continues from their current position.
- All focus rings: minimum 2px solid outline in a high-contrast color (not the same as the page background).

---

## Design Tokens (Reference Values)

These are suggested design tokens to ensure consistency across all components. Exact values are adjustable to match the final visual design.

| Token | Value | Usage |
|-------|-------|-------|
| `--color-strength-weak` | `#e53e3e` | Strength bar: Weak |
| `--color-strength-fair` | `#dd6b20` | Strength bar: Fair |
| `--color-strength-strong` | `#d69e2e` | Strength bar: Strong |
| `--color-strength-very-strong` | `#38a169` | Strength bar: Very Strong |
| `--color-error` | `#c53030` | Error message text and icon |
| `--color-error-bg` | `#fff5f5` | Error message background |
| `--color-success` | `#276749` | "Copied!" confirmation state |
| `--font-mono` | `'Courier New', Consolas, 'Lucida Console', monospace` | Password output field |
| `--radius-button` | `6px` | Button border radius |
| `--focus-ring` | `2px solid #2b6cb0` | Focus outline for all interactive elements |
| `--transition-bar` | `width 0.2s ease` | Strength bar width transition |
| `--transition-copy` | none | Copy button label change (instant) |
| `--max-content-width` | `680px` | Maximum width of the page content area |

---

*Document generated by UX Design Partner — 2026-05-04*
