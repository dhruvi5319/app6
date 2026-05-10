# Plan 01-03: Generate Button and Trigger Wiring

**Phase:** 1 — Core Generation Loop  
**Plan:** 01-03 of 03  
**Goal:** Wire the Generate button to the generation engine, connect the password display, and implement keyboard accessibility (Enter/Space). Phase 1 is complete when this plan is done.  
**Requirements covered:** TRIG-01, TRIG-02, TRIG-03  
**Status:** Pending  
**Depends on:** Plan 01-01 (generator.js), Plan 01-02 (index.html, style.css, src/app.js stub)

---

## Context

At the end of Plan 01-02, the page renders visually but clicking Generate does nothing. This plan completes Phase 1 by adding the event handler that calls `generate()`, writes the result to `appState.currentPassword`, and updates the password display.

TRIG-03 requires auto-regenerate on config change — but because Phase 1 has no config controls (those are added in Phase 2), TRIG-03 is satisfied structurally: the `triggerGenerate()` function is designed to be called from config change handlers in Phase 2. No config change events exist yet; the function simply needs to exist and be callable.

---

## Tasks

### Task 1: Complete `src/app.js`

Replace the stub from Plan 01-02 with the full Phase 1 implementation:

```js
// src/app.js — Phase 1: Core Generation Loop
// IMPORTANT: Math.random() is NEVER used. All randomness via crypto.getRandomValues().

import { generate } from './engine/generator.js';

// ── App State ────────────────────────────────────────────────────────────────
// Phase 1 subset. Phase 2 will add length slider + character set toggles.
const appState = {
  length: 16,
  enabledSets: ['uppercase', 'lowercase', 'numbers', 'symbols'],
  currentPassword: null,
};

// ── DOM References ────────────────────────────────────────────────────────────
const passwordDisplay = document.getElementById('password-display');
const generateBtn     = document.getElementById('generate-btn');
const strengthBar     = document.getElementById('strength-bar');
const strengthLabel   = document.getElementById('strength-label');

// ── Render Functions ──────────────────────────────────────────────────────────

/**
 * Updates the password display field.
 * @param {string|null} password
 */
function renderPasswordDisplay(password) {
  if (!password) {
    passwordDisplay.value = '';
    passwordDisplay.placeholder = 'Click Generate to create a password';
  } else {
    passwordDisplay.value = password;
    passwordDisplay.scrollLeft = 0;
  }
}

/**
 * Updates the strength indicator bar and label.
 * Uses the current appState.length and appState.enabledSets.
 */
function renderStrengthIndicator() {
  const POOL_SIZES = { uppercase: 26, lowercase: 26, numbers: 10, symbols: 28 };
  const poolSize = appState.enabledSets.reduce((sum, key) => sum + POOL_SIZES[key], 0);

  if (poolSize === 0) return;

  const entropy = appState.length * Math.log2(poolSize);

  let score, level, color, width;
  if (entropy < 40)      { score = 1; level = 'Weak';        color = '#e53e3e'; width = '25%'; }
  else if (entropy < 60) { score = 2; level = 'Fair';        color = '#dd6b20'; width = '50%'; }
  else if (entropy < 80) { score = 3; level = 'Strong';      color = '#d69e2e'; width = '75%'; }
  else                   { score = 4; level = 'Very Strong'; color = '#38a169'; width = '100%'; }

  strengthBar.style.width = width;
  strengthBar.style.backgroundColor = color;
  strengthLabel.textContent = level;

  const container = strengthBar.closest('[role="meter"]');
  if (container) {
    container.setAttribute('aria-valuenow', score);
    container.setAttribute('aria-label', `Password strength: ${level}`);
  }
}

// ── Core: Generate Action ─────────────────────────────────────────────────────

/**
 * Runs the generation engine with current appState, updates state and DOM.
 * Called by Generate button AND by config change handlers (Phase 2).
 */
function triggerGenerate() {
  // Clear any previous inline error
  clearGenerateError();

  try {
    const result = generate({
      length: appState.length,
      enabledSets: appState.enabledSets,
    });

    appState.currentPassword = result.password;

    renderPasswordDisplay(appState.currentPassword);
    renderStrengthIndicator();

    if (result.lengthAdjusted) {
      showGenerateInfo(`Length increased to ${result.length} to fit all selected character sets.`, 3000);
    }

  } catch (err) {
    const code = err.message || 'GENERATION_ERROR';
    const messages = {
      CRYPTO_UNAVAILABLE: 'Secure generation unavailable. Please use a modern browser.',
      NO_SETS_ENABLED:    'Please enable at least one character set.',
      GENERATION_ERROR:   'Password generation failed. Please try again.',
    };
    showGenerateError(messages[code] || messages['GENERATION_ERROR'], code === 'CRYPTO_UNAVAILABLE' ? 0 : 5000);
  }
}

// ── Inline Error / Info Messages ──────────────────────────────────────────────

let generateErrorTimer = null;

function getOrCreateErrorEl() {
  let el = document.getElementById('generate-error');
  if (!el) {
    el = document.createElement('p');
    el.id = 'generate-error';
    el.setAttribute('role', 'alert');
    el.setAttribute('aria-live', 'assertive');
    el.style.cssText = 'color:#fc8181;font-size:0.8rem;margin-top:0.5rem;display:none;';
    generateBtn.insertAdjacentElement('afterend', el);
  }
  return el;
}

function showGenerateError(message, durationMs) {
  const el = getOrCreateErrorEl();
  el.textContent = message;
  el.style.display = 'block';
  if (generateErrorTimer) clearTimeout(generateErrorTimer);
  if (durationMs > 0) {
    generateErrorTimer = setTimeout(() => { el.style.display = 'none'; }, durationMs);
  }
}

function showGenerateInfo(message, durationMs) {
  const el = getOrCreateErrorEl();
  el.textContent = message;
  el.style.color = '#68d391';
  el.style.display = 'block';
  if (generateErrorTimer) clearTimeout(generateErrorTimer);
  generateErrorTimer = setTimeout(() => {
    el.style.display = 'none';
    el.style.color = '#fc8181';
  }, durationMs);
}

function clearGenerateError() {
  const el = document.getElementById('generate-error');
  if (el) { el.style.display = 'none'; el.textContent = ''; }
  if (generateErrorTimer) { clearTimeout(generateErrorTimer); generateErrorTimer = null; }
}

// ── Event Listeners ───────────────────────────────────────────────────────────

// Generate button: click
generateBtn.addEventListener('click', () => {
  triggerGenerate();
  generateBtn.focus(); // return focus after generation
});

// Generate button: keyboard (Enter/Space handled natively by <button>)
// The browser fires 'click' on Enter/Space for <button> elements — no extra handling needed.
// Explicit keydown guard added for robustness:
generateBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    triggerGenerate();
  }
});

// ── Initial Render ────────────────────────────────────────────────────────────

renderPasswordDisplay(appState.currentPassword);  // shows placeholder
renderStrengthIndicator();                          // shows initial strength bar

// Export for Phase 2 expansion
export { appState, triggerGenerate, renderPasswordDisplay, renderStrengthIndicator };
```

### Task 2: Verify end-to-end in browser

Manual verification steps:
1. Open `index.html` in a browser (serve with `python3 -m http.server 8000` for module support, or any static server)
2. Confirm placeholder text is visible before clicking Generate
3. Click Generate → a password appears in the display field
4. Click Generate again → a different password appears (regeneration works)
5. Press Tab to focus the Generate button, press Enter → password generates
6. Press Space while Generate button is focused → password generates
7. Check browser console — no errors

### Task 3: Verify TRIG-03 design (auto-regenerate hook)

The `triggerGenerate()` function is exported and designed to be called by Phase 2 config change handlers. Confirm:
- `triggerGenerate` is exported from `src/app.js`
- It reads from `appState.length` and `appState.enabledSets` at call time (no stale closure)
- Phase 2 can call `import { triggerGenerate, appState } from './app.js'` and modify `appState` before calling it

> TRIG-03 is architecturally satisfied in Phase 1. The actual config UI that calls it is implemented in Phase 2.

### Task 4: Run unit tests

```bash
npm test
```

All 8 unit tests from Plan 01-01 must pass.

### Task 5: Update `package.json` (if not done in Plan 01-01)

Ensure `package.json` exists with test script and Vitest:

```json
{
  "name": "password-generator",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "vitest run",
    "dev": "python3 -m http.server 8000"
  },
  "devDependencies": {
    "vitest": "^1.0.0"
  }
}
```

Run `npm install` to install dependencies.

---

## File Checklist

- [ ] `src/app.js` fully implemented (replaces stub from Plan 01-02)
- [ ] `triggerGenerate()` is exported
- [ ] `appState` is exported
- [ ] Generate button click handler wired
- [ ] Generate button keydown handler wired (Enter/Space)
- [ ] `renderStrengthIndicator()` called after generation
- [ ] Inline error display implemented
- [ ] `package.json` exists with test script
- [ ] Unit tests pass (`npm test` exits 0)

---

## Acceptance Criteria

These map directly to Phase 1 success criteria from ROADMAP.md:

- [ ] **SC-1**: User clicks Generate and a new random password appears in the display field immediately
- [ ] **SC-2**: Generated password contains only characters from the active character sets (verified by unit test)
- [ ] **SC-3**: Generated password is exactly the configured length (16 by default, verified by unit test)
- [ ] **SC-4**: Display field shows placeholder text before first generation; updates on every subsequent generation
- [ ] **SC-5**: Generate button responds to mouse click
- [ ] **SC-5b**: Generate button responds to keyboard Enter
- [ ] **SC-5c**: Generate button responds to keyboard Space

**Definition of Phase 1 Done:**
- All 5 success criteria above are met
- `npm test` passes (all unit tests green)
- No console errors in browser during normal use

---

## Notes / Decisions

- `triggerGenerate()` is exported so Phase 2 can call it from config change handlers without re-importing `generate()` directly. This keeps the trigger/state/render logic centralized.
- The strength indicator is wired in this plan (not deferred) because it enriches the Phase 1 experience and uses only `appState.length` and `appState.enabledSets` — both available now.
- Keyboard handling: HTML `<button>` already fires `click` on Enter/Space natively. The explicit `keydown` listener is added for robustness (some VPATs recommend it). Both paths call `triggerGenerate()` — no duplication risk.
- Auto-regeneration (TRIG-03): Phase 1 has no config controls, so there is nothing to auto-regenerate on. The architecture is wired correctly — Phase 2 will call `triggerGenerate()` from slider/toggle change handlers.
