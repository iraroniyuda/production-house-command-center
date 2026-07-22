import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const validEnvironment = {
  NEXT_PUBLIC_KEYCLOAK_URL: "http://localhost:8080",
  NEXT_PUBLIC_KEYCLOAK_REALM: "phcc",
  NEXT_PUBLIC_KEYCLOAK_CLIENT_ID: "phcc-web",
  NEXT_PUBLIC_API_BASE_URL: "http://localhost:8081",
} as const;

function applyValidEnvironment(): void {
  for (const [name, value] of Object.entries(validEnvironment)) {
    process.env[name] = value;
  }
}

describe("browserEnvironment", () => {
  beforeEach(() => {
    applyValidEnvironment();
    vi.resetModules();
  });

  it("loads and normalizes valid public configuration", async () => {
    process.env.NEXT_PUBLIC_KEYCLOAK_URL =
      "http://localhost:8080/";

    process.env.NEXT_PUBLIC_API_BASE_URL =
      "http://localhost:8081/";

    const { browserEnvironment } = await import(
      "@/config/public-env"
    );

    expect(browserEnvironment).toEqual({
      keycloakUrl: "http://localhost:8080",
      keycloakRealm: "phcc",
      keycloakClientId: "phcc-web",
      apiBaseUrl: "http://localhost:8081",
    });
  });

  it("rejects a missing required value", async () => {
    delete process.env.NEXT_PUBLIC_KEYCLOAK_REALM;

    await expect(
      import("@/config/public-env"),
    ).rejects.toThrow(
      "Missing required public environment variable: " +
        "NEXT_PUBLIC_KEYCLOAK_REALM",
    );
  });

  it("rejects a URL containing a query string", async () => {
    process.env.NEXT_PUBLIC_API_BASE_URL =
      "http://localhost:8081?debug=true";

    await expect(
      import("@/config/public-env"),
    ).rejects.toThrow(
      "NEXT_PUBLIC_API_BASE_URL must not contain " +
        "a query string or fragment.",
    );
  });

  it("rejects a non-HTTP URL", async () => {
    process.env.NEXT_PUBLIC_KEYCLOAK_URL =
      "file:///tmp/keycloak";

    await expect(
      import("@/config/public-env"),
    ).rejects.toThrow(
      "NEXT_PUBLIC_KEYCLOAK_URL must use the " +
        "http or https protocol.",
    );
  });
});
