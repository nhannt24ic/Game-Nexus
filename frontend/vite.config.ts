// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'; // <<< 1. Import 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // --- 2. Thêm khối resolve.alias ---
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})