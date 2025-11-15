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

// GET /api/v1/admin/subcultures/filter
// Filter dan pencarian subculture berdasarkan berbagai kriteria
// Query params: status, statusPriorityDisplay, statusKonservasi, cultureId, search, page, limit
// Digunakan untuk: Advanced filtering dan searching subculture (status, priority, konservasi, dll)
router.get("/filter", authenticateAdmin, subcultureController.getFilteredSubcultures);

// GET /api/v1/admin/subcultures/:id
// Mengambil detail subculture berdasarkan ID
// Digunakan untuk: Menampilkan detail lengkap subculture tertentu
router.get("/:id", authenticateAdmin, subcultureController.getSubcultureById);

// PUT /api/v1/admin/subcultures/:id
// Update subculture (termasuk statusPriorityDisplay)
// Body: namaSubculture, salamKhas, artiSalamKhas, penjelasan, cultureId, status, statusKonservasi, statusPriorityDisplay
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

// GET /api/v1/admin/subcultures/:id/search-assets
// Mencari asset yang sudah di-assign ke subculture berdasarkan nama file atau deskripsi
// Query params: q (search query)
// Digunakan untuk: Pencarian cepat asset dalam subculture tertentu
router.get("/:id/search-assets", authenticateAdmin, subcultureController.searchAssetsInSubculture);

// GET /api/v1/admin/subcultures/:id/search-references
// Mencari referensi yang digunakan di subculture berdasarkan judul, deskripsi, atau penulis
// Query params: q (search query)
// Digunakan untuk: Pencarian cepat referensi dalam subculture tertentu
router.get("/:id/search-references", authenticateAdmin, subcultureController.searchReferencesInSubculture);

// ============================================
// ORPHAN DATA DETECTION ENDPOINTS
// ============================================

// GET /api/v1/admin/subcultures/assets/:assetId/usage
// Melihat di subculture mana saja asset tertentu digunakan
// Digunakan untuk: Mendeteksi apakah asset masih digunakan (orphan detection)
router.get("/assets/:assetId/usage", authenticateAdmin, subcultureController.getAssetUsage);

// GET /api/v1/admin/subcultures/references/:referensiId/usage
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
// Body: assetRole
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
