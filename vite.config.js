import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: { main: 'index.html', recipeBootstrap: 'src/recipe-bootstrap.js' },
    },
  },
  server: {
    watch: {
      usePolling: true,
      interval: 100,
    }
  }
})