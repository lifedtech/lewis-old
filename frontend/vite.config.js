import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/payment': 'http://127.0.0.1:8000',
      '/coupons': 'http://127.0.0.1:8000',
      '/assessment': 'http://127.0.0.1:8000',
      '/reports': 'http://127.0.0.1:8000',
      '/auth': 'http://127.0.0.1:8000',
      '/api': 'http://127.0.0.1:8000',
    },
    watch: {
      ignored: ['**/src/generated/**'],
    },
  },
})
