# ERD Mermaid - Leksikon Database

## Crow's Foot ERD Diagram

```mermaid
erDiagram
    %% ===========================================
    %% MAIN ENTITIES
    %% ===========================================
    
    ADMIN {
        int admin_id PK
        varchar username UK
        varchar email UK
        varchar password
        enum role
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    CULTURE {
        int culture_id PK
        varchar slug UK
        varchar culture_name
        varchar origin_island
        varchar province
        varchar city_region
        varchar classification
        text characteristics
        enum conservation_status
        float latitude
        float longitude
        enum status
        timestamp created_at
        timestamp updated_at
    }
    
    SUBCULTURE {
        int subculture_id PK
        varchar slug UK
        varchar subculture_name
        text traditional_greeting
        varchar greeting_meaning
        text explanation
        int culture_id FK
        enum status
        enum display_priority_status
        enum conservation_status
        timestamp created_at
        timestamp updated_at
    }
    
    CODIFICATION_DOMAIN {
        int domain_id PK
        varchar code
        varchar domain_name
        text explanation
        int subculture_id FK
        enum status
        timestamp created_at
        timestamp updated_at
    }
    
    LEXICON {
        int lexicon_id PK
        varchar slug UK
        varchar lexicon_word
        varchar ipa_phonetic
        varchar transliteration
        text etymological_meaning
        text cultural_meaning
        text common_meaning
        varchar translation
        varchar variant
        varchar variant_translations
        text other_description
        int domain_id FK
        enum preservation_status
        int contributor_id FK
        enum status
        timestamp created_at
        timestamp updated_at
    }
    
    CONTRIBUTOR {
        int contributor_id PK
        varchar contributor_name
        varchar institution
        varchar email
        varchar expertise_area
        varchar contact_info
        enum display_priority_status
        boolean is_coordinator
        enum coordinator_status
        timestamp registered_at
    }
    
    ASSET {
        int asset_id PK
        varchar file_name
        enum file_type
        text description
        varchar url
        varchar file_size
        varchar hash_checksum
        text metadata_json
        enum status
        timestamp created_at
        timestamp updated_at
    }
    
    REFERENCE {
        int reference_id PK
        varchar title
        enum reference_type
        text description
        varchar url
        varchar authors
        varchar publication_year
        varchar topic_category
        enum status
        timestamp created_at
        timestamp updated_at
    }
    
    ABOUT_REFERENCE {
        int about_reference_id PK
        int reference_id FK
        int display_order
        boolean is_active
        timestamp created_at
        timestamp updated_at
    }
    
    %% ===========================================
    %% JUNCTION TABLES
    %% ===========================================
    
    LEXICON_ASSETS {
        int lexicon_id PK_FK
        int asset_id PK_FK
        enum asset_role
        timestamp created_at
    }
    
    SUBCULTURE_ASSETS {
        int subculture_id PK_FK
        int asset_id PK_FK
        enum asset_role PK
        timestamp created_at
    }
    
    CULTURE_ASSETS {
        int culture_id PK_FK
        int asset_id PK_FK
        enum asset_role
        timestamp created_at
    }
    
    CONTRIBUTOR_ASSETS {
        int contributor_id PK_FK
        int asset_id PK_FK
        enum asset_note
        timestamp created_at
    }
    
    LEXICON_REFERENCE {
        int lexicon_id PK_FK
        int reference_id PK_FK
        enum reference_role
        int display_order
        timestamp created_at
    }
    
    SUBCULTURE_REFERENCE {
        int subculture_id PK_FK
        int reference_id PK_FK
        enum reference_role
        int display_order
        timestamp created_at
    }
    
    CULTURE_REFERENCE {
        int culture_id PK_FK
        int reference_id PK_FK
        enum reference_role
        int display_order
        timestamp created_at
    }
    
    %% ===========================================
    %% RELATIONSHIPS
    %% ===========================================
    
    %% One-to-Many: Culture -> Subculture
    CULTURE ||--o{ SUBCULTURE : "has"
    
    %% One-to-Many: Subculture -> CodificationDomain
    SUBCULTURE ||--o{ CODIFICATION_DOMAIN : "contains"
    
    %% One-to-Many: CodificationDomain -> Lexicon
    CODIFICATION_DOMAIN ||--o{ LEXICON : "defines"
    
    %% One-to-Many: Contributor -> Lexicon
    CONTRIBUTOR ||--o{ LEXICON : "contributes"
    
    %% One-to-Many: Reference -> AboutReference
    REFERENCE ||--o{ ABOUT_REFERENCE : "displayed_on"
    
    %% Many-to-Many: Lexicon <-> Asset
    LEXICON ||--o{ LEXICON_ASSETS : "has"
    ASSET ||--o{ LEXICON_ASSETS : "used_in"
    
    %% Many-to-Many: Subculture <-> Asset
    SUBCULTURE ||--o{ SUBCULTURE_ASSETS : "has"
    ASSET ||--o{ SUBCULTURE_ASSETS : "used_in"
    
    %% Many-to-Many: Culture <-> Asset
    CULTURE ||--o{ CULTURE_ASSETS : "has"
    ASSET ||--o{ CULTURE_ASSETS : "used_in"
    
    %% Many-to-Many: Contributor <-> Asset
    CONTRIBUTOR ||--o{ CONTRIBUTOR_ASSETS : "has"
    ASSET ||--o{ CONTRIBUTOR_ASSETS : "used_in"
    
    %% Many-to-Many: Lexicon <-> Reference
    LEXICON ||--o{ LEXICON_REFERENCE : "cites"
    REFERENCE ||--o{ LEXICON_REFERENCE : "cited_by"
    
    %% Many-to-Many: Subculture <-> Reference
    SUBCULTURE ||--o{ SUBCULTURE_REFERENCE : "cites"
    REFERENCE ||--o{ SUBCULTURE_REFERENCE : "cited_by"
    
    %% Many-to-Many: Culture <-> Reference
    CULTURE ||--o{ CULTURE_REFERENCE : "cites"
    REFERENCE ||--o{ CULTURE_REFERENCE : "cited_by"
```

## Simplified ERD (Core Entities Only)

```mermaid
erDiagram
    CULTURE ||--o{ SUBCULTURE : "has many"
    SUBCULTURE ||--o{ CODIFICATION_DOMAIN : "contains"
    CODIFICATION_DOMAIN ||--o{ LEXICON : "defines"
    CONTRIBUTOR ||--o{ LEXICON : "contributes"
    
    LEXICON }o--o{ ASSET : "has"
    LEXICON }o--o{ REFERENCE : "cites"
    
    SUBCULTURE }o--o{ ASSET : "has"
    SUBCULTURE }o--o{ REFERENCE : "cites"
    
    CULTURE }o--o{ ASSET : "has"
    CULTURE }o--o{ REFERENCE : "cites"
    
    CONTRIBUTOR }o--o{ ASSET : "has"
    
    REFERENCE ||--o{ ABOUT_REFERENCE : "displayed_on"
```

## Crow's Foot Notation Legend

| Symbol | Meaning |
|--------|---------|
| `\|\|` | One (mandatory) |
| `\|o` | Zero or One (optional) |
| `o{` | Zero or Many |
| `\|{` | One or Many |
| `--` | Relationship line |
| `PK` | Primary Key |
| `FK` | Foreign Key |
| `UK` | Unique Key |

## Entity Colors (for Visual Paradigm / draw.io)

| Entity Type | Color | Hex Code |
|-------------|-------|----------|
| Main Entities | Light Blue | #E3F2FD |
| Junction Tables | Light Orange | #FFF3E0 |
| Enum Values | Light Purple | #F3E5F5 |
| Primary Keys | Gold | #FFD700 |
| Foreign Keys | Tomato | #FF6347 |

---

*Generated from Prisma Schema - December 2025*
