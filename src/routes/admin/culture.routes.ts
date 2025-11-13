import { Router } from 'express';
import * as cultureController from '../../controllers/admin/culture.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// Route for getting all and creating new
router
  .route('/')
  .get(authenticateAdmin, cultureController.getAllCulturesPaginated)
  .post(authenticateAdmin, cultureController.createCulture);

// Route for getting, updating, and deleting by ID
router
  .route('/:id')
  .get(authenticateAdmin, cultureController.getCultureById)
  .put(authenticateAdmin, cultureController.updateCulture)
  .delete(authenticateAdmin, cultureController.deleteCulture);

  router.get("/cultures/:cultureId", authenticateAdmin, cultureController.getCultureWithAssets);

export default router;