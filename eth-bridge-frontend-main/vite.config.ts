import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@config": "/src/config",
      "@components": "/src/components",
      "@features": "/src/features",
      "@styles": "/src/styles",
    },
  },
});
