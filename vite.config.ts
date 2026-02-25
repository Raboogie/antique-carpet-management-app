import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 700, // bump slightly since firebase is naturally large
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui-vendor';
            }
            if (id.includes('firebase/auth') || id.includes('firebase/firestore') || id.includes('firebase/storage')) {
              return 'firebase-services-vendor';
            }
            if (id.includes('firebase')) {
              return 'firebase-core-vendor';
            }
            if (id.includes('react') || id.includes('react-router') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            return 'vendor'; // all other dependencies
          }
        }
      }
    }
  }
})
