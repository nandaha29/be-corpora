# Subculture Management API Documentation

## Overview
Subculture Management API menyediakan endpoint untuk mengelola subbudaya dalam sistem Leksikon Budaya. API ini mencakup operasi CRUD dasar, manajemen asset dan referensi, pencarian, filter, serta hubungan dengan budaya induk.

## Base URL
`/api/v1/admin/subcultures/`

## Authentication
Semua endpoint memerlukan JWT authentication dengan header `Authorization: Bearer <token>`

---

## 1. BASIC CRUD OPERATIONS

### 1.1 Get All Subcultures
**Endpoint**: `GET /api/v1/admin/subcultures`

**Deskripsi**: Mengambil semua subbudaya dengan pagination

**Query Parameters**:
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**:
```json
{
  "success": true,
  "message": "Subcultures retrieved successfully",
  "data": [
    {
      "id": 1,
      "subcultureName": "Javanese Traditional Dance",
      "traditionalGreeting": "Sugeng rawuh",
      "greetingMeaning": "Welcome",
      "explanation": "Traditional dance forms from Java",
      "cultureId": 1,
      "status": "PUBLISHED",
      "conservationStatus": "MAINTAINED",
      "displayPriorityStatus": "HIGH",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "culture": {
        "id": 1,
        "cultureName": "Javanese Culture"
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

### 1.2 Create Subculture
**Endpoint**: `POST /api/v1/admin/subcultures`

**Deskripsi**: Membuat subbudaya baru

**Request Body**:
```json
{
  "subcultureName": "Javanese Traditional Dance",
  "traditionalGreeting": "Sugeng rawuh",
  "greetingMeaning": "Welcome",
  "explanation": "Traditional dance forms from Java",
  "cultureId": 1,
  "status": "DRAFT",
  "conservationStatus": "MAINTAINED",
  "displayPriorityStatus": "HIGH"
}
```

**Field Descriptions**:
- `subcultureName`: Nama subbudaya (required)
- `traditionalGreeting`: Salam tradisional (optional)
- `greetingMeaning`: Arti salam (optional)
- `explanation`: Penjelasan subbudaya (optional)
- `cultureId`: ID budaya induk (required)
- `status`: Status publikasi (DRAFT, PUBLISHED, ARCHIVED)
- `conservationStatus`: Status konservasi (MAINTAINED, TREATED, CRITICAL, ARCHIVED)
- `displayPriorityStatus`: Prioritas tampilan (HIGH, MEDIUM, LOW)

**Response**:
```json
{
  "success": true,
  "message": "Subculture created successfully",
  "data": {
    "id": 1,
    "subcultureName": "Javanese Traditional Dance",
    "traditionalGreeting": "Sugeng rawuh",
    "greetingMeaning": "Welcome",
    "explanation": "Traditional dance forms from Java",
    "cultureId": 1,
    "status": "DRAFT",
    "conservationStatus": "MAINTAINED",
    "displayPriorityStatus": "HIGH",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Contoh Request**:
```bash
curl -X POST http://localhost:3000/api/v1/admin/subcultures \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subcultureName": "Javanese Traditional Dance",
    "traditionalGreeting": "Sugeng rawuh",
    "greetingMeaning": "Welcome",
    "explanation": "Traditional dance forms from Java",
    "cultureId": 1,
    "status": "DRAFT",
    "conservationStatus": "MAINTAINED",
    "displayPriorityStatus": "HIGH"
  }'
```

### 1.3 Get Subculture by ID
**Endpoint**: `GET /api/v1/admin/subcultures/:id`

**Deskripsi**: Mengambil detail subbudaya berdasarkan ID

**Path Parameters**:
- `id` (number, required): Subculture ID

**Response**:
```json
{
  "success": true,
  "message": "Subculture retrieved successfully",
  "data": {
    "id": 1,
    "subcultureName": "Javanese Traditional Dance",
    "traditionalGreeting": "Sugeng rawuh",
    "greetingMeaning": "Welcome",
    "explanation": "Traditional dance forms from Java",
    "cultureId": 1,
    "status": "PUBLISHED",
    "conservationStatus": "MAINTAINED",
    "displayPriorityStatus": "HIGH",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "culture": {
      "id": 1,
      "cultureName": "Javanese Culture",
      "originIsland": "Java"
    },
    "assignedAssets": [],
    "assignedReferences": []
  }
}
```

### 1.4 Update Subculture
**Endpoint**: `PUT /api/v1/admin/subcultures/:id`

**Deskripsi**: Update data subbudaya

**Path Parameters**:
- `id` (number, required): Subculture ID

**Request Body**: Sama dengan create (semua field optional)

**Response**: Sama dengan create

### 1.5 Delete Subculture
**Endpoint**: `DELETE /api/v1/admin/subcultures/:id`

**Deskripsi**: Hapus subbudaya

**Path Parameters**:
- `id` (number, required): Subculture ID

**Response**:
```json
{
  "success": true,
  "message": "Subculture deleted successfully",
  "data": null
}
```

---

## 2. SEARCH & FILTER OPERATIONS

### 2.1 Get Filtered Subcultures
**Endpoint**: `GET /api/v1/admin/subcultures/filter`

**Deskripsi**: Filter subbudaya berdasarkan berbagai kriteria (kombinasi)

**Query Parameters**:
- `status` (string, optional): Status publikasi (DRAFT, PUBLISHED, ARCHIVED)
- `displayPriorityStatus` (string, optional): Prioritas tampilan (HIGH, MEDIUM, LOW)
- `conservationStatus` (string, optional): Status konservasi (MAINTAINED, TREATED, CRITICAL, ARCHIVED)
- `cultureId` (number, optional): ID budaya induk
- `search` (string, optional): Kata kunci pencarian (nama subbudaya)
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of subcultures dengan pagination

**Contoh Request**:
```bash
# Filter by status and priority
curl "http://localhost:3000/api/v1/admin/subcultures/filter?status=PUBLISHED&displayPriorityStatus=HIGH&cultureId=1&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search by name
curl "http://localhost:3000/api/v1/admin/subcultures/filter?search=dance&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 3. ASSET MANAGEMENT

### 3.1 Get Assigned Assets
**Endpoint**: `GET /api/v1/admin/subcultures/:id/assigned-assets`

**Deskripsi**: Melihat semua asset yang sudah di-assign ke subbudaya tertentu

**Path Parameters**:
- `id` (number, required): Subculture ID

**Response**:
```json
{
  "success": true,
  "message": "Assigned assets retrieved successfully",
  "data": [
    {
      "id": 1,
      "fileName": "dance_performance.jpg",
      "fileType": "PHOTO",
      "description": "Traditional dance performance",
      "url": "https://blob.storage/dance.jpg",
      "assetRole": "GALLERY",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 3.2 Filter Subculture Assets
**Endpoint**: `GET /api/v1/admin/subcultures/:id/filter-assets`

**Deskripsi**: Filter asset subbudaya berdasarkan Type, Role, Status (kombinasi)

**Path Parameters**:
- `id` (number, required): Subculture ID

**Query Parameters**:
- `type` (string, optional): Tipe asset (PHOTO, AUDIO, VIDEO, MODEL_3D)
- `assetRole` (string, optional): Peran asset (GALLERY, PRONUNCIATION, VIDEO_DEMO, MODEL_3D)
- `status` (string, optional): Status asset (ACTIVE, PROCESSING, ARCHIVED, CORRUPTED)
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Filtered assets dengan pagination

### 3.3 Search Assets in Subculture
**Endpoint**: `GET /api/v1/admin/subcultures/:id/search-assets`

**Deskripsi**: Mencari asset yang sudah di-assign ke subbudaya berdasarkan nama file atau deskripsi

**Path Parameters**:
- `id` (number, required): Subculture ID

**Query Parameters**:
- `q` (string, required): Kata kunci pencarian

**Response**: Array of matching assets

### 3.4 Legacy Asset Management
**Endpoint**: `GET /api/v1/admin/subcultures/:id/assets`

**Deskripsi**: Melihat semua asset yang terkait dengan subbudaya (legacy endpoint)

**Endpoint**: `POST /api/v1/admin/subcultures/:id/assets`

**Deskripsi**: Menambahkan asset ke subbudaya (legacy)

**Endpoint**: `DELETE /api/v1/admin/subcultures/:id/assets/:assetId`

**Deskripsi**: Menghapus asset dari subbudaya (legacy)

---

## 4. REFERENCE MANAGEMENT

### 4.1 Get Assigned References
**Endpoint**: `GET /api/v1/admin/subcultures/:id/assigned-references`

**Deskripsi**: Melihat semua referensi yang digunakan oleh leksikon dalam subbudaya tertentu

**Path Parameters**:
- `id` (number, required): Subculture ID

**Response**:
```json
{
  "success": true,
  "message": "Assigned references retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Traditional Javanese Dance",
      "authors": "Dr. Ahmad Santoso",
      "referenceType": "BOOK",
      "publicationYear": "2020",
      "referenceRole": "PRIMARY_SOURCE",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 4.2 Add Reference Direct
**Endpoint**: `POST /api/v1/admin/subcultures/:id/references-direct`

**Deskripsi**: Assign reference directly to SubcultureReference (untuk halaman subbudaya)

**Path Parameters**:
- `id` (number, required): Subculture ID

**Request Body**:
```json
{
  "referenceId": 1,
  "displayOrder": 1,
  "referenceRole": "PRIMARY_SOURCE"
}
```

**Reference Role Options**:
- `PRIMARY_SOURCE`: Sumber utama
- `SECONDARY_SOURCE`: Sumber sekunder
- `ADDITIONAL_READING`: Bacaan tambahan

**Response**:
```json
{
  "success": true,
  "message": "Reference added to subculture successfully",
  "data": {
    "subcultureId": 1,
    "referenceId": 1,
    "displayOrder": 1,
    "referenceRole": "PRIMARY_SOURCE",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4.3 Get Subculture References Direct
**Endpoint**: `GET /api/v1/admin/subcultures/:id/references-direct`

**Deskripsi**: Get all references assigned directly to subculture

**Path Parameters**:
- `id` (number, required): Subculture ID

**Response**: Array of direct references

### 4.4 Remove Reference Direct
**Endpoint**: `DELETE /api/v1/admin/subcultures/:id/references-direct/:referenceId`

**Deskripsi**: Remove reference from SubcultureReference

**Path Parameters**:
- `id` (number, required): Subculture ID
- `referenceId` (number, required): Reference ID

**Response**:
```json
{
  "success": true,
  "message": "Reference removed from subculture successfully",
  "data": null
}
```

### 4.5 Filter Subculture References
**Endpoint**: `GET /api/v1/admin/subcultures/:id/filter-references`

**Deskripsi**: Filter referensi subbudaya berdasarkan Type, Year, Status, ReferenceRole (kombinasi)

**Path Parameters**:
- `id` (number, required): Subculture ID

**Query Parameters**:
- `referenceType` (string, optional): Tipe referensi (JOURNAL, BOOK, ARTICLE, WEBSITE, REPORT)
- `publicationYear` (string, optional): Tahun publikasi
- `status` (string, optional): Status referensi (DRAFT, PUBLISHED, ARCHIVED)
- `referenceRole` (string, optional): Peran referensi
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

### 4.6 Search References in Subculture
**Endpoint**: `GET /api/v1/admin/subcultures/:id/search-references`

**Deskripsi**: Mencari referensi yang digunakan di subbudaya berdasarkan judul, deskripsi, atau penulis

**Path Parameters**:
- `id` (number, required): Subculture ID

**Query Parameters**:
- `q` (string, required): Kata kunci pencarian

---

## 5. RELATIONSHIP MANAGEMENT

### 5.1 Get Subcultures by Culture
**Endpoint**: `GET /api/v1/admin/subcultures/:cultureId/subcultures`

**Deskripsi**: Mengambil semua subbudaya dalam budaya tertentu

**Path Parameters**:
- `cultureId` (number, required): Culture ID

**Response**: Array of subcultures dalam culture tersebut

---

## 6. ORPHAN DATA DETECTION

### 6.1 Get Asset Usage
**Endpoint**: `GET /api/v1/admin/subcultures/assets/:assetId/usage`

**Deskripsi**: Melihat di subbudaya mana saja asset tertentu digunakan (orphan detection)

**Path Parameters**:
- `assetId` (number, required): Asset ID

**Response**:
```json
{
  "success": true,
  "message": "Asset usage retrieved successfully",
  "data": [
    {
      "subcultureId": 1,
      "subcultureName": "Javanese Traditional Dance",
      "assetRole": "GALLERY",
      "assignedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### 6.2 Get Reference Usage
**Endpoint**: `GET /api/v1/admin/subcultures/references/:referenceId/usage`

**Deskripsi**: Melihat di subbudaya mana saja referensi tertentu digunakan (orphan detection)

**Path Parameters**:
- `referenceId` (number, required): Reference ID

**Response**: Sama dengan asset usage

---

## 7. DATA MODEL

### Subculture Schema
```typescript
{
  id: number;
  subcultureName: string; // Required
  traditionalGreeting: string; // Optional
  greetingMeaning: string; // Optional
  explanation: string; // Optional
  cultureId: number; // Required (foreign key)
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  conservationStatus: 'MAINTAINED' | 'TREATED' | 'CRITICAL' | 'ARCHIVED';
  displayPriorityStatus: 'HIGH' | 'MEDIUM' | 'LOW';
  createdAt: Date;
  updatedAt: Date;
}
```

### Subculture Asset Relationship
```typescript
{
  subcultureId: number;
  assetId: number;
  assetRole: 'GALLERY' | 'PRONUNCIATION' | 'VIDEO_DEMO' | 'MODEL_3D';
  createdAt: Date;
}
```

### Subculture Reference Relationship
```typescript
{
  subcultureId: number;
  referenceId: number;
  referenceRole: 'PRIMARY_SOURCE' | 'SECONDARY_SOURCE' | 'ADDITIONAL_READING';
  displayOrder: number;
  createdAt: Date;
}
```

---

## 8. BUSINESS RULES

### 8.1 Subculture Creation
- `cultureId` harus valid dan merujuk ke culture yang ada
- `subcultureName` harus unik dalam culture yang sama
- Status default adalah `DRAFT`

### 8.2 Asset Management
- Asset dapat di-assign ke subculture dengan peran tertentu
- Satu asset dapat digunakan oleh multiple subcultures
- Asset role menentukan bagaimana asset ditampilkan

### 8.3 Reference Management
- Reference dapat di-assign langsung ke subculture (untuk halaman subculture)
- Reference juga dapat di-assign melalui leksikon dalam subculture
- Display order menentukan urutan tampilan

### 8.4 Status Management
- `status`: Mengontrol publikasi subculture
- `conservationStatus`: Status konservasi budaya
- `displayPriorityStatus`: Prioritas tampilan di UI

---

## 9. ERROR RESPONSES

### 9.1 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "cultureId",
        "message": "Culture ID is required"
      },
      {
        "field": "subcultureName",
        "message": "Subculture name is required"
      }
    ]
  }
}
```

### 9.2 Not Found Error
```json
{
  "success": false,
  "message": "Subculture not found",
  "data": null
}
```

### 9.3 Foreign Key Constraint Error
```json
{
  "success": false,
  "message": "Invalid culture ID",
  "data": null
}
```

### 9.4 Duplicate Name Error
```json
{
  "success": false,
  "message": "Subculture name already exists in this culture",
  "data": null
}
```

---

## 10. USAGE EXAMPLES

### 10.1 Complete Subculture Management Flow

```bash
# 1. Create subculture
curl -X POST http://localhost:3000/api/v1/admin/subcultures \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subcultureName": "Javanese Traditional Dance",
    "traditionalGreeting": "Sugeng rawuh",
    "greetingMeaning": "Welcome",
    "explanation": "Traditional dance forms from Java",
    "cultureId": 1,
    "status": "DRAFT",
    "conservationStatus": "MAINTAINED",
    "displayPriorityStatus": "HIGH"
  }'

# 2. Get subculture details
curl http://localhost:3000/api/v1/admin/subcultures/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Add reference directly to subculture
curl -X POST http://localhost:3000/api/v1/admin/subcultures/1/references-direct \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "referenceId": 1,
    "displayOrder": 1,
    "referenceRole": "PRIMARY_SOURCE"
  }'

# 4. Filter subcultures
curl "http://localhost:3000/api/v1/admin/subcultures/filter?status=PUBLISHED&cultureId=1&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 5. Get assigned assets
curl http://localhost:3000/api/v1/admin/subcultures/1/assigned-assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 6. Update subculture
curl -X PUT http://localhost:3000/api/v1/admin/subcultures/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PUBLISHED",
    "displayPriorityStatus": "HIGH"
  }'
```

### 10.2 Advanced Filtering

```bash
# Filter by multiple criteria
curl "http://localhost:3000/api/v1/admin/subcultures/filter?status=PUBLISHED&displayPriorityStatus=HIGH&conservationStatus=MAINTAINED&cultureId=1&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search within subculture assets
curl "http://localhost:3000/api/v1/admin/subcultures/1/search-assets?q=dance&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter subculture references
curl "http://localhost:3000/api/v1/admin/subcultures/1/filter-references?referenceType=BOOK&publicationYear=2020&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 10.3 Orphan Data Detection

```bash
# Check asset usage across subcultures
curl http://localhost:3000/api/v1/admin/subcultures/assets/123/usage \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check reference usage across subcultures
curl http://localhost:3000/api/v1/admin/subcultures/references/456/usage \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 11. NOTES

- **Hierarchical Structure**: Subculture berada di bawah Culture dalam hierarki budaya
- **Asset Roles**: Asset dapat memiliki peran berbeda (GALLERY, PRONUNCIATION, VIDEO_DEMO, MODEL_3D)
- **Reference Assignment**: Reference dapat di-assign langsung ke subculture atau melalui leksikon
- **Status Management**: Tiga jenis status (publikasi, konservasi, prioritas tampilan)
- **Legacy Endpoints**: Beberapa endpoint legacy masih tersedia untuk kompatibilitas
- **Orphan Detection**: Endpoint khusus untuk mendeteksi data yang tidak lagi digunakan
- **Pagination**: Semua list endpoints mendukung pagination
- **Search**: Pencarian bersifat case-insensitive dan partial matching</content>
<parameter name="filePath">d:\my-code\1_home\leksikon-proj\leksikon-be-2\SUBCULTURE_API_DOCUMENTATION.md