import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // На GitHub Pages сайт відкривається з підпапки /<назва-репо>/ — префікс задає workflow.
  base: process.env.BASE_PATH || '/',
});
