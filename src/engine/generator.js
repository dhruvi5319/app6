// src/engine/generator.js — Password Generation Engine
// IMPORTANT: Math.random() is NEVER used. All randomness via crypto.getRandomValues().

/**
 * Character set registry.
 * Each entry defines the valid characters for that category.
 */
export const CHAR_SETS = {
  uppercase: { key: 'uppercase', characters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', size: 26 },
  lowercase: { key: 'lowercase', characters: 'abcdefghijklmnopqrstuvwxyz', size: 26 },
  numbers:   { key: 'numbers',   characters: '0123456789',                  size: 10 },
  symbols:   { key: 'symbols',   characters: '!@#$%^&*()-_=+[]{}|;:,.<>?', size: 28 },
};

/**
 * Builds the combined character pool from the enabled sets.
 * @param {string[]} enabledSets - Array of character set keys
 * @returns {string} Concatenated characters from all enabled sets
 */
export function buildPool(enabledSets) {
  return enabledSets.map(key => CHAR_SETS[key].characters).join('');
}

/**
 * Returns an unbiased random index in [0, poolSize) using rejection sampling.
 * Avoids modulo bias by rejecting values above the largest multiple of poolSize
 * that fits in a Uint32.
 * @param {number} poolSize
 * @returns {number}
 */
function unbiasedRandomIndex(poolSize) {
  const limit = Math.floor(0xFFFFFFFF / poolSize) * poolSize;
  const buf = new Uint32Array(1);
  // Use globalThis.crypto for Node.js/browser compatibility
  const cryptoAPI = (typeof globalThis !== 'undefined' && globalThis.crypto)
    || (typeof window !== 'undefined' && window.crypto);
  let value;
  do {
    cryptoAPI.getRandomValues(buf);
    value = buf[0];
  } while (value >= limit);
  return value % poolSize;
}

/**
 * Draws one random character from a string.
 * @param {string} pool
 * @returns {string}
 */
function randomChar(pool) {
  return pool[unbiasedRandomIndex(pool.length)];
}

/**
 * Fisher-Yates in-place shuffle using crypto.getRandomValues().
 * @param {any[]} arr
 */
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = unbiasedRandomIndex(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

/**
 * Generates a cryptographically random password.
 *
 * @param {{ length: number, enabledSets: string[] }} config
 * @returns {{ password: string, length: number, lengthAdjusted: boolean }}
 * @throws {'CRYPTO_UNAVAILABLE'} if Web Crypto API is not available
 * @throws {'NO_SETS_ENABLED'} if no character sets are enabled
 */
export function generate(config) {
  // 1. Validate crypto availability
  // Use globalThis.crypto for compatibility with both browser and Node.js environments
  const cryptoAPI = (typeof globalThis !== 'undefined' && globalThis.crypto)
    || (typeof window !== 'undefined' && window.crypto);
  if (!cryptoAPI || !cryptoAPI.getRandomValues) {
    throw new Error('CRYPTO_UNAVAILABLE');
  }
  // 2. Validate config
  if (!config.enabledSets || config.enabledSets.length === 0) {
    throw new Error('NO_SETS_ENABLED');
  }

  let length = config.length;
  let lengthAdjusted = false;

  // Auto-adjust length if it's less than the number of enabled sets
  // (we need at least one slot per guaranteed character)
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

  // 6. Shuffle to randomize guaranteed slot positions
  shuffle(slots);

  // 7. Return result
  return {
    password: slots.join(''),
    length: slots.length,
    lengthAdjusted,
  };
}
