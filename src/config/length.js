// src/config/length.js — Length control: slider + numeric input, bidirectional sync
import { appState, triggerGenerate } from '../app.js';

const MIN = 8;
const MAX = 128;

/**
 * Clamps a value to [MIN, MAX].
 * @param {number} value
 * @returns {number}
 */
function clamp(value) {
  return Math.min(MAX, Math.max(MIN, value));
}

/**
 * Initialises the length slider and numeric input controls.
 * Must be called after DOMContentLoaded (elements must exist).
 */
export function initLengthControl() {
  const slider = document.getElementById('length-slider');
  const numInput = document.getElementById('length-number');

  if (!slider || !numInput) return; // guard against missing elements

  // Set initial values from appState
  slider.value = appState.length;
  numInput.value = appState.length;

  // Slider → numeric input (live, on every drag step)
  slider.addEventListener('input', () => {
    const value = Number(slider.value);
    appState.length = value;
    numInput.value = value;
    triggerGenerate();
  });

  // Numeric input → slider (live, on every keystroke)
  numInput.addEventListener('input', () => {
    const raw = Number(numInput.value);
    // Allow partial typing (e.g. user is deleting to retype): only sync if valid number
    if (!isNaN(raw) && numInput.value !== '') {
      const value = clamp(raw);
      appState.length = value;
      slider.value = value;
      triggerGenerate();
    }
  });

  // Numeric input → clamp on blur (handles out-of-range final values)
  numInput.addEventListener('blur', () => {
    const raw = Number(numInput.value);
    const clamped = clamp(isNaN(raw) ? MIN : raw);
    if (clamped !== appState.length || String(clamped) !== numInput.value) {
      appState.length = clamped;
      slider.value = clamped;
      numInput.value = clamped;
      triggerGenerate();
    }
  });
}
