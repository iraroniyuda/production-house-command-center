# Local Development

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Developer Environment  
Related Documents:
- Belum ditentukan


## Prerequisites

- JDK
- Node.js
- pnpm
- Docker
- Docker Compose
- Git

## Services

- PostgreSQL
- Keycloak
- MinIO
- Mail testing service
- Backend
- Frontend

## Expected Commands

```bash
docker compose up -d postgres keycloak minio
./gradlew bootRun
pnpm --dir apps/web dev
```

## Environment

- `.env.example` wajib tersedia.
- Secret local tidak boleh di-commit.
- Seed data harus deterministik.
- Health endpoint digunakan untuk readiness.
