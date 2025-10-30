import { Router } from 'express';
import * as lexiconController from '../../controllers/public/lexicon.controller.js';

const router = Router();

// Get all lexicons with filtering and search
router.get('/', lexiconController.getAllLexicons);

export default router;