# Threat Model

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Whole System  
Related Documents:
- Belum ditentukan


## Assets

- production schedule;
- cast dan crew data;
- client documents;
- budget dan expense;
- contracts dan releases;
- call sheet location;
- equipment inventory;
- audit trail;
- login session;
- uploaded file.

## Threats Awal

1. Cross-tenant data access.
2. Public confirmation token ditebak atau bocor.
3. Client melihat internal budget.
4. File private menjadi public.
5. Malicious upload.
6. Privilege escalation melalui role assignment.
7. Replay terhadap command penting.
8. Race condition pada schedule atau call sheet.
9. Audit tampering.
10. Dependency compromise.

## Mitigation Direction

- tenant-aware query;
- hashed high-entropy token;
- contextual authorization;
- short-lived presigned URL;
- MIME/size/scan;
- privileged audit;
- idempotency;
- optimistic locking;
- append-oriented audit;
- supply-chain scanning.
