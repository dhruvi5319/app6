# Plan 03-01: Copy to Clipboard

**Phase:** 3 — Copy to Clipboard
**Plan:** 03-01 of 01
**Goal:** Add a Copy button that writes the generated password to the system clipboard with a 2-second "Copied!" confirmation and execCommand fallback
**Requirements covered:** COPY-01, COPY-02, COPY-03
**Status:** Complete ✅
**Completed:** 2026-05-11
**Depends on:** Phase 1 (generation engine), Phase 2 (config controls)

---

## What Was Built

A Copy button sits in the action bar next to "Generate Password". Clicking it writes `appState.currentPassword` to the system clipboard using the async Clipboard API, falling back to `document.execCommand('copy')` when unavailable. The button label changes to "Copied!" (green) for 2 seconds then reverts to "Copy". Clicking before a password is generated is a silent no-op.

### Files Created / Modified

| File | Change | Notes |
|------|--------|-------|
| `src/clipboard.js` | Created | Clipboard module — `copyToClipboard` + `initCopyButton` |
| `index.html` | Modified | Copy button added to `.action-bar`; clipboard module script wired |
| `style.css` | Modified | `.btn-secondary` and `.btn--copied` styles appended |

### Exports from `src/clipboard.js`

```js
export async function copyToClipboard(text)  // Clipboard API → execCommand fallback
export function initCopyButton()              // Wires #copy-btn click handler
```

### Key Implementation Details

- **Primary path**: `navigator.clipboard.writeText(text)` — async, requires HTTPS or localhost
- **Fallback path**: Creates a temporary `<textarea>`, selects it, calls `document.execCommand('copy')`, then removes it
- **Confirmation**: `showCopiedState(btn)` sets `btn.textContent = 'Copied!'`, adds `.btn--copied` class, schedules 2000ms revert via `copiedTimer`
- **Timer guard**: `copiedTimer` is cleared and reset on each click — prevents stacking on rapid clicks
- **No-op guard**: If `appState.currentPassword` is null/falsy, click handler returns early
- **appState**: Imported from `./app.js` — not re-declared

### Test Results

```
✓ src/config/guards.test.js   (10 tests)
✓ src/engine/generator.test.js (13 tests)

Test Files  2 passed (2)
     Tests  23 passed (23)
```

No new unit tests added (clipboard module depends on DOM/browser APIs; covered by manual verification).

---

## Phase 3 Success Criteria — All Met

| # | Criterion | Status |
|---|-----------|--------|
| 1 | User clicks Copy and password written to clipboard | ✅ COPY-01 |
| 2 | Button shows "Copied!" for 2s then reverts to "Copy" | ✅ COPY-02 |
| 3 | execCommand fallback for Clipboard API unavailability | ✅ COPY-03 |

---

## Project Complete

All 3 phases delivered. The password generator app is fully functional:

```
Phase 1: Core Generation Loop    [████████████]  DONE (3/3 plans)
Phase 2: Configuration Controls  [████████████]  DONE (3/3 plans)
Phase 3: Copy to Clipboard       [████████████]  DONE (1/1 plans)
```

**Full user workflow:**
1. App loads → strength bar visible, display shows placeholder
2. User adjusts length (slider or numeric input, 8–128, default 16)
3. User toggles character sets (Uppercase/Lowercase/Numbers/Symbols, Last Active Guard prevents all-off)
4. User clicks "Generate Password" → cryptographically random password appears
5. User clicks "Copy" → password on clipboard → "Copied!" confirms → reverts after 2s
