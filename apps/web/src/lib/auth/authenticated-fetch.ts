import { browserEnvironment } from "@/config/public-env";
import {
  clearKeycloakAuthentication,
  getValidAccessToken,
} from "@/lib/auth/keycloak-client";

export class ApiAuthenticationError extends Error {
  constructor() {
    super("The PHCC API rejected the current authentication.");
    this.name = "ApiAuthenticationError";
  }
}

function resolveApiUrl(path: string): URL {
  if (!path.startsWith("/") || path.startsWith("//")) {
    throw new Error(
      "PHCC API paths must begin with exactly one slash.",
    );
  }

  const apiBaseUrl = new URL(
    `${browserEnvironment.apiBaseUrl}/`,
  );

  const requestUrl = new URL(path, apiBaseUrl);

  if (requestUrl.origin !== apiBaseUrl.origin) {
    throw new Error(
      "Refusing to send an access token outside the PHCC API.",
    );
  }

  return requestUrl;
}

export async function fetchPhccApi(
  path: string,
  requestInit: RequestInit = {},
): Promise<Response> {
  const requestUrl = resolveApiUrl(path);

  if (
    requestInit.credentials &&
    requestInit.credentials !== "omit"
  ) {
    throw new Error(
      "Authenticated PHCC API requests must omit cookies.",
    );
  }

  const headers = new Headers(requestInit.headers);

  if (headers.has("authorization")) {
    throw new Error(
      "Authorization headers are managed by the PHCC authentication layer.",
    );
  }

  const accessToken = await getValidAccessToken();

  headers.set(
    "accept",
    headers.get("accept") ?? "application/json",
  );

  headers.set(
    "authorization",
    `Bearer ${accessToken}`,
  );

  const response = await fetch(requestUrl, {
    ...requestInit,
    headers,
    credentials: "omit",
  });

  if (response.status === 401) {
    clearKeycloakAuthentication();
    throw new ApiAuthenticationError();
  }

  return response;
}
