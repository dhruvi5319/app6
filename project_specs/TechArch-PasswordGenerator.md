# Technical Architecture: Password Generator
**Version:** 1.0  
**Date:** 2026-05-04  
**Status:** Draft  
**Based on:** PRD-PasswordGenerator.md v1.0, FRD-PasswordGenerator.md v1.0

---

## Table of Contents

1. [Architectural Overview](#1-architectural-overview)
2. [Component Architecture](#2-component-architecture)
3. [Application State Model](#3-application-state-model)
4. [Data Model](#4-data-model)
5. [API Design](#5-api-design)
6. [Security Architecture](#6-security-architecture)
7. [Technology Stack](#7-technology-stack)
8. [Integration Points](#8-integration-points)
9. [Architectural Decisions](#9-architectural-decisions)

---

## 1. Architectural Overview

### Pattern

Password Generator uses a **Zero-Backend Single-Page Application (SPA)** architecture. All logic, state, and computation execute entirely within the user's browser. There are no servers, no databases, no API calls, and no user data transmitted over any network. The deployment artifact is a set of static files served from any static host.

This pattern was chosen because the core function — generating a random password — is a pure, stateless computation that requires only browser-native APIs. Introducing a backend would add latency, cost, infrastructure complexity, and privacy risk without providing any user value.

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                        User's Browser                        │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                   SPA (index.html)                     │  │
│  │                                                        │  │
│  │  ┌──────────────┐    ┌───────────────────────────────┐ │  │
│  │  │   UI Layer   │    │        Logic Layer            │ │  │
│  │  │  (HTML/CSS)  │◄──►│   (Vanilla JS ES6+ Modules)  │ │  │
│  │  │              │    │                               │ │  │
│  │  │  ConfigPanel │    │  ┌─────────────────────────┐ │ │  │
│  │  │  PasswordOut │    │  │  GenerationEngine (F0)  │ │ │  │
│  │  │  ActionBar   │    │  │  - buildPool()          │ │ │  │
│  │  │  StrengthBar │    │  │  - guaranteedSlots()    │ │ │  │
│  │  └──────────────┘    │  │  - fisherYatesShuffle() │ │ │  │
│  │                      │  │  - generate()           │ │ │  │
│  │  ┌──────────────┐    │  └─────────────────────────┘ │ │  │
│  │  │  appState{}  │◄──►│                               │ │  │
│  │  │  (in-memory) │    │  ┌─────────────────────────┐ │ │  │
│  │  └──────────────┘    │  │  StrengthCalculator (F5)│ │ │  │
│  │                      │  │  - entropy()            │ │ │  │
│  │                      │  │  - scoreToLevel()       │ │ │  │
│  │                      │  └─────────────────────────┘ │ │  │
│  │                      │                               │ │  │
│  │                      │  ┌─────────────────────────┐ │ │  │
│  │                      │  │  ClipboardManager (F4)  │ │ │  │
│  │                      │  │  - copyModern()         │ │ │  │
│  │                      │  │  - copyLegacyFallback() │ │ │  │
│  │                      │  └─────────────────────────┘ │ │  │
│  │                      └───────────────────────────────┘ │  │
│  │                                                        │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │               Browser APIs                      │  │  │
│  │  │  window.crypto.getRandomValues()  (Crypto API)  │  │  │
│  │  │  navigator.clipboard.writeText()  (Clipboard)   │  │  │
│  │  │  document.execCommand('copy')     (Fallback)    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                              │
                    (HTTPS file delivery)
                              │
┌──────────────────────────────────────────────────────────────┐
│              Static File Host                                │
│   (GitHub Pages / Netlify / Vercel / Any CDN)                │
│                                                              │
│   index.html  ·  style.css  ·  app.js (or bundled modules)  │
└──────────────────────────────────────────────────────────────┘
```

### Deployment Topology

The application is deployed as three static files (or a Vite-built bundle):

| File | Role |
|------|------|
| `index.html` | Document shell, component markup |
| `style.css` | All visual styling, responsive layout, strength bar colors |
| `app.js` | All JavaScript logic (modules or bundled) |

Deployment to any static host requires no build pipeline unless a framework is introduced. If Vite is used (optional), `npm run build` produces a `dist/` directory that is uploaded as-is.

**HTTPS is required** in production so that `navigator.clipboard.writeText()` is available (Clipboard API is restricted to secure contexts).

---

## 2. Component Architecture

The application is structured as a set of **loosely coupled vanilla JS modules** that read and write to a shared `appState` object. There is no virtual DOM or framework — all DOM updates are direct imperative operations triggered by event handlers.

### Component Tree

```
App (index.html root)
├── PasswordDisplay              ← F3  reads  appState.currentPassword
├── ConfigPanel
│   ├── LengthControl            ← F1  reads/writes  appState.length
│   │   ├── LengthSlider         (input[type=range])
│   │   ├── LengthInput          (input[type=number])
│   │   └── LengthLabel          (live counter label)
│   └── CharSetToggles           ← F2  reads/writes  appState.enabledSets
│       ├── UppercaseToggle      (input[type=checkbox])
│       ├── LowercaseToggle      (input[type=checkbox])
│       ├── NumbersToggle        (input[type=checkbox])
│       └── SymbolsToggle        (input[type=checkbox])
├── ActionBar
│   ├── GenerateButton           ← F6  triggers F0; writes appState.currentPassword
│   └── CopyButton               ← F4  reads appState.currentPassword
└── StrengthIndicator            ← F5  reads appState.length + appState.enabledSets
    ├── StrengthBar              (div with dynamic width/color)
    └── StrengthLabel            (text node)
```

### Component Responsibilities

#### PasswordDisplay
- Renders `appState.currentPassword` in a monospace, read-only field.
- Shows placeholder text `"Click Generate to create a password"` when `currentPassword` is null or empty.
- Applies `overflow-x: auto` so long passwords scroll horizontally without truncation.
- Marked `aria-live="polite"` so screen readers announce new passwords.

#### LengthControl
- Maintains bidirectional sync between the slider and the numeric input.
- Clamps out-of-range values to [8, 128] on blur (not on every keystroke).
- Ignores non-numeric entries, reverting to the last valid value on blur.
- Updates `appState.length` and triggers `StrengthIndicator` recalculation on change.

#### CharSetToggles
- Each toggle maps to one entry in `appState.enabledSets`.
- **Last Active Guard:** if only one set remains enabled and the user attempts to disable it, the toggle is snapped back to checked and a 3-second inline message is shown.
- On any change, updates `GenerateButton` disabled state and triggers `StrengthIndicator` recalculation.

#### GenerateButton
- Calls `GenerationEngine.generate(appState)` on click or Enter/Space.
- Sets `disabled` attribute (not just CSS) when `appState.enabledSets.length === 0`.
- On successful generation, writes the result to `appState.currentPassword` and triggers `PasswordDisplay` and `StrengthIndicator` updates.
- Displays inline error messages for engine errors.

#### CopyButton
- Reads `appState.currentPassword`; no-ops if null/empty.
- Attempts `navigator.clipboard.writeText()` first; falls back to `execCommand('copy')`.
- Shows "Copied!" label for exactly 2000ms; re-click resets the timer.
- Shows a 5-second error message if both clipboard methods fail.

#### StrengthIndicator
- Recalculates entropy and maps to score 1–4 on every change to `appState.length` or `appState.enabledSets`.
- Updates bar width (25% / 50% / 75% / 100%) and background color in a single DOM write.
- Updates `aria-label` for screen reader support.

#### GenerationEngine (Pure Logic Module)
- Accepts a `GeneratorConfig`; returns a password string.
- Uses `crypto.getRandomValues()` exclusively — no `Math.random()`.
- Guarantees at least one character from each enabled set via guaranteed slots, then fills the remainder, then applies a Fisher-Yates shuffle.

#### StrengthCalculator (Pure Logic Module)
- Stateless function: `calculateStrength(length, enabledSets) → StrengthResult`.
- Computes `entropy = length × log₂(poolSize)` and maps to score.

#### ClipboardManager (Pure Logic Module)
- Stateless module with two functions: `copyModern(text)` and `copyLegacyFallback(text)`.
- Returns a `Promise<boolean>` indicating success.

### Inter-Component Communication

| Source | Event | Affected Components |
|--------|-------|---------------------|
| LengthSlider / LengthInput | `length` change | LengthLabel, StrengthIndicator |
| CharSetToggles | `enabledSets` change | GenerateButton (disabled state), StrengthIndicator |
| GenerateButton | Generation complete | PasswordDisplay, StrengthIndicator, CopyButton (un-inert) |
| CopyButton | Copy success | CopyButton (confirmation state) |

---

## 3. Application State Model

Because there is no backend, all state lives in a single in-memory JavaScript object. This section is the canonical definition of that object and its transition rules.

### State Shape

```typescript
interface AppState {
  /** F1: Password length. Integer in [8, 128]. Default: 16. */
  length: number;

  /** F2: Currently enabled character sets. At least one entry always present. */
  enabledSets: CharSetKey[];

  /** F3/F4: The last generated password. Null before first generation. */
  currentPassword: string | null;

  /** F4: Whether the "Copied!" confirmation is currently showing. */
  copyConfirmActive: boolean;

  /** F4 internal: Handle for the 2s revert timer. */
  copyConfirmTimer: ReturnType<typeof setTimeout> | null;
}

type CharSetKey = 'uppercase' | 'lowercase' | 'numbers' | 'symbols';
```

### Initial State (Page Load)

```typescript
const appState: AppState = {
  length: 16,
  enabledSets: ['uppercase', 'lowercase', 'numbers', 'symbols'],
  currentPassword: null,
  copyConfirmActive: false,
  copyConfirmTimer: null,
};
```

### State Transition Table

| Event | State Field Changed | Rule |
|-------|--------------------|------|
| Page load | All fields | Initialized to defaults above |
| Slider dragged / input changed | `length` | Clamped to [8, 128] |
| Character set toggled on | `enabledSets` | Set key appended |
| Character set toggled off (not last) | `enabledSets` | Set key removed |
| Character set toggled off (last) | none | Last Active Guard — no change |
| Generate button clicked (success) | `currentPassword` | Set to generated string |
| Generate button clicked (error) | none | Error message shown inline |
| Copy button clicked (success) | `copyConfirmActive`, `copyConfirmTimer` | `true`; timer set for 2000ms |
| Copy timer expires | `copyConfirmActive`, `copyConfirmTimer` | `false`, `null` |
| Copy button re-clicked while confirming | `copyConfirmTimer` | Previous timer cleared; new 2000ms timer started |

---

## 4. Data Model

Because Password Generator has **no database**, this section defines the in-code data structures — the TypeScript interfaces and internal data types that serve the same structural role that database tables would serve in a server-side application.

### Character Set Registry

This is a static, compile-time constant — the authoritative definition of all supported character sets.

```typescript
/** All valid character set keys. */
type CharSetKey = 'uppercase' | 'lowercase' | 'numbers' | 'symbols';

/** Definition of a single character set. */
interface CharSetDefinition {
  /** Canonical key used in appState.enabledSets. */
  key: CharSetKey;
  /** Human-readable label shown in UI. */
  label: string;
  /** The actual characters belonging to this set. */
  characters: string;
  /** Number of characters (precomputed for performance). */
  size: number;
}

/** The authoritative registry of all character sets. */
const CHAR_SETS: Record<CharSetKey, CharSetDefinition> = {
  uppercase: {
    key: 'uppercase',
    label: 'Uppercase Letters (A–Z)',
    characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    size: 26,
  },
  lowercase: {
    key: 'lowercase',
    label: 'Lowercase Letters (a–z)',
    characters: 'abcdefghijklmnopqrstuvwxyz',
    size: 26,
  },
  numbers: {
    key: 'numbers',
    label: 'Numbers (0–9)',
    characters: '0123456789',
    size: 10,
  },
  symbols: {
    key: 'symbols',
    label: 'Symbols',
    characters: '!@#$%^&*()-_=+[]{}|;:,.<>?',
    size: 28,
  },
};
```

### GeneratorConfig

The input contract for the generation engine (F0).

```typescript
/** Input to the password generation engine. */
interface GeneratorConfig {
  /** Desired password length. Must be in [8, 128]. */
  length: number;
  /** Character sets to include. At least one entry required. */
  enabledSets: CharSetKey[];
}
```

### GeneratorResult

The output contract of the generation engine.

```typescript
/** Successful result from the generation engine. */
interface GeneratorResult {
  /** The generated password string. */
  password: string;
  /** Actual length (equals config.length unless auto-adjusted). */
  length: number;
  /** Flag set if length was auto-increased to satisfy set count. */
  lengthAdjusted: boolean;
}
```

### StrengthResult

The output of the strength calculator (F5).

```typescript
/** Result of a strength calculation. */
interface StrengthResult {
  /** Entropy estimate in bits. */
  entropy: number;
  /** Score 1–4 mapped from entropy. */
  score: StrengthScore;
  /** Human-readable level label. */
  level: StrengthLevel;
  /** CSS color hex for the strength bar. */
  color: string;
  /** Bar width as a CSS percentage string (e.g. "75%"). */
  barWidth: string;
}

type StrengthScore = 1 | 2 | 3 | 4;
type StrengthLevel = 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
```

### Strength Level Mapping Table

| Score | Level | Entropy Range | Bar Width | Bar Color |
|-------|-------|--------------|-----------|-----------|
| 1 | Weak | < 40 bits | 25% | `#e53e3e` |
| 2 | Fair | 40 – 59 bits | 50% | `#dd6b20` |
| 3 | Strong | 60 – 79 bits | 75% | `#d69e2e` |
| 4 | Very Strong | ≥ 80 bits | 100% | `#38a169` |

### Error Types

All error types thrown internally by logic modules.

```typescript
/** Base class for all application errors. */
class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

type ErrorCode =
  | 'CRYPTO_UNAVAILABLE'
  | 'NO_SETS_ENABLED'
  | 'LENGTH_TOO_SHORT'
  | 'LENGTH_TOO_LONG'
  | 'LENGTH_LESS_THAN_SET_COUNT'
  | 'INVALID_LENGTH_INPUT'
  | 'LAST_SET_DISABLED'
  | 'COPY_FAILED'
  | 'GENERATION_ERROR';

class CryptoUnavailableError extends AppError {
  constructor() {
    super('CRYPTO_UNAVAILABLE', 'window.crypto.getRandomValues is not available.');
  }
}

class ConfigurationError extends AppError {
  constructor(code: ErrorCode, message: string) {
    super(code, message);
    this.name = 'ConfigurationError';
  }
}
```

### Entity Relationship Overview

Since there is no persistent storage, the "entities" are runtime objects with the following relationships:

```
AppState
  │
  ├─── length (integer) ──────────────────────► StrengthCalculator.input
  │
  ├─── enabledSets (CharSetKey[]) ──────────────► StrengthCalculator.input
  │         │                                     GenerationEngine.input
  │         └─── each key resolves via ──────────► CHAR_SETS[key] → CharSetDefinition
  │
  └─── currentPassword (string | null) ─────────► PasswordDisplay
                                                   ClipboardManager.input
```

---

## 5. API Design

Password Generator has **no external REST API** — it is a pure client-side application. This section documents the **internal JavaScript module API**: the function signatures, input/output contracts, and TypeScript interfaces that define how the logic modules communicate.

### Module: `GenerationEngine`

**Location:** `src/engine/generator.ts` (or `generator.js`)

```typescript
/**
 * Generates a cryptographically secure random password.
 *
 * Algorithm:
 *  1. Build character pool from enabled sets.
 *  2. Fill guaranteed slots (one char per enabled set).
 *  3. Fill remaining positions from full pool.
 *  4. Apply Fisher-Yates shuffle using crypto.getRandomValues().
 *  5. Return joined string.
 *
 * @throws {CryptoUnavailableError} if window.crypto.getRandomValues is absent.
 * @throws {ConfigurationError}     if config fails validation.
 */
function generate(config: GeneratorConfig): GeneratorResult;

/**
 * Assembles the combined character pool string from the enabled sets.
 * Pure function — no side effects.
 */
function buildPool(enabledSets: CharSetKey[]): string;

/**
 * Draws a cryptographically random character from a string.
 * Uses crypto.getRandomValues() to avoid modulo bias via rejection sampling.
 */
function randomChar(pool: string): string;

/**
 * Fisher-Yates in-place shuffle of a character array.
 * All random indices sourced from crypto.getRandomValues().
 */
function shuffle(arr: string[]): void;
```

**Validation performed by `generate()`:**

| Check | Behaviour on Failure |
|-------|---------------------|
| `crypto.getRandomValues` present | Throw `CryptoUnavailableError` |
| `config.enabledSets.length >= 1` | Throw `ConfigurationError('NO_SETS_ENABLED', ...)` |
| `config.length >= 8` | Clamp to 8; log warning |
| `config.length <= 128` | Clamp to 128; log warning |
| `config.length >= enabledSets.length` | Auto-increase; set `result.lengthAdjusted = true` |

---

### Module: `StrengthCalculator`

**Location:** `src/engine/strength.ts`

```typescript
/**
 * Calculates password strength from a configuration.
 * Pure function — no side effects, no DOM access.
 *
 * Formula:
 *   poolSize = sum of character counts for all enabledSets
 *   entropy  = length * Math.log2(poolSize)
 *   score    = map entropy to 1–4 via thresholds
 */
function calculateStrength(
  length: number,
  enabledSets: CharSetKey[],
): StrengthResult;

/**
 * Returns the total size of the combined character pool.
 */
function poolSize(enabledSets: CharSetKey[]): number;

/**
 * Maps an entropy value to a StrengthScore (1–4).
 */
function entropyToScore(entropy: number): StrengthScore;

/**
 * Maps a StrengthScore to its display metadata.
 */
function scoreToMeta(score: StrengthScore): {
  level: StrengthLevel;
  color: string;
  barWidth: string;
};
```

---

### Module: `ClipboardManager`

**Location:** `src/clipboard.ts`

```typescript
/**
 * Copies text to the clipboard using the modern Clipboard API.
 * Only available in secure contexts (HTTPS).
 *
 * @returns Promise<true> on success, Promise<false> on failure.
 */
async function copyModern(text: string): Promise<boolean>;

/**
 * Copies text to the clipboard using the legacy execCommand fallback.
 * Creates a temporary off-screen <textarea>, selects it, and issues the command.
 *
 * @returns true on success, false on failure.
 */
function copyLegacyFallback(text: string): boolean;

/**
 * Attempts copyModern first; falls back to copyLegacyFallback.
 *
 * @returns Promise<'modern' | 'fallback' | 'failed'>
 */
async function copyToClipboard(
  text: string,
): Promise<'modern' | 'fallback' | 'failed'>;
```

---

### Module: `StateManager`

**Location:** `src/state.ts`

```typescript
/**
 * Creates and returns the initial application state.
 */
function createInitialState(): AppState;

/**
 * Updates appState.length. Clamps to [8, 128].
 * Triggers UI refresh for LengthControl and StrengthIndicator.
 */
function setLength(state: AppState, value: number): void;

/**
 * Adds a character set key to appState.enabledSets if not already present.
 * Triggers UI refresh for GenerateButton and StrengthIndicator.
 */
function enableSet(state: AppState, key: CharSetKey): void;

/**
 * Removes a character set key from appState.enabledSets.
 * No-op (Last Active Guard) if only one set currently enabled.
 * Returns false if guard fired, true if set was removed.
 */
function disableSet(state: AppState, key: CharSetKey): boolean;

/**
 * Sets the current password after generation.
 * Triggers UI refresh for PasswordDisplay, StrengthIndicator, CopyButton.
 */
function setCurrentPassword(state: AppState, password: string): void;
```

---

### UI Render Functions

**Location:** `src/ui/render.ts`

```typescript
/**
 * Renders the generated password into the PasswordDisplay component.
 * Resets scroll position to start.
 */
function renderPasswordDisplay(password: string | null): void;

/**
 * Updates the StrengthIndicator bar width, color, label text, and ARIA label.
 */
function renderStrengthIndicator(result: StrengthResult): void;

/**
 * Sets the GenerateButton to enabled or disabled state (including aria-disabled).
 */
function renderGenerateButton(enabled: boolean): void;

/**
 * Shows or hides the "Copied!" confirmation on the CopyButton.
 */
function renderCopyButton(confirming: boolean): void;

/**
 * Displays an inline error message below a target element.
 * Auto-dismisses after `durationMs` milliseconds (0 = persistent).
 */
function showInlineError(
  targetEl: HTMLElement,
  code: ErrorCode,
  message: string,
  durationMs: number,
): void;
```

---

## 6. Security Architecture

### Cryptographic Randomness

All password generation uses `window.crypto.getRandomValues()` — the browser's implementation of a cryptographically secure pseudo-random number generator (CSPRNG). `Math.random()` is explicitly **forbidden** at the code level and must be flagged by linter rules.

**Rejection sampling** is used when mapping random bytes to character indices to eliminate modulo bias: if a random value falls outside the largest multiple of the pool size that fits in a `Uint32`, it is discarded and a new value is drawn.

```typescript
// Safe random index — no modulo bias
function unbiasedRandomIndex(poolSize: number): number {
  const limit = Math.floor(0xFFFFFFFF / poolSize) * poolSize;
  let value: number;
  do {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % poolSize;
}
```

### Data Privacy

| Principle | Implementation |
|-----------|---------------|
| No data transmission | Zero network requests after initial page load. All logic is local. |
| No persistence | Passwords are held only in `appState.currentPassword` (runtime memory). On page close or refresh, all state is lost. |
| No analytics | No tracking scripts, no beacons, no event logging by default. |
| Clipboard isolation | The clipboard write is a one-way push; the application never reads clipboard contents. |

### Secure Context (HTTPS)

The application **must** be served over HTTPS in production. This is required for:
- `navigator.clipboard.writeText()` availability.
- Protecting the page from man-in-the-middle content injection.

Local development over `http://localhost` is an accepted exception; the `execCommand` fallback handles clipboard access in that context.

### Content Security Policy (Recommended)

A strict CSP header should be configured at the hosting layer to prevent XSS:

```
Content-Security-Policy:
  default-src 'none';
  script-src  'self';
  style-src   'self';
  font-src    'self';
  img-src     'self' data:;
  connect-src 'none';
  frame-src   'none';
```

If inline styles are needed for dynamic strength bar colors, either use `'unsafe-inline'` for `style-src` (acceptable given no backend) or set colors via CSS custom properties from JavaScript.

### Input Validation

All user inputs are validated before being used in any logic:

| Input | Validation | Handling |
|-------|------------|---------|
| Length slider | Browser-native `min`/`max` attributes; JS clamp on blur | Clamped silently |
| Length numeric input | Parsed as integer; non-numeric rejected | Reverts to previous value on blur |
| Character set toggles | Enum check against `CharSetKey`; Last Active Guard | Snapped back if invalid |

No user input is used in HTML construction (no `innerHTML` with user data), eliminating any XSS vector from input.

### Linter Rules

The following ESLint rules must be enforced:

```json
{
  "no-restricted-globals": [
    "error",
    { "name": "Math", "message": "Use crypto.getRandomValues() for randomness, not Math.random()." }
  ],
  "no-restricted-syntax": [
    "error",
    {
      "selector": "CallExpression[callee.object.name='Math'][callee.property.name='random']",
      "message": "Math.random() is forbidden. Use crypto.getRandomValues()."
    }
  ]
}
```

---

## 7. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| Markup | HTML5 | — | Document structure, semantic elements, ARIA attributes |
| Styling | CSS3 | — | Layout (Flexbox/Grid), responsive design, strength bar animations |
| Logic | Vanilla JavaScript | ES2020+ | Core app logic, event handling, DOM manipulation |
| Type Safety | TypeScript | 5.x (optional) | Interface definitions, type checking during development |
| Crypto | Web Crypto API | Browser-native | Cryptographically secure random number generation |
| Clipboard | Clipboard API | Browser-native | Modern clipboard write |
| Clipboard fallback | `document.execCommand` | Browser-native | Legacy clipboard support |
| Build (optional) | Vite | 5.x | Dev server, TypeScript compilation, tree-shaking, bundling |
| Linting | ESLint | 9.x | Enforce no-`Math.random()` rule, code quality |
| Formatting | Prettier | 3.x | Consistent code style |
| Testing | Vitest | 1.x | Unit tests for generation engine and strength calculator |
| Hosting | Static host | — | GitHub Pages / Netlify / Vercel (any CDN with HTTPS) |

### Rationale for Vanilla JS

A framework (React, Vue, Svelte) would add unnecessary bundle weight and complexity for a single-page tool with minimal state. Vanilla ES6+ modules provide all required capabilities — event listeners, DOM updates, module imports — at zero runtime cost. TypeScript is recommended for development-time type safety but compiles away entirely, leaving pure JavaScript in production.

---

## 8. Integration Points

### Browser API Integrations

#### Web Crypto API

| Property | Value |
|----------|-------|
| API | `window.crypto.getRandomValues(typedArray)` |
| Availability | All modern browsers; universal in the target browser matrix |
| Fallback | None — if unavailable, show `CRYPTO_UNAVAILABLE` error and block generation |
| Usage | Random byte generation for character selection and Fisher-Yates shuffle indices |

#### Clipboard API

| Property | Value |
|----------|-------|
| API | `navigator.clipboard.writeText(text)` |
| Availability | HTTPS contexts only; all target browsers |
| Fallback | `document.execCommand('copy')` via temporary `<textarea>` |
| Second fallback | Inline error prompting manual copy |
| Permission | No explicit permission prompt for `writeText` in most browsers |

### Third-Party Services

**None.** No third-party scripts, fonts (unless self-hosted), analytics platforms, CDN-delivered libraries, or external APIs of any kind. This is a deliberate privacy and performance choice.

### Hosting Integration

| Host | Method | Notes |
|------|--------|-------|
| GitHub Pages | Push `dist/` or root to `gh-pages` branch | Free, HTTPS automatic via custom domain or `*.github.io` |
| Netlify | Drag-and-drop `dist/` or connect Git repo | Free tier; automatic HTTPS; supports CSP headers in `netlify.toml` |
| Vercel | `vercel deploy` or Git integration | Free tier; automatic HTTPS; supports security headers in `vercel.json` |

CSP headers should be configured at the hosting layer (not in HTML `<meta>` tags) so they are sent as HTTP response headers and cannot be bypassed by injected content.

---

## 9. Architectural Decisions

### ADR-001: Zero-Backend Architecture

**Decision:** All logic runs client-side. No server, no database, no API.  
**Rationale:** Password generation is a stateless, pure function requiring only CSPRNG access, which all modern browsers provide natively. A backend would introduce latency, cost, infrastructure complexity, and — critically — a privacy risk (passwords would traverse a network to a server). Zero-backend eliminates all of these with no trade-off for this use case.  
**Consequences:** No server-side rate limiting, logging, or analytics. These are acceptable trade-offs given the privacy-first product requirement.

---

### ADR-002: Web Crypto API as the Sole Randomness Source

**Decision:** Use `crypto.getRandomValues()` exclusively. `Math.random()` is forbidden at the linter level.  
**Rationale:** `Math.random()` is not cryptographically secure. Its output is predictable given sufficient observation. Passwords generated with `Math.random()` could be brute-forced far more efficiently than their apparent entropy suggests. The Web Crypto API uses OS-level entropy sources (e.g., `/dev/urandom`) and is universally available in all target browsers.  
**Consequences:** A linter rule must enforce this. Code reviewers must verify any direct or indirect use of `Math.random()` before merging.

---

### ADR-003: Guaranteed Slot + Fisher-Yates Generation Algorithm

**Decision:** Pre-fill one guaranteed character from each enabled set, fill the remainder from the full pool, then shuffle with Fisher-Yates.  
**Rationale:** A naive approach (draw N chars from the pool, uniformly at random) has a non-trivial probability of excluding one or more enabled character sets entirely, especially at short lengths. The guaranteed-slot approach ensures each enabled set is represented while the subsequent shuffle removes positional bias.  
**Consequences:** The minimum password length is constrained by the number of enabled sets. This is handled by auto-adjusting length when needed (reported to the user).

---

### ADR-004: Vanilla JavaScript Over a Framework

**Decision:** Use HTML/CSS/Vanilla JS (ES2020+ modules). Vite is optional if TypeScript compilation is desired.  
**Rationale:** The application has a small, well-defined set of UI components and minimal state transitions. Adding React, Vue, or Svelte would increase the bundle size, build complexity, and maintenance surface area without providing meaningful benefit for this scope. ES6 modules provide sufficient code organisation.  
**Consequences:** No virtual DOM diffing — all DOM updates are manual and imperative. This is acceptable given the small number of dynamic elements.

---

### ADR-005: appState as a Single Mutable Object

**Decision:** All runtime state lives in a single `appState` object, updated imperatively by event handlers.  
**Rationale:** Without a reactive framework, a single canonical state object is simpler to reason about and debug than dispersed component-level state. It also makes state transitions explicit and auditable in a single location.  
**Consequences:** No automatic UI reactivity — every state mutation must be followed by an explicit DOM update call. This is enforced by convention; helper functions in `StateManager` encapsulate both the mutation and the DOM update.

---

*Document generated by Pivota Spec TechArch Generator — 2026-05-04*
