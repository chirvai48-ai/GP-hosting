import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./tests/setup.ts"],
    // Tests share the dev database, so run files sequentially to avoid races.
    fileParallelism: false,
    testTimeout: 30000,
    hookTimeout: 30000,
    globals: true,
  },
});
