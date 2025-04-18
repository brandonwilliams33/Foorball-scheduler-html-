// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    // 预打包 Firebase 模块，确保构建时能正确解析
    include: [
      'firebase/app',
      'firebase/firestore'
    ]
  }
})
