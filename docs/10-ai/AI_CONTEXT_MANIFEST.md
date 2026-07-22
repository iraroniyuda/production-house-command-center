# AI Context Manifest

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: AI Prompt Assembly  
Related Documents:
- Belum ditentukan


## Global Context

Always include:

- Project Constitution
- Source of Truth
- Architecture Blueprint
- Domain Glossary
- Current Implementation

## Context by Task

### Product feature
Add Product Bible, feature spec, domain rules, state machines, authorization matrix.

### Backend
Add Backend Guide, Data Model Bible, Transaction Strategy, API Design Guide, Testing Strategy.

### Frontend
Add Frontend Guide, Product Principles, API contract, Authorization Matrix.

### Database
Add Database Guide, Data Model Bible, Data Ownership, relevant ADR.

### Security
Add Security Bible, Threat Model, Authorization Matrix, Audit Requirements.

### Operations
Add Deployment Guide, Observability Guide, Backup Recovery, Runbook.

## Rule

Do not dump the entire repository into the prompt. Provide the smallest authoritative context that fully covers the task.
