import { Router } from 'express';
import * as aboutController from '../../controllers/public/about.controller.js';

const router = Router();

// ============================================
// PUBLIC ABOUT PAGE ENDPOINTS
// ============================================

/**
 * @route GET /api/public/about
 * @desc Get about page data including stats, team, references, and project information
 * @access Public
 * @returns {object} About page data with visiMisiSection, teamScientis, collaborationAssets, academicReferences, projectSteps, projectProcess, projectRoadmap, platformFeatures, youtubeVideos, galleryPhotos
 */
router.get('/', aboutController.getAboutPage);

export default router;

