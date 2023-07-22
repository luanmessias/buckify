import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/views': path.resolve(__dirname, 'src/views'),
      '@/stores': path.resolve(__dirname, 'src/stores'),
      '@/assets': path.resolve(__dirname, 'src/assets'),
      '@/routes': path.resolve(__dirname, 'src/routes'),
      '@/utils': path.resolve(__dirname, 'src/utils'),
    }
  }
})
