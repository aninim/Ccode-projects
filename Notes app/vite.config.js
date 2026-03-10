import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base: './' is required so Electron can load built assets via file:// protocol
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  optimizeDeps: {
    include: ['gray-matter']
  }
})
