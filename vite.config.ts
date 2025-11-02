import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { fileURLToPath } from "url";
// componentTagger plugin loaded dynamically in dev

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  if (mode === 'development') {
    try {
      const mod = await import('lovable-tagger');
      const tagger = mod.componentTagger();
      if (Array.isArray(tagger)) {
        plugins.push(...tagger);
      } else if (tagger) {
        plugins.push(tagger as any);
      }
    } catch (e) {
      // Optional plugin not available; continue without it
    }
  }

  return {
    build: {
      outDir: 'build'
    },
    server: {
      port: 8080,
      host: '0.0.0.0',
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
