# Reference Management API Documentation

## Overview
Reference Management API menyediakan endpoint untuk mengelola referensi/bibliography dalam sistem Leksikon Budaya. API ini mencakup operasi CRUD dasar, pencarian, filter, serta pengelolaan berbagai jenis referensi akademik.

## Base URL
`/api/v1/admin/references/`

## Authentication
Semua endpoint memerlukan JWT authentication dengan header `Authorization: Bearer <token>`

---

## 1. BASIC CRUD OPERATIONS

### 1.1 Get All References (Paginated)
**Endpoint**: `GET /api/v1/admin/references`

**Deskripsi**: Mengambil semua referensi dengan pagination

**Query Parameters**:
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**:
```json
{
  "success": true,
  "message": "References retrieved successfully",
  "data": [
    {
      "id": 1,
      "title": "Javanese Cultural Heritage: Traditional Arts and Practices",
      "referenceType": "BOOK",
      "description": "Comprehensive study of Javanese cultural heritage",
      "url": "https://example.com/book",
      "authors": "Dr. Ahmad Santoso, Prof. Siti Nurhaliza",
      "publicationYear": "2020",
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

### 1.2 Create Reference
**Endpoint**: `POST /api/v1/admin/references`

**Deskripsi**: Membuat referensi baru

**Request Body**:
```json
{
  "title": "Javanese Cultural Heritage: Traditional Arts and Practices",
  "referenceType": "BOOK",
  "description": "Comprehensive study of Javanese cultural heritage",
  "url": "https://example.com/book",
  "authors": "Dr. Ahmad Santoso, Prof. Siti Nurhaliza",
  "publicationYear": "2020",
  "status": "DRAFT"
}
```

**Field Descriptions**:
- `title`: Judul referensi (required)
- `referenceType`: Tipe referensi (required)
- `description`: Deskripsi referensi (required)
- `url`: URL referensi (optional)
- `authors`: Penulis/pengarang (optional)
- `publicationYear`: Tahun publikasi (optional)
- `status`: Status publikasi (DRAFT, PUBLISHED, ARCHIVED)

**Reference Types**:
- `JOURNAL`: Artikel jurnal
- `BOOK`: Buku
- `ARTICLE`: Artikel
- `WEBSITE`: Situs web
- `REPORT`: Laporan
- `THESIS`: Tesis
- `DISSERTATION`: Disertasi
- `FIELD_NOTE`: Catatan lapangan

**Response**:
```json
{
  "success": true,
  "message": "Reference created successfully",
  "data": {
    "id": 1,
    "title": "Javanese Cultural Heritage: Traditional Arts and Practices",
    "referenceType": "BOOK",
    "description": "Comprehensive study of Javanese cultural heritage",
    "url": "https://example.com/book",
    "authors": "Dr. Ahmad Santoso, Prof. Siti Nurhaliza",
    "publicationYear": "2020",
    "status": "DRAFT",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

**Contoh Request**:
```bash
curl -X POST http://localhost:3000/api/v1/admin/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Javanese Cultural Heritage: Traditional Arts and Practices",
    "referenceType": "BOOK",
    "description": "Comprehensive study of Javanese cultural heritage",
    "url": "https://example.com/book",
    "authors": "Dr. Ahmad Santoso, Prof. Siti Nurhaliza",
    "publicationYear": "2020",
    "status": "DRAFT"
  }'
```

### 1.3 Get Reference by ID
**Endpoint**: `GET /api/v1/admin/references/:id`

**Deskripsi**: Mengambil detail referensi berdasarkan ID

**Path Parameters**:
- `id` (number, required): Reference ID

**Response**:
```json
{
  "success": true,
  "message": "Reference retrieved successfully",
  "data": {
    "id": 1,
    "title": "Javanese Cultural Heritage: Traditional Arts and Practices",
    "referenceType": "BOOK",
    "description": "Comprehensive study of Javanese cultural heritage",
    "url": "https://example.com/book",
    "authors": "Dr. Ahmad Santoso, Prof. Siti Nurhaliza",
    "publicationYear": "2020",
    "status": "PUBLISHED",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "usage": {
      "lexiconCount": 5,
      "cultureCount": 2,
      "subcultureCount": 3,
      "totalUsage": 10
    }
  }
}
```

### 1.4 Update Reference
**Endpoint**: `PUT /api/v1/admin/references/:id`

**Deskripsi**: Update data referensi

**Path Parameters**:
- `id` (number, required): Reference ID

**Request Body**: Sama dengan create (semua field optional)

**Response**: Sama dengan create

### 1.5 Delete Reference
**Endpoint**: `DELETE /api/v1/admin/references/:id`

**Deskripsi**: Hapus referensi

**Path Parameters**:
- `id` (number, required): Reference ID

**Response**:
```json
{
  "success": true,
  "message": "Reference deleted successfully",
  "data": null
}
```

---

## 2. SEARCH & FILTER OPERATIONS

### 2.1 Search References
**Endpoint**: `GET /api/v1/admin/references/search`

**Deskripsi**: Mencari referensi berdasarkan title, author, atau description

**Query Parameters**:
- `q` (string, required): Kata kunci pencarian
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of references yang match dengan search query

**Contoh Request**:
```bash
# Search by title
curl "http://localhost:3000/api/v1/admin/references/search?q=javanese&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search by author
curl "http://localhost:3000/api/v1/admin/references/search?q=santoso&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 2.2 Filter References
**Endpoint**: `GET /api/v1/admin/references/filter`

**Deskripsi**: Filter referensi berdasarkan type, year, status, createdAt (kombinasi)

**Query Parameters**:
- `referenceType` (string, optional): Tipe referensi (JOURNAL, BOOK, ARTICLE, WEBSITE, REPORT, THESIS, DISSERTATION, FIELD_NOTE)
- `publicationYear` (string, optional): Tahun publikasi
- `status` (string, optional): Status referensi (DRAFT, PUBLISHED, ARCHIVED)
- `createdAtFrom` (string, optional): Tanggal dibuat dari (ISO string)
- `createdAtTo` (string, optional): Tanggal dibuat sampai (ISO string)
- `page` (number, optional): Halaman (default: 1)
- `limit` (number, optional): Jumlah per halaman (default: 20)

**Response**: Array of references yang match dengan filter criteria

**Contoh Request**:
```bash
# Filter by type and status
curl "http://localhost:3000/api/v1/admin/references/filter?referenceType=BOOK&status=PUBLISHED&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by publication year range
curl "http://localhost:3000/api/v1/admin/references/filter?publicationYear=2020&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Filter by creation date range
curl "http://localhost:3000/api/v1/admin/references/filter?createdAtFrom=2024-01-01&createdAtTo=2024-12-31&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Complex filter combination
curl "http://localhost:3000/api/v1/admin/references/filter?referenceType=JOURNAL&publicationYear=2023&status=PUBLISHED&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 3. DATA MODEL

### Reference Schema
```typescript
{
  id: number;
  title: string; // Required
  referenceType: 'JOURNAL' | 'BOOK' | 'ARTICLE' | 'WEBSITE' | 'REPORT' | 'THESIS' | 'DISSERTATION' | 'FIELD_NOTE';
  description: string; // Required
  url: string; // Optional
  authors: string; // Optional
  publicationYear: string; // Optional
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 4. BUSINESS RULES

### 4.1 Reference Creation
- `title`, `referenceType`, dan `description` wajib diisi
- `referenceType` harus salah satu dari enum yang ditentukan
- `url` bersifat optional tapi recommended untuk online resources
- `authors` dapat berisi multiple authors (comma-separated)
- `publicationYear` dalam format YYYY
- Status default adalah `DRAFT`

### 4.2 Reference Types
- **JOURNAL**: Artikel dalam jurnal akademik (memiliki volume, issue, DOI)
- **BOOK**: Buku lengkap (memiliki ISBN, publisher)
- **ARTICLE**: Artikel dalam majalah/non-jurnal
- **WEBSITE**: Konten web (memiliki URL, access date)
- **REPORT**: Laporan penelitian atau government reports
- **THESIS**: Tesis akademik (memiliki university, degree)
- **DISSERTATION**: Disertasi (memiliki university, degree)
- **FIELD_NOTE**: Catatan lapangan peneliti

### 4.3 Citation Standards
- **Authors**: Format "Last Name, First Name" atau "Dr. First Last"
- **Publication Year**: 4-digit year (YYYY)
- **URL**: Full URL termasuk protocol (http/https)
- **DOI**: Untuk journal articles (disarankan dalam description)

### 4.4 Status Management
- `DRAFT`: Reference dalam review atau incomplete
- `PUBLISHED`: Reference approved dan dapat digunakan
- `ARCHIVED`: Reference tidak aktif (tidak dihapus untuk maintain citations)

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
        "field": "title",
        "message": "Title is required"
      },
      {
        "field": "referenceType",
        "message": "Reference type is required and must be one of: JOURNAL, BOOK, ARTICLE, WEBSITE, REPORT, THESIS, DISSERTATION, FIELD_NOTE"
      },
      {
        "field": "description",
        "message": "Description is required"
      }
    ]
  }
}
```

### 5.2 Invalid Reference Type Error
```json
{
  "success": false,
  "message": "Invalid reference type",
  "data": null
}
```

### 5.3 Not Found Error
```json
{
  "success": false,
  "message": "Reference not found",
  "data": null
}
```

### 5.4 URL Format Error
```json
{
  "success": false,
  "message": "Invalid URL format",
  "data": null
}
```

---

## 6. USAGE EXAMPLES

### 6.1 Complete Reference Management Flow

```bash
# 1. Create book reference
curl -X POST http://localhost:3000/api/v1/admin/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Javanese Cultural Heritage: Traditional Arts and Practices",
    "referenceType": "BOOK",
    "description": "Comprehensive study of Javanese cultural heritage covering traditional arts, music, dance, and social practices",
    "url": "https://publisher.com/books/javanese-culture",
    "authors": "Dr. Ahmad Santoso, Prof. Siti Nurhaliza",
    "publicationYear": "2020",
    "status": "DRAFT"
  }'

# 2. Create journal article reference
curl -X POST http://localhost:3000/api/v1/admin/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Evolution of Gamelan Music in Modern Indonesian Society",
    "referenceType": "JOURNAL",
    "description": "Analysis of gamelan music adaptation in contemporary contexts. Published in Journal of Ethnomusicology, Volume 45, Issue 2, pp. 123-145. DOI: 10.1016/j.ethnomusicology.2021.03.001",
    "url": "https://journal.example.com/article/12345",
    "authors": "Dr. Budi Setiawan",
    "publicationYear": "2021",
    "status": "DRAFT"
  }'

# 3. Create website reference
curl -X POST http://localhost:3000/api/v1/admin/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Traditional Indonesian Textiles",
    "referenceType": "WEBSITE",
    "description": "Comprehensive online resource about Indonesian traditional textiles including batik, ikat, and songket. Maintained by Indonesian Cultural Heritage Foundation.",
    "url": "https://indonesian-textiles.org",
    "authors": "Indonesian Cultural Heritage Foundation",
    "publicationYear": "2023",
    "status": "DRAFT"
  }'

# 4. Get reference details
curl http://localhost:3000/api/v1/admin/references/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 5. Search references
curl "http://localhost:3000/api/v1/admin/references/search?q=javanese&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 6. Filter by type and year
curl "http://localhost:3000/api/v1/admin/references/filter?referenceType=BOOK&publicationYear=2020&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 7. Update reference status
curl -X PUT http://localhost:3000/api/v1/admin/references/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PUBLISHED"
  }'
```

### 6.2 Reference Type Examples

```bash
# Thesis reference
curl -X POST http://localhost:3000/api/v1/admin/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Cultural Preservation Through Digital Archiving: A Case Study of Balinese Traditional Music",
    "referenceType": "THESIS",
    "description": "Master thesis submitted to the Department of Cultural Studies, Udayana University. Examines digital preservation methods for traditional Balinese music.",
    "authors": "Ni Made Dewi",
    "publicationYear": "2022",
    "status": "PUBLISHED"
  }'

# Field notes reference
curl -X POST http://localhost:3000/api/v1/admin/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Field Observations: Ngaben Ceremony in Ubud, Bali",
    "referenceType": "FIELD_NOTE",
    "description": "Personal field notes from observation of traditional Balinese cremation ceremony (ngaben) conducted in Ubud on March 15, 2024.",
    "authors": "Dr. Wayan Sudirta",
    "publicationYear": "2024",
    "status": "DRAFT"
  }'

# Research report reference
curl -X POST http://localhost:3000/api/v1/admin/references \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Impact Assessment of Cultural Tourism on Traditional Craftsmen in Yogyakarta",
    "referenceType": "REPORT",
    "description": "Research report commissioned by the Ministry of Tourism and Creative Economy. Includes survey data from 200 traditional craftsmen in Yogyakarta Special Region.",
    "url": "https://tourism.go.id/reports/cultural-tourism-impact",
    "authors": "Research Team, Center for Cultural Studies",
    "publicationYear": "2023",
    "status": "PUBLISHED"
  }'
```

### 6.3 Advanced Filtering and Search

```bash
# Find all published books from 2020
curl "http://localhost:3000/api/v1/admin/references/filter?referenceType=BOOK&publicationYear=2020&status=PUBLISHED&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Search for references containing "cultural heritage"
curl "http://localhost:3000/api/v1/admin/references/search?q=cultural%20heritage&page=1&limit=15" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Find recent journal articles (2022-2024)
curl "http://localhost:3000/api/v1/admin/references/filter?referenceType=JOURNAL&createdAtFrom=2022-01-01&createdAtTo=2024-12-31&page=1&limit=25" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get all draft references for review
curl "http://localhost:3000/api/v1/admin/references/filter?status=DRAFT&page=1&limit=50" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 7. CITATION FORMATTING GUIDELINES

### 7.1 APA Style Examples

**Book**:
```
Santoso, A., & Nurhaliza, S. (2020). *Javanese Cultural Heritage: Traditional Arts and Practices*. Publisher Name.
```

**Journal Article**:
```
Setiawan, B. (2021). The Evolution of Gamelan Music in Modern Indonesian Society. *Journal of Ethnomusicology, 45*(2), 123-145. https://doi.org/10.1016/j.ethnomusicology.2021.03.001
```

**Website**:
```
Indonesian Cultural Heritage Foundation. (2023). *Traditional Indonesian Textiles*. https://indonesian-textiles.org
```

### 7.2 Chicago Style Examples

**Book**:
```
Santoso, Ahmad, and Siti Nurhaliza. *Javanese Cultural Heritage: Traditional Arts and Practices*. Publisher Name, 2020.
```

**Journal Article**:
```
Setiawan, Budi. "The Evolution of Gamelan Music in Modern Indonesian Society." Journal of Ethnomusicology 45, no. 2 (2021): 123-145.
```

### 7.3 Field Notes Format
```
Sudirta, Wayan. Field notes: Ngaben Ceremony in Ubud, Bali, March 15, 2024. Personal collection of Dr. Wayan Sudirta, Department of Anthropology, Udayana University.
```

---

## 8. NOTES

- **Reference Types**: 8 jenis referensi yang komprehensif untuk berbagai sumber akademik
- **Flexible Fields**: URL, authors, publication year bersifat optional untuk akomodasi berbagai jenis referensi
- **Citation Standards**: Mendukung multiple citation styles (APA, Chicago, etc.)
- **Status Workflow**: Draft → Published → Archived untuk content lifecycle management
- **Search Flexibility**: Search di title, authors, dan description untuk comprehensive discovery
- **Filter Combination**: Multiple filter criteria dapat dikombinasikan untuk query yang kompleks
- **Pagination**: Semua list endpoints mendukung pagination
- **Validation**: Strict validation untuk reference types dan URL formats
- **Usage Tracking**: Reference usage dapat dilacak untuk melihat seberapa sering direferensikan</content>
<parameter name="filePath">d:\my-code\1_home\leksikon-proj\leksikon-be-2\REFERENCE_API_DOCUMENTATION.md