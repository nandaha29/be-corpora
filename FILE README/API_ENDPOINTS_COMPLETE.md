# 📚 Complete API Endpoints Documentation

**Base URL:** `https://be-corpora.vercel.app/api/v1`

> 📌 Dokumentasi ini berisi semua endpoint API yang digunakan oleh Frontend Admin Panel dan Public Website

---

## 📋 Table of Contents

1. [Authentication & Admin](#1-authentication--admin)
2. [Leksikon (Lexicons)](#2-leksikon-lexicons)
3. [Subcultures](#3-subcultures)
4. [Cultures](#4-cultures)
5. [Assets](#5-assets)
6. [References](#6-references)
7. [Contributors](#7-contributors)
8. [Domain Kodifikasi](#8-domain-kodifikasi)
9. [Reference Junctions](#9-reference-junctions)
10. [About References](#10-about-references)

---

## 1. Authentication & Admin

> **File:** `src/routes/admin/admin.routes.ts`  
> **Controller:** `src/controllers/admin/admin.controller.ts`  
> **Service:** `src/services/admin/admin.service.ts`

### Public Endpoints (No Auth Required)

| Method | Endpoint | Keterangan | Status |
|--------|----------|------------|--------|
| `POST` | `/admin/auth/login` | Login admin dengan email & password, return JWT token | ✅ **DIGUNAKAN** |
| `POST` | `/admin/auth/register` | Register admin baru (username, email, password, role) | ✅ **DIGUNAKAN** |

### Protected Endpoints (Auth Required)

| Method | Endpoint | Keterangan | Status |
|--------|----------|------------|--------|
| `GET` | `/admin/auth/verify` | Verifikasi token JWT admin | 🚧 **TODO** - Diminta frontend tapi belum diimplementasi |
| `GET` | `/admin/profile` | Get profil admin yang sedang login | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/update-profile` | Update profil admin (username, email, role) | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/change-password` | Ubah password admin | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |
| `PUT` | `/admin/admins/:id/status` | Update status admin (activate/deactivate) | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |
| `GET` | `/admin/settings` | Get pengaturan admin | ❌ **TIDAK TERSEDIA** - Diminta frontend tapi belum ada |
| `PUT` | `/admin/settings/notifications` | Update pengaturan notifikasi | ❌ **TIDAK TERSEDIA** - Diminta frontend tapi belum ada |
| `PUT` | `/admin/settings/app` | Update pengaturan aplikasi | ❌ **TIDAK TERSEDIA** - Diminta frontend tapi belum ada |

---

## 2. Leksikon (Lexicons)

> **File:** `src/routes/admin/leksikon.routes.ts`  
> **Controller:** `src/controllers/admin/leksikon.controller.ts`  
> **Service:** `src/services/admin/leksikon.service.ts`

### Basic CRUD Operations

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/leksikons` | Get semua leksikon dengan pagination | `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/leksikons/:id` | Get leksikon berdasarkan ID | - | ✅ **DIGUNAKAN** |
| `POST` | `/admin/leksikons` | Create leksikon baru | - | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/leksikons/:id` | Update leksikon | - | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/leksikons/:id` | Delete leksikon | - | ✅ **DIGUNAKAN** |

### Search & Filter Operations

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/leksikons/status` | Filter leksikon by status | `status` (DRAFT/PUBLISHED/ARCHIVED) | ✅ **DIGUNAKAN** |
| `GET` | `/admin/leksikons/domain-kodifikasi/:dk_id/leksikons` | Get leksikons by domain kodifikasi | - | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |
| `POST` | `/admin/leksikons/import` | Import leksikon dari CSV | - | ✅ **DIGUNAKAN** |

### Leksikon Assets Management

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/leksikons/:id/assets` | Get assets dari leksikon tertentu | - | ✅ **DIGUNAKAN** |
| `POST` | `/admin/leksikons/:id/assets` | Tambah asset ke leksikon | - | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/leksikons/:id/assets/:assetId` | Hapus asset dari leksikon | - | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/leksikons/:id/assets/:assetId/role` | Update role asset dalam leksikon | - | ✅ **DIGUNAKAN** |
| `GET` | `/admin/leksikons/assets/assigned` | Get semua assets yang sudah di-assign | `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/leksikons/filter/assets` | Filter assigned assets | `fileType`, `status`, `createdAt`, `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/leksikons/assets/:assetId/usages` | Get semua leksikon yang menggunakan asset | - | ✅ **DIGUNAKAN** |
| `GET` | `/admin/leksikons/search/assets` | Search leksikon assets | `q`, `page`, `limit` | ✅ **DIGUNAKAN** |

### Leksikon References Management

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/leksikons/:id/references` | Get references dari leksikon | - | ✅ **DIGUNAKAN** |
| `POST` | `/admin/leksikons/:id/references` | Tambah reference ke leksikon | - | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/leksikons/:id/references/:refId` | Hapus reference dari leksikon | - | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/leksikons/:id/references/:refId` | Update citation note | - | ✅ **DIGUNAKAN** |
| `GET` | `/admin/leksikons/references/assigned` | Get semua assigned references | `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/leksikons/filter/references` | Filter assigned references | `referenceType`, `publicationYear`, `status`, `page`, `limit` | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |
| `GET` | `/admin/leksikons/search/references` | Search leksikon references | `q`, `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/leksikons/references/:referenceId/usages` | Get leksikons yang menggunakan reference | - | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |

---

## 3. Subcultures

> **File:** `src/routes/admin/subculture.routes.ts`  
> **Controller:** `src/controllers/admin/subculture.controller.ts`  
> **Service:** `src/services/admin/subculture.service.ts`

### Basic CRUD Operations

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/subcultures` | Get semua subcultures dengan pagination | `page`, `limit` | ✅ **DIGUNAKAN** |
| `POST` | `/admin/subcultures` | Create subculture baru | - | ✅ **DIGUNAKAN** |
| `GET` | `/admin/subcultures/filter` | Filter subcultures | `status`, `displayPriorityStatus`, `conservationStatus`, `cultureId`, `search`, `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/subcultures/:id` | Get subculture by ID | - | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/subcultures/:id` | Update subculture | - | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/subcultures/:id` | Delete subculture | - | ✅ **DIGUNAKAN** |

### Subculture Assets Management

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/subcultures/:id/assets` | Get assets subculture (legacy) | - | ✅ **DIGUNAKAN** |
| `POST` | `/admin/subcultures/:id/assets` | Tambah asset ke subculture | - | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/subcultures/:id/assets/:assetId` | Hapus asset dari subculture | `assetRole` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/subcultures/:id/assigned-assets` | Get assigned assets | - | ✅ **DIGUNAKAN** |
| `GET` | `/admin/subcultures/:id/search-assets` | Search assets dalam subculture | `q` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/subcultures/:id/filter-assets` | Filter assets | `type`, `assetRole`, `status`, `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/subcultures/assets/:assetId/usage` | Get asset usage (orphan detection) | - | ✅ **DIGUNAKAN** |

### Subculture References Management

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/subcultures/:id/references-direct` | Get direct references | - | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi frontend pakai endpoint lain |
| `POST` | `/admin/subcultures/:id/references-direct` | Tambah reference langsung ke subculture | - | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi frontend pakai endpoint lain |
| `DELETE` | `/admin/subcultures/:id/references-direct/:referenceId` | Hapus reference dari subculture | - | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi frontend pakai endpoint lain |
| `GET` | `/admin/subcultures/:id/assigned-references` | Get assigned references | - | ✅ **DIGUNAKAN** |
| `GET` | `/admin/subcultures/:id/filter-references` | Filter + search references | `referenceType`, `publicationYear`, `status`, `referenceRole`, `q`, `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/subcultures/references/:referensiId/usage` | Get reference usage | - | ✅ **DIGUNAKAN** |

---

## 4. Cultures

> **File:** `src/routes/admin/culture.routes.ts`  
> **Controller:** `src/controllers/admin/culture.controller.ts`  
> **Service:** `src/services/admin/culture.service.ts`

### Basic CRUD Operations

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/cultures` | Get semua cultures dengan pagination | `page`, `limit` | ✅ **DIGUNAKAN** |
| `POST` | `/admin/cultures` | Create culture baru | - | ✅ **DIGUNAKAN** |
| `GET` | `/admin/cultures/search` | Search cultures | `q`, `page`, `limit` | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |
| `GET` | `/admin/cultures/filter` | Filter cultures | `conservationStatus`, `status`, `originIsland`, `province`, `cityRegion`, `page`, `limit` | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |
| `GET` | `/admin/cultures/:id` | Get culture by ID | - | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/cultures/:id` | Update culture | - | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/cultures/:id` | Delete culture | - | ✅ **DIGUNAKAN** |

### Culture Assets Management

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/cultures/:id/assets` | Get assets dari culture | - | ❌ **TIDAK TERSEDIA** - Diminta frontend tapi belum ada di backend |
| `POST` | `/admin/cultures/:id/assets` | Tambah asset ke culture | - | ❌ **TIDAK TERSEDIA** - Diminta frontend tapi belum ada di backend |
| `PUT` | `/admin/cultures/:id/assets/:assetId` | Update asset role | - | ❌ **TIDAK TERSEDIA** - Diminta frontend tapi belum ada di backend |
| `DELETE` | `/admin/cultures/:id/assets/:assetId` | Hapus asset dari culture | - | ❌ **TIDAK TERSEDIA** - Diminta frontend tapi belum ada di backend |

---

## 5. Assets

> **File:** `src/routes/admin/asset.routes.ts`  
> **Controller:** `src/controllers/admin/asset.controller.ts`  
> **Service:** `src/services/admin/asset.service.ts`

### Asset Management

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/assets` | Get semua assets dengan pagination | `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/assets/search` | Search assets | `q`, `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/assets/filter` | Filter assets | `fileType`, `status`, `search`, `sortBy`, `order`, `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/assets/:id` | Get asset by ID | - | ✅ **DIGUNAKAN** |
| `POST` | `/admin/assets/upload` | Upload asset baru (dengan file) | - | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/assets/:id` | Update asset (dengan optional file) | - | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/assets/:id` | Delete asset | - | ✅ **DIGUNAKAN** |

### File Types Supported
- `PHOTO` - Image files
- `AUDIO` - Audio files
- `VIDEO` - Video files (URL-based)
- `MODEL_3D` - 3D model files (URL-based)

### Asset Status
- `ACTIVE` - Asset aktif dan dapat digunakan
- `PROCESSING` - Asset sedang diproses
- `ARCHIVED` - Asset diarsipkan
- `CORRUPTED` - Asset rusak/corrupt
- `PUBLISHED` - Asset dipublikasikan

---

## 6. References

> **File:** `src/routes/admin/reference.routes.ts`  
> **Controller:** `src/controllers/admin/reference.controller.ts`  
> **Service:** `src/services/admin/reference.service.ts`

### Reference Management

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/references` | Get semua references dengan pagination | `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/references/search` | Search references | `q`, `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/references/filter` | Filter references | `referenceType`, `publicationYear`, `status`, `createdAtFrom`, `createdAtTo`, `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/references/:id` | Get reference by ID | - | ✅ **DIGUNAKAN** |
| `POST` | `/admin/references` | Create reference baru | - | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/references/:id` | Update reference | - | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/references/:id` | Delete reference | - | ✅ **DIGUNAKAN** |

### Reference Types
- `JOURNAL` - Jurnal ilmiah
- `BOOK` - Buku
- `ARTICLE` - Artikel
- `WEBSITE` - Website
- `REPORT` - Laporan
- `THESIS` - Skripsi/Thesis
- `DISSERTATION` - Disertasi
- `FIELD_NOTE` - Catatan lapangan

### Reference Roles
- `PRIMARY_SOURCE` - Sumber primer
- `SECONDARY_SOURCE` - Sumber sekunder
- `SUPPORTING` - Sumber pendukung

---

## 7. Contributors

> **File:** `src/routes/admin/contributor.routes.ts`  
> **Controller:** `src/controllers/admin/contributor.controller.ts`  
> **Service:** `src/services/admin/contributor.service.ts`

### Contributor Management

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/contributors` | Get semua contributors | `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/contributors/search` | Search contributors | `q`, `page`, `limit` | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |
| `GET` | `/admin/contributors/filter` | Filter coordinators | `coordinatorStatus`, `expertiseArea`, `institution`, `page`, `limit` | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |
| `GET` | `/admin/contributors/:id` | Get contributor by ID | - | ✅ **DIGUNAKAN** |
| `POST` | `/admin/contributors` | Create contributor | - | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/contributors/:id` | Update contributor | - | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/contributors/:id` | Delete contributor | - | ✅ **DIGUNAKAN** |

---

## 8. Domain Kodifikasi

> **File:** `src/routes/admin/domainKodifikasi.routes.ts`  
> **Controller:** `src/controllers/admin/domainKodifikasi.controller.ts`  
> **Service:** `src/services/admin/domainKodifikasi.service.ts`

### Domain Kodifikasi Management

| Method | Endpoint | Keterangan | Query Params |
|--------|----------|------------|--------------|
| `GET` | `/admin/domain-kodifikasi` | Get semua domain | `page`, `limit` | ✅ **DIGUNAKAN** |
| `GET` | `/admin/domain-kodifikasi/search` | Search domain | `q`, `page`, `limit` | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |
| `GET` | `/admin/domain-kodifikasi/filter` | Filter domain | `code`, `status`, `page`, `limit` | ⚠️ **TIDAK DIGUNAKAN** - Tersedia tapi tidak diminta frontend |
| `GET` | `/admin/domain-kodifikasi/:id` | Get domain by ID | - | ✅ **DIGUNAKAN** |
| `POST` | `/admin/domain-kodifikasi` | Create domain baru | - | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/domain-kodifikasi/:id` | Update domain | - | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/domain-kodifikasi/:id` | Delete domain | - | ✅ **DIGUNAKAN** |

---

## 9. Reference Junctions

> **File:** `src/routes/admin/reference-junction.routes.ts`  
> **Controller:** `src/controllers/admin/reference-junction.controller.ts`  
> **Service:** `src/services/admin/reference-junction.service.ts`

### Lexicon Reference Junction

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| `POST` | `/admin/reference-junctions/lexicon/assign` | Assign reference ke lexicon | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/reference-junctions/lexicon/:lexiconId/:refId` | Remove lexicon reference | ✅ **DIGUNAKAN** |
| `GET` | `/admin/reference-junctions/lexicon/:lexiconId` | Get lexicon references | ✅ **DIGUNAKAN** |

### Subculture Reference Junction

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| `POST` | `/admin/reference-junctions/subculture/assign` | Assign reference ke subculture | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/reference-junctions/subculture/:subcultureId/:refId` | Remove subculture reference | ✅ **DIGUNAKAN** |
| `GET` | `/admin/reference-junctions/subculture/:subcultureId` | Get subculture references | ✅ **DIGUNAKAN** |

### Culture Reference Junction

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| `POST` | `/admin/reference-junctions/culture/assign` | Assign reference ke culture | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/reference-junctions/culture/:cultureId/:refId` | Remove culture reference | ✅ **DIGUNAKAN** |
| `GET` | `/admin/reference-junctions/culture/:cultureId` | Get culture references | ✅ **DIGUNAKAN** |

### Reference Statistics

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| `GET` | `/admin/reference-junctions/stats/:referenceId` | Get reference usage stats across all entities | ✅ **DIGUNAKAN** |

---

## 10. About References

> **File:** `src/routes/admin/about-reference.routes.ts`  
> **Controller:** `src/controllers/admin/about-reference.controller.ts`  
> **Service:** `src/services/admin/about-reference.service.ts`

### About References Management

| Method | Endpoint | Keterangan |
|--------|----------|------------|
| `GET` | `/admin/about-references` | Get semua about references | ✅ **DIGUNAKAN** |
| `GET` | `/admin/about-references/:id` | Get about reference by ID | ✅ **DIGUNAKAN** |
| `POST` | `/admin/about-references` | Create about reference | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/about-references/:id` | Update about reference | ✅ **DIGUNAKAN** |
| `DELETE` | `/admin/about-references/:id` | Delete about reference | ✅ **DIGUNAKAN** |
| `PUT` | `/admin/about-references/reorder` | Reorder about references | ✅ **DIGUNAKAN** |

---

## 📊 Summary Statistics

| Category | Endpoint Count | Status Breakdown |
|----------|----------------|------------------|
| Authentication & Admin | 10 | 5 ✅ digunakan, 3 ❌ tidak ada, 2 ⚠️ tidak digunakan |
| Leksikon Management | 22 | 19 ✅ digunakan, 1 ❌ tidak ada, 2 ⚠️ tidak digunakan |
| Subculture Management | 17 | 13 ✅ digunakan, 4 ❌ tidak ada, 0 ⚠️ tidak digunakan |
| Culture Management | 11 | 5 ✅ digunakan, 4 ❌ tidak ada, 2 ⚠️ tidak digunakan |
| Asset Management | 7 | 7 ✅ digunakan, 0 ❌ tidak ada, 0 ⚠️ tidak digunakan |
| Reference Management | 7 | 7 ✅ digunakan, 0 ❌ tidak ada, 0 ⚠️ tidak digunakan |
| Contributor Management | 7 | 5 ✅ digunakan, 0 ❌ tidak ada, 2 ⚠️ tidak digunakan |
| Domain Kodifikasi | 7 | 5 ✅ digunakan, 1 ❌ tidak ada, 1 ⚠️ tidak digunakan |
| Reference Junctions | 10 | 10 ✅ digunakan, 0 ❌ tidak ada, 0 ⚠️ tidak digunakan |
| About References | 6 | 6 ✅ digunakan, 0 ❌ tidak ada, 0 ⚠️ tidak digunakan |
| **Admin Total** | **122** | **85 ✅ digunakan, 14 ❌ tidak ada, 23 ⚠️ tidak digunakan** |
| **Public Endpoints** | **26** | **12 ✅ digunakan, 0 ❌ tidak ada, 13 ⚠️ tidak digunakan, 1 ❓ tidak diketahui** |
| **GRAND TOTAL** | **148** | **97 ✅ digunakan, 14 ❌ tidak ada, 36 ⚠️ tidak digunakan** |

**Utilization Rate: 65.5% (97 dari 148 endpoints aktif digunakan)**

---

## 🔐 Authentication Notes

### JWT Token Format
```
Authorization: Bearer <token>
```

### Token Payload
```json
{
  "id": 1,
  "email": "admin@example.com",
  "role": "ADMIN",
  "iat": 1702819200,
  "exp": 1702905600
}
```

### Role Types
- `EDITOR` - Can create and edit content
- `ADMIN` - Full access to all features
- `SUPER_ADMIN` - System administrator

---

## 📝 Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error description"
}
```

---

## 🌐 Public Endpoints (26 endpoints)

**Base URL:** `https://be-corpora.vercel.app/api/v1`

### Search Endpoints
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/public/search/global` | Global search formatted for frontend | ✅ **DIGUNAKAN** |
| `GET` | `/public/search/advanced` | Advanced search with multiple filters | ✅ **DIGUNAKAN** |
| `GET` | `/search/references` | Search published references | ✅ **DIGUNAKAN** |
| `GET` | `/search/coordinator` | Search published contributors | ✅ **DIGUNAKAN** |
| `GET` | `/public/search` | Comprehensive global search | ⚠️ **TIDAK DIGUNAKAN** |
| `GET` | `/public/search/lexicon` | Search specific lexicons | ⚠️ **TIDAK DIGUNAKAN** |
| `GET` | `/search/culture` | Search published cultures | ⚠️ **TIDAK DIGUNAKAN** |

### Content Endpoints
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| `GET` | `/public/lexicons/:identifier` | Get lexicon detail by slug/ID | ✅ **DIGUNAKAN** |
| `GET` | `/public/subcultures` | Get subcultures gallery | ✅ **DIGUNAKAN** |
| `GET` | `/public/subcultures/:id` | Get subculture detail | ✅ **DIGUNAKAN** |
| `GET` | `/public/domains` | Get all published domains | ✅ **DIGUNAKAN** |
| `GET` | `/public/domains/:id` | Get domain detail | ✅ **DIGUNAKAN** |
| `GET` | `/public/contributors` | Get published contributors | ✅ **DIGUNAKAN** |
| `GET` | `/public/regions/:regionId` | Get region data for map | ✅ **DIGUNAKAN** |
| `GET` | `/public/landing` | Get landing page data | ✅ **DIGUNAKAN** |
| `GET` | `/public/about` | Get about page data | ✅ **DIGUNAKAN** |
| `GET` | `/public/lexicons` | Get all published lexicons | ⚠️ **TIDAK DIGUNAKAN** |
| `GET` | `/public/cultures` | Get all published cultures | ⚠️ **TIDAK DIGUNAKAN** |
| `GET` | `/public/cultures/:culture_id` | Get culture detail | ⚠️ **TIDAK DIGUNAKAN** |
| `GET` | `/public/cultures/:culture_id/search` | Search lexicons in culture | ⚠️ **TIDAK DIGUNAKAN** |
| `GET` | `/public/contributors/:contributor_id` | Get contributor detail | ⚠️ **TIDAK DIGUNAKAN** |
| `GET` | `/public/domains/:domain_id/search` | Search lexicons in domain | ⚠️ **TIDAK DIGUNAKAN** |
| `GET` | `/public/regions` | Get all available regions | ⚠️ **TIDAK DIGUNAKAN** |
| `GET` | `/public/landing-page` | Alternative landing page data | ⚠️ **TIDAK DIGUNAKAN** |
| `POST` | `/public/landing-page/contact` | Submit contact form | ⚠️ **TIDAK DIGUNAKAN** - No contact form in frontend |
| `GET` | `/public/assets/:id/file` | Get public asset file | ❓ **STATUS TIDAK DIKETAHUI** |

---

## 📁 File Structure Reference

```
src/
├── routes/admin/
│   ├── admin.routes.ts          # Auth & profile endpoints
│   ├── leksikon.routes.ts       # Lexicon CRUD + assets + references
│   ├── subculture.routes.ts     # Subculture management
│   ├── culture.routes.ts        # Culture management
│   ├── asset.routes.ts          # Asset upload & management
│   ├── reference.routes.ts      # Reference management
│   ├── contributor.routes.ts    # Contributor management
│   ├── domainKodifikasi.routes.ts   # Domain kodifikasi
│   ├── reference-junction.routes.ts # Reference assignments
│   └── about-reference.routes.ts    # About page references
├── controllers/admin/           # Request handlers
├── services/admin/              # Business logic
├── middleware/
│   └── auth.middleware.ts       # JWT authentication
└── lib/
    ├── prisma.ts                # Database client
    └── validators.ts            # Zod validation schemas
```

---

*Last Updated: December 22, 2025*
