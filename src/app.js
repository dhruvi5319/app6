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
