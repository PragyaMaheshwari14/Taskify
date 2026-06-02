import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // During development, forward /api requests to the Express server
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
