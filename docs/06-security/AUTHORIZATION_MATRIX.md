# Authorization Matrix

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Roles & Permissions  
Related Documents:
- Belum ditentukan


| Permission | Owner | Producer | AD | Finance | Dept Head | Crew/Talent | Client |
|---|---:|---:|---:|---:|---:|---:|---:|
| PROJECT_VIEW | Yes | Assigned | Assigned | Assigned | Assigned | Assigned limited | Shared only |
| PROJECT_EDIT | Yes | Assigned | No | No | No | No | No |
| SCENE_VIEW | Yes | Assigned | Assigned | Limited | Assigned dept | Daily need | Shared only |
| SCENE_EDIT | Yes | Assigned | Assigned | No | Dept requirement only | No | No |
| SCHEDULE_EDIT | Yes | Assigned | Assigned | No | No | No | No |
| CALL_SHEET_PUBLISH | Yes | Assigned | Assigned | No | No | No | No |
| CALL_SHEET_CONFIRM | Optional | Yes | Yes | Yes | Yes | Yes | No |
| SHOOTING_LOG_WRITE | Yes | Assigned | Assigned | No | Assigned | Limited | No |
| REPORT_GENERATE | Yes | Assigned | Assigned | No | No | No | No |
| REPORT_LOCK | Yes | Assigned | Policy-based | No | No | No | No |
| BUDGET_VIEW_FULL | Yes | Assigned | No | Assigned | No | No | No |
| EXPENSE_SUBMIT | Yes | Assigned | Limited | Assigned | Limited | Limited | No |
| CLIENT_APPROVAL | No | No | No | No | No | No | Shared only |

## Context Rule

Permission saja tidak cukup. User juga harus memiliki membership aktif pada organization dan scope project yang tepat.
