import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const currentDirectory = path.dirname(
  fileURLToPath(import.meta.url),
);

const testPublicEnvironment = {
  NEXT_PUBLIC_KEYCLOAK_URL: "http://localhost:8080",
  NEXT_PUBLIC_KEYCLOAK_REALM: "phcc",
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: "phcc-web",
  NEXT_PUBLIC_API_BASE_URL: "http://localhost:8081",
} as const;

for (const [name, value] of Object.entries(testPublicEnvironment)) {
  process.env[name] ??= value;
}

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(currentDirectory, "src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    clearMocks: true,
    restoreMocks: true,
    unstubGlobals: true,
  },
});
