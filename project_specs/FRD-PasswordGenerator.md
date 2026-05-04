# FRD: Password Generator
**Version:** 1.0  
**Date:** 2026-05-04  
**Status:** Draft  
**Based on:** PRD-PasswordGenerator.md v1.0  

---

## Table of Contents

1. [Overview](#overview)
2. [F0: Password Generation Engine](#f0-password-generation-engine)
3. [F1: Password Length Configuration](#f1-password-length-configuration)
4. [F2: Character Set Toggles](#f2-character-set-toggles)
5. [F3: Password Display](#f3-password-display)
6. [F4: Copy to Clipboard](#f4-copy-to-clipboard)
7. [F5: Password Strength Indicator](#f5-password-strength-indicator)
8. [F6: Generate Button](#f6-generate-button)
9. [Application State Model](#application-state-model)
10. [Component Architecture](#component-architecture)
11. [Error Handling](#error-handling)
12. [Accessibility Requirements](#accessibility-requirements)
13. [Browser Compatibility](#browser-compatibility)

---

## Overview

Password Generator is a pure client-side single-page application (SPA) built with HTML5, CSS3, and Vanilla JavaScript (ES6+). It requires no backend, no database, and transmits zero user data. All password generation is performed locally in the browser using the Web Crypto API. This FRD specifies the exact behavior, validation rules, error states, and component interactions for each feature defined in the PRD.

**Architecture Note:** Because this is a zero-backend application, there are no REST API endpoints or database schemas. In place of those sections, this document provides a detailed **Application State Model** (the in-memory data structure governing the UI) and a **Component Architecture** section describing how the DOM components interact.

---

## F0: Password Generation Engine

**Description:** The generation engine is the core algorithmic module responsible for producing a cryptographically secure random password string. It accepts a configuration object (length + enabled character sets) and returns a password string that satisfies all constraints. It uses `crypto.getRandomValues()` exclusively — `Math.random()` is strictly forbidden. The engine guarantees that at least one character from each enabled set appears in the final output.

**Terminology:**
- **Character Pool:** The combined string of all characters from all enabled sets, used as the source alphabet for generation.
- **Guaranteed Slot:** A position in the password pre-filled with one character drawn from each enabled set, ensuring set representation.
- **Random Fill:** The remaining password positions filled with characters drawn uniformly at random from the full character pool.
- **Shuffle:** A Fisher-Yates shuffle applied to the assembled character array to destroy any positional bias from guaranteed slots.
- **Web Crypto API:** The browser-native `window.crypto.getRandomValues()` method providing cryptographically secure random bytes.

**Sub-features:**
- Assemble character pool from enabled character sets
- Pre-fill guaranteed slots (one per enabled set)
- Fill remaining positions from the full pool at random
- Shuffle the assembled array (Fisher-Yates)
- Return the final password as a string

**Process:**
1. Receive a `GeneratorConfig` object containing `length` (integer) and `enabledSets` (array of set keys).
2. Validate config: confirm `length` is between 8 and 128 inclusive; confirm `enabledSets` has at least 1 entry. Throw `ConfigurationError` if invalid.
3. Build the character pool by concatenating the character strings of all enabled sets.
4. For each enabled set, draw one cryptographically random character from that set and add it to the `slots` array. This guarantees representation.
5. Calculate `remaining = length − slots.length`.
6. For each of the `remaining` positions, draw one cryptographically random character from the full pool and append to `slots`.
7. Apply Fisher-Yates shuffle to `slots` using `crypto.getRandomValues()` for all random indices.
8. Join `slots` into a string and return it as the generated password.

**Inputs:**
- `length` (integer, required): Password length, 8–128 inclusive
- `enabledSets` (array of strings, required): One or more of `["uppercase", "lowercase", "numbers", "symbols"]`

**Outputs:**
- `password` (string): A random password of exactly `length` characters
- All characters drawn exclusively from the enabled character sets
- At least one character from each enabled set present in the output

**Character Set Definitions:**

| Set Key | Characters |
|---------|-----------|
| `uppercase` | `ABCDEFGHIJKLMNOPQRSTUVWXYZ` |
| `lowercase` | `abcdefghijklmnopqrstuvwxyz` |
| `numbers` | `0123456789` |
| `symbols` | `!@#$%^&*()-_=+[]{}|;:,.<>?` |

**Validation Rules:**
- `length` must be an integer ≥ 8 and ≤ 128
- `enabledSets` must be a non-empty array
- `enabledSets` values must only contain valid set keys: `uppercase`, `lowercase`, `numbers`, `symbols`
- `length` must be ≥ the number of entries in `enabledSets` (to fit at least one char per set)
- `crypto.getRandomValues` must be available; if not, throw `CryptoUnavailableError`

**Error States:**

| Scenario | Error Code | Behavior |
|----------|------------|----------|
| `length` below 8 | `LENGTH_TOO_SHORT` | Clamp to 8; log warning to console |
| `length` above 128 | `LENGTH_TOO_LONG` | Clamp to 128; log warning to console |
| No sets enabled | `NO_SETS_ENABLED` | Throw error; Generate button disabled (enforced at UI level) |
| `length` < number of enabled sets | `LENGTH_LESS_THAN_SET_COUNT` | Auto-increase length to match set count; notify user |
| `crypto.getRandomValues` unavailable | `CRYPTO_UNAVAILABLE` | Display inline error: "Secure generation unavailable. Please use a modern browser." |

---

## F1: Password Length Configuration

**Description:** This feature provides two synchronized UI controls — a range slider and a numeric text input — that allow the user to specify the desired password length. Both controls share a single underlying state value and remain in sync at all times. The default length on page load is 16 characters.

**Terminology:**
- **Length Slider:** An HTML `<input type="range">` control for visual, drag-based length adjustment.
- **Length Input:** An HTML `<input type="number">` control for precise keyboard entry of the length value.
- **Sync:** The bidirectional update mechanism ensuring both controls always display the same value.
- **Clamp:** Constraining an entered value to the valid range [8, 128] without throwing an error.

**Sub-features:**
- Range slider (8–128)
- Numeric input field (8–128)
- Bidirectional sync between slider and numeric input
- Default value initialization (16)
- Boundary clamping

**Process:**
1. On page load, set both the slider and numeric input to the default value of `16`.
2. When the user drags the slider:
   a. Read the new slider value.
   b. Update the numeric input to display the same value.
   c. Update `appState.length`.
   d. Trigger re-generation if auto-generate is active; otherwise leave existing password in place.
3. When the user types in the numeric input:
   a. Parse the entered value as an integer.
   b. If the value is empty or non-numeric, hold the previous valid value; do not update state.
   c. If the value is below 8, clamp to 8 on blur (not during typing).
   d. If the value is above 128, clamp to 128 on blur (not during typing).
   e. Update the slider to match the clamped value.
   f. Update `appState.length`.
4. Display a visible counter label (e.g., "Length: 16") adjacent to the slider.

**Inputs:**
- Slider interaction (drag/click): produces integer in [8, 128]
- Numeric field keyboard entry (string parsed to integer)

**Outputs:**
- Updated slider position
- Updated numeric field value
- Updated length label text
- Updated `appState.length`

**Validation Rules:**
- Minimum allowed value: `8`
- Maximum allowed value: `128`
- Value must be a whole integer (no decimals)
- Non-numeric entry in the text field is ignored; previous valid value is retained
- Clamping occurs on `blur` event for the numeric input (not on every keystroke)

**Error States:**

| Scenario | Behavior |
|----------|----------|
| User types value < 8 | On blur, clamp to 8 and update both controls |
| User types value > 128 | On blur, clamp to 128 and update both controls |
| User types non-numeric (e.g., "abc") | On blur, revert to previous valid value |
| User clears field completely | On blur, revert to previous valid value (not 0) |

---

## F2: Character Set Toggles

**Description:** Four checkbox or toggle-switch controls allow the user to include or exclude each character category from the password generation alphabet. At least one set must remain active at all times; the UI prevents the user from disabling all four. The default state on page load is all four sets enabled.

**Terminology:**
- **Character Set:** One of four named groups of characters: uppercase, lowercase, numbers, symbols.
- **Enabled Set:** A character set whose toggle is in the `checked/on` state.
- **Disabled Set:** A character set whose toggle is in the `unchecked/off` state.
- **Last Active Guard:** The validation rule that prevents the final enabled set from being toggled off.

**Sub-features:**
- Uppercase letters toggle (A–Z)
- Lowercase letters toggle (a–z)
- Numbers toggle (0–9)
- Symbols toggle (`!@#$%^&*()-_=+[]{}|;:,.<>?`)
- Last Active Guard (at least one set must be on)
- Sync enabled sets into `appState.enabledSets`

**Process:**
1. On page load, render all four toggles in the `checked` (enabled) state.
2. Populate `appState.enabledSets` with all four set keys: `["uppercase", "lowercase", "numbers", "symbols"]`.
3. When the user clicks a toggle to disable a set:
   a. Count the number of currently enabled sets.
   b. If count is 1 (this is the last enabled set), prevent the toggle from being unchecked. Show a brief inline message: "At least one character set must be selected."
   c. If count > 1, uncheck the toggle and remove the set key from `appState.enabledSets`.
4. When the user clicks a toggle to enable a set:
   a. Check the toggle.
   b. Add the set key to `appState.enabledSets`.
5. After any toggle change, re-evaluate the Generate button's disabled state (F6).
6. After any toggle change, update the strength indicator (F5).

**Inputs:**
- Toggle click/keyboard interaction for each of the four sets

**Outputs:**
- Updated toggle visual state (checked/unchecked)
- Updated `appState.enabledSets` array
- Inline validation message if Last Active Guard fires
- Updated Generate button state
- Updated strength indicator

**Validation Rules:**
- At least one character set must be enabled at all times
- Attempting to disable the last remaining active set is rejected; the toggle snaps back to `checked`
- `appState.enabledSets` always reflects exactly the sets whose toggles are visually checked

**Error States:**

| Scenario | Behavior |
|----------|----------|
| User attempts to disable last active set | Toggle prevented from unchecking; display message: "At least one character set must be selected." Message auto-dismisses after 3 seconds |
| All sets somehow end up disabled (programmatic edge case) | Generate button becomes disabled; inline warning shown |

---

## F3: Password Display

**Description:** A prominently styled, read-only output area displays the most recently generated password. It uses a monospace font to make all characters easily distinguishable. The display updates immediately each time a new password is generated and is visually distinct from the configuration controls.

**Terminology:**
- **Output Field:** The read-only `<input type="text">` or `<div>` element used to display the current password.
- **Placeholder Text:** The instructional text shown before the first password is generated (e.g., "Click Generate to create a password").
- **Monospace Font:** A fixed-width typeface (e.g., `Courier New`, `Consolas`, `monospace`) used to disambiguate visually similar characters (e.g., `0` vs `O`, `l` vs `1`).

**Sub-features:**
- Monospace password display area
- Placeholder state before first generation
- Horizontal scroll for passwords exceeding visible width
- Immediate update on new generation
- Read-only enforcement (no user editing)

**Process:**
1. On page load, render the output field with placeholder text: `"Click Generate to create a password"`.
2. When a new password is generated (F0):
   a. Clear the placeholder text.
   b. Set the output field value/content to the new password string.
   c. Scroll the field to the beginning (leftmost position) so the start of the password is visible.
3. The field is rendered with `readonly` attribute (if `<input>`) or `user-select: all` CSS with pointer-events disabled for editing (if a `<div>`).
4. For passwords exceeding the visible width, `overflow-x: auto` (scroll) is applied — the password is never truncated or clipped.
5. The output field is focusable via keyboard (for copy shortcut support).

**Inputs:**
- `password` (string): The generated password string from F0

**Outputs:**
- Rendered password text in the output field
- Scroll position reset to start

**Validation Rules:**
- The output field must never allow user input or editing
- The display must never truncate the password string — full password must be accessible via scroll
- Before first generation, placeholder text is shown (not an empty blank field)

**Error States:**

| Scenario | Behavior |
|----------|----------|
| No password generated yet | Display placeholder: "Click Generate to create a password" |
| Password string is empty (shouldn't happen normally) | Display placeholder text as fallback |

---

## F4: Copy to Clipboard

**Description:** A "Copy" button adjacent to the password display copies the currently displayed password to the system clipboard with a single click. It provides immediate visual feedback confirming success. If the password has not yet been generated, the Copy button is inert. It uses the modern `navigator.clipboard` API with a graceful fallback to `document.execCommand('copy')` for environments that do not support the modern API.

**Terminology:**
- **Clipboard API:** The modern browser API `navigator.clipboard.writeText()` for programmatic clipboard writes.
- **execCommand Fallback:** The legacy `document.execCommand('copy')` mechanism for environments where the Clipboard API is unavailable (e.g., HTTP context, older browsers).
- **Copy Confirmation:** The temporary visual state change on the Copy button (label/icon change) indicating success.
- **Inert State:** The state of the Copy button when no password has been generated; clicks are ignored.

**Sub-features:**
- Copy button rendering adjacent to password display
- Clipboard API copy with navigator.clipboard
- execCommand fallback for unsupported environments
- "Copied!" visual confirmation (2-second duration)
- Inert state when no password is present

**Process:**
1. Render the Copy button labeled "Copy" (with optional copy icon) adjacent to the output field.
2. On button click:
   a. If `appState.currentPassword` is empty or null, do nothing (inert state).
   b. Attempt `navigator.clipboard.writeText(appState.currentPassword)`:
      - On success: proceed to step 3.
      - On failure (API unavailable or permission denied): proceed to step 2c.
   c. Fallback: create a temporary `<textarea>`, set its value to the password, append to DOM, `select()` it, call `document.execCommand('copy')`, then remove the element.
      - On success: proceed to step 3.
      - On failure: proceed to step 2d.
   d. If both methods fail: display inline error message: "Copy failed. Please select and copy the password manually."
3. Visual confirmation:
   a. Change button label to "Copied!" (and optionally change icon to a checkmark).
   b. After 2000ms, revert label back to "Copy".
4. The Copy action is also triggered by keyboard shortcut `Ctrl+C` / `Cmd+C` when the output field is focused.

**Inputs:**
- Button click event
- `appState.currentPassword` (string): The password to be copied

**Outputs:**
- Password string written to system clipboard
- Button label temporarily changed to "Copied!" for 2 seconds
- Error message if both copy methods fail

**Validation Rules:**
- Copy action is a no-op if `appState.currentPassword` is null or empty string
- `navigator.clipboard` is attempted first; `execCommand` is the fallback
- Visual confirmation persists for exactly 2000ms before reverting
- Only one copy confirmation timer runs at a time (re-click resets the timer)

**Error States:**

| Scenario | Behavior |
|----------|----------|
| No password generated | Button click is ignored; no visual change |
| `navigator.clipboard` unavailable | Silently fall back to `execCommand` |
| Both clipboard methods fail | Display inline error: "Copy failed. Please select and copy the password manually." Error dismisses after 5 seconds |
| Clipboard permission denied by user | Same as both-methods-fail behavior |

---

## F5: Password Strength Indicator

**Description:** A real-time visual component that evaluates and displays the relative strength of the currently configured password. It presents a color-coded horizontal progress bar alongside a text label. The indicator updates immediately on any configuration change (length adjustment or set toggle) and on each new generation. It is purely informational and never blocks or gates password generation.

**Terminology:**
- **Strength Score:** An integer value (1–4) calculated from password length and character set diversity.
- **Strength Level:** One of four named tiers mapped from the score: Weak (1), Fair (2), Strong (3), Very Strong (4).
- **Entropy Estimate:** A proxy measure using length × log₂(pool size) to inform the score calculation.
- **Color-coded Bar:** A CSS-styled `<div>` whose width (as a percentage) and background color reflect the current strength level.

**Sub-features:**
- Strength score calculation algorithm
- Four-tier classification (Weak / Fair / Strong / Very Strong)
- Color-coded bar (red → orange → yellow → green)
- Text label alongside bar
- Real-time update on any config change
- No blocking behavior

**Strength Calculation Algorithm:**

The strength score is derived from an entropy estimate:

```
poolSize = total number of characters in the active character pool
entropy  = length × log₂(poolSize)

Score mapping:
  entropy < 40  → 1 (Weak)
  entropy < 60  → 2 (Fair)
  entropy < 80  → 3 (Strong)
  entropy ≥ 80  → 4 (Very Strong)
```

**Character Pool Sizes:**

| Set | Count |
|-----|-------|
| uppercase | 26 |
| lowercase | 26 |
| numbers | 10 |
| symbols | 28 |
| All four combined | 90 |

**Strength Level Display:**

| Score | Label | Bar Color | Bar Width |
|-------|-------|-----------|-----------|
| 1 | Weak | `#e53e3e` (red) | 25% |
| 2 | Fair | `#dd6b20` (orange) | 50% |
| 3 | Strong | `#d69e2e` (yellow) | 75% |
| 4 | Very Strong | `#38a169` (green) | 100% |

**Process:**
1. On every change to `appState.length` or `appState.enabledSets`, re-run the strength calculation.
2. Calculate `poolSize` by summing the character counts of all enabled sets.
3. Calculate `entropy = appState.length × Math.log2(poolSize)`.
4. Map entropy to a score (1–4) using the thresholds above.
5. Update the bar element's width (CSS percentage) and background color.
6. Update the text label element's text content to the corresponding label string.
7. Update the ARIA label on the bar for screen reader accessibility (e.g., `aria-label="Password strength: Strong"`).
8. If no password has been generated yet, the indicator reflects the *current configuration's* strength (what a password generated now would be).

**Inputs:**
- `appState.length` (integer): Current length setting
- `appState.enabledSets` (array): Currently enabled character sets

**Outputs:**
- Updated bar width (CSS)
- Updated bar background color
- Updated text label
- Updated ARIA label

**Validation Rules:**
- Strength indicator must always reflect the current configuration, not a cached stale state
- The indicator never prevents generation — it is read-only and informational
- Entropy calculation uses `Math.log2()` — must handle edge case where `poolSize` is 0 (only possible if no sets are active, which is prevented by F2)

**Error States:**

| Scenario | Behavior |
|----------|----------|
| No sets enabled (edge case) | Show Weak / score 1; Generate button disabled (enforced by F6) |
| `poolSize` is 0 | Default to score 1 (Weak) as a safe fallback; should not occur in normal operation |

---

## F6: Generate Button

**Description:** The primary call-to-action button that triggers password generation using the current configuration state. It is prominently styled to be the most visually dominant interactive element on the page. It responds to mouse clicks and keyboard activation (Enter/Space when focused). It enters a disabled state when no character sets are enabled, preventing invalid generation attempts.

**Terminology:**
- **CTA Button:** Call-to-action button — the primary action element for triggering generation.
- **Disabled State:** Visual and functional state when the button is non-interactive (greyed out, `disabled` attribute set, `aria-disabled="true"`).
- **Active State:** Normal clickable state when at least one character set is enabled.
- **Generation Trigger:** The event (click or keyboard) that initiates the F0 generation engine.

**Sub-features:**
- Prominent CTA styling
- Click-to-generate behavior
- Keyboard activation (Enter and Space)
- Disabled state enforcement when no sets are active
- Proper ARIA attributes and focus management

**Process:**
1. On page load, render the button in the Active state (all sets enabled by default).
2. Set `aria-label="Generate Password"` and ensure the button is reachable via Tab key navigation.
3. On click or keyboard activation (Enter/Space):
   a. Check that `appState.enabledSets.length > 0`. If not, do nothing (button should already be disabled).
   b. Call the generation engine (F0) with `{ length: appState.length, enabledSets: appState.enabledSets }`.
   c. On success: update `appState.currentPassword` with the returned string; update the password display (F3); update the strength indicator (F5).
   d. On error from F0: display an inline error message (see Error States below).
4. After generation completes, return focus to the Generate button (so the user can press Enter again for a new password).
5. When all character sets are disabled (Last Active Guard in F2 fires):
   a. Set the button to `disabled` with `aria-disabled="true"`.
   b. Visually grey out the button.
6. When at least one set is re-enabled, restore the button to the Active state.

**Inputs:**
- Click event on the button
- Keyboard `keydown` event (`Enter` or `Space`) when the button is focused
- `appState.enabledSets` (array): Drives enabled/disabled state

**Outputs:**
- Triggers F0 generation engine
- Updates `appState.currentPassword`
- Updates password display (F3)
- Updates strength indicator (F5)

**Validation Rules:**
- Button must be disabled (not just visually inert) when `appState.enabledSets.length === 0`
- The `disabled` HTML attribute must be set (not just CSS `pointer-events: none`) to ensure keyboard inaccessibility in the disabled state
- Button label must be clear and always read "Generate Password" (or equivalent)

**Error States:**

| Scenario | Behavior |
|----------|----------|
| No character sets enabled | Button has `disabled` attribute; clicks and key events are ignored |
| F0 throws `CRYPTO_UNAVAILABLE` | Display inline error below button: "Secure generation unavailable. Please use a modern browser." |
| F0 throws `NO_SETS_ENABLED` | Display inline error: "Please enable at least one character set." |
| F0 throws any unexpected error | Display inline error: "Password generation failed. Please try again." |

---

## Application State Model

**Description:** Since this is a zero-backend application, the application state lives entirely in memory as a JavaScript object. This section defines the canonical state shape and the rules governing state transitions.

**State Object Definition:**

```javascript
const appState = {
  // F1: Current password length
  length: 16,                        // integer, 8–128

  // F2: Enabled character sets
  enabledSets: [                     // array of strings
    "uppercase",
    "lowercase",
    "numbers",
    "symbols"
  ],

  // F3/F4: Currently displayed password
  currentPassword: null,             // string | null

  // F4: Copy button state
  copyConfirmActive: false,          // boolean

  // F5: Derived (not stored) — recalculated on render
  // strengthScore: computed from length + enabledSets

  // Internal
  copyConfirmTimer: null             // setTimeout handle | null
};
```

**State Transition Rules:**

| Event | State Change |
|-------|-------------|
| Page load | `length=16`, all sets enabled, `currentPassword=null` |
| Slider/input changed | `length` updated |
| Set toggled on | Set key added to `enabledSets` |
| Set toggled off (not last) | Set key removed from `enabledSets` |
| Set toggled off (last) | No change; Last Active Guard fires |
| Generate clicked | `currentPassword` set to generated string |
| Copy clicked (success) | `copyConfirmActive=true`; timer set for 2s revert |
| Copy timer expires | `copyConfirmActive=false` |

---

## Component Architecture

**Description:** The application is structured as a set of loosely coupled DOM components communicating through shared state. There is no virtual DOM or framework — updates are performed via direct DOM manipulation triggered by event handlers.

**Component Tree:**

```
App
├── PasswordDisplay          (F3) — reads appState.currentPassword
├── ConfigPanel
│   ├── LengthControl        (F1) — reads/writes appState.length
│   │   ├── LengthSlider
│   │   ├── LengthInput
│   │   └── LengthLabel
│   └── CharSetToggles       (F2) — reads/writes appState.enabledSets
│       ├── UppercaseToggle
│       ├── LowercaseToggle
│       ├── NumbersToggle
│       └── SymbolsToggle
├── ActionBar
│   ├── GenerateButton       (F6) — triggers F0; writes appState.currentPassword
│   └── CopyButton           (F4) — reads appState.currentPassword
└── StrengthIndicator        (F5) — reads appState.length + appState.enabledSets
    ├── StrengthBar
    └── StrengthLabel
```

**Inter-component Communication:**

| Source Component | Event | Affected Components |
|-----------------|-------|---------------------|
| LengthSlider / LengthInput | `length` change | LengthLabel, StrengthIndicator |
| CharSetToggles | `enabledSets` change | GenerateButton (disabled state), StrengthIndicator |
| GenerateButton | generation complete | PasswordDisplay, StrengthIndicator, CopyButton (un-inert) |
| CopyButton | copy success | CopyButton (confirmation state) |

---

## Error Handling

**Description:** This section consolidates all error states across features into a single reference. Since there is no backend, all errors are client-side and surfaced as inline UI messages.

**Global Error Display Rules:**
- Inline errors appear directly below the component that triggered them
- Inline errors are styled with a red border or icon and `role="alert"` for screen readers
- Errors auto-dismiss after the durations specified per error type
- Multiple simultaneous errors are stacked vertically

**Consolidated Error Reference:**

| Feature | Scenario | Error Code | User-Facing Message | Auto-Dismiss |
|---------|----------|------------|---------------------|--------------|
| F0 | Crypto API unavailable | `CRYPTO_UNAVAILABLE` | "Secure generation unavailable. Please use a modern browser." | No (persistent) |
| F0 | No sets enabled | `NO_SETS_ENABLED` | "Please enable at least one character set." | 5s |
| F0 | Length < set count | `LENGTH_LESS_THAN_SET_COUNT` | "Length increased to fit all selected character sets." | 3s (info, not error) |
| F1 | Value below minimum | `LENGTH_TOO_SHORT` | (Silently clamp to 8 on blur; no message) | — |
| F1 | Value above maximum | `LENGTH_TOO_LONG` | (Silently clamp to 128 on blur; no message) | — |
| F1 | Non-numeric entry | `INVALID_LENGTH_INPUT` | (Silently revert to previous value on blur; no message) | — |
| F2 | Last set disabled | `LAST_SET_DISABLED` | "At least one character set must be selected." | 3s |
| F4 | Copy failed | `COPY_FAILED` | "Copy failed. Please select and copy the password manually." | 5s |
| F6 | Unexpected generation error | `GENERATION_ERROR` | "Password generation failed. Please try again." | 5s |

---

## Accessibility Requirements

**Description:** The application must meet WCAG 2.1 AA compliance. The following specifications define the concrete accessibility requirements per component.

**ARIA Roles and Labels:**

| Component | ARIA Requirement |
|-----------|-----------------|
| Length Slider | `role="slider"`, `aria-valuemin="8"`, `aria-valuemax="128"`, `aria-valuenow="{length}"`, `aria-label="Password length"` |
| Length Input | `aria-label="Password length in characters"` |
| Uppercase Toggle | `aria-label="Include uppercase letters"` |
| Lowercase Toggle | `aria-label="Include lowercase letters"` |
| Numbers Toggle | `aria-label="Include numbers"` |
| Symbols Toggle | `aria-label="Include symbols"` |
| Password Display | `aria-label="Generated password"`, `aria-live="polite"` |
| Copy Button | `aria-label="Copy password to clipboard"` |
| Strength Bar | `role="meter"`, `aria-valuenow="{score}"`, `aria-valuemin="1"`, `aria-valuemax="4"`, `aria-label="Password strength: {level}"` |
| Generate Button | `aria-label="Generate password"` |
| Inline Error Messages | `role="alert"`, `aria-live="assertive"` |

**Keyboard Navigation Requirements:**
- All interactive elements reachable via `Tab` key in logical reading order
- Slider adjustable via `ArrowLeft`/`ArrowRight` keys
- Toggles activated by `Space` key
- Generate button activated by `Enter` or `Space`
- Copy button activated by `Enter` or `Space`
- No keyboard traps anywhere in the application

**Color Contrast:**
- All text must meet a minimum contrast ratio of 4.5:1 against its background (WCAG AA)
- Strength bar colors must be accompanied by text labels (color is not the sole indicator)
- Focus indicators must have a visible outline (minimum 2px, high-contrast color)

---

## Browser Compatibility

**Description:** The application must function correctly on the latest two major versions of the four target browser families, with graceful degradation for missing APIs.

**Supported Environments:**

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | Latest 2 versions | Full support expected |
| Firefox | Latest 2 versions | Full support expected |
| Safari | Latest 2 versions | Clipboard API may require HTTPS |
| Edge | Latest 2 versions | Chromium-based; same as Chrome |

**API Availability Matrix:**

| API | Chrome | Firefox | Safari | Edge | Fallback |
|-----|--------|---------|--------|------|----------|
| `crypto.getRandomValues` | ✅ | ✅ | ✅ | ✅ | None — show error |
| `navigator.clipboard.writeText` | ✅ (HTTPS) | ✅ (HTTPS) | ✅ (HTTPS) | ✅ (HTTPS) | `execCommand('copy')` |
| CSS `overflow-x: auto` | ✅ | ✅ | ✅ | ✅ | None needed |
| `input type="range"` | ✅ | ✅ | ✅ | ✅ | None needed |

**HTTPS Requirement:** The `navigator.clipboard` API is only available in secure contexts (HTTPS). The application must be hosted over HTTPS. On HTTP (e.g., local development without a dev server), the `execCommand` fallback will be used automatically.

---

*Document generated by Pivota Spec FRD Generator — 2026-05-04*
