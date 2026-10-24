import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config';

// Ícones do app gerados a partir de public/logo.svg (pnpm exec pwa-assets-generator).
export default defineConfig({
  headLinkOptions: { preset: '2023' },
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#15803d' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#15803d' } },
  },
  images: ['public/logo.svg'],
});
