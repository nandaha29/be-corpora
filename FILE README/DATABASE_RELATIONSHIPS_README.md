# 📚 **DATABASE RELATIONSHIPS: Assets vs References**

Dokumen ini menjelaskan **kenapa references perlu junction tables** sedangkan assets tidak, dengan analogi dan contoh praktis.

## 🎯 **TL;DR**

- **Assets**: Simple relationship (1 asset = 1 purpose per entity)
- **References**: Complex relationship (1 reference = multiple purposes across entities)
- **Junction Tables**: Diperlukan untuk references karena fleksibilitas assignment yang tinggi

---

## 📸 **ASSETS: Simple Assignment System**

### **Konsep Dasar**
Assets menggunakan **simple junction tables** dimana satu asset hanya bisa assign **1 kali** per entity dengan **1 role**.

### **Struktur Database**

```prisma
model LexiconAsset {
  lexiconId Int               @map("lexicon_id")
  assetId   Int               @map("asset_id")
  assetRole LeksikonAssetRole @map("asset_role")
  createdAt DateTime          @default(now()) @map("created_at")

  @@id([lexiconId, assetId]) // Primary key: lexiconId + assetId
}

model SubcultureAsset {
  subcultureId Int                 @map("subculture_id")
  assetId      Int                 @map("asset_id")
  assetRole    SubcultureAssetRole @map("asset_role")
  createdAt    DateTime            @default(now()) @map("created_at")

  @@id([subcultureId, assetId, assetRole]) // Primary key: subcultureId + assetId + assetRole
}
```

### **Logic Assets**
- ✅ **1 asset** = **1 assignment** per entity
- ✅ Kalau mau assign lagi → **harus hapus yang lama dulu**
- ✅ **Role sudah fix** per assignment

### **Contoh Real-World**

```sql
-- Asset "photo1.jpg" untuk lexicon "danyang"
INSERT INTO lexicon_assets (lexicon_id, asset_id, asset_role)
VALUES (1, 1, 'GALLERY');

-- Mau assign "photo1.jpg" lagi ke lexicon yang sama?
-- ERROR: Duplicate entry (lexicon_id=1, asset_id=1)
-- Harus hapus yang lama atau ganti asset lain
```

### **Analoginya**
**Assets seperti Instagram Post:**
- 1 foto hanya bisa di **1 album** saja
- Kalau mau pindah album → hapus dari album lama dulu

---

## 📚 **REFERENCES: Complex Relationship System**

### **Konsep Dasar**
References menggunakan **advanced junction tables** dimana satu referensi bisa assign **berkali-kali** ke berbagai entity dengan **role berbeda**.

### **Struktur Database**

```prisma
model LexiconReference {
  lexiconId     Int                   @map("lexicon_id")
  referenceId   Int                   @map("reference_id")
  referenceRole LexiconReferenceRole? @map("reference_role")
  displayOrder  Int?                  @default(0) @map("display_order")
  createdAt     DateTime              @default(now()) @map("created_at")

  @@id([lexiconId, referenceId]) // Primary key: lexiconId + referenceId
}

model SubcultureReference {
  subcultureId  Int                      @map("subculture_id")
  referenceId   Int                      @map("reference_id")
  referenceRole SubcultureReferenceRole? @map("reference_role")
  displayOrder  Int?                     @default(0) @map("display_order")
  createdAt     DateTime                 @default(now()) @map("created_at")

  @@id([subcultureId, referenceId]) // Primary key: subcultureId + referenceId
}

model CultureReference {
  cultureId    Int                    @map("culture_id")
  referenceId  Int                    @map("reference_id")
  referenceRole CultureReferenceRole? @map("reference_role")
  displayOrder Int?                   @default(0) @map("display_order")
  createdAt    DateTime               @default(now()) @map("created_at")

  @@id([cultureId, referenceId]) // Primary key: cultureId + referenceId
}
```

### **Logic References**
- ✅ **1 referensi** = **multiple assignments** ke berbagai entity
- ✅ **Role bisa berbeda** untuk setiap assignment
- ✅ **Flexible assignment** tanpa batasan

### **Contoh Real-World**

```sql
-- Referensi "Ayu Sutarto (2004)" bisa assign ke banyak tempat
INSERT INTO lexicon_references (lexicon_id, reference_id, reference_role)
VALUES (1, 1, 'SUPPORTING');

INSERT INTO subculture_references (subculture_id, reference_id, reference_role)
VALUES (5, 1, 'SECONDARY_SOURCE');

INSERT INTO culture_references (culture_id, reference_id, reference_role)
VALUES (2, 1, 'PRIMARY_SOURCE');

-- Semua assignment valid! ✅
```

### **Analoginya**
**References seperti Spotify Playlist:**
- 1 lagu bisa ada di **banyak playlist** sekaligus
- Setiap playlist bisa punya **"mood" berbeda** untuk lagu yang sama

---

## 🔑 **Perbedaan Kunci**

| **Aspect** | **Assets** | **References** |
|------------|------------|----------------|
| **Primary Key** | `entityId + assetId` | `entityId + referenceId` |
| **Role dalam PK** | Tidak (kecuali SubcultureAsset) | Tidak |
| **Multiple Assignment** | ❌ Tidak bisa | ✅ Bisa |
| **Role Flexibility** | 🔒 Fix per assignment | 🔓 Bisa berbeda per assignment |
| **Junction Tables** | Simple | Advanced |
| **Use Case** | 1 asset = 1 purpose | 1 reference = multiple contexts |

---

## 🎭 **User Experience Impact**

### **Assets Display**
```javascript
// Halaman lexicon
{
  "lexiconAssets": [
    {
      "assetId": 1,
      "assetRole": "GALLERY",
      "url": "photo1.jpg"
    }
  ]
}
```

### **References Display**
```javascript
// Halaman lexicon
{
  "lexiconReferences": [
    {
      "title": "Ayu Sutarto (2004)",
      "referenceRole": "SUPPORTING"
    }
  ]
}

// Halaman subculture
{
  "subcultureReferences": [
    {
      "title": "Ayu Sutarto (2004)",
      "referenceRole": "SECONDARY_SOURCE"
    }
  ]
}

// Halaman culture/about
{
  "cultureReferences": [
    {
      "title": "Ayu Sutarto (2004)",
      "referenceRole": "PRIMARY_SOURCE"
    }
  ]
}
```

---

## 🏗️ **Architecture Decision**

### **Kenapa Assets Tidak Perlu Junction Advanced?**
- **Business Logic**: 1 asset cukup untuk 1 purpose per entity
- **Simplicity**: Kurangi kompleksitas database
- **Performance**: Query lebih cepat tanpa role flexibility

### **Kenapa References Perlu Junction Advanced?**
- **Business Logic**: 1 referensi bisa relevant di multiple contexts
- **Flexibility**: Role berbeda per halaman (SUPPORTING, SECONDARY_SOURCE, PRIMARY_SOURCE)
- **Reusability**: Hindari duplicate data referensi
- **Analytics**: Track usage statistics across entities

---

## 📊 **Database Impact**

### **Assets Tables**
```
ASSETS (main table)
┌──────────┬────────────┬──────────────┐
│ assetId  │ fileName   │ fileType     │
├──────────┼────────────┼──────────────┤
│ 1        │ photo1.jpg │ PHOTO        │
└──────────┴────────────┴──────────────┘

LEXICON_ASSETS (junction)
┌───────────┬─────────┬───────────┐
│ lexiconId │ assetId │ assetRole │
├───────────┼─────────┼───────────┤
│ 1         │ 1       │ GALLERY   │ ← 1 assignment only
└───────────┴─────────┴───────────┘
```

### **References Tables**
```
REFERENCES (main table)
┌─────────────┬─────────────────┬──────────────┐
│ referenceId │ title           │ authors      │
├─────────────┼─────────────────┼──────────────┤
│ 1           │ Ayu Sutarto     │ Ayu Sutarto  │
└─────────────┴─────────────────┴──────────────┘

LEXICON_REFERENCES (junction)
┌───────────┬─────────────┬──────────────┐
│ lexiconId │ referenceId │ referenceRole│
├───────────┼─────────────┼──────────────┤
│ 1         │ 1           │ SUPPORTING   │
└───────────┴─────────────┴──────────────┘

SUBCULTURE_REFERENCES (junction)
┌─────────────┬─────────────┬─────────────────┐
│ subcultureId│ referenceId │ referenceRole   │
├─────────────┼─────────────┼─────────────────┤
│ 5           │ 1           │ SECONDARY_SOURCE│
└─────────────┴─────────────┴─────────────────┘

CULTURE_REFERENCES (junction)
┌───────────┬─────────────┬──────────────┐
│ cultureId │ referenceId │ referenceRole│
├───────────┼─────────────┼──────────────┤
│ 2         │ 1           │ PRIMARY_SOURCE│
└───────────┴─────────────┴──────────────┘
```

---

## 🚀 **Implementation Files**

### **Assets Management**
- `src/services/admin/asset.service.ts` - Basic CRUD
- `src/controllers/admin/asset.controller.ts` - REST endpoints
- `src/routes/admin/asset.routes.ts` - Route definitions

### **References Management**
- `src/services/admin/reference.service.ts` - Main reference CRUD
- `src/services/admin/reference-junction.service.ts` - **Junction management**
- `src/controllers/admin/reference.controller.ts` - Main reference endpoints
- `src/controllers/admin/reference-junction.controller.ts` - **Junction endpoints**
- `src/routes/admin/reference.routes.ts` - Main routes
- `src/routes/admin/reference-junction.routes.ts` - **Junction routes**

---

## 💡 **Best Practices**

### **Assets**
- ✅ Gunakan untuk media files (photos, videos, 3D models)
- ✅ Simple assignment logic
- ✅ Role-based display (GALLERY, THUMBNAIL, etc.)

### **References**
- ✅ Gunakan untuk academic citations
- ✅ Complex relationship management
- ✅ Context-aware role assignment
- ✅ Usage statistics tracking

---

## 🎯 **Conclusion**

**Assets** = **Simple, efficient relationship** untuk media files
**References** = **Complex, flexible relationship** untuk academic citations

**Junction tables advanced** di references memberikan **fleksibilitas maksimal** untuk assignment referensi ke berbagai konteks dengan role berbeda, yang tidak diperlukan untuk assets karena business logic yang berbeda.

**Choose the right tool for the right job!** 🛠️</content>
<parameter name="filePath">d:\my-code\1_home\leksikon-proj\leksikon-be-2\DATABASE_RELATIONSHIPS_README.md