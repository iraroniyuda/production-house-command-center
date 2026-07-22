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
- JWT audience validation for the PHCC API.
- Browser Authorization Code and PKCE integration.
- Frontend authentication and session integration.
- Application user provisioning.
- MinIO or alternative S3-compatible storage.
- Object-storage architecture decision record.
- Production Keycloak configuration.
- Production secret management.
- Continuous integration workflow.
- OpenAPI production contract.
- Core production vertical slice.

## Current Database Version

V1 â€” Spring Modulith event publication registry.

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

1. Define the dedicated `phcc-api` audience contract.
2. Configure Keycloak audience mapping.
3. Enforce JWT audience validation in Spring Security.
4. Add automated invalid-audience tests.
5. Integrate browser Authorization Code flow with PKCE.
6. Connect the Next.js frontend to the authenticated API.
7. Add continuous integration.