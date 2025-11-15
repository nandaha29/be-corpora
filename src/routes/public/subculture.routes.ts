import { Router } from 'express';
import * as subcultureController from '../../controllers/public/subculture.controller.js';

const router = Router();

// ============================================
// PUBLIC SUBCULTURE ENDPOINTS
// ============================================

/**
 * @route GET /api/public/subcultures
 * @desc Get all subcultures for gallery display
 * @access Public
 * @query {string} searchQuery - Search term for subculture names (optional)
 * @query {string} category - Filter category (all, by_region, etc.) (optional)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @returns {object} Subculture gallery with assets, statistics, and pagination
 */
router.get('/', subcultureController.getSubculturesGallery);

/**
 * @route GET /api/public/subcultures/:identifier
 * @desc Get detailed information about a specific subculture
 * @access Public
 * @param {string} identifier - Subculture slug or ID
 * @query {string} searchQuery - Optional search within subculture content
 * @returns {object} Complete subculture details including domains, lexicons, and assets
 */
router.get('/:identifier', subcultureController.getSubcultureDetail);

/**
 * @route GET /api/public/subcultures/:identifier/lexicon
 * @desc Get lexicons belonging to a specific subculture
 * @access Public
 * @param {string} identifier - Subculture slug or ID
 * @query {string} searchQuery - Search within lexicons (optional)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @returns {object} Lexicons from the subculture with pagination
 */
router.get('/:identifier/lexicon', subcultureController.getSubcultureLexicons);

export default router;