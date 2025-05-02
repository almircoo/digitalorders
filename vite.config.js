import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
    '@': path.resolve(__dirname, './src'),
    },
  },
  // api server
  server: {
    proxy: {
      '/auth': {
        target: 'https://digitalorderapi.up.railway.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/auth/, '')
      }
    }
  },
})
