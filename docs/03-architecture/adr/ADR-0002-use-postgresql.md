# Use PostgreSQL

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Architecture  
Related Documents:
- Belum ditentukan


## Status

Accepted

## Context

Data sangat relasional dan membutuhkan constraint, transaction, reporting, serta audit.

## Decision

PostgreSQL menjadi primary operational database.

## Consequences

Schema evolution wajib menggunakan Flyway. JSONB boleh dipakai hanya untuk metadata dinamis, bukan menggantikan model domain.
