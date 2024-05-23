import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  define: {
    __PLATFORM__: JSON.stringify(process.env.PLATFORM),
    __PLATFORM_TAURI__: JSON.stringify('tauri'),
    __PLATFORM_WEB__: JSON.stringify('web'),
  },
  plugins: [react(), TanStackRouterVite()],
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    watch: {
      ignored: ['**/src-tauri/**'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
}));
