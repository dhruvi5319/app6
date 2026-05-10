# Plan 01-01: Generation Engine

**Phase:** 1 — Core Generation Loop
**Plan:** 01-01 of 03
**Goal:** Implement the password generation engine module (Web Crypto API, character pool assembly, guaranteed slots, Fisher-Yates shuffle)
**Requirements covered:** GEN-01, GEN-02, GEN-03
**Status:** Complete ✅
**Completed:** 2026-05-10
**Depends on:** None (first deliverable)

---

## What Was Built

The password generation engine is fully implemented as a pure logic module with zero DOM dependency. All 13 unit tests pass. The engine is consumed by `src/app.js` via ES module import.

### Files Created

| File | Lines | Notes |
|------|-------|-------|
| `src/engine/generator.js` | 117 | Pure logic module — no DOM dependency |
| `src/engine/generator.test.js` | 101 | 13 Vitest unit tests, all passing |
| `package.json` | 12 | ESM module, Vitest 1.x, dev/test scripts |
| `vitest.config.js` | 10 | Node env, `setupFiles` pointing to vitest.setup.js |
| `vitest.setup.js` | 7 | `globalThis.crypto` polyfill for Node test environment |

### Exports from `src/engine/generator.js`

```js
export const CHAR_SETS    // Character set registry (4 sets)
export function buildPool  // Concatenates characters from enabled set keys
export function generate   // Main generation function
// Internal (not exported): unbiasedRandomIndex, randomChar, shuffle
```

---

## Context

Greenfield implementation. The engine is the first deliverable. Tech stack: Vanilla JS (ESM), no framework, no build step. Testing: Vitest 1.6.1 in Node environment with `globalThis.crypto` polyfilled.

---

## Implementation Details

### Character Set Registry (`CHAR_SETS`)

```js
export const CHAR_SETS = {
  uppercase: { key: 'uppercase', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', size: 26 },
  lowercase: { key: 'lowercase', characters: 'abcdefghijklmnopqrstuvwxyz', size: 26 },
  numbers:   { key: 'numbers',   characters: '0123456789',                  size: 10 },
  symbols:   { key: 'symbols',   characters: '!@#$%^&*()-_=+[]{}|;:,.<>?', size: 28 },
};
```

### `buildPool(enabledSets)`

Pure function. Concatenates the `characters` string of each enabled set key.

```js
export function buildPool(enabledSets) {
  return enabledSets.map(key => CHAR_SETS[key].characters).join('');
}
```

### `unbiasedRandomIndex(poolSize)` (internal)

Rejection sampling to avoid modulo bias. Resolves `cryptoAPI` via dual-path guard for Node/browser compatibility:

```js
function unbiasedRandomIndex(poolSize) {
  const limit = Math.floor(0xFFFFFFFF / poolSize) * poolSize;
  const buf = new Uint32Array(1);
  const cryptoAPI = (typeof globalThis !== 'undefined' && globalThis.crypto)
    || (typeof window !== 'undefined' && window.crypto);
  let value;
  do {
    cryptoAPI.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % poolSize;
}
```

### `randomChar(pool)` (internal)

```js
function randomChar(pool) {
  return pool[unbiasedRandomIndex(pool.length)];
}
```

### `shuffle(arr)` (internal)

Fisher-Yates in-place shuffle using `unbiasedRandomIndex`:

```js
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = unbiasedRandomIndex(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
```

### `generate(config)` — Main Public Function

```js
export function generate(config) {
  // config: { length: number, enabledSets: string[] }
  // returns: { password: string, length: number, lengthAdjusted: boolean }
  // throws: Error('CRYPTO_UNAVAILABLE') | Error('NO_SETS_ENABLED')
}
```

Generation steps:
1. Validate crypto availability via dual-path guard
2. Validate `config.enabledSets` is non-empty
3. Auto-adjust `length` if `length < enabledSets.length` (sets `lengthAdjusted = true`)
4. Build pool string via `buildPool`
5. Fill guaranteed slots — one character from each enabled set
6. Fill remaining slots from full pool
7. Fisher-Yates shuffle
8. Return `{ password, length, lengthAdjusted }`

### Test Infrastructure

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

## Unit Tests (13 total)

**Verified test run:** `npm test` → 13/13 passing, 157ms (2026-05-10)

### `describe('generate()')` — 9 tests

| # | Test Name | What It Verifies |
|---|-----------|-----------------|
| 1 | returns a password of exact requested length | `result.password.length === 16`, `result.length === 16`, `result.lengthAdjusted === false` |
| 2 | returns a password of exact requested length for single set | Single set (`uppercase`), length 8 |
| 3 | all characters come from enabled sets | Length 32, all 4 sets — every char present in pool |
| 4 | all characters come from single enabled set | Uppercase only — every char in uppercase pool |
| 5 | guarantees at least one character from each enabled set | 20 runs of length 16, all 4 sets must appear each run |
| 6 | sets lengthAdjusted=true when length < number of enabled sets | `length: 1, enabledSets: ['uppercase', 'lowercase']` → `lengthAdjusted: true`, `length: 2` |
| 7 | throws CRYPTO_UNAVAILABLE if crypto.getRandomValues is absent | Deletes `globalThis.crypto`, restores after |
| 8 | throws NO_SETS_ENABLED if enabledSets is empty | `enabledSets: []` |
| 9 | throws NO_SETS_ENABLED if enabledSets is undefined | No `enabledSets` property |
| 10 | generates 1000 passwords with near-zero collisions | Set of 1000 must have size 1000 |

### `describe('buildPool()')` — 2 tests

| # | Test Name | What It Verifies |
|---|-----------|-----------------|
| 11 | concatenates characters from all enabled sets | `['uppercase', 'numbers']` → exact string concat |
| 12 | returns empty string for empty array | `buildPool([])` === `''` |

### `describe('unbiasedRandomIndex (via generate)')` — 1 test

| # | Test Name | What It Verifies |
|---|-----------|-----------------|
| 13 | stays in valid range — all chars from generate are within pool | 100 chars from symbols set, all at valid `indexOf` |

---

## Divergences from Original Plan

| Item | Original Plan Said | What Was Actually Built |
|------|--------------------|------------------------|
| Crypto API access in `generate()` and `unbiasedRandomIndex()` | `window.crypto` only | `globalThis.crypto \|\| window.crypto` dual-path guard — required for Node test compatibility |
| Test count | 8 tests | **13 tests** (5 additional: single-set length, single-set chars, `undefined` enabledSets, 1000 collision check, range check via generate) |
| Test environment config | Not specified — suggested jsdom or `--experimental-vm-modules` | `vitest.config.js` with `environment: 'node'` + `vitest.setup.js` polyfill |
| `shuffle` test | Listed as standalone test ("shuffle does not change array length or elements") | Shuffle tested indirectly via generate tests; no dedicated shuffle describe block |

---

## File Checklist

- [x] `src/engine/generator.js` created with all functions
- [x] `CHAR_SETS` exported
- [x] `buildPool` exported
- [x] `generate` exported
- [x] `src/engine/generator.test.js` created with 13 test cases
- [x] `package.json` created with `"type": "module"`, Vitest dev dependency, `test`/`dev` scripts
- [x] `vitest.config.js` created with node environment and setupFiles
- [x] `vitest.setup.js` created with `globalThis.crypto` polyfill

---

## Acceptance Criteria — Verified

- [x] `generate({ length: 16, enabledSets: ['uppercase', 'lowercase', 'numbers', 'symbols'] })` returns a 16-character string
- [x] All characters in the returned string are from the combined alphabet (26 + 26 + 10 + 28 = 90 chars)
- [x] At least one character from each of the four enabled sets is guaranteed (tested over 20 runs)
- [x] `generate({ length: 8, enabledSets: ['uppercase'] })` returns 8 uppercase letters only
- [x] Calling `generate` 1000 times produces no two identical results
- [x] `npm test` passes — 13/13 tests green, exits 0

---

## Notes / Decisions

- `Math.random()` is never used. Comment at top of `generator.js` enforces this constraint.
- No TypeScript — plain JS with JSDoc comments for type hints.
- `generate()` clamps length silently (auto-adjusts) rather than throwing, and communicates the adjustment via `lengthAdjusted: true` in the return value. `app.js` surfaces this as a brief info message to the user.
- Dual-path crypto guard (`globalThis.crypto || window.crypto`) was not in the original plan but is the correct approach — `window.crypto` alone would break in the Node test environment.
- The `vitest.config.js` + `vitest.setup.js` pair was not specified in the original plan but is required to run the engine tests in Node without jsdom.
