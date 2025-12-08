# Domain Kodifikasi Management API Documentation

## Overview
Domain Kodifikasi Management API menyediakan endpoint untuk mengelola domain kodifikasi dalam sistem Leksikon Budaya. Domain kodifikasi adalah kategori atau klasifikasi yang mengorganisir leksikon dalam subbudaya tertentu.

## Base URL
`/api/v1/admin/domain-kodifikasi/`

## Authentication
Semua endpoint memerlukan JWT authentication dengan header `Authorization: Bearer <token>`

---

## 1. BASIC CRUD OPERATIONS

### 1.1 Get All Domains
**Endpoint**: `GET /api/v1/admin/domain-kodifikasi`

**Deskripsi**: Mengambil semua domain kodifikasi dengan pagination

**Query Parameters**:
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**:
```json
{
  "success": true,
  "message": "Domains retrieved successfully",
  "data": [
    {
      "id": 1,
      "code": "TA001",
      "domainName": "Traditional Arts",
      "explanation": "Domain covering traditional art forms and practices",
      "subcultureId": 1,
      "status": "PUBLISHED",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "subculture": {
        "id": 1,
        "subcultureName": "Javanese Traditional Dance",
        "culture": {
          "id": 1,
          "cultureName": "Javanese Culture"
        }
      }
    }
  ],
  "total": 1,
  "pagination": {
    "page": 1,
    "limit": 20,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 1.2 Create Domain
**Endpoint**: `POST /api/v1/admin/domain-kodifikasi`

**Deskripsi**: Membuat domain kodifikasi baru

**Request Body**:
```json
{
  "code": "TA001",
  "domainName": "Traditional Arts",
  "explanation": "Domain covering traditional art forms and practices",
  "subcultureId": 1,
  "status": "DRAFT"
}
```

**Field Descriptions**:
- `code`: Kode unik domain (required, format: [A-Z]{2,3}[0-9]{3})
- `domainName`: Nama domain (required)
- `explanation`: Penjelasan domain (required)
- `subcultureId`: ID subbudaya induk (required)
- `status`: Status publikasi (DRAFT, PUBLISHED, ARCHIVED)

**Response**:
```json
{
  "success": true,
  "message": "Domain created successfully",
  "data": {
    "id": 1,
    "code": "TA001",
    "domainName": "Traditional Arts",
    "explanation": "Domain covering traditional art forms and practices",
    "subcultureId": 1,
    "status": "DRAFT",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Contoh Request**:
```bash
curl -X POST http://localhost:3000/api/v1/admin/domain-kodifikasi \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TA001",
    "domainName": "Traditional Arts",
    "explanation": "Domain covering traditional art forms and practices",
    "subcultureId": 1,
    "status": "DRAFT"
  }'
```

### 1.3 Get Domain by ID
**Endpoint**: `GET /api/v1/admin/domain-kodifikasi/:id`

**Deskripsi**: Mengambil detail domain kodifikasi berdasarkan ID

**Path Parameters**:
- `id` (number, required): Domain Kodifikasi ID

**Response**:
```json
{
  "success": true,
  "message": "Domain retrieved successfully",
  "data": {
    "id": 1,
    "code": "TA001",
    "domainName": "Traditional Arts",
    "explanation": "Domain covering traditional art forms and practices",
    "subcultureId": 1,
    "status": "PUBLISHED",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "subculture": {
      "id": 1,
      "subcultureName": "Javanese Traditional Dance",
      "culture": {
        "id": 1,
        "cultureName": "Javanese Culture",
        "originIsland": "Java"
      }
    },
    "lexicons": [
      {
        "id": 1,
        "term": "Tari Legong",
        "definition": "Traditional Balinese dance form",
        "status": "PUBLISHED"
      }
    ]
  }
}
```

### 1.4 Update Domain
**Endpoint**: `PUT /api/v1/admin/domain-kodifikasi/:id`

**Deskripsi**: Update data domain kodifikasi

**Path Parameters**:
- `id` (number, required): Domain Kodifikasi ID

**Request Body**: Sama dengan create (semua field optional)

**Response**: Sama dengan create

### 1.5 Delete Domain
**Endpoint**: `DELETE /api/v1/admin/domain-kodifikasi/:id`

**Deskripsi**: Hapus domain kodifikasi

**Path Parameters**:
- `id` (number, required): Domain Kodifikasi ID

**Response**:
```json
{
  "success": true,
  "message": "Domain deleted successfully",
  "data": null
}
```

---

## 2. SEARCH & FILTER OPERATIONS

### 2.1 Filter Domains
**Endpoint**: `GET /api/v1/admin/domain-kodifikasi/filter`

**Deskripsi**: Filter domain kodifikasi berdasarkan code dan/atau status dengan pagination

**Query Parameters**:
- `code` (string, optional): Code filter (partial match, case insensitive)
- `status` (string, optional): Status filter (DRAFT, PUBLISHED, ARCHIVED)
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of domains yang match dengan filter criteria

**Contoh Request**:
```bash
# Filter by status
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/filter?status=PUBLISHED&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by partial code
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/filter?code=TA&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by both code and status
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/filter?code=TA&status=PUBLISHED&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2.2 Search Domains
**Endpoint**: `GET /api/v1/admin/domain-kodifikasi/search`

**Deskripsi**: Search domain kodifikasi berdasarkan query di code, domainName, dan explanation

**Query Parameters**:
- `q` (string, required): Search query
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of domains yang match dengan search query

**Contoh Request**:
```bash
# Search by domain name
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/search?q=traditional&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search by code
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/search?q=TA001&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 3. DATA MODEL

### Domain Kodifikasi Schema
```typescript
{
  id: number;
  code: string; // Required, unique, format: [A-Z]{2,3}[0-9]{3}
  domainName: string; // Required
  explanation: string; // Required
  subcultureId: number; // Required (foreign key)
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 4. BUSINESS RULES

### 4.1 Domain Creation
- `code` harus unik di seluruh sistem
- Format code: 2-3 huruf kapital diikuti 3 digit (contoh: TA001, MUS002, ART015)
- `domainName` dan `explanation` wajib diisi
- `subcultureId` harus valid dan merujuk ke subculture yang ada
- Status default adalah `DRAFT`

### 4.2 Code Format Rules
- **Prefix**: Mengindikasikan kategori domain
  - `TA`: Traditional Arts (Seni Tradisional)
  - `MU`: Music (Musik)
  - `DA`: Dance (Tari)
  - `TH`: Theater (Teater)
  - `CR`: Craft (Kerajinan)
  - `FO`: Food (Makanan)
  - `CE`: Ceremony (Upacara)
  - `LA`: Language (Bahasa)
  - `MY`: Mythology (Mitologi)
  - `CU`: Custom (Adat Istiadat)

- **Numbering**: 3 digit sequential dalam kategori

### 4.3 Hierarchical Relationship
- Domain berada di bawah Subculture
- Subculture berada di bawah Culture
- Domain dapat memiliki multiple Lexicons
- Domain code harus unik across all cultures

### 4.4 Status Management
- `DRAFT`: Domain dalam development
- `PUBLISHED`: Domain aktif dan dapat digunakan
- `ARCHIVED`: Domain tidak aktif (tidak dihapus untuk maintain referential integrity)

---

## 5. ERROR RESPONSES

### 5.1 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "code",
        "message": "Code is required and must follow format [A-Z]{2,3}[0-9]{3}"
      },
      {
        "field": "domainName",
        "message": "Domain name is required"
      },
      {
        "field": "subcultureId",
        "message": "Valid subculture ID is required"
      }
    ]
  }
}
```

### 5.2 Duplicate Code Error
```json
{
  "success": false,
  "message": "Domain code already exists",
  "data": null
}
```

### 5.3 Invalid Code Format Error
```json
{
  "success": false,
  "message": "Invalid code format. Expected format: [A-Z]{2,3}[0-9]{3} (e.g., TA001, MUS002)",
  "data": null
}
```

### 5.4 Not Found Error
```json
{
  "success": false,
  "message": "Domain not found",
  "data": null
}
```

### 5.5 Foreign Key Constraint Error
```json
{
  "success": false,
  "message": "Invalid subculture ID",
  "data": null
}
```

---

## 6. USAGE EXAMPLES

### 6.1 Complete Domain Management Flow

```bash
# 1. Create domain
curl -X POST http://localhost:3000/api/v1/admin/domain-kodifikasi \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TA001",
    "domainName": "Traditional Arts",
    "explanation": "Domain covering traditional art forms and practices",
    "subcultureId": 1,
    "status": "DRAFT"
  }'

# 2. Get domain details
curl http://localhost:3000/api/v1/admin/domain-kodifikasi/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Search domains
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/search?q=traditional&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 4. Filter domains by status
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/filter?status=PUBLISHED&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 5. Filter domains by partial code
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/filter?code=TA&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 6. Update domain
curl -X PUT http://localhost:3000/api/v1/admin/domain-kodifikasi/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PUBLISHED",
    "explanation": "Domain covering traditional art forms, practices, and contemporary adaptations"
  }'
```

### 6.2 Code Format Examples

```bash
# Traditional Arts domains
curl -X POST http://localhost:3000/api/v1/admin/domain-kodifikasi \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TA001",
    "domainName": "Painting",
    "explanation": "Traditional painting techniques and styles",
    "subcultureId": 1
  }'

curl -X POST http://localhost:3000/api/v1/admin/domain-kodifikasi \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "TA002",
    "domainName": "Sculpture",
    "explanation": "Traditional sculpture and carving techniques",
    "subcultureId": 1
  }'

# Music domains
curl -X POST http://localhost:3000/api/v1/admin/domain-kodifikasi \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "MU001",
    "domainName": "Gamelan",
    "explanation": "Traditional Indonesian gamelan music",
    "subcultureId": 2
  }'

# Dance domains
curl -X POST http://localhost:3000/api/v1/admin/domain-kodifikasi \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "DA001",
    "domainName": "Legong Dance",
    "explanation": "Traditional Balinese Legong dance forms",
    "subcultureId": 3
  }'
```

### 6.3 Advanced Filtering

```bash
# Find all published domains with code starting with 'TA'
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/filter?code=TA&status=PUBLISHED&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search for domains containing 'music' or 'musical'
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/search?q=music&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get all draft domains for review
curl "http://localhost:3000/api/v1/admin/domain-kodifikasi/filter?status=DRAFT&page=1&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 7. CODE FORMAT STANDARDS

### 7.1 Domain Code Structure
```
[Prefix][Number]
```

**Prefix Categories:**
- `TA`: Traditional Arts (Seni Tradisional)
- `MU`: Music (Musik)
- `DA`: Dance (Tari)
- `TH`: Theater (Teater)
- `CR`: Craft (Kerajinan)
- `FO`: Food (Makanan)
- `CE`: Ceremony (Upacara)
- `LA`: Language (Bahasa)
- `MY`: Mythology (Mitologi)
- `CU`: Custom (Adat Istiadat)
- `RE`: Religion (Agama)
- `SO`: Social Structure (Struktur Sosial)
- `EC`: Economy (Ekonomi)
- `TE`: Technology (Teknologi)

### 7.2 Code Assignment Guidelines
- **Sequential Numbering**: Gunakan numbering sequential dalam kategori yang sama
- **Unique Across System**: Code harus unik di seluruh sistem
- **Consistent Prefix**: Gunakan prefix yang konsisten untuk kategori serupa
- **Future Expansion**: Sisakan ruang untuk expansion (gunakan 001-999 per kategori)

### 7.3 Examples of Valid Codes
```
TA001 - Traditional Arts: Painting
TA002 - Traditional Arts: Sculpture
TA003 - Traditional Arts: Textile
MU001 - Music: Gamelan
MU002 - Music: Angklung
DA001 - Dance: Legong
DA002 - Dance: Kecak
CR001 - Craft: Wood Carving
CR002 - Craft: Silver Smithing
```

---

## 8. NOTES

- **Unique Code Constraint**: Code domain harus unik across seluruh sistem
- **Hierarchical Position**: Domain berada di level terbawah dalam hierarki Culture → Subculture → Domain → Lexicon
- **Code Format Enforcement**: API akan validate format code secara strict
- **Referential Integrity**: Domain dapat memiliki multiple lexicons tapi hanya satu subculture
- **Status Lifecycle**: Draft → Published → Archived (tidak dihapus untuk maintain data integrity)
- **Search Flexibility**: Search mencakup code, name, dan explanation untuk comprehensive discovery
- **Filter Combination**: Code dan status filter dapat dikombinasikan untuk query yang spesifik
- **Pagination**: Semua list endpoints mendukung pagination
- **Case Insensitive**: Code search bersifat case insensitive untuk kemudahan penggunaan</content>
<parameter name="filePath">d:\my-code\1_home\leksikon-proj\leksikon-be-2\DOMAIN_KODIFIKASI_API_DOCUMENTATION.md