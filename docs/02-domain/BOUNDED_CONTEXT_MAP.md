# Bounded Context Map

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Backend Modules  
Related Documents:
- Belum ditentukan


## Contexts

### Identity & Access
Memvalidasi identity reference, application membership, role assignment, dan permission.

### Organization
Memiliki organization profile, policy, timezone, dan membership boundary.

### Project
Memiliki project lifecycle, phase, metadata, dan project membership.

### Crew & Talent
Memiliki profile operasional, assignment, availability, dan contact reference.

### Script & Scene
Memiliki script revision, scene, cast link, location link, dan requirement.

### Scheduling
Memiliki shooting day, scheduled scene, urutan, dan planning status.

### Call Sheet
Memiliki call sheet draft, published revision, recipient, token, dan confirmation.

### On-Set
Memiliki shooting log, attendance, delay, incident, overtime, dan wrap.

### Reporting
Memiliki daily report, report revision, project health projection, dan summary.

### Equipment
Memiliki asset, condition, booking, checkout, check-in, maintenance, dan damage.

### Finance
Memiliki budget, expense, reimbursement, invoice, payment, dan variance.

### Documents
Memiliki contract, permit, release, expiry, signature status, dan approval.

### Post-Production
Memiliki footage, backup status, edit stage, revision, QC, delivery, dan archive.

### Notification
Mengonsumsi event dan berinteraksi dengan external provider.

### Audit
Mencatat actor, action, before/after, request, correlation, dan timestamp.

## Aturan Dependency

- Modul MUST NOT mengakses repository modul lain.
- Modul MAY menggunakan public application service modul lain.
- Modul SHOULD menggunakan event untuk efek lintas modul yang tidak membutuhkan respons sinkron.
- Circular dependency MUST NOT ada.
- Shared package hanya untuk primitive technical concern, bukan business logic.
