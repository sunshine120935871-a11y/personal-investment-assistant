import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import fs from "fs";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "spa-fallback",
      closeBundle() {
        // Copy index.html to 404.html for GitHub Pages SPA routing
        const distPath = path.resolve(__dirname, "dist");
        if (fs.existsSync(path.join(distPath, "index.html"))) {
          fs.copyFileSync(
            path.join(distPath, "index.html"),
            path.join(distPath, "404.html")
          );
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
