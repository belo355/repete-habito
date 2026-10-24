/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    port: 4173,
    strictPort: true,
  },
  test: {
    coverage: {
      // istanbul (não v8): o projeto browser roda também no WebKit, onde o v8 não funciona.
      provider: 'istanbul',
      include: ['src/domain/**/*.ts'],
      exclude: ['src/domain/**/*.test.ts', 'src/**/__boundary_probe__/**'],
      reporter: ['text', 'json-summary', 'html'],
      // Gate da tech-spec §4: regras de negócio com cobertura ≥ 90%.
      thresholds: {
        'src/domain/**': {
          lines: 90,
          functions: 90,
          branches: 90,
          statements: 90,
        },
      },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
          exclude: ['**/*.browser.test.tsx', '**/node_modules/**'],
        },
      },
      // Componentes de UI em navegador real: layout, contraste (axe) e teclado de verdade.
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['src/**/*.browser.test.tsx'],
          setupFiles: ['src/ui/test/browser-setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            screenshotFailures: false,
            instances: [
              { browser: 'chromium', viewport: { width: 320, height: 640 } },
              { browser: 'webkit', viewport: { width: 320, height: 640 } },
            ],
          },
        },
      },
    ],
  },
});
