# JOURNEYS: Password Generator

| Field                | Value                                                                  |
|----------------------|------------------------------------------------------------------------|
| **Product Name**     | Password Generator                                                     |
| **Version**          | 1.0                                                                    |
| **Date**             | 2026-05-04                                                             |
| **Related Personas** | PERSONAS-PasswordGenerator.md (PER-01, PER-02, PER-03)                |
| **Related JTBD**     | JTBD-PasswordGenerator.md                                              |
| **Related PRD**      | PRD-PasswordGenerator.md                                               |
| **Status**           | Draft                                                                  |

---

## Journey Index

| JRN-ID    | Persona              | Scenario                                           | Key JTBD(s)              | Stages |
|-----------|----------------------|----------------------------------------------------|--------------------------|--------|
| JRN-01.1  | PER-01 Alex Rivera   | New account signup — instant password              | JTBD-01.1, JTBD-01.2     | 5      |
| JRN-01.2  | PER-01 Alex Rivera   | Site with character restrictions                   | JTBD-01.3, JTBD-01.1     | 5      |
| JRN-02.1  | PER-02 Maya Thornton | Privileged account provisioning                    | JTBD-02.1, JTBD-02.3     | 6      |
| JRN-02.2  | PER-02 Maya Thornton | Security audit before first corporate use          | JTBD-02.2                | 4      |
| JRN-03.1  | PER-03 Jordan Park   | Keyboard-only test credential mid-sprint           | JTBD-03.1                | 5      |
| JRN-03.2  | PER-03 Jordan Park   | Batch test data — sequential password generation   | JTBD-03.2, JTBD-03.3     | 5      |

---

## PER-01: Alex Rivera — Everyday Consumer

---

### JRN-01.1: New Account Signup — Instant Password

**Persona:** PER-01 (Alex Rivera)

**Scenario:** Alex is midway through signing up for a new streaming service. The site asks him to create a password. He types "netflix2024!" into a notes app out of habit, pauses, realizes he's already reused that on three other sites, and decides this time he'll do it properly. He opens a new browser tab and searches for "password generator." He lands on the page, needs a strong password fast, and wants to copy it and get back to the signup form before he forgets where he was.

**Related Jobs:** JTBD-01.1, JTBD-01.2

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **Arrive** | Opens new tab, searches "password generator," clicks first result | Browser → page load | "I hope this doesn't make me sign up for anything first" | Anxious, slightly impatient | Worried about friction gates (signup walls, modals) before he can use the tool | Page loads in under 2 seconds with a strong password already displayed — no action required |
| **Orient** | Glances at the page to understand the layout | Landing page (F3, F5, F6) | "Okay, there's already a password here — is it actually good?" | Relieved but uncertain | No mental model for what makes a password strong | Strength indicator prominently displayed alongside the password, clearly labeled "Very Strong" with a green bar |
| **Verify** | Reads the strength indicator label and bar | Strength indicator (F5) | "It says 'Very Strong' — okay, I trust that" | Growing confidence | Must trust an unfamiliar tool's judgment | Color-coded bar + plain-language label ("Very Strong") bridges the gap between security knowledge and confidence |
| **Copy** | Clicks the "Copy" button | Copy button (F4) | "Please don't add any weird spaces or formatting" | Focused | Past experience with broken copy buttons adds doubt | Button label changes to "Copied!" for 2 seconds — immediate, unambiguous visual confirmation |
| **Use** | Switches back to signup tab, pastes the password into both password fields | Signup form (external) | "Did it paste correctly? It looks weird with all those symbols — but the site accepted it, so I'm done" | Relieved, accomplished | No way to verify the paste worked without re-opening the generator | — |

### Key Moments
- **Decision Point (Arrive):** If the page loads slowly or shows a modal, Alex abandons and uses his weak default password — the tool loses its core value proposition at the very first moment.
- **Risk of Abandonment (Orient):** If no password is pre-generated on load, Alex must click something before seeing output; any additional step increases bounce risk.
- **Delight Opportunity (Copy):** The "Copied!" button state confirmation is the single moment Alex feels the tool is *for him* — it speaks his language and eliminates doubt.

### Success Outcome
Alex generates and copies a password in ≤ 10 seconds from page load with zero extra steps, feeling confident the password is strong — fulfilling JTBD-01.1's success measure.

### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Arrive | F0 (auto-generates on load), F3 (displays result immediately) |
| Orient | F3 (Password Display), F5 (Strength Indicator) |
| Verify | F5 (Strength Indicator) |
| Copy | F4 (Copy to Clipboard) |
| Use | F4 (Clipboard fidelity) |

---

### JRN-01.2: Site with Character Restrictions

**Persona:** PER-01 (Alex Rivera)

**Scenario:** Alex is creating an account on his electricity provider's website. The site displays the message: "Password must be 8–16 characters, no special characters allowed." He has just pasted the generator's default 16-character password full of symbols and received a validation error. He goes back to the generator, confused about what to change, and needs to produce a compliant password quickly without reading a manual.

**Related Jobs:** JTBD-01.3, JTBD-01.1

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **Return** | Switches back to the generator tab after a paste error | Landing page (F3) | "I need to remove the symbols and maybe make it shorter — where do I do that?" | Frustrated, mildly confused | Must re-learn the UI layout under mild time pressure; error message from the signup form is still mentally active | Current settings are preserved on the tab — no need to reconfigure from scratch |
| **Adjust Length** | Drags the slider to 16 or types "16" in the numeric input | Length control (F1) | "It's already 16 — okay, that's fine for this site" | Slightly relieved | Slider and numeric input must visually confirm they're in sync | Slider and numeric input update each other in real time; current value is obvious |
| **Disable Symbols** | Unchecks or toggles off the "Symbols" checkbox | Character set toggles (F2) | "Does turning this off immediately update the password, or do I have to click Generate again?" | Uncertain | Toggle behavior is not immediately obvious — does it auto-update or require a manual trigger? | Password updates instantly on toggle change, without requiring a separate Generate click |
| **Verify** | Reads the updated password and strength indicator | F3, F5 | "No symbols in there — looks right. But is it still strong enough?" | Cautiously optimistic | Fears that removing symbols makes the password weak | Strength indicator updates to reflect the new configuration — still shows "Strong" for a 16-char alphanumeric password |
| **Copy and Use** | Clicks "Copy," switches back to signup form, pastes | F4 | "Let's hope this one works" | Relieved when it accepts | Lingering anxiety until the site confirms the password is valid | — |

### Key Moments
- **Decision Point (Adjust Length):** If the slider interaction feels sluggish or the sync between slider and numeric input is broken, Alex loses confidence and starts manually editing the pasted password — introducing errors.
- **Risk of Abandonment (Disable Symbols):** If toggling symbols doesn't immediately update the displayed password, Alex doesn't know if the change took effect and may give up on the generator entirely.
- **Delight Opportunity (Verify):** Seeing "Strong" still displayed after removing symbols is unexpected good news — it validates that the tool is smarter than a naive "more = better" approach.

### Success Outcome
Alex adjusts length and disables symbols and produces a compliant password in under 30 seconds without consulting help text — fulfilling JTBD-01.3's success measure.

### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Return | F3 (Password Display — preserved state) |
| Adjust Length | F1 (Slider + numeric input) |
| Disable Symbols | F2 (Character Set Toggles), F0 (auto-regenerate on change) |
| Verify | F3 (Password Display), F5 (Strength Indicator) |
| Copy and Use | F4 (Copy to Clipboard) |

---

## PER-02: Maya Thornton — IT / Security-Conscious Professional

---

### JRN-02.1: Privileged Account Provisioning

**Persona:** PER-02 (Maya Thornton)

**Scenario:** Maya needs to create a service account for a new vendor integration — a cloud storage connector for her company's HR system. The vendor's admin portal requires a password that is 48 characters, uppercase + lowercase + numbers only (no symbols — the system parses credentials with a shell script and symbols break the tokenizer). Maya has already run a DevTools audit of the generator (JRN-02.2) and approved it for use. Now she's at her desk, configuring and generating the credential.

**Related Jobs:** JTBD-02.1, JTBD-02.3

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **Configure Length** | Opens the generator; sets length to 48 by typing in the numeric input | Length control (F1) | "48 chars — I want to type the number, not fiddle with a slider" | Efficient, businesslike | Sliders are imprecise at high values; needs exact numeric entry | Numeric input is a first-class control synchronized with the slider — typing "48" is the fastest path |
| **Disable Symbols** | Unchecks the "Symbols" toggle | Character set toggles (F2) | "The vendor portal will reject symbols — no symbols, keep everything else on" | Focused | Must remember which toggles to flip; easy to accidentally leave symbols enabled | Toggles are clearly labeled with distinct visual state (checked / unchecked) — current configuration is glanceable |
| **Generate** | Clicks "Generate Password" | Generate button (F6) | "Let's see what it produces — I'll scan it quickly to confirm no symbols snuck through" | Alert, auditing | Even with good tooling, professionals visually sanity-check output | The monospace display font makes character-class differences immediately visible; no symbols is visually obvious |
| **Verify Strength** | Reads the strength indicator | Strength indicator (F5) | "48 characters, three sets — that should be 'Very Strong.' If it says anything less, something is wrong with the tool's scoring" | Analytical | An unexpected strength rating would signal a potential misconfiguration | Strength indicator reads "Very Strong" for length ≥ 32 with multiple sets — consistent and trustworthy for Maya's use case |
| **Copy** | Clicks "Copy" button | Copy button (F4) | "I'm going to paste this into a terminal first — whitespace or newlines will cause an auth failure I'll spend an hour debugging" | Cautious | Previous experience with clipboard artifacts makes her distrust automated copy | Button copies byte-exact content via Clipboard API; monospace display shows the exact string — no discrepancy between display and clipboard |
| **Paste and Confirm** | Pastes into terminal, runs `echo $PASSWORD \| wc -c` to check byte count | External terminal | "48 characters plus the newline from echo = 49 bytes — correct" | Satisfied, confident | No in-tool way to re-verify after copying | — |

### Key Moments
- **Decision Point (Configure Length):** If the numeric input isn't editable or doesn't update the slider, Maya loses trust in the control's reliability and may fall back to a shell script — abandoning the tool.
- **Decision Point (Disable Symbols):** If a symbol appears in the generated output after the toggle is unchecked, Maya immediately abandons the tool as broken and files a security concern. This is a zero-tolerance failure.
- **Delight Opportunity (Verify Strength):** "Very Strong" for a policy-constrained password (no symbols) signals the tool is calibrating strength on real entropy, not just punishing set reduction — Maya notices and trusts it more.

### Success Outcome
Maya configures a 48-character uppercase + lowercase + numbers password and receives a compliant, "Very Strong"-rated credential she can paste with exact fidelity in under 20 seconds — fulfilling JTBD-02.1 and JTBD-02.3 success measures.

### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Configure Length | F1 (numeric input + slider) |
| Disable Symbols | F2 (Character Set Toggles), F0 (auto-regenerate) |
| Generate | F6 (Generate Button), F0 (Engine), F3 (Display) |
| Verify Strength | F5 (Strength Indicator) |
| Copy | F4 (Copy to Clipboard — Clipboard API) |
| Paste and Confirm | F4 (byte-exact fidelity), F3 (monospace display) |

---

### JRN-02.2: Security Audit Before First Corporate Use

**Persona:** PER-02 (Maya Thornton)

**Scenario:** Maya's colleague Slack-messaged her a link to the password generator, suggesting she try it for the upcoming vendor onboarding sprint. Before opening it on her work machine or using it for any real credential, Maya performs her standard security vetting process: she opens the tool in Chrome, opens DevTools, and audits it for network activity, randomness source, and third-party script loading. This journey happens *before* JRN-02.1 — it is a prerequisite.

**Related Jobs:** JTBD-02.2

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **Open with Suspicion** | Opens the link in Chrome with DevTools Network tab already open | Browser DevTools → page load | "What's this going to phone home? Any analytics? Any CDN calls I don't recognize?" | Skeptical, guarded | Most online tools fail this first check — Maya expects to reject it | Zero outbound requests beyond initial page asset load — the Network tab shows only the page itself loading |
| **Inspect Network** | Triggers a generation and a copy; watches the Network tab for any new requests | DevTools Network (F0, F4) | "No requests on generate, no requests on copy — that's already better than 90% of tools I've audited" | Cautiously optimistic | If even one unexpected request fires — analytics, telemetry, third-party font — she pauses and investigates | Strictly client-side architecture with no analytics or third-party scripts means the Network tab stays silent |
| **Audit Source** | Opens DevTools Sources tab, locates the main JS file, searches for `crypto.getRandomValues` and `Math.random` | DevTools Sources | "I need to find the generation function and confirm it uses the Crypto API. If I see `Math.random` anywhere in the call chain, I'm done here" | Analytical, thorough | Minified or obfuscated code makes auditing time-consuming or impossible | Unobfuscated, modular JS — the generation function is clearly named and `crypto.getRandomValues` is visible; `Math.random` is absent |
| **Approve for Use** | Closes DevTools, confirms to herself the tool is safe; messages her colleague | Internal decision | "Client-side only, Web Crypto API, no telemetry — approved. I'll use it for the vendor accounts this sprint" | Confident, professionally satisfied | No formal in-tool documentation to quote in a security review; relies on her own audit notes | Inline comment or README referencing the security architecture would let Maya quote a source rather than paraphrasing her audit |

### Key Moments
- **Decision Point (Inspect Network):** Any unexpected network request — even a Google Fonts CDN call — triggers a deeper investigation and may cause rejection. Silent network is the minimum pass condition.
- **Risk of Abandonment (Audit Source):** Obfuscated or minified-without-sourcemap code makes the audit too costly — Maya rejects any tool she can't verify in under 10 minutes. Readable code is a feature, not a nice-to-have.
- **Delight Opportunity (Approve for Use):** Maya rarely approves online tools for corporate use. Successfully passing her audit builds lasting trust — she becomes an internal advocate who recommends the tool to colleagues.

### Success Outcome
Maya completes her DevTools network audit and source inspection in under 5 minutes with no suspicious findings and reaches a confident "approved for use" decision — fulfilling JTBD-02.2's success measure.

### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Open with Suspicion | F0 (client-side only architecture) |
| Inspect Network | F0 (no network calls during generation), F4 (no network calls during copy) |
| Audit Source | F0 (Web Crypto API, modular code, no `Math.random`) |
| Approve for Use | Non-Functional: Security, Privacy (no analytics/telemetry) |

---

## PER-03: Jordan Park — Developer / Technical Builder

---

### JRN-03.1: Keyboard-Only Test Credential Mid-Sprint

**Persona:** PER-03 (Jordan Park)

**Scenario:** Jordan is writing integration tests for a user authentication flow. He needs a realistic-looking test password for a fixture — something that would pass a real password validator (mixed case, numbers, symbols, 16 characters). He has a browser tab with the generator open from earlier in the day. His hands are on his keyboard, he's mid-thought on a code problem, and reaching for the mouse would break his focus. He wants the entire generate-and-copy workflow to happen via keyboard alone.

**Related Jobs:** JTBD-03.1

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **Switch to Tab** | Uses Cmd+Tab or browser shortcut to switch to the generator tab | Browser tab | "Focus should land somewhere logical — I hope I don't have to click just to engage the page" | Neutral, efficient | Some apps require a click to establish focus before keyboard input is registered | Page has a logical default focus state — first interactive element is focusable without a click |
| **Navigate to Generate** | Presses Tab until the "Generate Password" button is focused | Generate button (F6) | "Tab order should be: length → toggles → generate → copy. If it's random I'll lose count" | Focused, testing patience | Illogical tab order forces extra keystrokes and mental overhead | Tab order follows the visual layout: length → character toggles → generate → copy; focus ring is visibly styled |
| **Trigger Generation** | Presses Enter (or Space) with the Generate button focused | Generate button (F6) | "Enter should fire this — if it doesn't, I'll have to grab the mouse and this tool loses points" | Tense expectation | Many tools implement buttons as `<div>` elements that don't respond to keyboard events | Generate button is a native `<button>` element responding to both Enter and Space; new password appears instantly |
| **Navigate to Copy** | Presses Tab once more to focus the Copy button, presses Enter | Copy button (F4) | "Tab once more → Enter to copy. That's 2 keystrokes from the password to the clipboard" | Satisfied with the flow | Copy button must have a visible focus state and keyboard activation | Copy button has a clear focus ring; activates on Enter; "Copied!" confirmation is visible (not just announced) |
| **Use in Code** | Switches back to VS Code, pastes into the test fixture | VS Code / test file | "Perfect — pasted cleanly, no whitespace, looks right in context" | In flow, pleased | Clipboard artifacts would silently corrupt the test credential | Byte-exact clipboard content means no post-paste cleanup |

### Key Moments
- **Decision Point (Navigate to Generate):** If the tab order is unpredictable or wraps incorrectly, Jordan counts keystrokes and loses track — he switches to the mouse and mentally downgrades the tool from "excellent" to "acceptable."
- **Critical Failure (Trigger Generation):** If Enter doesn't activate the focused button, the entire keyboard-first promise breaks. This is the highest-stakes single interaction in Jordan's journey.
- **Delight Opportunity (Navigate to Copy):** A two-keystroke path from generated password to clipboard (Tab + Enter) confirms that someone designed this for keyboard users — Jordan notes this as evidence of production-quality accessibility thinking.

### Success Outcome
Jordan completes a full generate-and-copy cycle from page focus to clipboard in under 5 keystrokes with zero mouse interaction — fulfilling JTBD-03.1's success measure.

### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Switch to Tab | Non-Functional: Accessibility (WCAG 2.1 AA focus management) |
| Navigate to Generate | F6 (tab order), F1 (keyboard-reachable), F2 (keyboard-reachable) |
| Trigger Generation | F6 (Enter/Space keyboard activation), F0 (generation engine) |
| Navigate to Copy | F4 (keyboard-accessible copy, focus-visible state) |
| Use in Code | F4 (byte-exact clipboard fidelity) |

---

### JRN-03.2: Batch Test Data — Sequential Password Generation

**Persona:** PER-03 (Jordan Park)

**Scenario:** Jordan is seeding a staging database for a new multi-tenant application. He needs 5 distinct passwords for 5 test user accounts — each should be 32 characters with all character sets enabled so they realistically represent production-strength credentials. He wants to generate them back-to-back in one sitting, copy each one, and paste them into a seed script without switching contexts or losing his settings between generations. He also briefly inspects the source code during this session because he's evaluating whether to embed the generation logic in his own project.

**Related Jobs:** JTBD-03.2, JTBD-03.3

### Journey Stages

| Stage | Action | Touchpoint | Thinking | Feeling | Pain Point | Opportunity |
|-------|--------|------------|----------|---------|------------|-------------|
| **Configure Once** | Sets length to 32, confirms all character sets are enabled | F1 (slider/input), F2 (toggles) | "I'll set this once and generate five times — if the settings reset between generations I'll have to reconfigure every time" | Efficient, methodical | Settings persistence between generations is a common failure in generator tools | Length and toggle settings persist within the session — no re-configuration required between generations |
| **Generate × 5** | Clicks or keyboard-activates Generate 5 times; after each, copies the result and pastes into seed script | F6, F0, F4 | "Is this one different from the last? It should be — if they look similar something is wrong" | Alert, slightly paranoid | Visually similar consecutive passwords could indicate a weak entropy source | Each generation produces a visually distinct password; no page reload; generation is imperceptibly fast (< 50ms) |
| **Verify Uniqueness** | Glances at each generated password before copying | F3 (Password Display) | "16 characters different from last one — looks random enough. Monospace makes the character differences easy to spot" | Satisfied | Hard to verify true randomness visually; relies on heuristic (visual distinctiveness) | Monospace font and full character display make side-by-side visual comparison reliable at a glance |
| **Inspect Source** | Opens DevTools Sources, locates the generation function, scans for `crypto.getRandomValues` | DevTools Sources | "I want to see if this is worth embedding. Is the generation function self-contained? No `Math.random`?" | Analytical, evaluating | Function may be tangled with UI code; extraction would require significant refactoring | Generation logic is isolated in a well-named, clearly commented function — extractable as a standalone module |
| **Decide and Close** | Makes an adopt/reject decision; either copies the function or bookmarks the repo | Internal decision + DevTools | "Self-contained, Web Crypto API only, no dependencies — I'll copy this function into my utility lib" | Confident, productive | No in-tool pointer to the source repository for direct forking | — |

### Key Moments
- **Decision Point (Generate × 5):** If the page reloads or settings reset between generations, Jordan must reconfigure after each password — the workflow collapses from one session into five separate tasks.
- **Risk of Abandonment (Generate × 5):** Any perceptible delay between trigger and display (spinner, animation) breaks the rapid-fire workflow and forces Jordan to consciously wait between each generation.
- **Delight Opportunity (Inspect Source):** A well-structured, obviously extractable generation function turns a routine audit into a moment of discovery — Jordan gets a reusable utility he didn't expect, increasing the tool's long-term value to him.

### Success Outcome
Jordan generates 5 distinct passwords in under 30 seconds with no page reload or settings regression (JTBD-03.2), and locates and audits the core generation function in under 10 minutes of code inspection (JTBD-03.3).

### Feature Touchpoints

| Stage | Features |
|-------|----------|
| Configure Once | F1 (length), F2 (character set toggles) |
| Generate × 5 | F6 (Generate Button), F0 (re-generate without page reload), F4 (Copy) |
| Verify Uniqueness | F3 (monospace password display) |
| Inspect Source | F0 (Web Crypto API, modular code), Non-Functional: Maintainability |
| Decide and Close | F0 (extractable generation function) |

---

## Cross-Journey Patterns

### Common Pain Points Across Journeys

- **Trust on First Load (JRN-01.1, JRN-02.2, JRN-03.1):** All three personas arrive with some degree of skepticism — Alex worries about signup gates, Maya worries about data leakage, Jordan worries about broken keyboard support. The first 5 seconds of the page experience must proactively address all three fears. A pre-generated password visible on load (no click required), a clean/silent network tab, and logical tab order all contribute to this shared first-impression moment.

- **Toggle Behavior Ambiguity (JRN-01.2, JRN-02.1):** Both Alex (adjusting for site restrictions) and Maya (disabling symbols for a vendor system) hit the same uncertainty: does a toggle change immediately update the displayed password, or does it require a manual Generate trigger? This single interaction design decision affects two personas in distinct contexts. **Opportunity:** Auto-regenerate on any configuration change eliminates the ambiguity entirely for both users.

- **Clipboard Fidelity Anxiety (JRN-01.1, JRN-02.1, JRN-03.1):** Alex fears invisible formatting, Maya fears whitespace that breaks terminals, Jordan fears artifacts in test fixtures. The underlying concern is identical — "is what I copied exactly what was displayed?" **Opportunity:** The "Copied!" confirmation + monospace display + Clipboard API implementation together provide multi-layer assurance that addresses this fear across all personas.

- **Settings Persistence (JRN-01.2, JRN-02.1, JRN-03.2):** When a user returns to the tool (Alex after a paste error, Maya after a configuration change, Jordan between sequential generations), losing the configured settings forces re-work and erodes trust. **Opportunity:** Persisting settings within the session tab (no reload = no reset) satisfies all three personas' return-visit expectation.

### Shared Opportunities

| Opportunity | Personas Affected | Resolving Feature(s) |
|-------------|-------------------|----------------------|
| Pre-generate password on page load — zero clicks to first result | PER-01, PER-03 | F0 (auto-generate), F3 (display) |
| Auto-regenerate on any config change (no separate Generate click needed) | PER-01, PER-02 | F0, F2, F1 |
| Byte-exact clipboard via Clipboard API with visual "Copied!" feedback | PER-01, PER-02, PER-03 | F4 |
| Unobfuscated, modular source code as a trust signal | PER-02, PER-03 | F0 (Non-Functional: Maintainability) |
| Logical tab order + keyboard-activated buttons | PER-03 (primary), PER-02 (secondary) | F6, F4, F1, F2 (WCAG 2.1 AA) |

---

## Journey-to-JTBD Traceability

| JRN-ID | Stage | JTBD-ID | Expected Outcome |
|--------|-------|---------|------------------|
| JRN-01.1 | Arrive | JTBD-01.1 | Password visible on page load — zero clicks required |
| JRN-01.1 | Verify | JTBD-01.2 | Strength indicator shows "Strong" / "Very Strong" with default settings |
| JRN-01.1 | Copy | JTBD-01.1 | One-click copy with visual confirmation; clipboard receives the full password |
| JRN-01.2 | Disable Symbols | JTBD-01.3 | Character set toggles update output immediately on change |
| JRN-01.2 | Adjust Length | JTBD-01.3 | Slider and numeric input are responsive; password respects new length |
| JRN-01.2 | Verify | JTBD-01.2 | Strength indicator updates in real time to reflect new configuration |
| JRN-02.1 | Configure Length | JTBD-02.1 | Numeric input accepts exact values; length ≥ 32 is fully supported |
| JRN-02.1 | Disable Symbols | JTBD-02.1 | Independent toggle disables symbols; at least one char per remaining set guaranteed |
| JRN-02.1 | Verify Strength | JTBD-02.1 | Strength reads "Very Strong" for 48-char, 3-set configuration |
| JRN-02.1 | Copy | JTBD-02.3 | Clipboard content is byte-for-byte identical to displayed password |
| JRN-02.2 | Inspect Network | JTBD-02.2 | Zero outbound requests during generation and copy operations |
| JRN-02.2 | Audit Source | JTBD-02.2 | `crypto.getRandomValues` is sole randomness source; `Math.random` absent |
| JRN-03.1 | Navigate to Generate | JTBD-03.1 | Tab order is logical; all controls reachable via keyboard |
| JRN-03.1 | Trigger Generation | JTBD-03.1 | Generate button activates on Enter/Space when focused |
| JRN-03.1 | Navigate to Copy | JTBD-03.1 | Copy button is keyboard-accessible with focus-visible confirmation |
| JRN-03.2 | Generate × 5 | JTBD-03.2 | Each generation produces distinct output; no page reload; settings persist |
| JRN-03.2 | Configure Once | JTBD-03.2 | Length and toggle settings persist across sequential generations |
| JRN-03.2 | Inspect Source | JTBD-03.3 | Generation function is self-contained, named, and uses only Web Crypto API |
| JRN-03.2 | Decide and Close | JTBD-03.3 | Function is extractable as a standalone module; `Math.random` absent from generation path |

---

*Document generated by Pivota Spec Journeys Generator — 2026-05-04*
