# Culture Management API Documentation

## Overview
Culture Management API menyediakan endpoint untuk mengelola budaya dalam sistem Leksikon Budaya. API ini mencakup operasi CRUD dasar, manajemen asset dan referensi, pencarian, filter, serta hubungan dengan subbudaya dan domain.

## Base URL
`/api/v1/admin/cultures/`

## Authentication
Semua endpoint memerlukan JWT authentication dengan header `Authorization: Bearer <token>`

---

## 1. BASIC CRUD OPERATIONS

### 1.1 Get All Cultures (Paginated)
**Endpoint**: `GET /api/v1/admin/cultures`

**Deskripsi**: Mengambil semua budaya dengan pagination

**Query Parameters**:
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**:
```json
{
  "success": true,
  "message": "Cultures retrieved successfully",
  "data": [
    {
      "id": 1,
      "cultureName": "Javanese Culture",
      "originIsland": "Java",
      "province": "Central Java",
      "cityRegion": "Yogyakarta",
      "classification": "Traditional Culture",
      "characteristics": "Rich in traditional arts and philosophy",
      "conservationStatus": "MAINTAINED",
      "latitude": -7.7956,
      "longitude": 110.3695,
      "status": "PUBLISHED",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
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

### 1.2 Create Culture
**Endpoint**: `POST /api/v1/admin/cultures`

**Deskripsi**: Membuat budaya baru

**Request Body**:
```json
{
  "cultureName": "Javanese Culture",
  "originIsland": "Java",
  "province": "Central Java",
  "cityRegion": "Yogyakarta",
  "classification": "Traditional Culture",
  "characteristics": "Rich in traditional arts and philosophy",
  "conservationStatus": "MAINTAINED",
  "latitude": -7.7956,
  "longitude": 110.3695,
  "status": "DRAFT"
}
```

**Field Descriptions**:
- `cultureName`: Nama budaya (required)
- `originIsland`: Pulau asal (required)
- `province`: Provinsi (required)
- `cityRegion`: Kota/Kabupaten (required)
- `classification`: Klasifikasi budaya (optional)
- `characteristics`: Karakteristik budaya (optional)
- `conservationStatus`: Status konservasi (MAINTAINED, TREATED, CRITICAL, ARCHIVED)
- `latitude`: Koordinat latitude (optional)
- `longitude`: Koordinat longitude (optional)
- `status`: Status publikasi (DRAFT, PUBLISHED, ARCHIVED)

**Response**:
```json
{
  "success": true,
  "message": "Culture created successfully",
  "data": {
    "id": 1,
    "cultureName": "Javanese Culture",
    "originIsland": "Java",
    "province": "Central Java",
    "cityRegion": "Yogyakarta",
    "classification": "Traditional Culture",
    "characteristics": "Rich in traditional arts and philosophy",
    "conservationStatus": "MAINTAINED",
    "latitude": -7.7956,
    "longitude": 110.3695,
    "status": "DRAFT",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Contoh Request**:
```bash
curl -X POST http://localhost:3000/api/v1/admin/cultures \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cultureName": "Javanese Culture",
    "originIsland": "Java",
    "province": "Central Java",
    "cityRegion": "Yogyakarta",
    "classification": "Traditional Culture",
    "characteristics": "Rich in traditional arts and philosophy",
    "conservationStatus": "MAINTAINED",
    "latitude": -7.7956,
    "longitude": 110.3695,
    "status": "DRAFT"
  }'
```

### 1.3 Get Culture by ID
**Endpoint**: `GET /api/v1/admin/cultures/:id`

**Deskripsi**: Mengambil detail budaya berdasarkan ID

**Path Parameters**:
- `id` (number, required): Culture ID

**Response**:
```json
{
  "success": true,
  "message": "Culture retrieved successfully",
  "data": {
    "id": 1,
    "cultureName": "Javanese Culture",
    "originIsland": "Java",
    "province": "Central Java",
    "cityRegion": "Yogyakarta",
    "classification": "Traditional Culture",
    "characteristics": "Rich in traditional arts and philosophy",
    "conservationStatus": "MAINTAINED",
    "latitude": -7.7956,
    "longitude": 110.3695,
    "status": "PUBLISHED",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "subcultures": [
      {
        "id": 1,
        "subcultureName": "Javanese Traditional Dance",
        "status": "PUBLISHED"
      }
    ],
    "domains": [
      {
        "id": 1,
        "domainName": "Traditional Arts",
        "code": "TA001",
        "status": "PUBLISHED"
      }
    ]
  }
}
```

### 1.4 Update Culture
**Endpoint**: `PUT /api/v1/admin/cultures/:id`

**Deskripsi**: Update data budaya

**Path Parameters**:
- `id` (number, required): Culture ID

**Request Body**: Sama dengan create (semua field optional)

**Response**: Sama dengan create

### 1.5 Delete Culture
**Endpoint**: `DELETE /api/v1/admin/cultures/:id`

**Deskripsi**: Hapus budaya

**Path Parameters**:
- `id` (number, required): Culture ID

**Response**:
```json
{
  "success": true,
  "message": "Culture deleted successfully",
  "data": null
}
```

---

## 2. SEARCH & FILTER OPERATIONS

### 2.1 Search Cultures
**Endpoint**: `GET /api/v1/admin/cultures/search`

**Deskripsi**: Mencari budaya berdasarkan text query

**Query Parameters**:
- `q` (string, required): Kata kunci pencarian (searches in cultureName, originIsland, province, cityRegion, classification, characteristics)
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of cultures yang match dengan search query

**Contoh Request**:
```bash
curl "http://localhost:3000/api/v1/admin/cultures/search?q=javanese&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2.2 Filter Cultures
**Endpoint**: `GET /api/v1/admin/cultures/filter`

**Deskripsi**: Filter budaya berdasarkan berbagai kriteria

**Query Parameters**:
- `conservationStatus` (string, optional): Status konservasi (MAINTAINED, TREATED, CRITICAL, ARCHIVED)
- `status` (string, optional): Status publikasi (DRAFT, PUBLISHED, ARCHIVED)
- `originIsland` (string, optional): Pulau asal
- `province` (string, optional): Provinsi
- `cityRegion` (string, optional): Kota/Kabupaten
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of cultures yang match dengan filter criteria

**Contoh Request**:
```bash
# Filter by conservation status and island
curl "http://localhost:3000/api/v1/admin/cultures/filter?conservationStatus=MAINTAINED&originIsland=Java&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by status and province
curl "http://localhost:3000/api/v1/admin/cultures/filter?status=PUBLISHED&province=Central%20Java&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 3. ASSET MANAGEMENT

### 3.1 Get Culture with Assets
**Endpoint**: `GET /api/v1/admin/cultures/cultures/:cultureId`

**Deskripsi**: Mengambil budaya dengan semua asset yang terkait

**Path Parameters**:
- `cultureId` (number, required): Culture ID

**Response**:
```json
{
  "success": true,
  "message": "Culture with assets retrieved successfully",
  "data": {
    "id": 1,
    "cultureName": "Javanese Culture",
    "originIsland": "Java",
    "province": "Central Java",
    "cityRegion": "Yogyakarta",
    "assets": [
      {
        "id": 1,
        "fileName": "javanese_temple.jpg",
        "fileType": "PHOTO",
        "description": "Traditional Javanese temple",
        "url": "https://blob.storage/temple.jpg",
        "status": "PUBLISHED",
        "createdAt": "2024-01-15T10:30:00Z"
      },
      {
        "id": 2,
        "fileName": "javanese_music.mp3",
        "fileType": "AUDIO",
        "description": "Traditional Javanese gamelan music",
        "url": "https://blob.storage/music.mp3",
        "status": "PUBLISHED",
        "createdAt": "2024-01-15T10:35:00Z"
      }
    ]
  }
}
```

---

## 4. REFERENCE MANAGEMENT

### 4.1 Add Reference to Culture
**Endpoint**: `POST /api/v1/admin/cultures/:id/references`

**Deskripsi**: Assign reference directly to CultureReference (untuk halaman about)

**Path Parameters**:
- `id` (number, required): Culture ID

**Request Body**:
```json
{
  "referenceId": 1,
  "citationNote": "Primary source for Javanese culture overview",
  "displayOrder": 1
}
```

**Field Descriptions**:
- `referenceId`: ID referensi yang akan di-assign (required)
- `citationNote`: Catatan sitasi (optional)
- `displayOrder`: Urutan tampilan (optional, default: 0)

**Response**:
```json
{
  "success": true,
  "message": "Reference added to culture successfully",
  "data": {
    "cultureId": 1,
    "referenceId": 1,
    "citationNote": "Primary source for Javanese culture overview",
    "displayOrder": 1,
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Contoh Request**:
```bash
curl -X POST http://localhost:3000/api/v1/admin/cultures/1/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "referenceId": 1,
    "citationNote": "Primary source for Javanese culture overview",
    "displayOrder": 1
  }'
```

### 4.2 Get Culture References
**Endpoint**: `GET /api/v1/admin/cultures/:id/references`

**Deskripsi**: Get all references assigned directly to culture

**Path Parameters**:
- `id` (number, required): Culture ID

**Response**:
```json
{
  "success": true,
  "message": "Culture references retrieved successfully",
  "data": [
    {
      "id": 1,
      "referenceId": 1,
      "citationNote": "Primary source for Javanese culture overview",
      "displayOrder": 1,
      "createdAt": "2024-01-15T10:30:00Z",
      "reference": {
        "id": 1,
        "title": "Javanese Cultural Heritage",
        "authors": "Dr. Ahmad Santoso",
        "referenceType": "BOOK",
        "publicationYear": "2020",
        "status": "PUBLISHED"
      }
    }
  ]
}
```

### 4.3 Remove Reference from Culture
**Endpoint**: `DELETE /api/v1/admin/cultures/:id/references/:referenceId`

**Deskripsi**: Remove reference from CultureReference

**Path Parameters**:
- `id` (number, required): Culture ID
- `referenceId` (number, required): Reference ID

**Response**:
```json
{
  "success": true,
  "message": "Reference removed from culture successfully",
  "data": null
}
```

---

## 5. DATA MODEL

### Culture Schema
```typescript
{
  id: number;
  cultureName: string; // Required
  originIsland: string; // Required
  province: string; // Required
  cityRegion: string; // Required
  classification: string; // Optional
  characteristics: string; // Optional
  conservationStatus: 'MAINTAINED' | 'TREATED' | 'CRITICAL' | 'ARCHIVED';
  latitude: number; // Optional
  longitude: number; // Optional
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}
```

### Culture Reference Relationship
```typescript
{
  cultureId: number;
  referenceId: number;
  citationNote: string; // Optional
  displayOrder: number; // Default: 0
  createdAt: Date;
}
```

---

## 6. BUSINESS RULES

### 6.1 Culture Creation
- `cultureName`, `originIsland`, `province`, `cityRegion` wajib diisi
- Nama budaya harus unik dalam sistem
- Koordinat latitude/longitude bersifat optional untuk mapping
- Status default adalah `DRAFT`

### 6.2 Geographic Information
- `originIsland`: Pulau asal budaya (Java, Sumatra, Kalimantan, Sulawesi, Papua, etc.)
- `province`: Provinsi di Indonesia
- `cityRegion`: Kota atau kabupaten spesifik
- Koordinat untuk keperluan mapping dan visualisasi

### 6.3 Conservation Status
- `MAINTAINED`: Budaya dalam kondisi terjaga baik
- `TREATED`: Budaya dalam proses perawatan
- `CRITICAL`: Budaya dalam kondisi kritis
- `ARCHIVED`: Budaya sudah tidak aktif

### 6.4 Reference Management
- Reference dapat di-assign langsung ke culture untuk halaman about
- Citation note membantu dalam attribution
- Display order mengontrol urutan tampilan referensi

### 6.5 Hierarchical Relationships
- Culture adalah parent dari Subculture
- Culture memiliki multiple Domains melalui Subculture
- Culture dapat memiliki assets dan references langsung

---

## 7. ERROR RESPONSES

### 7.1 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "cultureName",
        "message": "Culture name is required"
      },
      {
        "field": "originIsland",
        "message": "Origin island is required"
      }
    ]
  }
}
```

### 7.2 Not Found Error
```json
{
  "success": false,
  "message": "Culture not found",
  "data": null
}
```

### 7.3 Duplicate Name Error
```json
{
  "success": false,
  "message": "Culture name already exists",
  "data": null
}
```

### 7.4 Invalid Reference Error
```json
{
  "success": false,
  "message": "Invalid reference ID",
  "data": null
}
```

---

## 8. USAGE EXAMPLES

### 8.1 Complete Culture Management Flow

```bash
# 1. Create culture
curl -X POST http://localhost:3000/api/v1/admin/cultures \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "cultureName": "Javanese Culture",
    "originIsland": "Java",
    "province": "Central Java",
    "cityRegion": "Yogyakarta",
    "classification": "Traditional Culture",
    "characteristics": "Rich in traditional arts and philosophy",
    "conservationStatus": "MAINTAINED",
    "latitude": -7.7956,
    "longitude": 110.3695,
    "status": "DRAFT"
  }'

# 2. Get culture details
curl http://localhost:3000/api/v1/admin/cultures/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Add reference to culture
curl -X POST http://localhost:3000/api/v1/admin/cultures/1/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "referenceId": 1,
    "citationNote": "Primary source for Javanese culture overview",
    "displayOrder": 1
  }'

# 4. Get culture with assets
curl http://localhost:3000/api/v1/admin/cultures/cultures/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 5. Search cultures
curl "http://localhost:3000/api/v1/admin/cultures/search?q=javanese&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 6. Filter cultures
curl "http://localhost:3000/api/v1/admin/cultures/filter?conservationStatus=MAINTAINED&originIsland=Java&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 7. Update culture
curl -X PUT http://localhost:3000/api/v1/admin/cultures/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PUBLISHED",
    "characteristics": "Rich in traditional arts, philosophy, and architecture"
  }'
```

### 8.2 Geographic and Conservation Management

```bash
# Filter by conservation status
curl "http://localhost:3000/api/v1/admin/cultures/filter?conservationStatus=CRITICAL&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by region
curl "http://localhost:3000/api/v1/admin/cultures/filter?province=West%20Java&cityRegion=Bandung&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search by island
curl "http://localhost:3000/api/v1/admin/cultures/search?q=sumatra&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 8.3 Reference Management

```bash
# Get all culture references
curl http://localhost:3000/api/v1/admin/cultures/1/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Add multiple references with different display orders
curl -X POST http://localhost:3000/api/v1/admin/cultures/1/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "referenceId": 2,
    "citationNote": "Secondary source for cultural practices",
    "displayOrder": 2
  }'

# Remove reference
curl -X DELETE http://localhost:3000/api/v1/admin/cultures/1/references/2 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 9. NOTES

- **Geographic Hierarchy**: Culture memiliki hierarki geografis (Island → Province → City/Region)
- **Conservation Status**: Status konservasi untuk monitoring kondisi budaya
- **Coordinate System**: Latitude/Longitude untuk mapping dan visualisasi geografis
- **Reference Assignment**: Reference dapat di-assign langsung ke culture untuk halaman about
- **Hierarchical Relationships**: Culture adalah root dalam hierarki Culture → Subculture → Domain → Lexicon
- **Asset Association**: Culture dapat memiliki assets langsung (photos, audio, etc.)
- **Search Flexibility**: Search mencakup multiple fields untuk comprehensive discovery
- **Filter Combination**: Multiple filter criteria dapat dikombinasikan untuk query yang kompleks
- **Pagination**: Semua list endpoints mendukung pagination
- **Status Management**: Draft/Published/Archived status untuk content lifecycle management</content>
<parameter name="filePath">d:\my-code\1_home\leksikon-proj\leksikon-be-2\CULTURE_API_DOCUMENTATION.md