import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5174,
      clientPort: 5174
    }
  },
  build: {
    assetsDir: 'assets',
    emptyOutDir: true
  },
  publicDir: 'public'
});