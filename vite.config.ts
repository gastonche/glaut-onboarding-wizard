/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true, // use global test APIs (describe, it, expect) :contentReference[oaicite:6]{index=6}
    environment: "jsdom", // simulate browser DOM :contentReference[oaicite:7]{index=7}
    setupFiles: "./src/setupTests.ts", // optional test setup file
    coverage: {
      reporter: ["text", "lcov"], // enable coverage reports
    },
  },
});
