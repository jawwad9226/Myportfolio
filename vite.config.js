import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Important: base must match your repo name for GitHub Pages project sites
export default defineConfig({
  plugins: [react()],
  base: '/Myportfolio/',
})
