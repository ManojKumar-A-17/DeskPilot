import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    {
      name: 'suppress-external-errors',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Ignore requests from external sources/extensions
          if (req.url?.includes('hybridaction') || 
              req.url?.includes('zybTracker') ||
              req.url?.includes('_bCrz') ||
              req.url?.startsWith('/z.')) {
            res.writeHead(204); // No Content
            res.end();
            return;
          }
          next();
        });
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
}));
