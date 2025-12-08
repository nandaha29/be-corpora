import express from "express";
import * as subcultureController from "../../controllers/admin/subculture.controller.js";
import { authenticateAdmin } from "../../middleware/auth.middleware.js";

const router = express.Router();

// ============================================
// SUBCULTURE MANAGEMENT ENDPOINTS
// ============================================

// GET /api/v1/admin/subcultures
// Mengambil semua subculture dengan pagination
// Query params: page, limit
// Digunakan untuk: Menampilkan daftar subculture di admin panel dengan pagination
router.get("/", authenticateAdmin, subcultureController.getAllSubculturesPaginated);

// POST /api/v1/admin/subcultures
// Membuat subculture baru
// Body: subcultureName, traditionalGreeting, greetingMeaning, explanation, cultureId, status, conservationStatus, displayPriorityStatus
// Digunakan untuk: Menambahkan subculture baru ke database
router.post("/", authenticateAdmin, subcultureController.createSubculture);

// GET /api/v1/admin/subcultures/filter
// Filter dan pencarian subculture berdasarkan berbagai kriteria
// Query params: status, displayPriorityStatus, conservationStatus, cultureId, search, page, limit
// Digunakan untuk: Advanced filtering dan searching subculture (status, priority, konservasi, dll)
// SUPPORTS COMBINATION FILTERS: Can filter by multiple criteria at once
// Example: /api/v1/admin/subcultures/filter?status=PUBLISHED&cultureId=5&displayPriorityStatus=HIGH&page=1&limit=20
router.get("/filter", authenticateAdmin, subcultureController.getFilteredSubcultures);

// GET /api/v1/admin/subcultures/:id
// Mengambil detail subculture berdasarkan ID
// Digunakan untuk: Menampilkan detail lengkap subculture tertentu
router.get("/:id", authenticateAdmin, subcultureController.getSubcultureById);

// PUT /api/v1/admin/subcultures/:id
// Update subculture (termasuk displayPriorityStatus)
// Body: subcultureName, traditionalGreeting, greetingMeaning, explanation, cultureId, status, conservationStatus, displayPriorityStatus
// Digunakan untuk: Mengubah data subculture termasuk priority display
router.put("/:id", authenticateAdmin, subcultureController.updateSubculture);

// DELETE /api/v1/admin/subcultures/:id
// Menghapus subculture berdasarkan ID
// Digunakan untuk: Menghapus subculture dari database
router.delete("/:id", authenticateAdmin, subcultureController.deleteSubculture);

// ============================================
// ASSET MANAGEMENT ENDPOINTS
// ============================================

// GET /api/v1/admin/subcultures/:id/assigned-assets
// Melihat semua asset yang sudah di-assign ke subculture tertentu
// Digunakan untuk: Menampilkan daftar asset yang digunakan oleh subculture
router.get("/:id/assigned-assets", authenticateAdmin, subcultureController.getAssignedAssets);

// GET /api/v1/admin/subcultures/:id/assigned-references
// Melihat semua referensi yang digunakan oleh leksikon dalam subculture tertentu
// Digunakan untuk: Menampilkan daftar referensi yang terkait dengan subculture
router.get("/:id/assigned-references", authenticateAdmin, subcultureController.getAssignedReferences);

// // POST /api/v1/admin/subcultures/:id/references
// // Menambahkan referensi ke subculture (assign ke leksikon dalam subculture)
// // Body: referenceId, lexiconId (opsional, jika tidak ada akan assign ke semua leksikon)
// // Digunakan untuk: Menambahkan referensi ke subculture
//  TIDAK DIGUNAKAN: karena referensi sekarang di-assign langsung ke SubcultureReference secara bersamaan dengan  semua leksikon
// router.post("/:id/references", authenticateAdmin, subcultureController.addReferenceToSubculture);

// POST /api/v1/admin/subcultures/:id/references-direct
// Assign reference directly to SubcultureReference (for subculture page)
// Body: referenceId, displayOrder (optional), referenceRole (optional)
// Digunakan untuk: Menambahkan referensi langsung ke subculture page
router.post("/:id/references-direct", authenticateAdmin, subcultureController.addReferenceToSubcultureDirect);

// GET /api/v1/admin/subcultures/:id/references-direct
// Get all references assigned directly to subculture
// Digunakan untuk: Melihat daftar referensi yang di-assign langsung ke subculture
router.get("/:id/references-direct", authenticateAdmin, subcultureController.getSubcultureReferencesDirect);

// DELETE /api/v1/admin/subcultures/:id/references-direct/:referenceId
// Remove reference from SubcultureReference
// Digunakan untuk: Menghapus referensi dari subculture page
router.delete("/:id/references-direct/:referenceId", authenticateAdmin, subcultureController.removeReferenceFromSubcultureDirect);

// GET /api/v1/admin/subcultures/:id/filter-assets
// Filter asset subculture by Type, Role, Status (kombinasi)
// Query params: type, assetRole, status, page, limit
// Digunakan untuk: Advanced filtering assets dalam subculture
router.get("/:id/filter-assets", authenticateAdmin, subcultureController.filterSubcultureAssets);

// GET /api/v1/admin/subcultures/:id/filter-references
// Filter dan search referensi subculture by Type, Year, Status, ReferenceRole, dan Search Query (kombinasi)
// Query params: referenceType, publicationYear, status, referenceRole, q (search), page, limit
// Digunakan untuk: Advanced filtering dan searching referensi dalam subculture
// SUPPORTS COMBINATION: Can search and filter at the same time
// Example: /api/v1/admin/subcultures/1/filter-references?referenceType=JOURNAL&q=anthropology&status=PUBLISHED&page=1&limit=20
router.get("/:id/filter-references", authenticateAdmin, subcultureController.filterSubcultureReferences);

// GET /api/v1/admin/subcultures/:id/search-assets
// Mencari asset yang sudah di-assign ke subculture berdasarkan nama file atau deskripsi
// Query params: q (search query)
// Digunakan untuk: Pencarian cepat asset dalam subculture tertentu
router.get("/:id/search-assets", authenticateAdmin, subcultureController.searchAssetsInSubculture);

// GET /api/v1/admin/subcultures/:id/search-references
// Mencari referensi yang digunakan di subculture berdasarkan judul, deskripsi, atau penulis
// Query params: q (search query)
// Digunakan untuk: Pencarian cepat referensi dalam subculture tertentu
// NOTE: This endpoint is now combined with filter-references endpoint above
// router.get("/:id/search-references", authenticateAdmin, subcultureController.searchReferencesInSubculture);

// ============================================
// ORPHAN DATA DETECTION ENDPOINTS
// ============================================

// GET /api/v1/admin/subcultures/assets/:assetId/usage
// Melihat di subculture mana saja asset tertentu digunakan
// Digunakan untuk: Mendeteksi apakah asset masih digunakan (orphan detection)
router.get("/assets/:assetId/usage", authenticateAdmin, subcultureController.getAssetUsage);

// GET /api/v1/admin/subcultures/references/:referenceId/usage
// Melihat di subculture mana saja referensi tertentu digunakan
// Digunakan untuk: Mendeteksi apakah referensi masih digunakan (orphan detection)
router.get("/references/:referensiId/usage", authenticateAdmin, subcultureController.getReferenceUsage);

// ============================================
// LEGACY ASSET MANAGEMENT (existing endpoints)
// ============================================

// GET /api/v1/admin/subcultures/:id/assets
// Melihat semua asset yang terkait dengan subculture (legacy endpoint)
// Digunakan untuk: Kompatibilitas dengan sistem lama
router
  .route('/:id/assets')
  .get(authenticateAdmin, subcultureController.getSubcultureAssets)
  .post(authenticateAdmin, subcultureController.addAssetToSubculture);

// DELETE /api/v1/admin/subcultures/:id/assets/:assetId
// Menghapus asset dari subculture
// Query params: assetRole
// Digunakan untuk: Menghapus hubungan antara asset dan subculture
router
  .route('/:id/assets/:assetId')
  .delete(authenticateAdmin, subcultureController.removeAssetFromSubculture);

// ============================================
// CULTURE RELATION ENDPOINTS
// ============================================

// GET /api/v1/admin/subcultures/:cultureId/subcultures
// Mengambil semua subculture dalam culture tertentu
// Digunakan untuk: Menampilkan subculture berdasarkan culture induk
router.get("/:cultureId/subcultures", authenticateAdmin, subcultureController.getSubculturesByCulture);

export default router;
