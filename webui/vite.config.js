import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/* INFO: The build output replaces the module's webroot. KernelSU and WebUI X serve the
         module from a virtual origin, so every asset URL has to stay relative. */
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../webroot',
    emptyOutDir: true,
    target: 'es2017',
    assetsInlineLimit: 0,
    modulePreload: { polyfill: false },
  },
})
