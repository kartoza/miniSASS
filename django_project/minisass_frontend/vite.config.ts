import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import reactRefresh from "@vitejs/plugin-react-refresh";

// https://vitejs.dev/config/
export default defineConfig({
  build: { manifest: true },
  base: process.env.NODE_ENV === "production" ? "/static/" : "/",
  root: "./src",
  plugins: [tsconfigPaths(),react()],
});