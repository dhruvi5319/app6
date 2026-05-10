// src/engine/generator.test.js — Unit tests for the password generation engine
import { describe, it, expect, vi } from 'vitest';
import { generate, buildPool, CHAR_SETS } from './generator.js';

const ALL_SETS = ['uppercase', 'lowercase', 'numbers', 'symbols'];

describe('generate()', () => {
  it('returns a password of exact requested length', () => {
    const result = generate({ length: 16, enabledSets: ALL_SETS });
    expect(result.password.length).toBe(16);
    expect(result.length).toBe(16);
    expect(result.lengthAdjusted).toBe(false);
  });

  it('returns a password of exact requested length for single set', () => {
    const result = generate({ length: 8, enabledSets: ['uppercase'] });
    expect(result.password.length).toBe(8);
  });

  it('all characters come from enabled sets', () => {
    const result = generate({ length: 32, enabledSets: ALL_SETS });
    const pool = buildPool(ALL_SETS);
    for (const char of result.password) {
      expect(pool).toContain(char);
    }
  });

  it('all characters come from single enabled set', () => {
    const result = generate({ length: 20, enabledSets: ['uppercase'] });
    const pool = CHAR_SETS.uppercase.characters;
    for (const char of result.password) {
      expect(pool).toContain(char);
    }
  });

  it('guarantees at least one character from each enabled set', () => {
    // Run many times to reduce probability of false pass
    for (let run = 0; run < 20; run++) {
      const result = generate({ length: 16, enabledSets: ALL_SETS });
      for (const key of ALL_SETS) {
        const chars = CHAR_SETS[key].characters;
        const hasOne = [...result.password].some(c => chars.includes(c));
        expect(hasOne).toBe(true);
      }
    }
  });

  it('sets lengthAdjusted=true when length < number of enabled sets', () => {
    const result = generate({ length: 1, enabledSets: ['uppercase', 'lowercase'] });
    expect(result.lengthAdjusted).toBe(true);
    expect(result.length).toBe(2); // auto-adjusted to number of sets
  });

  it('throws CRYPTO_UNAVAILABLE if crypto.getRandomValues is absent', () => {
    const original = globalThis.crypto;
    // @ts-ignore
    delete globalThis.crypto;
    expect(() => generate({ length: 16, enabledSets: ALL_SETS })).toThrowError('CRYPTO_UNAVAILABLE');
    globalThis.crypto = original;
  });

  it('throws NO_SETS_ENABLED if enabledSets is empty', () => {
    expect(() => generate({ length: 16, enabledSets: [] })).toThrowError('NO_SETS_ENABLED');
  });

  it('throws NO_SETS_ENABLED if enabledSets is undefined', () => {
    // @ts-ignore
    expect(() => generate({ length: 16 })).toThrowError('NO_SETS_ENABLED');
  });

  it('generates 1000 passwords with near-zero collisions', () => {
    const seen = new Set();
    for (let i = 0; i < 1000; i++) {
      const { password } = generate({ length: 16, enabledSets: ALL_SETS });
      seen.add(password);
    }
    // Expect all 1000 to be unique (statistically, duplicates are astronomically unlikely)
    expect(seen.size).toBe(1000);
  });
});

describe('buildPool()', () => {
  it('concatenates characters from all enabled sets', () => {
    const pool = buildPool(['uppercase', 'numbers']);
    expect(pool).toBe(CHAR_SETS.uppercase.characters + CHAR_SETS.numbers.characters);
  });

  it('returns empty string for empty array', () => {
    expect(buildPool([])).toBe('');
  });
});

describe('unbiasedRandomIndex (via generate)', () => {
  it('stays in valid range — all chars from generate are within pool', () => {
    const result = generate({ length: 100, enabledSets: ['symbols'] });
    const pool = CHAR_SETS.symbols.characters;
    for (const char of result.password) {
      expect(pool.indexOf(char)).toBeGreaterThanOrEqual(0);
    }
  });
});
