import { defineConfig } from 'vite'

export default defineConfig({
  // 'root' is no longer needed here if Vercel's Root Directory is set to 'final01'
  
  server: {
    port: 5500, // Kept safely for your local 'npm run dev' sessions
    host: true
  },
  
  build: {
    minify: 'esbuild',
  },
  
  esbuild: {
    // Automatically drops all console.log and debugger statements on deployment build
    drop: ['console', 'debugger'], 
  }
})