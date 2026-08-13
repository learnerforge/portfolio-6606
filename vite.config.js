import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the built site works on Vercel, Netlify,
  // GitHub Pages (project sub-path) or any static host.
  base: './',
  plugins: [
    react(),
    tailwindcss()
  ]
})
