import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
// VITE_BASE overrides the public path (e.g. "/dashreforma/" on GitHub Pages).
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE || "/static/dashboard-cliente/",
  server: {

    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  build: {
    // Split long-lived vendor code from the app bundle so browsers can cache it.
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          if (!id.includes("node_modules")) return undefined;
          if (id.includes("recharts") || id.includes("/d3-") || id.includes("victory-vendor")) return "charts";
          if (id.includes("framer-motion") || id.includes("motion-")) return "motion";
          if (id.includes("/react/") || id.includes("/react-dom/") || id.includes("react-router") || id.includes("scheduler")) return "react";
          return "vendor";
        },
      },
    },
  },
}));
