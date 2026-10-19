import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
// import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),],
  server: {
    proxy: {
      '/api': {
        target: 'https://coffee-warehouse-backend-production-2a08.up.railway.app',
        changeOrigin: true,
      },
    },
  },
})
