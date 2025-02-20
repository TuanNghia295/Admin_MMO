import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '8e86-2405-4802-a391-bfa0-6db5-93b9-9629-8a5b.ngrok-free.app',
    ],
  },
});
