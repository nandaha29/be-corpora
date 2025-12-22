# 📚 SKRIPSI DIAGRAMS

Folder ini berisi semua diagram PlantUML untuk skripsi **"Pengembangan API Backend Sistem Leksikon Bahasa Betawi"**.

## 📂 Struktur Folder

```
SKRIPSI_DIAGRAMS/
├── architecture/
│   ├── ARCHITECTURE_SYSTEM.md          # Dokumentasi + Mermaid diagrams
│   ├── Architecture_System.puml        # Arsitektur sistem (PlantUML)
│   └── Architecture_Deployment.puml    # Deployment diagram (PlantUML)
├── api-design/
│   ├── API_Authentication_Flow.puml    # 5.3.3 Authentication Flow
│   ├── API_Endpoint_Structure.puml     # 5.3.2 Endpoint Structure
│   ├── API_Request_Response_Format.puml # 5.3.4 Request/Response Format
│   └── API_Error_Handling.puml         # 5.3.5 Error Handling Design
├── class-module/
│   ├── CM_Layer_Architecture.puml      # 5.4 Layer Architecture Overview
│   ├── CM_Controller_Detail.puml       # 5.4.1 Controller Layer Detail
│   ├── CM_Service_Detail.puml          # 5.4.2 Service Layer Detail
│   └── CM_Middleware_Validator.puml    # 5.4.3 & 5.4.4 Middleware & Validator
├── use-case/
│   ├── UC01_Admin_System.puml          # Use Case Admin
│   └── UC02_Public_System.puml         # Use Case Public User
├── sequence/
│   ├── SD01_Login_Admin.puml
│   ├── SD02_CRUD_Leksikon.puml
│   ├── SD03_Upload_Asset.puml
│   ├── SD04_CRUD_Referensi.puml
│   ├── SD05_CRUD_Kontributor.puml
│   ├── SD06_CRUD_Budaya.puml
│   ├── SD07_CRUD_Subbudaya.puml
│   ├── SD08_Public_Search_Leksikon.puml
│   ├── SD09_Public_View_Budaya_Subbudaya.puml
│   └── SD10_Public_View_Kontributor_Referensi.puml
├── activity/
│   ├── AD01_Bulk_Import.puml               # Bulk import process flow
│   ├── AD02_Ref_Assignment.puml            # Reference assignment flow
│   ├── AD03_Proses_Manajemen_Leksikon.puml # Admin leksikon management
│   └── AD04_Proses_Pencarian_Publik.puml   # Public search flow
├── erd/
│   └── ERD_Sistem_Leksikon.puml
├── class-diagram/
│   └── CD_Backend_Architecture.puml
└── README.md
```

## 🛠️ Cara Generate Gambar dari PlantUML

### Option 1: VS Code Extension
1. Install extension **"PlantUML"** by jebbs
2. Buka file `.puml`
3. Tekan `Alt + D` untuk preview
4. Export ke PNG/SVG via command palette

### Option 2: PlantUML Online Server
1. Buka https://www.plantuml.com/plantuml/uml
2. Copy-paste isi file `.puml`
3. Download gambar hasil generate

### Option 3: Command Line
```bash
# Install PlantUML
npm install -g node-plantuml

# Generate PNG
puml generate diagram.puml -o output.png
```

---

# 📋 TEMPLATE TABEL UNTUK SKRIPSI

## BAB 4 - REKAYASA KEBUTUHAN

### Tabel 4.1 Deskripsi Use Case Admin System

| UC ID | Nama Use Case | Deskripsi | Aktor |
|-------|---------------|-----------|-------|
| UC01 | Login | Admin melakukan login dengan username dan password | Admin |
| UC02 | Logout | Admin keluar dari sistem | Admin |
| UC03 | Kelola Leksikon | Admin dapat menambah, edit, hapus, dan lihat leksikon | Admin |
| UC04 | Kelola Kontributor | Admin mengelola data kontributor | Admin |
| UC05 | Kelola Budaya | Admin mengelola data budaya | Admin |
| UC06 | Kelola Subbudaya | Admin mengelola data subbudaya | Admin |
| UC07 | Kelola Referensi | Admin mengelola data referensi dan assignment | Admin |
| UC08 | Kelola Domain Kodifikasi | Admin mengelola domain kodifikasi | Admin |
| UC09 | Kelola Asset | Admin upload dan hapus asset (gambar/audio) | Admin |
| UC10 | Kelola About Reference | Admin mengelola referensi halaman About | Admin |

### Tabel 4.2 Deskripsi Use Case Public System

| UC ID | Nama Use Case | Deskripsi | Aktor |
|-------|---------------|-----------|-------|
| UC11 | Lihat Daftar Leksikon | Pengguna melihat daftar leksikon dengan pagination | Pengguna Publik |
| UC12 | Cari Leksikon | Pengguna mencari leksikon berdasarkan kata kunci | Pengguna Publik |
| UC13 | Filter Leksikon | Pengguna memfilter leksikon berdasarkan domain/subbudaya | Pengguna Publik |
| UC14 | Lihat Detail Leksikon | Pengguna melihat detail lengkap leksikon | Pengguna Publik |
| UC15 | Lihat Daftar Budaya | Pengguna melihat daftar budaya | Pengguna Publik |
| UC16 | Lihat Detail Budaya | Pengguna melihat detail budaya dengan subbudayanya | Pengguna Publik |
| UC17 | Lihat Daftar Subbudaya | Pengguna melihat daftar subbudaya dalam budaya | Pengguna Publik |
| UC18 | Lihat Detail Subbudaya | Pengguna melihat detail subbudaya dengan leksikonnya | Pengguna Publik |
| UC19 | Lihat Daftar Kontributor | Pengguna melihat daftar kontributor | Pengguna Publik |
| UC20 | Lihat Detail Kontributor | Pengguna melihat profil dan kontribusi kontributor | Pengguna Publik |
| UC21 | Lihat Daftar Referensi | Pengguna melihat daftar referensi | Pengguna Publik |
| UC22 | Lihat Detail Referensi | Pengguna melihat detail referensi | Pengguna Publik |
| UC23 | Lihat Daftar Domain | Pengguna melihat daftar domain kodifikasi | Pengguna Publik |
| UC24 | Lihat Halaman About | Pengguna melihat informasi tentang sistem | Pengguna Publik |
| UC25 | Lihat About References | Pengguna melihat referensi di halaman About | Pengguna Publik |
| UC26 | Lihat Statistik | Pengguna melihat statistik data leksikon | Pengguna Publik |

### Tabel 4.3 Kebutuhan Fungsional

| ID | Kebutuhan Fungsional | Prioritas | Use Case Terkait |
|----|---------------------|-----------|------------------|
| FR-01 | Sistem harus menyediakan fitur login untuk admin | High | UC01 |
| FR-02 | Sistem harus dapat melakukan CRUD data leksikon | High | UC03 |
| FR-03 | Sistem harus dapat melakukan CRUD data kontributor | High | UC04 |
| FR-04 | Sistem harus dapat melakukan CRUD data budaya | High | UC05 |
| FR-05 | Sistem harus dapat melakukan CRUD data subbudaya | High | UC06 |
| FR-06 | Sistem harus dapat melakukan CRUD data referensi | High | UC07 |
| FR-07 | Sistem harus dapat mengassign referensi ke entitas | Medium | UC07d |
| FR-08 | Sistem harus dapat upload dan kelola asset | Medium | UC09 |
| FR-09 | Sistem harus menyediakan fitur pencarian leksikon | High | UC12 |
| FR-10 | Sistem harus menyediakan fitur filter leksikon | Medium | UC13 |
| FR-11 | Sistem harus menampilkan detail leksikon dengan relasi | High | UC14 |
| FR-12 | Sistem harus mendukung pagination pada list data | Medium | UC11 |
| FR-13 | Sistem harus menampilkan statistik data | Low | UC26 |
| FR-14 | Sistem harus menyediakan slug untuk SEO-friendly URL | Medium | UC14, UC16, UC18 |

### Tabel 4.4 Kebutuhan Non-Fungsional

| ID | Kebutuhan Non-Fungsional | Kategori | Deskripsi |
|----|-------------------------|----------|-----------|
| NFR-01 | Performance | Kinerja | Response time API < 2 detik untuk query normal |
| NFR-02 | Security | Keamanan | Autentikasi menggunakan JWT dengan expiry |
| NFR-03 | Security | Keamanan | Password disimpan dengan hash bcrypt |
| NFR-04 | Scalability | Skalabilitas | Database menggunakan cloud PostgreSQL (Neon) |
| NFR-05 | Availability | Ketersediaan | Sistem dapat diakses 24/7 |
| NFR-06 | Maintainability | Pemeliharaan | Kode terstruktur dengan MVC pattern |
| NFR-07 | Usability | Kegunaan | API menggunakan RESTful conventions |
| NFR-08 | Storage | Penyimpanan | Asset disimpan di Vercel Blob Storage |
| NFR-09 | Validation | Validasi | Input divalidasi dengan Zod schema |

---

## BAB 5 - PERANCANGAN SISTEM

### Tabel 5.1 Daftar Entitas Database

| No | Nama Entitas | Deskripsi | Jumlah Atribut |
|----|--------------|-----------|----------------|
| 1 | ADMIN | Data admin sistem | 8 |
| 2 | CULTURE | Data budaya | 14 |
| 3 | SUBCULTURE | Data subbudaya | 11 |
| 4 | CODIFICATION_DOMAIN | Domain kodifikasi leksikon | 7 |
| 5 | LEXICON | Data leksikon utama | 18 |
| 6 | CONTRIBUTOR | Data kontributor | 10 |
| 7 | ASSET | Data file asset | 11 |
| 8 | REFERENCE | Data referensi | 11 |
| 9 | ABOUT_REFERENCE | Referensi halaman About | 6 |
| 10 | LEXICON_ASSETS | Junction leksikon-asset | 4 |
| 11 | SUBCULTURE_ASSETS | Junction subbudaya-asset | 4 |
| 12 | CULTURE_ASSETS | Junction budaya-asset | 4 |
| 13 | CONTRIBUTOR_ASSETS | Junction kontributor-asset | 4 |
| 14 | LEXICON_REFERENCE | Junction leksikon-referensi | 5 |
| 15 | SUBCULTURE_REFERENCE | Junction subbudaya-referensi | 5 |
| 16 | CULTURE_REFERENCE | Junction budaya-referensi | 5 |

### Tabel 5.2 Struktur Tabel LEXICON

| Nama Kolom | Tipe Data | Constraint | Deskripsi |
|------------|-----------|------------|-----------|
| lexicon_id | INT | PK, AUTO_INCREMENT | ID unik leksikon |
| slug | VARCHAR(255) | UNIQUE, NOT NULL | URL-friendly identifier |
| lexicon_word | VARCHAR(255) | NOT NULL | Kata leksikon |
| ipa_international_phonetic_alphabet | VARCHAR(255) | - | Fonetik IPA |
| transliteration | VARCHAR(255) | NOT NULL | Transliterasi |
| etymological_meaning | TEXT | NOT NULL | Makna etimologis |
| cultural_meaning | TEXT | NOT NULL | Makna budaya |
| common_meaning | TEXT | NOT NULL | Makna umum |
| translation | VARCHAR(255) | NOT NULL | Terjemahan |
| variant | VARCHAR(255) | - | Varian kata |
| variant_translations | VARCHAR(255) | - | Terjemahan varian |
| other_description | TEXT | - | Deskripsi tambahan |
| domain_id | INT | FK, NOT NULL | Referensi ke domain |
| preservation_status | ENUM | DEFAULT 'MAINTAINED' | Status konservasi |
| contributor_id | INT | FK, NOT NULL | Referensi ke kontributor |
| status | ENUM | DEFAULT 'DRAFT' | Status publikasi |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu diupdate |

### Tabel 5.3 Struktur Tabel REFERENCE

| Nama Kolom | Tipe Data | Constraint | Deskripsi |
|------------|-----------|------------|-----------|
| reference_id | INT | PK, AUTO_INCREMENT | ID unik referensi |
| title | VARCHAR(255) | NOT NULL | Judul referensi |
| reference_type | ENUM | NOT NULL | Tipe: JOURNAL, BOOK, ARTICLE, dll |
| description | TEXT | - | Deskripsi referensi |
| url | VARCHAR(500) | - | URL referensi online |
| authors | VARCHAR(500) | - | Nama penulis |
| publication_year | VARCHAR(10) | - | Tahun terbit |
| topic_category | VARCHAR(100) | - | Kategori topik |
| status | ENUM | DEFAULT 'DRAFT' | Status publikasi |
| created_at | TIMESTAMP | NOT NULL | Waktu dibuat |
| updated_at | TIMESTAMP | NOT NULL | Waktu diupdate |

### Tabel 5.4 Daftar API Endpoints - Admin

| No | Method | Endpoint | Deskripsi | Auth |
|----|--------|----------|-----------|------|
| 1 | POST | /api/admin/login | Login admin | No |
| 2 | POST | /api/admin/logout | Logout admin | Yes |
| 3 | GET | /api/admin/leksikon | List semua leksikon | Yes |
| 4 | GET | /api/admin/leksikon/:id | Detail leksikon | Yes |
| 5 | POST | /api/admin/leksikon | Tambah leksikon | Yes |
| 6 | PUT | /api/admin/leksikon/:id | Update leksikon | Yes |
| 7 | DELETE | /api/admin/leksikon/:id | Hapus leksikon | Yes |
| 8 | GET | /api/admin/contributors | List kontributor | Yes |
| 9 | POST | /api/admin/contributors | Tambah kontributor | Yes |
| 10 | PUT | /api/admin/contributors/:id | Update kontributor | Yes |
| 11 | DELETE | /api/admin/contributors/:id | Hapus kontributor | Yes |
| 12 | GET | /api/admin/cultures | List budaya | Yes |
| 13 | POST | /api/admin/cultures | Tambah budaya | Yes |
| 14 | PUT | /api/admin/cultures/:id | Update budaya | Yes |
| 15 | DELETE | /api/admin/cultures/:id | Hapus budaya | Yes |
| 16 | GET | /api/admin/subcultures | List subbudaya | Yes |
| 17 | POST | /api/admin/subcultures | Tambah subbudaya | Yes |
| 18 | PUT | /api/admin/subcultures/:id | Update subbudaya | Yes |
| 19 | DELETE | /api/admin/subcultures/:id | Hapus subbudaya | Yes |
| 20 | GET | /api/admin/references | List referensi | Yes |
| 21 | POST | /api/admin/references | Tambah referensi | Yes |
| 22 | PUT | /api/admin/references/:id | Update referensi | Yes |
| 23 | DELETE | /api/admin/references/:id | Hapus referensi | Yes |
| 24 | POST | /api/admin/assets | Upload asset | Yes |
| 25 | DELETE | /api/admin/assets/:id | Hapus asset | Yes |
| 26 | GET | /api/admin/domain-kodifikasi | List domain | Yes |
| 27 | POST | /api/admin/about-references | Tambah about reference | Yes |
| 28 | DELETE | /api/admin/about-references/:id | Hapus about reference | Yes |
| 29 | POST | /api/admin/reference-junctions/leksikon | Assign ref ke leksikon | Yes |
| 30 | POST | /api/admin/reference-junctions/subculture | Assign ref ke subbudaya | Yes |
| 31 | POST | /api/admin/reference-junctions/culture | Assign ref ke budaya | Yes |

### Tabel 5.5 Daftar API Endpoints - Public

| No | Method | Endpoint | Deskripsi |
|----|--------|----------|-----------|
| 1 | GET | /api/public/leksikon | List leksikon + search + filter |
| 2 | GET | /api/public/leksikon/:slug | Detail leksikon by slug |
| 3 | GET | /api/public/cultures | List budaya |
| 4 | GET | /api/public/cultures/:slug | Detail budaya by slug |
| 5 | GET | /api/public/subcultures | List subbudaya |
| 6 | GET | /api/public/subcultures/:slug | Detail subbudaya by slug |
| 7 | GET | /api/public/contributors | List kontributor |
| 8 | GET | /api/public/contributors/:id | Detail kontributor |
| 9 | GET | /api/public/references | List referensi |
| 10 | GET | /api/public/references/:id | Detail referensi |
| 11 | GET | /api/public/domain-kodifikasi | List domain kodifikasi |
| 12 | GET | /api/public/about-references | List about references |
| 13 | GET | /api/public/statistics | Statistik data |

### Tabel 5.6 Deskripsi Sequence Diagram

| SD ID | Nama | Deskripsi | File |
|-------|------|-----------|------|
| SD01 | Login Admin | Proses autentikasi admin ke sistem | SD01_Login_Admin.puml |
| SD02 | CRUD Leksikon | Operasi create, read, update, delete leksikon | SD02_CRUD_Leksikon.puml |
| SD03 | Upload Asset | Proses upload file ke Vercel Blob | SD03_Upload_Asset.puml |
| SD04 | CRUD Referensi | Operasi CRUD dan assign referensi | SD04_CRUD_Referensi.puml |
| SD05 | CRUD Kontributor | Operasi CRUD data kontributor | SD05_CRUD_Kontributor.puml |
| SD06 | CRUD Budaya | Operasi CRUD data budaya | SD06_CRUD_Budaya.puml |
| SD07 | CRUD Subbudaya | Operasi CRUD data subbudaya | SD07_CRUD_Subbudaya.puml |
| SD08 | Public Search Leksikon | Pencarian dan filter leksikon publik | SD08_Public_Search_Leksikon.puml |
| SD09 | Public View Budaya | Eksplorasi budaya dan subbudaya | SD09_Public_View_Budaya_Subbudaya.puml |
| SD10 | Public View Kontributor | View kontributor dan referensi | SD10_Public_View_Kontributor_Referensi.puml |

---

## BAB 6 - IMPLEMENTASI

### Tabel 6.1 Daftar Dependencies/Library

| No | Library | Versi | Fungsi |
|----|---------|-------|--------|
| 1 | express | 5.1.0 | Web framework |
| 2 | @prisma/client | 6.16.2 | Database ORM |
| 3 | prisma | 6.16.2 | Database toolkit |
| 4 | typescript | 5.x | Type-safe JavaScript |
| 5 | jsonwebtoken | 9.x | JWT authentication |
| 6 | bcrypt | 5.x | Password hashing |
| 7 | @vercel/blob | 0.x | Cloud file storage |
| 8 | multer | 1.x | File upload handling |
| 9 | zod | 3.x | Schema validation |
| 10 | cors | 2.x | Cross-origin resource sharing |
| 11 | dotenv | 16.x | Environment variables |
| 12 | slugify | 1.x | URL slug generation |

### Tabel 6.2 Struktur Folder Project

| Folder | Deskripsi |
|--------|-----------|
| `/src` | Source code utama |
| `/src/controllers/admin` | Controller untuk API admin |
| `/src/controllers/public` | Controller untuk API public |
| `/src/services/admin` | Service layer untuk admin |
| `/src/services/public` | Service layer untuk public |
| `/src/routes/admin` | Route definitions admin |
| `/src/routes/public` | Route definitions public |
| `/src/middleware` | Authentication & error handling |
| `/src/lib` | Utility functions & Prisma client |
| `/prisma` | Database schema & migrations |
| `/uploads` | Temporary file storage |

### Tabel 6.3 Contoh Implementasi Validasi Zod

| Field | Tipe | Validasi |
|-------|------|----------|
| lexiconWord | string | min(1), max(100) |
| transliteration | string | min(1), max(255) |
| etymologicalMeaning | string | min(10), max(1000) |
| culturalMeaning | string | min(10), max(1000) |
| commonMeaning | string | min(10), max(1000) |
| translation | string | min(1), max(255) |
| domainId | number | int(), positive() |
| contributorId | number | int(), positive() |
| status | enum | ['DRAFT', 'PUBLISHED', 'ARCHIVED'] |

---

## BAB 7 - PENGUJIAN

### Tabel 7.1 Test Case - API Authentication

| TC ID | Test Case | Expected Result | Status |
|-------|-----------|-----------------|--------|
| TC-01 | Login dengan kredensial valid | Return JWT token, status 200 | ✅ |
| TC-02 | Login dengan password salah | Return error 401 Unauthorized | ✅ |
| TC-03 | Login dengan username tidak ada | Return error 401 Unauthorized | ✅ |
| TC-04 | Akses protected route tanpa token | Return error 401 Unauthorized | ✅ |
| TC-05 | Akses protected route dengan token expired | Return error 401 Unauthorized | ✅ |
| TC-06 | Akses protected route dengan token valid | Return data, status 200 | ✅ |

### Tabel 7.2 Test Case - CRUD Leksikon

| TC ID | Test Case | Input | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-07 | Create leksikon valid | Data lengkap | Status 201, leksikon created | ✅ |
| TC-08 | Create leksikon tanpa required field | Missing lexiconWord | Status 400, validation error | ✅ |
| TC-09 | Get leksikon by ID valid | ID exists | Status 200, return leksikon | ✅ |
| TC-10 | Get leksikon by ID invalid | ID not exists | Status 404, not found | ✅ |
| TC-11 | Update leksikon valid | Valid data | Status 200, leksikon updated | ✅ |
| TC-12 | Delete leksikon | Valid ID | Status 200, leksikon deleted | ✅ |
| TC-13 | Search leksikon | q=betawi | Status 200, filtered results | ✅ |

### Tabel 7.3 Test Case - Upload Asset

| TC ID | Test Case | Input | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-14 | Upload image valid | JPG/PNG file | Status 201, asset created | ✅ |
| TC-15 | Upload file terlalu besar | >10MB file | Status 400, file too large | ✅ |
| TC-16 | Upload file type invalid | .exe file | Status 400, invalid type | ✅ |
| TC-17 | Delete asset | Valid asset ID | Status 200, asset deleted | ✅ |

### Tabel 7.4 Test Case - Reference Assignment

| TC ID | Test Case | Input | Expected Result | Status |
|-------|-----------|-------|-----------------|--------|
| TC-18 | Assign reference ke leksikon | Valid IDs | Status 201, junction created | ✅ |
| TC-19 | Assign dengan role PRIMARY | role=PRIMARY_SOURCE | Junction with role | ✅ |
| TC-20 | Remove reference dari leksikon | Valid junction | Status 200, junction deleted | ✅ |
| TC-21 | Assign ke about page | referenceId valid | About reference created | ✅ |

### Tabel 7.5 Test Case - Public API

| TC ID | Test Case | Endpoint | Expected Result | Status |
|-------|-----------|----------|-----------------|--------|
| TC-22 | Get public leksikon list | /api/public/leksikon | Status 200, paginated | ✅ |
| TC-23 | Search public leksikon | ?q=makanan | Filtered results | ✅ |
| TC-24 | Get leksikon by slug | /api/public/leksikon/:slug | Detail with relations | ✅ |
| TC-25 | Get culture list | /api/public/cultures | List cultures | ✅ |
| TC-26 | Get statistics | /api/public/statistics | Count data | ✅ |

### Tabel 7.6 Hasil Pengujian API (Summary)

| Kategori | Total Test | Passed | Failed | Success Rate |
|----------|------------|--------|--------|--------------|
| Authentication | 6 | 6 | 0 | 100% |
| CRUD Leksikon | 7 | 7 | 0 | 100% |
| Upload Asset | 4 | 4 | 0 | 100% |
| Reference Management | 4 | 4 | 0 | 100% |
| Public API | 5 | 5 | 0 | 100% |
| **TOTAL** | **26** | **26** | **0** | **100%** |

---

## 📊 STATISTIK DATA SAAT INI

| Entitas | Jumlah Record |
|---------|---------------|
| Leksikon | 131 |
| Kontributor | 17 |
| Domain Kodifikasi | 13 |
| Budaya | 1 |
| Subbudaya | 2 |
| Leksikon Assets | 41 |
| Referensi | TBD |

---

## 🎨 Generate Diagram Tips

### Recommended Colors (konsisten dengan skripsi)
- Primary: `#2196F3` (Blue)
- Secondary: `#4CAF50` (Green)
- Warning: `#FF9800` (Orange)
- Error: `#F44336` (Red)

### Export Settings
- Format: **PNG** atau **SVG**
- Resolution: **300 DPI** untuk print
- Background: **White**

---

*Generated: December 11, 2025*
*Project: Sistem Leksikon Bahasa Betawi*
