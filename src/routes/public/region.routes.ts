import { Router } from 'express';
import * as regionController from '../../controllers/public/region.controller.js';

const router = Router();

// GET /api/v1/public/regions/:regionId - Get region data for map popup
router.get('/:regionId', regionController.getRegionData);

export default router;