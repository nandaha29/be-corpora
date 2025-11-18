import { Router } from 'express';
import * as leksikonController from '../../controllers/admin/leksikon.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// ============================================
// � SEARCH & FILTERING
// ============================================

/**
 * @route GET /api/admin/leksikons/status
 * @desc Get leksikons filtered by status
 * @access Admin only
 * @query {string} status - Status filter (DRAFT, PUBLISHED, ARCHIVED)
 */
router.get("/status", authenticateAdmin, leksikonController.getLeksikonsByStatus);

/**
 * @route GET /api/admin/leksikons/domain-kodifikasi/:dk_id/leksikons
 * @desc Get leksikons filtered by domain kodifikasi
 * @access Admin only
 * @param {number} dk_id - Domain Kodifikasi ID
 */
router.get("/domain-kodifikasi/:dk_id/leksikons", authenticateAdmin, leksikonController.getLeksikonsByDomain);

/**
 * @route GET /api/admin/leksikons/filter
 * @desc Filter leksikons by status and/or domain kodifikasi with pagination
 * @access Admin only
 * @query {string} status - Status filter (DRAFT, PUBLISHED, ARCHIVED) - optional
 * @query {number} domainId - Domain Kodifikasi ID - optional
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/filter', authenticateAdmin, leksikonController.filterLeksikons);

/**
 * @route GET /api/admin/leksikons/search/assets
 * @desc Search assets that are used in any leksikon
 * @access Admin only
 * @query {string} q - Search query (namaFile, tipe, penjelasan)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search/assets', authenticateAdmin, leksikonController.searchAssetsInLeksikons);

/**
 * @route GET /api/admin/leksikons/search/references
 * @desc Search references that are used in any leksikon
 * @access Admin only
 * @query {string} q - Search query (judul, penulis, tipeReferensi)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search/references', authenticateAdmin, leksikonController.searchReferencesInLeksikons);

// ============================================
// 📊 USAGE TRACKING
// ============================================

/**
 * @route GET /api/admin/leksikons/assets/assigned
 * @desc Get all assets that are currently assigned/linked to any leksikon
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/assets/assigned', authenticateAdmin, leksikonController.getAssignedAssets);

/**
 * @route GET /api/admin/leksikons/assets/:assetId/usages
 * @desc Get all leksikons that use a specific asset
 * @access Admin only
 * @param {number} assetId - Asset ID
 */
router.get('/assets/:assetId/usages', authenticateAdmin, leksikonController.getAssetUsage);

/**
 * @route GET /api/admin/leksikons/references/assigned
 * @desc Get all references that are currently assigned/linked to any leksikon
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/references/assigned', authenticateAdmin, leksikonController.getAssignedReferences);

/**
 * @route GET /api/admin/leksikons/references/:referenceId/usages
 * @desc Get all leksikons that use a specific reference
 * @access Admin only
 * @param {number} referenceId - Reference ID
 */
router.get('/references/:referenceId/usages', authenticateAdmin, leksikonController.getReferenceUsage);

// ============================================
// �📚 BASIC CRUD OPERATIONS
// ============================================

/**
 * @route GET /api/admin/leksikons
 * @desc Get all leksikons with pagination
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router
  .route('/')
  .get(authenticateAdmin, leksikonController.getAllLeksikonsPaginated)
  .post(authenticateAdmin, leksikonController.createLeksikon);

/**
 * @route GET /api/admin/leksikons/:id
 * @desc Get leksikon by ID with full details
 * @access Admin only
 * @param {number} id - Leksikon ID
 */
router
  .route('/:id')
  .get(authenticateAdmin, leksikonController.getLeksikonById)
  .put(authenticateAdmin, leksikonController.updateLeksikon)
  .delete(authenticateAdmin, leksikonController.deleteLeksikon);

// ============================================
// 🎨 ASSET MANAGEMENT
// ============================================

/**
 * @route GET /api/admin/leksikons/:id/assets
 * @desc Get all assets linked to a specific leksikon
 * @access Admin only
 * @param {number} id - Leksikon ID
 */
router
  .route('/:id/assets')
  .get(authenticateAdmin, leksikonController.getLeksikonAssets)
  .post(authenticateAdmin, leksikonController.addAssetToLeksikon);

/**
 * @route DELETE /api/admin/leksikons/:id/assets/:assetId
 * @desc Remove asset from leksikon
 * @access Admin only
 * @param {number} id - Leksikon ID
 * @param {number} assetId - Asset ID
 */
router
  .route('/:id/assets/:assetId')
  .delete(authenticateAdmin, leksikonController.removeAssetFromLeksikon);

// Asset role management
router.put('/:id/assets/:assetId/role', authenticateAdmin, leksikonController.updateAssetRole);
router.get('/:id/assets/role/:assetRole', authenticateAdmin, leksikonController.getAssetsByRole);

// ============================================
// 📖 REFERENCE MANAGEMENT
// ============================================

/**
 * @route GET /api/admin/leksikons/:id/references
 * @desc Get all references linked to a specific leksikon
 * @access Admin only
 * @param {number} id - Leksikon ID
 */
router
  .route('/:id/references')
  .get(authenticateAdmin, leksikonController.getLeksikonReferences)
  .post(authenticateAdmin, leksikonController.addReferenceToLeksikon);

/**
 * @route DELETE /api/admin/leksikons/:id/references/:referenceId
 * @desc Remove reference from leksikon
 * @access Admin only
 * @param {number} id - Leksikon ID
 * @param {number} referenceId - Reference ID
 */
router
  .route('/:id/references/:referenceId')
  .delete(authenticateAdmin, leksikonController.removeReferenceFromLeksikon);

// Asset role update
router.put('/:id/assets/:assetId', authenticateAdmin, leksikonController.updateAssetRole);

// Citation note update
router.put('/:id/references/:referenceId', authenticateAdmin, leksikonController.updateCitationNote);

// ============================================
// 🔍 SEARCH & FILTERING
// ============================================

/**
 * @route GET /api/admin/leksikons/status
 * @desc Get leksikons filtered by status
 * @access Admin only
 * @query {string} status - Status filter (DRAFT, PUBLISHED, ARCHIVED)
 */
router.get("/status", authenticateAdmin, leksikonController.getLeksikonsByStatus);

/**
 * @route GET /api/admin/leksikons/domain-kodifikasi/:dk_id/leksikons
 * @desc Get leksikons filtered by domain kodifikasi
 * @access Admin only
 * @param {number} dk_id - Domain Kodifikasi ID
 */
router.get("/domain-kodifikasi/:dk_id/leksikons", authenticateAdmin, leksikonController.getLeksikonsByDomain);

/**
 * @route GET /api/admin/leksikons/search/assets
 * @desc Search assets that are used in any leksikon
 * @access Admin only
 * @query {string} q - Search query (namaFile, tipe, penjelasan)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search/assets', authenticateAdmin, leksikonController.searchAssetsInLeksikons);

/**
 * @route GET /api/admin/leksikons/search/references
 * @desc Search references that are used in any leksikon
 * @access Admin only
 * @query {string} q - Search query (judul, penulis, tipeReferensi)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search/references', authenticateAdmin, leksikonController.searchReferencesInLeksikons);

// ============================================
// 📊 USAGE TRACKING
// ============================================

/**
 * @route GET /api/admin/leksikons/assets/assigned
 * @desc Get all assets that are currently assigned/linked to any leksikon
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/assets/assigned', authenticateAdmin, leksikonController.getAssignedAssets);

/**
 * @route GET /api/admin/leksikons/assets/:assetId/usages
 * @desc Get all leksikons that use a specific asset
 * @access Admin only
 * @param {number} assetId - Asset ID
 */
router.get('/assets/:assetId/usages', authenticateAdmin, leksikonController.getAssetUsage);

/**
 * @route GET /api/admin/leksikons/references/assigned
 * @desc Get all references that are currently assigned/linked to any leksikon
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/references/assigned', authenticateAdmin, leksikonController.getAssignedReferences);

/**
 * @route GET /api/admin/leksikons/references/:referenceId/usages
 * @desc Get all leksikons that use a specific reference
 * @access Admin only
 * @param {number} referenceId - Reference ID
 */
router.get('/references/:referenceId/usages', authenticateAdmin, leksikonController.getReferenceUsage);

/**
 * @route GET /api/admin/leksikons/filter/assets
 * @desc Filter assets assigned to lexicons by Type, Status, Created At
 * @access Admin only
 * @query {string} tipe - Asset type filter (FOTO, AUDIO, VIDEO, MODEL_3D) - optional
 * @query {string} status - Asset status filter (ACTIVE, PROCESSING, ARCHIVED, CORRUPTED) - optional
 * @query {string} createdAt - Created date filter (ISO date string) - optional
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/filter/assets', authenticateAdmin, leksikonController.filterLeksikonAssets);

/**
 * @route GET /api/admin/leksikons/filter/references
 * @desc Filter references assigned to lexicons by Type, Year, Status
 * @access Admin only
 * @query {string} tipeReferensi - Reference type filter (JURNAL, BUKU, ARTIKEL, WEBSITE, LAPORAN) - optional
 * @query {string} tahunTerbit - Publication year filter - optional
 * @query {string} status - Reference status filter (DRAFT, PUBLISHED, ARCHIVED) - optional
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/filter/references', authenticateAdmin, leksikonController.filterLeksikonReferences);

// ============================================
// ⚙️ ADMIN MANAGEMENT
// ============================================

/**
 * @route PATCH /api/admin/leksikons/:id/status
 * @desc Update leksikon status
 * @access Admin only
 * @param {number} id - Leksikon ID
 * @body {string} status - New status (DRAFT, PUBLISHED, ARCHIVED)
 */
router.patch("/:id/status", authenticateAdmin, leksikonController.updateLeksikonStatus);

export default router;
