/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // En GitHub Pages el sitio vive bajo /<repo>/; el workflow define VITE_BASE.
  base: process.env.VITE_BASE ?? '/',
  plugins: [react()],
  // Puertos propios (no los 5173/4173 por defecto) para no pisarse con otros proyectos.
  // strictPort: si estan ocupados falla en vez de saltar a otro puerto sin avisar.
  server: { port: 5733, strictPort: true },
  preview: { port: 4733, strictPort: true },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
    include: [
      'src/**/*.test.{ts,tsx}',
      'tests/unit/**/*.test.{ts,tsx}',
      'tests/content/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      include: ['src/domain/**/*.ts'],
      exclude: ['src/domain/**/*.test.ts', 'src/domain/testing/**', 'src/domain/types.ts'],
      thresholds: { lines: 90, functions: 90, branches: 90, statements: 90 },
    },
  },
});
