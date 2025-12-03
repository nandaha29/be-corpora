import { Router } from 'express';
import * as cultureController from '../../controllers/public/culture.controller.js';

const router = Router();

// ============================================
// PUBLIC ABOUT PAGE ENDPOINTS
// ============================================

/**
 * @route GET /api/public/about
 * @desc Get about page data (culture with references)
 * @access Public
 * @query {string} slug - Optional culture slug to get specific culture (default: first published culture)
 * @returns {object} Culture details with references for about page
 * @note DIGUNAKAN: Frontend menggunakan untuk halaman about yang menampilkan informasi budaya dengan referensi
 */
router.get('/', cultureController.getAboutPage);

export default router;

