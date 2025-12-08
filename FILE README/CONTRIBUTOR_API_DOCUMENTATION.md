# Contributor Management API Documentation

## Overview
Contributor Management API menyediakan endpoint untuk mengelola kontributor (peneliti, akademisi, dll.) dalam sistem Leksikon Budaya. API ini mencakup operasi CRUD dasar, pencarian, filter, serta manajemen asset yang terkait dengan kontributor.

## Base URL
`/api/v1/admin/contributors/`

## Authentication
Semua endpoint memerlukan JWT authentication dengan header `Authorization: Bearer <token>`

---

## 1. PENCARIAN & FILTERING

### 1.1 Search Contributors
**Endpoint**: `GET /api/admin/contributors/search`

**Deskripsi**: Mencari kontributor berdasarkan nama, institusi, atau bidang keahlian

**Query Parameters**:
- `q` (string, required): Kata kunci pencarian
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**:
```json
{
  "success": true,
  "message": "Contributors retrieved successfully",
  "data": [
    {
      "id": 1,
      "contributorName": "Dr. Ahmad Santoso",
      "institution": "Universitas Indonesia",
      "email": "ahmad@university.edu",
      "expertiseArea": "Cultural Anthropology",
      "contactInfo": "+62-812-3456-7890",
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

**Contoh Request**:
```bash
curl "http://localhost:3000/api/admin/contributors/search?q=ahmad&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 1.2 Search Coordinators
**Endpoint**: `GET /api/admin/contributors/coordinators/search`

**Deskripsi**: Mencari koordinator berdasarkan nama, institusi, atau bidang keahlian

**Query Parameters**:
- `q` (string, required): Kata kunci pencarian
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Sama dengan search contributors

### 1.3 Filter Coordinators
**Endpoint**: `GET /api/admin/contributors/coordinators/filter`

**Deskripsi**: Filter koordinator berdasarkan status, bidang keahlian, dan institusi (kombinasi)

**Query Parameters**:
- `coordinatorStatus` (string, optional): Status koordinator (ACTIVE, INACTIVE, ALUMNI)
- `expertiseArea` (string, optional): Bidang keahlian
- `institution` (string, optional): Institusi
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Sama dengan search contributors

**Contoh Request**:
```bash
curl "http://localhost:3000/api/admin/contributors/coordinators/filter?coordinatorStatus=ACTIVE&expertiseArea=Anthropology&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 2. CRUD OPERATIONS

### 2.1 Get All Contributors
**Endpoint**: `GET /api/admin/contributors`

**Deskripsi**: Mengambil semua kontributor dengan pagination

**Query Parameters**:
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of contributors dengan pagination metadata

### 2.2 Get Contributor by ID
**Endpoint**: `GET /api/admin/contributors/:id`

**Deskripsi**: Mengambil detail kontributor berdasarkan ID

**Path Parameters**:
- `id` (number, required): Contributor ID

**Response**:
```json
{
  "success": true,
  "message": "Contributor retrieved successfully",
  "data": {
    "id": 1,
    "contributorName": "Dr. Ahmad Santoso",
    "institution": "Universitas Indonesia",
    "email": "ahmad@university.edu",
    "expertiseArea": "Cultural Anthropology",
    "contactInfo": "+62-812-3456-7890",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "assets": [
      {
        "id": 1,
        "fileName": "profile.jpg",
        "fileType": "PHOTO",
        "assetNote": "FOTO_DIRI"
      }
    ]
  }
}
```

### 2.3 Create Contributor
**Endpoint**: `POST /api/admin/contributors`

**Deskripsi**: Membuat kontributor baru

**Request Body**:
```json
{
  "contributorName": "Dr. Ahmad Santoso",
  "institution": "Universitas Indonesia",
  "email": "ahmad@university.edu",
  "expertiseArea": "Cultural Anthropology",
  "contactInfo": "+62-812-3456-7890"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Contributor created successfully",
  "data": {
    "id": 1,
    "contributorName": "Dr. Ahmad Santoso",
    "institution": "Universitas Indonesia",
    "email": "ahmad@university.edu",
    "expertiseArea": "Cultural Anthropology",
    "contactInfo": "+62-812-3456-7890",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Contoh Request**:
```bash
curl -X POST http://localhost:3000/api/admin/contributors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contributorName": "Dr. Ahmad Santoso",
    "institution": "Universitas Indonesia",
    "email": "ahmad@university.edu",
    "expertiseArea": "Cultural Anthropology",
    "contactInfo": "+62-812-3456-7890"
  }'
```

### 2.4 Update Contributor
**Endpoint**: `PUT /api/admin/contributors/:id`

**Deskripsi**: Update data kontributor

**Path Parameters**:
- `id` (number, required): Contributor ID

**Request Body**: Sama dengan create (semua field optional)

**Response**: Sama dengan create

### 2.5 Delete Contributor
**Endpoint**: `DELETE /api/admin/contributors/:id`

**Deskripsi**: Hapus kontributor

**Path Parameters**:
- `id` (number, required): Contributor ID

**Response**:
```json
{
  "success": true,
  "message": "Contributor deleted successfully",
  "data": null
}
```

---

## 3. ASSET MANAGEMENT

### 3.1 Get Contributor Assets
**Endpoint**: `GET /api/admin/contributors/:id/assets`

**Deskripsi**: Mengambil semua asset yang terkait dengan kontributor

**Path Parameters**:
- `id` (number, required): Contributor ID

**Response**:
```json
{
  "success": true,
  "message": "Contributor assets retrieved successfully",
  "data": [
    {
      "id": 1,
      "fileName": "profile.jpg",
      "fileType": "PHOTO",
      "description": "Profile photo",
      "assetNote": "FOTO_DIRI",
      "url": "https://blob.storage/profile.jpg",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "fileName": "signature.png",
      "fileType": "PHOTO",
      "description": "Digital signature",
      "assetNote": "SIGNATURE",
      "url": "https://blob.storage/signature.png",
      "createdAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

### 3.2 Add Asset to Contributor
**Endpoint**: `POST /api/admin/contributors/:id/assets`

**Deskripsi**: Menambahkan asset ke kontributor (LOGO, FOTO_DIRI, SIGNATURE, CERTIFICATE)

**Path Parameters**:
- `id` (number, required): Contributor ID

**Request Body**:
```json
{
  "assetId": 1,
  "assetNote": "FOTO_DIRI"
}
```

**Asset Note Options**:
- `LOGO`: Logo institusi
- `FOTO_DIRI`: Foto profil
- `SIGNATURE`: Tanda tangan digital
- `CERTIFICATE`: Sertifikat

**Response**:
```json
{
  "success": true,
  "message": "Asset added to contributor successfully",
  "data": {
    "contributorId": 1,
    "assetId": 1,
    "assetNote": "FOTO_DIRI",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

**Contoh Request**:
```bash
curl -X POST http://localhost:3000/api/admin/contributors/1/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assetId": 1,
    "assetNote": "FOTO_DIRI"
  }'
```

### 3.3 Remove Asset from Contributor
**Endpoint**: `DELETE /api/admin/contributors/:id/assets/:assetId`

**Deskripsi**: Menghapus asset dari kontributor

**Path Parameters**:
- `id` (number, required): Contributor ID
- `assetId` (number, required): Asset ID

**Response**:
```json
{
  "success": true,
  "message": "Asset removed from contributor successfully",
  "data": null
}
```

---

## 4. ERROR RESPONSES

### 4.1 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "email",
        "message": "Email is required"
      },
      {
        "field": "contributorName",
        "message": "Contributor name is required"
      }
    ]
  }
}
```

### 4.2 Not Found Error
```json
{
  "success": false,
  "message": "Contributor not found",
  "data": null
}
```

### 4.3 Duplicate Email Error
```json
{
  "success": false,
  "message": "Email already exists",
  "data": null
}
```

---

## 5. DATA MODEL

### Contributor Schema
```typescript
{
  id: number;
  contributorName: string; // Required, 1-255 chars
  institution: string; // Required, 1-255 chars
  email: string; // Required, valid email format
  expertiseArea: string; // Required, 1-255 chars
  contactInfo: string; // Optional, contact information
  createdAt: Date;
  updatedAt: Date;
}
```

### Contributor Asset Relationship
```typescript
{
  contributorId: number;
  assetId: number;
  assetNote: 'LOGO' | 'FOTO_DIRI' | 'SIGNATURE' | 'CERTIFICATE';
  createdAt: Date;
}
```

---

## 6. BUSINESS RULES

### 6.1 Contributor Creation
- Email harus unik di seluruh sistem
- Semua field wajib diisi kecuali `contactInfo`
- Email akan divalidasi formatnya

### 6.2 Asset Management
- Satu kontributor dapat memiliki multiple assets
- Asset yang sama dapat digunakan oleh multiple contributors
- Asset note menentukan peran asset untuk kontributor tersebut

### 6.3 Coordinator vs Contributor
- Coordinator adalah subset dari contributor dengan status khusus
- Filter coordinator menggunakan endpoint khusus untuk performa yang lebih baik

---

## 7. USAGE EXAMPLES

### 7.1 Complete Contributor Management Flow

```bash
# 1. Create contributor
curl -X POST http://localhost:3000/api/admin/contributors \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "contributorName": "Dr. Ahmad Santoso",
    "institution": "Universitas Indonesia",
    "email": "ahmad@university.edu",
    "expertiseArea": "Cultural Anthropology",
    "contactInfo": "+62-812-3456-7890"
  }'

# 2. Get contributor details
curl http://localhost:3000/api/admin/contributors/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Add profile photo
curl -X POST http://localhost:3000/api/admin/contributors/1/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assetId": 123,
    "assetNote": "FOTO_DIRI"
  }'

# 4. Search contributors
curl "http://localhost:3000/api/admin/contributors/search?q=ahmad&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 5. Update contributor
curl -X PUT http://localhost:3000/api/admin/contributors/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "expertiseArea": "Cultural Anthropology & Linguistics"
  }'
```

### 7.2 Coordinator Management

```bash
# Search active coordinators
curl "http://localhost:3000/api/admin/contributors/coordinators/search?q=anthropology&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter coordinators by status and institution
curl "http://localhost:3000/api/admin/contributors/coordinators/filter?coordinatorStatus=ACTIVE&institution=Universitas%20Indonesia&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 8. NOTES

- **Pagination**: Semua list endpoints mendukung pagination dengan `page` dan `limit`
- **Search**: Pencarian bersifat case-insensitive dan partial matching
- **Validation**: Email harus unik dan format valid
- **Assets**: Asset management terintegrasi dengan asset system utama
- **Coordinator**: Endpoint khusus untuk coordinator filtering untuk performa optimal
- **Relationships**: Kontributor dapat memiliki multiple assets dengan peran berbeda</content>
<parameter name="filePath">d:\my-code\1_home\leksikon-proj\leksikon-be-2\CONTRIBUTOR_API_DOCUMENTATION.md