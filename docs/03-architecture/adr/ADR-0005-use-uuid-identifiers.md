# Use UUID Identifiers

Status: Proposed  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Architecture  
Related Documents:
- Belum ditentukan


## Status

Proposed

## Context

Sistem multi-tenant dan berpotensi memiliki data yang dibuat lintas node serta public reference.

## Decision

Gunakan UUID untuk primary identifier eksternal dan aggregate utama.

## Consequences

Index lebih besar dibanding sequence. Evaluasi UUID v7 untuk locality jika dukungan library dan database stabil.
