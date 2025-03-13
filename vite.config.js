import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'fd59-2405-4802-a639-be30-bd84-558-6a46-9b50.ngrok-free.app',
    ],
  },
});
