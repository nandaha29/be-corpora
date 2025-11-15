import { Router } from 'express';
import * as domainController from '../../controllers/public/domain.controller.js';

const router = Router();

// ============================================
// PUBLIC DOMAIN ENDPOINTS
// ============================================

/**
 * @route GET /api/public/domains/:dk_id
 * @desc Get detailed information about a specific domain kodifikasi
 * @access Public
 * @param {number} dk_id - Domain Kodifikasi ID
 * @returns {object} Domain details including related subculture and lexicons
 */
router.get('/:dk_id', domainController.getDomainDetail);

/**
 * @route GET /api/public/domains/:dk_id/search
 * @desc Search for lexicons within a specific domain
 * @access Public
 * @param {number} dk_id - Domain Kodifikasi ID
 * @query {string} query - Search term for lexicons
 * @returns {object} Search results with lexicons from the domain
 */
router.get('/:dk_id/search', domainController.searchLeksikonsInDomain);

export default router;