import { Router } from 'express';
import * as cultureController from '../../controllers/public/culture.controller.js';

const router = Router();

// Get culture details
router.get('/:culture_id', cultureController.getCultureDetail);

// Search leksikons within a culture hierarchy
router.get('/:culture_id/search', cultureController.searchLeksikonsInCulture);

export default router;