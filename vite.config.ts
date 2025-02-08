
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: '0.0.0.0',
    allowedHosts: [
      '026fad96-c372-4a15-b9c3-9c0410978d10-00-781n5i2rziel.kirk.replit.dev'
    ]
  }
});
