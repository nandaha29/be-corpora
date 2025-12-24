# Test CSV Files untuk Black Box Testing

File CSV ini dibuat untuk melakukan pengujian black box pada endpoint bulk import leksikon.

## ⚠️ PENTING: Masalah Parsing CSV

**Kode saat ini menggunakan parser CSV sederhana** yang tidak mendukung:
- Field dengan koma di dalamnya (harus di-quote)
- Field kosong di tengah baris
- Encoding selain UTF-8

**Solusi:** Jangan gunakan koma dalam field apapun kecuali di header. Gunakan file yang sudah diperbaiki.

## File yang Tersedia

### 1. test_import_valid.csv (SUDAH DIPERBAIKI)
**Tujuan:** Test import sukses dengan data valid
**Isi:** 5 baris data leksikon dengan semua field valid
**Expected Result:** 5 imported, 0 skipped, 0 errors

**Data yang digunakan:**
- Domain IDs: 1, 2, 5, 7, 8 (semua valid)
- Contributor IDs: 1, 3, 4, 7, 9 (semua valid)
- Semua required fields terisi
- Slug kosong (akan di-generate otomatis)
- **TIDAK ADA KOMA** dalam field apapun

### 2. test_import_simple.csv
**Tujuan:** Test import paling sederhana
**Isi:** 3 baris data minimal dengan field wajib saja
**Expected Result:** 3 imported, 0 skipped, 0 errors

### 3. test_import_with_errors.csv
**Tujuan:** Test import dengan berbagai jenis error
**Isi:** 7 baris data dengan kombinasi valid dan error
**Expected Result:** 2 imported, 4 skipped, multiple errors

**Jenis Error yang Ditest:**
- Row 3: lexiconWord kosong (required field)
- Row 4: domainId 999 (tidak ada di database)
- Row 5: contributorId 999 (tidak ada di database)
- Row 6-7: Duplicate slug

### 4. test_import_empty.csv
**Tujuan:** Test import file kosong
**Isi:** Hanya header row, tidak ada data
**Expected Result:** 400 Bad Request - "No data found in CSV file"

### 2. test_import_with_errors.csv
**Tujuan:** Test import dengan berbagai jenis error
**Isi:** 7 baris data dengan kombinasi valid dan error
**Expected Result:** 2 imported, 4 skipped, multiple errors

**Jenis Error yang Ditest:**
- Row 3: lexiconWord kosong (required field)
- Row 4: domainId 999 (tidak ada di database)
- Row 5: contributorId 999 (tidak ada di database)
- Row 6-7: Duplicate slug

### 3. test_import_empty.csv
**Tujuan:** Test import file kosong
**Isi:** Hanya header row, tidak ada data
**Expected Result:** 400 Bad Request - "No data found in CSV file"

## Format CSV

Header yang diharapkan (13 kolom):
```
slug,lexiconWord,ipaInternationalPhoneticAlphabet,transliteration,etymologicalMeaning,culturalMeaning,commonMeaning,translation,variant,variantTranslations,otherDescription,domainId,contributorId
```

**Field Requirements:**
- `slug`: Optional (akan di-generate dari lexiconWord jika kosong)
- `lexiconWord`: Required
- `transliteration`: Required
- `etymologicalMeaning`: Required
- `culturalMeaning`: Required
- `commonMeaning`: Required
- `translation`: Required
- `domainId`: Required (integer, harus valid)
- `contributorId`: Required (integer, harus valid)
- Sisanya: Optional

## Cara Penggunaan

1. Pastikan server berjalan di `http://localhost:8000`
2. Login sebagai admin untuk mendapatkan Bearer token
3. Gunakan endpoint: `POST /api/v1/admin/leksikons/import`
4. Upload file CSV menggunakan form-data dengan key `file`
5. Include Authorization header: `Bearer YOUR_TOKEN`

## Contoh Command Curl

```bash
curl -X POST "http://localhost:8000/api/v1/admin/leksikons/import" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test_import_valid.csv"
```

## Expected Responses

### Success (200):
```json
{
  "success": true,
  "message": "Bulk import completed",
  "data": {
    "imported": 5,
    "skipped": 0,
    "errors": [],
    "importedLexicons": [...],
    "skippedLexicons": []
  }
}
```

### Partial Success (207):
```json
{
  "success": true,
  "message": "Bulk import completed",
  "data": {
    "imported": 2,
    "skipped": 4,
    "errors": ["Row 3: lexiconWord: Lexicon word is required", ...],
    "importedLexicons": [...],
    "skippedLexicons": [...]
  }
}
```

### Error (400):
```json
{
  "success": false,
  "message": "No data found in CSV file"
}
```

## Data Reference

**Domain IDs Valid:** 1-13
**Contributor IDs Valid:** 1-17

Lihat `BLACKBOX_TESTING_GUIDE.md` untuk detail lengkap data test.