import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],

  resolve: {
    alias: {
    '@': path.resolve(__dirname, './src'),
    },
  },
  // api server
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:800',
  //       changeOrigin: true,
  //       secure: false,
  //       // rewrite: (path) => path.replace(/^\/api/, '')
  //     }
  //   }
  // },
})


// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"),
//     },
//   },
// })
