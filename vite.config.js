import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // El CI define VITE_BASE=/<repo>/ para publicar en GitHub Pages; en local queda '/'.
  base: process.env.VITE_BASE || '/',
  plugins: [react(), tailwindcss()],
})
