import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: 'localhost', // Explicitly bind to localhost for offline use
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Ensure all assets are bundled for offline use
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Ensure consistent chunk naming for offline caching
        manualChunks: undefined,
      },
    },
  },
  // Disable any external resource fetching
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'antd', '@ant-design/icons', 'axios', 'dayjs'],
  },
});

