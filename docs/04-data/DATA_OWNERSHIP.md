# Data Ownership

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Modules & Database  
Related Documents:
- Belum ditentukan


| Data | Owning Module |
|---|---|
| organization, organization_member | Organization |
| user identity reference, role assignment | Identity & Access |
| project, project_member | Project |
| crew profile, talent profile, availability | Crew & Talent |
| script_revision, scene, scene_requirement | Script & Scene |
| shooting_day, scheduled_scene | Scheduling |
| call_sheet, call_sheet_revision, recipient | Call Sheet |
| shooting_log, attendance, delay, incident | On-Set |
| daily_report, report_revision | Reporting |
| equipment, booking, maintenance, damage | Equipment |
| budget, expense, invoice, payment | Finance |
| contract, permit, release, approval | Documents |
| footage, post_task, qc, delivery | Post-Production |
| outbox_event, notification_delivery | Notification |
| audit_event | Audit |

## Rule

Hanya owning module yang boleh menulis langsung ke tabelnya. Modul lain menggunakan public application service, query projection, atau event.
