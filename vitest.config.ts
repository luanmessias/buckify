/// <reference types="vitest" />

import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [Vue()],
  resolve: {
    alias: {
      '@': '/src',
      '@Assets': '/src/assets',
      '@Stories': '/src/stories',
      '@Components': '/src/components',
      '@TailwindConfig': '/tailwind.config.js'
    }
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
})
