# Plan 01-02: Password Display Component

**Phase:** 1 — Core Generation Loop  
**Plan:** 01-02 of 03  
**Goal:** Build the HTML shell (`index.html`), base CSS (`style.css`), and the password display component — a read-only monospace field with placeholder state  
**Requirements covered:** DISP-01, DISP-02, DISP-03  
**Status:** Pending  
**Depends on:** Plan 01-01 (generator.js must exist to wire up in Plan 01-03, but display component itself has no JS dependency — pure HTML/CSS + minimal render function)

---

## Context

This plan produces the visible app skeleton and the `PasswordDisplay` component. At the end of this plan, the page renders correctly in a browser (with placeholder text visible) but is not yet interactive — the Generate button wiring is done in Plan 01-03.

The display component is a read-only `<input type="text">` (chosen over `<div>` for native keyboard focusability and text selection support). It uses a monospace font, shows a placeholder before first generation, and scrolls horizontally for long passwords.

---

## Tasks

### Task 1: Create `index.html`

Create the document shell with:
- `<!DOCTYPE html>` + `<html lang="en">`
- `<meta charset="UTF-8">` and `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
- `<title>Password Generator</title>`
- Link to `style.css`
- App root `<div id="app">`

**Full component structure to include in `<div id="app">`:**

```html
<div id="app">
  <header>
    <h1>Password Generator</h1>
  </header>

  <main>
    <!-- Password Display (F3) -->
    <section class="display-section" aria-label="Generated password">
      <input
        type="text"
        id="password-display"
        class="password-display"
        readonly
        placeholder="Click Generate to create a password"
        aria-label="Generated password"
        aria-live="polite"
        autocomplete="off"
        spellcheck="false"
      />
    </section>

    <!-- Action Bar (F6, F4) — wired in Plan 01-03 -->
    <section class="action-bar">
      <button
        id="generate-btn"
        class="btn btn-primary"
        aria-label="Generate password"
        type="button"
      >
        Generate Password
      </button>
      <!-- Copy button added in Phase 3 -->
    </section>

    <!-- Config Panel (F1, F2) — added in Phase 2 -->

    <!-- Strength Indicator (F5) — placeholder for Phase 2 -->
    <section class="strength-section" aria-label="Password strength">
      <div class="strength-bar-container" role="meter" aria-valuemin="1" aria-valuemax="4" aria-valuenow="1" aria-label="Password strength: Weak">
        <div id="strength-bar" class="strength-bar" style="width: 0%;"></div>
      </div>
      <span id="strength-label" class="strength-label"></span>
    </section>
  </main>
</div>

<!-- Module entry point — wired in Plan 01-03 -->
<script type="module" src="src/app.js"></script>
```

### Task 2: Create `style.css`

Write base CSS covering:

**Reset / base:**
```css
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, sans-serif;
  background: #1a202c;
  color: #e2e8f0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}
```

**App container:**
```css
#app {
  background: #2d3748;
  border-radius: 12px;
  padding: 2rem;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
}
h1 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: #f7fafc;
}
```

**Password display field:**
```css
.password-display {
  width: 100%;
  font-family: 'Courier New', Consolas, monospace;
  font-size: 1rem;
  background: #1a202c;
  color: #68d391;
  border: 2px solid #4a5568;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  overflow-x: auto;
  white-space: nowrap;
  cursor: default;
  outline: none;
  letter-spacing: 0.05em;
}
.password-display:focus {
  border-color: #63b3ed;
  box-shadow: 0 0 0 3px rgba(99, 179, 237, 0.3);
}
.password-display::placeholder {
  color: #718096;
  font-style: italic;
  font-family: system-ui, sans-serif;
  letter-spacing: normal;
}
```

**Action bar:**
```css
.action-bar {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}
.btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}
.btn:active { transform: scale(0.98); }
.btn:focus-visible {
  outline: 2px solid #63b3ed;
  outline-offset: 2px;
}
.btn-primary {
  background: #4299e1;
  color: #fff;
}
.btn-primary:hover { background: #3182ce; }
.btn-primary:disabled {
  background: #4a5568;
  color: #718096;
  cursor: not-allowed;
  transform: none;
}
```

**Strength bar:**
```css
.strength-section { margin-top: 1rem; }
.strength-bar-container {
  height: 6px;
  background: #4a5568;
  border-radius: 3px;
  overflow: hidden;
}
.strength-bar {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s, background-color 0.3s;
}
.strength-label {
  display: block;
  font-size: 0.75rem;
  color: #a0aec0;
  margin-top: 0.25rem;
  text-align: right;
}
```

**Display section spacing:**
```css
.display-section { margin-bottom: 0; }
```

### Task 3: Create `src/app.js` stub

Create a minimal `src/app.js` that will be expanded in Plan 01-03:

```js
// src/app.js — Phase 1 entry point
// Wires up the Generate button and password display.
// Imports generation engine from ./engine/generator.js

import { generate } from './engine/generator.js';

// App state (Phase 1 subset — full state expanded in Phase 2)
const appState = {
  length: 16,
  enabledSets: ['uppercase', 'lowercase', 'numbers', 'symbols'],
  currentPassword: null,
};

// DOM references
const passwordDisplay = document.getElementById('password-display');
const generateBtn = document.getElementById('generate-btn');

// Render functions
export function renderPasswordDisplay(password) {
  if (!password) {
    passwordDisplay.value = '';
    passwordDisplay.placeholder = 'Click Generate to create a password';
  } else {
    passwordDisplay.value = password;
    passwordDisplay.setSelectionRange(0, 0); // scroll to start
    passwordDisplay.scrollLeft = 0;
  }
}

// Initial render
renderPasswordDisplay(appState.currentPassword);

// Event wiring is added in Plan 01-03
```

> **Note:** `src/app.js` is intentionally incomplete at the end of this plan. Plan 01-03 adds the generate button event handler. The file is created here so the `<script>` tag in `index.html` resolves without errors during Plan 01-02 browser testing.

### Task 4: Verify display component in browser

Open `index.html` in a browser (or `python3 -m http.server 8000`). Confirm:
- Page renders without console errors
- Placeholder text "Click Generate to create a password" is visible in the input field
- Page background is dark; display field is monospace with dark styling
- Pressing Tab reaches the input field (focusable)

---

## File Checklist

- [ ] `index.html` created with full structure
- [ ] `style.css` created with all style blocks
- [ ] `src/app.js` stub created (import + DOM refs + `renderPasswordDisplay`)
- [ ] `src/engine/` directory exists (from Plan 01-01)

---

## Acceptance Criteria

- [ ] `index.html` opens in browser without JS errors (module resolution may show 404 for generator.js if Plan 01-01 not done, but no syntax errors)
- [ ] Placeholder text "Click Generate to create a password" is visible
- [ ] Display field is read-only (typing in it has no effect)
- [ ] Display field uses monospace font
- [ ] Display field does not truncate long strings — horizontal scroll visible when value is set programmatically to a 128-char string
- [ ] Tab navigation reaches the generate button and the display field
- [ ] Responsive layout fits on 320px viewport without horizontal scrollbar on the page body

---

## Notes / Decisions

- Using `<input type="text" readonly>` rather than a `<div contenteditable="false">` because native text inputs provide built-in horizontal scroll, keyboard focusability, and text selection without extra CSS hacks.
- No `autocorrect`/`autocapitalize` attributes needed since the field is `readonly`.
- The strength bar is scaffolded here with `width: 0%` so Phase 2 can populate it without changing HTML structure.
- Config panel (length slider + character set toggles) is **not** included in this plan — it will be added in Phase 2 plans.
