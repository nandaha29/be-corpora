import { Router } from 'express';
import * as contributorController from '../../controllers/public/contributor.controller.js';

const router = Router();

// ============================================
// PUBLIC CONTRIBUTOR ENDPOINTS
// ============================================

/**
 * @route GET /api/public/contributors
 * @desc Get all published contributors (active coordinators)
 * @access Public
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @returns {object} List of active coordinators with basic info
 */
router.get('/', contributorController.getPublishedContributors);

/**
 * @route GET /api/public/contributors/:contributor_id
 * @desc Get detailed information about a specific published contributor
 * @access Public
 * @param {number} contributor_id - Contributor ID
 * @returns {object} Contributor details including assets
 */
router.get('/:contributor_id', contributorController.getPublishedContributorById);

export default router;