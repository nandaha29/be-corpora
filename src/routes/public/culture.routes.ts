import { Router } from 'express';
import * as cultureController from '../../controllers/public/culture.controller.js';

const router = Router();

// ============================================
// PUBLIC CULTURE ENDPOINTS
// ============================================

/**
 * @route GET /api/public/cultures
 * @desc Get all published cultures with pagination
 * @access Public
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 * @returns {object} List of published cultures with pagination metadata
 * @note TIDAK DIGUNAKAN: Tidak ada pemanggilan di kode frontend
 */
router.get('/', cultureController.getAllCultures);

/**
 * @route GET /api/public/cultures/:culture_id
 * @desc Get detailed information about a specific culture
 * @access Public
 * @param {number} culture_id - Culture ID
 * @returns {object} Culture details including subcultures, domains, and lexicons
 * @note TIDAK DIGUNAKAN: Tidak ada pemanggilan di kode frontend
 */
router.get('/:culture_id', cultureController.getCultureDetail);

/**
 * @route GET /api/public/cultures/:culture_id/search
 * @desc Search for lexicons within a specific culture hierarchy
 * @access Public
 * @param {number} culture_id - Culture ID
 * @query {string} query - Search term for lexicons
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 10)
 * @returns {object} Search results with lexicons from the culture
 * @note TIDAK DIGUNAKAN: Tidak ada pemanggilan di kode frontend
 */
router.get('/:culture_id/search', cultureController.searchLeksikonsInCulture);

export default router;