// src/config/guards.test.js — Unit tests for Last Active Guard
import { describe, it, expect } from 'vitest';
import { isLastActive } from './guards.js';

describe('isLastActive(setKey, enabledSets)', () => {
  // Case 1: single set matching the key → true
  it('returns true when setKey is the only element in enabledSets', () => {
    expect(isLastActive('uppercase', ['uppercase'])).toBe(true);
  });

  // Additional true cases for each set key
  it('returns true for lowercase when it is the only active set', () => {
    expect(isLastActive('lowercase', ['lowercase'])).toBe(true);
  });

  it('returns true for numbers when it is the only active set', () => {
    expect(isLastActive('numbers', ['numbers'])).toBe(true);
  });

  it('returns true for symbols when it is the only active set', () => {
    expect(isLastActive('symbols', ['symbols'])).toBe(true);
  });

  // Case 2: two sets — key is first → false
  it('returns false when two sets are active even if key is present', () => {
    expect(isLastActive('uppercase', ['uppercase', 'lowercase'])).toBe(false);
  });

  // Case 3: two sets — key is NOT among them → false
  it('returns false when key is not the one active set', () => {
    expect(isLastActive('uppercase', ['lowercase'])).toBe(false);
  });

  // Case 4: three+ sets → false
  it('returns false when three or more sets are active', () => {
    expect(isLastActive('uppercase', ['uppercase', 'numbers', 'symbols'])).toBe(false);
  });

  // Case 5: empty array → false
  it('returns false for an empty enabledSets array', () => {
    expect(isLastActive('uppercase', [])).toBe(false);
  });

  // Case 6: all four sets active → false
  it('returns false when all four character sets are active', () => {
    expect(isLastActive('uppercase', ['uppercase', 'lowercase', 'numbers', 'symbols'])).toBe(false);
  });

  // Mutation guard: enabledSets must not be mutated
  it('does not mutate the enabledSets array', () => {
    const sets = ['uppercase'];
    const original = [...sets];
    isLastActive('uppercase', sets);
    expect(sets).toEqual(original);
  });
});
