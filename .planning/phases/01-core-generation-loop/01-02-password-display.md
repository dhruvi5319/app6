# Plan 01-02: Password Display Component

**Phase:** 1 — Core Generation Loop
**Plan:** 01-02 of 03
**Goal:** Build the HTML shell (`index.html`), base CSS (`style.css`), and the password display component — a read-only monospace field with placeholder state
**Requirements covered:** DISP-01, DISP-02, DISP-03
**Status:** Complete ✅
**Completed:** 2026-05-10
**Depends on:** Plan 01-01 (generator.js must exist to wire up in Plan 01-03; display itself has no JS dependency — pure HTML/CSS)

---

## What Was Built

The complete HTML shell and CSS stylesheet for the app. The password display is a read-only monospace `<input>` with placeholder state. The strength bar, action bar, and module `<script>` tag are all present in the static HTML. The full `src/app.js` (not merely a stub) was implemented in Plan 01-03.

### Files Created

| File | Lines | Notes |
|------|-------|-------|
| `index.html` | 59 | Full HTML structure, ARIA attributes, module script tag |
| `style.css` | 156 | Dark theme, monospace display, strength bar, responsive |

---

## Context

This plan produced the visible app skeleton. At the end of this plan (before Plan 01-03), the page renders correctly in a browser — placeholder text is visible — but is not yet interactive. The `src/app.js` module is referenced by the `<script>` tag but its event wiring is completed in Plan 01-03.

The display component uses `<input type="text" readonly>` (not a `<div>`) for native horizontal scroll, keyboard focusability, and text-selection support.

---

## Implementation Details

### `index.html` — Full Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Generator</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
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
</body>
</html>
```

### `style.css` — Key Sections

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
.password-display::placeholder {
  color: #718096;
  font-style: italic;
  font-family: system-ui, sans-serif;
  letter-spacing: normal;
}
```

**Strength bar:**
```css
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
```

---

## ARIA Attributes

| Element | Attribute | Value | Purpose |
|---------|-----------|-------|---------|
| `<section>` wrapping input | `aria-label` | `"Generated password"` | Landmark label |
| `#password-display` | `aria-label` | `"Generated password"` | Input accessible name |
| `#password-display` | `aria-live` | `"polite"` | Screen reader announces updates |
| `#password-display` | `readonly` | (present) | Prevents user editing |
| `.strength-bar-container` | `role` | `"meter"` | ARIA meter role |
| `.strength-bar-container` | `aria-valuemin` | `"1"` | Minimum score |
| `.strength-bar-container` | `aria-valuemax` | `"4"` | Maximum score |
| `.strength-bar-container` | `aria-valuenow` | `"1"` (initial) | Current score (updated by app.js) |
| `#generate-btn` | `aria-label` | `"Generate password"` | Button accessible name |
| `#generate-btn` | `type` | `"button"` | Prevents accidental form submit |

**Note on error element:** The `<p id="generate-error">` element with `role="alert"` and `aria-live="assertive"` is **not** in the static HTML. It is dynamically injected by `getOrCreateErrorEl()` in `app.js` and inserted immediately after `#generate-btn`. This is a divergence from a static-HTML approach but is the correct pattern for alerts that appear conditionally.

---

## Strength Bar in Phase 1

The strength bar HTML structure is present in `index.html` with `style="width: 0%"` as the initial state. Unlike what the original plan described as "a Phase 2 placeholder," the strength bar is **fully wired and functional in Phase 1** via `renderStrengthIndicator()` in `src/app.js` (Plan 01-03). At Phase 1 defaults (length 16, all 4 sets, pool=90), entropy ≈ 103.9 bits → "Very Strong" displayed immediately on load.

---

## Divergences from Original Plan

| Item | Original Plan Said | What Was Actually Built |
|------|--------------------|------------------------|
| `src/app.js` stub | Plan 01-02 creates a minimal stub; Plan 01-03 replaces it | Structurally correct — final `app.js` was written in Plan 01-03 |
| `renderPasswordDisplay` — scroll behavior | Used `setSelectionRange(0, 0)` and `scrollLeft = 0` | Final implementation uses `scrollLeft = 0` only — simpler and equivalent |
| Strength bar | "placeholder for Phase 2" (comment in HTML) | Fully functional in Phase 1; `renderStrengthIndicator()` wired in Plan 01-03 |
| Error element | Not in original plan's HTML structure | Dynamically injected by `getOrCreateErrorEl()` in app.js — correct ARIA pattern |

---

## File Checklist

- [x] `index.html` created with full structure (59 lines)
- [x] `style.css` created with all style blocks (156 lines)
- [x] `<input id="password-display" readonly>` with placeholder text present
- [x] `<button id="generate-btn" type="button">` present in action bar
- [x] Strength bar container with `role="meter"` ARIA attributes present
- [x] `<script type="module" src="src/app.js">` at bottom of `<body>`

---

## Acceptance Criteria — Verified

- [x] `index.html` opens in browser without JS errors when served with `python3 -m http.server 8000`
- [x] Placeholder text "Click Generate to create a password" is visible before first generation
- [x] Display field is read-only — typing in it has no effect
- [x] Display field uses monospace font (`'Courier New', Consolas, monospace`)
- [x] Display field supports horizontal scroll for long passwords (`overflow-x: auto`, `white-space: nowrap`)
- [x] Tab navigation reaches the generate button and display field
- [x] Responsive layout fits 320px+ viewport without page-level horizontal scroll
- [x] Dark theme applied: body `#1a202c`, app card `#2d3748`, display text `#68d391`
- [x] Strength bar animates on width/color change (`transition: width 0.3s, background-color 0.3s`)

---

## Notes / Decisions

- `<input type="text" readonly>` was used rather than `<div contenteditable="false">` — provides native horizontal scroll, keyboard focusability, and text selection without extra CSS hacks.
- No `autocorrect`/`autocapitalize` attributes needed because the field is `readonly`.
- The strength bar is scaffolded in HTML so Plan 01-03 can populate it without any HTML changes.
- Config panel (length slider + character set toggles) is intentionally absent — added in Phase 2.
- Comment placeholders in HTML (`<!-- Config Panel ... -->`, `<!-- Copy button ... -->`) serve as handoff markers for Phase 2 and Phase 3.
