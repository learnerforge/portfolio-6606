import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built site works on Vercel, Netlify,
  // GitHub Pages (project sub-path) or any static host.
  base: './',
  plugins: [vue()],
  build: {
    // three.js alone is ~520 kB (130 kB gzip) — silence the default
    // 500 kB warning; the 3D chunks are already lazy-loaded.
    chunkSizeWarningLimit: 700
  }
})
