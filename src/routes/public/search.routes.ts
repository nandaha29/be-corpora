import { Router } from 'express';
import * as searchController from '../../controllers/public/search.controller.js';

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

export default router;