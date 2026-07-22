# Use Keycloak for Identity

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Architecture  
Related Documents:
- Belum ditentukan


## Status

Accepted

## Context

Sistem membutuhkan login, token, reset password, MFA direction, dan kemungkinan SSO.

## Decision

Keycloak menangani authentication. Authorization kontekstual tetap berada di aplikasi.

## Consequences

Token tidak boleh menjadi tempat seluruh project permission. Keycloak menjadi external dependency yang harus dimonitor.
