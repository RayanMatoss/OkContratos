import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
<<<<<<< HEAD
=======
import { componentTagger } from "lovable-tagger";
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
<<<<<<< HEAD
    // Completely disable the component tagger to remove the notification
    // mode === 'development' &&
    // componentTagger(),
=======
    mode === 'development' &&
    componentTagger(),
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
