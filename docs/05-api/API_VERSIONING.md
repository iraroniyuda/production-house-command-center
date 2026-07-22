# API Versioning

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: REST API  
Related Documents:
- Belum ditentukan


## Policy

- Major version berada di URL: `/api/v1`.
- Additive backward-compatible field MAY ditambahkan tanpa major bump.
- Field removal, semantic change, atau required field baru membutuhkan compatibility plan.
- Deprecated endpoint MUST diberi periode transisi dan dokumentasi.
- Public token endpoint memiliki versioning terpisah bila kontraknya berubah.
- Generated TypeScript client harus mengikuti OpenAPI approved.
