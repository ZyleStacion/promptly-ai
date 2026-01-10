import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/payment': {
        target: 'http://13.216.200.51.nip.io:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
