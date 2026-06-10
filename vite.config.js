import { defineConfig } from 'vite'

export default defineConfig({
  // 1. Tell Vite your source files live inside final01
  root: 'final01', 
  
  build: {
    // 2. Tell Vite to jump OUT of final01 and put the finished build in the root
    outDir: '../dist',
    emptyOutDir: true,
    minify: 'esbuild',
  },
  
  server: {
    port: 5500,
    host: true
  },
  
  esbuild: {
    drop: ['console', 'debugger'],
  }
})