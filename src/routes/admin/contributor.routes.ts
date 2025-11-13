import { Router } from 'express';
import * as contributorController from '../../controllers/admin/contributor.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

router.get('/search', authenticateAdmin,contributorController.searchContributors);
router.get('/', authenticateAdmin,contributorController.getContributors);
router.get('/:id', authenticateAdmin, contributorController.getContributorById);
router.post('/', authenticateAdmin,contributorController.createContributor);
router.put('/:id', authenticateAdmin,contributorController.updateContributor);
router.delete('/:id', authenticateAdmin,contributorController.deleteContributor);

router
  .route('/:id/assets')
  .get(authenticateAdmin, contributorController.getContributorAssets)
  .post(authenticateAdmin, contributorController.addAssetToContributor);

router
  .route('/:id/assets/:assetId')
  .delete(authenticateAdmin, contributorController.removeAssetFromContributor);

export default router;
