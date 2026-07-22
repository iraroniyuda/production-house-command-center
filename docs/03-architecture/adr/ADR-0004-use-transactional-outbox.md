# Use Transactional Outbox

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Architecture  
Related Documents:
- Belum ditentukan


## Status

Accepted

## Context

Operasi bisnis memicu notification dan side effect eksternal yang tidak boleh merusak transaction utama.

## Decision

Event eksternal ditulis ke outbox table dalam transaction yang sama.

## Consequences

Consumer harus idempotent. Outbox cleanup dan monitoring diperlukan.
