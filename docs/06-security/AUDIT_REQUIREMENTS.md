# Audit Requirements

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Privileged & Business Actions  
Related Documents:
- Belum ditentukan


## Audit Wajib

- role atau membership change;
- project lifecycle change;
- scene material revision;
- shooting schedule published change;
- call sheet publish/revise/close;
- recipient confirmation;
- shooting day start/wrap;
- incident record;
- daily report lock/revision;
- equipment checkout/damage/lost;
- expense approve/pay/adjust;
- document approval;
- client sharing;
- file delete;
- security policy change.

## Audit Fields

- auditId
- organizationId
- projectId
- actorId
- action
- aggregateType
- aggregateId
- beforeState redacted
- afterState redacted
- requestId
- correlationId
- IP/user agent bila sesuai policy
- occurredAt

## Integrity

Audit record MUST NOT diedit melalui business API biasa.
