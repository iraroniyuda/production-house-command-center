# AI Start Here

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: All AI-Assisted Work  
Related Documents:
- Belum ditentukan


## Project

Production House Command Center adalah sistem operasional multi-tenant untuk production house.

## Required Reading Order

1. `../00-governance/PROJECT_CONSTITUTION.md`
2. `../00-governance/SOURCE_OF_TRUTH.md`
3. `../01-product/PRODUCT_BIBLE.md`
4. `../02-domain/DOMAIN_GLOSSARY.md`
5. `../02-domain/BOUNDED_CONTEXT_MAP.md`
6. `../03-architecture/ARCHITECTURE_BLUEPRINT.md`
7. Relevant feature specification
8. Relevant domain rules dan state machines
9. `../12-current-state/CURRENT_IMPLEMENTATION.md`

## Non-Negotiable Architecture

- Next.js + TypeScript.
- Java + Spring Boot.
- Spring Modulith modular monolith.
- PostgreSQL + Flyway.
- Keycloak for identity.
- Application-managed contextual authorization.
- REST + OpenAPI.
- Transactional outbox.
- S3-compatible storage.
- Testcontainers, ArchUnit, Playwright.

## Required AI Behavior

- Do not invent missing business rules.
- Report ambiguity before implementation.
- Do not introduce dependency without justification.
- Do not bypass module boundaries.
- Do not weaken tests to make builds pass.
- Do not modify unrelated modules.
- Update documentation when behavior changes.
- State assumptions explicitly.
- Provide affected modules, data, API, security, tests, and docs impact before coding.
