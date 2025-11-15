import { Router } from 'express';
import * as regionController from '../../controllers/public/region.controller.js';

const router = Router();

// ============================================
// PUBLIC REGION ENDPOINTS
// ============================================

/**
 * @route GET /api/public/regions/:regionId
 * @desc Get region data for map popup display
 * @access Public
 * @param {string} regionId - Region identifier (province name or region code)
 * @returns {object} Region data including culture statistics, subcultures, and lexicons for map visualization
 */
router.get('/:regionId', regionController.getRegionData);

export default router;