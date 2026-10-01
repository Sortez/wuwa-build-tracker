import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Tauri prints its own build output; don't let Vite wipe it.
  clearScreen: false,
  server: {
    // Tauri's devUrl is fixed, so fail instead of silently switching ports.
    port: 5173,
    strictPort: true,
    watch: {
      // Rust sources are rebuilt by Tauri, not Vite; watching them causes reload loops.
      ignored: ['**/src-tauri/**'],
    },
  },
});
