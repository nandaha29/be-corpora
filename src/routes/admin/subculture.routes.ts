import express from "express";
import * as subcultureController from "../../controllers/admin/subculture.controller.js";
import { authenticateAdmin } from "../../middleware/auth.middleware.js";

const router = express.Router();

// ============================================
// SUBCULTURE MANAGEMENT ROUTES
// Endpoints for managing subculture (sub-budaya) entries
// 
// File: src/routes/admin/subculture.routes.ts
// Controller: src/controllers/admin/subculture.controller.ts
// Service: src/services/admin/subculture.service.ts
// 
// Features:
// - CRUD operations for subcultures
// - Asset management (MAIN_IMAGE, GALLERY, AUDIO, VIDEO, MODEL_3D)
// - Reference management (direct and via junction table)
// - Status management (DRAFT, PUBLISHED, ARCHIVED)
// - Display priority (HIGH, MEDIUM, LOW)
// - Conservation status (MAINTAINED, TREATED, CRITICAL, ARCHIVED)
// - Search and advanced filtering
// - Orphan data detection for assets and references
// ============================================

// ============================================
// SUBCULTURE MANAGEMENT ENDPOINTS
// ============================================

/**
 * @route GET /api/v1/admin/subcultures
 * @desc Mengambil semua subculture dengan pagination
 * @access Admin only
 * @query {number} page - Nomor halaman (default: 1)
 * @query {number} limit - Jumlah item per halaman (default: 20)
 * @returns {Array} List of subcultures with pagination info
 * @usage Digunakan untuk menampilkan daftar subculture di admin panel
 */
router.get("/", authenticateAdmin, subcultureController.getAllSubculturesPaginated);

/**
 * @route POST /api/v1/admin/subcultures
 * @desc Membuat subculture baru
 * @access Admin only
 * @body {string} subcultureName - Nama subculture (required)
 * @body {string} traditionalGreeting - Salam tradisional (optional)
 * @body {string} greetingMeaning - Arti salam (optional)
 * @body {string} explanation - Penjelasan/deskripsi (optional)
 * @body {number} cultureId - ID culture induk (required)
 * @body {string} status - Status (DRAFT, PUBLISHED, ARCHIVED)
 * @body {string} conservationStatus - Status konservasi (MAINTAINED, TREATED, CRITICAL, ARCHIVED)
 * @body {string} displayPriorityStatus - Prioritas tampilan (HIGH, MEDIUM, LOW)
 * @returns {Object} Created subculture
 * @usage Digunakan untuk menambahkan subculture baru ke database
 */
router.post("/", authenticateAdmin, subcultureController.createSubculture);

/**
 * @route GET /api/v1/admin/subcultures/filter
 * @desc Filter dan pencarian subculture berdasarkan berbagai kriteria
 * @access Admin only
 * @query {string} status - Filter by status (DRAFT, PUBLISHED, ARCHIVED)
 * @query {string} displayPriorityStatus - Filter by priority (HIGH, MEDIUM, LOW)
 * @query {string} conservationStatus - Filter by conservation status
 * @query {number} cultureId - Filter by parent culture ID
 * @query {string} search - Search query (nama, greeting, explanation)
 * @query {number} page - Nomor halaman (default: 1)
 * @query {number} limit - Jumlah item per halaman (default: 20)
 * @returns {Array} Filtered subcultures with pagination
 * @usage Advanced filtering dan searching subculture (supports combination filters)
 * @example /api/v1/admin/subcultures/filter?status=PUBLISHED&cultureId=5&displayPriorityStatus=HIGH
 */
router.get("/filter", authenticateAdmin, subcultureController.getFilteredSubcultures);

/**
 * @route GET /api/v1/admin/subcultures/:id
 * @desc Mengambil detail subculture berdasarkan ID
 * @access Admin only
 * @param {number} id - Subculture ID
 * @returns {Object} Subculture detail with culture info
 * @usage Digunakan untuk menampilkan detail lengkap subculture tertentu
 */
router.get("/:id", authenticateAdmin, subcultureController.getSubcultureById);

/**
 * @route PUT /api/v1/admin/subcultures/:id
 * @desc Update subculture (termasuk displayPriorityStatus)
 * @access Admin only
 * @param {number} id - Subculture ID
 * @body {string} subcultureName - Nama subculture
 * @body {string} traditionalGreeting - Salam tradisional
 * @body {string} greetingMeaning - Arti salam
 * @body {string} explanation - Penjelasan
 * @body {number} cultureId - ID culture induk
 * @body {string} status - Status
 * @body {string} conservationStatus - Status konservasi
 * @body {string} displayPriorityStatus - Prioritas tampilan
 * @returns {Object} Updated subculture
 * @usage Digunakan untuk mengubah data subculture termasuk priority display
 */
router.put("/:id", authenticateAdmin, subcultureController.updateSubculture);

/**
 * @route DELETE /api/v1/admin/subcultures/:id
 * @desc Menghapus subculture berdasarkan ID
 * @access Admin only
 * @param {number} id - Subculture ID
 * @returns {Object} Deletion confirmation
 * @usage Digunakan untuk menghapus subculture dari database
 */
router.delete("/:id", authenticateAdmin, subcultureController.deleteSubculture);

// ============================================
// ASSET MANAGEMENT ENDPOINTS
// Endpoints for managing subculture assets
// ============================================

/**
 * @route GET /api/v1/admin/subcultures/:id/assigned-assets
 * @desc Melihat semua asset yang sudah di-assign ke subculture tertentu
 * @access Admin only
 * @param {number} id - Subculture ID
 * @returns {Array} List of assigned assets with roles
 * @usage Digunakan untuk menampilkan daftar asset yang digunakan oleh subculture
 */
router.get("/:id/assigned-assets", authenticateAdmin, subcultureController.getAssignedAssets);

/**
 * @route GET /api/v1/admin/subcultures/:id/assigned-references
 * @desc Melihat semua referensi yang digunakan oleh leksikon dalam subculture tertentu
 * @access Admin only
 * @param {number} id - Subculture ID
 * @returns {Array} List of assigned references
 * @usage Digunakan untuk menampilkan daftar referensi yang terkait dengan subculture
 */
router.get("/:id/assigned-references", authenticateAdmin, subcultureController.getAssignedReferences);

// ============================================
// DIRECT REFERENCE MANAGEMENT ENDPOINTS
// Endpoints for managing references directly assigned to subculture
// ============================================

/**
 * @route POST /api/v1/admin/subcultures/:id/references-direct
 * @desc Assign reference directly to SubcultureReference (for subculture page)
 * @access Admin only
 * @param {number} id - Subculture ID
 * @body {number} referenceId - ID referensi (required)
 * @body {number} displayOrder - Urutan tampilan (optional)
 * @body {string} referenceRole - Role referensi (PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING) (optional)
 * @returns {Object} Created reference assignment
 * @usage Digunakan untuk menambahkan referensi langsung ke subculture page
 */
router.post("/:id/references-direct", authenticateAdmin, subcultureController.addReferenceToSubcultureDirect);

/**
 * @route GET /api/v1/admin/subcultures/:id/references-direct
 * @desc Get all references assigned directly to subculture
 * @access Admin only
 * @param {number} id - Subculture ID
 * @returns {Array} List of directly assigned references
 * @usage Digunakan untuk melihat daftar referensi yang di-assign langsung ke subculture
 */
router.get("/:id/references-direct", authenticateAdmin, subcultureController.getSubcultureReferencesDirect);

/**
 * @route DELETE /api/v1/admin/subcultures/:id/references-direct/:referenceId
 * @desc Remove reference from SubcultureReference
 * @access Admin only
 * @param {number} id - Subculture ID
 * @param {number} referenceId - Reference ID
 * @returns {Object} Deletion confirmation
 * @usage Digunakan untuk menghapus referensi dari subculture page
 */
router.delete("/:id/references-direct/:referenceId", authenticateAdmin, subcultureController.removeReferenceFromSubcultureDirect);

// ============================================
// FILTER & SEARCH ENDPOINTS
// Advanced filtering and searching for subculture assets and references
// ============================================

/**
 * @route GET /api/v1/admin/subcultures/:id/filter-assets
 * @desc Filter asset subculture by Type, Role, Status (kombinasi)
 * @access Admin only
 * @param {number} id - Subculture ID
 * @query {string} type - Filter by asset type (PHOTO, AUDIO, VIDEO, MODEL_3D)
 * @query {string} assetRole - Filter by role (MAIN_IMAGE, GALLERY, AUDIO, VIDEO, MODEL_3D)
 * @query {string} status - Filter by status (ACTIVE, PROCESSING, ARCHIVED, CORRUPTED)
 * @query {number} page - Nomor halaman (default: 1)
 * @query {number} limit - Jumlah item per halaman (default: 20)
 * @returns {Array} Filtered assets with pagination
 * @usage Advanced filtering assets dalam subculture (supports combination)
 */
router.get("/:id/filter-assets", authenticateAdmin, subcultureController.filterSubcultureAssets);

/**
 * @route GET /api/v1/admin/subcultures/:id/filter-references
 * @desc Filter dan search referensi subculture by Type, Year, Status, ReferenceRole, dan Search Query
 * @access Admin only
 * @param {number} id - Subculture ID
 * @query {string} referenceType - Filter by type (JOURNAL, BOOK, ARTICLE, WEBSITE, etc.)
 * @query {string} publicationYear - Filter by publication year
 * @query {string} status - Filter by status (DRAFT, PUBLISHED, ARCHIVED)
 * @query {string} referenceRole - Filter by role (PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING)
 * @query {string} q - Search query (title, authors, description)
 * @query {number} page - Nomor halaman (default: 1)
 * @query {number} limit - Jumlah item per halaman (default: 20)
 * @returns {Array} Filtered references with pagination
 * @usage Advanced filtering dan searching referensi dalam subculture (supports combination)
 * @example /api/v1/admin/subcultures/1/filter-references?referenceType=JOURNAL&q=anthropology&status=PUBLISHED
 */
router.get("/:id/filter-references", authenticateAdmin, subcultureController.filterSubcultureReferences);

/**
 * @route GET /api/v1/admin/subcultures/:id/search-assets
 * @desc Mencari asset yang sudah di-assign ke subculture berdasarkan nama file atau deskripsi
 * @access Admin only
 * @param {number} id - Subculture ID
 * @query {string} q - Search query (fileName, description)
 * @returns {Array} Matching assets
 * @usage Pencarian cepat asset dalam subculture tertentu
 */
router.get("/:id/search-assets", authenticateAdmin, subcultureController.searchAssetsInSubculture);

// GET /api/v1/admin/subcultures/:id/search-references
// Mencari referensi yang digunakan di subculture berdasarkan judul, deskripsi, atau penulis
// Query params: q (search query)
// Digunakan untuk: Pencarian cepat referensi dalam subculture tertentu
// NOTE: This endpoint is now combined with filter-references endpoint above
// router.get("/:id/search-references", authenticateAdmin, subcultureController.searchReferencesInSubculture);

// ============================================
// ORPHAN DATA DETECTION ENDPOINTS
// Endpoints for detecting unused assets and references
// ============================================

/**
 * @route GET /api/v1/admin/subcultures/assets/:assetId/usage
 * @desc Melihat di subculture mana saja asset tertentu digunakan
 * @access Admin only
 * @param {number} assetId - Asset ID
 * @returns {Array} List of subcultures using this asset
 * @usage Digunakan untuk mendeteksi apakah asset masih digunakan (orphan detection)
 */
router.get("/assets/:assetId/usage", authenticateAdmin, subcultureController.getAssetUsage);

/**
 * @route GET /api/v1/admin/subcultures/references/:referensiId/usage
 * @desc Melihat di subculture mana saja referensi tertentu digunakan
 * @access Admin only
 * @param {number} referensiId - Reference ID
 * @returns {Array} List of subcultures using this reference
 * @usage Digunakan untuk mendeteksi apakah referensi masih digunakan (orphan detection)
 */
router.get("/references/:referensiId/usage", authenticateAdmin, subcultureController.getReferenceUsage);

// ============================================
// LEGACY ASSET MANAGEMENT ENDPOINTS
// Existing endpoints for backward compatibility
// ============================================

/**
 * @route GET /api/v1/admin/subcultures/:id/assets
 * @desc Melihat semua asset yang terkait dengan subculture (legacy endpoint)
 * @access Admin only
 * @param {number} id - Subculture ID
 * @returns {Array} List of assets
 * @usage Legacy endpoint untuk kompatibilitas dengan sistem lama
 */

/**
 * @route POST /api/v1/admin/subcultures/:id/assets
 * @desc Menambahkan asset ke subculture
 * @access Admin only
 * @param {number} id - Subculture ID
 * @body {number} assetId - Asset ID (required)
 * @body {string} assetRole - Role asset (MAIN_IMAGE, GALLERY, AUDIO, VIDEO, MODEL_3D)
 * @returns {Object} Created asset assignment
 * @usage Digunakan untuk menghubungkan asset dengan subculture
 */
router
  .route('/:id/assets')
  .get(authenticateAdmin, subcultureController.getSubcultureAssets)
  .post(authenticateAdmin, subcultureController.addAssetToSubculture);

/**
 * @route DELETE /api/v1/admin/subcultures/:id/assets/:assetId
 * @desc Menghapus asset dari subculture
 * @access Admin only
 * @param {number} id - Subculture ID
 * @param {number} assetId - Asset ID
 * @query {string} assetRole - Role asset (required untuk identifikasi)
 * @returns {Object} Deletion confirmation
 * @usage Digunakan untuk menghapus hubungan antara asset dan subculture
 */
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
