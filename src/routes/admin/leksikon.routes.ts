import { Router } from 'express';
import * as leksikonController from '../../controllers/admin/leksikon.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// ============================================
// LEKSIKON (LEXICONS) MANAGEMENT ROUTES
// Main endpoints for managing lexicon entries
// 
// File: src/routes/admin/leksikon.routes.ts
// Controller: src/controllers/admin/leksikon.controller.ts
// Service: src/services/admin/leksikon.service.ts
// 
// Features:
// - CRUD operations for lexicons
// - Asset management (GALLERY, PRONUNCIATION, VIDEO_DEMO, MODEL_3D)
// - Reference management with citation notes
// - Status management (DRAFT, PUBLISHED, ARCHIVED)
// - Bulk import from CSV
// - Search and filter functionality
// ============================================

// ============================================
// 🔍 SEARCH & FILTERING (Must be before /:id routes)
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
 * @query {string} q - Search query (fileName, fileType, description)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search/assets', authenticateAdmin, leksikonController.searchAssetsInLeksikons);

/**
 * @route GET /api/admin/leksikons/search/references
 * @desc Search references that are used in any leksikon
 * @access Admin only
 * @query {string} q - Search query (title, authors, referenceType)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search/references', authenticateAdmin, leksikonController.searchReferencesInLeksikons);

/**
 * @route GET /api/admin/leksikons/filter/assets
 * @desc Filter assets assigned to lexicons by Type, Status, Created At
 * @access Admin only
 * @query {string} fileType - Asset type filter (PHOTO, AUDIO, VIDEO, MODEL_3D) - optional
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
 * @query {string} referenceType - Reference type filter (JOURNAL, BOOK, ARTICLE, WEBSITE, REPORT) - optional
 * @query {string} publicationYear - Publication year filter - optional
 * @query {string} status - Reference status filter (DRAFT, PUBLISHED, ARCHIVED) - optional
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/filter/references', authenticateAdmin, leksikonController.filterLeksikonReferences);

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
 * @route POST /api/admin/leksikons/import
 * @desc Bulk import leksikons from CSV file
 * @access Admin only
 * @body {file} file - CSV file containing leksikon data
 */
router.post("/import", authenticateAdmin, leksikonController.bulkImportLeksikons);

// ============================================
// 📚 BASIC CRUD OPERATIONS
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

// ============================================
// 🆔 SINGLE LEKSIKON OPERATIONS (Must be after specific routes)
// ============================================

/**
 * @route GET /api/admin/leksikons/:id
 * @route PUT /api/admin/leksikons/:id
 * @route DELETE /api/admin/leksikons/:id
 * @desc Get/Update/Delete a specific leksikon by ID
 * @access Admin only
 * @param {number} id - Leksikon ID
 */
router
  .route('/:id')
  .get(authenticateAdmin, leksikonController.getLeksikonById)
  .put(authenticateAdmin, leksikonController.updateLeksikon)
  .delete(authenticateAdmin, leksikonController.deleteLeksikon);

/**
 * @route PATCH /api/admin/leksikons/:id/status
 * @desc Update leksikon status
 * @access Admin only
 * @param {number} id - Leksikon ID
 * @body {string} status - New status (DRAFT, PUBLISHED, ARCHIVED)
 */
router.patch("/:id/status", authenticateAdmin, leksikonController.updateLeksikonStatus);

// ============================================
// 🎨 ASSET MANAGEMENT (under /:id)
// ============================================

/**
 * @route GET /api/admin/leksikons/:id/assets
 * @route POST /api/admin/leksikons/:id/assets
 * @desc Get all assets linked to a specific leksikon / Add asset to leksikon
 * @access Admin only
 * @param {number} id - Leksikon ID
 */
router
  .route('/:id/assets')
  .get(authenticateAdmin, leksikonController.getLeksikonAssets)
  .post(authenticateAdmin, leksikonController.addAssetToLeksikon);

/**
 * @route PUT /api/admin/leksikons/:id/assets/:assetId/role
 * @desc Update asset role in leksikon
 * @access Admin only
 * @param {number} id - Leksikon ID
 * @param {number} assetId - Asset ID
 */
router.put('/:id/assets/:assetId/role', authenticateAdmin, leksikonController.updateAssetRole);

/**
 * @route GET /api/admin/leksikons/:id/assets/role/:assetRole
 * @desc Get assets by role in leksikon
 * @access Admin only
 * @param {number} id - Leksikon ID
 * @param {string} assetRole - Asset role (GALLERY, PRONUNCIATION, VIDEO_DEMO, MODEL_3D)
 */
router.get('/:id/assets/role/:assetRole', authenticateAdmin, leksikonController.getAssetsByRole);

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

// ============================================
// 📖 REFERENCE MANAGEMENT (under /:id)
// ============================================

/**
 * @route GET /api/admin/leksikons/:id/references
 * @route POST /api/admin/leksikons/:id/references
 * @desc Get all references linked to a specific leksikon / Add reference to leksikon
 * @access Admin only
 * @param {number} id - Leksikon ID
 */
router
  .route('/:id/references')
  .get(authenticateAdmin, leksikonController.getLeksikonReferences)
  .post(authenticateAdmin, leksikonController.addReferenceToLeksikon);

/**
 * @route PUT /api/admin/leksikons/:id/references/:referenceId
 * @desc Update reference role in leksikon
 * @access Admin only
 * @param {number} id - Leksikon ID
 * @param {number} referenceId - Reference ID
 */
router.put('/:id/references/:referenceId', authenticateAdmin, leksikonController.updateReferenceRole);

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

export default router;
