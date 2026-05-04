# Requirements Traceability Matrix: Password Generator
**Version:** 1.0  
**Date:** 2026-05-04  
**Status:** Draft  
**Project Acronym:** PasswordGenerator  
**Based on:** PRD-PasswordGenerator.md v1.0, FRD-PasswordGenerator.md v1.0, TechArch-PasswordGenerator.md v1.0, UserStories-PasswordGenerator.md v1.0

---

## Table of Contents

1. [Overview](#1-overview)
2. [Requirements Summary](#2-requirements-summary)
3. [Traceability Matrix](#3-traceability-matrix)
4. [Requirements Detail](#4-requirements-detail)
5. [Test Case Coverage](#5-test-case-coverage)
6. [Change Management](#6-change-management)
7. [Approval](#7-approval)

---

## 1. Overview

This Requirements Traceability Matrix (RTM) provides bidirectional traceability between all Password Generator specification documents. It ensures that every business requirement defined in the Product Requirements Document (PRD) is elaborated in the Functional Requirements Document (FRD), implemented through Technical Architecture (TechArch) specifications, and validated through User Stories and associated test cases.

Password Generator is a zero-backend single-page application (SPA) that generates cryptographically secure random passwords entirely within the user's browser. The RTM covers seven features (F0–F6) spanning the cryptographic generation engine, UI configuration controls, password display, clipboard integration, strength indication, and the primary generate action trigger.

Traceability is maintained at four levels: (1) **PRD Features** define the high-level product capabilities and priorities; (2) **FRD Requirements** specify exact behavior, validation rules, error states, and component interactions; (3) **TechArch Specifications** define the implementation architecture, data models, module APIs, security controls, and architectural decisions; and (4) **User Stories** express user-facing acceptance criteria linked to each feature, providing the testable definition of done.

All traceability links in this document are bidirectional: each PRD feature can be traced forward to the user stories that validate it, and each user story can be traced back to the PRD feature and architectural decision that motivated it. Any future change to a requirement must be propagated across all four traceability levels to maintain integrity.

---

## 2. Requirements Summary

### Functional Requirements by Feature

- **F0 — Password Generation Engine (P0, MVP):** Core cryptographic engine using `crypto.getRandomValues()` exclusively. Implements guaranteed-slot + Fisher-Yates shuffle algorithm. Validates configuration, builds character pool, and produces a password string satisfying all set-representation constraints. Covered by 4 user stories (US-0.1–US-0.4).

- **F1 — Password Length Configuration (P0, MVP):** Dual-control UI with range slider (8–128) and synchronized numeric input. Default length of 16 on page load. Bidirectional sync with boundary clamping on blur. Covered by 4 user stories (US-1.1–US-1.4).

- **F2 — Character Set Toggles (P0, MVP):** Four checkbox/toggle controls for uppercase (A–Z), lowercase (a–z), numbers (0–9), and symbols. Last Active Guard prevents disabling all sets. Default state is all four enabled. Covered by 6 user stories (US-2.1–US-2.6).

- **F3 — Password Display (P0, MVP):** Read-only monospace output field with placeholder text before first generation, horizontal scroll for long passwords, and immediate update on each new generation. Covered by 3 user stories (US-3.1–US-3.3).

- **F4 — Copy to Clipboard (P0, MVP):** One-click copy button using modern `navigator.clipboard.writeText()` with `execCommand('copy')` fallback. "Copied!" confirmation for 2 seconds. Keyboard shortcut support (`Ctrl+C`/`Cmd+C`). Inert state before first generation. Covered by 4 user stories (US-4.1–US-4.4).

- **F5 — Password Strength Indicator (P1, MVP):** Real-time entropy-based strength calculation (`entropy = length × log₂(poolSize)`) mapping to four levels: Weak / Fair / Strong / Very Strong. Color-coded bar + text label. Updates on every configuration change. WCAG-compliant with `role="meter"` ARIA attributes. Covered by 5 user stories (US-5.1–US-5.5).

- **F6 — Generate Button (P0, MVP):** Primary CTA button with keyboard activation (Enter/Space), ARIA attributes, and disabled-state enforcement when no character sets are active. Error display for all engine failure modes. Covered by 4 user stories (US-6.1–US-6.4).

### Non-Functional Requirements Summary

- **Security:** Exclusive use of `crypto.getRandomValues()`; `Math.random()` forbidden by ESLint rule. Zero network requests after page load. No user data persisted or transmitted.
- **Performance:** Password generation < 50ms for any supported length. Page initial load < 2 seconds.
- **Compatibility:** Latest two versions of Chrome, Firefox, Safari, and Edge. Graceful degradation for missing Clipboard API.
- **Accessibility:** WCAG 2.1 AA compliance — keyboard navigable, screen reader compatible, sufficient color contrast, `role="alert"` on error messages.
- **Responsiveness:** Usable on viewports from 320px width through desktop.
- **Privacy:** No analytics, tracking, or telemetry.

### Architectural Decisions Summary

- **ADR-001:** Zero-backend architecture — all logic client-side, no server.
- **ADR-002:** Web Crypto API as sole randomness source — `Math.random()` linter-prohibited.
- **ADR-003:** Guaranteed slot + Fisher-Yates shuffle algorithm for set-representation guarantee.
- **ADR-004:** Vanilla JavaScript over framework — minimal bundle, no virtual DOM overhead.
- **ADR-005:** Single mutable `appState` object as canonical runtime state.

---

## 3. Traceability Matrix

### 3.1 PRD → FRD → TechArch → User Story

| PRD Feature | PRD Priority | FRD Section | TechArch Specification | User Story IDs |
|---|---|---|---|---|
| F0: Password Generation Engine | P0 | §F0 Password Generation Engine | GenerationEngine module (`src/engine/generator.ts`); ADR-002; ADR-003; `buildPool()`, `randomChar()`, `shuffle()`, `generate()` APIs; `GeneratorConfig` / `GeneratorResult` data models | US-0.1, US-0.2, US-0.3, US-0.4 |
| F1: Password Length Configuration | P0 | §F1 Password Length Configuration | `LengthControl` component; `AppState.length`; `StateManager.setLength()`; `renderGenerateButton()` / `renderStrengthIndicator()` render functions; State Transition Table rows for `length` | US-1.1, US-1.2, US-1.3, US-1.4 |
| F2: Character Set Toggles | P0 | §F2 Character Set Toggles | `CharSetToggles` component; `CHAR_SETS` registry; `AppState.enabledSets`; `StateManager.enableSet()` / `StateManager.disableSet()`; `CharSetKey` type; Last Active Guard logic | US-2.1, US-2.2, US-2.3, US-2.4, US-2.5, US-2.6 |
| F3: Password Display | P0 | §F3 Password Display | `PasswordDisplay` component; `AppState.currentPassword`; `StateManager.setCurrentPassword()`; `renderPasswordDisplay()`; `aria-live="polite"` on output field | US-3.1, US-3.2, US-3.3 |
| F4: Copy to Clipboard | P0 | §F4 Copy to Clipboard | `ClipboardManager` module (`src/clipboard.ts`); `copyModern()`, `copyLegacyFallback()`, `copyToClipboard()` APIs; `AppState.copyConfirmActive` / `copyConfirmTimer`; `renderCopyButton()`; HTTPS requirement in §6 | US-4.1, US-4.2, US-4.3, US-4.4 |
| F5: Password Strength Indicator | P1 | §F5 Password Strength Indicator | `StrengthCalculator` module (`src/engine/strength.ts`); `calculateStrength()`, `poolSize()`, `entropyToScore()`, `scoreToMeta()` APIs; `StrengthResult` data model; Strength Level Mapping Table; `renderStrengthIndicator()` | US-5.1, US-5.2, US-5.3, US-5.4, US-5.5 |
| F6: Generate Button | P0 | §F6 Generate Button | `GenerateButton` component; `renderGenerateButton()`; `showInlineError()`; `ErrorCode` types; `AppState.enabledSets` length check; ADR-001 (no backend call on generate) | US-6.1, US-6.2, US-6.3, US-6.4 |

### 3.2 Non-Functional Requirements Traceability

| NFR Category | PRD Requirement | FRD Section | TechArch Specification |
|---|---|---|---|
| Security — Crypto | `crypto.getRandomValues` exclusively; never `Math.random()` | §F0 Validation Rules; §Error Handling (`CRYPTO_UNAVAILABLE`) | §6 Security Architecture — Cryptographic Randomness; ADR-002; ESLint `no-restricted-syntax` rule; `unbiasedRandomIndex()` rejection sampling |
| Security — Privacy | No data transmission or storage | §Overview (zero-backend); §F4 (`COPY_FAILED` error) | §6 Data Privacy table; ADR-001; §8 Third-Party Services (None) |
| Security — Input Validation | All inputs validated before use | §F0–F6 Validation Rules | §6 Input Validation table; `generate()` validation table |
| Security — CSP | Strict Content Security Policy | (Referenced in §Overview) | §6 Content Security Policy (Recommended); §8 Hosting Integration |
| Performance | Generation < 50ms; page load < 2s | §F0 (generation speed); §Browser Compatibility | §7 Technology Stack (Vanilla JS, zero runtime overhead); §1 Deployment Topology |
| Accessibility | WCAG 2.1 AA | §Accessibility Requirements (full table) | `aria-live="polite"` on PasswordDisplay; `role="meter"` on StrengthBar; `aria-disabled` on GenerateButton; `role="alert"` on inline errors; `renderStrengthIndicator()` ARIA update |
| Browser Compatibility | Latest 2 versions of Chrome, Firefox, Safari, Edge | §Browser Compatibility — API Availability Matrix | §7 Technology Stack; §8 Browser API Integrations — Clipboard API fallback |
| Responsiveness | Usable at 320px+ | (Referenced in §F3 display) | §7 CSS3 (Flexbox/Grid responsive design) |

### 3.3 Architectural Decision → Feature Traceability

| ADR ID | Decision | Affected PRD Features | Affected FRD Sections |
|---|---|---|---|
| ADR-001 | Zero-Backend Architecture | F0, F4, F6 | §Overview; §F0 (no API calls); §F4 (local clipboard only) |
| ADR-002 | Web Crypto API as Sole Randomness Source | F0 | §F0 Validation Rules; §F0 Error States (`CRYPTO_UNAVAILABLE`) |
| ADR-003 | Guaranteed Slot + Fisher-Yates Algorithm | F0, F2 | §F0 Process (steps 4–7); §F0 Sub-features |
| ADR-004 | Vanilla JavaScript Over a Framework | F0–F6 (all) | §Component Architecture; §Application State Model |
| ADR-005 | Single Mutable `appState` Object | F1, F2, F3, F4, F5, F6 | §Application State Model; all inter-component communication |

---

## 4. Requirements Detail

### F0: Password Generation Engine

**PRD Capability:** Generate a cryptographically random password using the selected character pool; guarantee at least one character from each enabled set; re-generate on demand.

**FRD Requirements:**
- The engine accepts a `GeneratorConfig` object (`length` integer, `enabledSets` array) and returns a `GeneratorResult` with the password string.
- `crypto.getRandomValues()` is the exclusive source of randomness; `Math.random()` is strictly forbidden.
- Algorithm: (1) build character pool, (2) fill guaranteed slots (one per enabled set), (3) fill remaining positions from full pool, (4) apply Fisher-Yates shuffle.
- `length` must be an integer in [8, 128]; values outside range are clamped with a console warning.
- `enabledSets` must be non-empty; if empty, `NO_SETS_ENABLED` error is thrown.
- `length` must be ≥ `enabledSets.length`; if not, length is auto-increased and `lengthAdjusted = true`.
- If `crypto.getRandomValues` is unavailable, `CRYPTO_UNAVAILABLE` error is thrown and displayed persistently.

**TechArch Specifications:**
- Module: `GenerationEngine` at `src/engine/generator.ts` — exports `generate()`, `buildPool()`, `randomChar()`, `shuffle()`.
- Data models: `GeneratorConfig` (input), `GeneratorResult` (output), `CharSetKey` union type.
- `CHAR_SETS` registry defines the authoritative character strings: uppercase (26), lowercase (26), numbers (10), symbols (28).
- Rejection sampling via `unbiasedRandomIndex()` eliminates modulo bias.
- Error types: `CryptoUnavailableError`, `ConfigurationError` (with `ErrorCode` enum).

**User Stories:** US-0.1, US-0.2, US-0.3, US-0.4

---

### F1: Password Length Configuration

**PRD Capability:** Slider (8–128) and numeric input synced in real time; default 16; enforce min 8 / max 128.

**FRD Requirements:**
- Both controls share `appState.length`; bidirectional sync is maintained at all times.
- Default value on page load: `16`.
- Clamping to [8, 128] occurs on `blur` (not every keystroke).
- Non-numeric input reverts to previous valid value on `blur`.
- Empty field on `blur` reverts to previous valid value (not zero).
- A visible length label (e.g., "Length: 16") is displayed adjacent to the slider.

**TechArch Specifications:**
- Component: `LengthControl` containing `LengthSlider` (`input[type=range]`), `LengthInput` (`input[type=number]`), `LengthLabel`.
- State field: `AppState.length` (integer, default 16).
- State mutation: `StateManager.setLength(state, value)` — clamps to [8, 128] and triggers UI refresh.
- Render functions: `renderStrengthIndicator()` called on every length change.
- State Transition: "Slider dragged / input changed → `length` clamped to [8, 128]."

**User Stories:** US-1.1, US-1.2, US-1.3, US-1.4

---

### F2: Character Set Toggles

**PRD Capability:** Four toggles for uppercase, lowercase, numbers, symbols; at least one must remain enabled; default all four on.

**FRD Requirements:**
- Four checkboxes/toggle-switches map to `CharSetKey` values: `uppercase`, `lowercase`, `numbers`, `symbols`.
- Default state: all four enabled; `appState.enabledSets = ["uppercase", "lowercase", "numbers", "symbols"]`.
- **Last Active Guard:** if only one set is enabled and user attempts to disable it, the toggle is snapped back to `checked` and an inline message "At least one character set must be selected." is shown for 3 seconds.
- Any toggle change triggers `StrengthIndicator` recalculation and `GenerateButton` disabled-state evaluation.
- `appState.enabledSets` always reflects exactly the checked toggles.

**TechArch Specifications:**
- Component: `CharSetToggles` containing `UppercaseToggle`, `LowercaseToggle`, `NumbersToggle`, `SymbolsToggle`.
- Data: `CHAR_SETS` registry (compile-time constant); `CharSetKey` type; `CharSetDefinition` interface.
- State field: `AppState.enabledSets: CharSetKey[]`.
- State mutations: `StateManager.enableSet()` / `StateManager.disableSet()` — `disableSet()` returns `false` if Last Active Guard fires.
- State Transitions: "Character set toggled off (last) → none (Last Active Guard)."

**User Stories:** US-2.1, US-2.2, US-2.3, US-2.4, US-2.5, US-2.6

---

### F3: Password Display

**PRD Capability:** Read-only monospace output field; placeholder before first generation; horizontal scroll for long passwords; immediate update on new generation.

**FRD Requirements:**
- Output field rendered with `readonly` attribute (if `<input>`) or non-editable behavior (if `<div>`).
- Monospace font applied (e.g., Courier New, Consolas).
- Placeholder text on page load: "Click Generate to create a password".
- On new password: clear placeholder, set value, reset scroll to start.
- `overflow-x: auto` ensures no truncation of long passwords.
- Field is focusable via keyboard (supports `Ctrl+C`/`Cmd+C` copy shortcut from F4).
- `aria-live="polite"` so screen readers announce new passwords.

**TechArch Specifications:**
- Component: `PasswordDisplay` — reads `AppState.currentPassword`.
- State field: `AppState.currentPassword: string | null` (null before first generation).
- State mutation: `StateManager.setCurrentPassword()` — triggers `renderPasswordDisplay()`, `renderStrengthIndicator()`, and un-inerts `CopyButton`.
- Render function: `renderPasswordDisplay(password: string | null)` — resets scroll position.

**User Stories:** US-3.1, US-3.2, US-3.3

---

### F4: Copy to Clipboard

**PRD Capability:** "Copy" button using `navigator.clipboard` with `execCommand` fallback; "Copied!" confirmation for 2 seconds; inert state before first generation; `Ctrl+C`/`Cmd+C` keyboard shortcut.

**FRD Requirements:**
- `navigator.clipboard.writeText()` attempted first (requires HTTPS); falls back to `document.execCommand('copy')` via temporary `<textarea>`.
- If both methods fail: inline error "Copy failed. Please select and copy the password manually." (auto-dismisses 5s).
- Visual confirmation: button label changes to "Copied!" for exactly 2000ms then reverts.
- Re-click while confirming resets the 2-second timer.
- Inert state: no-op (and no visual change) if `appState.currentPassword` is null or empty.
- Keyboard shortcut: `keydown` on focused output field intercepts `Ctrl+C`/`Cmd+C`, calls `event.preventDefault()`, and invokes the same copy handler.

**TechArch Specifications:**
- Module: `ClipboardManager` at `src/clipboard.ts` — exports `copyModern()`, `copyLegacyFallback()`, `copyToClipboard()`.
- `copyModern(text)` returns `Promise<boolean>`; `copyLegacyFallback(text)` returns `boolean`.
- `copyToClipboard(text)` returns `Promise<'modern' | 'fallback' | 'failed'>`.
- State fields: `AppState.copyConfirmActive: boolean`, `AppState.copyConfirmTimer`.
- Render function: `renderCopyButton(confirming: boolean)`.
- Security: HTTPS required for `navigator.clipboard`; §6 Secure Context requirement.
- Error code: `COPY_FAILED`.

**User Stories:** US-4.1, US-4.2, US-4.3, US-4.4

---

### F5: Password Strength Indicator

**PRD Capability:** Real-time color-coded bar + text label; four levels (Weak/Fair/Strong/Very Strong); entropy-based calculation; updates on every config change; never blocks generation.

**FRD Requirements:**
- Entropy formula: `entropy = length × log₂(poolSize)` where `poolSize` = sum of character counts in enabled sets.
- Score mapping: entropy < 40 → Weak (1); < 60 → Fair (2); < 80 → Strong (3); ≥ 80 → Very Strong (4).
- Bar visual: 25% / 50% / 75% / 100% width; colors `#e53e3e` / `#dd6b20` / `#d69e2e` / `#38a169`.
- Text label matches bar level at all times.
- ARIA: `role="meter"`, `aria-valuemin="1"`, `aria-valuemax="4"`, `aria-valuenow="{score}"`, `aria-label="Password strength: {level}"`.
- Updates triggered by any change to `appState.length` or `appState.enabledSets`, and after each generation.
- Indicator is read-only and informational — never blocks generation.
- Edge case: if `poolSize` is 0 (prevented by Last Active Guard), defaults to score 1 (Weak).

**TechArch Specifications:**
- Module: `StrengthCalculator` at `src/engine/strength.ts` — exports `calculateStrength()`, `poolSize()`, `entropyToScore()`, `scoreToMeta()`.
- Data model: `StrengthResult` interface (`entropy`, `score`, `level`, `color`, `barWidth`).
- Data types: `StrengthScore` (1|2|3|4), `StrengthLevel` ('Weak'|'Fair'|'Strong'|'Very Strong').
- Strength Level Mapping Table in §4 (Data Model).
- Render function: `renderStrengthIndicator(result: StrengthResult)` — updates bar width, color, label text, and ARIA label in a single DOM write.

**User Stories:** US-5.1, US-5.2, US-5.3, US-5.4, US-5.5

---

### F6: Generate Button

**PRD Capability:** Primary CTA button; click and keyboard (Enter/Space) trigger generation; disabled when no sets active; proper ARIA attributes.

**FRD Requirements:**
- Button renders in Active state on page load (all sets enabled by default).
- ARIA: `aria-label="Generate Password"`, `aria-disabled="true"` when disabled.
- Activation: click, or `Enter`/`Space` keydown when focused.
- On activation: calls `GenerationEngine.generate({ length, enabledSets })`; on success, writes to `appState.currentPassword`, updates `PasswordDisplay` (F3) and `StrengthIndicator` (F5).
- After generation, focus returns to the Generate button.
- Disabled state: `disabled` HTML attribute set (not just CSS) when `appState.enabledSets.length === 0`; visually greyed out.
- Error display (inline below button): `CRYPTO_UNAVAILABLE` (persistent), `NO_SETS_ENABLED` (5s), `GENERATION_ERROR` (5s).

**TechArch Specifications:**
- Component: `GenerateButton` — reads `AppState.enabledSets`; writes `AppState.currentPassword`.
- Render functions: `renderGenerateButton(enabled: boolean)`, `showInlineError(targetEl, code, message, durationMs)`.
- Error codes: `CRYPTO_UNAVAILABLE`, `NO_SETS_ENABLED`, `GENERATION_ERROR`.
- Inter-component: GenerateButton → PasswordDisplay, StrengthIndicator, CopyButton on generation complete.
- ADR-001: No backend call; generation is pure local computation.

**User Stories:** US-6.1, US-6.2, US-6.3, US-6.4

---

## 5. Test Case Coverage

### 5.1 Test Case Matrix by Feature and User Story

| Feature | User Story | TEST ID | Test Case Description | Test Type | Expected Outcome |
|---|---|---|---|---|---|
| F0 | US-0.1 | TEST-0.1.1 | Click Generate button — new password produced without page reload | Functional / E2E | Password string appears in display field; no page reload |
| F0 | US-0.1 | TEST-0.1.2 | Generated password contains only characters from enabled sets | Unit | All characters in output ∈ character pool of enabled sets |
| F0 | US-0.1 | TEST-0.1.3 | Generation completes within 50ms for all lengths 8–128 | Performance | `performance.now()` delta < 50ms |
| F0 | US-0.2 | TEST-0.2.1 | `generate()` uses `crypto.getRandomValues()` — no `Math.random()` call | Static / Lint | ESLint reports zero `Math.random()` usages |
| F0 | US-0.2 | TEST-0.2.2 | Zero network requests made during generation | Integration | DevTools / network log shows no outbound requests |
| F0 | US-0.2 | TEST-0.2.3 | `CRYPTO_UNAVAILABLE` error shown when `window.crypto` is unavailable | Unit | Inline error message displayed; generation blocked |
| F0 | US-0.3 | TEST-0.3.1 | Password contains ≥ 1 character from each of 4 enabled sets | Unit | Output contains uppercase, lowercase, number, and symbol |
| F0 | US-0.3 | TEST-0.3.2 | Guaranteed characters distributed throughout password (not positionally clustered) | Unit (statistical) | Fisher-Yates shuffle applied; guaranteed chars not always at start |
| F0 | US-0.3 | TEST-0.3.3 | Guarantee holds at minimum length (8 chars, all 4 sets enabled) | Unit | Each enabled set represented in 8-character password |
| F0 | US-0.4 | TEST-0.4.1 | Three rapid sequential Generate clicks produce three distinct passwords | Functional | Three distinct password strings; previous replaced each time |
| F1 | US-1.1 | TEST-1.1.1 | Slider renders with `min=8`, `max=128` | UI / DOM | Slider `min` and `max` attributes are 8 and 128 |
| F1 | US-1.1 | TEST-1.1.2 | Dragging slider updates numeric input in real time | Functional | Numeric input value equals slider value after drag |
| F1 | US-1.1 | TEST-1.1.3 | `appState.length` updated on every slider position change | Unit | `appState.length` equals slider value after interaction |
| F1 | US-1.2 | TEST-1.2.1 | Typing `5` in numeric input and blurring clamps to `8` | Functional | Input displays `8`; slider at position 8 |
| F1 | US-1.2 | TEST-1.2.2 | Typing `200` in numeric input and blurring clamps to `128` | Functional | Input displays `128`; slider at position 128 |
| F1 | US-1.2 | TEST-1.2.3 | Typing `abc` in numeric input and blurring reverts to previous valid value | Functional | Input reverts; `appState.length` unchanged |
| F1 | US-1.3 | TEST-1.3.1 | Length label displays "Length: 16" on page load | UI | Label text content equals "Length: 16" |
| F1 | US-1.3 | TEST-1.3.2 | Length label updates immediately on slider drag | Functional | Label text matches slider value in real time |
| F1 | US-1.4 | TEST-1.4.1 | Page load sets slider, numeric input, and label to 16 | UI / DOM | All three elements show value 16 on fresh load |
| F1 | US-1.4 | TEST-1.4.2 | Password generated immediately without config change is 16 characters | Functional | `appState.currentPassword.length === 16` |
| F2 | US-2.1 | TEST-2.1.1 | Unchecking uppercase — subsequent passwords contain no A–Z chars | Functional | Generated password matches `/^[^A-Z]+$/` |
| F2 | US-2.2 | TEST-2.2.1 | Unchecking lowercase — subsequent passwords contain no a–z chars | Functional | Generated password matches `/^[^a-z]+$/` |
| F2 | US-2.3 | TEST-2.3.1 | Unchecking numbers — subsequent passwords contain no 0–9 chars | Functional | Generated password matches `/^[^0-9]+$/` |
| F2 | US-2.4 | TEST-2.4.1 | Unchecking symbols — subsequent passwords contain no symbol chars | Functional | Generated password contains no chars from symbol set |
| F2 | US-2.5 | TEST-2.5.1 | Attempting to uncheck last remaining enabled set — toggle snaps back to checked | Functional | Toggle remains checked; `appState.enabledSets` unchanged |
| F2 | US-2.5 | TEST-2.5.2 | Inline message "At least one character set must be selected." shown for 3 seconds | Functional | Message appears; auto-dismisses after 3s |
| F2 | US-2.5 | TEST-2.5.3 | `appState.enabledSets` always has ≥ 1 entry after any toggle interaction | Unit | Array length ≥ 1 after Last Active Guard fires |
| F2 | US-2.6 | TEST-2.6.1 | Page load initializes all four toggles as checked | UI / DOM | All four checkboxes have `checked` property `true` |
| F2 | US-2.6 | TEST-2.6.2 | `appState.enabledSets` equals `["uppercase","lowercase","numbers","symbols"]` on init | Unit | State value matches expected array on initialization |
| F3 | US-3.1 | TEST-3.1.1 | Password output field uses monospace font | UI / CSS | Computed `font-family` includes monospace value |
| F3 | US-3.1 | TEST-3.1.2 | Output field has `overflow-x: auto` for long passwords | UI / CSS | CSS property `overflow-x` equals `auto` |
| F3 | US-3.1 | TEST-3.1.3 | Display updates immediately after each generation | Functional | Output field value equals `appState.currentPassword` after generation |
| F3 | US-3.2 | TEST-3.2.1 | Placeholder text "Click Generate to create a password" shown on page load | UI | Output field displays placeholder before any generation |
| F3 | US-3.2 | TEST-3.2.2 | Placeholder replaced immediately upon first generation | Functional | Placeholder absent after first Generate click |
| F3 | US-3.3 | TEST-3.3.1 | Output field has `readonly` attribute or equivalent non-editable behavior | UI / DOM | Typing into field does not change its displayed value |
| F3 | US-3.3 | TEST-3.3.2 | Output field is focusable via Tab key | Accessibility | Field receives focus on Tab key press |
| F4 | US-4.1 | TEST-4.1.1 | Clicking Copy button writes password to clipboard | Functional | `navigator.clipboard.readText()` returns current password |
| F4 | US-4.1 | TEST-4.1.2 | Button label changes to "Copied!" immediately after successful copy | Functional | Button text content equals "Copied!" after click |
| F4 | US-4.1 | TEST-4.1.3 | "Copied!" label reverts to "Copy" after exactly 2000ms | Functional | Button text equals "Copy" after 2000ms |
| F4 | US-4.1 | TEST-4.1.4 | Re-clicking Copy while confirming resets the 2-second timer | Functional | Timer resets; "Copied!" remains visible for 2s after second click |
| F4 | US-4.2 | TEST-4.2.1 | Fallback to `execCommand('copy')` when `navigator.clipboard` unavailable | Integration | Password copied successfully via fallback in HTTP context |
| F4 | US-4.2 | TEST-4.2.2 | Temporary `<textarea>` removed from DOM after fallback copy | Functional | No orphaned `<textarea>` elements after copy |
| F4 | US-4.2 | TEST-4.2.3 | Inline error "Copy failed…" shown for 5s when both methods fail | Functional | Error message appears and auto-dismisses after 5s |
| F4 | US-4.3 | TEST-4.3.1 | Copy button click has no effect before first generation | Functional | No "Copied!" state; clipboard unchanged when `currentPassword` is null |
| F4 | US-4.4 | TEST-4.4.1 | `Ctrl+C` while output field focused triggers copy handler | Functional | Password written to clipboard; "Copied!" confirmation shown |
| F4 | US-4.4 | TEST-4.4.2 | `Ctrl+C` handler calls `event.preventDefault()` | Unit | Native browser copy not invoked (handler intercepts event) |
| F5 | US-5.1 | TEST-5.1.1 | Strength bar width is 25% when entropy < 40 bits | Unit | Bar width CSS equals "25%" |
| F5 | US-5.1 | TEST-5.1.2 | Strength bar width is 100% with all 4 sets and length 16 | Unit | entropy = 16 × log₂(90) ≈ 103.3 bits → Very Strong → 100% |
| F5 | US-5.1 | TEST-5.1.3 | Bar color updates on character set toggle change | Functional | Bar `background-color` reflects new strength score |
| F5 | US-5.2 | TEST-5.2.1 | Text label displays "Very Strong" for default config (length 16, all sets) | Functional | Label text content equals "Very Strong" on page load |
| F5 | US-5.2 | TEST-5.2.2 | Text label and bar are always in sync | Unit | `score` from `calculateStrength()` matches both bar and label |
| F5 | US-5.3 | TEST-5.3.1 | Entropy formula `entropy = length × log₂(poolSize)` is correctly implemented | Unit | `calculateStrength(16, allSets).entropy ≈ 103.3` |
| F5 | US-5.3 | TEST-5.3.2 | Score thresholds: entropy < 40 → 1, < 60 → 2, < 80 → 3, ≥ 80 → 4 | Unit | `entropyToScore(39)=1`, `entropyToScore(59)=2`, `entropyToScore(79)=3`, `entropyToScore(80)=4` |
| F5 | US-5.4 | TEST-5.4.1 | Strength indicator displays score on page load without any generation | Functional | Score visible from page load reflecting default config |
| F5 | US-5.4 | TEST-5.4.2 | Adjusting slider updates strength indicator without Generate click | Functional | Bar and label update as slider is dragged |
| F5 | US-5.4 | TEST-5.4.3 | Toggling a character set updates strength indicator without Generate click | Functional | Bar and label update after toggle change |
| F5 | US-5.5 | TEST-5.5.1 | Strength bar has `role="meter"` with correct ARIA attributes | Accessibility | DOM inspection confirms `role`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` |
| F5 | US-5.5 | TEST-5.5.2 | `aria-label` reads "Password strength: {level}" and updates with bar | Accessibility | `aria-label` value updates on every strength change |
| F6 | US-6.1 | TEST-6.1.1 | Clicking Generate button updates `appState.currentPassword` | Functional | `currentPassword` is a non-null string after click |
| F6 | US-6.1 | TEST-6.1.2 | Password display (F3) updates immediately after Generate click | Functional | Output field value equals `currentPassword` |
| F6 | US-6.1 | TEST-6.1.3 | Strength indicator (F5) updates immediately after Generate click | Functional | Strength bar and label reflect current config after click |
| F6 | US-6.2 | TEST-6.2.1 | Generate button is reachable via Tab key | Accessibility | Button receives focus in tab order |
| F6 | US-6.2 | TEST-6.2.2 | Pressing Enter while button focused triggers generation | Functional | New password produced via keyboard Enter |
| F6 | US-6.2 | TEST-6.2.3 | Pressing Space while button focused triggers generation | Functional | New password produced via keyboard Space |
| F6 | US-6.2 | TEST-6.2.4 | Focus returns to Generate button after generation completes | Functional | `document.activeElement` equals Generate button post-generation |
| F6 | US-6.3 | TEST-6.3.1 | Generate button has `disabled` attribute when `enabledSets` is empty | Functional | `button.disabled === true` (not just CSS) |
| F6 | US-6.3 | TEST-6.3.2 | `aria-disabled="true"` set on button in disabled state | Accessibility | ARIA attribute present in DOM |
| F6 | US-6.3 | TEST-6.3.3 | Button returns to active state immediately when a set is re-enabled | Functional | `button.disabled === false` after toggle re-enabled |
| F6 | US-6.4 | TEST-6.4.1 | `CRYPTO_UNAVAILABLE` error displayed persistently below button | Functional | Inline error message present; no auto-dismiss |
| F6 | US-6.4 | TEST-6.4.2 | `GENERATION_ERROR` inline message auto-dismisses after 5 seconds | Functional | Error message absent after 5s |
| F6 | US-6.4 | TEST-6.4.3 | Error messages include `role="alert"` for screen reader announcement | Accessibility | `role="alert"` attribute on error element |

### 5.2 Coverage Summary by Feature

| Feature | User Stories | Test Cases | Test Types | Coverage |
|---|---|---|---|---|
| F0: Password Generation Engine | 4 (US-0.1–US-0.4) | 10 | Unit, Functional, Performance, Integration, Static/Lint | 100% |
| F1: Password Length Configuration | 4 (US-1.1–US-1.4) | 9 | UI/DOM, Functional, Unit | 100% |
| F2: Character Set Toggles | 6 (US-2.1–US-2.6) | 9 | Functional, Unit, UI/DOM | 100% |
| F3: Password Display | 3 (US-3.1–US-3.3) | 6 | UI/CSS, Functional, Accessibility | 100% |
| F4: Copy to Clipboard | 4 (US-4.1–US-4.4) | 9 | Functional, Integration, Unit | 100% |
| F5: Password Strength Indicator | 5 (US-5.1–US-5.5) | 10 | Unit, Functional, Accessibility | 100% |
| F6: Generate Button | 4 (US-6.1–US-6.4) | 10 | Functional, Accessibility | 100% |
| **Total** | **30 stories** | **63 test cases** | — | **100%** |

### 5.3 Non-Functional Test Cases

| NFR Category | TEST ID | Test Description | Test Method |
|---|---|---|---|
| Security — No `Math.random()` | TEST-NFR-001 | ESLint scan reports zero `Math.random()` usages in production code | Static analysis (ESLint) |
| Security — No network requests | TEST-NFR-002 | Browser DevTools network panel shows zero requests after initial page load | Integration / Manual |
| Security — No persistence | TEST-NFR-003 | Page refresh results in cleared `appState.currentPassword` | Functional |
| Performance — Generation speed | TEST-NFR-004 | `generate()` execution time < 50ms for 100 runs at length 128, all 4 sets | Performance benchmark |
| Performance — Page load | TEST-NFR-005 | Lighthouse Performance score ≥ 90 | Lighthouse audit |
| Accessibility — WCAG AA | TEST-NFR-006 | Lighthouse Accessibility score ≥ 90 | Lighthouse audit |
| Accessibility — Color contrast | TEST-NFR-007 | All text elements have contrast ratio ≥ 4.5:1 | Automated contrast check |
| Compatibility — Chrome | TEST-NFR-008 | Full functional test suite passes on latest 2 Chrome versions | Cross-browser test |
| Compatibility — Firefox | TEST-NFR-009 | Full functional test suite passes on latest 2 Firefox versions | Cross-browser test |
| Compatibility — Safari | TEST-NFR-010 | Full functional test suite passes on latest 2 Safari versions | Cross-browser test |
| Compatibility — Edge | TEST-NFR-011 | Full functional test suite passes on latest 2 Edge versions | Cross-browser test |
| Responsiveness — Mobile | TEST-NFR-012 | Application is usable at 320px viewport width | Responsive / Visual |

---

## 6. Change Management

### 6.1 Change Log

| Version | Date | Author | Section Changed | Description of Change | Impact |
|---|---|---|---|---|---|
| 1.0 | 2026-05-04 | Pivota Spec RTM Generator | All | Initial RTM creation based on PRD v1.0, FRD v1.0, TechArch v1.0, UserStories v1.0 | Baseline established |

### 6.2 Change Control Process

Any future change to the Password Generator specification must follow this process to maintain RTM integrity:

1. **Identify the originating document** — determine which spec document (PRD, FRD, TechArch, UserStories) is the source of the change.
2. **Assess downstream impact** — use this RTM to identify all linked documents and test cases that must be updated.
3. **Update all affected documents** — changes must propagate through all four traceability levels simultaneously.
4. **Update this RTM** — revise the relevant row(s) in the Traceability Matrix (§3), Requirements Detail (§4), and Test Case Coverage (§5).
5. **Log the change** — add a row to the Change Log above with version, date, author, section, description, and impact.
6. **Re-approve** — obtain sign-off per §7 before the change is considered baseline.

---

## 7. Approval

### 7.1 Sign-Off

| Role | Name | Signature | Date | Status |
|---|---|---|---|---|
| Product Owner | — | — | — | Pending |
| Engineering Lead | — | — | — | Pending |
| QA Lead | — | — | — | Pending |
| Security Review | — | — | — | Pending |
| Accessibility Review | — | — | — | Pending |

### 7.2 Document Control

| Field | Value |
|---|---|
| Document Title | Requirements Traceability Matrix — Password Generator |
| Document ID | RTM-PasswordGenerator |
| Version | 1.0 |
| Status | Draft — Pending Approval |
| Created | 2026-05-04 |
| Created By | Pivota Spec RTM Generator |
| Based On | PRD-PasswordGenerator.md v1.0, FRD-PasswordGenerator.md v1.0, TechArch-PasswordGenerator.md v1.0, UserStories-PasswordGenerator.md v1.0 |
| Next Review Date | To be set by Product Owner |

### 7.3 Baseline Declaration

Upon sign-off by all required approvers above, this RTM becomes the **baseline traceability document** for Password Generator v1.0. All subsequent specification changes must follow the Change Control Process defined in §6.2, and this document must be re-baselined whenever any linked specification document is updated to a new version.

---

*Document generated by Pivota Spec RTM Generator — 2026-05-04*
