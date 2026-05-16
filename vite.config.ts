import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk — stable libs, long-cached by CDN
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // State management chunk
          state: ['@reduxjs/toolkit', 'react-redux', '@tanstack/react-query'],
          // Charts are large (~400KB) — split so non-chart pages skip it
          charts: ['recharts'],
        },
      },
    },
  },
})
