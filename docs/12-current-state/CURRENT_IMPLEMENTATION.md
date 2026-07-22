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
- Spring Security runtime connection to Keycloak.
- API local runtime profile.
- Application user provisioning.
- MinIO or alternative S3-compatible storage.
- Object-storage architecture decision record.
- Production Keycloak configuration.
- Production secret management.
- Continuous integration workflow.
- OpenAPI production contract.
- Core production vertical slice.

## Current Database Version

V1 — Spring Modulith event publication registry.

## Current API Version

Draft v1.

## Current Local Runtime

- Web application: `http://localhost:3000`
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

1. Add the API local runtime profile.
2. Connect Spring Boot to the Compose PostgreSQL instance.
3. Configure Spring Security as a Keycloak resource server.
4. Add authorization claim conversion.
5. Run the API against PostgreSQL and Keycloak.
6. Verify Flyway migration and Actuator health.
7. Add continuous integration.