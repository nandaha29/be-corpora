# Panduan Black Box Testing API

## Status Testing
✅ **Testing telah dilakukan pada tanggal 22 Desember 2025**

**Hasil Testing:**
- ✅ **Login Endpoint**: Semua skenario berhasil (validasi email, password, akun nonaktif, login sukses)
- ✅ **Advanced Search**: Semua skenario berhasil (search dengan berbagai filter)
- ❌ **Bulk Import Leksikon**: Masih ada masalah teknis yang sedang di-troubleshoot

**Catatan untuk Bulk Import:**
- Endpoint dapat diakses dan authentication berhasil
- File CSV dapat di-upload
- Namun terjadi error pada proses insert ke database dengan pesan "duplicate slugs or other unique constraints"
- Sedang dalam proses debugging untuk mengidentifikasi root cause

## Deskripsi
Dokumen ini berisi panduan testing black box untuk API endpoints aplikasi leksikon menggunakan Bruno atau Postman. Testing dilakukan untuk memverifikasi fungsionalitas API dari perspektif user tanpa melihat kode internal.

## Setup Testing

### Tools yang Dibutuhkan
- **Bruno** atau **Postman** (kami rekomendasikan Bruno untuk open source)
- **Server aplikasi** berjalan di localhost
- **Data test** yang sudah di-seed di database

### Base URL
```
http://localhost:8000/api/v1
```

### Headers Default
```
Content-Type: application/json
```

## 1. Testing Login Endpoint

### Endpoint: `POST /admin/auth/login`

### Skenario 1: Email Kosong → 400 Bad Request

**Request:**
```json
{
  "email": "",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Email is required",
      "origin": "string",
      "code": "custom",
      "path": [
        "email"
      ]
    }
  ]
}
```

**Status Code:** 400

---

### Skenario 2: Email Format Salah → 400 Bad Request

**Request:**
```json
{
  "email": "invalid-email-format",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address",
      "origin": "string",
      "code": "invalid_format",
      "format": "email",
      "pattern": "/^(?!\\.)(?!.*\\.\\.)([A-Za-z0-9_'+\\-\\.]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}$/",
      "path": [
        "email"
      ]
    }
  ]
}
```

**Status Code:** 400

---

### Skenario 3: Email Benar, Password Salah → 401 Unauthorized

**Request:**
```json
{
  "email": "admin@ub.ac.id",
  "password": "wrongpassword"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

**Status Code:** 401

---

### Skenario 4: Akun Nonaktif → 403 Forbidden

**Request:**
```json
{
  "email": "inactive@ub.ac.id",
  "password": "password123"
}
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Account is deactivated",
  "code": "ACCOUNT_INACTIVE"
}
```

**Status Code:** 403

---

### Skenario 5: Login Sukses → 200 OK

**Request:**
```json
{
  "email": "admin@ub.ac.id",
  "password": "Password123"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "admin": {
      "adminId": 1,
      "username": "admin",
      "email": "admin@ub.ac.id",
      "role": "EDITOR",
      "isActive": true
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "24h"
  }
}
```

**Status Code:** 200

**Catatan:** Simpan token dari response ini untuk digunakan di endpoint berikutnya.

## 2. Testing Bulk Import Leksikon

### Endpoint: `POST /admin/leksikons/import`

### Setup
1. Pastikan server berjalan di `http://localhost:8000`
2. Login sebagai admin untuk mendapatkan Bearer token
3. Gunakan file CSV test yang telah disiapkan:
   - `test_import_valid.csv` - untuk test sukses
   - `test_import_with_errors.csv` - untuk test partial success dengan error
   - `test_import_empty.csv` - untuk test file kosong

### Headers
```
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data
```

### File CSV Contoh (test_import_valid.csv)
```csv
slug,lexiconWord,ipaInternationalPhoneticAlphabet,transliteration,etymologicalMeaning,culturalMeaning,commonMeaning,translation,variant,variantTranslations,otherDescription,domainId,contributorId
,jayadipa,ˈdʒa.jaˈdi.pa,jayadipa,Etymological meaning of Jayadipa,Cultural meaning of Jayadipa,Common meaning of Jayadipa,Translation of Jayadipa,variant1,variant translation1,Additional description,1,1
,ngidul,ˈŋi.dul,ngidul,Etymological meaning of Ngidul,Cultural meaning of Ngidul,Common meaning of Ngidul,Translation of Ngidul,,,"Description for Ngidul",2,3
,wedhus,ˈwɛ.dus,wedhus,Etymological meaning of Wedhus,Cultural meaning of Wedhus,Common meaning of Wedhus,Translation of Wedhus,wedhus gembel,variant translation,"Traditional Javanese game",5,7
,slametan,ˈsla.mə.tan,slametan,Etymological meaning of Slametan,Cultural meaning of Slametan,Common meaning of Slametan,Translation of Slametan,selametan,ceremony variant,"Javanese traditional ceremony",8,9
,kampung,ˈkam.puŋ,kampung,Etymological meaning of Kampung,Cultural meaning of Kampung,Common meaning of Kampung,Translation of Kampung,,,Rural village settlement,7,4
```

**Catatan:** 
- Kolom `slug` boleh kosong (akan di-generate otomatis)
- Kolom dengan `*` wajib diisi
- `domainId` dan `contributorId` harus berupa angka dan valid (lihat data di database)

### Skenario 1: Import Sukses → 200 OK

**Request:**
- Method: POST
- URL: `http://localhost:8000/api/v1/admin/leksikons/import`
- Body: form-data
  - Key: `file`, Type: File, Value: `test_import_valid.csv`

**Expected Response:**
```json
{
  "success": true,
  "message": "Bulk import completed",
  "data": {
    "imported": 5,
    "skipped": 0,
    "errors": [],
    "importedLexicons": [
      {
        "lexiconId": 1,
        "lexiconWord": "jayadipa"
      },
      {
        "lexiconId": 2,
        "lexiconWord": "ngidul"
      },
      {
        "lexiconId": 3,
        "lexiconWord": "wedhus"
      },
      {
        "lexiconId": 4,
        "lexiconWord": "slametan"
      },
      {
        "lexiconId": 5,
        "lexiconWord": "kampung"
      }
    ],
    "skippedLexicons": []
  }
}
```

**Status Code:** 200

---

### Skenario 2: Import dengan Error → 207 Multi-Status

**Request:** 
- Method: POST
- URL: `http://localhost:8000/api/v1/admin/leksikons/import`
- Body: form-data
  - Key: `file`, Type: File, Value: `test_import_with_errors.csv`

**Expected Response:**
```json
{
  "success": true,
  "message": "Bulk import completed",
  "data": {
    "imported": 2,
    "skipped": 4,
    "errors": [
      "Row 3: lexiconWord: Lexicon word is required",
      "Row 4: domainId: Domain with ID 999 not found",
      "Row 5: contributorId: Contributor with ID 999 not found",
      "Row 6-7: Duplicate slug 'duplicate-slug' found"
    ],
    "importedLexicons": [
      {
        "lexiconId": 6,
        "lexiconWord": "valid-word-1"
      },
      {
        "lexiconId": 7,
        "lexiconWord": "valid-word-2"
      }
    ],
    "skippedLexicons": [
      {
        "lexiconWord": "",
        "error": "Lexicon word is required"
      },
      {
        "lexiconWord": "invalid-domain",
        "error": "Domain with ID 999 not found"
      },
      {
        "lexiconWord": "invalid-contributor",
        "error": "Contributor with ID 999 not found"
      },
      {
        "lexiconWord": "duplicate-slug",
        "error": "Duplicate slug"
      }
    ]
  }
}
```

**Status Code:** 207

---

### Skenario 3: File Kosong → 400 Bad Request

**Request:** 
- Method: POST
- URL: `http://localhost:8000/api/v1/admin/leksikons/import`
- Body: form-data
  - Key: `file`, Type: File, Value: `test_import_empty.csv`

**Expected Response:**
```json
{
  "success": false,
  "message": "No data found in CSV file"
}
```

**Status Code:** 400

## 3. Testing Advanced Search

### Endpoint: `GET /search/advanced`

### Skenario 1: Search dengan Query Saja

**Request:**
```
GET /api/v1/search/advanced?kata=test
```

**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "lexiconId": 1,
      "lexiconWord": "Test Word",
      "commonMeaning": "Test meaning",
      "domain": {
        "domainName": "Test Domain"
      },
      "contributor": {
        "name": "Test Contributor"
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

**Status Code:** 200

---

### Skenario 2: Search dengan Query + Domain

**Request:**
```
GET /api/v1/search/advanced?kata=test&dk_id=1
```

**Expected Response:** Hasil yang difilter berdasarkan domain ID 1

---

### Skenario 3: Search dengan Query + Status

**Request:**
```
GET /api/v1/search/advanced?kata=test&status=PUBLISHED
```

**Expected Response:** Hasil yang difilter berdasarkan status PUBLISHED

---

### Skenario 4: Search dengan Multiple Filters

**Request:**
```
GET /api/v1/search/advanced?kata=test&dk_id=1&culture_id=2&status=PUBLISHED&page=1&limit=10
```

**Expected Response:** Hasil dengan semua filter diterapkan

---

### Skenario 5: Search tanpa Hasil

**Request:**
```
GET /api/v1/search/advanced?kata=nonexistentword
```

**Expected Response:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

**Status Code:** 200

## Guidelines untuk Screenshot

### Format Screenshot
1. **Full Screen Capture** - Tangkap seluruh window Bruno/Postman
2. **Include Request Section** - Method, URL, Headers, Body
3. **Include Response Section** - Status Code, Response Body, Response Headers
4. **Include Response Time** - Untuk performance reference

### Naming Convention
```
BB_Login_01_Email_Kosong.png
BB_Login_02_Email_Format_Salah.png
BB_Login_03_Password_Salah.png
BB_Login_04_Akun_Nonaktif.png
BB_Login_05_Login_Sukses.png
BB_Import_01_Sukses.png
BB_Import_02_Error.png
BB_Import_03_File_Kosong.png
BB_Search_01_Query_Saja.png
BB_Search_02_Query_Domain.png
BB_Search_03_Query_Status.png
BB_Search_04_Multiple_Filters.png
BB_Search_05_No_Results.png
```

### Tools untuk Screenshot
- **Windows**: Snipping Tool atau Win + Shift + S
- **Bruno**: Built-in screenshot feature
- **Postman**: Export collection dengan screenshots

## Data Test yang Dibutuhkan

### Domain IDs yang Valid
```json
[
  {"id": 1, "name": "Tengger Traditions", "code": "TT"},
  {"id": 2, "name": "Priest of Tengger and Their Attribute", "code": "DA"},
  {"id": 3, "name": "Legend and Philosophy", "code": "LF"},
  {"id": 4, "name": "Tengger Calendar Numerological System", "code": "KT"},
  {"id": 5, "name": "Wedding", "code": "P"},
  {"id": 6, "name": "The Cycle of Birth and Death", "code": "KK"},
  {"id": 7, "name": "Tenggerees and Their Environment", "code": "TL"},
  {"id": 8, "name": "Tengger Traditions and Ritual Offering", "code": "TT/S"},
  {"id": 9, "name": "Religion and Believe", "code": "AK"},
  {"id": 10, "name": "Ritual Performance", "code": "TT/P"},
  {"id": 11, "name": "History of Panaraga", "code": "SP"},
  {"id": 12, "name": "Cultural Performance", "code": "KP"},
  {"id": 13, "name": "Elements of Performance", "code": "KAR"}
]
```

### Contributor IDs yang Valid
```json
[
  {"id": 1, "name": "Admin"},
  {"id": 2, "name": "Nanda Hafiza Yusron"},
  {"id": 3, "name": "Yusuf Andika Febriandaru"},
  {"id": 4, "name": "Wahyu Widodo"},
  {"id": 5, "name": "Dany Ardhian"},
  {"id": 6, "name": "Bayu Priyambadha"},
  {"id": 7, "name": "Sony Sukmawan"},
  {"id": 8, "name": "Eti Setiawati"},
  {"id": 9, "name": "Alip Sugianto"},
  {"id": 10, "name": "Muh. Fatoni Rochman"},
  {"id": 11, "name": "Moch. Ighfir Sukardi"},
  {"id": 12, "name": "Titis Bayu Widagdo"},
  {"id": 13, "name": "Salamah"},
  {"id": 14, "name": "Sulistyowatik"},
  {"id": 15, "name": "Bernard Arps"},
  {"id": 16, "name": "Gina van Ling"},
  {"id": 17, "name": "Miguel Escobar Varela"}
]
```

### Admin Accounts
```sql
-- Active admin
INSERT INTO admin (email, password, role, is_active) VALUES ('admin@ub.ac.id', '$2b$10$...', 'EDITOR', true);

-- Inactive admin
INSERT INTO admin (email, password, role, is_active) VALUES ('inactive@ub.ac.id', '$2b$10$...', 'EDITOR', false);
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Pastikan token valid dan belum expired
   - Check Authorization header format: `Bearer <token>`

2. **400 Bad Request**
   - Validate request body format
   - Check required fields

3. **500 Internal Server Error**
   - Check server logs
   - Verify database connection

4. **Import Fails**
   - Check CSV format matches expected schema (13 columns)
   - Verify domain_id and contributor_id exist in database
   - Ensure required fields are not empty: lexiconWord, transliteration, etymologicalMeaning, culturalMeaning, commonMeaning, translation
   - domainId and contributorId must be valid integers

5. **Bulk Import Skipped Due to Duplicate Constraints**
   - **Issue**: Response menunjukkan "2 row(s) skipped due to duplicate slugs or other unique constraints" meskipun slug unik
   - **Possible Causes**: 
     - Database sequence issue dengan lexicon_id autoincrement
     - Prisma createMany dengan skipDuplicates behavior tidak sesuai ekspektasi
     - Foreign key constraint violations
   - **Current Status**: Sedang di-troubleshoot, manual insert berhasil tapi createMany gagal
   - **Workaround**: Gunakan single insert atau periksa database sequence

### CSV Format Requirements
- **Encoding:** UTF-8
- **Delimiter:** Comma (,)
- **Header Row:** Required (first row)
- **Columns:** Exactly 13 columns in this order:
  1. slug (optional)
  2. lexiconWord (required)
  3. ipaInternationalPhoneticAlphabet (optional)
  4. transliteration (required)
  5. etymologicalMeaning (required)
  6. culturalMeaning (required)
  7. commonMeaning (required)
  8. translation (required)
  9. variant (optional)
  10. variantTranslations (optional)
  11. otherDescription (optional)
  12. domainId (required, integer)
  13. contributorId (required, integer)

### Debug Tips
- Gunakan Bruno's environment variables untuk menyimpan token
- Enable request logging di server
- Test dengan curl untuk verifikasi manual
- Gunakan file test CSV yang telah disiapkan untuk konsistensi testing

---

## Summary Testing Status (22 Desember 2025)

### ✅ Completed Successfully
- **Login Endpoint Testing**: All 5 scenarios passed
  - Email validation (empty, invalid format)
  - Password validation
  - Account status validation (inactive accounts)
  - Successful login with token generation

- **Advanced Search Testing**: All scenarios passed
  - Basic search queries
  - Filtered search (by domain, status)
  - Multiple filters combination
  - Empty results handling

### ❌ Currently Being Troubleshot
- **Bulk Import Leksikon**: 
  - Authentication and file upload working
  - CSV parsing and validation working
  - Database insertion failing with "duplicate constraints" error
  - Issue appears to be with Prisma createMany operation or database sequence

### 🔄 Next Steps for Bulk Import
1. Investigate database sequence for lexicon_id autoincrement
2. Test manual Prisma insert operations
3. Consider using individual create operations instead of createMany
4. Verify foreign key relationships and constraints
5. Check for any hidden unique constraints in database schema

---

**Tanggal Pembuatan:** 22 Desember 2025  
**Tanggal Update Status:** 22 Desember 2025  
**Base URL:** http://localhost:8000/api/v1  
**Testing Tool:** Bruno / Postman  
**Total Test Cases:** 14 scenarios  
**Test Files:** test_import_valid.csv, test_import_with_errors.csv, test_import_empty.csv</content>
<parameter name="filePath">d:\my-code\1_home\leksikon-proj\leksikon-be-2\BLACKBOX_TESTING_GUIDE.md