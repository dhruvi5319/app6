# Requirements: Password Generator App

**Defined:** 2026-05-04
**Core Value:** Generate strong, random passwords instantly — so users never have to think up or remember weak passwords.

## v1 Requirements

### Generation Engine

- [ ] **GEN-01**: User can generate a cryptographically random password using the Web Crypto API
- [ ] **GEN-02**: Generated password respects active character set configuration
- [ ] **GEN-03**: Generated password respects configured length

### Length Configuration

- [ ] **LEN-01**: User can set password length via a slider (range 8–128)
- [ ] **LEN-02**: User can set password length via a numeric input (range 8–128)
- [ ] **LEN-03**: Slider and numeric input stay in sync (bidirectional); out-of-range values are clamped on blur

### Character Sets

- [ ] **CHAR-01**: User can toggle uppercase letters on/off
- [ ] **CHAR-02**: User can toggle lowercase letters on/off
- [ ] **CHAR-03**: User can toggle numbers on/off
- [ ] **CHAR-04**: User can toggle symbols on/off
- [ ] **CHAR-05**: At least one character set must remain active at all times (Last Active Guard)

### Password Display

- [ ] **DISP-01**: Generated password is displayed in a read-only monospace field
- [ ] **DISP-02**: Field updates immediately upon each generation
- [ ] **DISP-03**: Field shows a placeholder state before first generation

### Copy to Clipboard

- [ ] **COPY-01**: User can copy the displayed password to clipboard with one click
- [ ] **COPY-02**: Copy action provides visual confirmation (e.g., "Copied!" for 2 seconds)
- [ ] **COPY-03**: Copy falls back gracefully when the Clipboard API is unavailable

### Generate Trigger

- [ ] **TRIG-01**: User can trigger generation via a prominent Generate button
- [ ] **TRIG-02**: Generate button is keyboard accessible (Enter/Space)
- [ ] **TRIG-03**: Changing length or character set toggles automatically re-generates the password

## v2 Requirements

### Strength Indicator

- **STR-01**: A color-coded strength bar is displayed below the password (Weak / Fair / Strong / Very Strong)
- **STR-02**: Strength is calculated from entropy: `length × log₂(poolSize)`
- **STR-03**: Strength indicator updates in real time as configuration changes

## Out of Scope

| Feature | Reason |
|---------|--------|
| Password vault / storage | Requires backend; out of scope for a stateless generator |
| User accounts / authentication | No persistence needed |
| Browser extension | Web app first; extension is a future enhancement |
| OAuth / social login | No accounts, no need |
| Mobile native app | Web app is responsive; native app deferred |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| GEN-01 | Phase 1 | Pending |
| GEN-02 | Phase 1 | Pending |
| GEN-03 | Phase 1 | Pending |
| LEN-01 | Phase 2 | Pending |
| LEN-02 | Phase 2 | Pending |
| LEN-03 | Phase 2 | Pending |
| CHAR-01 | Phase 2 | Pending |
| CHAR-02 | Phase 2 | Pending |
| CHAR-03 | Phase 2 | Pending |
| CHAR-04 | Phase 2 | Pending |
| CHAR-05 | Phase 2 | Pending |
| DISP-01 | Phase 1 | Pending |
| DISP-02 | Phase 1 | Pending |
| DISP-03 | Phase 1 | Pending |
| COPY-01 | Phase 3 | Pending |
| COPY-02 | Phase 3 | Pending |
| COPY-03 | Phase 3 | Pending |
| TRIG-01 | Phase 1 | Pending |
| TRIG-02 | Phase 1 | Pending |
| TRIG-03 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 20 total
- Mapped to phases: 20
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-04*
*Last updated: 2026-05-04 after initial definition*
