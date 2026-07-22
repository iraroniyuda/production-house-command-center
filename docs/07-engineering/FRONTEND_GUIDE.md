# Frontend Guide

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Next.js Frontend  
Related Documents:
- Belum ditentukan


## Principles

- App Router.
- TypeScript strict.
- Server component digunakan untuk data read yang cocok.
- Client component hanya untuk interaksi.
- Generated OpenAPI client menjadi kontrak API.
- Form memiliki server-side validation result mapping.
- Mobile-first untuk on-set dan public call sheet.
- Desktop-first diperbolehkan untuk admin table berat.

## Routing Awal

- `/login`
- `/workspace`
- `/[organizationSlug]/projects`
- `/[organizationSlug]/projects/[projectId]`
- `/[organizationSlug]/projects/[projectId]/scenes`
- `/[organizationSlug]/projects/[projectId]/schedule`
- `/[organizationSlug]/shooting-days/[shootingDayId]/call-sheet`
- `/[organizationSlug]/shooting-days/[shootingDayId]/live`
- `/[organizationSlug]/shooting-days/[shootingDayId]/report`
- `/public/call-sheet/[token]`

## UI Rule

Setiap layar harus menjawab:

1. Apa yang harus diketahui?
2. Apa yang harus dikonfirmasi?
3. Apa yang harus dikerjakan?
4. Siapa yang harus dihubungi?
