import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built site works on Vercel, Netlify,
  // GitHub Pages (project sub-path) or any static host.
  base: './',
  plugins: [vue()],
  css: {
    transformer: 'lightningcss'
  }
})
