import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ mode }) => ({
  // se publicar em subpasta (ex: /okcontratos/), ajuste a base:
  // base: mode === "production" ? "/okcontratos/" : "/",

  server: {
    host: "::",
    port: 8080,
  },

  plugins: [react()],

  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },

  build: {
    // opcional: aumenta o limite do aviso
    chunkSizeWarningLimit: 1500,

    // gera chunks separados de libs grandes
    rollupOptions: {
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          date: ["date-fns"],
          icons: ["lucide-react"],
          html2canvas: ["html2canvas"],
          jspdf: ["jspdf"],
        },
      },
    },

    // bons defaults
    target: "es2018",
    sourcemap: false,          // ligue se precisar debugar prod
    minify: "esbuild",         // rápido e eficiente
    assetsInlineLimit: 0,      // força assets virarem arquivos (melhora cache)
  },
}));

