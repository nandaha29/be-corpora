import { Router } from 'express';
import * as cultureController from '../../controllers/admin/culture.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// ============================================
// CULTURE MANAGEMENT ENDPOINTS
// ============================================

/**
 * @route GET /api/admin/cultures/search
 * @desc Search cultures by text query
 * @access Admin only
 * @query {string} q - Search query (searches in cultureName, originIsland, province, cityRegion, classification, characteristics)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search', authenticateAdmin, cultureController.searchCultures);

/**
 * @route GET /api/admin/cultures/filter
 * @desc Filter cultures by various criteria
 * @access Admin only
 * @query {string} conservationStatus - Filter by conservation status (MAINTAINED, TREATED, CRITICAL, ARCHIVED)
 * @query {string} status - Filter by publish status (DRAFT, PUBLISHED, ARCHIVED)
 * @query {string} originIsland - Filter by origin island
 * @query {string} province - Filter by province
 * @query {string} cityRegion - Filter by city/region
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/filter', authenticateAdmin, cultureController.filterCultures);

/**
 * @route GET /api/admin/cultures
 * @desc Get all cultures with pagination
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router
  .route('/')
  .get(authenticateAdmin, cultureController.getAllCulturesPaginated)
  .post(authenticateAdmin, cultureController.createCulture);

/**
 * @route POST /api/admin/cultures
 * @desc Create new culture
 * @access Admin only
 * @body {string} cultureName - Culture name
 * @body {string} originIsland - Island of origin
 * @body {string} province - Province
 * @body {string} cityRegion - City/Region
 * @body {string} classification - Classification (optional)
 * @body {string} characteristics - Characteristics (optional)
 * @body {string} conservationStatus - Conservation status (MAINTAINED, TREATED, CRITICAL, ARCHIVED)
 * @body {number} latitude - Latitude coordinate (optional)
 * @body {number} longitude - Longitude coordinate (optional)
 * @body {string} status - Status (DRAFT, PUBLISHED, ARCHIVED)
 */

/**
 * @route GET /api/admin/cultures/:id
 * @desc Get culture by ID
 * @access Admin only
 * @param {number} id - Culture ID
 */
router
  .route('/:id')
  .get(authenticateAdmin, cultureController.getCultureById)
  .put(authenticateAdmin, cultureController.updateCulture)
  .delete(authenticateAdmin, cultureController.deleteCulture);

/**
 * @route PUT /api/admin/cultures/:id
 * @desc Update culture by ID
 * @access Admin only
 * @param {number} id - Culture ID
 * @body {string} cultureName - Culture name
 * @body {string} originIsland - Island of origin
 * @body {string} province - Province
 * @body {string} cityRegion - City/Region
 * @body {string} classification - Classification (optional)
 * @body {string} characteristics - Characteristics (optional)
 * @body {string} conservationStatus - Conservation status
 * @body {number} latitude - Latitude coordinate (optional)
 * @body {number} longitude - Longitude coordinate (optional)
 * @body {string} status - Status
 */

/**
 * @route DELETE /api/admin/cultures/:id
 * @desc Delete culture by ID
 * @access Admin only
 * @param {number} id - Culture ID
 */

/**
 * @route GET /api/admin/cultures/cultures/:cultureId
 * @desc Get culture with its associated assets
 * @access Admin only
 * @param {number} cultureId - Culture ID
 */
router.get("/cultures/:cultureId", authenticateAdmin, cultureController.getCultureWithAssets);

/**
 * @route POST /api/admin/cultures/:id/references
 * @desc Assign reference directly to CultureReference (for about page)
 * @access Admin only
 * @param {number} id - Culture ID
 * @body {number} referenceId - Reference ID (required)
 * @body {string} citationNote - Citation note type (optional)
 * @body {number} displayOrder - Display order (optional, default: 0)
 */
router.post("/:id/references", authenticateAdmin, cultureController.addReferenceToCulture);

/**
 * @route GET /api/admin/cultures/:id/references
 * @desc Get all references assigned directly to culture
 * @access Admin only
 * @param {number} id - Culture ID
 */
router.get("/:id/references", authenticateAdmin, cultureController.getCultureReferences);

/**
 * @route DELETE /api/admin/cultures/:id/references/:referenceId
 * @desc Remove reference from CultureReference
 * @access Admin only
 * @param {number} id - Culture ID
 * @param {number} referenceId - Reference ID
 */
router.delete("/:id/references/:referenceId", authenticateAdmin, cultureController.removeReferenceFromCulture);

export default router;