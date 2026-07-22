# Event Catalog

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Internal Events & Outbox  
Related Documents:
- Belum ditentukan


## Standard Envelope

Setiap event MUST memiliki:

- eventId
- eventType
- eventVersion
- organizationId
- projectId bila relevan
- aggregateId
- actorId
- occurredAt
- correlationId
- payload

Delivery semantics awal: at-least-once. Consumer MUST idempotent.

## Event Awal

### EVT-PROJ-001 — ProjectCreated
Producer: Project  
Consumers: Audit, Reporting

### EVT-SCENE-001 — SceneCreated
Producer: Script & Scene  
Consumers: Audit, Scheduling Projection

### EVT-SCENE-002 — SceneRevised
Producer: Script & Scene  
Consumers: Scheduling, Call Sheet, Finance, Audit

### EVT-SCHED-001 — ShootingDayScheduled
Producer: Scheduling  
Consumers: Call Sheet, Reporting, Audit

### EVT-CALL-001 — CallSheetPublished
Producer: Call Sheet  
Consumers: Notification, Reporting, Audit

### EVT-CALL-002 — CallSheetConfirmed
Producer: Call Sheet  
Consumers: Reporting, Audit

### EVT-ONSET-001 — ShootingDayStarted
Producer: On-Set  
Consumers: Reporting, Audit

### EVT-ONSET-002 — SceneCompleted
Producer: On-Set  
Consumers: Reporting, Post-Production, Audit

### EVT-ONSET-003 — ShootingDayWrapped
Producer: On-Set  
Consumers: Reporting, Audit

### EVT-REPORT-001 — DailyReportGenerated
Producer: Reporting  
Consumers: Audit

### EVT-REPORT-002 — DailyReportLocked
Producer: Reporting  
Consumers: Project Dashboard, Audit

### EVT-EQUIP-001 — EquipmentConflictDetected
Producer: Equipment  
Consumers: Notification, Risk Radar, Audit
