import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ command }) => ({
  base: command === 'serve' ? '/' : '/daesueng/',
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['three'],
  },
  build: {
    chunkSizeWarningLimit: 1400,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return undefined
          }

          if (id.includes('@react-three/postprocessing') || id.includes('postprocessing')) {
            return 'postprocessing-stack'
          }

          if (id.includes('@react-three/drei')) {
            return 'drei-stack'
          }

          if (id.includes('@react-three/fiber')) {
            return 'fiber-stack'
          }

          if (id.includes('\\three\\') || id.includes('/three/')) {
            return 'three-core'
          }

          if (id.includes('react') || id.includes('scheduler')) {
            return 'react-stack'
          }

          return 'vendor'
        },
      },
    },
  },
}))
