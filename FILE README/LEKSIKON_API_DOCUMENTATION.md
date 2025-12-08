# Leksikon Management API Documentation

## Overview
Leksikon Management API menyediakan endpoint untuk mengelola leksikon (entri kamus budaya) dalam sistem Leksikon Budaya. API ini merupakan core dari sistem dengan kompleksitas tinggi, mencakup operasi CRUD dasar, manajemen asset dan referensi, pencarian, filter, serta berbagai relationship dengan domain, subculture, dan culture.

## Base URL
`/api/v1/admin/leksikons/`

## Authentication
Semua endpoint memerlukan JWT authentication dengan header `Authorization: Bearer <token>`

---

## 1. BASIC CRUD OPERATIONS

### 1.1 Get All Leksikons (Paginated)
**Endpoint**: `GET /api/v1/admin/leksikons`

**Deskripsi**: Mengambil semua leksikon dengan pagination

**Query Parameters**:
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**:
```json
{
  "success": true,
  "message": "Leksikons retrieved successfully",
  "data": [
    {
      "lexiconId": 1,
      "lexiconWord": "Tari Legong",
      "ipaInternationalPhoneticAlphabet": "ˈtari ˈləgɔŋ",
      "transliteration": "LEH-gong",
      "etymologicalMeaning": "Dari kata Bali 'legong' yang berarti tari",
      "culturalMeaning": "Tari tradisional Bali yang dilakukan oleh gadis remaja",
      "commonMeaning": "Tari Legong",
      "translation": "Legong Dance",
      "variant": "Tari Legong Kraton",
      "variantTranslations": "Legong Palace Dance",
      "otherDescription": "Tari ini biasanya ditampilkan dalam upacara keagamaan",
      "domainId": 1,
      "contributorId": 2,
      "status": "PUBLISHED",
      "slug": "tari-legong",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "codificationDomain": {
        "domainId": 1,
        "domainName": "Traditional Dance",
        "code": "DA001",
        "subculture": {
          "subcultureId": 1,
          "subcultureName": "Balinese Traditional Arts",
          "culture": {
            "cultureId": 1,
            "cultureName": "Balinese Culture"
          }
        }
      },
      "contributor": {
        "contributorId": 2,
        "contributorName": "Dr. Made Suastika"
      }
    }
  ],
  "meta": {
    "total": 1,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

### 1.2 Create Leksikon
**Endpoint**: `POST /api/v1/admin/leksikons`

**Deskripsi**: Membuat leksikon baru

**Request Body**:
```json
{
  "lexiconWord": "Tari Legong",
  "ipaInternationalPhoneticAlphabet": "ˈtari ˈləgɔŋ",
  "transliteration": "LEH-gong",
  "etymologicalMeaning": "Dari kata Bali 'legong' yang berarti tari",
  "culturalMeaning": "Tari tradisional Bali yang dilakukan oleh gadis remaja",
  "commonMeaning": "Tari Legong",
  "translation": "Legong Dance",
  "variant": "Tari Legong Kraton",
  "variantTranslations": "Legong Palace Dance",
  "otherDescription": "Tari ini biasanya ditampilkan dalam upacara keagamaan",
  "domainId": 1,
  "contributorId": 2,
  "status": "DRAFT"
}
```

**Field Descriptions**:
- `lexiconWord`: Kata leksikon utama (required)
- `ipaInternationalPhoneticAlphabet`: Pelafalan IPA (optional)
- `transliteration`: Transliteration (required)
- `etymologicalMeaning`: Makna etimologi (required)
- `culturalMeaning`: Makna kultural (required)
- `commonMeaning`: Makna umum (required)
- `translation`: Terjemahan (required)
- `variant`: Varian kata (optional)
- `variantTranslations`: Terjemahan varian (optional)
- `otherDescription`: Deskripsi tambahan (optional)
- `domainId`: ID domain kodifikasi (required)
- `contributorId`: ID kontributor (required)
- `status`: Status publikasi (DRAFT, PUBLISHED, ARCHIVED)

**Response**:
```json
{
  "success": true,
  "message": "Leksikon created successfully",
  "data": {
    "lexiconId": 1,
    "lexiconWord": "Tari Legong",
    "ipaInternationalPhoneticAlphabet": "ˈtari ˈləgɔŋ",
    "transliteration": "LEH-gong",
    "etymologicalMeaning": "Dari kata Bali 'legong' yang berarti tari",
    "culturalMeaning": "Tari tradisional Bali yang dilakukan oleh gadis remaja",
    "commonMeaning": "Tari Legong",
    "translation": "Legong Dance",
    "variant": "Tari Legong Kraton",
    "variantTranslations": "Legong Palace Dance",
    "otherDescription": "Tari ini biasanya ditampilkan dalam upacara keagamaan",
    "domainId": 1,
    "contributorId": 2,
    "status": "DRAFT",
    "slug": "tari-legong",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "codificationDomain": {
      "domainId": 1,
      "domainName": "Traditional Dance",
      "code": "DA001"
    },
    "contributor": {
      "contributorId": 2,
      "contributorName": "Dr. Made Suastika"
    }
  }
}
```

**Contoh Request**:
```bash
curl -X POST http://localhost:3000/api/v1/admin/leksikons \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lexiconWord": "Tari Legong",
    "transliteration": "LEH-gong",
    "etymologicalMeaning": "Dari kata Bali '\''legong'\'' yang berarti tari",
    "culturalMeaning": "Tari tradisional Bali yang dilakukan oleh gadis remaja",
    "commonMeaning": "Tari Legong",
    "translation": "Legong Dance",
    "domainId": 1,
    "contributorId": 2
  }'
```

### 1.3 Get Leksikon by ID
**Endpoint**: `GET /api/v1/admin/leksikons/:id`

**Deskripsi**: Mengambil detail leksikon berdasarkan ID

**Path Parameters**:
- `id` (number, required): Leksikon ID

**Response**:
```json
{
  "success": true,
  "message": "Leksikon retrieved successfully",
  "data": {
    "lexiconId": 1,
    "lexiconWord": "Tari Legong",
    "ipaInternationalPhoneticAlphabet": "ˈtari ˈləgɔŋ",
    "transliteration": "LEH-gong",
    "etymologicalMeaning": "Dari kata Bali 'legong' yang berarti tari",
    "culturalMeaning": "Tari tradisional Bali yang dilakukan oleh gadis remaja",
    "commonMeaning": "Tari Legong",
    "translation": "Legong Dance",
    "variant": "Tari Legong Kraton",
    "variantTranslations": "Legong Palace Dance",
    "otherDescription": "Tari ini biasanya ditampilkan dalam upacara keagamaan",
    "domainId": 1,
    "contributorId": 2,
    "status": "PUBLISHED",
    "slug": "tari-legong",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "codificationDomain": {
      "domainId": 1,
      "domainName": "Traditional Dance",
      "code": "DA001",
      "subculture": {
        "subcultureId": 1,
        "subcultureName": "Balinese Traditional Arts",
        "culture": {
          "cultureId": 1,
          "cultureName": "Balinese Culture"
        }
      }
    },
    "contributor": {
      "contributorId": 2,
      "contributorName": "Dr. Made Suastika"
    },
    "assets": [
      {
        "assetId": 1,
        "fileName": "legong_dance.jpg",
        "fileType": "PHOTO",
        "assetRole": "GALLERY",
        "url": "https://blob.storage/legong.jpg"
      }
    ],
    "references": [
      {
        "referenceId": 1,
        "title": "Balinese Dance Traditions",
        "referenceType": "BOOK",
        "referenceRole": "PRIMARY_SOURCE",
        "authors": "Dr. Made Suastika"
      }
    ]
  }
}
```

### 1.4 Update Leksikon
**Endpoint**: `PUT /api/v1/admin/leksikons/:id`

**Deskripsi**: Update data leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID

**Request Body**: Sama dengan create (semua field optional)

**Response**: Sama dengan create

### 1.5 Delete Leksikon
**Endpoint**: `DELETE /api/v1/admin/leksikons/:id`

**Deskripsi**: Hapus leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID

**Response**:
```json
{
  "success": true,
  "message": "Leksikon deleted successfully",
  "data": null
}
```

---

## 2. STATUS MANAGEMENT

### 2.1 Update Leksikon Status
**Endpoint**: `PATCH /api/v1/admin/leksikons/:id/status`

**Deskripsi**: Update status leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID

**Request Body**:
```json
{
  "status": "PUBLISHED"
}
```

**Status Options**:
- `DRAFT`: Dalam proses editing
- `PUBLISHED`: Diterbitkan dan dapat diakses publik
- `ARCHIVED`: Diarsipkan (tidak aktif)

**Response**:
```json
{
  "success": true,
  "message": "Leksikon status updated successfully",
  "data": {
    "id": 1,
    "status": "PUBLISHED",
    "updatedAt": "2024-01-15T11:00:00Z"
  }
}
```

### 2.2 Get Leksikons by Status
**Endpoint**: `GET /api/v1/admin/leksikons/status`

**Deskripsi**: Mengambil leksikon berdasarkan status

**Query Parameters**:
- `status` (string, required): Status filter (DRAFT, PUBLISHED, ARCHIVED)

**Response**: Array of leksikons dengan status tertentu

---

## 3. RELATIONSHIP QUERIES

### 3.1 Get Leksikons by Domain
**Endpoint**: `GET /api/v1/admin/leksikons/domain-kodifikasi/:dk_id/leksikons`

**Deskripsi**: Mengambil semua leksikon dalam domain tertentu

**Path Parameters**:
- `dk_id` (number, required): Domain Kodifikasi ID

**Response**: Array of leksikons dalam domain tersebut

---

## 4. ASSET MANAGEMENT

### 4.1 Get Leksikon Assets
**Endpoint**: `GET /api/v1/admin/leksikons/:id/assets`

**Deskripsi**: Mengambil semua asset yang terkait dengan leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID

**Response**:
```json
{
  "success": true,
  "message": "Leksikon assets retrieved successfully",
  "data": [
    {
      "id": 1,
      "fileName": "legong_dance.jpg",
      "fileType": "PHOTO",
      "description": "Traditional Legong dance performance",
      "assetRole": "GALLERY",
      "url": "https://blob.storage/legong.jpg",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "fileName": "legong_pronunciation.mp3",
      "fileType": "AUDIO",
      "description": "Pronunciation guide for Legong",
      "assetRole": "PRONUNCIATION",
      "url": "https://blob.storage/pronunciation.mp3",
      "createdAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

### 4.2 Add Asset to Leksikon
**Endpoint**: `POST /api/v1/admin/leksikons/:id/assets`

**Deskripsi**: Menambahkan asset ke leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID

**Request Body**:
```json
{
  "assetId": 1,
  "assetRole": "GALLERY"
}
```

**Asset Role Options**:
- `GALLERY`: Gambar galeri
- `PRONUNCIATION`: Audio pelafalan
- `VIDEO_DEMO`: Video demonstrasi
- `MODEL_3D`: Model 3D

**Response**:
```json
{
  "success": true,
  "message": "Asset added to leksikon successfully",
  "data": {
    "leksikonId": 1,
    "assetId": 1,
    "assetRole": "GALLERY",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 4.3 Update Asset Role
**Endpoint**: `PUT /api/v1/admin/leksikons/:id/assets/:assetId/role`

**Deskripsi**: Update peran asset dalam leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID
- `assetId` (number, required): Asset ID

**Request Body**:
```json
{
  "assetRole": "PRONUNCIATION"
}
```

**Response**: Sama dengan add asset

### 4.4 Get Assets by Role
**Endpoint**: `GET /api/v1/admin/leksikons/:id/assets/role/:assetRole`

**Deskripsi**: Mengambil asset berdasarkan peran dalam leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID
- `assetRole` (string, required): Asset role

**Response**: Array of assets dengan role tertentu

### 4.5 Remove Asset from Leksikon
**Endpoint**: `DELETE /api/v1/admin/leksikons/:id/assets/:assetId`

**Deskripsi**: Menghapus asset dari leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID
- `assetId` (number, required): Asset ID

**Response**:
```json
{
  "success": true,
  "message": "Asset removed from leksikon successfully",
  "data": null
}
```

---

## 5. REFERENCE MANAGEMENT

### 5.1 Get Leksikon References
**Endpoint**: `GET /api/v1/admin/leksikons/:id/references`

**Deskripsi**: Mengambil semua referensi yang terkait dengan leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID

**Response**:
```json
{
  "success": true,
  "message": "Leksikon references retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Balinese Dance Traditions",
      "referenceType": "BOOK",
      "description": "Comprehensive study of Balinese dance",
      "authors": "Dr. Made Suastika",
      "referenceRole": "PRIMARY_SOURCE",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "title": "Legong Dance: A Cultural Analysis",
      "referenceType": "JOURNAL",
      "description": "Academic analysis of Legong dance forms",
      "authors": "Prof. Ni Luh Sutjiati Beratha",
      "referenceRole": "SECONDARY_SOURCE",
      "createdAt": "2024-01-15T10:35:00Z"
    }
  ]
}
```

### 5.2 Add Reference to Leksikon
**Endpoint**: `POST /api/v1/admin/leksikons/:id/references`

**Deskripsi**: Menambahkan referensi ke leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID

**Request Body**:
```json
{
  "referenceId": 1,
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
  "message": "Reference added to leksikon successfully",
  "data": {
    "leksikonId": 1,
    "referenceId": 1,
    "referenceRole": "PRIMARY_SOURCE",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}
```

### 5.3 Update Reference Role
**Endpoint**: `PUT /api/v1/admin/leksikons/:id/references/:referenceId`

**Deskripsi**: Update peran referensi dalam leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID
- `referenceId` (number, required): Reference ID

**Request Body**:
```json
{
  "referenceRole": "SECONDARY_SOURCE"
}
```

**Response**: Sama dengan add reference

### 5.4 Remove Reference from Leksikon
**Endpoint**: `DELETE /api/v1/admin/leksikons/:id/references/:referenceId`

**Deskripsi**: Menghapus referensi dari leksikon

**Path Parameters**:
- `id` (number, required): Leksikon ID
- `referenceId` (number, required): Reference ID

**Response**:
```json
{
  "success": true,
  "message": "Reference removed from leksikon successfully",
  "data": null
}
```

---

## 6. SEARCH & FILTER OPERATIONS

### 6.1 Search Assets in Leksikons
**Endpoint**: `GET /api/v1/admin/leksikons/search/assets`

**Deskripsi**: Mencari asset yang digunakan dalam leksikon

**Query Parameters**:
- `q` (string, required): Kata kunci pencarian (fileName, fileType, description)
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of assets yang digunakan dalam leksikon

### 6.2 Search References in Leksikons
**Endpoint**: `GET /api/v1/admin/leksikons/search/references`

**Deskripsi**: Mencari referensi yang digunakan dalam leksikon

**Query Parameters**:
- `q` (string, required): Kata kunci pencarian (title, authors, referenceType)
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of references yang digunakan dalam leksikon

### 6.3 Filter Leksikon Assets
**Endpoint**: `GET /api/v1/admin/leksikons/filter/assets`

**Deskripsi**: Filter asset yang digunakan dalam leksikon

**Query Parameters**:
- `fileType` (string, optional): Tipe file (PHOTO, AUDIO, VIDEO, MODEL_3D)
- `status` (string, optional): Status asset (ACTIVE, PROCESSING, ARCHIVED, CORRUPTED)
- `createdAt` (string, optional): Tanggal dibuat (ISO date string)
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Filtered assets dengan pagination

### 6.4 Filter Leksikon References
**Endpoint**: `GET /api/v1/admin/leksikons/filter/references`

**Deskripsi**: Filter referensi yang digunakan dalam leksikon

**Query Parameters**:
- `referenceType` (string, optional): Tipe referensi (JOURNAL, BOOK, ARTICLE, WEBSITE, REPORT)
- `publicationYear` (string, optional): Tahun publikasi
- `status` (string, optional): Status referensi (DRAFT, PUBLISHED, ARCHIVED)
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Filtered references dengan pagination

---

## 7. USAGE TRACKING

### 7.1 Get Assigned Assets
**Endpoint**: `GET /api/v1/admin/leksikons/assets/assigned`

**Deskripsi**: Mengambil semua asset yang sedang digunakan dalam leksikon

**Query Parameters**:
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of assets yang assigned ke leksikon

### 7.2 Get Asset Usage
**Endpoint**: `GET /api/v1/admin/leksikons/assets/:assetId/usages`

**Deskripsi**: Melihat leksikon mana saja yang menggunakan asset tertentu

**Path Parameters**:
- `assetId` (number, required): Asset ID

**Response**:
```json
{
  "success": true,
  "message": "Asset usage retrieved successfully",
  "data": [
    {
      "leksikonId": 1,
      "term": "Tari Legong",
      "assetRole": "GALLERY",
      "assignedAt": "2024-01-15T10:30:00Z"
    },
    {
      "leksikonId": 5,
      "term": "Tari Kecak",
      "assetRole": "VIDEO_DEMO",
      "assignedAt": "2024-01-16T14:20:00Z"
    }
  ]
}
```

### 7.3 Get Assigned References
**Endpoint**: `GET /api/v1/admin/leksikons/references/assigned`

**Deskripsi**: Mengambil semua referensi yang sedang digunakan dalam leksikon

**Query Parameters**:
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of references yang assigned ke leksikon

### 7.4 Get Reference Usage
**Endpoint**: `GET /api/v1/admin/leksikons/references/:referenceId/usages`

**Deskripsi**: Melihat leksikon mana saja yang menggunakan referensi tertentu

**Path Parameters**:
- `referenceId` (number, required): Reference ID

**Response**: Sama dengan asset usage

---

## 8. BULK OPERATIONS

### 8.1 Bulk Import Leksikons
**Endpoint**: `POST /api/v1/admin/leksikons/import`

**Deskripsi**: Bulk import leksikon dari file CSV dengan validasi komprehensif dan error handling

**Content-Type**: `multipart/form-data`

**Request Body**:
- `file`: CSV file containing leksikon data

**CSV Format** (Header Mapping Flexible):
```csv
Leksikon,Transliterasi,Makna Etimologi,Makna Kultural,Common Meaning,Translation,Varian,Translation varians,Deskripsi Lain,Domain ID,Contributor ID,Slug
Tari Legong,LEH-gong,Dari kata Bali 'legong' yang berarti tari,Tari tradisional Bali yang dilakukan oleh gadis remaja,Tari Legong,Tari Legong,,,-,1,1,tari-legong
Gamelan,GAH-meh-lan,Dari kata Jawa 'gamel' yang berarti pegang,Ensambel musik tradisional Indonesia,Gamelan,Gamelan,,,-,2,2,gamelan
```

**Header Mapping Support**:
- Headers dapat menggunakan format Indonesia atau English
- Case-insensitive matching
- Auto-mapping untuk variasi penulisan header

**Validation Rules**:
- `lexiconWord` (Leksikon): Required, string min 1 char
- `transliteration` (Transliterasi): Required, string min 1 char
- `etymologicalMeaning` (Makna Etimologi): Required, string min 1 char
- `culturalMeaning` (Makna Kultural): Required, string min 1 char
- `commonMeaning` (Common Meaning): Required, string min 1 char
- `translation` (Translation): Required, string min 1 char
- `domainId` (Domain ID): Required, valid number, must exist in database
- `contributorId` (Contributor ID): Required, valid number, must exist in database
- `slug`: Optional, auto-generated from lexiconWord if empty

**Response Success**:
```json
{
  "success": true,
  "message": "Bulk import completed",
  "data": {
    "imported": 147,
    "skipped": 3,
    "errors": [
      "Contributor ID 999 tidak ditemukan. Pastikan import contributor terlebih dahulu.",
      "Domain ID 888 tidak ditemukan. Pastikan import domain kodifikasi terlebih dahulu.",
      "Slug 'tari-legong' sudah ada. Slug di-generate dari lexiconWord 'Tari Legong'. Gunakan lexiconWord yang berbeda atau slug manual."
    ],
    "importedLexicons": [
      "Tari Legong",
      "Gamelan",
      "Kecak"
    ],
    "skippedLexicons": [
      "Tari Kecak",
      "Tari Pendet"
    ]
  }
}
```

**Response Error**:
```json
{
  "success": false,
  "message": "Bulk import failed",
  "details": "Error message",
  "stack": "Error stack (development only)"
}
```

**Error Scenarios**:
- File tidak di-upload
- File bukan CSV
- CSV parsing error
- Database validation errors
- Duplicate slug errors
- Missing required fields

---

## 9. DATA MODEL

### Leksikon Schema
```typescript
{
  lexiconId: number; // Primary key
  lexiconWord: string; // Required - Kata leksikon utama
  ipaInternationalPhoneticAlphabet?: string; // Optional - IPA pronunciation
  transliteration: string; // Required - Transliteration
  etymologicalMeaning: string; // Required - Makna etimologi
  culturalMeaning: string; // Required - Makna kultural
  commonMeaning: string; // Required - Makna umum
  translation: string; // Required - Terjemahan
  variant?: string; // Optional - Varian kata
  variantTranslations?: string; // Optional - Terjemahan varian
  otherDescription?: string; // Optional - Deskripsi tambahan
  domainId: number; // Required - Foreign key ke CodificationDomain
  contributorId: number; // Required - Foreign key ke Contributor
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'; // Default: DRAFT
  slug: string; // Auto-generated from lexiconWord
  createdAt: Date;
  updatedAt: Date;

  // Relations (included in full response)
  codificationDomain?: {
    domainId: number;
    domainName: string;
    code: string;
    // ... other domain fields
  };
  contributor?: {
    contributorId: number;
    contributorName: string;
    // ... other contributor fields
  };
  lexiconAssets?: Array<{
    assetId: number;
    assetRole: string;
    asset: {
      fileName: string;
      fileType: string;
      // ... other asset fields
    };
  }>;
  lexiconReferences?: Array<{
    referenceId: number;
    referenceRole?: string;
    reference: {
      title: string;
      authors: string;
      // ... other reference fields
    };
  }>;
}
```

### Leksikon Asset Relationship
```typescript
{
  leksikonId: number;
  assetId: number;
  assetRole: 'GALLERY' | 'PRONUNCIATION' | 'VIDEO_DEMO' | 'MODEL_3D';
  createdAt: Date;
}
```

### Leksikon Reference Relationship
```typescript
{
  leksikonId: number;
  referenceId: number;
  referenceRole: 'PRIMARY_SOURCE' | 'SECONDARY_SOURCE' | 'ADDITIONAL_READING';
  createdAt: Date;
}
```

---

## 10. BUSINESS RULES

### 10.1 Leksikon Creation
- `lexiconWord`, `transliteration`, `etymologicalMeaning`, `culturalMeaning`, `commonMeaning`, dan `translation` wajib diisi
- `domainId` dan `contributorId` harus valid dan merujuk ke domain dan kontributor yang ada
- `slug` auto-generated dari lexiconWord (lowercase, hyphen-separated)
- Status default adalah `DRAFT`

### 10.2 Asset Management
- Asset dapat di-assign dengan peran spesifik
- Satu asset dapat digunakan oleh multiple leksikon
- Asset role menentukan bagaimana asset ditampilkan

### 10.3 Reference Management
- Reference dapat di-assign dengan peran spesifik
- Satu reference dapat digunakan oleh multiple leksikon
- Reference role membantu dalam citation hierarchy

### 10.4 Hierarchical Relationships
- Leksikon berada di bawah Domain
- Domain berada di bawah Subculture
- Subculture berada di bawah Culture
- Relationship ini tercermin dalam slug dan URL structure

### 10.5 Slug Generation
- Auto-generated dari term
- Format: lowercase, spaces become hyphens
- Unique across all leksikons
- Used for SEO-friendly URLs

---

## 11. ERROR RESPONSES

### 11.1 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "data": {
    "errors": [
      {
        "field": "term",
        "message": "Term is required"
      },
      {
        "field": "domainId",
        "message": "Valid domain ID is required"
      }
    ]
  }
}
```

### 11.2 Not Found Error
```json
{
  "success": false,
  "message": "Leksikon not found",
  "data": null
}
```

### 11.3 Foreign Key Constraint Error
```json
{
  "success": false,
  "message": "Invalid domain ID",
  "data": null
}
```

### 11.4 Duplicate Relationship Error
```json
{
  "success": false,
  "message": "Asset is already assigned to this leksikon",
  "data": null
}
```

### 11.5 Bulk Import Error
```json
{
  "success": false,
  "message": "Bulk import failed",
  "details": "Error parsing CSV file: Invalid CSV format",
  "stack": "Error stack trace (development mode only)"
}
```

**Common Bulk Import Errors**:
- **File Upload Errors**:
  - `"No file uploaded. Please upload a CSV file."`
  - `"Only CSV files are allowed"`

- **CSV Parsing Errors**:
  - `"Error parsing CSV file: Invalid CSV format"`
  - `"CSV file is empty"`

- **Validation Errors**:
  - `"Baris data tidak valid: lexiconWord: Lexicon word is required"`
  - `"Contributor ID 999 tidak ditemukan. Pastikan import contributor terlebih dahulu."`
  - `"Domain ID 888 tidak ditemukan. Pastikan import domain kodifikasi terlebih dahulu."`
  - `"Slug 'example-slug' sudah ada. Slug di-generate dari lexiconWord 'Example'. Gunakan lexiconWord yang berbeda atau slug manual."`

- **Database Errors**:
  - `"Gagal insert batch 1: Connection timeout"`
  - `"Failed to cleanup temp file: EPERM operation not permitted"`
        "row": 12,
        "field": "term",
        "message": "Term is required"
      }
    ]
  }
}
```

---

## 12. USAGE EXAMPLES

### 12.1 Complete Leksikon Management Flow

```bash
# 1. Create leksikon
curl -X POST http://localhost:3000/api/v1/admin/leksikons \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lexiconWord": "Tari Legong",
    "transliteration": "LEH-gong",
    "etymologicalMeaning": "Dari kata Bali '\''legong'\'' yang berarti tari",
    "culturalMeaning": "Tari tradisional Bali yang dilakukan oleh gadis remaja",
    "commonMeaning": "Tari Legong",
    "translation": "Legong Dance",
    "domainId": 1,
    "contributorId": 2,
    "status": "DRAFT"
  }'

# 2. Get leksikon details
curl http://localhost:3000/api/v1/admin/leksikons/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 3. Add asset to leksikon
curl -X POST http://localhost:3000/api/v1/admin/leksikons/1/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "assetId": 1,
    "assetRole": "GALLERY"
  }'

# 4. Add reference to leksikon
curl -X POST http://localhost:3000/api/v1/admin/leksikons/1/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "referenceId": 1,
    "referenceRole": "PRIMARY_SOURCE"
  }'

# 5. Update leksikon status
curl -X PATCH http://localhost:3000/api/v1/admin/leksikons/1/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PUBLISHED"
  }'

# 6. Get leksikon assets
curl http://localhost:3000/api/v1/admin/leksikons/1/assets \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 7. Get assets by role
curl http://localhost:3000/api/v1/admin/leksikons/1/assets/role/GALLERY \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 12.2 Advanced Search and Filter

```bash
# Search assets used in leksikons
curl "http://localhost:3000/api/v1/admin/leksikons/search/assets?q=dance&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter leksikon assets by type and status
curl "http://localhost:3000/api/v1/admin/leksikons/filter/assets?fileType=PHOTO&status=PUBLISHED&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search references used in leksikons
curl "http://localhost:3000/api/v1/admin/leksikons/search/references?q=balinese&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter leksikon references by type and year
curl "http://localhost:3000/api/v1/admin/leksikons/filter/references?referenceType=BOOK&publicationYear=2020&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 12.3 Usage Tracking

```bash
# Get all assigned assets
curl "http://localhost:3000/api/v1/admin/leksikons/assets/assigned?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check asset usage across leksikons
curl http://localhost:3000/api/v1/admin/leksikons/assets/123/usages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get all assigned references
curl "http://localhost:3000/api/v1/admin/leksikons/references/assigned?page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Check reference usage across leksikons
curl http://localhost:3000/api/v1/admin/leksikons/references/456/usages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 12.4 Bulk Import

```bash
# Bulk import from CSV
curl -X POST http://localhost:3000/api/v1/admin/leksikons/import \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@leksikon_data.csv"
```

### 12.5 Relationship Queries

```bash
# Get leksikons by domain
curl http://localhost:3000/api/v1/admin/leksikons/domain-kodifikasi/1/leksikons \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get leksikons by status
curl "http://localhost:3000/api/v1/admin/leksikons/status?status=PUBLISHED" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 13. NOTES

- **Hierarchical Structure**: Leksikon adalah core entity dalam hierarki Culture → Subculture → Domain → Leksikon
- **Slug Generation**: Auto-generated untuk SEO-friendly URLs
- **Asset Roles**: 4 jenis peran asset (GALLERY, PRONUNCIATION, VIDEO_DEMO, MODEL_3D)
- **Reference Roles**: 3 jenis peran referensi (PRIMARY_SOURCE, SECONDARY_SOURCE, ADDITIONAL_READING)
- **Usage Tracking**: Comprehensive tracking untuk asset dan reference usage
- **Bulk Operations**: CSV import untuk mass data entry
- **Status Management**: Draft → Published → Archived workflow
- **Search Flexibility**: Multiple search endpoints untuk assets dan references
- **Filter Combination**: Complex filtering untuk advanced queries
- **Pagination**: Semua list endpoints mendukung pagination
- **Relationships**: Complex relationships dengan domain, subculture, culture, assets, references</content>
<parameter name="filePath">d:\my-code\1_home\leksikon-proj\leksikon-be-2\LEKSIKON_API_DOCUMENTATION.md