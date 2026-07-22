import Keycloak from "keycloak-js";

import { browserEnvironment } from "@/config/public-env";

const TOKEN_MINIMUM_VALIDITY_SECONDS = 30;

let keycloakClient: Keycloak | undefined;
let initializationPromise: Promise<boolean> | undefined;
let refreshPromise: Promise<string> | undefined;

export class AuthenticationRequiredError extends Error {
  constructor() {
    super("An authenticated Keycloak session is required.");
    this.name = "AuthenticationRequiredError";
  }
}

function assertBrowserRuntime(): void {
  if (typeof window === "undefined") {
    throw new Error("The Keycloak client can only be used in the browser.");
  }
}

export function getKeycloakClient(): Keycloak {
  assertBrowserRuntime();

  if (!keycloakClient) {
    keycloakClient = new Keycloak({
      url: browserEnvironment.keycloakUrl,
      realm: browserEnvironment.keycloakRealm,
      clientId: browserEnvironment.keycloakClientId,
    });
  }

  return keycloakClient;
}

export function initializeKeycloak(): Promise<boolean> {
  const client = getKeycloakClient();

  if (!initializationPromise) {
    initializationPromise = client.init({
      onLoad: "check-sso",
      flow: "standard",
      pkceMethod: "S256",
      checkLoginIframe: true,
      silentCheckSsoFallback: true,
      silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    });
  }

  return initializationPromise;
}

export async function getValidAccessToken(
  minimumValiditySeconds = TOKEN_MINIMUM_VALIDITY_SECONDS,
): Promise<string> {
  const client = getKeycloakClient();

  if (!client.authenticated || !client.token) {
    throw new AuthenticationRequiredError();
  }

  if (!refreshPromise) {
    refreshPromise = client
      .updateToken(minimumValiditySeconds)
      .then(() => {
        if (!client.authenticated || !client.token) {
          throw new AuthenticationRequiredError();
        }

        return client.token;
      })
      .finally(() => {
        refreshPromise = undefined;
      });
  }

  return refreshPromise;
}

export function clearKeycloakAuthentication(): void {
  keycloakClient?.clearToken();
}
