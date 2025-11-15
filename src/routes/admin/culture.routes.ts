import { Router } from 'express';
import * as cultureController from '../../controllers/admin/culture.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// ============================================
// CULTURE MANAGEMENT ENDPOINTS
// ============================================

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
 * @body {string} namaBudaya - Culture name
 * @body {string} pulauAsal - Island of origin
 * @body {string} provinsi - Province
 * @body {string} kotaDaerah - City/Region
 * @body {string} klasifikasi - Classification (optional)
 * @body {string} karakteristik - Characteristics (optional)
 * @body {string} statusKonservasi - Conservation status (MAINTAINED, TREATED, CRITICAL, ARCHIVED)
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
 * @body {string} namaBudaya - Culture name
 * @body {string} pulauAsal - Island of origin
 * @body {string} provinsi - Province
 * @body {string} kotaDaerah - City/Region
 * @body {string} klasifikasi - Classification (optional)
 * @body {string} karakteristik - Characteristics (optional)
 * @body {string} statusKonservasi - Conservation status
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

export default router;