import { Router } from 'express';
import * as assetController from '../../controllers/admin/asset.controller.js';

const router = Router();

// ============================================
// PUBLIC ASSET ENDPOINTS
// ============================================

/**
 * @route GET /api/public/assets/:id/file
 * @desc Get public asset file (only if status = 'PUBLISHED')
 * @access Public (no authentication required)
 * @param {number} id - Asset ID
 */
router.get('/:id/file', assetController.getPublicAssetFile);

export default router;