// src/config/guards.js — Pure guard functions for configuration UI

/**
 * Returns true if setKey is the ONLY active character set.
 * Used to prevent the user from disabling the last active set.
 *
 * @param {string} setKey - The character set key being toggled (e.g. 'uppercase')
 * @param {string[]} enabledSets - Current array of active set keys
 * @returns {boolean}
 */
export function isLastActive(setKey, enabledSets) {
  return enabledSets.length === 1 && enabledSets[0] === setKey;
}
