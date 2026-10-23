import { defineConfig, devices } from '@playwright/test';

// Projetos de qa.md §3.2. O E2E roda contra o build de produção servido pelo `vite preview`.
const PORT = 4173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
    {
      name: 'webkit-mobile',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 320, height: 640 },
        isMobile: true,
        hasTouch: true,
      },
    },
    {
      name: 'chromium-android',
      use: { ...devices['Pixel 7'] },
    },
  ],
  webServer: {
    command: `pnpm build && pnpm preview --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
