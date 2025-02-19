import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '2975-2405-4802-a637-150-91d6-fb53-7f8f-b09f.ngrok-free.app',
    ],
  },
});
