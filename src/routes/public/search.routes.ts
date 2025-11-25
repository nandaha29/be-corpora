import { Router } from 'express';
import * as searchController from '../../controllers/public/search.controller.js';
import * as referenceController from '../../controllers/public/reference.controller.js';
import * as contributorController from '../../controllers/public/contributor.controller.js';

const router = Router();

// ============================================
// PUBLIC SEARCH ENDPOINTS
// ============================================

/**
 * @route GET /api/public/search/global
 * @desc Global search formatted for frontend (peta-budaya page)
 * @access Public
 * @query {string} query - Search term
 * @query {string} category - Search category (subculture, lexicon, all)
 * @returns {object} Formatted search results with categories and highlights
 */
router.get('/global', searchController.globalSearchFormatted);

/**
 * @route GET /api/public/search
 * @desc Global search across all content types
 * @access Public
 * @query {string} query - Search term
 * @query {object} filters - Additional filters (optional)
 * @returns {object} Comprehensive search results across cultures, subcultures, lexicons, etc.
 */
router.get('/', searchController.globalSearch);

/**
 * @route GET /api/public/search/lexicon
 * @desc Search specifically in lexicon with relevance scoring
 * @access Public
 * @query {string} query - Search term for lexicons
 * @query {array} fields - Fields to search in (optional)
 * @query {number} limit - Maximum results (default: 20)
 * @returns {object} Lexicon search results with relevance scores
 */
router.get('/lexicon', searchController.searchLexicon);

/**
 * @route GET /api/public/search/advanced
 * @desc Advanced search with multiple parameters and filters
 * @access Public
 * @query {string} query - Main search term
 * @query {string} culture - Filter by culture
 * @query {string} subculture - Filter by subculture
 * @query {string} domain - Filter by domain
 * @query {string} region - Filter by region
 * @query {string} status - Filter by status
 * @query {number} page - Page number
 * @query {number} limit - Items per page
 * @returns {object} Advanced search results with applied filters
 */
router.get('/advanced', searchController.advancedSearch);

/**
 * @route GET /api/v1/search/references
 * @desc Search published references by title, author, description, or type
 * @access Public
 * @query {string} q - Search query (required)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @returns {object} Search results with pagination metadata
 */
router.get('/references', referenceController.searchPublishedReferences);

/**
 * @route GET /api/v1/search/coordinator
 * @desc Search published contributors (active coordinators) by name, institution, or expertise
 * @access Public
 * @query {string} q - Search query (required)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @returns {object} Search results with pagination metadata
 */
router.get('/coordinator', contributorController.searchPublishedContributors);

/**
 * @route GET /api/v1/search/culture
 * @desc Search published cultures by name, island, province, city, classification, or characteristics
 * @access Public
 * @query {string} q - Search query (required)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @returns {object} Search results with pagination metadata
 */
router.get('/culture', searchController.searchCultures);

export default router;