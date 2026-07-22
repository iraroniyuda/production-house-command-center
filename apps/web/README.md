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

## Browser Authentication E2E

The local browser-authentication runner requires:

- Windows PowerShell 5.1;
- Docker Desktop using Linux containers;
- the local `infra/.env` file;
- ports `3000` and `8081` to be available;
- the Playwright Chromium browser installed.

Install the browser dependency when needed:

```powershell
pnpm --filter web exec playwright install chromium
```

Run the complete authentication lifecycle from the repository root:

```powershell
pnpm web:test:e2e
```

The runner:

- ensures the local Docker Compose infrastructure is running;
- waits for Keycloak readiness and OIDC discovery;
- creates a complete runtime-only Keycloak user;
- assigns the `producer` realm role;
- generates the password in memory;
- starts the Spring Boot API and Next.js frontend;
- runs one serial Chromium authentication lifecycle;
- verifies `/api/v1/me`, reload recovery, and logout;
- deletes the runtime user and temporary container script;
- stops the API and frontend process trees;
- restores caller environment variables;
- removes all temporary logs and Playwright output.

Credentials, access tokens, refresh tokens, and browser session state
must not be written to the repository, persistent browser storage, test
artifacts, command-line arguments, or logs.

## Quality Gates

```powershell
pnpm web:test
pnpm web:test:e2e
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

The Chromium browser E2E test currently covers:

- unauthenticated initialization through `check-sso`;
- Keycloak login through Authorization Code flow and PKCE S256;
- authenticated frontend state;
- a real HTTP 200 response from `/api/v1/me`;
- the runtime username and exact `ROLE_producer` business role;
- absence of unintended PHCC business roles;
- session recovery after a full page reload;
- authenticated API access after session recovery;
- Keycloak logout;
- unauthenticated state after logout and reload.

The local Playwright baseline is Chromium-only, uses one worker, does
not use persisted `storageState`, and keeps traces, screenshots, and
video disabled. Playwright output is routed to a per-run temporary
directory and removed during cleanup.
