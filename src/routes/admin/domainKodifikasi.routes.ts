import { Router } from 'express';
import * as domainController from '../../controllers/admin/domainKodifikasi.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// ============================================
// DOMAIN KODIFIKASI MANAGEMENT ENDPOINTS
// ============================================

/**
 * @route GET /api/admin/domain-kodifikasi
 * @desc Get all domain kodifikasi
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router
  .route('/')
  .get(authenticateAdmin, domainController.getDomains)
  .post(authenticateAdmin, domainController.createDomain);

/**
 * @route POST /api/admin/domain-kodifikasi
 * @desc Create new domain kodifikasi
 * @access Admin only
 * @body {string} kode - Domain code
 * @body {string} namaDomain - Domain name
 * @body {string} penjelasan - Description
 * @body {number} subcultureId - Subculture ID
 * @body {string} status - Status (DRAFT, PUBLISHED, ARCHIVED)
 */

router.get('/filter', authenticateAdmin, domainController.filterDomainKodifikasis);

/**
 * @route GET /api/admin/domain-kodifikasi/filter
 * @desc Filter domain kodifikasi by kode and/or status with pagination
 * @access Admin only
 * @query {string} kode - Kode filter (partial match, case insensitive) - optional
 * @query {string} status - Status filter (DRAFT, PUBLISHED, ARCHIVED) - optional
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */

router.get('/search', authenticateAdmin, domainController.searchDomainKodifikasis);

/**
 * @route GET /api/admin/domain-kodifikasi/search
 * @desc Search domain kodifikasi by query across kode, namaDomain, and penjelasan
 * @access Admin only
 * @query {string} q - Search query (required)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */

/**
 * @route GET /api/admin/domain-kodifikasi/:id
 * @desc Get domain kodifikasi by ID
 * @access Admin only
 * @param {number} id - Domain Kodifikasi ID
 */
router.get('/:id', authenticateAdmin, domainController.getDomainById);
router.put('/:id', authenticateAdmin, domainController.updateDomain);
router.delete('/:id', authenticateAdmin, domainController.deleteDomain);

/**
 * @route PUT /api/admin/domain-kodifikasi/:id
 * @desc Update domain kodifikasi by ID
 * @access Admin only
 * @param {number} id - Domain Kodifikasi ID
 * @body {string} kode - Domain code
 * @body {string} namaDomain - Domain name
 * @body {string} penjelasan - Description
 * @body {number} subcultureId - Subculture ID
 * @body {string} status - Status
 */

/**
 * @route DELETE /api/admin/domain-kodifikasi/:id
 * @desc Delete domain kodifikasi by ID
 * @access Admin only
 * @param {number} id - Domain Kodifikasi ID
 */

export default router;