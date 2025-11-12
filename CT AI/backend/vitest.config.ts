import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const srcPath = fileURLToPath(new URL("./src", import.meta.url));

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    coverage: {
      reporter: ["text", "html"],
    },
    include: ["src/**/*.test.ts"],
    setupFiles: ["src/test/setup-env.ts"],
  },
  resolve: {
    alias: {
      "@": srcPath,
    },
  },
});

