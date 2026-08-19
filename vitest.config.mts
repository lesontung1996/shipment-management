import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    exclude: ["**/node_modules/**", "**/.pnpm-store/**", "**/dist/**"],
  },
  resolve: {
    alias: {
      "@": root,
    },
  },
});
