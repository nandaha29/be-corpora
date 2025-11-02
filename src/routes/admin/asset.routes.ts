import { Router } from 'express';
import multer from 'multer';
import * as assetController from '../../controllers/admin/asset.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory for upload to blob

// Admin
router.get('/', authenticateAdmin, assetController.getAllAssetsPaginated);
router.get('/search', authenticateAdmin, assetController.searchAssets);
router.get('/:id', authenticateAdmin, assetController.getAssetById);
router.post('/upload', authenticateAdmin, upload.single('file'), assetController.createAsset);
router.put('/:id', authenticateAdmin, upload.single('file'), assetController.updateAsset);
router.delete('/:id', authenticateAdmin, assetController.deleteAsset);
router.post('/bulk-upload', authenticateAdmin, upload.array('files'), assetController.bulkUploadAssets);


// Public SCHEMA BELUM ADA STATUS PUBLIC APA BELUM
// router.get('/public/assets/:id/file', assetController.getPublicAssetFile);

export default router;
