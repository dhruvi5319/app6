import { defineConfig } from 'vitest/config';
import { webcrypto } from 'node:crypto';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
  },
});
