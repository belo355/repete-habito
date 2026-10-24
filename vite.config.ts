/// <reference types="vitest/config" />
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import ptBR from './src/i18n/pt-BR.json' with { type: 'json' };

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // PWA (tech-spec §2.2): generateSW com precache do app shell. `prompt`: a nova versão só
    // assume com o aceite do usuário (aviso em T01.7). Textos do manifest vêm do i18n.
    VitePWA({
      strategies: 'generateSW',
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png', 'logo.svg'],
      manifest: {
        id: '/',
        name: ptBR.app.name,
        short_name: ptBR.app.shortName,
        description: ptBR.app.description,
        lang: 'pt-BR',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,webmanifest}'],
        // Qualquer rota da SPA abre offline com o app shell.
        navigateFallback: '/index.html',
        cleanupOutdatedCaches: true,
        // Na 1ª instalação o SW já controla a página (offline sem precisar recarregar).
        // Sem skipWaiting: uma versão nova continua esperando o aceite do usuário.
        clientsClaim: true,
      },
    }),
  ],
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
