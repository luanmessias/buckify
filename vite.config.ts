import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@/components': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
