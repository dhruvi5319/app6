// vitest.setup.js — polyfill Web Crypto API for Node.js test environment
import { webcrypto } from 'node:crypto';

// Expose Web Crypto API as a global, matching browser behavior
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = webcrypto;
}
