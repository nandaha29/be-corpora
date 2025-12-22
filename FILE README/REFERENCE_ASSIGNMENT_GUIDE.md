# 📚 **PANDUAN ASSIGN REFERENCE KE 4 TEMPAT**

## 🎯 **OVERVIEW**

Sistem referensi bisa ditampilkan di **4 tempat berbeda**:
1. **Page Leksikon** - via `LexiconReference` junction table
2. **Page Subculture** - via `SubcultureReference` junction table
3. **Page About** - via `AboutReference` table
4. **List All References** - langsung dari tabel `Reference` (otomatis jika status `PUBLISHED`)

---

## ✅ **1. ASSIGN REFERENCE KE LEKSIKON**

### **Endpoint:**
```
POST /api/v1/admin/reference-junctions/lexicon/assign
```

### **Request Body:**
```json
{
  "lexiconId": 5,
  "referenceId": 1,
  "referenceRole": "SECONDARY_SOURCE"
}
```

### **Contoh:**
```bash
curl -X POST http://localhost:8000/api/v1/admin/reference-junctions/lexicon/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "lexiconId": 5,
    "referenceId": 1,
    "referenceRole": "SECONDARY_SOURCE"
  }'
```

### **Response:**
```json
{
  "lexiconId": 5,
  "referenceId": 1,
  "referenceRole": "SECONDARY_SOURCE",
  "reference": {
    "referenceId": 1,
    "title": "Pemetaan Kebudayaan di Jawa Timur",
    "authors": "Ayu Sutarto",
    "publicationYear": "2004"
  }
}
```

### **Get References dari Leksikon:**
```
GET /api/v1/admin/reference-junctions/lexicon/5
```

### **Remove Reference dari Leksikon:**
```
DELETE /api/v1/admin/reference-junctions/lexicon/5/1
```

---

## ✅ **2. ASSIGN REFERENCE KE SUBCULTURE**

### **Endpoint:**
```
POST /api/v1/admin/reference-junctions/subculture/assign
```

### **Request Body:**
```json
{
  "subcultureId": 2,
  "referenceId": 1,
  "referenceRole": "SECONDARY_SOURCE"
}
```

### **Contoh:**
```bash
curl -X POST http://localhost:8000/api/v1/admin/reference-junctions/subculture/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "subcultureId": 2,
    "referenceId": 1,
    "referenceRole": "SECONDARY_SOURCE"
  }'
```

### **Get References dari Subculture:**
```
GET /api/v1/admin/reference-junctions/subculture/2
```

### **Remove Reference dari Subculture:**
```
DELETE /api/v1/admin/reference-junctions/subculture/2/1
```

---

## ✅ **3. ASSIGN REFERENCE KE ABOUT PAGE**

### **Endpoint:**
```
POST /api/v1/admin/about-references
```

### **Request Body:**
```json
{
  "referenceId": 1,
  "displayOrder": 2,
  "isActive": true
}
```

### **Contoh:**
```bash
curl -X POST http://localhost:8000/api/v1/admin/about-references \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "referenceId": 1,
    "displayOrder": 2,
    "isActive": true
  }'
```

### **Get All About References:**
```
GET /api/v1/admin/about-references
```

### **Reorder About References:**
```
PUT /api/v1/admin/about-references/reorder
Body: [
  {"aboutReferenceId": 1, "displayOrder": 2},
  {"aboutReferenceId": 2, "displayOrder": 1}
]
```

### **Remove Reference dari About Page:**
```
DELETE /api/v1/admin/about-references/1
```

## ✅ **4. ASSIGN REFERENCE KE CULTURE**

### **Endpoint:**
```
POST /api/v1/admin/reference-junctions/culture/assign
```

### **Request Body:**
```json
{
  "cultureId": 1,
  "referenceId": 1,
  "referenceRole": "PRIMARY_SOURCE"
}
```

### **Contoh:**
```bash
curl -X POST http://localhost:8000/api/v1/admin/reference-junctions/culture/assign \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "cultureId": 1,
    "referenceId": 1,
    "referenceRole": "PRIMARY_SOURCE"
  }'
```

### **Get References dari Culture:**
```
GET /api/v1/admin/reference-junctions/culture/1
```

### **Remove Reference dari Culture:**
```
DELETE /api/v1/admin/reference-junctions/culture/1/1
```

---

## 📊 **REFERENCE USAGE STATISTICS**

### **Get Usage Stats untuk Reference Tertentu:**
```
GET /api/v1/admin/reference-junctions/stats/1
```

### **Response:**
```json
{
  "referenceId": 1,
  "lexiconCount": 12,
  "subcultureCount": 3,
  "cultureCount": 1,
  "totalUsage": 16
}
```

---

## 🔄 **WORKFLOW LENGKAP**

### **Step 1: Buat Reference Baru**
```
POST /api/v1/admin/references
Body: {
  "title": "Pemetaan Kebudayaan di Jawa Timur",
  "referenceType": "BOOK",
  "authors": "Ayu Sutarto",
  "publicationYear": "2004",
  "status": "PUBLISHED"
}
```

### **Step 2: Assign ke Leksikon**
```
POST /api/v1/admin/reference-junctions/lexicon/assign
Body: { "lexiconId": 5, "referenceId": 1, "referenceRole": "SECONDARY_SOURCE" }
```

### **Step 3: Assign ke Subculture**
```
POST /api/v1/admin/reference-junctions/subculture/assign
Body: { "subcultureId": 2, "referenceId": 1, "referenceRole": "SECONDARY_SOURCE" }
```

### **Step 4: Assign ke About Page**
```
POST /api/v1/admin/about-references
Body: { "referenceId": 1, "displayOrder": 2, "isActive": true }
```

### **Step 5: Assign ke Culture**
```
POST /api/v1/admin/reference-junctions/culture/assign
Body: { "cultureId": 1, "referenceId": 1, "referenceRole": "PRIMARY_SOURCE" }
```

### **Step 6: Reference Otomatis Muncul di List**
Karena status `PUBLISHED`, reference otomatis muncul di:
- `GET /api/v1/public/references`

---

## 📊 **USE CASE REAL**

### **Contoh: Reference "Ayu Sutarto (2004)"**

1. **Admin assign** ke:
   - 12 leksikon (via `LexiconReference`)
   - 3 subculture (via `SubcultureReference`)
   - 1 about page (via `AboutReference`)
   - 1 culture (via `CultureReference`)

2. **User buka `/lexicons/danyang`**
   - Muncul reference dengan role "SECONDARY_SOURCE"

3. **User buka `/subcultures/tengger`**
   - Muncul reference dengan role "SECONDARY_SOURCE"

4. **User buka `/about`**
   - Muncul reference dengan display order 2

5. **User buka `/references`**
   - Muncul card dengan stats:
     - 📖 12 lexicons
     - 🎭 3 subcultures
     - 🌍 1 culture
     - ℹ️ 1 about

---

## ⚠️ **CATATAN PENTING**

1. **1 Reference bisa muncul di BANYAK tempat** - Fleksibel!
2. **Setiap tempat bisa punya `referenceRole` berbeda** - Contextual!
3. **`displayOrder` mengatur urutan tampil di about page** - Customizable!
4. **Hanya reference dengan status `PUBLISHED` yang muncul di public** - Security!
5. **Gunakan unique constraints untuk avoid duplicates** - Safe!
6. **About references terpisah dari culture references** - Independent!

---

## ✅ **STATUS IMPLEMENTASI**

Semua endpoint sudah diimplementasikan:
- ✅ `src/controllers/admin/about-reference.controller.ts` - CRUD untuk about references
- ✅ `src/controllers/admin/reference-junction.controller.ts` - Junction management untuk lexicon, subculture, culture
- ✅ `src/services/admin/about-reference.service.ts` - Service functions untuk about references
- ✅ `src/services/admin/reference-junction.service.ts` - Service functions untuk reference junctions
- ✅ `src/routes/admin/about-reference.routes.ts` - Routes untuk about references
- ✅ `src/routes/admin/reference-junction.routes.ts` - Routes untuk reference junctions
```

---

## ✅ **4. LIST ALL REFERENCES** (Otomatis)

Reference dengan status `PUBLISHED` otomatis muncul di:
```
GET /api/v1/public/references
```

Response termasuk `_count` untuk tracking usage:
```json
[
  {
    "referenceId": 1,
    "title": "Pemetaan Kebudayaan di Jawa Timur",
    "authors": "Ayu Sutarto",
    "publicationYear": "2004",
    "_count": {
      "lexiconReferences": 12,
      "subcultureReferences": 3,
      "cultureReferences": 1
    }
  }
]
```

---

## 📋 **CITATION NOTE TYPES**

Enum `CitationNoteType` yang tersedia:
- `DIRECT_QUOTE` - Kutipan langsung
- `PARAPHRASE` - Parafrase
- `INTERPRETATION` - Interpretasi
- `FIELD_OBSERVATION` - Observasi lapangan
- `ORAL_TRADITION` - Tradisi lisan
- `SECONDARY_SOURCE` - Sumber sekunder
- `GENERAL_REFERENCE` - Referensi umum

---

## 🔄 **ALUR LENGKAP**

### **Step 1: Buat Reference (jika belum ada)**
```
POST /api/v1/admin/references
Body: {
  "title": "Pemetaan Kebudayaan di Jawa Timur",
  "authors": "Ayu Sutarto",
  "publicationYear": "2004",
  "referenceType": "BOOK",
  "status": "PUBLISHED"
}
```

### **Step 2: Assign ke Leksikon**
```
POST /api/v1/admin/leksikons/5/references
Body: { "referenceId": 1, "citationNote": "SECONDARY_SOURCE", "displayOrder": 1 }
```

### **Step 3: Assign ke Subculture**
```
POST /api/v1/admin/subcultures/2/references-direct
Body: { "referenceId": 1, "citationNote": "GENERAL_REFERENCE", "displayOrder": 1 }
```

### **Step 4: Assign ke Culture (About Page)**
```
POST /api/v1/admin/cultures/1/references
Body: { "referenceId": 1, "citationNote": "DIRECT_QUOTE", "displayOrder": 2 }
```

### **Step 5: Reference Otomatis Muncul di List**
Karena status `PUBLISHED`, reference otomatis muncul di:
- `GET /api/v1/public/references`

---

## 📊 **USE CASE REAL**

### **Contoh: Reference "Ayu Sutarto (2004)"**

1. **Admin assign** ke:
   - 12 leksikon (via `LexiconReference`)
   - 3 subculture (via `SubcultureReference`)
   - 1 culture/about (via `CultureReference`)

2. **User buka `/budaya/tengger/danyang`**
   - Muncul reference dengan badge "SECONDARY_SOURCE"

3. **User buka `/budaya/tengger`**
   - Muncul reference dengan badge "GENERAL_REFERENCE"

4. **User buka `/about`**
   - Muncul reference dengan badge "DIRECT_QUOTE"

5. **User buka `/references`**
   - Muncul card dengan stats:
     - 📖 12 lexicons
     - 🎭 3 subcultures
     - ℹ️ 1 about

---

## ⚠️ **CATATAN PENTING**

1. **1 Reference bisa muncul di BANYAK tempat** - Fleksibel!
2. **Setiap tempat bisa punya `citationNote` berbeda** - Contextual!
3. **`displayOrder` mengatur urutan tampil** - Customizable!
4. **Hanya reference dengan status `PUBLISHED` yang muncul di public** - Security!
5. **Gunakan `upsert` untuk avoid duplicates** - Safe!

---

## ✅ **STATUS IMPLEMENTASI**

Semua endpoint sudah diimplementasikan:
- ✅ `src/controllers/admin/leksikon.controller.ts` - Endpoint untuk assign reference ke leksikon
- ✅ `src/controllers/admin/subculture.controller.ts` - Endpoint untuk assign reference langsung ke subculture (`references-direct`)
- ✅ `src/controllers/admin/culture.controller.ts` - Endpoint untuk assign reference ke culture (about page)
- ✅ `src/services/admin/subculture.service.ts` - Service functions untuk SubcultureReference
- ✅ `src/services/admin/culture.service.ts` - Service functions untuk CultureReference
- ✅ `src/routes/admin/subculture.routes.ts` - Routes untuk references-direct
- ✅ `src/routes/admin/culture.routes.ts` - Routes untuk culture references

