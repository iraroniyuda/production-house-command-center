# PHCC Web

Next.js browser application for Production House Command Center.

## Requirements

- Node.js version defined by the repository
- pnpm version defined by the repository
- Local Keycloak and PHCC API infrastructure

## Local Environment

Copy the committed environment template:

```powershell
Copy-Item "apps\web\.env.example" "apps\web\.env.local"
```

Expected local values:

```properties
NEXT_PUBLIC_KEYCLOAK_URL=http://localhost:8080
NEXT_PUBLIC_KEYCLOAK_REALM=phcc
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=phcc-web
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
```

These variables are public browser configuration. Never place a client secret,
password, access token, or refresh token in a `NEXT_PUBLIC_*` variable.

## Authentication

The browser uses the official `keycloak-js` adapter with:

- OpenID Connect Authorization Code flow;
- PKCE S256;
- the public `phcc-web` client;
- Keycloak `check-sso` session discovery;
- in-memory access and refresh tokens;
- centralized token refresh;
- direct bearer-token requests to the Spring Boot API.

Tokens must not be persisted in browser storage or application cookies.

The Spring Boot API remains responsible for validating signature, issuer,
expiry, audience, and application authorities.

## Run Locally

Start infrastructure:

```powershell
pnpm infra:up
```

Start the API in another terminal:

```powershell
.\apps\api\gradlew.bat `
    -p apps\api `
    bootRun `
    --args="--spring.profiles.active=local" `
    --console=plain
```

Start the web application:

```powershell
pnpm web:dev
```

Open:

```text
http://localhost:3000
```

## Quality Gates

```powershell
pnpm web:test
pnpm web:lint
pnpm web:typecheck
pnpm web:build
```

## Current Test Coverage

Frontend unit tests currently cover:

- public environment validation;
- authenticated identity-claim parsing;
- bearer-token header management;
- cookie omission;
- rejection of caller-provided authorization headers;
- prevention of cross-origin token forwarding;
- authentication clearing after HTTP 401.

Browser-level login automation is not implemented yet.
