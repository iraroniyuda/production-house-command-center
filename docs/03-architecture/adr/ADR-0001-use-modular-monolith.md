# Use Modular Monolith

Status: Approved  
Owner: Roni / Product & Engineering  
Last Reviewed: 2026-07-22  
Applies To: Architecture  
Related Documents:
- Belum ditentukan


## Status

Accepted

## Context

Produk memiliki banyak domain tetapi belum memiliki client, traffic, atau tim yang membenarkan distributed system.

## Decision

Backend dibangun sebagai satu deployable Spring Boot dengan batas modul Spring Modulith.

## Consequences

Positive:
- transaction sederhana;
- deployment sederhana;
- debugging mudah;
- boundary domain tetap tegas.

Negative:
- satu deployment unit;
- disiplin module boundary wajib dijaga.

## Revisit When

- modul membutuhkan deployment independen;
- beban sangat berbeda;
- ownership tim terpisah;
- availability requirement berbeda.
