# Dokumentasi Proyek Leksikon Backend untuk Skripsi

*Last Updated: December 8, 2025*

## 📋 Daftar Isi

1. [Deskripsi Pengguna](#41-deskripsi-pengguna)
2. [Kebutuhan Pengguna](#42-kebutuhan-pengguna)
3. [Permodelan Kebutuhan](#43-permodelan-kebutuhan)
4. [Arsitektur Sistem](#44-arsitektur-sistem)
5. [Dokumentasi API](#45-dokumentasi-api)
6. [Analisis Endpoint](#analisis-endpoint)

---

## 📝 Recent Updates (December 2025)

- ✅ **Complete API Documentation**: Comprehensive documentation for all admin and public endpoints
- ✅ **Enhanced Asset Filtering**: Combined search and filter capabilities in asset endpoints
- ✅ **Geographic Coordinates**: Support for latitude/longitude coordinates in cultures (not PostGIS)
- ✅ **Public API Integration**: Detailed documentation with frontend usage notes
- ✅ **Database Optimization**: Improved query performance and data relationships

---

## 4.1 Deskripsi Pengguna

### 4.1.1 Identifikasi Pengguna

Sistem Leksikon Backend memiliki 3 kategori pengguna utama:

#### 1. Admin FIB (Fakultas Ilmu Budaya)
- **Karakteristik**: 
  - Staff atau dosen FIB yang bertanggung jawab mengelola konten leksikon
  - Memiliki akses penuh ke sistem admin
  - Dapat melakukan CRUD operations pada semua entitas
- **Kebutuhan Akses**:
  - Authentication dengan JWT token
  - Role-based access (SUPER_ADMIN, EDITOR, VIEWER)
  - Akses ke semua endpoint admin (`/api/v1/admin/*`)

#### 2. Researcher (Peneliti)
- **Karakteristik**:
  - Peneliti yang menggunakan data leksikon untuk penelitian
  - Membutuhkan akses ke data yang sudah dipublikasikan
  - Membutuhkan fitur search dan filtering yang advanced
- **Kebutuhan Akses**:
  - Akses ke public API endpoints
  - Search dan filtering capabilities
  - Access ke published references dan contributors

#### 3. Public Visitor (Pengunjung Umum)
- **Karakteristik**:
  - Pengunjung website yang ingin mempelajari leksikon budaya
  - Tidak memerlukan autentikasi
  - Hanya dapat melihat konten yang sudah dipublikasikan
- **Kebutuhan Akses**:
  - Akses read-only ke public endpoints
  - Browsing leksikon, subkultur, dan budaya
  - Search dan filter capabilities

---

## 4.2 Kebutuhan Pengguna

### 4.2.1 Identifikasi Pengguna (Actor Identification)

| Actor | Deskripsi | Akses |
|-------|-----------|-------|
| **Admin** | Staff/dosen FIB yang mengelola sistem | Full access dengan authentication |
| **Researcher** | Peneliti yang menggunakan data untuk penelitian | Public API dengan advanced search |
| **Public Visitor** | Pengunjung umum website | Read-only public API |

### 4.2.2 Kebutuhan Fungsional

#### ✅ Authentication & Authorization
- [x] Admin registration (`POST /api/v1/admin/auth/register`)
- [x] Admin login (`POST /api/v1/admin/auth/login`)
- [x] Get admin profile (`GET /api/v1/admin/auth/profile`)
- [x] Change password (`PUT /api/v1/admin/auth/change-password`)
- [x] Update profile (`PUT /api/v1/admin/auth/update-profile`)
- [x] Update admin status (`PUT /api/v1/admin/auth/admins/:id/status`)
- [x] JWT token authentication middleware
- [x] Role-based access control (SUPER_ADMIN, EDITOR, VIEWER)

#### ✅ CRUD Operations untuk Leksikon
- [x] Create leksikon (`POST /api/v1/admin/leksikons`)
- [x] Read all leksikons dengan pagination (`GET /api/v1/admin/leksikons`)
- [x] Read leksikon by ID (`GET /api/v1/admin/leksikons/:id`)
- [x] Update leksikon (`PUT /api/v1/admin/leksikons/:id`)
- [x] Delete leksikon (`DELETE /api/v1/admin/leksikons/:id`)
- [x] Update leksikon status (`PATCH /api/v1/admin/leksikons/:id/status`)

#### ✅ Media Management
- [x] Upload single asset (`POST /api/v1/admin/assets/upload`)
- [x] Bulk upload assets (`POST /api/v1/admin/assets/bulk-upload`)
- [x] Get asset by ID (`GET /api/v1/admin/assets/:id`)
- [x] Update asset (`PUT /api/v1/admin/assets/:id`)
- [x] Delete asset (`DELETE /api/v1/admin/assets/:id`)
- [x] Search assets (`GET /api/v1/admin/assets/search`)
- [x] Filter assets (`GET /api/v1/admin/assets/filter`)
- [x] Public asset access (`GET /api/v1/public/assets/:id/file`)
- [x] Asset role management untuk leksikon
- [x] Asset role management untuk subculture
- [x] Asset role management untuk culture
- [x] Asset role management untuk contributor

#### ✅ Search & Filtering
- [x] Global search (`GET /api/v1/search/global`)
- [x] Advanced search (`GET /api/v1/search/advanced`)
- [x] Search lexicons (`GET /api/v1/search/lexicon`)
- [x] Search references (`GET /api/v1/search/references`)
- [x] Search contributors (`GET /api/v1/search/coordinator`)
- [x] Search cultures (`GET /api/v1/search/culture`)
- [x] Filter by status (DRAFT, PUBLISHED, ARCHIVED)
- [x] Filter by domain kodifikasi
- [x] Filter by geographic location (latitude/longitude coordinates)
- [x] Filter by conservation status
- [x] Filter by reference type
- [x] Filter by asset type

#### ✅ Bulk Import dari Excel/CSV
- [x] Bulk import leksikons dari CSV (`POST /api/v1/admin/leksikons/import`)
- [x] Flexible header mapping
- [x] Batch processing
- [x] Error handling dan reporting
- [x] Import summary (success, skipped, errors)

#### ✅ API Endpoints (Admin & Public)
- [x] Admin endpoints dengan authentication
- [x] Public endpoints tanpa authentication
- [x] Pagination support
- [x] Error handling yang konsisten
- [x] Response format yang standar

---

## 4.3 Permodelan Kebutuhan

### 4.3.1 Use Case Diagram

#### Use Cases untuk Admin:
1. **Authenticate** - Login dan register admin
2. **Manage Leksikon** - CRUD operations untuk leksikon
3. **Manage Domain Kodifikasi** - CRUD operations untuk domain
4. **Manage Subculture** - CRUD operations untuk subkultur
5. **Manage Culture** - CRUD operations untuk budaya
6. **Manage Contributor** - CRUD operations untuk kontributor
7. **Manage Reference** - CRUD operations untuk referensi
8. **Manage Asset** - Upload, update, delete media files
9. **Bulk Import** - Import data dari CSV/Excel
10. **Search & Filter** - Advanced search dan filtering
11. **Track Usage** - Track penggunaan assets dan references
12. **Update Status** - Update status publish (DRAFT, PUBLISHED, ARCHIVED)

#### Use Cases untuk Researcher/Public:
13. **Browse Leksikon** - Browse leksikon yang dipublikasikan
14. **Search Leksikon** - Search leksikon dengan berbagai kriteria
15. **View Subculture** - View detail subkultur
16. **View Culture** - View detail budaya
17. **View References** - View referensi akademik
18. **View Contributors** - View kontributor dan koordinator
19. **Access Media** - Access media files yang dipublikasikan

### 4.3.2 Activity Diagram

#### 1. Login Flow
```
Start → Input Email & Password → Validate Credentials → 
Generate JWT Token → Return Token & Profile → End
```

#### 2. Upload & Manage Leksikon
```
Start → Authenticate → Create/Update Leksikon → 
Validate Data → Save to Database → 
Link Assets/References (optional) → Return Response → End
```

#### 3. Bulk Import Excel
```
Start → Authenticate → Upload CSV File → 
Parse CSV → Validate Each Row → 
Batch Insert to Database → 
Generate Summary (success/skipped/errors) → Return Response → End
```

#### 4. Search & Filtering
```
Start → Receive Query/Filter → 
Build Database Query → 
Execute Query → 
Format Results → 
Return Paginated Results → End
```

#### 5. Media Upload
```
Start → Authenticate → Upload File → 
Validate File Type & Size → 
Upload to Blob Storage → 
Save Metadata to Database → 
Return Asset Info → End
```

---

## 4.4 Arsitektur Sistem

### 4.4.1 Multi-Layer Architecture

```
┌─────────────────────────────────────────┐
│         CLIENT LAYER                    │
│  (React/Next.js Frontend)               │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         API GATEWAY                    │
│  - Express.js Router                   │
│  - CORS Middleware                     │
│  - Authentication Middleware           │
│  - Error Handling                      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      BACKEND SERVICES                   │
│  - Controllers (Request Handling)       │
│  - Services (Business Logic)            │
│  - Validators (Data Validation)        │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│      DATABASE LAYER                     │
│  - Prisma ORM                           │
│  - PostgreSQL Database                  │
│  - PostgreSQL Database                  │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│    CLOUD STORAGE LAYER                  │
│  - Vercel Blob Storage                 │
│  - Media Files (Photos, Audio, Video)  │
└─────────────────────────────────────────┘
```

### 4.4.2 Technology Stack

- **Runtime**: Node.js dengan TypeScript
- **Framework**: Express.js v5.1.0
- **ORM**: Prisma v6.16.2
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken) + bcrypt
- **File Storage**: Vercel Blob Storage
- **File Upload**: Multer
- **Validation**: Zod

---

## 4.5 Dokumentasi API (Spesifikasi Tingkat Tinggi)

### 4.5.1 Authentication API

**Base Path**: `/api/v1/admin/auth`

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/register` | Register admin baru | ❌ |
| POST | `/login` | Login admin | ❌ |
| GET | `/profile` | Get profile admin saat ini | ✅ |
| PUT | `/change-password` | Ubah password | ✅ |
| PUT | `/update-profile` | Update profile admin | ✅ |
| PUT | `/admins/:id/status` | Update status admin | ✅ |

**Request Body (Register)**:
```json
{
  "username": "string (3-50 chars)",
  "email": "string (valid email)",
  "password": "string (min 8 chars)",
  "role": "SUPER_ADMIN | EDITOR | VIEWER (optional, default: EDITOR)"
}
```

**Response (Login)**:
```json
{
  "success": true,
  "token": "jwt_token_string",
  "admin": {
    "adminId": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "EDITOR"
  }
}
```

---

### 4.5.2 Domain Kodifikasi API

**Base Path**: `/api/v1/admin/domain-kodifikasi`

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/` | Get all domains (paginated) | ✅ |
| POST | `/` | Create domain baru | ✅ |
| GET | `/:id` | Get domain by ID | ✅ |
| PUT | `/:id` | Update domain | ✅ |
| DELETE | `/:id` | Delete domain | ✅ |
| GET | `/filter` | Filter domains (code, status) | ✅ |
| GET | `/search` | Search domains (q parameter) | ✅ |

**Request Body (Create)**:
```json
{
  "code": "string",
  "domainName": "string",
  "explanation": "string",
  "subcultureId": "number",
  "status": "DRAFT | PUBLISHED | ARCHIVED"
}
```

---

### 4.5.3 Leksikon API

**Base Path**: `/api/v1/admin/leksikons`

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/` | Get all leksikons (paginated) | ✅ |
| POST | `/` | Create leksikon baru | ✅ |
| GET | `/:id` | Get leksikon by ID | ✅ |
| PUT | `/:id` | Update leksikon | ✅ |
| DELETE | `/:id` | Delete leksikon | ✅ |
| PATCH | `/:id/status` | Update leksikon status | ✅ |
| GET | `/status` | Filter by status | ✅ |
| GET | `/domain-kodifikasi/:dk_id/leksikons` | Filter by domain | ✅ |
| GET | `/search/assets` | Search assets in leksikons | ✅ |
| GET | `/search/references` | Search references in leksikons | ✅ |
| GET | `/assets/assigned` | Get assigned assets | ✅ |
| GET | `/assets/:assetId/usages` | Get asset usage | ✅ |
| GET | `/references/assigned` | Get assigned references | ✅ |
| GET | `/references/:referenceId/usages` | Get reference usage | ✅ |
| GET | `/:id/assets` | Get leksikon assets | ✅ |
| POST | `/:id/assets` | Add asset to leksikon | ✅ |
| DELETE | `/:id/assets/:assetId` | Remove asset from leksikon | ✅ |
| PUT | `/:id/assets/:assetId/role` | Update asset role | ✅ |
| GET | `/:id/assets/role/:assetRole` | Get assets by role | ✅ |
| GET | `/:id/references` | Get leksikon references | ✅ |
| POST | `/:id/references` | Add reference to leksikon | ✅ |
| DELETE | `/:id/references/:referenceId` | Remove reference from leksikon | ✅ |
| PUT | `/:id/references/:referenceId` | Update citation note | ✅ |
| GET | `/filter/assets` | Filter assets (type, status, date) | ✅ |
| GET | `/filter/references` | Filter references (type, year, status) | ✅ |
| POST | `/import` | Bulk import dari CSV | ✅ |

**Request Body (Create)**:
```json
{
  "lexiconWord": "string",
  "ipaInternationalPhoneticAlphabet": "string (optional)",
  "transliteration": "string",
  "etymologicalMeaning": "string",
  "culturalMeaning": "string",
  "commonMeaning": "string",
  "translation": "string",
  "variant": "string (optional)",
  "variantTranslations": "string (optional)",
  "otherDescription": "string (optional)",
  "domainId": "number",
  "contributorId": "number",
  "preservationStatus": "MAINTAINED | TREATED | CRITICAL | ARCHIVED",
  "status": "DRAFT | PUBLISHED | ARCHIVED"
}
```

---

### 4.5.4 Media API

**Base Path**: `/api/v1/admin/assets`

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/` | Get all assets (paginated) | ✅ |
| GET | `/search` | Search assets | ✅ |
| GET | `/filter` | Filter assets (type, status) | ✅ |
| GET | `/:id` | Get asset by ID | ✅ |
| POST | `/upload` | Upload single asset | ✅ |
| PUT | `/:id` | Update asset | ✅ |
| DELETE | `/:id` | Delete asset | ✅ |
| POST | `/bulk-upload` | Bulk upload assets | ✅ |

**Public Endpoint**:
| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/api/v1/public/assets/:id/file` | Get public asset file | ❌ |

**Request (Upload)**:
- Content-Type: `multipart/form-data`
- Field: `file` (file upload)
- Body fields: `fileName`, `fileType`, `description`, `url`, `status`

**Asset Types**: `PHOTO`, `AUDIO`, `VIDEO`, `MODEL_3D`
**Asset Status**: `ACTIVE`, `PROCESSING`, `ARCHIVED`, `CORRUPTED`, `PUBLISHED`

---

### 4.5.5 Search API

**Base Path**: `/api/v1/search`

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/global` | Global search (formatted) | ❌ |
| GET | `/` | Global search (raw) | ❌ |
| GET | `/lexicon` | Search lexicons | ❌ |
| GET | `/advanced` | Advanced search dengan filters | ❌ |
| GET | `/references` | Search references | ❌ |
| GET | `/coordinator` | Search contributors | ❌ |
| GET | `/culture` | Search cultures | ❌ |

**Query Parameters (Advanced Search)**:
```
?query=string
&culture=string
&subculture=string
&domain=string
&region=string
&status=string
&page=number
&limit=number
```

---

### 4.5.6 Subculture API

**Base Path**: `/api/v1/admin/subcultures`

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/` | Get all subcultures (paginated) | ✅ |
| POST | `/` | Create subculture | ✅ |
| GET | `/:id` | Get subculture by ID | ✅ |
| PUT | `/:id` | Update subculture | ✅ |
| DELETE | `/:id` | Delete subculture | ✅ |
| GET | `/filter` | Filter subcultures | ✅ |
| GET | `/:id/assigned-assets` | Get assigned assets | ✅ |
| GET | `/:id/assigned-references` | Get assigned references | ✅ |
| POST | `/:id/references` | Add reference to subculture (assign ke leksikon) | ✅ |
| POST | `/:id/references-direct` | Add reference directly to subculture page | ✅ |
| GET | `/:id/references-direct` | Get references assigned directly to subculture | ✅ |
| DELETE | `/:id/references-direct/:referenceId` | Remove reference from subculture page | ✅ |
| GET | `/:id/filter-assets` | Filter assets | ✅ |
| GET | `/:id/filter-references` | Filter references | ✅ |
| GET | `/:id/search-assets` | Search assets | ✅ |
| GET | `/:id/search-references` | Search references | ✅ |
| GET | `/assets/:assetId/usage` | Get asset usage | ✅ |
| GET | `/references/:referenceId/usage` | Get reference usage | ✅ |
| GET | `/:id/assets` | Get subculture assets | ✅ |
| POST | `/:id/assets` | Add asset to subculture | ✅ |
| DELETE | `/:id/assets/:assetId` | Remove asset from subculture | ✅ |
| GET | `/:cultureId/subcultures` | Get subcultures by culture | ✅ |

**Public Endpoints** (`/api/v1/public/subcultures`):
| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/` | Get subcultures gallery | ❌ |
| GET | `/:identifier` | Get subculture detail | ❌ |
| GET | `/:identifier/lexicon` | Get subculture lexicons | ❌ |

---

### 4.5.7 Culture API

**Base Path**: `/api/v1/admin/cultures`

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/` | Get all cultures (paginated) | ✅ |
| POST | `/` | Create culture | ✅ |
| GET | `/:id` | Get culture by ID | ✅ |
| PUT | `/:id` | Update culture | ✅ |
| DELETE | `/:id` | Delete culture | ✅ |
| GET | `/search` | Search cultures | ✅ |
| GET | `/filter` | Filter cultures | ✅ |
| GET | `/cultures/:cultureId` | Get culture with assets | ✅ |
| POST | `/:id/references` | Add reference to culture (for about page) | ✅ |
| GET | `/:id/references` | Get references assigned to culture | ✅ |
| DELETE | `/:id/references/:referenceId` | Remove reference from culture | ✅ |

**Public Endpoints** (`/api/v1/public/about`):
| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| GET | `/` | Get about page data (culture with references) | ❌ |

**Request Body (Add Reference)**:
```json
{
  "referenceId": 1,
  "citationNote": "DIRECT_QUOTE",  // Optional
  "displayOrder": 2                 // Optional, default: 0
}
```

---

### 4.5.8 Bulk Import API

**Base Path**: `/api/v1/admin/leksikons`

| Method | Endpoint | Deskripsi | Auth Required |
|--------|----------|-----------|---------------|
| POST | `/import` | Bulk import dari CSV | ✅ |

**Request**:
- Content-Type: `multipart/form-data`
- Field: `file` (CSV file)

**CSV Format**:
- Headers: `Leksikon`, `Transliterasi`, `Makna Etimologi`, `Makna Kultural`, `Common Meaning`, `Translation`, `Varian`, `Translation varians`, `Deskripsi Lain`, `Domain ID`, `Contributor ID`, `Slug` (optional)
- Slug akan auto-generated dari `lexiconWord` jika tidak disediakan

**Response**:
```json
{
  "success": true,
  "message": "Bulk import completed",
  "data": {
    "imported": 100,
    "skipped": 5,
    "errors": ["Error message 1", "Error message 2"],
    "importedLexicons": ["lexicon1", "lexicon2"],
    "skippedLexicons": ["lexicon3"]
  }
}
```

---

## Analisis Endpoint

### 📊 Statistik Endpoint

**Total Endpoint**: ~106 endpoints

#### Admin Endpoints: ~65 endpoints
- Authentication: 6 endpoints
- Leksikon: 25 endpoints
- Domain Kodifikasi: 7 endpoints
- Subculture: 23 endpoints (tambah 3 endpoints references-direct)
- Culture: 10 endpoints (tambah 3 endpoints references)
- Contributor: 8 endpoints
- Reference: 7 endpoints
- Asset: 8 endpoints

#### Public Endpoints: ~26 endpoints
- Landing Page: 2 endpoints
- Lexicon: 2 endpoints
- Subculture: 3 endpoints
- Search: 7 endpoints
- Domain: 2 endpoints
- Culture: 3 endpoints
- About: 1 endpoint (baru)
- Region: 1 endpoint
- Reference: 2 endpoints
- Contributor: 2 endpoints
- Asset: 1 endpoint

---

### ✅ Endpoint yang Digunakan (Berdasarkan Komentar di Code)

#### Admin Endpoints (Semua digunakan untuk admin panel):
- ✅ Semua endpoint authentication
- ✅ Semua endpoint leksikon CRUD
- ✅ Semua endpoint domain kodifikasi
- ✅ Semua endpoint subculture
- ✅ Semua endpoint culture
- ✅ Semua endpoint contributor
- ✅ Semua endpoint reference
- ✅ Semua endpoint asset management

#### Public Endpoints yang Digunakan:
1. ✅ `GET /api/v1/public/landing` - Landing page data
2. ✅ `GET /api/v1/public/lexicons/:identifier` - Detail leksikon (dengan references)
3. ✅ `GET /api/v1/public/subcultures` - Subculture gallery
4. ✅ `GET /api/v1/public/subcultures/:identifier` - Detail subculture (dengan references)
5. ✅ `GET /api/v1/public/about` - About page data (culture dengan references) - **BARU**
6. ✅ `GET /api/v1/search/global` - Global search (formatted)
7. ✅ `GET /api/v1/search/advanced` - Advanced search
8. ✅ `GET /api/v1/search/references` - Search references
9. ✅ `GET /api/v1/search/coordinator` - Search contributors
10. ✅ `GET /api/v1/public/regions/:regionId` - Region data untuk peta
11. ✅ `GET /api/v1/public/references` - Daftar referensi (dengan usage count)
12. ✅ `GET /api/v1/public/contributors` - Daftar kontributor

---

### ❌ Endpoint yang Tidak Digunakan (Berdasarkan Komentar di Code)

#### Public Endpoints yang Tidak Digunakan:
1. ❌ `GET /api/v1/public/lexicons` - List semua leksikon tanpa filter (tidak ada pemanggilan)
2. ❌ `GET /api/v1/search` - Global search raw (tidak ada pemanggilan)
3. ❌ `GET /api/v1/search/lexicon` - Search leksikon spesifik (tidak ada pemanggilan)
4. ❌ `GET /api/v1/search/culture` - Search budaya (tidak ada pemanggilan)
5. ❌ `GET /api/v1/domains/:domain_id` - Detail domain (tidak ada pemanggilan)
6. ❌ `GET /api/v1/domains/:domain_id/search` - Search dalam domain (tidak ada pemanggilan)
7. ❌ `GET /api/v1/public/subcultures/:identifier/lexicon` - Leksikon dalam subkultur (tidak ada pemanggilan)
8. ❌ `GET /api/v1/public/cultures` - List budaya (tidak ada pemanggilan)
9. ❌ `GET /api/v1/public/cultures/:culture_id` - Detail budaya (tidak ada pemanggilan)
10. ❌ `GET /api/v1/public/cultures/:culture_id/search` - Search dalam budaya (tidak ada pemanggilan)
11. ❌ `GET /api/v1/public/references/:reference_id` - Detail referensi (tidak ada pemanggilan)
12. ❌ `GET /api/v1/public/contributors/:contributor_id` - Detail kontributor (tidak ada pemanggilan)
13. ❌ `POST /api/v1/public/landing/contact` - Contact form (tidak ada form di frontend)
14. ❓ `GET /api/v1/public/assets/:id/file` - Status tidak diketahui

---

### 📝 Catatan Penting

1. **Endpoint yang Tidak Digunakan**:
   - Beberapa endpoint public tidak digunakan karena frontend menggunakan alternatif yang lebih spesifik
   - Endpoint contact form tidak digunakan karena tidak ada implementasi form di frontend
   - Beberapa endpoint search tidak digunakan karena frontend menggunakan `/search/global` atau `/search/advanced`

2. **Endpoint yang Mungkin Perlu Dihapus**:
   - Endpoint yang tidak digunakan dapat dipertimbangkan untuk dihapus atau di-document sebagai "deprecated"
   - Namun, endpoint tersebut mungkin berguna untuk future development

3. **Endpoint Duplikat**:
   - Beberapa route memiliki duplikasi (misalnya di `leksikon.routes.ts` ada beberapa route yang didefinisikan dua kali)
   - Perlu cleanup untuk menghindari konfusi

---

## 5. Perancangan dan Implementasi

### 5.1 Pola Arsitektur Backend

#### 5.1.1 Framework & Technology Stack
- **Node.js** + **Express.js** + **TypeScript**
- **Prisma ORM** untuk database abstraction
- **PostgreSQL** untuk penyimpanan data

#### 5.1.2 Web Service Architecture
- **RESTful API design principles**
- **Middleware architecture**: Authentication, CORS, Error handling
- **Error handling strategy**: Centralized error handling dengan consistent response format

### 5.2 Model Data

#### 5.2.1 Class Diagram
Entity classes dan relationships dapat dilihat di `prisma/schema.prisma`:
- Admin
- Culture
- Subculture
- CodificationDomain
- Lexicon
- Contributor
- Asset
- Reference
- Junction tables untuk many-to-many relationships

#### 5.2.2 Model Tabel Relasi (ERD)
ERD lengkap dengan:
- **DOMAIN_KODIFIKASI** (CODIFICATION_DOMAIN) table
- **LEKSIKON** (LEXICON) table
- **SUBCULTURE** table
- **MEDIA** (ASSET) table
- **USER** (ADMIN) table
- **CONTRIBUTOR** table
- **REFERENCE** table
- **CULTURE** table
- Relationships dengan Foreign Keys dan Primary Keys

### 5.3 Implementasi Source Code (Key Controllers)

#### 5.3.1 AuthController
**File**: `src/controllers/admin/admin.controller.ts`
- `register` - Register admin baru
- `login` - Login admin
- `getProfile` - Get profile admin
- `changePassword` - Ubah password
- `updateProfile` - Update profile
- `updateAdminStatus` - Update status admin

#### 5.3.2 LexiconController
**File**: `src/controllers/admin/leksikon.controller.ts`
- `createLeksikon` - Create leksikon
- `getAllLeksikonsPaginated` - Get all dengan pagination
- `getLeksikonById` - Get by ID
- `updateLeksikon` - Update leksikon
- `deleteLeksikon` - Delete leksikon
- `updateLeksikonStatus` - Update status
- `getLeksikonsByStatus` - Filter by status
- `getLeksikonsByDomain` - Filter by domain
- `searchAssetsInLeksikons` - Search assets
- `searchReferencesInLeksikons` - Search references
- `getAssignedAssets` - Get assigned assets
- `getAssetUsage` - Get asset usage
- `getAssignedReferences` - Get assigned references
- `getReferenceUsage` - Get reference usage
- `getLeksikonAssets` - Get leksikon assets
- `addAssetToLeksikon` - Add asset
- `removeAssetFromLeksikon` - Remove asset
- `updateAssetRole` - Update asset role
- `getAssetsByRole` - Get assets by role
- `getLeksikonReferences` - Get references
- `addReferenceToLeksikon` - Add reference
- `removeReferenceFromLeksikon` - Remove reference
- `updateCitationNote` - Update citation note
- `filterLeksikonAssets` - Filter assets
- `filterLeksikonReferences` - Filter references
- `bulkImportLeksikons` - Bulk import dari CSV

#### 5.3.3 MediaController
**File**: `src/controllers/admin/asset.controller.ts`
- `getAllAssetsPaginated` - Get all assets
- `getAssetById` - Get by ID
- `createAsset` - Upload single asset
- `updateAsset` - Update asset
- `deleteAsset` - Delete asset
- `searchAssets` - Search assets
- `filterAssets` - Filter assets
- `bulkUploadAssets` - Bulk upload
- `getPublicAssetFile` - Public asset access

#### 5.3.4 DomainController
**File**: `src/controllers/admin/domainKodifikasi.controller.ts`
- `getDomains` - Get all domains
- `createDomain` - Create domain
- `getDomainById` - Get by ID
- `updateDomain` - Update domain
- `deleteDomain` - Delete domain
- `filterDomainKodifikasis` - Filter domains
- `searchDomainKodifikasis` - Search domains

#### 5.3.5 SearchController
**File**: `src/controllers/public/search.controller.ts`
- `globalSearch` - Global search raw
- `globalSearchFormatted` - Global search formatted
- `searchLexicon` - Search lexicons
- `advancedSearch` - Advanced search dengan filters
- `searchCultures` - Search cultures

#### 5.3.6 BulkImportController
**File**: `src/controllers/admin/leksikon.controller.ts` (function: `bulkImportLeksikons`)
- `bulkImportLeksikons` - Import dari CSV dengan error handling

#### 5.3.7 SubcultureController
**File**: `src/controllers/admin/subculture.controller.ts`
- `getAllSubculturesPaginated` - Get all dengan pagination
- `createSubculture` - Create subculture
- `getSubcultureById` - Get by ID
- `updateSubculture` - Update subculture
- `deleteSubculture` - Delete subculture
- `getFilteredSubcultures` - Filter subcultures
- `getAssignedAssets` - Get assigned assets
- `getAssignedReferences` - Get assigned references
- `addReferenceToSubculture` - Add reference (assign ke leksikon)
- `addReferenceToSubcultureDirect` - Add reference langsung ke subculture page - **BARU**
- `getSubcultureReferencesDirect` - Get references assigned langsung ke subculture - **BARU**
- `removeReferenceFromSubcultureDirect` - Remove reference dari subculture page - **BARU**
- `filterSubcultureAssets` - Filter assets
- `filterSubcultureReferences` - Filter references
- `searchAssetsInSubculture` - Search assets
- `searchReferencesInSubculture` - Search references
- `getAssetUsage` - Get asset usage
- `getReferenceUsage` - Get reference usage
- `getSubcultureAssets` - Get assets
- `addAssetToSubculture` - Add asset
- `removeAssetFromSubculture` - Remove asset
- `getSubculturesByCulture` - Get by culture

#### 5.3.8 CultureController
**File**: `src/controllers/admin/culture.controller.ts`
- `getAllCulturesPaginated` - Get all dengan pagination
- `createCulture` - Create culture
- `getCultureById` - Get by ID
- `updateCulture` - Update culture
- `deleteCulture` - Delete culture
- `getCultureWithAssets` - Get culture with assets
- `searchCultures` - Search cultures
- `filterCultures` - Filter cultures
- `addReferenceToCulture` - Add reference to culture (for about page) - **BARU**
- `getCultureReferences` - Get references assigned to culture - **BARU**
- `removeReferenceFromCulture` - Remove reference from culture - **BARU**

---

## Kesimpulan

### Ringkasan Implementasi

1. **Deskripsi Pengguna**: 3 kategori user dengan kebutuhan akses berbeda ✅
   - Admin FIB (full access)
   - Researcher (public API dengan advanced search)
   - Public Visitor (read-only)

2. **Kebutuhan Fungsional & Non-Fungsional**: 
   - ✅ Authentication & Authorization
   - ✅ CRUD operations untuk semua entitas
   - ✅ Media management (single & bulk upload)
   - ✅ Search & filtering (geographic, domain, status)
   - ✅ Bulk import dari Excel/CSV
   - ✅ API endpoints (admin & public)
   - ✅ Usage tracking
   - ✅ Pagination support
   - ✅ Error handling yang konsisten

3. **Permodelan Kebutuhan**: 
   - ✅ Use Case Diagram dengan 19 use cases
   - ✅ 5 Activity Diagrams untuk proses utama

4. **Arsitektur Sistem**: 
   - ✅ Multi-layer architecture dengan 5 layers
   - ✅ RESTful API design
   - ✅ Middleware architecture

5. **Dokumentasi API**: 
   - ✅ 8 kategori API endpoints
   - ✅ ~106 endpoints total
   - ✅ Admin endpoints: ~65 endpoints
   - ✅ Public endpoints: ~26 endpoints
   - ✅ Reference assignment system untuk 4 tempat (Leksikon, Subculture, Culture, List All)

### Endpoint Status

- **Digunakan**: ~76 endpoints (semua admin + 12 public endpoints)
- **Tidak Digunakan**: ~14 public endpoints (dapat dipertimbangkan untuk dihapus atau di-document sebagai deprecated)

### Endpoint Baru (Update Terbaru)

**Reference Assignment System** - Sistem untuk assign reference ke 4 tempat berbeda:
1. ✅ `POST /api/v1/admin/leksikons/:id/references` - Assign ke leksikon (sudah ada)
2. ✅ `POST /api/v1/admin/subcultures/:id/references-direct` - Assign langsung ke subculture page (baru)
3. ✅ `POST /api/v1/admin/cultures/:id/references` - Assign ke culture/about page (baru)
4. ✅ `GET /api/v1/public/references` - List all references dengan usage count (update)

**Public Endpoints Baru**:
- ✅ `GET /api/v1/public/about` - About page dengan culture references

### Rekomendasi

1. **Cleanup**: Hapus atau document sebagai deprecated endpoint yang tidak digunakan
2. **Documentation**: Lengkapi dokumentasi API dengan contoh request/response
3. **Testing**: Tambahkan unit tests dan integration tests
3. **Monitoring**: Implementasi logging dan monitoring untuk production

---

## 👤 Author

**Nanda Ha**
- **GitHub**: [@nandaha29](https://github.com/nandaha29)
- **Repository**: [be-corpora](https://github.com/nandaha29/be-corpora)
- **Project**: Leksikon Backend API for Cultural Lexicon Management System

---

**Dokumen ini dibuat untuk membantu penulisan skripsi. Semua informasi berdasarkan analisis kode source code aktual.**

