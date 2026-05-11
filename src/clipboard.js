// src/clipboard.js — Copy to Clipboard with Clipboard API + execCommand fallback
import { appState } from './app.js';

let copiedTimer = null;

/**
 * Copies text to the system clipboard.
 * Tries navigator.clipboard first; falls back to document.execCommand('copy').
 * @param {string} text
 * @returns {Promise<boolean>} true if copy succeeded, false if it failed
 */
export async function copyToClipboard(text) {
  // Primary: Async Clipboard API (requires HTTPS or localhost)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      // Fall through to execCommand fallback
    }
  }

  // Fallback: execCommand (deprecated but widely supported)
  try {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    // Prevent scrolling to bottom of page in MS Edge
    textarea.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch (_) {
    return false;
  }
}

/**
 * Shows the "Copied!" confirmation state on the Copy button for 2 seconds.
 * @param {HTMLButtonElement} btn
 */
function showCopiedState(btn) {
  btn.textContent = 'Copied!';
  btn.classList.add('btn--copied');
  btn.setAttribute('aria-label', 'Password copied to clipboard');
  if (copiedTimer) clearTimeout(copiedTimer);
  copiedTimer = setTimeout(() => {
    btn.textContent = 'Copy';
    btn.classList.remove('btn--copied');
    btn.setAttribute('aria-label', 'Copy password to clipboard');
  }, 2000);
}

/**
 * Initialises the Copy button click handler.
 * Must be called after DOMContentLoaded (element must exist).
 */
export function initCopyButton() {
  const btn = document.getElementById('copy-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    // No-op if no password has been generated yet
    if (!appState.currentPassword) return;

    const ok = await copyToClipboard(appState.currentPassword);
    if (ok) {
      showCopiedState(btn);
    }
    // If copy failed silently, keep button as "Copy" (no error shown — edge case)
  });
}
