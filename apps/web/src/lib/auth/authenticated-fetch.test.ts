import {
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vitest";

const keycloakMocks = vi.hoisted(() => ({
  clearKeycloakAuthentication: vi.fn(),
  getValidAccessToken: vi.fn(),
}));

vi.mock("@/lib/auth/keycloak-client", () => ({
  clearKeycloakAuthentication:
    keycloakMocks.clearKeycloakAuthentication,
  getValidAccessToken:
    keycloakMocks.getValidAccessToken,
}));

import {
  ApiAuthenticationError,
  fetchPhccApi,
} from "./authenticated-fetch";

describe("fetchPhccApi", () => {
  beforeEach(() => {
    keycloakMocks.getValidAccessToken.mockResolvedValue(
      "test-access-token",
    );
  });

  it("adds the bearer token and omits cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 200,
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await fetchPhccApi("/api/v1/me", {
      headers: {
        "x-request-id": "request-123",
      },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [requestUrl, requestInit] =
      fetchMock.mock.calls[0];

    expect(requestUrl.toString()).toBe(
      "http://localhost:8081/api/v1/me",
    );

    expect(requestInit.credentials).toBe("omit");

    const headers = new Headers(requestInit.headers);

    expect(headers.get("authorization")).toBe(
      "Bearer test-access-token",
    );

    expect(headers.get("accept")).toBe(
      "application/json",
    );

    expect(headers.get("x-request-id")).toBe(
      "request-123",
    );
  });

  it("rejects paths outside the PHCC API", async () => {
    const fetchMock = vi.fn();

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchPhccApi("//attacker.example/token"),
    ).rejects.toThrow(
      "PHCC API paths must begin with exactly one slash.",
    );

    expect(
      keycloakMocks.getValidAccessToken,
    ).not.toHaveBeenCalled();

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects caller-managed authorization headers", async () => {
    await expect(
      fetchPhccApi("/api/v1/me", {
        headers: {
          authorization: "Bearer caller-token",
        },
      }),
    ).rejects.toThrow(
      "Authorization headers are managed by the " +
        "PHCC authentication layer.",
    );

    expect(
      keycloakMocks.getValidAccessToken,
    ).not.toHaveBeenCalled();
  });

  it("rejects cookie-bearing requests", async () => {
    await expect(
      fetchPhccApi("/api/v1/me", {
        credentials: "include",
      }),
    ).rejects.toThrow(
      "Authenticated PHCC API requests must omit cookies.",
    );

    expect(
      keycloakMocks.getValidAccessToken,
    ).not.toHaveBeenCalled();
  });

  it("clears authentication after an API 401", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(null, {
        status: 401,
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchPhccApi("/api/v1/me"),
    ).rejects.toBeInstanceOf(ApiAuthenticationError);

    expect(
      keycloakMocks.clearKeycloakAuthentication,
    ).toHaveBeenCalledTimes(1);
  });
});
