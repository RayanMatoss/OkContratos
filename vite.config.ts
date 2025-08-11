import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
<<<<<<< HEAD
<<<<<<< HEAD
=======
import { componentTagger } from "lovable-tagger";
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
<<<<<<< HEAD
<<<<<<< HEAD
    // Completely disable the component tagger to remove the notification
    // mode === 'development' &&
    // componentTagger(),
=======
    mode === 'development' &&
    componentTagger(),
>>>>>>> e62eb17966de823dfc16cbe132c6f6a1844b8654
=======
    // Completely disable the component tagger to remove the notification
    // mode === 'development' &&
    // componentTagger(),
>>>>>>> b4ea07a19c853f162db95a287d24975d8678940c
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
