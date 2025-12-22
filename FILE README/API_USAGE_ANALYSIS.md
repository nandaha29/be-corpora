# 📊 Analisis Penggunaan API Endpoints

**Tanggal Analisis:** 17 Desember 2025

Dokumen ini membandingkan endpoint yang **diminta oleh Frontend Admin** vs **yang tersedia di Backend**.

---

## 🎯 Legend

| Status | Arti |
|--------|------|
| ✅ | **DIGUNAKAN** - Endpoint tersedia di backend DAN digunakan oleh frontend |
| ⚠️ | **TERSEDIA TAPI TIDAK DIGUNAKAN** - Endpoint ada di backend tapi tidak disebutkan di daftar frontend |
| ❌ | **TIDAK TERSEDIA** - Endpoint diminta frontend tapi BELUM ada di backend |
| 🚧 | **TODO** - Endpoint direncanakan tapi belum diimplementasi |

---

## 1. Authentication & Admin

### Routes File: `src/routes/admin/admin.routes.ts`

| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `POST` | `/admin/auth/login` | ✅ Digunakan | ✅ Tersedia | Login admin |
| `POST` | `/admin/auth/register` | ✅ Digunakan | ✅ Tersedia | Register admin baru |
| `GET` | `/admin/auth/verify` | ✅ Diminta | 🚧 TODO | Verifikasi token - **BELUM DIIMPLEMENTASI** |
| `GET` | `/admin/profile` | ✅ Digunakan | ✅ Tersedia | Get profil admin |
| `PUT` | `/admin/update-profile` | ✅ Digunakan | ✅ Tersedia | Update profil admin |
| `PUT` | `/admin/change-password` | ⚠️ Tidak diminta | ✅ Tersedia | Ganti password |
| `PUT` | `/admin/admins/:id/status` | ⚠️ Tidak diminta | ✅ Tersedia | Update status admin |
| `GET` | `/admin/settings` | ✅ Diminta | ❌ Tidak ada | **BELUM ADA** |
| `PUT` | `/admin/settings/notifications` | ✅ Diminta | ❌ Tidak ada | **BELUM ADA** |
| `PUT` | `/admin/settings/app` | ✅ Diminta | ❌ Tidak ada | **BELUM ADA** |

**Summary Auth:** 5 digunakan, 3 TODO/tidak ada, 2 tersedia tapi tidak digunakan

---

## 2. Leksikon (Lexicons)

### Routes File: `src/routes/admin/leksikon.routes.ts`

#### Basic CRUD
| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/leksikons` | ✅ Digunakan | ✅ Tersedia | Get semua leksikon (pagination) |
| `GET` | `/admin/leksikons/:id` | ✅ Digunakan | ✅ Tersedia | Get leksikon by ID |
| `POST` | `/admin/leksikons` | ✅ Digunakan | ✅ Tersedia | Create leksikon |
| `PUT` | `/admin/leksikons/:id` | ✅ Digunakan | ✅ Tersedia | Update leksikon |
| `DELETE` | `/admin/leksikons/:id` | ✅ Digunakan | ✅ Tersedia | Delete leksikon |
| `PATCH` | `/admin/leksikons/:id/status` | ✅ Digunakan | ✅ Tersedia | Update status leksikon |
| `GET` | `/admin/leksikons/status` | ✅ Digunakan | ✅ Tersedia | Filter by status |
| `GET` | `/admin/leksikons/filter` | ✅ Diminta | ❌ Tidak ada | Filter status + domain - **BELUM ADA endpoint ini** |
| `POST` | `/admin/leksikons/import` | ✅ Digunakan | ✅ Tersedia | Import CSV |
| `GET` | `/search/advanced` | ✅ Diminta | ⚠️ Berbeda path | Ada di `/api/v1/search/*` |

#### Leksikon Assets
| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/leksikons/:id/assets` | ✅ Digunakan | ✅ Tersedia | Get assets leksikon |
| `POST` | `/admin/leksikons/:id/assets` | ✅ Digunakan | ✅ Tersedia | Add asset |
| `DELETE` | `/admin/leksikons/:id/assets/:assetId` | ✅ Digunakan | ✅ Tersedia | Remove asset |
| `PUT` | `/admin/leksikons/:id/assets/:assetId/role` | ✅ Digunakan | ✅ Tersedia | Update asset role |
| `GET` | `/admin/leksikons/assets/assigned` | ✅ Digunakan | ✅ Tersedia | Get assigned assets |
| `GET` | `/admin/leksikons/filter/assets` | ✅ Digunakan | ✅ Tersedia | Filter assigned assets |
| `GET` | `/admin/leksikons/assets/:assetId/usages` | ✅ Digunakan | ✅ Tersedia | Get asset usage |
| `GET` | `/admin/leksikons/search/assets` | ✅ Digunakan | ✅ Tersedia | Search assets |
| `GET` | `/admin/leksikons/:id/assets/role/:assetRole` | ⚠️ Tidak diminta | ✅ Tersedia | Get assets by role |

#### Leksikon References
| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/leksikons/:id/references` | ✅ Digunakan | ✅ Tersedia | Get references |
| `POST` | `/admin/leksikons/:id/references` | ✅ Digunakan | ✅ Tersedia | Add reference |
| `DELETE` | `/admin/leksikons/:id/references/:refId` | ✅ Digunakan | ✅ Tersedia | Remove reference |
| `PUT` | `/admin/leksikons/:id/references/:refId` | ✅ Digunakan | ✅ Tersedia | Update citation note |
| `GET` | `/admin/leksikons/references/assigned` | ✅ Digunakan | ✅ Tersedia | Get assigned refs |
| `GET` | `/admin/leksikons/search/references` | ✅ Digunakan | ✅ Tersedia | Search references |
| `GET` | `/admin/leksikons/filter/references` | ⚠️ Tidak diminta | ✅ Tersedia | Filter references |
| `GET` | `/admin/leksikons/references/:referenceId/usages` | ⚠️ Tidak diminta | ✅ Tersedia | Get ref usage |
| `GET` | `/admin/leksikons/domain-kodifikasi/:dk_id/leksikons` | ⚠️ Tidak diminta | ✅ Tersedia | Get by domain |

**Summary Leksikon:** 22 digunakan, 1 tidak ada, 4 tersedia tapi tidak digunakan

---

## 3. Subcultures

### Routes File: `src/routes/admin/subculture.routes.ts`

#### Basic CRUD
| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/subcultures` | ✅ Digunakan | ✅ Tersedia | Get semua subcultures |
| `GET` | `/admin/subcultures/:id` | ✅ Digunakan | ✅ Tersedia | Get by ID |
| `POST` | `/admin/subcultures` | ✅ Digunakan | ✅ Tersedia | Create |
| `PUT` | `/admin/subcultures/:id` | ✅ Digunakan | ✅ Tersedia | Update |
| `DELETE` | `/admin/subcultures/:id` | ✅ Digunakan | ✅ Tersedia | Delete |
| `GET` | `/admin/subcultures/filter` | ✅ Digunakan | ✅ Tersedia | Filter |

#### Subculture Assets
| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/subcultures/:id/assets` | ✅ Digunakan | ✅ Tersedia | Get assets |
| `POST` | `/admin/subcultures/:id/assets` | ✅ Digunakan | ✅ Tersedia | Add asset |
| `DELETE` | `/admin/subcultures/:id/assets/:assetId` | ✅ Digunakan | ✅ Tersedia | Remove asset |
| `GET` | `/admin/subcultures/:id/assigned-assets` | ✅ Digunakan | ✅ Tersedia | Get assigned |
| `GET` | `/admin/subcultures/:id/search-assets` | ✅ Digunakan | ✅ Tersedia | Search assets |
| `GET` | `/admin/subcultures/:id/filter-assets` | ✅ Digunakan | ✅ Tersedia | Filter assets |
| `GET` | `/admin/subcultures/assets/:assetId/usage` | ✅ Digunakan | ✅ Tersedia | Asset usage |

#### Subculture References
| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/subcultures/:id/references` | ✅ Diminta | ❌ Tidak ada | **Gunakan references-direct** |
| `POST` | `/admin/subcultures/:id/references` | ✅ Diminta | ❌ Tidak ada | **Gunakan references-direct** |
| `DELETE` | `/admin/subcultures/:id/references/:refId` | ✅ Diminta | ❌ Tidak ada | **Gunakan references-direct** |
| `GET` | `/admin/subcultures/:id/references-direct` | ⚠️ Tidak diminta | ✅ Tersedia | Get direct refs |
| `POST` | `/admin/subcultures/:id/references-direct` | ⚠️ Tidak diminta | ✅ Tersedia | Add direct ref |
| `DELETE` | `/admin/subcultures/:id/references-direct/:refId` | ⚠️ Tidak diminta | ✅ Tersedia | Remove direct ref |
| `GET` | `/admin/subcultures/:id/assigned-references` | ✅ Digunakan | ✅ Tersedia | Get assigned |
| `GET` | `/admin/subcultures/:id/search-references` | ✅ Diminta | ❌ Tidak ada | **Di-comment out** |
| `GET` | `/admin/subcultures/:id/filter-references` | ✅ Digunakan | ✅ Tersedia | Filter refs |

**⚠️ PERHATIAN Subculture References:**
- Frontend meminta `/references` tapi backend pakai `/references-direct`
- Perlu diselaraskan naming convention

**Summary Subcultures:** 13 digunakan, 4 tidak ada, 3 tersedia tapi tidak digunakan

---

## 4. Cultures

### Routes File: `src/routes/admin/culture.routes.ts`

| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/cultures` | ✅ Digunakan | ✅ Tersedia | Get all |
| `GET` | `/admin/cultures/:id` | ✅ Digunakan | ✅ Tersedia | Get by ID |
| `POST` | `/admin/cultures` | ✅ Digunakan | ✅ Tersedia | Create |
| `PUT` | `/admin/cultures/:id` | ✅ Digunakan | ✅ Tersedia | Update |
| `DELETE` | `/admin/cultures/:id` | ✅ Digunakan | ✅ Tersedia | Delete |
| `GET` | `/admin/cultures/search` | ⚠️ Tidak diminta | ✅ Tersedia | Search |
| `GET` | `/admin/cultures/filter` | ⚠️ Tidak diminta | ✅ Tersedia | Filter |

#### Culture Assets
| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/cultures/:id/assets` | ✅ Digunakan | ❌ Tidak ada | **BELUM ADA** |
| `POST` | `/admin/cultures/:id/assets` | ✅ Digunakan | ❌ Tidak ada | **BELUM ADA** |
| `PUT` | `/admin/cultures/:id/assets/:assetId` | ✅ Digunakan | ❌ Tidak ada | **BELUM ADA** |
| `DELETE` | `/admin/cultures/:id/assets/:assetId` | ✅ Digunakan | ❌ Tidak ada | **BELUM ADA** |
| `GET` | `/admin/cultures/cultures/:cultureId` | ⚠️ Tidak diminta | ✅ Tersedia | Get with assets |
| `GET` | `/admin/cultures/:id/references` | ⚠️ Tidak diminta | ✅ Tersedia | Get refs |
| `POST` | `/admin/cultures/:id/references` | ⚠️ Tidak diminta | ✅ Tersedia | Add ref |
| `DELETE` | `/admin/cultures/:id/references/:refId` | ⚠️ Tidak diminta | ✅ Tersedia | Remove ref |

**⚠️ PERHATIAN:** Culture Assets endpoint diminta frontend tapi **BELUM ADA di backend!**

**Summary Cultures:** 5 digunakan, 4 tidak ada, 6 tersedia tapi tidak digunakan

---

## 5. Assets

### Routes File: `src/routes/admin/asset.routes.ts`

| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/assets` | ✅ Digunakan | ✅ Tersedia | Get all |
| `GET` | `/admin/assets/:id` | ✅ Digunakan | ✅ Tersedia | Get by ID |
| `POST` | `/admin/assets/upload` | ✅ Digunakan | ✅ Tersedia | Upload |
| `PUT` | `/admin/assets/:id` | ✅ Digunakan | ✅ Tersedia | Update |
| `DELETE` | `/admin/assets/:id` | ✅ Digunakan | ✅ Tersedia | Delete |
| `GET` | `/admin/assets/search` | ✅ Digunakan | ✅ Tersedia | Search |
| `GET` | `/admin/assets/filter` | ✅ Digunakan | ✅ Tersedia | Filter |
| `POST` | `/admin/assets/bulk-upload` | ⚠️ Tidak diminta | ✅ Tersedia | Bulk upload |

**Summary Assets:** 7 digunakan, 0 tidak ada, 1 tersedia tapi tidak digunakan

---

## 6. References

### Routes File: `src/routes/admin/reference.routes.ts`

| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/references` | ✅ Digunakan | ✅ Tersedia | Get all |
| `GET` | `/admin/references/:id` | ✅ Digunakan | ✅ Tersedia | Get by ID |
| `POST` | `/admin/references` | ✅ Digunakan | ✅ Tersedia | Create |
| `PUT` | `/admin/references/:id` | ✅ Digunakan | ✅ Tersedia | Update |
| `DELETE` | `/admin/references/:id` | ✅ Digunakan | ✅ Tersedia | Delete |
| `GET` | `/admin/references/search` | ✅ Digunakan | ✅ Tersedia | Search |
| `GET` | `/admin/references/filter` | ✅ Digunakan | ✅ Tersedia | Filter |

**Summary References:** 7 digunakan, 0 tidak ada, 0 tersedia tapi tidak digunakan ✅ SEMPURNA

---

## 7. Contributors

### Routes File: `src/routes/admin/contributor.routes.ts`

| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/contributors` | ✅ Digunakan | ✅ Tersedia | Get all |
| `GET` | `/admin/contributors/:id` | ✅ Digunakan | ✅ Tersedia | Get by ID |
| `POST` | `/admin/contributors` | ✅ Digunakan | ✅ Tersedia | Create |
| `PUT` | `/admin/contributors/:id` | ✅ Digunakan | ✅ Tersedia | Update |
| `DELETE` | `/admin/contributors/:id` | ✅ Digunakan | ✅ Tersedia | Delete |
| `GET` | `/admin/contributors/search` | ⚠️ Tidak diminta | ✅ Tersedia | Search |
| `GET` | `/admin/contributors/filter` | ⚠️ Tidak diminta | ✅ Tersedia | Filter coordinators |
| `GET` | `/admin/contributors/:id/assets` | ⚠️ Tidak diminta | ✅ Tersedia | Get assets |
| `POST` | `/admin/contributors/:id/assets` | ⚠️ Tidak diminta | ✅ Tersedia | Add asset |
| `DELETE` | `/admin/contributors/:id/assets/:assetId` | ⚠️ Tidak diminta | ✅ Tersedia | Remove asset |

**Summary Contributors:** 5 digunakan, 0 tidak ada, 5 tersedia tapi tidak digunakan

---

## 8. Domain Kodifikasi

### Routes File: `src/routes/admin/domainKodifikasi.routes.ts`

| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/domain-kodifikasi` | ✅ Digunakan | ✅ Tersedia | Get all |
| `GET` | `/admin/domain-kodifikasi/:id` | ✅ Digunakan | ✅ Tersedia | Get by ID |
| `POST` | `/admin/domain-kodifikasi` | ✅ Digunakan | ✅ Tersedia | Create |
| `PUT` | `/admin/domain-kodifikasi/:id` | ✅ Digunakan | ✅ Tersedia | Update |
| `DELETE` | `/admin/domain-kodifikasi/:id` | ✅ Digunakan | ✅ Tersedia | Delete |
| `GET` | `/admin/domain-kodifikasi/:id/leksikons` | ✅ Diminta | ❌ Tidak ada | **BELUM ADA** |
| `GET` | `/admin/domain-kodifikasi/search` | ⚠️ Tidak diminta | ✅ Tersedia | Search |
| `GET` | `/admin/domain-kodifikasi/filter` | ⚠️ Tidak diminta | ✅ Tersedia | Filter |

**Summary Domain:** 5 digunakan, 1 tidak ada, 2 tersedia tapi tidak digunakan

---

## 9. Reference Junctions

### Routes File: `src/routes/admin/reference-junction.routes.ts`

| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `POST` | `/admin/reference-junctions/lexicon/assign` | ✅ Digunakan | ✅ Tersedia | Assign to lexicon |
| `DELETE` | `/admin/reference-junctions/lexicon/:lexiconId/:refId` | ✅ Digunakan | ✅ Tersedia | Remove from lexicon |
| `GET` | `/admin/reference-junctions/lexicon/:lexiconId` | ✅ Digunakan | ✅ Tersedia | Get lexicon refs |
| `POST` | `/admin/reference-junctions/subculture/assign` | ✅ Digunakan | ✅ Tersedia | Assign to subculture |
| `DELETE` | `/admin/reference-junctions/subculture/:subcultureId/:refId` | ✅ Digunakan | ✅ Tersedia | Remove from subculture |
| `GET` | `/admin/reference-junctions/subculture/:subcultureId` | ✅ Digunakan | ✅ Tersedia | Get subculture refs |
| `POST` | `/admin/reference-junctions/culture/assign` | ✅ Digunakan | ✅ Tersedia | Assign to culture |
| `DELETE` | `/admin/reference-junctions/culture/:cultureId/:refId` | ✅ Digunakan | ✅ Tersedia | Remove from culture |
| `GET` | `/admin/reference-junctions/culture/:cultureId` | ✅ Digunakan | ✅ Tersedia | Get culture refs |
| `GET` | `/admin/reference-junctions/stats/:referenceId` | ✅ Digunakan | ✅ Tersedia | Get stats |

**Summary Reference Junctions:** 10 digunakan, 0 tidak ada, 0 tersedia tapi tidak digunakan ✅ SEMPURNA

---

## 10. About References

### Routes File: `src/routes/admin/about-reference.routes.ts`

| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/about-references` | ✅ Digunakan | ✅ Tersedia | Get all |
| `GET` | `/admin/about-references/:id` | ✅ Digunakan | ✅ Tersedia | Get by ID |
| `POST` | `/admin/about-references` | ✅ Digunakan | ✅ Tersedia | Create |
| `PUT` | `/admin/about-references/:id` | ✅ Digunakan | ✅ Tersedia | Update |
| `DELETE` | `/admin/about-references/:id` | ✅ Digunakan | ✅ Tersedia | Delete |
| `PUT` | `/admin/about-references/reorder` | ✅ Digunakan | ✅ Tersedia | Reorder |

**Summary About References:** 6 digunakan, 0 tidak ada, 0 tersedia tapi tidak digunakan ✅ SEMPURNA

---

## 11. Asset Roles (Frontend Request)

| Method | Endpoint | Frontend Request | Backend Status | Keterangan |
|--------|----------|------------------|----------------|------------|
| `GET` | `/admin/asset-roles` | ✅ Diminta | ❌ Tidak ada | **BELUM ADA - Mungkin tidak perlu karena roles dari Prisma enum** |

---

## 📊 RINGKASAN TOTAL

| Kategori | ✅ Digunakan | ❌ Tidak Ada | ⚠️ Tidak Digunakan |
|----------|-------------|-------------|-------------------|
| Auth & Admin | 5 | 3 | 2 |
| Leksikon | 22 | 1 | 4 |
| Subcultures | 13 | 4 | 3 |
| Cultures | 5 | 4 | 6 |
| Assets | 7 | 0 | 1 |
| References | 7 | 0 | 0 |
| Contributors | 5 | 0 | 5 |
| Domain Kodifikasi | 5 | 1 | 2 |
| Reference Junctions | 10 | 0 | 0 |
| About References | 6 | 0 | 0 |
| Asset Roles | 0 | 1 | 0 |
| **TOTAL** | **85** | **14** | **23** |

---

## 🚨 Endpoint yang PERLU DITAMBAHKAN

### High Priority (Diminta Frontend)
1. `GET /admin/auth/verify` - Verifikasi token
2. `GET /admin/settings` - Get settings
3. `PUT /admin/settings/notifications` - Update notif settings
4. `PUT /admin/settings/app` - Update app settings
5. `GET /admin/leksikons/filter` - Filter by status + domain
6. `GET /admin/cultures/:id/assets` - Get culture assets
7. `POST /admin/cultures/:id/assets` - Add culture asset
8. `PUT /admin/cultures/:id/assets/:assetId` - Update culture asset
9. `DELETE /admin/cultures/:id/assets/:assetId` - Remove culture asset
10. `GET /admin/subcultures/:id/references` - (atau selaraskan dengan references-direct)
11. `GET /admin/subcultures/:id/search-references` - Search subculture refs
12. `GET /admin/domain-kodifikasi/:id/leksikons` - Get leksikons by domain

### Low Priority
1. `GET /admin/asset-roles` - Get all asset roles (bisa hardcode dari Prisma enum)

---

## ⚠️ Endpoint Backend yang TIDAK DIGUNAKAN Frontend

Endpoint ini ada di backend tapi tidak disebutkan di daftar frontend:

1. `PUT /admin/change-password` - Change password
2. `PUT /admin/admins/:id/status` - Update admin status
3. `GET /admin/leksikons/:id/assets/role/:assetRole` - Get by role
4. `GET /admin/leksikons/filter/references` - Filter refs
5. `GET /admin/leksikons/references/:referenceId/usages` - Ref usage
6. `GET /admin/leksikons/domain-kodifikasi/:dk_id/leksikons` - By domain
7. `GET /admin/subcultures/:id/references-direct` - Direct refs (naming issue)
8. `POST /admin/subcultures/:id/references-direct` - Add direct ref
9. `DELETE /admin/subcultures/:id/references-direct/:refId` - Remove direct ref
10. `GET /admin/cultures/search` - Search cultures
11. `GET /admin/cultures/filter` - Filter cultures
12. `GET /admin/cultures/cultures/:cultureId` - Get with assets
13. `GET/POST/DELETE /admin/cultures/:id/references` - Culture refs
14. `POST /admin/assets/bulk-upload` - Bulk upload
15. `GET/POST/DELETE /admin/contributors/:id/assets` - Contributor assets
16. `GET /admin/contributors/search` - Search
17. `GET /admin/contributors/filter` - Filter
18. `GET /admin/domain-kodifikasi/search` - Search
19. `GET /admin/domain-kodifikasi/filter` - Filter

---

*Last Updated: December 17, 2025*

---

# 📊 PUBLIC API ENDPOINTS ANALYSIS

**Base URL:** `https://be-corpora.vercel.app/api/v1`

## 🎯 Legend (Public)

| Status | Arti |
|--------|------|
| ✅ | **DIGUNAKAN** - Endpoint tersedia dan digunakan oleh frontend public |
| ⚠️ | **TERSEDIA TAPI TIDAK DIGUNAKAN** - Endpoint ada tapi tidak digunakan frontend |
| ❓ | **STATUS TIDAK DIKETAHUI** - Tidak jelas apakah digunakan |

---

## 1. Landing Page

### Routes File: `src/routes/public/landingPage.routes.ts`
### Base Path: `/api/v1/public/landing`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/public/landing` | ✅ Digunakan | Get landing page data (featured content, statistics, highlights) |
| `POST` | `/public/landing/contact` | ⚠️ Tidak digunakan | Submit contact form - tidak ada form kontak di frontend |

**Summary:** 1 digunakan, 1 tidak digunakan

---

## 2. Subcultures (Public)

### Routes File: `src/routes/public/subculture.routes.ts`
### Base Path: `/api/v1/public/subcultures`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/public/subcultures` | ✅ Digunakan | Get subcultures gallery dengan search & pagination |
| `GET` | `/public/subcultures/:identifier` | ✅ Digunakan | Get detail subculture by slug/ID |
| `GET` | `/public/subcultures/:identifier/lexicon` | ⚠️ Tidak digunakan | Get lexicons dalam subculture |

**Summary:** 2 digunakan, 1 tidak digunakan

---

## 3. Lexicons (Public)

### Routes File: `src/routes/public/lexicon.routes.ts`
### Base Path: `/api/v1/public/lexicons`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/public/lexicons` | ⚠️ Tidak digunakan | Get all lexicons - tidak dipanggil langsung |
| `GET` | `/public/lexicons/:identifier` | ✅ Digunakan | Get detail lexicon by term/ID |

**Summary:** 1 digunakan, 1 tidak digunakan

---

## 4. Search (Public)

### Routes File: `src/routes/public/search.routes.ts`
### Base Path: `/api/v1/search`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/search/global` | ✅ Digunakan | Global search formatted (peta-budaya page) |
| `GET` | `/search` | ⚠️ Tidak digunakan | Global search across all types |
| `GET` | `/search/lexicon` | ⚠️ Tidak digunakan | Search specific in lexicon |
| `GET` | `/search/advanced` | ✅ Digunakan | Advanced search with filters |
| `GET` | `/search/references` | ✅ Digunakan | Search published references |
| `GET` | `/search/coordinator` | ✅ Digunakan | Search published contributors |
| `GET` | `/search/culture` | ⚠️ Tidak digunakan | Search published cultures |

**Summary:** 4 digunakan, 3 tidak digunakan

---

## 5. Cultures (Public)

### Routes File: `src/routes/public/culture.routes.ts`
### Base Path: `/api/v1/public/cultures`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/public/cultures` | ⚠️ Tidak digunakan | Get all published cultures |
| `GET` | `/public/cultures/:culture_id` | ⚠️ Tidak digunakan | Get culture detail |
| `GET` | `/public/cultures/:culture_id/search` | ⚠️ Tidak digunakan | Search lexicons in culture |

**Summary:** 0 digunakan, 3 tidak digunakan

---

## 6. Contributors (Public)

### Routes File: `src/routes/public/contributor.routes.ts`
### Base Path: `/api/v1/public/contributors`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/public/contributors` | ✅ Digunakan | Get all published contributors dengan pagination |
| `GET` | `/public/contributors/:contributor_id` | ⚠️ Tidak digunakan | Get contributor detail |

**Summary:** 1 digunakan, 1 tidak digunakan

---

## 7. References (Public)

### Routes File: `src/routes/public/reference.routes.ts`
### Base Path: `/api/v1/public/references`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/public/references` | ✅ Digunakan | Get all published references |
| `GET` | `/public/references/:reference_id` | ⚠️ Tidak digunakan | Get reference detail |

**Summary:** 1 digunakan, 1 tidak digunakan

---

## 8. Domains (Public)

### Routes File: `src/routes/public/domain.routes.ts`
### Base Path: `/api/v1/domains`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/domains/:domain_id` | ⚠️ Tidak digunakan | Get domain detail |
| `GET` | `/domains/:domain_id/search` | ⚠️ Tidak digunakan | Search lexicons in domain |

**Summary:** 0 digunakan, 2 tidak digunakan

---

## 9. Regions (Public)

### Routes File: `src/routes/public/region.routes.ts`
### Base Path: `/api/v1/public/regions`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/public/regions/:regionId` | ✅ Digunakan | Get region data untuk popup peta |

**Summary:** 1 digunakan, 0 tidak digunakan ✅ SEMPURNA

---

## 10. About (Public)

### Routes File: `src/routes/public/about.routes.ts`
### Base Path: `/api/v1/public/about`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/public/about` | ✅ Digunakan | Get about page data (visi-misi, team, references, dll) |

**Summary:** 1 digunakan, 0 tidak digunakan ✅ SEMPURNA

---

## 11. Assets (Public)

### Routes File: `src/routes/public/asset.routes.ts`
### Base Path: `/api/v1/public/assets`

| Method | Endpoint | Status | Keterangan |
|--------|----------|--------|------------|
| `GET` | `/public/assets/:id/file` | ❓ Tidak diketahui | Get public asset file (status=PUBLISHED only) |

**Summary:** Status tidak jelas

---

## 📊 RINGKASAN PUBLIC API

| Kategori | ✅ Digunakan | ⚠️ Tidak Digunakan | Total |
|----------|-------------|-------------------|-------|
| Landing Page | 1 | 1 | 2 |
| Subcultures | 2 | 1 | 3 |
| Lexicons | 1 | 1 | 2 |
| Search | 4 | 3 | 7 |
| Cultures | 0 | 3 | 3 |
| Contributors | 1 | 1 | 2 |
| References | 1 | 1 | 2 |
| Domains | 0 | 2 | 2 |
| Regions | 1 | 0 | 1 |
| About | 1 | 0 | 1 |
| Assets | ? | ? | 1 |
| **TOTAL** | **12** | **13** | **26** |

---

## 🔍 Detail Endpoint Public yang DIGUNAKAN

| # | Endpoint | Fungsi | Digunakan Di |
|---|----------|--------|--------------|
| 1 | `GET /public/landing` | Landing page data | Homepage |
| 2 | `GET /public/subcultures` | Subcultures gallery | Peta budaya page |
| 3 | `GET /public/subcultures/:identifier` | Subculture detail | Detail page |
| 4 | `GET /public/lexicons/:identifier` | Lexicon detail | Detail leksikon |
| 5 | `GET /search/global` | Global search | Search component |
| 6 | `GET /search/advanced` | Advanced search | Advanced search page |
| 7 | `GET /search/references` | Search references | Reference search |
| 8 | `GET /search/coordinator` | Search contributors | Contributor search |
| 9 | `GET /public/contributors` | Contributors list | Contributors page |
| 10 | `GET /public/references` | References list | References page |
| 11 | `GET /public/regions/:regionId` | Region data | Map popup |
| 12 | `GET /public/about` | About page | About page |

---

## ⚠️ Endpoint Public TERSEDIA tapi TIDAK DIGUNAKAN

| # | Endpoint | Keterangan |
|---|----------|------------|
| 1 | `POST /public/landing/contact` | Tidak ada form kontak |
| 2 | `GET /public/subcultures/:id/lexicon` | Tidak digunakan |
| 3 | `GET /public/lexicons` | Tidak dipanggil langsung |
| 4 | `GET /search` | Tidak digunakan |
| 5 | `GET /search/lexicon` | Tidak digunakan |
| 6 | `GET /search/culture` | Tidak digunakan |
| 7 | `GET /public/cultures` | Tidak digunakan |
| 8 | `GET /public/cultures/:id` | Tidak digunakan |
| 9 | `GET /public/cultures/:id/search` | Tidak digunakan |
| 10 | `GET /public/contributors/:id` | Tidak digunakan |
| 11 | `GET /public/references/:id` | Tidak digunakan |
| 12 | `GET /domains/:domain_id` | Tidak digunakan |
| 13 | `GET /domains/:domain_id/search` | Tidak digunakan |

---

## 📈 TOTAL RINGKASAN (ADMIN + PUBLIC)

| Kategori | Admin | Public | Total |
|----------|-------|--------|-------|
| ✅ Digunakan | 85 | 12 | **97** |
| ❌ Tidak Ada | 14 | 0 | **14** |
| ⚠️ Tidak Digunakan | 23 | 13 | **36** |
| **Total Endpoint** | **122** | **26** | **~148** |

---

*Last Updated: December 17, 2025*
