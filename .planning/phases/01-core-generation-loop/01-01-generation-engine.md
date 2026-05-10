# Plan 01-01: Generation Engine

**Phase:** 1 — Core Generation Loop  
**Plan:** 01-01 of 03  
**Goal:** Implement the password generation engine module (Web Crypto API, character pool assembly, guaranteed slots, Fisher-Yates shuffle)  
**Requirements covered:** GEN-01, GEN-02, GEN-03  
**Status:** Pending

---

## Context

This is the first deliverable for the app. There is no existing codebase — greenfield. The engine is a pure logic module with no DOM dependency. It must use `crypto.getRandomValues()` exclusively (no `Math.random()`). The engine will be used by the Generate button (Plan 01-03) to produce passwords.

Tech stack: Vanilla JS (ES2020+), no framework, no build step required for Phase 1 (plain `<script type="module">` is fine). File layout: `src/engine/generator.js`.

---

## Tasks

### Task 1: Create project file structure

Create the minimal directory structure needed for Phase 1:

```
/
├── index.html          ← shell (created in Plan 01-02)
├── style.css           ← styles (created in Plan 01-02)
└── src/
    └── engine/
        └── generator.js  ← this plan
```

- Create `src/engine/` directory (mkdir -p or just create the file with path)

### Task 2: Define character set registry

In `src/engine/generator.js`, define the `CHAR_SETS` constant:

```js
const CHAR_SETS = {
  uppercase: { key: 'uppercase', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', size: 26 },
  lowercase: { key: 'lowercase', characters: 'abcdefghijklmnopqrstuvwxyz', size: 26 },
  numbers:   { key: 'numbers',   characters: '0123456789',                  size: 10 },
  symbols:   { key: 'symbols',   characters: '!@#$%^&*()-_=+[]{}|;:,.<>?', size: 28 },
};
```

### Task 3: Implement `buildPool(enabledSets)`

Pure function. Concatenates the `characters` string of each enabled set key.

```js
function buildPool(enabledSets) {
  return enabledSets.map(key => CHAR_SETS[key].characters).join('');
}
```

### Task 4: Implement `unbiasedRandomIndex(poolSize)`

Use rejection sampling to avoid modulo bias:

```js
function unbiasedRandomIndex(poolSize) {
  const limit = Math.floor(0xFFFFFFFF / poolSize) * poolSize;
  const buf = new Uint32Array(1);
  let value;
  do {
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % poolSize;
}
```

### Task 5: Implement `randomChar(pool)`

Draw one random character from a string using `unbiasedRandomIndex`:

```js
function randomChar(pool) {
  return pool[unbiasedRandomIndex(pool.length)];
}
```

### Task 6: Implement `shuffle(arr)`

Fisher-Yates in-place shuffle using `crypto.getRandomValues()`:

```js
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = unbiasedRandomIndex(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
```

### Task 7: Implement `generate(config)`

Main public function:

```js
export function generate(config) {
  // 1. Validate crypto availability
  if (!window.crypto || !window.crypto.getRandomValues) {
    throw new Error('CRYPTO_UNAVAILABLE');
  }
  // 2. Validate config
  if (!config.enabledSets || config.enabledSets.length === 0) {
    throw new Error('NO_SETS_ENABLED');
  }
  let length = config.length;
  let lengthAdjusted = false;
  if (length < config.enabledSets.length) {
    length = config.enabledSets.length;
    lengthAdjusted = true;
  }
  // 3. Build pool
  const pool = buildPool(config.enabledSets);
  // 4. Guaranteed slots — one char from each enabled set
  const slots = config.enabledSets.map(key => randomChar(CHAR_SETS[key].characters));
  // 5. Fill remaining positions from full pool
  const remaining = length - slots.length;
  for (let i = 0; i < remaining; i++) {
    slots.push(randomChar(pool));
  }
  // 6. Shuffle
  shuffle(slots);
  // 7. Return result
  return {
    password: slots.join(''),
    length: slots.length,
    lengthAdjusted,
  };
}
```

### Task 8: Export module

Ensure `generator.js` uses ES module `export` for `generate` and `buildPool` (needed for unit tests and consumption by UI code in Plan 01-03).

Also export `CHAR_SETS` so UI code can reference character set metadata.

### Task 9: Write unit tests

Create `src/engine/generator.test.js` (Vitest or plain test-runner assertions run in Node with `--experimental-vm-modules` flag, or use a simple in-browser test approach).

**Tests to write:**

| Test | Assertion |
|------|-----------|
| `generate` returns password of exact length | `result.password.length === config.length` |
| All characters in password come from enabled sets | Every char is in the pool string |
| At least one char from each enabled set | For each enabled set, at least one char appears |
| `shuffle` does not change array length or elements | Same set of chars, different order |
| `unbiasedRandomIndex` returns value in `[0, poolSize)` | `result >= 0 && result < poolSize` |
| Throws `CRYPTO_UNAVAILABLE` if crypto absent | Mock `window.crypto = undefined` |
| Throws `NO_SETS_ENABLED` if empty array | `generate({ length: 16, enabledSets: [] })` |
| `lengthAdjusted` flag set when length < set count | `generate({ length: 1, enabledSets: ['uppercase', 'lowercase'] })` |

> **Note:** Since this is a pure logic module with no DOM dependency, tests can be run in Node.js with jsdom or directly via Vitest. Keep test setup minimal for Phase 1 — a `package.json` with Vitest dev dependency is enough.

---

## File Checklist

- [ ] `src/engine/generator.js` created with all functions
- [ ] All functions exported correctly
- [ ] `CHAR_SETS` exported
- [ ] `src/engine/generator.test.js` created with all 8 test cases
- [ ] `package.json` created with Vitest dev dependency (if not already present)

---

## Acceptance Criteria

- [ ] `generate({ length: 16, enabledSets: ['uppercase', 'lowercase', 'numbers', 'symbols'] })` returns a 16-character string
- [ ] All characters in the returned string are from the combined alphabet (`ABCDEFGHIJKLMNOPQRSTUVWXYZ` + `abcdefghijklmnopqrstuvwxyz` + `0123456789` + `!@#$%^&*()-_=+[]{}|;:,.<>?`)
- [ ] At least one character from each of the four enabled sets is present
- [ ] `generate({ length: 8, enabledSets: ['uppercase'] })` returns 8 uppercase letters only
- [ ] Calling `generate` 1000 times produces no two identical results (probabilistic — near-zero collision chance)
- [ ] Unit tests pass: `npm test` (or `npx vitest run`) exits 0

---

## Notes / Decisions

- No TypeScript in Phase 1 — plain JS with JSDoc comments for type hints. TypeScript can be added as an optional enhancement later.
- `Math.random()` is not used anywhere in this file. A comment at the top of `generator.js` documents this constraint.
- The `generate()` function clamps length silently (auto-adjusts) rather than throwing, per FRD F0 spec.
