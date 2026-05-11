# Roadmap: Password Generator App

## Overview

Three phases that deliver the complete password generator. Phase 1 builds the core generation loop — engine, display, and trigger — so the app can produce and show a password. Phase 2 adds the configuration controls that make generation meaningful (length and character sets). Phase 3 completes the user workflow by enabling clipboard copy. Each phase delivers a fully verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Core Generation Loop** - Engine, display, and generate trigger working end-to-end
- [ ] **Phase 2: Configuration Controls** - Length slider/input and character set toggles
- [ ] **Phase 3: Copy to Clipboard** - One-click copy with visual confirmation and fallback

## Phase Details

### Phase 1: Core Generation Loop
**Status**: In Progress
**Goal**: Users can generate and see a cryptographically random password
**Depends on**: Nothing (first phase)
**Requirements**: GEN-01, GEN-02, GEN-03, DISP-01, DISP-02, DISP-03, TRIG-01, TRIG-02, TRIG-03
**Success Criteria** (what must be TRUE):
  1. User clicks Generate and a new random password appears in the display field immediately
  2. Generated password contains only characters from the active character sets
  3. Generated password is exactly the configured length
  4. Display field shows placeholder text before first generation and updates on every subsequent generation
  5. Generate button responds to both mouse click and keyboard (Enter/Space)
**Plans**: Complete

Plans:
- [x] 01-01: Generation engine (Web Crypto API, character pool, Fisher-Yates shuffle)
- [x] 01-02: Password display component (read-only monospace field, placeholder state)
- [x] 01-03: Generate button and trigger wiring (click, keyboard, auto-regenerate on config change)

### Phase 2: Configuration Controls
**Status**: passed
**Goal**: Users can control password length and character composition before generating
**Depends on**: Phase 1
**Requirements**: LEN-01, LEN-02, LEN-03, CHAR-01, CHAR-02, CHAR-03, CHAR-04, CHAR-05
**Success Criteria** (what must be TRUE):
  1. User can drag the slider or type in the numeric input to set length (8–128); both stay in sync
  2. Out-of-range values typed in the numeric input are clamped to 8 or 128 on blur
  3. User can toggle any combination of uppercase, lowercase, numbers, and symbols on/off
  4. Attempting to disable the last active character set is rejected with an inline message
  5. Changing length or toggling a character set immediately regenerates the password
**Plans**: 3 plans

Plans:
- [ ] 02-00-PLAN.md — TDD: Last Active Guard pure function (isLastActive)
- [ ] 02-01-PLAN.md — Length control (slider + numeric input, bidirectional sync, clamping, default 16)
- [ ] 02-02-PLAN.md — Character set toggles (four checkboxes, Last Active Guard, state sync)

### Phase 3: Copy to Clipboard
**Goal**: Users can copy the generated password to their clipboard in one click
**Depends on**: Phase 2
**Requirements**: COPY-01, COPY-02, COPY-03
**Success Criteria** (what must be TRUE):
  1. User clicks Copy and the password is written to the system clipboard
  2. Copy button shows "Copied!" for 2 seconds then reverts to "Copy"
  3. Copy works even when the Clipboard API is unavailable (execCommand fallback)
**Plans**: TBD

Plans:
- [ ] 03-01: Copy button with Clipboard API, execCommand fallback, and "Copied!" confirmation

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Core Generation Loop | 3/3 | Done | 2026-05-10 |
| 2. Configuration Controls | 0/3 | Not started | - |
| 3. Copy to Clipboard | 0/1 | Not started | - |