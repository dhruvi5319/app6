# STORY MAP: Password Generator

| Field                | Value                                                                  |
|----------------------|------------------------------------------------------------------------|
| **Product Name**     | Password Generator                                                     |
| **Version**          | 1.0                                                                    |
| **Date**             | 2026-05-04                                                             |
| **Related Personas** | PERSONAS-PasswordGenerator.md (PER-01, PER-02, PER-03)                |
| **Related JTBD**     | JTBD-PasswordGenerator.md                                              |
| **Related Journeys** | JOURNEYS-PasswordGenerator.md                                          |
| **Related Stories**  | UserStories-PasswordGenerator.md                                       |
| **Related PRD**      | PRD-PasswordGenerator.md                                               |
| **Status**           | Draft                                                                  |

---

## Overview

This Story Map organizes all 30 User Stories (US-0.1 through US-6.4) into a two-dimensional grid:

- **X-axis (columns):** Journey stages drawn from JOURNEYS-PasswordGenerator.md, consolidated into five universal stages that span all six journeys.
- **Y-axis (rows):** Epics (F0–F6) and the stories within them, ordered by dependency.
- **NaC column:** Natural Acceptance Criteria derived from the intersection of a JTBD outcome and the journey stage where the story is exercised. Every NaC traces to a specific JTBD-ID.
- **Release column:** Increment assignment. Because this is a single-page app with all features shipping together, releases follow priority order: R1 contains all P0 stories (the working product), R2 contains all P1 stories (strength indicator polish).

**NaC Concept:** NaC are not invented — each one is derived by taking the JTBD functional outcome (the "what matters") and applying it to the specific journey stage (the "when/where") in which the story is exercised, producing a testable criterion that aligns with the UserStory's acceptance criteria.

---

## Story Map Matrix

> Journey stages are consolidated from six journeys into five universal phases:
> **Arrive → Configure → Generate → Copy → Audit**

| Persona | Journey Stage | Epic | SM-ID | Story | NaC (JTBD Source) | Release |
|---------|--------------|------|-------|-------|-------------------|---------|
| PER-01 | **Arrive** | Epic 1 (F1) | SM-1.4 | US-1.4: Load With Sensible Default Length | JTBD-01.1 → "Page arrives with password ready" → Default length of 16 is set on load so the first generation needs no adjustment | R1 |
| PER-01 | **Arrive** | Epic 2 (F2) | SM-2.6 | US-2.6: Start With All Character Sets Enabled | JTBD-01.1 → "Password ready on load with no setup" → All four character sets are enabled by default so the first generated password is maximum-strength | R1 |
| PER-01 | **Arrive** | Epic 3 (F3) | SM-3.2 | US-3.2: Placeholder Text Before First Generation | JTBD-01.1 → "No confusion on first arrival" → Display field shows instructional placeholder before any password is generated | R1 |
| ALL | **Arrive** | Epic 6 (F6) | SM-6.1 | US-6.1: Generate Password by Clicking Button | JTBD-01.1 → "Instant first password requires a single obvious action" → A clearly labeled Generate button is the primary CTA and triggers immediately on click | R1 |
| PER-03 | **Arrive** | Epic 6 (F6) | SM-6.2 | US-6.2: Generate Password Using the Keyboard | JTBD-03.1 → "Enter page with keyboard focus already usable" → Generate button is Tab-reachable and activates on Enter/Space with no mouse required | R1 |
| PER-01 | **Configure** | Epic 1 (F1) | SM-1.1 | US-1.1: Set Length Using Slider | JTBD-01.3 → "Adjust for site restriction in < 30 s without reading docs" → Slider updates length label and numeric input in real time | R1 |
| PER-02 | **Configure** | Epic 1 (F1) | SM-1.2 | US-1.2: Set Length Using Numeric Input | JTBD-02.1 → "48-char policy-compliant credential in < 20 s" → Typing "48" in the number field sets exact length and syncs slider | R1 |
| ALL | **Configure** | Epic 1 (F1) | SM-1.3 | US-1.3: See Length Label Reflecting Current Setting | JTBD-01.3 → "Always know the configured length before generating" → Length label updates immediately on any slider or input change | R1 |
| PER-02 | **Configure** | Epic 2 (F2) | SM-2.1 | US-2.1: Toggle Uppercase Letters | JTBD-02.1 → "Control character sets to match policy" → Disabling uppercase immediately removes A–Z from subsequent output | R1 |
| PER-02 | **Configure** | Epic 2 (F2) | SM-2.2 | US-2.2: Toggle Lowercase Letters | JTBD-02.1 → "Control character sets to match policy" → Disabling lowercase immediately removes a–z from subsequent output | R1 |
| PER-03 | **Configure** | Epic 2 (F2) | SM-2.3 | US-2.3: Toggle Numbers | JTBD-02.1 → "Tailor alphabet for context (config files, scripts)" → Disabling numbers immediately removes 0–9 from subsequent output | R1 |
| PER-01/PER-03 | **Configure** | Epic 2 (F2) | SM-2.4 | US-2.4: Toggle Symbols | JTBD-01.3 / JTBD-03.1 → "Disable symbols for sites that reject them" → Disabling symbols immediately removes special characters from subsequent output | R1 |
| PER-01 | **Configure** | Epic 2 (F2) | SM-2.5 | US-2.5: Prevent Disabling All Character Sets | JTBD-01.3 → "Never reach an invalid state during adjustment" → Last active set cannot be unchecked; inline message explains why | R1 |
| ALL | **Configure** | Epic 6 (F6) | SM-6.3 | US-6.3: Generate Button Disabled When No Sets Active | JTBD-01.3 → "Can't accidentally generate an invalid password" → Generate button has `disabled` attribute when `enabledSets` is empty | R1 |
| PER-02 | **Configure** | Epic 6 (F6) | SM-6.4 | US-6.4: Clear Error If Generation Fails | JTBD-02.1 → "Know immediately if configuration produced an error" → Actionable inline error messages surface for CRYPTO_UNAVAILABLE and NO_SETS_ENABLED conditions | R1 |
| ALL | **Generate** | Epic 0 (F0) | SM-0.1 | US-0.1: Generate a Secure Password on Demand | JTBD-01.1 → "First generation completes in ≤ 10 s of page load" → Clicking Generate produces a new password in < 50ms with no page reload | R1 |
| PER-02 | **Generate** | Epic 0 (F0) | SM-0.2 | US-0.2: Trust Cryptographic Security | JTBD-02.2 → "Verify tool uses crypto.getRandomValues, zero network calls" → `window.crypto.getRandomValues` is the sole source; zero network requests during generation | R1 |
| PER-02 | **Generate** | Epic 0 (F0) | SM-0.3 | US-0.3: Guarantee One Char Per Enabled Set | JTBD-02.1 → "Policy compliance guaranteed, not assumed" → At least one character from each enabled set appears in every output; Fisher-Yates shuffle removes positional bias | R1 |
| PER-03 | **Generate** | Epic 0 (F0) | SM-0.4 | US-0.4: Re-generate Without Page Reload | JTBD-03.2 → "5 distinct passwords in < 30 s, no reload, no settings reset" → Sequential Generate calls each produce distinct output; configured length and toggles persist | R1 |
| ALL | **Generate** | Epic 3 (F3) | SM-3.1 | US-3.1: View Password in Readable Display | JTBD-01.1 → "Password instantly readable after generation" → Monospace output field updates immediately; horizontal scroll for lengths > visible width | R1 |
| PER-02 | **Generate** | Epic 3 (F3) | SM-3.3 | US-3.3: Protected From Accidentally Editing | JTBD-02.3 → "Displayed password is byte-exact source of truth" → `readonly` attribute prevents any keyboard modification of the displayed value | R1 |
| ALL | **Copy** | Epic 4 (F4) | SM-4.1 | US-4.1: Copy to Clipboard With One Click | JTBD-01.1 → "Password in clipboard within 10 s of page load" → Copy button writes to clipboard; label changes to "Copied!" for 2 s with visible confirmation | R1 |
| PER-02 | **Copy** | Epic 4 (F4) | SM-4.2 | US-4.2: Copy Works Across Browsers | JTBD-02.3 → "Byte-exact copy in Chrome, Firefox, Safari, Edge" → Clipboard API with `execCommand` fallback; both paths preserve character fidelity | R1 |
| PER-01 | **Copy** | Epic 4 (F4) | SM-4.3 | US-4.3: Prevent Copy When No Password Exists | JTBD-01.1 → "Copy button only active when there is something valid to copy" → Copy button inert before first generation; no clipboard write for null/empty state | R1 |
| PER-03 | **Copy** | Epic 4 (F4) | SM-4.4 | US-4.4: Copy via Keyboard Shortcut | JTBD-03.1 → "Full generate-and-copy in ≤ 5 keystrokes, zero mouse" → Ctrl+C / Cmd+C on focused output field copies password and triggers "Copied!" feedback | R1 |
| PER-01/PER-02 | **Generate** | Epic 5 (F5) | SM-5.1 | US-5.1: Visual Strength Bar | JTBD-01.2 → "Confirm password is strong at a glance" → Color-coded bar (red→green) at 25/50/75/100% width updates on every config change and generation | R2 |
| PER-01 | **Generate** | Epic 5 (F5) | SM-5.2 | US-5.2: Text Label Alongside Strength Bar | JTBD-01.2 → "Plain-language strength label for non-technical users" → Label reads "Weak / Fair / Strong / Very Strong" and is never out of sync with bar | R2 |
| PER-02 | **Generate** | Epic 5 (F5) | SM-5.3 | US-5.3: Entropy-Based Strength Calculation | JTBD-02.1 → "Strength score accurately reflects cryptographic quality" → `entropy = length × log₂(poolSize)`; thresholds < 40 / < 60 / < 80 / ≥ 80 bits | R2 |
| PER-03 | **Configure** | Epic 5 (F5) | SM-5.4 | US-5.4: Strength Reflects Config Before Generating | JTBD-03.2 → "See projected strength while dialing in settings, before committing" → Strength indicator active from page load; updates on slider/toggle change without Generate click | R2 |
| PER-01 | **Generate** | Epic 5 (F5) | SM-5.5 | US-5.5: Strength Indicator Accessible to Screen Readers | JTBD-01.2 → "Confidence signal reachable by all users including AT users" → `role="meter"` with `aria-valuenow`; `aria-label` reads "Password strength: {level}" | R2 |

---

## NaC Derivation Table

Full traceability: JTBD Outcome → Journey Stage → NaC → Story

| JTBD-ID | Outcome (from JTBD doc) | Journey Stage | NaC (testable criterion) | Story |
|---------|------------------------|---------------|--------------------------|-------|
| JTBD-01.1 | Password generated and copied in ≤ 10 s of page load | JRN-01.1: Arrive | Page loads with default length 16 and all sets enabled; password visible after first Generate click with zero additional configuration | US-1.4, US-2.6 |
| JTBD-01.1 | Instant password on demand — single click | JRN-01.1: Generate | Clicking Generate produces a password in < 50ms; no page reload; output field updates immediately | US-0.1 |
| JTBD-01.1 | One-click copy with visual confirmation | JRN-01.1: Copy | Clicking Copy writes exact password to clipboard; button shows "Copied!" for 2 s; inert before first generation | US-4.1, US-4.3 |
| JTBD-01.1 | Password display readable immediately | JRN-01.1: Orient | Password shown in monospace field immediately after generation; placeholder visible before first generation | US-3.1, US-3.2 |
| JTBD-01.2 | Default generation shows "Strong" or "Very Strong" | JRN-01.1: Verify | With all 4 sets enabled (pool 90) and length 16, entropy = 16 × log₂(90) ≈ 107 bits → "Very Strong"; bar is green and 100% wide | US-5.1, US-5.2, US-5.3 |
| JTBD-01.2 | Real-time plain-language strength signal | JRN-01.2: Verify | Strength label and bar update immediately when length or toggles change; color is not the sole indicator | US-5.2, US-5.5 |
| JTBD-01.3 | Adjusted password in < 30 s without help text | JRN-01.2: Adjust Length | Slider and numeric input sync in real time; length label reflects current value; slider range is 8–128 | US-1.1, US-1.3 |
| JTBD-01.3 | Toggle symbols; output updates immediately | JRN-01.2: Disable Symbols | Unchecking Symbols removes `"symbols"` from `enabledSets`; new generation contains no symbol characters | US-2.4 |
| JTBD-01.3 | Never reach an invalid generator state | JRN-01.2: Disable Symbols | Last active set cannot be unchecked; Generate button disabled when `enabledSets` empty | US-2.5, US-6.3 |
| JTBD-02.1 | 48-char policy-compliant credential in < 20 s | JRN-02.1: Configure Length | Numeric input accepts 48; slider syncs; clamping prevents out-of-range values | US-1.2 |
| JTBD-02.1 | Independent toggle per character set; at least one per set guaranteed | JRN-02.1: Disable Symbols | Each of four toggles independently controls its set; guaranteed inclusion via Fisher-Yates | US-2.1, US-2.2, US-2.3, US-0.3 |
| JTBD-02.1 | Strength reads "Very Strong" for 48-char, 3-set config | JRN-02.1: Verify Strength | entropy = 48 × log₂(62) ≈ 285 bits → "Very Strong"; indicator updates correctly after symbol toggle | US-5.3 |
| JTBD-02.1 | Actionable error on misconfiguration | JRN-02.1: Generate | Inline error messages for CRYPTO_UNAVAILABLE and NO_SETS_ENABLED conditions; styled with `role="alert"` | US-6.4 |
| JTBD-02.2 | Zero outbound requests during full page session | JRN-02.2: Inspect Network | DevTools Network tab shows zero requests after page asset load; no analytics, no telemetry | US-0.2 |
| JTBD-02.2 | `crypto.getRandomValues` sole randomness source | JRN-02.2: Audit Source | `Math.random` absent from generation path; `crypto.getRandomValues` visible and sole random call | US-0.2 |
| JTBD-02.3 | Pasted password byte-for-byte identical to displayed | JRN-02.1: Copy | Clipboard API produces exact string; `readonly` display prevents pre-copy edits; fallback preserves fidelity | US-3.3, US-4.2 |
| JTBD-03.1 | Full workflow in ≤ 5 keystrokes, zero mouse | JRN-03.1: Navigate to Generate | Tab order: length → toggles → Generate → Copy; Generate fires on Enter/Space; Copy fires on Enter/Space | US-6.2, US-4.4 |
| JTBD-03.1 | Keyboard copy with focus-visible confirmation | JRN-03.1: Navigate to Copy | Ctrl+C / Cmd+C on focused output copies password and triggers "Copied!" visual feedback | US-4.4 |
| JTBD-03.2 | 5 distinct passwords in < 30 s, no reload, settings persist | JRN-03.2: Generate × 5 | Each Generate call produces unique output; no page reload; length and toggle state unchanged between calls | US-0.4 |
| JTBD-03.2 | Strength indicator active from load; updates on config change | JRN-03.2: Configure Once | Strength score reflects current `appState` at all times; updates without requiring Generate click | US-5.4 |
| JTBD-03.3 | Generation function located and audited in < 10 min | JRN-03.2: Inspect Source | `crypto.getRandomValues` is sole randomness call; `Math.random` absent; function is self-contained and named | US-0.2 |

---

## Release Planning

### R1: Core Workflow — "Every Persona Can Generate and Copy"
**Theme:** Ship the complete generate-configure-copy flow for all three personas. All P0 stories. Every journey reaches its success outcome.

**Stories (25):** US-0.1, US-0.2, US-0.3, US-0.4, US-1.1, US-1.2, US-1.3, US-1.4, US-2.1, US-2.2, US-2.3, US-2.4, US-2.5, US-2.6, US-3.1, US-3.2, US-3.3, US-4.1, US-4.2, US-4.3, US-4.4, US-6.1, US-6.2, US-6.3, US-6.4

| Persona | Journeys Fully Satisfied | JTBD Addressed |
|---------|--------------------------|----------------|
| PER-01 Alex | JRN-01.1 (instant password), JRN-01.2 (site restrictions) | JTBD-01.1, JTBD-01.3 |
| PER-02 Maya | JRN-02.1 (provisioning), JRN-02.2 (security audit) | JTBD-02.1, JTBD-02.2, JTBD-02.3 |
| PER-03 Jordan | JRN-03.1 (keyboard workflow), JRN-03.2 (batch generation, code eval) | JTBD-03.1, JTBD-03.2, JTBD-03.3 |

**JTBD Not Yet Addressed in R1:** JTBD-01.2 (strength verification) — partial; generation works but visual strength feedback is not yet present.

**R1 Journey Completeness Check:**
- JRN-01.1: Arrive ✅ | Orient ✅ | Verify ⚠️ (no indicator yet) | Copy ✅ | Use ✅
- JRN-01.2: Return ✅ | Adjust Length ✅ | Disable Symbols ✅ | Verify ⚠️ (no indicator) | Copy ✅
- JRN-02.1: Configure ✅ | Disable Symbols ✅ | Generate ✅ | Verify Strength ⚠️ (no indicator) | Copy ✅ | Paste ✅
- JRN-02.2: Open with Suspicion ✅ | Inspect Network ✅ | Audit Source ✅ | Approve ✅
- JRN-03.1: Switch Tab ✅ | Navigate Generate ✅ | Trigger ✅ | Navigate Copy ✅ | Use ✅
- JRN-03.2: Configure Once ✅ | Generate ×5 ✅ | Verify Uniqueness ✅ | Inspect Source ✅ | Decide ✅

> ⚠️ Strength verification stages (JRN-01.1 Verify, JRN-01.2 Verify, JRN-02.1 Verify Strength) are not fully satisfied until R2. Core workflows are complete; confidence signal is deferred.

---

### R2: Strength Confidence — "Users Trust the Output"
**Theme:** Add the real-time strength indicator. Completes JTBD-01.2 and closes the Verify stage gaps from R1.

**Stories (5):** US-5.1, US-5.2, US-5.3, US-5.4, US-5.5

| Persona | JTBD Newly Addressed | Journeys Newly Completed |
|---------|----------------------|--------------------------|
| PER-01 Alex | JTBD-01.2 (strength verification) | JRN-01.1 Verify stage, JRN-01.2 Verify stage |
| PER-02 Maya | JTBD-02.1 (strength reads "Very Strong" for policy configs) | JRN-02.1 Verify Strength stage |
| PER-03 Jordan | JTBD-03.2 (strength visible while configuring) | JRN-03.2 Configure Once stage |

**Dependency:** R2 stories have no blockers — they operate on `appState` that R1 stories establish. R2 can ship immediately after R1 as a patch or be included in the same release if timeline permits.

---

## Coverage Analysis

### Persona Coverage

| Persona | R1 | R2 | Journeys Served |
|---------|----|----|-----------------|
| PER-01 Alex (Consumer) | ✅ Core flow | ✅ Strength signal | JRN-01.1, JRN-01.2 |
| PER-02 Maya (IT Pro) | ✅ Core flow + Audit | ✅ Entropy accuracy | JRN-02.1, JRN-02.2 |
| PER-03 Jordan (Developer) | ✅ Keyboard + Batch | ✅ Config-time preview | JRN-03.1, JRN-03.2 |

### JTBD Coverage

| JTBD-ID | R1 | R2 | Gap |
|---------|----|----|-----|
| JTBD-01.1 | ✅ Full | — | None |
| JTBD-01.2 | ⚠️ Partial (no indicator) | ✅ Full | Resolved in R2 |
| JTBD-01.3 | ✅ Full | — | None |
| JTBD-02.1 | ✅ Full | ✅ Strength component | None after R2 |
| JTBD-02.2 | ✅ Full | — | None |
| JTBD-02.3 | ✅ Full | — | None |
| JTBD-03.1 | ✅ Full | — | None |
| JTBD-03.2 | ✅ Full | ✅ Config-time strength | None after R2 |
| JTBD-03.3 | ✅ Full | — | None |

### Gap Analysis

**Journey Stages Without Full Coverage in R1:**
- JRN-01.1 Verify stage — no strength indicator until R2
- JRN-01.2 Verify stage — no strength indicator until R2
- JRN-02.1 Verify Strength stage — no indicator until R2

**JTBD Outcomes Without Stories (permanent gaps — out of scope v1.0):**
- JTBD-01.1 / JTBD-03.2 success path via *password history* — PRD explicitly out of scope
- JTBD-03.3 code evaluation via *repository link* — no in-product pointer; external concern

**Orphan Stories:** None. All 30 UserStories (US-0.1 through US-6.4) are placed on the map.

**Stories Not Directly Tied to a Single Journey Stage** (appear at multiple touchpoints):
- US-0.2 (Crypto trust) — exercised in JRN-02.2 Audit Source and JRN-03.2 Inspect Source; mapped to Generate and Audit stages
- US-1.3 (Length label) — visible at both Arrive and Configure; mapped to Configure
- US-6.3 (Disabled button) — guarding all stages; mapped to Configure as primary home

---

## NaC-to-Acceptance Criteria Alignment

Verification that each NaC aligns with the UserStory acceptance criteria.

| SM-ID | Story | NaC | Aligned AC in UserStory |
|-------|-------|-----|-------------------------|
| SM-0.1 | US-0.1 | Password produced in < 50ms, no page reload | AC: "Password generation completes in under 50ms"; "No page reload or full re-render occurs between generations" ✅ |
| SM-0.2 | US-0.2 | `crypto.getRandomValues` sole source; zero network requests | AC: "`Math.random()` is never used"; "No network requests are made during or after password generation" ✅ |
| SM-0.3 | US-0.3 | At least one char per enabled set; Fisher-Yates shuffle | AC: "output password contains at least one character from each enabled set"; "Fisher-Yates shuffle using `crypto.getRandomValues` is applied" ✅ |
| SM-0.4 | US-0.4 | Sequential generations are distinct; settings persist | AC: "produces a new distinct password each time"; "No page reload"; "strength indicator updates after each generation" ✅ |
| SM-1.1 | US-1.1 | Slider updates length label in real time | AC: "Dragging the slider updates the displayed length label immediately"; "numeric input field stays in sync" ✅ |
| SM-1.2 | US-1.2 | Typing "48" sets exact length; slider syncs | AC: "Typing a value updates the slider position to match on blur"; clamping enforced ✅ |
| SM-1.3 | US-1.3 | Length label updates immediately on any change | AC: "The label updates immediately whenever the slider or numeric input value changes" ✅ |
| SM-1.4 | US-1.4 | Default length 16 on page load | AC: "On page load, the length slider is set to 16"; "numeric input displays 16" ✅ |
| SM-2.1 | US-2.1 | Disabling uppercase removes A–Z from output | AC: "no uppercase characters appear in subsequently generated passwords" ✅ |
| SM-2.2 | US-2.2 | Disabling lowercase removes a–z from output | AC: "no lowercase characters appear in subsequently generated passwords" ✅ |
| SM-2.3 | US-2.3 | Disabling numbers removes 0–9 from output | AC: "no numeric characters appear in subsequently generated passwords" ✅ |
| SM-2.4 | US-2.4 | Disabling symbols removes special chars | AC: "no symbol characters appear in subsequently generated passwords" ✅ |
| SM-2.5 | US-2.5 | Last active set blocked from unchecking; inline message | AC: "toggle is prevented from unchecking"; "inline validation message reads: 'At least one character set must be selected.'" ✅ |
| SM-2.6 | US-2.6 | All four toggles enabled on load | AC: "all four toggles are in the checked/enabled state"; "`appState.enabledSets` equals `[\"uppercase\",\"lowercase\",\"numbers\",\"symbols\"]`" ✅ |
| SM-3.1 | US-3.1 | Monospace field updates immediately; horizontal scroll for long | AC: "monospace font applied"; "horizontal scrolling is enabled"; "display updates immediately" ✅ |
| SM-3.2 | US-3.2 | Placeholder shown before first generation | AC: "placeholder text: 'Click Generate to create a password'"; "replaced immediately when first password is generated" ✅ |
| SM-3.3 | US-3.3 | `readonly` prevents editing; keyboard-selectable for copy | AC: "`readonly` attribute rendered"; "keyboard input has no effect"; "still focusable via Tab" ✅ |
| SM-4.1 | US-4.1 | Copy button writes to clipboard; "Copied!" for 2 s | AC: "Clicking Copy writes the current password to the system clipboard"; "'Copied!' label reverts after 2 seconds" ✅ |
| SM-4.2 | US-4.2 | Clipboard API with `execCommand` fallback; fidelity preserved | AC: "first attempts `navigator.clipboard.writeText()`"; "fallback to `document.execCommand('copy')`" ✅ |
| SM-4.3 | US-4.3 | Copy inert before first generation; no clipboard write | AC: "clicking the Copy button has no effect"; "No clipboard write is attempted when `appState.currentPassword` is null" ✅ |
| SM-4.4 | US-4.4 | Ctrl+C/Cmd+C on focused field copies and shows "Copied!" | AC: "pressing `Ctrl+C`/`Cmd+C` copies the password to clipboard"; "Copy button visual confirmation triggered by shortcut" ✅ |
| SM-5.1 | US-5.1 | Color bar at 25/50/75/100% width; updates on change | AC: "bar color changes based on strength level"; "bar width changes based on strength level"; "updates immediately" ✅ |
| SM-5.2 | US-5.2 | Text label never out of sync with bar; WCAG present | AC: "label always matches the current bar state"; "Color is never the sole indicator" ✅ |
| SM-5.3 | US-5.3 | `entropy = length × log₂(poolSize)`; correct thresholds | AC: "Strength is calculated using the formula `entropy = length × log₂(poolSize)`"; threshold table matches ✅ |
| SM-5.4 | US-5.4 | Strength active from load; updates without Generate click | AC: "strength indicator is active from the moment the page loads"; "slider/toggle change immediately updates score" ✅ |
| SM-5.5 | US-5.5 | `role="meter"` with `aria-valuenow`; label synced | AC: "`role='meter'` with `aria-valuemin='1'`, `aria-valuemax='4'`"; "`aria-label` reads 'Password strength: {level}'" ✅ |
| SM-6.1 | US-6.1 | Prominent Generate button triggers engine with current state | AC: "Clicking the button triggers the generation engine"; "strength indicator updates immediately after generation" ✅ |
| SM-6.2 | US-6.2 | Tab-reachable; Enter and Space both trigger; focus returns | AC: "reachable via Tab key"; "Enter triggers generation"; "Space triggers generation"; "focus returns to Generate button" ✅ |
| SM-6.3 | US-6.3 | `disabled` attribute when `enabledSets` empty; `aria-disabled` | AC: "Generate button renders with `disabled` HTML attribute"; "`aria-disabled='true'` is set" ✅ |
| SM-6.4 | US-6.4 | Inline error messages with `role="alert"` for three error types | AC: "CRYPTO_UNAVAILABLE error message"; "NO_SETS_ENABLED error"; "unexpected error fallback"; "styled with `role='alert'`" ✅ |

**Alignment result: 30/30 stories have NaC fully aligned with their UserStory acceptance criteria. No mismatches found.**

---

*Document generated by Pivota Spec Story Map Generator — 2026-05-04*
