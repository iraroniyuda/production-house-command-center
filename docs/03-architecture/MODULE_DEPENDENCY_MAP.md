# Module Dependency Map

Status: Draft  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Backend Modules  
Related Documents:
- Belum ditentukan


```mermaid
flowchart TD
    Organization --> Project
    IdentityAccess --> Project
    Project --> ScriptScene
    Project --> Scheduling
    CrewTalent --> Scheduling
    ScriptScene --> Scheduling
    Scheduling --> CallSheet
    CrewTalent --> CallSheet
    Scheduling --> OnSet
    CallSheet --> OnSet
    OnSet --> Reporting
    Project --> Reporting
    Equipment --> OnSet
    Finance --> Reporting
    Documents --> Project
    PostProduction --> Reporting
    CallSheet --> Notification
    Equipment --> Notification
    Reporting --> Notification
    Audit -. consumes events .-> Project
```

## Rules

- Panah berarti dependency yang diizinkan melalui public API atau event.
- Repository dependency lintas modul dilarang.
- Event consumer tidak boleh mengubah ownership data producer secara langsung.
- Dependency baru membutuhkan update dokumen dan architecture test.
