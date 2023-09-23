import vue from '@vitejs/plugin-vue'
import path from 'path'
import { defineConfig } from 'vite'
import svgLoader from 'vite-svg-loader'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  build: {
    commonjsOptions: {
      include: ['tailwind.config.js']
    }
  },
  plugins: [vue(), svgLoader()],
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src/', import.meta.url)),
      '@Assets': fileURLToPath(new URL('./src/assets/', import.meta.url)),
      '@Stories': fileURLToPath(new URL('./src/stories/', import.meta.url)),
      '@TailwindConfig': fileURLToPath(new URL('./tailwind.config.js', import.meta.url))
    }
  }
})
