import { Router } from 'express';
import * as domainController from '../../controllers/admin/domainKodifikasi.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// Route for getting all and creating new domains
router
  .route('/')
  .get(authenticateAdmin, domainController.getDomains)
  .post(authenticateAdmin, domainController.createDomain);

// Route for getting, updating, and deleting by ID
router
  .route('/:id')
  .get(authenticateAdmin, domainController.getDomainById)
  .put(authenticateAdmin, domainController.updateDomain)
  .delete(authenticateAdmin, domainController.deleteDomain);

export default router;