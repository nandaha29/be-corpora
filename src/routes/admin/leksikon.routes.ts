import { Router } from 'express';
import * as leksikonController from '../../controllers/admin/leksikon.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

router
  .route('/')
  .get(authenticateAdmin,leksikonController.getAllLeksikonsPaginated)
  .post(authenticateAdmin,leksikonController.createLeksikon);

router
  .route('/:id')
  .get(authenticateAdmin,leksikonController.getLeksikonById)
  .put(authenticateAdmin,leksikonController.updateLeksikon)
  .delete(authenticateAdmin,leksikonController.deleteLeksikon);

router
  .route('/:id/assets')
  .get(authenticateAdmin,leksikonController.getLeksikonAssets)
  .post(authenticateAdmin,leksikonController.addAssetToLeksikon);

router
  .route('/:id/assets/:assetId')
  .delete(authenticateAdmin,leksikonController.removeAssetFromLeksikon);

// Asset role management
router.put('/:id/assets/:assetId/role', authenticateAdmin, leksikonController.updateAssetRole);
router.get('/:id/assets/role/:assetRole', authenticateAdmin, leksikonController.getAssetsByRole);

router
  .route('/:id/references')
  .get(authenticateAdmin, leksikonController.getLeksikonReferences)
  .post(authenticateAdmin, leksikonController.addReferenceToLeksikon);

router
  .route('/:id/references/:referenceId')
  .delete(authenticateAdmin, leksikonController.removeReferenceFromLeksikon);

  // Asset role update
router.put('/:id/assets/:assetId', authenticateAdmin, leksikonController.updateAssetRole);

// Citation note update
router.put('/:id/references/:referenceId', authenticateAdmin, leksikonController.updateCitationNote);

// Admin Leksikon Management
// router.get("/", leksikonController.getAllLeksikonsPaginated);
router.get("/status", authenticateAdmin, leksikonController.getLeksikonsByStatus);
router.get("/domain-kodifikasi/:dk_id/leksikons", authenticateAdmin, leksikonController.getLeksikonsByDomain);
router.patch("/:id/status", authenticateAdmin, leksikonController.updateLeksikonStatus);


export default router;