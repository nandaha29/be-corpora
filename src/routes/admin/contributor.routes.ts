import { Router } from 'express';
import * as contributorController from '../../controllers/admin/contributor.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// ============================================
// CONTRIBUTOR MANAGEMENT ENDPOINTS
// ============================================

/**
 * @route GET /api/admin/contributors/search
 * @desc Search contributors by name, institution, or expertise
 * @access Admin only
 * @query {string} q - Search query
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search', authenticateAdmin,contributorController.searchContributors);

/**
 * @route GET /api/admin/contributors
 * @desc Get all contributors with pagination
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/', authenticateAdmin,contributorController.getContributors);

/**
 * @route GET /api/admin/contributors/:id
 * @desc Get contributor by ID
 * @access Admin only
 * @param {number} id - Contributor ID
 */
router.get('/:id', authenticateAdmin, contributorController.getContributorById);

/**
 * @route POST /api/admin/contributors
 * @desc Create new contributor
 * @access Admin only
 * @body {string} namaContributor - Contributor name
 * @body {string} institusi - Institution
 * @body {string} email - Email address
 * @body {string} expertiseArea - Expertise area
 * @body {string} contactInfo - Contact information
 */
router.post('/', authenticateAdmin,contributorController.createContributor);

/**
 * @route PUT /api/admin/contributors/:id
 * @desc Update contributor by ID
 * @access Admin only
 * @param {number} id - Contributor ID
 * @body {string} namaContributor - Contributor name
 * @body {string} institusi - Institution
 * @body {string} email - Email address
 * @body {string} expertiseArea - Expertise area
 * @body {string} contactInfo - Contact information
 */
router.put('/:id', authenticateAdmin,contributorController.updateContributor);

/**
 * @route DELETE /api/admin/contributors/:id
 * @desc Delete contributor by ID
 * @access Admin only
 * @param {number} id - Contributor ID
 */
router.delete('/:id', authenticateAdmin,contributorController.deleteContributor);

// ============================================
// CONTRIBUTOR ASSET MANAGEMENT
// ============================================

/**
 * @route GET /api/admin/contributors/:id/assets
 * @desc Get all assets associated with a contributor
 * @access Admin only
 * @param {number} id - Contributor ID
 */
router
  .route('/:id/assets')
  .get(authenticateAdmin, contributorController.getContributorAssets)
  .post(authenticateAdmin, contributorController.addAssetToContributor);

/**
 * @route POST /api/admin/contributors/:id/assets
 * @desc Add asset to contributor (LOGO, FOTO_DIRI, SIGNATURE, CERTIFICATE)
 * @access Admin only
 * @param {number} id - Contributor ID
 * @body {number} assetId - Asset ID
 * @body {string} assetNote - Asset role (LOGO, FOTO_DIRI, SIGNATURE, CERTIFICATE)
 */

/**
 * @route DELETE /api/admin/contributors/:id/assets/:assetId
 * @desc Remove asset from contributor
 * @access Admin only
 * @param {number} id - Contributor ID
 * @param {number} assetId - Asset ID
 */
router
  .route('/:id/assets/:assetId')
  .delete(authenticateAdmin, contributorController.removeAssetFromContributor);

export default router;
