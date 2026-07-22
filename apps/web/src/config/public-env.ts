type BrowserEnvironment = Readonly<{
  keycloakUrl: string;
  keycloakRealm: string;
  keycloakClientId: string;
  apiBaseUrl: string;
}>;

function requireValue(name: string, value: string | undefined): string {
  const normalizedValue = value?.trim();

  if (!normalizedValue) {
    throw new Error(`Missing required public environment variable: ${name}`);
  }

  return normalizedValue;
}

function normalizeHttpBaseUrl(
  name: string,
  value: string | undefined,
): string {
  const rawValue = requireValue(name, value);
  const parsedUrl = new URL(rawValue);

  if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
    throw new Error(`${name} must use the http or https protocol.`);
  }

  if (parsedUrl.search || parsedUrl.hash) {
    throw new Error(`${name} must not contain a query string or fragment.`);
  }

  return parsedUrl.toString().replace(/\/$/, "");
}

export const browserEnvironment: BrowserEnvironment = Object.freeze({
  keycloakUrl: normalizeHttpBaseUrl(
    "NEXT_PUBLIC_KEYCLOAK_URL",
    process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  ),
  keycloakRealm: requireValue(
    "NEXT_PUBLIC_KEYCLOAK_REALM",
    process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  ),
  keycloakClientId: requireValue(
    "NEXT_PUBLIC_KEYCLOAK_CLIENT_ID",
    process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
  ),
  apiBaseUrl: normalizeHttpBaseUrl(
    "NEXT_PUBLIC_API_BASE_URL",
    process.env.NEXT_PUBLIC_API_BASE_URL,
  ),
});
