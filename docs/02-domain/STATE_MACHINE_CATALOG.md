# State Machine Catalog

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Domain Lifecycle  
Related Documents:
- Belum ditentukan


## Project

DEVELOPMENT → PRE_PRODUCTION → PRODUCTION → POST_PRODUCTION → DELIVERY → ARCHIVED

Perubahan mundur MAY dilakukan melalui tindakan khusus dan audit.

## Shooting Day

| From | Action | To |
|---|---|---|
| PLANNED | Mark Ready | READY |
| READY | Start Day | IN_PROGRESS |
| IN_PROGRESS | Wrap | WRAPPED |
| WRAPPED | Generate Report | REPORTED |
| REPORTED | Close | CLOSED |
| PLANNED/READY | Cancel | CANCELLED |

## Call Sheet

| From | Action | To |
|---|---|---|
| DRAFT | Publish | PUBLISHED |
| PUBLISHED | Create Revision | REVISED |
| REVISED | Publish Revision | PUBLISHED |
| PUBLISHED | Close | CLOSED |
| DRAFT | Cancel | CANCELLED |

Catatan: `PUBLISHED` merepresentasikan revision aktif. History disimpan sebagai immutable revision.

## Daily Report

| From | Action | To |
|---|---|---|
| GENERATED | Submit Review | UNDER_REVIEW |
| UNDER_REVIEW | Lock | LOCKED |
| LOCKED | Create Revision | REVISED |
| REVISED | Lock Revision | LOCKED |

## Equipment

AVAILABLE → RESERVED → CHECKED_OUT → RETURNED → AVAILABLE

Status tambahan: INSPECTION_REQUIRED, UNDER_REPAIR, LOST, RETIRED.

## Expense

DRAFT → SUBMITTED → APPROVED → PAID

Alternatif: SUBMITTED → REJECTED; APPROVED → ADJUSTMENT_REQUIRED.
