# PERSONAS: Password Generator

| Field            | Value                                             |
|------------------|---------------------------------------------------|
| **Product Name** | Password Generator                                |
| **Version**      | 1.0                                               |
| **Date**         | 2026-05-04                                        |
| **Related PRD**  | PRD-PasswordGenerator.md                          |
| **Status**       | Draft                                             |

> **Note:** The PRD (Section 2) describes the target audience as "anyone who needs a strong password quickly." Three personas are derived from the Problem Statement pain points, Product Vision goals, and Feature Requirements to represent meaningfully distinct user needs.

---

## Persona Summary Table

| ID     | Name           | Role                          | Primary Goal                                                    |
|--------|----------------|-------------------------------|-----------------------------------------------------------------|
| PER-01 | Alex Rivera    | Everyday Consumer             | Generate a strong, unique password instantly without any setup  |
| PER-02 | Maya Thornton  | IT / Security-Conscious Pro   | Produce cryptographically secure passwords that meet policy rules |
| PER-03 | Jordan Park    | Developer / Technical Builder | Evaluate and embed the tool; generate test credentials quickly  |

---

## PER-01: Alex Rivera — Everyday Consumer

**Role & Context:**
Alex is a non-technical adult who manages 15–20 online accounts — streaming services, e-commerce sites, banking, and social media. He creates new account passwords every few weeks, typically when signing up for a new service or after being prompted to reset a compromised one. Alex works on a laptop and occasionally on his phone. He has no dedicated password manager and currently invents passwords by mixing a familiar word with a number ("soccer2024!"). He knows this is weak but finds the alternatives — password manager setup, complex tools — too cumbersome for his needs. He spends less than a minute thinking about passwords and wants the same frictionless experience from a generator.

**Goals:**
- Get a ready-to-use strong password in under 10 seconds without creating an account or installing anything (F0, F6 — PRD Vision: "no account, no install, no friction")
- Understand at a glance whether the generated password is actually strong, so he feels confident using it (F5)
- Copy the password to clipboard with one click before he forgets it (F4)
- Adjust the length if a site has specific rules (e.g., "max 20 characters") (F1)

**Pain Points:**
- Defaults to weak, memorable patterns because inventing a truly random password is cognitively hard (PRD: "Weak, guessable passwords")
- Reuses the same password across multiple services because generating fresh ones is inconvenient (PRD: "Password reuse")
- Has no reliable way to judge whether a password he's invented is actually strong (PRD: "Uncertainty about strength")
- Finds existing generators locked behind password managers that require installation or accounts (PRD: "No quick tools at hand")

**Technical Expertise:** Low-to-intermediate — comfortable with web browsers and consumer apps; avoids anything requiring setup, configuration files, or technical knowledge.

**Top Tasks:**
1. Land on the page and immediately generate a default password (daily-to-weekly, critical)
2. Check the strength indicator to confirm the password is strong enough (every generation, high)
3. Click "Copy" and paste the password into the signup form (every generation, critical)
4. Shorten the password if the target site has a character limit (occasional, medium)
5. Disable symbols if the target site doesn't accept special characters (occasional, medium)

**Success Criteria:**
- Generates and copies a usable password in ≤ 10 seconds of page load (PRD Metric: Time-to-first-password)
- Strength indicator reads "Strong" or "Very Strong" with default settings — no adjustments needed for the common case
- Zero steps required before the first password appears (no signup, no modal, no onboarding)

---

## PER-02: Maya Thornton — IT / Security-Conscious Professional

**Role & Context:**
Maya is an IT administrator at a mid-size company, responsible for managing access credentials for internal systems, vendor accounts, and shared service logins. She creates and rotates passwords for 10–30 accounts per month — covering everything from cloud dashboards to database admin users. Maya works exclusively on desktop (Windows + Chrome) and is aware of cryptographic best practices. She uses a corporate password manager for storage but occasionally needs a quick standalone generator when onboarding a new vendor system or producing a one-off credential outside her manager's context. She is skeptical of online tools and will refuse to use any generator that sends data to a server or shows suspicious network activity.

**Goals:**
- Generate passwords she can trust are cryptographically random, not pseudo-random (F0 — PRD: Web Crypto API, never `Math.random()`)
- Control character set precisely to meet system-specific password policies (e.g., no symbols for a legacy system, must include numbers) (F2)
- Generate longer passwords (32–64 characters) for high-value accounts (F1 — slider up to 128)
- Confirm at a glance that strength is at the maximum level before using (F5)
- Copy cleanly with no extra whitespace or hidden characters (F4, F3)

**Pain Points:**
- Cannot trust generators that don't disclose their randomness source — `Math.random()` is unacceptable for credentials (PRD: Security constraint)
- Password policies vary by system; she needs fine-grained toggle control, not a one-size output (PRD: "Weak, guessable passwords" applies to policy-non-compliant passwords too)
- Clipboard tools that add trailing spaces or formatting break paste-into-terminal workflows (F3, F4 precision)
- Tools that require accounts or phone-home analytics introduce unacceptable data risk in a corporate environment (PRD: "No user data transmitted or stored")

**Technical Expertise:** High — understands cryptographic concepts, reads source code to audit tools before use, comfortable with developer tools and network inspection.

**Top Tasks:**
1. Configure character sets to match target system's password policy (weekly, critical)
2. Set password length to 32–64 characters for privileged accounts (weekly, high)
3. Verify strength indicator shows "Very Strong" before copying (every generation, high)
4. Copy password to clipboard and paste directly into a system prompt or form (every generation, critical)
5. Regenerate immediately if a password visually appears to have a suspicious pattern (occasional, medium)

**Success Criteria:**
- Can confirm the tool uses `crypto.getRandomValues` (auditable via open source or DevTools — no network requests to external servers)
- Generates a 48-character mixed-set password in under 50ms (PRD Metric: < 50ms generation performance)
- Strength indicator consistently reads "Very Strong" for lengths ≥ 32 with all character sets enabled
- Copied password pastes with exact character fidelity — no whitespace, no formatting artifacts

---

## PER-03: Jordan Park — Developer / Technical Builder

**Role & Context:**
Jordan is a full-stack developer who builds web applications. He encounters the password generator in two contexts: as a developer evaluating the codebase as a reference implementation or integration candidate, and as a practical daily user who needs throwaway credentials for test accounts, local dev environments, and staging database seeds. Jordan works on a MacBook, splits time between VS Code and a browser, and is comfortable reading source code. He generates passwords 3–5 times per day during active development sprints. He values clean, minimal UIs with keyboard-first interaction — he finds it faster to tab through controls and press Enter than to reach for the mouse.

**Goals:**
- Generate test passwords rapidly without leaving the browser tab (F0, F6 — keyboard-accessible generate action)
- Use keyboard navigation exclusively: tab to length, change value, tab to generate, Enter to trigger, tab to copy (F6 accessibility, F1 keyboard support)
- Understand the code architecture to evaluate if it's production-safe or a candidate for embedding (F0 — Web Crypto API, no framework dependency)
- Adjust length quickly for different contexts: short (8) for throwaway test accounts, long (32+) for staging secrets (F1 slider)

**Pain Points:**
- Most generators require mouse interaction to trigger generation, breaking keyboard-only workflows (PRD: "No quick tools at hand" — existing tools are friction-heavy)
- Password tools that use `Math.random()` are unsuitable for any security-sensitive use, including test environments that mirror production (PRD: Security constraint)
- Cluttered UIs with ads, redirects, or unnecessary features slow him down during rapid iteration (PRD Vision: zero-friction, single-page)
- Page reloads between generations waste time when generating multiple credentials in sequence (F0: "Re-generate instantly on demand without page reload")

**Technical Expertise:** Very high — reads and evaluates JavaScript source code, uses browser DevTools, understands Web Crypto API and clipboard APIs.

**Top Tasks:**
1. Keyboard-navigate to generate a password without touching the mouse (daily, critical)
2. Set length to 8 for throwaway test accounts, 32 for staging secrets (daily, high)
3. Regenerate multiple passwords in rapid succession for batch test data (several times/week, medium)
4. Toggle symbols off for credentials used in shell scripts or config files (several times/week, medium)
5. Inspect the strength indicator to sanity-check a specific configuration (occasional, low)

**Success Criteria:**
- Full generate-and-copy workflow completable via keyboard alone with zero mouse interaction
- Page load ≤ 2 seconds; generation ≤ 50ms — no perceptible delay during rapid iteration (PRD Performance metrics)
- Character set toggles and length input respond to keyboard events without requiring mouse focus
- No page reload between sequential generations

---

## Persona Relationships

| Interaction                         | PER-01 Alex         | PER-02 Maya            | PER-03 Jordan           |
|-------------------------------------|---------------------|------------------------|-------------------------|
| **PER-01 Alex** (Consumer)          | —                   | Maya's policies affect what Alex can set on corporate systems | Jordan builds apps Alex uses |
| **PER-02 Maya** (IT Pro)            | Sets policy context Alex must comply with | — | May audit tools Jordan builds |
| **PER-03 Jordan** (Developer)       | Builds products Alex signs up for | May be subject to Maya's security reviews | — |

> These personas do not directly interact within the Password Generator tool itself — each uses it independently. The relationship context reflects the broader organizational ecosystem they inhabit.

---

## Feature-Persona Matrix

| Feature ID | Feature Name                  | PER-01 Alex (Consumer) | PER-02 Maya (IT Pro) | PER-03 Jordan (Developer) |
|------------|-------------------------------|------------------------|----------------------|---------------------------|
| **F0**     | Password Generation Engine    | Primary                | Primary              | Primary                   |
| **F1**     | Password Length Configuration | Secondary              | Primary              | Primary                   |
| **F2**     | Character Set Toggles         | Secondary              | Primary              | Secondary                 |
| **F3**     | Password Display              | Primary                | Primary              | Primary                   |
| **F4**     | Copy to Clipboard             | Primary                | Primary              | Primary                   |
| **F5**     | Password Strength Indicator   | Primary                | Primary              | Secondary                 |
| **F6**     | Generate Button               | Primary                | Secondary            | Primary                   |

**Legend:**
- **Primary** — This persona is the main driver for this feature; it directly solves their key goal or pain point.
- **Secondary** — This persona benefits from this feature but it is not their primary motivator.
- **None** — Feature is not relevant to this persona's core use case.

---

*Document generated by Pivota Spec Personas Generator — 2026-05-04*
