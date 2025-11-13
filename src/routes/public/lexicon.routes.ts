import { Router } from 'express';
import * as lexiconController from '../../controllers/public/lexicon.controller.js';

const router = Router();

// Get all lexicons with filtering and search
router.get('/', lexiconController.getAllLexicons);

// Get lexicon detail by identifier (term or ID)
router.get('/:identifier', lexiconController.getLexiconDetail);

export default router;