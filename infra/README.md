# PHCC Local Infrastructure

Local development infrastructure for Production House Command Center.

## Services

| Service | Host Address | Purpose |
|---|---|---|
| PHCC PostgreSQL | `127.0.0.1:15432` | Application database |
| Keycloak | `http://localhost:8080` | Local identity provider |
| Keycloak Management | `http://localhost:9000` | Health and metrics |
| Keycloak PostgreSQL | Internal Docker network only | Keycloak database |

## Prerequisites

- Docker Desktop with Linux containers
- Docker Compose
- Node.js and pnpm

## Initial Setup

Copy the environment template:

~~~powershell
Copy-Item "infra\.env.example" "infra\.env"
~~~

The local `infra/.env` file is intentionally ignored by Git.

Do not store production secrets in this file.

## Common Commands

Validate the resolved Compose configuration:

~~~powershell
pnpm infra:config
~~~

Download container images:

~~~powershell
pnpm infra:pull
~~~

Start the infrastructure:

~~~powershell
pnpm infra:up
~~~

Display service status:

~~~powershell
pnpm infra:ps
~~~

Show the latest container logs:

~~~powershell
pnpm infra:logs:tail
~~~

Follow container logs continuously:

~~~powershell
pnpm infra:logs
~~~

Press `Ctrl+C` to stop following logs. This does not stop the containers.

Stop containers without deleting database volumes:

~~~powershell
pnpm infra:down
~~~

## Keycloak

Local administration console:

~~~text
http://localhost:8080/admin
~~~

PHCC realm:

~~~text
http://localhost:8080/realms/phcc
~~~

OpenID Connect discovery document:

~~~text
http://localhost:8080/realms/phcc/.well-known/openid-configuration
~~~

Readiness endpoint:

~~~text
http://localhost:9000/health/ready
~~~

The committed realm import defines:

- the `phcc-web` public OIDC client;
- Authorization Code flow;
- PKCE using S256;
- redirect URIs for `http://localhost:3000`;
- initial PHCC realm roles.

No application users or user passwords are stored in the committed realm file.

The server currently runs with `start-dev`. This configuration is for local
development only and must not be used for production deployment.

## PostgreSQL

The PHCC application database is published on host port `15432` to avoid
collisions with PostgreSQL installations already using host port `5432`.

Container-internal PostgreSQL connections continue to use port `5432`.

Future local API connection:

~~~text
jdbc:postgresql://localhost:15432/phcc
~~~

## Persistent Data

Docker named volumes:

- `phcc-local_phcc_db_data`
- `phcc-local_keycloak_db_data`

Running `pnpm infra:down` stops and removes the local containers and network
without intentionally resetting the database data.

To perform a complete destructive database reset:

~~~powershell
docker compose `
    --env-file "infra\.env" `
    -f "infra\compose.yaml" `
    down `
    --volumes
~~~

This deletes the local PHCC and Keycloak database data.

## First-Start Database Logs

During the first Keycloak database bootstrap, PostgreSQL may record failed
metadata queries involving objects such as:

- `aurora_version()`;
- `migration_model`;
- `databasechangelog`;
- `databasechangeloglock`.

In the validated PHCC startup, these messages were followed by successful
schema initialization, realm import, readiness, and server startup.

Treat them as a problem only when Keycloak subsequently fails to initialize,
fails readiness, or repeatedly restarts.

## Security Boundary

This Compose configuration is for local development only.

Current protections include:

- host ports bound to `127.0.0.1`;
- Keycloak PostgreSQL not published to the host;
- local credentials excluded from Git;
- committed environment values containing development placeholders only.

Production deployment requires separate credentials, TLS, hostname
configuration, hardened Keycloak startup, backups, monitoring, and secret
management.