export type AuthenticatedUser = Readonly<{
  subject: string;
  username: string | null;
  email: string | null;
}>;

function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readOptionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim()
    ? value
    : null;
}

export function readAuthenticatedUser(
  tokenClaims: unknown,
): AuthenticatedUser | null {
  if (!isRecord(tokenClaims)) {
    return null;
  }

  const subject = readOptionalString(tokenClaims.sub);

  if (!subject) {
    return null;
  }

  return {
    subject,
    username: readOptionalString(
      tokenClaims.preferred_username,
    ),
    email: readOptionalString(tokenClaims.email),
  };
}
