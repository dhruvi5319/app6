# Password Generator App

## What This Is

A simple web-based password generator that creates secure, customizable passwords on demand. Users can configure password length and character types (uppercase, lowercase, numbers, symbols) and copy the generated password to their clipboard.

## Core Value

Generate strong, random passwords instantly — so users never have to think up or remember weak passwords.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can generate a random password with one click
- [ ] User can configure password length
- [ ] User can toggle character sets (uppercase, lowercase, numbers, symbols)
- [ ] User can copy the generated password to clipboard
- [ ] User can see a password strength indicator

### Out of Scope

- Password storage / vault — keeping scope minimal; this is a generator, not a manager
- User accounts / authentication — no persistence needed for a simple generator
- Browser extension — web app first; extension is a future enhancement

## Context

- Greenfield project — no existing codebase
- Simple, self-contained tool; no backend required (pure frontend)
- Target users: anyone who needs a strong password quickly

## Constraints

- **Scope**: Single-page app only — no backend, no database
- **Tech**: Frontend only (HTML/CSS/JS or a lightweight framework)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| No backend | Password generation is purely client-side; no data to persist | — Pending |
| Single-page app | Simplest delivery vehicle for the core value | — Pending |

---
*Last updated: 2026-05-04 after initialization*
