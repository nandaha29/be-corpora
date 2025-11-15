import { Router } from 'express';
import * as referenceController from '../../controllers/public/reference.controller.js';

const router = Router();

// Get all published references
router.get('/', referenceController.getPublishedReferences);

// Get published reference by ID
router.get('/:referensi_id', referenceController.getPublishedReferenceById);

export default router;