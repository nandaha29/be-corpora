import { Router } from 'express';
import * as domainController from '../../controllers/public/domain.controller.js';

const router = Router();

// Get domain details
router.get('/:dk_id', domainController.getDomainDetail);

// Search leksikons within a specific domain
router.get('/:dk_id/search', domainController.searchLeksikonsInDomain);

export default router;