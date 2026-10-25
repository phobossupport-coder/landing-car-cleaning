import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Повна адреса сайту для canonical і прев'ю посилань (там потрібні абсолютні URL).
// На GitHub Pages її передає workflow; після переїзду на свій домен — задати SITE_URL.
const SITE_URL = (process.env.SITE_URL || 'https://phobossupport-coder.github.io/landing-car-cleaning/').replace(/\/?$/, '/');

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'site-url',
      transformIndexHtml: { order: 'pre', handler: (html) => html.replaceAll('%SITE_URL%', SITE_URL) },
    },
  ],
  // На GitHub Pages сайт відкривається з підпапки /<назва-репо>/ — префікс задає workflow.
  base: process.env.BASE_PATH || '/',
  build: {
    rollupOptions: {
      output: {
        // Бібліотеки окремим файлом: вони рідко змінюються і лишаються в кеші браузера,
        // тож після оновлення текстів клієнт перекачує лише невеликий файл із кодом сайту.
        manualChunks: (id) => (id.includes('node_modules') ? 'vendor' : undefined),
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
