import { Router } from 'express';
import * as leksikonController from '@/controllers/admin/leksikon.controller.js';

const router = Router();

router
  .route('/')
  .get(leksikonController.getAllLeksikonsPaginated)
  .post(leksikonController.createLeksikon);

router
  .route('/:id')
  .get(leksikonController.getLeksikonById)
  .put(leksikonController.updateLeksikon)
  .delete(leksikonController.deleteLeksikon);

router
  .route('/:id/assets')
  .get(leksikonController.getLeksikonAssets)
  .post(leksikonController.addAssetToLeksikon);

router
  .route('/:id/assets/:assetId')
  .delete(leksikonController.removeAssetFromLeksikon);

router
  .route('/:id/references')
  .get(leksikonController.getLeksikonReferences)
  .post(leksikonController.addReferenceToLeksikon);

router
  .route('/:id/references/:referenceId')
  .delete(leksikonController.removeReferenceFromLeksikon);

  // Asset role update
router.put('/:id/assets/:assetId', leksikonController.updateAssetRole);

// Citation note update
router.put('/:id/references/:referenceId', leksikonController.updateCitationNote);

// Admin Leksikon Management
// router.get("/", leksikonController.getAllLeksikonsPaginated);
router.get("/status", leksikonController.getLeksikonsByStatus);
router.get("/domain-kodifikasi/:dk_id/leksikons", leksikonController.getLeksikonsByDomain);
router.patch("/:id/status", leksikonController.updateLeksikonStatus);


export default router;