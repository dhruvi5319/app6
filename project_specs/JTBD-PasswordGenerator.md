# JTBD: Password Generator

| Field                | Value                                                       |
|----------------------|-------------------------------------------------------------|
| **Product Name**     | Password Generator                                          |
| **Version**          | 1.0                                                         |
| **Date**             | 2026-05-04                                                  |
| **Related Personas** | PERSONAS-PasswordGenerator.md (PER-01, PER-02, PER-03)     |
| **Related PRD**      | PRD-PasswordGenerator.md                                    |
| **Status**           | Draft                                                       |

---

## JTBD Summary Table

| JTBD-ID     | Persona              | Job Statement (abbreviated)                                                           | Priority |
|-------------|----------------------|---------------------------------------------------------------------------------------|----------|
| JTBD-01.1   | PER-01 Alex Rivera   | When signing up for a new service, generate a strong password instantly with no setup | P0       |
| JTBD-01.2   | PER-01 Alex Rivera   | When unsure if a password is good enough, confirm strength at a glance                | P1       |
| JTBD-01.3   | PER-01 Alex Rivera   | When a site has character restrictions, adjust output to comply without confusion      | P1       |
| JTBD-02.1   | PER-02 Maya Thornton | When provisioning a privileged account, produce a policy-compliant, auditable password | P0      |
| JTBD-02.2   | PER-02 Maya Thornton | When using an unfamiliar online tool, verify it performs no network activity           | P0      |
| JTBD-02.3   | PER-02 Maya Thornton | When pasting into a terminal or system form, copy with exact character fidelity        | P0      |
| JTBD-03.1   | PER-03 Jordan Park   | When generating test credentials mid-sprint, complete the workflow without a mouse     | P0       |
| JTBD-03.2   | PER-03 Jordan Park   | When seeding multiple environments, produce several passwords rapidly in sequence      | P1       |
| JTBD-03.3   | PER-03 Jordan Park   | When evaluating a tool for production use, assess the codebase's security soundness    | P1       |

---

## PER-01: Alex Rivera — Everyday Consumer

### JTBD-01.1: Instant Strong Password on Demand

**Job Statement:**
When I'm signing up for a new online service or resetting a compromised account, I want to get a ready-to-use strong password the moment I open the page, so I can complete registration without spending mental energy inventing a credential.

**Current Alternatives:**
- Invents a weak, memorable pattern ("soccer2024!") because it's faster than any other option
- Reuses an existing password from another service to avoid having to think of something new
- Leaves a temporary weak password intending to change it later (rarely does)

**Hiring Criteria:**
- A strong password is visible immediately on page load — no click, no modal, no onboarding required
- Page loads in under 2 seconds and the default password scores "Strong" or "Very Strong"
- A single "Copy" button transfers the password to clipboard with visible confirmation
- No account, installation, or sign-up required at any point

**Success Measure:** Alex generates and copies a usable password in ≤ 10 seconds from page load, measured from first visit with default settings.

**Related Features:** F0, F3, F4, F6
**Priority:** P0

---

### JTBD-01.2: Confident Strength Verification

**Job Statement:**
When I've generated a password, I want to see an immediate, plain-language signal of how strong it is, so I can feel confident using it without needing any security knowledge.

**Current Alternatives:**
- Guesses that longer passwords are better but has no reliable baseline
- Searches online for "is my password strong" in a separate tab, adding friction
- Uses the password anyway and hopes for the best

**Hiring Criteria:**
- Strength label and color-coded indicator update in real time alongside the generated password
- Default 16-character all-sets password displays "Strong" or "Very Strong" without any manual adjustment
- Indicator is visually distinct and uses plain language (not a raw entropy score)

**Success Measure:** 100% of default-configuration generations display a "Strong" or "Very Strong" rating with no settings changes required.

**Related Features:** F5
**Priority:** P1

---

### JTBD-01.3: Site-Specific Constraint Compliance

**Job Statement:**
When a target website imposes a character limit or forbids special characters, I want to quickly adjust the password length or disable symbol types, so I can produce a compliant password without re-learning the tool.

**Current Alternatives:**
- Manually truncates the copied password in the clipboard (often miscounts)
- Tries the password and gets an error, then starts over from scratch
- Gives up on the generator and invents a short, simple password manually

**Hiring Criteria:**
- Length slider and numeric input are visually prominent and immediately responsive
- Character set toggles are clearly labeled and update the generated password on change without a reload
- Minimum length is enforced so that adjustments never produce an unusable output

**Success Measure:** Alex successfully adjusts length and/or disables symbols and produces a new compliant password in under 30 seconds, without consulting help text.

**Related Features:** F1, F2, F0
**Priority:** P1

---

## PER-02: Maya Thornton — IT / Security-Conscious Professional

### JTBD-02.1: Policy-Compliant Credential Generation

**Job Statement:**
When I'm provisioning a privileged system account or rotating credentials for a vendor service, I want to configure the exact character sets and length the target system requires, so I can produce a compliant password without risking rejected input or policy violations.

**Current Alternatives:**
- Manually crafts long passwords in a text editor while mentally tracking policy constraints
- Uses a corporate password manager's generator, which may not support fine-grained character set control
- Writes a short one-off shell script to generate the credential — time-consuming for simple cases

**Hiring Criteria:**
- Independent toggles for uppercase, lowercase, numbers, and symbols — each controllable in isolation
- Length slider supports the full 8–128 range; 32–64 character configurations are first-class, not edge cases
- At least one character from each enabled set is guaranteed in every generated password
- Strength indicator reads "Very Strong" for all configurations with length ≥ 32 and multiple sets enabled

**Success Measure:** Maya configures a 48-character credential matching a specific policy (e.g., uppercase + lowercase + numbers, no symbols) and receives a compliant password in under 20 seconds.

**Related Features:** F1, F2, F0, F5
**Priority:** P0

---

### JTBD-02.2: Trustworthy Randomness Verification

**Job Statement:**
When I'm considering using an unfamiliar online tool in a corporate context, I want to verify that password generation is entirely client-side and uses a cryptographically secure randomness source, so I can adopt the tool without introducing data-leakage risk to my organization.

**Current Alternatives:**
- Opens browser DevTools and inspects network activity before using any generator
- Reads the page source or a linked GitHub repository to audit the randomness implementation
- Refuses to use the tool and falls back to a fully offline method if verification is impossible

**Hiring Criteria:**
- Zero outbound network requests during page use (verifiable via DevTools Network tab)
- Generation visibly uses `crypto.getRandomValues` — auditable in open source code or inspectable in DevTools Sources
- No analytics, telemetry, or third-party scripts that could capture clipboard or input state
- Privacy statement or inline documentation confirms no data leaves the browser

**Success Measure:** Maya completes a DevTools network audit and source inspection in under 5 minutes and reaches a confident "approved for use" decision with no suspicious findings.

**Related Features:** F0 (Web Crypto API), Non-Functional: Security, Privacy
**Priority:** P0

---

### JTBD-02.3: Exact-Fidelity Clipboard Transfer

**Job Statement:**
When I've generated a long password for a privileged account, I want to copy it and paste it directly into a system terminal, admin form, or config file with no extra whitespace or formatting artifacts, so I can avoid authentication failures caused by invisible character corruption.

**Current Alternatives:**
- Manually selects and copies the text from the display field to avoid button-related artifacts
- Pastes into a plain-text editor first to strip formatting before pasting into the target system
- Visually compares the pasted string character by character against the displayed password

**Hiring Criteria:**
- Clipboard content is byte-for-byte identical to the displayed password — no leading/trailing whitespace, no newline, no HTML entities
- Copy button uses the Clipboard API with a documented fallback that preserves fidelity
- Password display field uses a read-only monospace font that prevents accidental edits before copying

**Success Measure:** Pasted password in a terminal matches the displayed password exactly in 100% of copy operations across Chrome, Firefox, Safari, and Edge.

**Related Features:** F3, F4
**Priority:** P0

---

## PER-03: Jordan Park — Developer / Technical Builder

### JTBD-03.1: Keyboard-Only Generate-and-Copy Workflow

**Job Statement:**
When I need a test credential mid-sprint and my hands are already on the keyboard, I want to navigate to the generator, trigger generation, and copy the result without touching the mouse, so I can maintain my development flow without context-switching to pointer interaction.

**Current Alternatives:**
- Uses a bookmarked generator that requires mouse clicks, breaking keyboard flow
- Writes a one-liner in Node.js or the browser console to generate a random string
- Keeps a pre-generated list of test passwords in a notes file, reusing them across environments

**Hiring Criteria:**
- Full tab-order traversal reaches length input, character set toggles, generate button, and copy button in a logical sequence
- Generate button triggers on Enter or Space when focused — no mouse required
- Copy button is keyboard-accessible and provides focus-visible confirmation of success
- No modal, overlay, or redirect interrupts the keyboard flow between generations

**Success Measure:** Jordan completes a full generate-and-copy cycle — from page focus to clipboard — in under 5 keystrokes with zero mouse interaction.

**Related Features:** F6, F4, F1, F2 (keyboard support), Non-Functional: Accessibility (WCAG 2.1 AA)
**Priority:** P0

---

### JTBD-03.2: Rapid Sequential Credential Generation

**Job Statement:**
When I'm seeding a test database or creating multiple environment-specific accounts in a single session, I want to generate several distinct passwords back-to-back without any page reload or state reset, so I can collect all the credentials I need in one uninterrupted pass.

**Current Alternatives:**
- Manually reloads the page between generations, losing previously generated passwords
- Opens multiple browser tabs and generates one password per tab
- Switches to a local CLI tool that requires switching windows and typing commands

**Hiring Criteria:**
- Each click or keypress on "Generate" produces a new password immediately, without reloading the page or resetting length/toggle settings
- Generation latency is imperceptible — no spinner, no delay between trigger and display
- Previously configured settings (length, character sets) persist across sequential generations in the same session

**Success Measure:** Jordan generates 5 distinct passwords in under 30 seconds, with no page reload and no settings regression between generations.

**Related Features:** F0 (re-generate on demand), F6, F1, F2
**Priority:** P1

---

### JTBD-03.3: Production-Safety Code Evaluation

**Job Statement:**
When I'm evaluating the password generator as a reference implementation or integration candidate for a project I'm building, I want to inspect the generation logic and confirm it uses only secure, dependency-free browser APIs, so I can decide whether to embed or adapt the code with confidence in its security posture.

**Current Alternatives:**
- Reads the minified source in DevTools and manually traces the randomness call chain
- Searches GitHub for the repository to find unminified source; gives up if not open source
- Rejects the tool and writes a custom implementation from scratch to avoid unknown security risks

**Hiring Criteria:**
- Source code is unobfuscated and structured so the generation function is identifiable within a single file review
- `crypto.getRandomValues` usage is the sole randomness source — no fallback to `Math.random()`
- No external framework dependencies that add audit surface area
- Password generation function is self-contained and extractable as a standalone module

**Success Measure:** Jordan locates the core generation function, confirms it uses `crypto.getRandomValues`, and makes an adopt/reject decision in under 10 minutes of code inspection.

**Related Features:** F0 (Web Crypto API), Non-Functional: Security, Maintainability
**Priority:** P1

---

## Outcome-to-Feature Traceability

| JTBD-ID   | Feature ID | Expected Outcome                                                                                  |
|-----------|------------|---------------------------------------------------------------------------------------------------|
| JTBD-01.1 | F0         | Cryptographically random password available on page load without user action                      |
| JTBD-01.1 | F3         | Password is immediately readable in the display field with no truncation                          |
| JTBD-01.1 | F4         | One-click copy transfers the password to clipboard with visual confirmation                       |
| JTBD-01.1 | F6         | Generate button is the primary CTA and triggers on first interaction                              |
| JTBD-01.2 | F5         | Real-time strength label reads "Strong" or "Very Strong" for all default configurations           |
| JTBD-01.3 | F1         | Length slider and numeric input immediately update generated password on change                   |
| JTBD-01.3 | F2         | Character set toggles update the generated password on change without reload                      |
| JTBD-02.1 | F1         | Length range 8–128 supported; 32–64 character range is fully functional                           |
| JTBD-02.1 | F2         | Each character set is independently togglable; at least one char per enabled set is guaranteed    |
| JTBD-02.1 | F5         | Strength indicator reads "Very Strong" for length ≥ 32 with multiple sets enabled                 |
| JTBD-02.2 | F0         | `crypto.getRandomValues` is the sole randomness source — auditable, no network calls              |
| JTBD-02.3 | F3         | Password display is read-only monospace; no accidental editing before copy                        |
| JTBD-02.3 | F4         | Clipboard API produces byte-exact copy; fallback preserves character fidelity                     |
| JTBD-03.1 | F6         | Generate button responds to keyboard (Enter/Space); full tab order covers all controls            |
| JTBD-03.1 | F4         | Copy button is keyboard-accessible with focus-visible confirmation                                |
| JTBD-03.2 | F0         | Re-generation on demand produces new output without page reload or settings reset                 |
| JTBD-03.2 | F6         | Each generate trigger produces a new distinct password immediately                                |
| JTBD-03.3 | F0         | Generation logic uses `crypto.getRandomValues` exclusively; code is modular and inspectable       |

---

## NaC Preview

> **Note:** These are candidate Natural Acceptance Criteria derived from job success measures. They will be refined and formalized in the Story Map phase.

| JTBD-ID   | Outcome                                                          | Candidate Natural Acceptance Criterion                                                                                      |
|-----------|------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| JTBD-01.1 | Password generated and copied in ≤ 10 seconds of page load      | Given a first-time visitor, when the page finishes loading, then a password is visible in the display field with no user action required; when the user clicks Copy, the password is in their clipboard within 10 seconds of page load |
| JTBD-01.2 | Default generation always shows "Strong" or "Very Strong"        | Given default settings (16 chars, all sets enabled), when a password is generated, then the strength indicator label reads "Strong" or "Very Strong" and the bar is at least 75% filled |
| JTBD-01.3 | Adjusted password produced in under 30 seconds without help text | Given a user who changes length to 12 and disables symbols, when they click Generate, then the new password respects the 12-character limit and contains no symbol characters |
| JTBD-02.1 | 48-char policy-compliant password in under 20 seconds            | Given length set to 48 and symbols disabled, when generation triggers, then the output is exactly 48 characters containing only uppercase, lowercase, and numeric characters, with at least one of each |
| JTBD-02.2 | Zero network requests during full page session                   | Given the page is loaded and a password is generated and copied, when the DevTools Network tab is inspected, then zero outbound requests are recorded beyond the initial page asset load |
| JTBD-02.3 | Pasted password matches displayed password byte-for-byte         | Given a generated password is copied via the Copy button, when pasted into a plain-text field, then the pasted string is character-for-character identical to the displayed password with no leading/trailing whitespace |
| JTBD-03.1 | Full workflow completed in ≤ 5 keystrokes, zero mouse            | Given focus is on the page, when the user uses Tab and Enter only, then a password is generated and copied to clipboard without any mouse interaction; all interactive controls are reachable via Tab |
| JTBD-03.2 | 5 distinct passwords in under 30 seconds, no page reload         | Given the user presses Generate 5 times in sequence, then each generated password differs from the previous one, page does not reload, and length/toggle settings remain unchanged between generations |
| JTBD-03.3 | Generation function located and audited in under 10 minutes      | Given the source is inspected in DevTools or a public repository, then `crypto.getRandomValues` is the sole randomness call in the generation path and `Math.random` does not appear in any generation-related function |

---

*Document generated by Pivota Spec JTBD Generator — 2026-05-04*
