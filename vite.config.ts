import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    VitePWA({
      registerType: "autoUpdate",
      devOptions: { enabled: true },
      manifest: {
        theme_color: "#ffffff",
      },
    }),
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3003,
    host: "127.0.0.1",
  },
  resolve: {
    alias: {
      stream: "stream-browserify",
      "@application": path.resolve(__dirname, "src/application"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@components": path.resolve(__dirname, "src/components"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@infrastructure": path.resolve(__dirname, "src/infrastructure"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@presentation": path.resolve(__dirname, "src/presentation"),
      "@utils": path.resolve(__dirname, "src/utils"),
    },
  },
});
