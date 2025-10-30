import { Router } from 'express';
import * as subcultureController from '../../controllers/public/subculture.controller.js';

const router = Router();

// Get all subcultures for gallery
router.get('/', subcultureController.getSubculturesGallery);

router.get('/:identifier', subcultureController.getSubcultureDetail);
router.get('/:identifier/search', subcultureController.searchLexicon);

export default router;