import { Router } from 'express';
import * as landingPageController from '../../controllers/public/landingPage.controller.js';

const router = Router();

// ============================================
// PUBLIC LANDING PAGE ENDPOINTS
// ============================================

/**
 * @route GET /api/public/landing-page
 * @desc Get landing page data including featured content, statistics, and highlights
 * @access Public
 * @returns {object} Landing page data with cultures, subcultures, lexicons, and statistics
 */
router.get('/', landingPageController.getLandingPage);

/**
 * @route POST /api/public/landing-page/contact
 * @desc Submit contact form from landing page
 * @access Public
 * @body {string} name - Contact person's name
 * @body {string} email - Contact email address
 * @body {string} subject - Contact subject
 * @body {string} message - Contact message
 * @returns {object} Success confirmation
 */
router.post('/contact', landingPageController.submitContactForm);

export default router;