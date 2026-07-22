# Security Bible

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Whole System  
Related Documents:
- Belum ditentukan


## Identity

- Keycloak mengelola authentication.
- Backend memvalidasi issuer, audience, expiry, dan signature.
- Password tidak pernah disimpan aplikasi.
- MFA SHOULD tersedia untuk role sensitif.

## Authorization

- RBAC + contextual checks.
- Permission selalu divalidasi backend.
- Context meliputi organization, project, department, resource ownership, resource state, dan sharing.
- Frontend hiding bukan security boundary.

## Tenant Isolation

- Semua query bisnis tenant-aware.
- Cross-tenant test wajib.
- Storage key memiliki tenant prefix.
- Audit dan outbox membawa organizationId.

## File Security

- MIME dan size divalidasi.
- Presigned URL memiliki expiry pendek.
- Private file tidak boleh public by default.
- Antivirus scanning hook disiapkan.
- Checksum dicatat.

## Secrets

- Secret tidak masuk repository.
- Production secret berada di secret manager.
- Token, password, dan private key tidak boleh masuk log.

## Logging Redaction

Dilarang mencatat:

- password;
- access token;
- refresh token;
- raw confirmation token;
- private key;
- full sensitive document;
- personal data yang tidak diperlukan.

## Baseline Controls

- rate limiting untuk public endpoint;
- CSRF policy sesuai authentication flow;
- secure headers;
- dependency scan;
- container scan;
- secret scan;
- backup encryption;
- audit for privileged actions.
