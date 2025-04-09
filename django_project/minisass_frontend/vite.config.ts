import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import reactRefresh from "@vitejs/plugin-react-refresh";

const isProd = process.env.NODE_ENV === "production";

export default defineConfig({
  build: { manifest: true },
  base: isProd ? "/static/" : "/",
  root: "./src",
  plugins: [tsconfigPaths(), react()],
  server: !isProd
    ? {
        proxy: {
          "/static": "http://localhost:5000",
          "/authentication": "http://localhost:5000",
          "/monitor": "http://localhost:5000",
          "/admin": "http://localhost:5000",
        },
      }
    : undefined,
});
