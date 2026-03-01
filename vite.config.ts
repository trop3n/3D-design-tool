import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-three': ['three', 'three-stdlib'],
          'vendor-r3f': ['@react-three/fiber', '@react-three/drei'],
          'vendor-state': ['zustand', 'zundo', 'uuid'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
