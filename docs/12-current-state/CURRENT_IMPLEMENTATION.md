# Current Implementation

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Repository State  

Related Documents:

- ../03-architecture/ARCHITECTURE_BLUEPRINT.md
- ../11-features/core-production-vertical-slice/FEATURE_SPEC.md
- ../../infra/README.md

## Implemented

### Documentation

- Documentation Bible v0.1.
- Product, domain, architecture, security, quality, operations, and AI working guides.
- Initial architecture decision records.
- Local infrastructure operating instructions.

### Repository Foundation

- Git repository and GitHub remote.
- Main and bootstrap branches.
- Line-ending policy.
- Root Git ignore policy.
- Editor, Java, Node.js, and pnpm version declarations.

### Frontend Foundation

- pnpm monorepo workspace.
- Next.js 16 application under `apps/web`.
- TypeScript.
- ESLint.
- Tailwind CSS.
- App Router.
- Frontend lint, typecheck, and production build commands.

### Backend Foundation

- Spring Boot 4.1 application under `apps/api`.
- Java 21 toolchain.
- Gradle Wrapper.
- Spring MVC.
- Validation.
- Spring Security.
- OAuth2 Resource Server.
- Spring Data JPA.
- PostgreSQL driver.
- Flyway.
- Spring Boot Actuator.
- Spring Modulith JDBC event publication registry.
- Testcontainers PostgreSQL.
- Spring Modulith architecture verification test.
- Flyway-owned infrastructure migration.
- Local API runtime profile on port `8081`.
- Runtime connection to local PostgreSQL.
- Stateless Spring Security resource server.
- Keycloak JWT signature and issuer validation.
- Keycloak realm-role conversion.
- Explicit PHCC realm-role allowlist.
- Public Actuator health and info endpoints.
- Protected `/api/v1/me` identity endpoint.
- Local CORS policy for `http://localhost:3000`.
- Automated HTTP security regression tests.
- Verified anonymous HTTP 401 behavior.
- Verified signed Keycloak token authentication.
- Verified `producer` to `ROLE_producer` conversion.

- Dedicated `phcc-api` audience contract.
- Dedicated Keycloak `phcc-api` resource-server client.
- Access-token audience mapper from `phcc-web` to `phcc-api`.
- Expected-audience validation in Spring Security.
- Automated missing-audience and wrong-audience validator tests.
- Live verification that a token containing `aud: phcc-api` receives HTTP 200.
- Live verification that a token without `aud: phcc-api` receives HTTP 401.
- Live verification that technical Keycloak roles do not become PHCC authorities.

### Browser Authentication

- Browser authentication decision recorded in `ADR-0006`.
- Official `keycloak-js` adapter integrated with the Next.js application.
- Authorization Code flow with PKCE S256 through the `phcc-web` public client.
- Browser session discovery through Keycloak `check-sso`.
- Silent session-check page at `/silent-check-sso.html`.
- Access and refresh tokens remain in adapter memory.
- Tokens are not persisted in `localStorage`, `sessionStorage`, or application cookies.
- Single-flight token refresh through `keycloak.updateToken`.
- Centralized authenticated PHCC API fetch abstraction.
- Authenticated API requests omit cookies.
- Caller-provided authorization headers are rejected.
- Access tokens are restricted to the configured PHCC API origin.
- HTTP 401 responses clear local authentication state.
- Login, logout, session recovery after reload, and `/api/v1/me` verified live.
- Browser-issued token verified with audience `phcc-api`.
- Browser user role `producer` verified as `ROLE_producer`.
- Technical Keycloak roles verified not to leak into PHCC authorities.
- Public browser environment configuration documented through `.env.example`.
- Vitest configured for frontend unit tests.
- Automated tests cover environment validation, identity-claim parsing, and authenticated-fetch safeguards.
- Current frontend test baseline: 3 test files and 13 passing tests.
- Playwright 1.61.1 configured for local browser E2E testing.
- Chromium-only browser test project.
- Single worker with parallel execution disabled.
- One serial browser-authentication lifecycle test.
- Automated unauthenticated initialization verification.
- Automated Keycloak login and PKCE callback verification.
- Automated authenticated `/api/v1/me` verification.
- Automated `ROLE_producer` business-role verification.
- Automated reload and SSO session-recovery verification.
- Automated logout and post-logout reload verification.
- Runtime-only Keycloak test user with a complete profile.
- Runtime user receives only the required `producer` realm role.
- Random runtime password generated in process memory.
- Password delivered to Keycloak through exact standard-input bytes.
- E2E credentials are not written to repository files or logs.
- E2E output is stored in a per-run temporary directory.
- Traces, screenshots, videos, and persisted storage state are disabled.
- Runtime user, child processes, temporary scripts, logs, and output are cleaned in `finally`.
- Caller E2E environment variables are restored after execution.
- Post-run verification confirms ports `3000` and `8081` are released.
- Post-run verification confirms no runtime E2E user remains.
- Post-run verification confirms no Playwright repository artifacts remain.
- Root browser E2E command: `pnpm web:test:e2e`.
- Current browser E2E baseline: 1 Chromium test passing.

### Local Infrastructure

- Docker Compose environment under `infra`.
- PostgreSQL 16 application database.
- Dedicated PostgreSQL database for Keycloak.
- Persistent Docker named volumes.
- PostgreSQL health checks.
- Keycloak 26 local identity provider.
- Keycloak readiness and management endpoints.
- PHCC realm import.
- Public `phcc-web` OIDC client.
- Authorization Code flow with PKCE S256.
- Initial PHCC realm roles.
- Loopback-only published ports.
- Keycloak database isolated from the host.
- Environment template with local credentials excluded from Git.
- Root pnpm commands for infrastructure lifecycle management.
- Operational README for local infrastructure.

## Not Yet Implemented

- Organization domain.
- Membership and contextual authorization model.
- Project domain.
- Scene and scheduling modules.
- Application user provisioning.
- MinIO or alternative S3-compatible storage.
- Object-storage architecture decision record.
- Production Keycloak configuration.
- Production secret management.
- Continuous integration workflow.
- OpenAPI production contract.
- Core production vertical slice.

## Current Database Version

V1 - Spring Modulith event publication registry.

## Current API Version

Draft v1.

## Current Local Runtime

- Web application: `http://localhost:3000`
- Spring Boot API: `http://localhost:8081`
- PHCC PostgreSQL: `127.0.0.1:15432`
- Keycloak: `http://localhost:8080`
- Keycloak management: `http://localhost:9000`
- OIDC issuer: `http://localhost:8080/realms/phcc`

## Current Infrastructure Services

| Service | Runtime |
|---|---|
| PHCC PostgreSQL | PostgreSQL 16.14 |
| Keycloak PostgreSQL | PostgreSQL 16.14 |
| Keycloak | Keycloak 26.7.0 |
| Container orchestration | Docker Compose |

## Next Recommended Milestone

1. Define protected-route behavior for authenticated application areas.
2. Introduce the first authenticated application shell.
3. Add Content Security Policy and browser security headers.
4. Add continuous integration for frontend, backend, and browser quality gates.
5. Begin application-user provisioning and contextual authorization.
6. Begin the organization, membership, and project-domain foundation.
