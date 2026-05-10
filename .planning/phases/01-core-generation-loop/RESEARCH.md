# Phase 1: Core Generation Loop — Research

**Researched:** 2026-05-10
**Domain:** Vanilla JS password generation app (brownfield re-plan)
**Confidence:** HIGH — all findings are based on direct source inspection of the live codebase

---

## Summary

Phase 1 is **fully implemented and all tests pass**. The codebase contains a complete Web Crypto API-based password generation engine (`src/engine/generator.js`), a read-only monospace password display (`index.html` + `style.css`), and fully-wired UI glue (`src/app.js`) with keyboard accessibility, strength indicator, and inline error/info messaging. There are 13 Vitest unit tests — all green.

This research is a **brownfield codebase audit**, not forward-looking investigation. The planner should treat this document as ground truth about what exists. Plans created from it should be **verification plans** (confirm the implementation matches the spec) rather than build instructions.

**Primary recommendation:** Produce three verification plans mirroring the original plan structure (01-01 engine, 01-02 display, 01-03 wiring). Each plan's tasks become "verify this exists and works correctly" rather than "build this".

---

## What Is Already Implemented

### File Inventory

| File | Lines | Status | Notes |
|------|-------|--------|-------|
| `src/engine/generator.js` | 117 | ✅ Complete | Pure logic module, no DOM dependency |
| `src/engine/generator.test.js` | 101 | ✅ Complete | 13 tests, all passing |
| `src/app.js` | 170 | ✅ Complete | Full UI wiring, event listeners, exports |
| `index.html` | 59 | ✅ Complete | Full HTML structure with ARIA attributes |
| `style.css` | 156 | ✅ Complete | Dark theme, monospace display, strength bar |
| `vitest.config.js` | 10 | ✅ Complete | Node env, globalThis.crypto polyfill |
| `vitest.setup.js` | 7 | ✅ Complete | Polyfills Web Crypto API for Node |
| `package.json` | 12 | ✅ Complete | ESM module, Vitest 1.x, dev server script |

### Verified Test Run (2026-05-10)

```
✓ src/engine/generator.test.js  (13 tests) 157ms
Test Files  1 passed (1)
     Tests  13 passed (13)
  Duration  955ms
```

---

## Tech Decisions Made

| Decision | What Was Chosen | Why / Notes |
|----------|-----------------|-------------|
| Framework | None — pure Vanilla JS | Single responsibility, no build step |
| Module system | ES modules (`type: "module"`) | Native browser support, `import`/`export` throughout |
| Randomness | `crypto.getRandomValues()` only | `Math.random()` is explicitly banned; comment in file headers enforces this |
| Bias prevention | Rejection sampling in `unbiasedRandomIndex` | Avoids modulo bias with Uint32 ceiling trick |
| Password display | `<input type="text" readonly>` | Native horizontal scroll, keyboard focusability, text selection — not a `<div>` |
| Testing framework | Vitest 1.x | Runs in Node.js with `webcrypto` polyfill; no jsdom needed for engine |
| Test environment | `node` (not `jsdom`) | Engine has no DOM dependency; polyfill in `vitest.setup.js` is sufficient |
| Dev server | `python3 -m http.server 8000` | Zero-install local server for module support |
| Strength metric | Shannon entropy: `length × log₂(poolSize)` | Standard password entropy formula |
| Error display | Dynamically-created `<p id="generate-error">` | Inserted after generate button at runtime; includes `role="alert"` + `aria-live` |

---

## Standard Stack

### Core
| Library | Version | Purpose |
|---------|---------|---------|
| Vitest | `^1.0.0` (installed: 1.6.1) | Unit testing with ESM support |
| Node.js `node:crypto` | Built-in | `webcrypto` polyfill for test environment |

No runtime dependencies. The app is self-contained HTML/CSS/JS.

### No Build Step
There is no bundler (no Vite, Webpack, or Rollup configured for the app itself). Vitest uses its own bundler internally for tests only. The production app is served as raw static files.

---

## Architecture Patterns

### Project Structure
```
app6/
├── index.html               # App shell — full HTML structure + ARIA
├── style.css                # Dark theme styling
├── vitest.config.js         # Test runner config (node env + crypto polyfill)
├── vitest.setup.js          # globalThis.crypto polyfill for Node
├── package.json             # ESM, scripts: test/dev, devDep: vitest
└── src/
    ├── app.js               # UI wiring, appState, render functions, event listeners
    └── engine/
        ├── generator.js     # Pure logic: CHAR_SETS, buildPool, generate, shuffle
        └── generator.test.js # 13 Vitest unit tests
```

### Pattern 1: Pure Logic Engine (generator.js)
**What:** The generation engine is a pure function module with zero DOM dependency. It exports `generate(config)`, `buildPool(enabledSets)`, and `CHAR_SETS`.

**Key design:** `generate()` returns a plain object `{ password, length, lengthAdjusted }` and throws two specific error strings: `'CRYPTO_UNAVAILABLE'` and `'NO_SETS_ENABLED'`.

```js
// src/engine/generator.js
export const CHAR_SETS = {
  uppercase: { key: 'uppercase', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', size: 26 },
  lowercase: { key: 'lowercase', characters: 'abcdefghijklmnopqrstuvwxyz', size: 26 },
  numbers:   { key: 'numbers',   characters: '0123456789',                  size: 10 },
  symbols:   { key: 'symbols',   characters: '!@#$%^&*()-_=+[]{}|;:,.<>?', size: 28 },
};

export function generate(config) {
  // crypto check → config check → buildPool → guaranteed slots → fill → shuffle
  return { password: slots.join(''), length: slots.length, lengthAdjusted };
}
```

### Pattern 2: Crypto Compatibility Guard
**What:** Both `unbiasedRandomIndex` and `generate` resolve `cryptoAPI` via:
```js
const cryptoAPI = (typeof globalThis !== 'undefined' && globalThis.crypto)
  || (typeof window !== 'undefined' && window.crypto);
```
This makes the module work in both browser (`window.crypto`) and Node.js test environment (`globalThis.crypto` polyfilled by `vitest.setup.js`).

**Important:** The original plan (01-01) used only `window.crypto`. The actual implementation upgraded to the dual-path guard for Node compatibility. This is a divergence from the original plan that the re-plan should document.

### Pattern 3: Centralized App State + triggerGenerate
**What:** `src/app.js` owns a single `appState` object at module scope:
```js
const appState = {
  length: 16,
  enabledSets: ['uppercase', 'lowercase', 'numbers', 'symbols'],
  currentPassword: null,
};
```
`triggerGenerate()` reads from `appState` at call time (no stale closures). Phase 2 will mutate `appState` then call `triggerGenerate()`.

Both `appState` and `triggerGenerate` are exported for Phase 2 consumption:
```js
export { appState, triggerGenerate, renderPasswordDisplay, renderStrengthIndicator };
```

### Pattern 4: Inline Error / Info Messaging
The `getOrCreateErrorEl()` function lazily creates a `<p id="generate-error">` element with `role="alert"` and `aria-live="assertive"` and inserts it after the generate button. This element is **not** in the static HTML — it's injected at runtime. Plans that verify ARIA must account for this.

### Anti-Patterns to Avoid
- **Using `Math.random()`**: Banned. Comment at top of generator.js and app.js enforces this.
- **Direct DOM manipulation in engine**: The engine has zero DOM dependency — keep it that way.
- **Using `window.crypto` directly in engine**: Use the `globalThis.crypto || window.crypto` pattern to support Node test environment.

---

## Requirements Coverage

| Requirement | Where Implemented | Verification Location |
|-------------|------------------|----------------------|
| GEN-01: Cryptographically random via Web Crypto API | `generator.js` `unbiasedRandomIndex` | Test: "throws CRYPTO_UNAVAILABLE if crypto absent" |
| GEN-02: Respects active character sets | `generator.js` `buildPool` + `generate` | Test: "all characters come from enabled sets" |
| GEN-03: Respects configured length | `generator.js` `generate` | Test: "returns password of exact requested length" |
| DISP-01: Read-only monospace field | `index.html` `<input readonly>` + `style.css` | Verify `readonly` attr + monospace font-family |
| DISP-02: Updates immediately on generation | `app.js` `renderPasswordDisplay` called in `triggerGenerate` | Verify immediate DOM update in app.js |
| DISP-03: Placeholder before first generation | `index.html` + `app.js` `renderPasswordDisplay(null)` on init | Verify placeholder text |
| TRIG-01: Prominent Generate button | `index.html` `<button id="generate-btn">` | Verify button exists and is visually prominent |
| TRIG-02: Keyboard accessible (Enter/Space) | `app.js` keydown listener + native button behavior | Verify both click and keydown listeners |
| TRIG-03: Auto-regenerate on config change | `app.js` `triggerGenerate` exported, reads `appState` live | Verify export exists; Phase 2 will use it |

---

## Test Structure

### Test File: `src/engine/generator.test.js`

**Test Runner:** Vitest 1.6.1 in Node environment with `globalThis.crypto` polyfilled

**13 Tests across 3 describe blocks:**

#### `describe('generate()')`  — 9 tests
| Test | What It Verifies |
|------|-----------------|
| returns password of exact requested length | `result.password.length === 16`, `result.length === 16`, `result.lengthAdjusted === false` |
| returns password of exact requested length for single set | Single set, length 8 |
| all characters come from enabled sets | All 4 sets, length 32 — every char in pool |
| all characters come from single enabled set | Uppercase only — every char in uppercase pool |
| guarantees at least one character from each enabled set | 20 runs of length 16, all 4 sets must appear |
| sets lengthAdjusted=true when length < number of enabled sets | `generate({ length: 1, enabledSets: ['uppercase', 'lowercase'] })` → length becomes 2 |
| throws CRYPTO_UNAVAILABLE if crypto.getRandomValues is absent | Deletes `globalThis.crypto`, restores after |
| throws NO_SETS_ENABLED if enabledSets is empty | `enabledSets: []` |
| throws NO_SETS_ENABLED if enabledSets is undefined | No `enabledSets` property |
| generates 1000 passwords with near-zero collisions | Set of 1000 must have size 1000 |

#### `describe('buildPool()')`  — 2 tests
| Test | What It Verifies |
|------|-----------------|
| concatenates characters from all enabled sets | `['uppercase', 'numbers']` → exact string concat |
| returns empty string for empty array | `buildPool([])` === `''` |

#### `describe('unbiasedRandomIndex (via generate)')`  — 1 test
| Test | What It Verifies |
|------|-----------------|
| stays in valid range | 100 chars from symbols set, all at valid indexOf |

**Note:** The original plan (01-01) specified 8 tests. The actual implementation has 13 (5 additional tests were added during implementation). The re-plan should update the expected test count to 13.

---

## Divergences from Original Plans

These are differences between what the original plans specified and what was actually implemented. The re-plan should document these as "already resolved" rather than re-specifying the original approach.

| Item | Original Plan Said | What Was Built | Impact |
|------|--------------------|----------------|--------|
| Crypto API access | `window.crypto` only | `globalThis.crypto \|\| window.crypto` dual-path | Tests work in Node; no fix needed |
| Test count | 8 tests (Plan 01-01, Task 9) | 13 tests | Re-plan should use 13 as the target |
| `renderPasswordDisplay` | Used `setSelectionRange(0,0)` | Uses `scrollLeft = 0` only | Functionally equivalent; simpler |
| Strength indicator | Listed as "Phase 2 placeholder" in 01-02 | Fully implemented in Phase 1 (01-03) | Strength bar works immediately |
| Error element | Not in original 01-02 HTML | Dynamically injected via `getOrCreateErrorEl()` | Correct ARIA pattern; different from static approach |
| `showGenerateInfo` | Not in original plan | Implemented for `lengthAdjusted` info message | Enhancement over spec |
| `vitest.config.js` | Not specified in original plan | Exists with `setupFiles` pointing to `vitest.setup.js` | Required for Node crypto polyfill |

---

## Gaps and Issues Found

### Verified: No Gaps in Core Functionality
All Phase 1 requirements (GEN-01–03, DISP-01–03, TRIG-01–03) are implemented and working.

### Minor Observation: TRIG-03 Partially Deferred
TRIG-03 ("auto-regenerate on config change") is architecturally satisfied in Phase 1: `triggerGenerate` is exported, reads live from `appState`, and is designed to be called by Phase 2 config change handlers. However, the actual auto-regeneration behavior cannot be tested until Phase 2 adds the config controls. The re-plan should note this explicitly.

### Minor Observation: Strength Indicator Above Requirements
The strength bar and label (`renderStrengthIndicator`) are fully functional in Phase 1, even though the REQUIREMENTS.md lists them as v2 requirements (STR-01–03). They work correctly against the Phase 1 defaults (length 16, all 4 sets = "Very Strong"). Phase 2 will need to call `renderStrengthIndicator()` when config changes.

### No Issues Found
- No `Math.random()` usage anywhere (confirmed)
- No dead code
- No console.log statements left in
- All exports correct for Phase 2 consumption
- Responsive CSS included (320px+ viewports)

---

## Recommended Plan Structure for Re-Planning

Three plans, matching the original structure but reframed as **verification plans**:

### Plan 01-01: Generation Engine (Verification)
**Goal:** Verify the password generation engine exists and is correct.
**Requirements:** GEN-01, GEN-02, GEN-03
**Tasks should verify:**
- `src/engine/generator.js` exists with all 7 exports: `CHAR_SETS`, `buildPool`, `generate` (internal: `unbiasedRandomIndex`, `randomChar`, `shuffle`)
- `CHAR_SETS` has correct keys and character strings (uppercase 26, lowercase 26, numbers 10, symbols 28)
- `buildPool([])` returns `''`; `buildPool(['uppercase', 'numbers'])` returns correct concat
- `generate({ length: 16, enabledSets: ALL_SETS })` returns 16-char string with chars only from all sets
- `unbiasedRandomIndex` uses rejection sampling (dual-path crypto guard present)
- `generate` throws `CRYPTO_UNAVAILABLE` and `NO_SETS_ENABLED` with correct error strings
- `lengthAdjusted` is set correctly when length < enabled set count
- All 13 unit tests pass: `npm test` exits 0

### Plan 01-02: Password Display (Verification)
**Goal:** Verify the HTML/CSS display component is correct.
**Requirements:** DISP-01, DISP-02, DISP-03
**Tasks should verify:**
- `index.html` has `<input id="password-display" readonly>` with `placeholder="Click Generate to create a password"`
- Password display uses monospace font (`.password-display` has `font-family: 'Courier New', Consolas, monospace`)
- Dark theme applied correctly (background `#1a202c`, text `#68d391`)
- Horizontal scroll works for long passwords (`overflow-x: auto`, `white-space: nowrap`)
- Strength bar container present in HTML with correct `role="meter"` ARIA attributes
- `<script type="module" src="src/app.js">` present in HTML
- `renderPasswordDisplay(null)` shows placeholder; `renderPasswordDisplay('abc123')` sets `.value`
- Responsive breakpoint at 320px covered in CSS

### Plan 01-03: Generate Button and Trigger Wiring (Verification)
**Goal:** Verify the generate button is fully wired with keyboard accessibility and error handling.
**Requirements:** TRIG-01, TRIG-02, TRIG-03
**Tasks should verify:**
- `<button id="generate-btn" type="button">` exists in HTML with correct `aria-label`
- `app.js` has `appState` with `{ length: 16, enabledSets: [...4 sets], currentPassword: null }`
- Click event listener calls `triggerGenerate()`
- Keydown event listener handles `Enter` and `Space` (redundant but present for robustness)
- `triggerGenerate()` calls `generate({ length: appState.length, enabledSets: appState.enabledSets })`
- `renderPasswordDisplay` and `renderStrengthIndicator` are both called after successful generation
- Error handling: `CRYPTO_UNAVAILABLE` shows permanent error; `NO_SETS_ENABLED` shows 5s error
- `getOrCreateErrorEl()` creates `<p role="alert" aria-live="assertive">` injected after button
- `showGenerateInfo` shows `lengthAdjusted` message in green
- `triggerGenerate`, `appState`, `renderPasswordDisplay`, `renderStrengthIndicator` are all exported
- Initial render on load: `renderPasswordDisplay(null)` + `renderStrengthIndicator()` called

---

## Code Examples

### generate() — Complete Verified Signature
```js
// src/engine/generator.js
export function generate(config) {
  // config: { length: number, enabledSets: string[] }
  // returns: { password: string, length: number, lengthAdjusted: boolean }
  // throws: Error('CRYPTO_UNAVAILABLE') | Error('NO_SETS_ENABLED')
}
```

### Crypto Guard Pattern (Used in Both generate and unbiasedRandomIndex)
```js
const cryptoAPI = (typeof globalThis !== 'undefined' && globalThis.crypto)
  || (typeof window !== 'undefined' && window.crypto);
```

### Rejection Sampling Pattern
```js
function unbiasedRandomIndex(poolSize) {
  const limit = Math.floor(0xFFFFFFFF / poolSize) * poolSize;
  const buf = new Uint32Array(1);
  let value;
  do {
    cryptoAPI.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % poolSize;
}
```

### Strength Indicator Calculation
```js
// app.js - renderStrengthIndicator()
const POOL_SIZES = { uppercase: 26, lowercase: 26, numbers: 10, symbols: 28 };
const poolSize = appState.enabledSets.reduce((sum, key) => sum + POOL_SIZES[key], 0);
const entropy = appState.length * Math.log2(poolSize);
// < 40 = Weak, < 60 = Fair, < 80 = Strong, >= 80 = Very Strong
```

### Initial Strength at Phase 1 Defaults
With length=16 and all 4 sets (poolSize=90): `entropy = 16 × log₂(90) ≈ 16 × 6.49 ≈ 103.9` → **Very Strong**

### Test Setup (Vitest Node + Crypto Polyfill)
```js
// vitest.config.js
export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
});

// vitest.setup.js
import { webcrypto } from 'node:crypto';
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = webcrypto;
}
```

---

## Open Questions

1. **TRIG-03 Test Coverage**
   - What we know: `triggerGenerate` is exported and reads `appState` live
   - What's unclear: There are no tests for `triggerGenerate` itself (app.js is not tested — only engine is)
   - Recommendation: Plan 01-03 verification should confirm the export exists and the function signature is correct; full integration testing requires a DOM environment (jsdom) which is not set up

2. **Vitest Version Pin**
   - What we know: `package.json` specifies `"vitest": "^1.0.0"`, installed version is `1.6.1`
   - What's unclear: Whether the re-plan should pin to `1.6.1` exactly or leave the `^1` range
   - Recommendation: Keep `^1.0.0` unless a specific 1.6.x feature is needed

---

## Sources

### Primary (HIGH confidence) — Direct Source Inspection
- `/root/pivota-workspaces/pivota/app6/src/engine/generator.js` — Full implementation reviewed
- `/root/pivota-workspaces/pivota/app6/src/engine/generator.test.js` — All 13 tests reviewed
- `/root/pivota-workspaces/pivota/app6/src/app.js` — Full 170-line implementation reviewed
- `/root/pivota-workspaces/pivota/app6/index.html` — Full HTML structure reviewed
- `/root/pivota-workspaces/pivota/app6/style.css` — Full 156-line stylesheet reviewed
- `/root/pivota-workspaces/pivota/app6/vitest.config.js` + `vitest.setup.js` — Config reviewed
- `/root/pivota-workspaces/pivota/app6/package.json` — Dependencies and scripts confirmed
- Live test run: `npm test` — 13/13 passing confirmed (2026-05-10 20:33:19)

### Secondary (HIGH confidence) — Planning Documents
- `.planning/phases/01-core-generation-loop/01-01-generation-engine.md` — Original plan reviewed
- `.planning/phases/01-core-generation-loop/01-02-password-display.md` — Original plan reviewed
- `.planning/phases/01-core-generation-loop/01-03-generate-button.md` — Original plan reviewed
- `.planning/REQUIREMENTS.md` — Full requirements reviewed
- `.planning/ROADMAP.md` — Roadmap reviewed (Phase 1 marked complete)
- `.planning/STATE.md` — State reviewed (Phase 1 complete, 2026-05-10)

---

## Metadata

**Confidence breakdown:**
- What is implemented: HIGH — direct file inspection + live test run
- Tech decisions: HIGH — all confirmed from source files
- Test structure: HIGH — every test case enumerated from test file
- Divergences from original plans: HIGH — compared plan files against source files
- Gaps/issues: HIGH — none found; all requirements traceable to implementation

**Research date:** 2026-05-10
**Valid until:** This is a brownfield audit of a complete phase. Findings remain valid until the Phase 1 files are modified. If Phase 2 modifies `src/app.js` (expected), re-research app.js before re-re-planning Phase 1.
