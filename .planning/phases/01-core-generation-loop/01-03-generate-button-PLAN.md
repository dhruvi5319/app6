# Plan 01-03: Generate Button and Trigger Wiring

**Phase:** 1 — Core Generation Loop
**Plan:** 01-03 of 03
**Goal:** Wire the Generate button to the generation engine, connect the password display and strength indicator, implement keyboard accessibility (Enter/Space), and export the Phase 2 integration surface. Phase 1 is complete when this plan is done.
**Requirements covered:** TRIG-01, TRIG-02, TRIG-03
**Status:** Complete ✅
**Completed:** 2026-05-10
**Depends on:** Plan 01-01 (generator.js), Plan 01-02 (index.html, style.css)

---

## What Was Built

`src/app.js` is the complete Phase 1 UI wiring layer (170 lines). It imports `generate` from the engine, owns `appState`, renders the password display and strength indicator, handles click and keyboard events, provides inline error/info messaging, and exports the Phase 2 integration surface.

### Files Created / Modified

| File | Lines | Notes |
|------|-------|-------|
| `src/app.js` | 170 | Complete — no further modification needed in Phase 1 |

---

## Context

At the end of Plan 01-02, the page renders visually but clicking Generate does nothing — `app.js` was a stub. This plan completes Phase 1 by implementing the full `src/app.js`.

TRIG-03 (auto-regenerate on config change) is architecturally satisfied: `triggerGenerate()` is exported and reads live from `appState` at call time. The actual config controls that call it are implemented in Phase 2.

---

## Implementation Details

### App State

```js
const appState = {
  length: 16,
  enabledSets: ['uppercase', 'lowercase', 'numbers', 'symbols'],
  currentPassword: null,
};
```

`appState` is exported so Phase 2 can mutate `length` and `enabledSets` before calling `triggerGenerate()`.

### DOM References

```js
const passwordDisplay = document.getElementById('password-display');
const generateBtn     = document.getElementById('generate-btn');
const strengthBar     = document.getElementById('strength-bar');
const strengthLabel   = document.getElementById('strength-label');
```

### `renderPasswordDisplay(password)`

```js
function renderPasswordDisplay(password) {
  if (!password) {
    passwordDisplay.value = '';
    passwordDisplay.placeholder = 'Click Generate to create a password';
  } else {
    passwordDisplay.value = password;
    passwordDisplay.scrollLeft = 0;
  }
}
```

Shows placeholder when `password` is `null`/falsy; sets value and resets scroll for real passwords.

### `renderStrengthIndicator()`

Shannon entropy: `entropy = length × log₂(poolSize)`. Thresholds:

| Entropy | Score | Label | Color | Width |
|---------|-------|-------|-------|-------|
| < 40 | 1 | Weak | `#e53e3e` | 25% |
| < 60 | 2 | Fair | `#dd6b20` | 50% |
| < 80 | 3 | Strong | `#d69e2e` | 75% |
| ≥ 80 | 4 | Very Strong | `#38a169` | 100% |

Updates `#strength-bar` width/color, `#strength-label` text, and `role="meter"` ARIA attributes (`aria-valuenow`, `aria-label`) on the container.

At Phase 1 defaults (length 16, all 4 sets, poolSize 90): entropy ≈ 103.9 → **"Very Strong"** immediately on load.

### `triggerGenerate()`

```js
function triggerGenerate() {
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
```

Key behaviors:
- Reads from `appState` at call time (no stale closure) — Phase 2 can mutate `appState` then call this
- `CRYPTO_UNAVAILABLE` error stays permanently (`durationMs = 0`)
- `NO_SETS_ENABLED` error auto-clears after 5 seconds
- `lengthAdjusted` shows a green info message for 3 seconds

### Inline Error / Info Messaging

`getOrCreateErrorEl()` lazily creates a `<p id="generate-error">` element:

```js
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
```

This element is **not** in the static `index.html` — it is injected into the DOM at runtime, inserted after `#generate-btn`. `showGenerateInfo()` reuses this element but changes `color` to `#68d391` (green) for the `lengthAdjusted` message, restoring red after the timer.

### Event Listeners

```js
// Click handler
generateBtn.addEventListener('click', () => {
  triggerGenerate();
  generateBtn.focus(); // return focus after generation
});

// Keyboard handler (redundant but explicit for robustness)
generateBtn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    triggerGenerate();
  }
});
```

Note: HTML `<button>` fires `click` natively on Enter/Space. The `keydown` listener is added for robustness and VPAT compliance. Both paths call `triggerGenerate()`.

### Initial Render (on module load)

```js
renderPasswordDisplay(appState.currentPassword);  // shows placeholder (null)
renderStrengthIndicator();                          // shows "Very Strong" bar immediately
```

### Phase 2 Exports

```js
export { appState, triggerGenerate, renderPasswordDisplay, renderStrengthIndicator };
```

Phase 2 usage pattern:
```js
import { appState, triggerGenerate } from './app.js';
// mutate appState.length or appState.enabledSets
appState.length = 24;
triggerGenerate(); // regenerates with new config
```

---

## TRIG-03: Auto-Regenerate Design (Architectural Satisfaction)

TRIG-03 requires that password auto-regenerates when config changes. Phase 1 has no config controls (added in Phase 2), so auto-regeneration cannot be demonstrated in Phase 1. However, the architecture is fully wired:

- `triggerGenerate` reads `appState.length` and `appState.enabledSets` at call time
- `appState` is exported for mutation by Phase 2 handlers
- Phase 2 will add event listeners on the length slider and set toggles that mutate `appState` then call `triggerGenerate()`

**Status:** Architecturally satisfied in Phase 1. Behaviorally exercised in Phase 2.

---

## Strength Indicator: Above Original Spec

The original Plan 01-02 described the strength section as "a Phase 2 placeholder." In practice, `renderStrengthIndicator()` was fully implemented in Plan 01-03 (Phase 1), not deferred. The strength bar displays "Very Strong" immediately on page load and updates on every generation. Phase 2 will need to call `renderStrengthIndicator()` when config changes — the function is already exported for this purpose.

---

## Divergences from Original Plan

| Item | Original Plan Said | What Was Actually Built |
|------|--------------------|------------------------|
| Strength indicator | "Phase 2 placeholder" in Plan 01-02 | Fully implemented in Plan 01-03 (Phase 1) — `renderStrengthIndicator()` wired immediately |
| `renderPasswordDisplay` scroll | `setSelectionRange(0, 0)` + `scrollLeft = 0` | `scrollLeft = 0` only — equivalent, simpler |
| Error element location | Not described in original plan | Dynamically injected after `#generate-btn` via `getOrCreateErrorEl()` |
| `showGenerateInfo` | Not in original plan | Implemented for `lengthAdjusted` info message (green variant of error element) |
| Test count in this plan | "All 8 unit tests from Plan 01-01 must pass" | 13 tests pass (`npm test`) |
| `vitest.config.js` + `vitest.setup.js` | Not referenced in this plan | Required infrastructure, created in Plan 01-01 |

---

## File Checklist

- [x] `src/app.js` fully implemented (170 lines)
- [x] `appState` exported with correct initial values
- [x] `triggerGenerate` exported and reads `appState` live
- [x] `renderPasswordDisplay` exported
- [x] `renderStrengthIndicator` exported
- [x] Generate button click handler wired
- [x] Generate button keydown handler wired (Enter/Space)
- [x] `renderStrengthIndicator()` called after every generation and on initial load
- [x] Inline error display implemented (`CRYPTO_UNAVAILABLE` permanent, `NO_SETS_ENABLED` 5s)
- [x] Inline info display implemented (`lengthAdjusted` message, 3s, green)
- [x] `getOrCreateErrorEl()` creates `<p role="alert" aria-live="assertive">` injected after button
- [x] `Math.random()` not used anywhere (comment at top of file enforces constraint)

---

## Acceptance Criteria — Verified

These map directly to Phase 1 success criteria from ROADMAP.md:

- [x] **SC-1**: User clicks Generate → new random password appears in display field immediately
- [x] **SC-2**: Generated password contains only characters from the active character sets (verified by unit tests)
- [x] **SC-3**: Generated password is exactly the configured length (16 by default, verified by unit tests)
- [x] **SC-4**: Display field shows placeholder text before first generation; updates on every subsequent generation
- [x] **SC-5a**: Generate button responds to mouse click
- [x] **SC-5b**: Generate button responds to keyboard Enter
- [x] **SC-5c**: Generate button responds to keyboard Space
- [x] **SC-6** (bonus): Strength bar updates on every generation — "Very Strong" for Phase 1 defaults

**Definition of Phase 1 Done — Met:**
- All 5 Phase 1 success criteria satisfied ✅
- `npm test` passes — 13/13 tests green, exits 0 ✅
- No console errors in browser during normal use ✅
- No `Math.random()` usage anywhere in codebase ✅

---

## Notes / Decisions

- `triggerGenerate()` is exported so Phase 2 can call it from config change handlers without re-importing `generate()` directly. This keeps trigger/state/render logic centralized in `app.js`.
- The strength indicator was wired in this plan (not deferred to Phase 2) because it uses only `appState.length` and `appState.enabledSets` — both available now — and enriches the Phase 1 experience.
- Keyboard handling: `<button>` natively fires `click` on Enter/Space. The explicit `keydown` listener is added for robustness (VPAT compliance). Both paths call `triggerGenerate()`.
- Error element is dynamically injected rather than present in static HTML, following the pattern that ARIA `role="alert"` elements should not be present on load (to avoid false announcements) but be injected when needed.
- `showGenerateInfo` reuses the error element with a different color rather than creating a second element, keeping the DOM simple and avoiding potential dual-announcement issues.
