import { Router } from 'express';
import * as lexiconController from '../../controllers/public/lexicon.controller.js';

const router = Router();

// ============================================
// PUBLIC LEXICON ENDPOINTS
// ============================================

/**
 * @route GET /api/public/lexicons
 * @desc Get all published lexicons with filtering and search capabilities
 * @access Public
 * @query {string} regionFilter - Filter by region (all, pulau1, pulau2, etc.)
 * @query {string} searchQuery - Search term for lexicon terms
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @returns {object} List of lexicons with pagination metadata
 * @note TIDAK DIGUNAKAN: Tidak ada pemanggilan untuk daftar semua leksikon tanpa filter
 */
router.get('/', lexiconController.getAllLexicons);

/**
 * @route GET /api/public/lexicons/:identifier
 * @desc Get detailed information about a specific lexicon by term or ID
 * @access Public
 * @param {string|number} identifier - Lexicon term (slug) or ID
 * @returns {object} Complete lexicon details including assets, references, and related data
 * @note DIGUNAKAN: Frontend menggunakan untuk detail leksikon
 */
router.get('/:identifier', lexiconController.getLexiconDetail);

export default router;