# 📊 ERD (Entity Relationship Diagram) - Crow's Foot Notation
## Database Schema Leksikon Backend

**Last Updated:** December 22, 2025  
**Database:** PostgreSQL (Neon)  
**ORM:** Prisma 6.16.2

---

## 🗂️ Daftar Isi

1. [Overview](#overview)
2. [Entitas Utama](#entitas-utama)
3. [Junction Tables](#junction-tables)
4. [Enumerations](#enumerations)
5. [Diagram ERD](#diagram-erd)
6. [Relasi Database](#relasi-database)

---

## Overview

Database Leksikon terdiri dari:
- **8 Entitas Utama** (Main Entities)
- **7 Junction Tables** (Tabel Relasi Many-to-Many)
- **14 Enumerations** (Tipe Data Enum)

### Statistik Database

| Kategori | Jumlah | Keterangan |
|----------|--------|------------|
| Main Entities | 8 | Admin, Culture, Subculture, Domain, Lexicon, Contributor, Asset, Reference |
| Junction Tables | 7 | Asset & Reference assignments |
| Enum Types | 14 | Status, Roles, Types |
| Total Tables | 16 | 8 + 7 + 1 (AboutReference) |

---

## Entitas Utama

### 1. ADMIN
Tabel untuk menyimpan data administrator sistem.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| admin_id | INT | PK, AUTO_INCREMENT | Primary key |
| username | VARCHAR(255) | UNIQUE, NOT NULL | Username admin |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email admin |
| password | VARCHAR(255) | NOT NULL | Password (bcrypt hashed) |
| role | ENUM | NOT NULL, DEFAULT 'EDITOR' | AdminRole enum |
| is_active | BOOLEAN | DEFAULT true | Status aktif |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | AUTO UPDATE | Waktu diubah |

### 2. CULTURE
Tabel untuk menyimpan data budaya/etnis.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| culture_id | INT | PK, AUTO_INCREMENT | Primary key |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| culture_name | VARCHAR(255) | NOT NULL | Nama budaya |
| origin_island | VARCHAR(255) | NOT NULL | Pulau asal |
| province | VARCHAR(255) | NOT NULL | Provinsi |
| city_region | VARCHAR(255) | NOT NULL | Kota/Kabupaten |
| classification | VARCHAR(255) | NULLABLE | Klasifikasi |
| characteristics | TEXT | NULLABLE | Karakteristik |
| conservation_status | ENUM | DEFAULT 'TREATED' | Status konservasi |
| latitude | FLOAT | NULLABLE | Koordinat latitude |
| longitude | FLOAT | NULLABLE | Koordinat longitude |
| status | ENUM | DEFAULT 'DRAFT' | Status publikasi |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | AUTO UPDATE | Waktu diubah |

### 3. SUBCULTURE
Tabel untuk menyimpan data sub-budaya.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| subculture_id | INT | PK, AUTO_INCREMENT | Primary key |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| subculture_name | VARCHAR(255) | NOT NULL | Nama sub-budaya |
| traditional_greeting | TEXT | NOT NULL | Salam tradisional |
| greeting_meaning | VARCHAR(255) | NULLABLE | Makna salam |
| explanation | TEXT | NOT NULL | Penjelasan |
| culture_id | INT | FK, NOT NULL | Foreign key ke Culture |
| status | ENUM | DEFAULT 'DRAFT' | Status publikasi |
| display_priority_status | ENUM | DEFAULT 'LOW' | Prioritas tampilan |
| conservation_status | ENUM | DEFAULT 'TREATED' | Status konservasi |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | AUTO UPDATE | Waktu diubah |

### 4. CODIFICATION_DOMAIN
Tabel untuk menyimpan domain kodifikasi leksikon.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| domain_id | INT | PK, AUTO_INCREMENT | Primary key |
| code | VARCHAR(255) | NOT NULL | Kode domain |
| domain_name | VARCHAR(255) | NOT NULL | Nama domain |
| explanation | TEXT | NOT NULL | Penjelasan |
| subculture_id | INT | FK, NOT NULL | Foreign key ke Subculture |
| status | ENUM | DEFAULT 'DRAFT' | Status publikasi |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | AUTO UPDATE | Waktu diubah |

### 5. LEXICON
Tabel utama untuk menyimpan data leksikon.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| lexicon_id | INT | PK, AUTO_INCREMENT | Primary key |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL slug |
| lexicon_word | VARCHAR(255) | NOT NULL | Kata leksikon |
| ipa_international_phonetic_alphabet | VARCHAR(255) | NULLABLE | IPA notation |
| transliteration | VARCHAR(255) | NOT NULL | Transliterasi |
| etymological_meaning | TEXT | NOT NULL | Makna etimologi |
| cultural_meaning | TEXT | NOT NULL | Makna kultural |
| common_meaning | TEXT | NOT NULL | Makna umum |
| translation | VARCHAR(255) | NOT NULL | Terjemahan |
| variant | VARCHAR(255) | NULLABLE | Varian |
| variant_translations | VARCHAR(255) | NULLABLE | Terjemahan varian |
| other_description | TEXT | NULLABLE | Deskripsi lain |
| domain_id | INT | FK, NOT NULL | Foreign key ke Domain |
| preservation_status | ENUM | DEFAULT 'MAINTAINED' | Status pelestarian |
| contributor_id | INT | FK, NOT NULL | Foreign key ke Contributor |
| status | ENUM | DEFAULT 'DRAFT' | Status publikasi |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | AUTO UPDATE | Waktu diubah |

### 6. CONTRIBUTOR
Tabel untuk menyimpan data kontributor.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| contributor_id | INT | PK, AUTO_INCREMENT | Primary key |
| contributor_name | VARCHAR(255) | NOT NULL | Nama kontributor |
| institution | VARCHAR(255) | NOT NULL | Institusi |
| email | VARCHAR(255) | NOT NULL | Email |
| expertise_area | VARCHAR(255) | NOT NULL | Area keahlian |
| contact_info | VARCHAR(255) | NOT NULL | Info kontak |
| display_priority_status | ENUM | DEFAULT 'LOW' | Prioritas tampilan |
| is_coordinator | BOOLEAN | DEFAULT false | Status koordinator |
| coordinator_status | ENUM | DEFAULT 'INACTIVE' | Status koordinator |
| registered_at | TIMESTAMP | DEFAULT NOW() | Waktu registrasi |

### 7. ASSET
Tabel untuk menyimpan data file media.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| asset_id | INT | PK, AUTO_INCREMENT | Primary key |
| file_name | VARCHAR(255) | NOT NULL | Nama file |
| file_type | ENUM | NOT NULL | Tipe file (AssetType) |
| description | TEXT | NULLABLE | Deskripsi |
| url | VARCHAR(500) | NOT NULL | URL file (Vercel Blob) |
| file_size | VARCHAR(50) | NULLABLE | Ukuran file |
| hash_checksum | VARCHAR(255) | NULLABLE | Hash checksum |
| metadata_json | TEXT | NULLABLE | Metadata JSON |
| status | ENUM | DEFAULT 'ARCHIVED' | Status file |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | AUTO UPDATE | Waktu diubah |

### 8. REFERENCE
Tabel untuk menyimpan data referensi akademik.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| reference_id | INT | PK, AUTO_INCREMENT | Primary key |
| title | VARCHAR(500) | NOT NULL | Judul referensi |
| reference_type | ENUM | NOT NULL | Tipe referensi |
| description | TEXT | NULLABLE | Deskripsi |
| url | VARCHAR(500) | NULLABLE | URL referensi |
| authors | VARCHAR(500) | NULLABLE | Penulis |
| publication_year | VARCHAR(10) | NULLABLE | Tahun publikasi |
| topic_category | VARCHAR(255) | NULLABLE | Kategori topik |
| status | ENUM | DEFAULT 'DRAFT' | Status publikasi |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu dibuat |
| updated_at | TIMESTAMP | AUTO UPDATE | Waktu diubah |

---

## Junction Tables

### Asset Junction Tables

| Table | Primary Keys | Purpose |
|-------|-------------|---------|
| LEXICON_ASSETS | lexicon_id + asset_id | Link Lexicon ↔ Asset |
| SUBCULTURE_ASSETS | subculture_id + asset_id + asset_role | Link Subculture ↔ Asset |
| CULTURE_ASSETS | culture_id + asset_id | Link Culture ↔ Asset |
| CONTRIBUTOR_ASSETS | contributor_id + asset_id | Link Contributor ↔ Asset |

### Reference Junction Tables

| Table | Primary Keys | Purpose |
|-------|-------------|---------|
| LEXICON_REFERENCE | lexicon_id + reference_id | Link Lexicon ↔ Reference |
| SUBCULTURE_REFERENCE | subculture_id + reference_id | Link Subculture ↔ Reference |
| CULTURE_REFERENCE | culture_id + reference_id | Link Culture ↔ Reference |
| ABOUT_REFERENCE | about_reference_id | Reference for About page |

---

## Enumerations

### Status Enums
```
StatusPublish: DRAFT | PUBLISHED | ARCHIVED
StatusFile: ACTIVE | PROCESSING | ARCHIVED | CORRUPTED | PUBLISHED
StatusKonservasi: MAINTAINED | TREATED | CRITICAL | ARCHIVED
StatusPriority: HIGH | MEDIUM | LOW | HIDDEN
StatusCoordinator: ACTIVE | INACTIVE | ALUMNI
```

### Type Enums
```
AdminRole: SUPER_ADMIN | EDITOR | VIEWER
AssetType: PHOTO | AUDIO | VIDEO | MODEL_3D
ReferenceType: JOURNAL | BOOK | ARTICLE | WEBSITE | REPORT | ORAL_TRADITION | FIELD_OBSERVATION
```

### Role Enums
```
LeksikonAssetRole: GALLERY | PRONUNCIATION | VIDEO_DEMO | MODEL_3D
SubcultureAssetRole: HIGHLIGHT | THUMBNAIL | GALLERY | BANNER | VIDEO_DEMO | MODEL_3D
CultureAssetRole: HIGHLIGHT | THUMBNAIL | GALLERY | BANNER | VIDEO_DEMO | MODEL_3D
ContributorAssetRole: LOGO | SELF_PHOTO | SIGNATURE | CERTIFICATE | GALLERY | BANNER | VIDEO_DEMO

LexiconReferenceRole: PRIMARY_SOURCE | SECONDARY_SOURCE | SUPPORTING
SubcultureReferenceRole: PRIMARY_SOURCE | SECONDARY_SOURCE | SUPPORTING
CultureReferenceRole: PRIMARY_SOURCE | SECONDARY_SOURCE | SUPPORTING
```

---

## Diagram ERD

### Crow's Foot Notation Legend

```
Notation      Meaning
─────────────────────────────────────
||──────||    One-to-One (mandatory)
||──────o|    One-to-One (optional)
||──────o{    One-to-Many (optional many)
||──────|{    One-to-Many (mandatory many)
}o──────o{    Many-to-Many (optional)
```

### ERD Visual Diagram

```
┌─────────────────┐         ┌─────────────────┐
│     ADMIN       │         │    CULTURE      │
├─────────────────┤         ├─────────────────┤
│ PK admin_id     │         │ PK culture_id   │
│    username     │         │    slug         │
│    email        │         │    culture_name │
│    password     │         │    province     │
│    role         │         │    latitude     │
│    is_active    │         │    longitude    │
│    created_at   │         │    status       │
│    updated_at   │         │    created_at   │
└─────────────────┘         └───────┬─────────┘
                                    │
                                    │ 1:N
                                    ▼
                            ┌─────────────────┐
                            │   SUBCULTURE    │
                            ├─────────────────┤
                            │ PK subculture_id│
                            │ FK culture_id   │◄────────────┐
                            │    slug         │             │
                            │    subculture_  │             │
                            │    name         │             │
                            │    explanation  │             │
                            │    status       │             │
                            └───────┬─────────┘             │
                                    │                       │
                                    │ 1:N                   │
                                    ▼                       │
┌─────────────────┐         ┌─────────────────┐             │
│   CONTRIBUTOR   │         │ CODIFICATION_   │             │
├─────────────────┤         │    DOMAIN       │             │
│ PK contributor_ │         ├─────────────────┤             │
│    id           │         │ PK domain_id    │             │
│    contributor_ │         │ FK subculture_id│             │
│    name         │         │    code         │             │
│    institution  │         │    domain_name  │             │
│    email        │         │    explanation  │             │
│    expertise_   │         │    status       │             │
│    area         │         └───────┬─────────┘             │
│    is_          │                 │                       │
│    coordinator  │                 │ 1:N                   │
└───────┬─────────┘                 ▼                       │
        │               ┌─────────────────┐                 │
        │               │    LEXICON      │                 │
        │ 1:N           ├─────────────────┤                 │
        └──────────────►│ PK lexicon_id   │                 │
                        │ FK domain_id    │                 │
                        │ FK contributor_ │                 │
                        │    id           │                 │
                        │    slug         │                 │
                        │    lexicon_word │                 │
                        │    translation  │                 │
                        │    status       │                 │
                        └───────┬─────────┘                 │
                                │                           │
                    ┌───────────┼───────────┐               │
                    │           │           │               │
                    ▼           ▼           ▼               │
          ┌─────────────┐ ┌───────────┐ ┌──────────────────┐│
          │LEXICON_ASSET│ │LEXICON_REF│ │    ASSET         ││
          ├─────────────┤ ├───────────┤ ├──────────────────┤│
          │ PK,FK       │ │ PK,FK     │ │ PK asset_id      ││
          │   lexicon_id│ │  lexicon_ │ │    file_name     ││
          │ PK,FK       │ │  id       │ │    file_type     ││
          │   asset_id  │ │ PK,FK     │ │    url           ││
          │   asset_role│ │  reference│ │    description   ││
          └──────┬──────┘ │  _id      │ │    status        ││
                 │        └─────┬─────┘ └────────┬─────────┘│
                 │              │                │          │
                 │              ▼                │          │
                 │      ┌─────────────┐          │          │
                 │      │  REFERENCE  │          │          │
                 │      ├─────────────┤          │          │
                 │      │ PK reference│          │          │
                 │      │    _id      │          │          │
                 │      │    title    │          │          │
                 │      │    reference│          │          │
                 │      │    _type    │          │          │
                 │      │    authors  │          │          │
                 │      │    status   │          │          │
                 │      └─────────────┘          │          │
                 │                               │          │
                 └───────────────────────────────┘          │
                                                            │
```

---

## Relasi Database

### One-to-Many (1:N) Relations

| Parent | Child | FK Column | Description |
|--------|-------|-----------|-------------|
| Culture | Subculture | culture_id | Culture memiliki banyak Subculture |
| Subculture | CodificationDomain | subculture_id | Subculture memiliki banyak Domain |
| CodificationDomain | Lexicon | domain_id | Domain memiliki banyak Lexicon |
| Contributor | Lexicon | contributor_id | Contributor membuat banyak Lexicon |
| Reference | AboutReference | reference_id | Reference ditampilkan di About page |

### Many-to-Many (M:N) Relations

| Entity A | Entity B | Junction Table | Description |
|----------|----------|----------------|-------------|
| Lexicon | Asset | LEXICON_ASSETS | Lexicon memiliki banyak Asset |
| Subculture | Asset | SUBCULTURE_ASSETS | Subculture memiliki banyak Asset |
| Culture | Asset | CULTURE_ASSETS | Culture memiliki banyak Asset |
| Contributor | Asset | CONTRIBUTOR_ASSETS | Contributor memiliki banyak Asset |
| Lexicon | Reference | LEXICON_REFERENCE | Lexicon mengutip banyak Reference |
| Subculture | Reference | SUBCULTURE_REFERENCE | Subculture mengutip banyak Reference |
| Culture | Reference | CULTURE_REFERENCE | Culture mengutip banyak Reference |

---

## 📁 File Diagram

| Format | Location | Tool |
|--------|----------|------|
| PlantUML | `SKRIPSI_DIAGRAMS/database/ERD_CROWFOOT.puml` | PlantUML/VS Code |
| Mermaid | `SKRIPSI_DIAGRAMS/database/ERD_MERMAID.md` | Mermaid/GitHub |
| Draw.io | Export from PlantUML | draw.io |

---

*Generated from Prisma Schema - December 2025*
