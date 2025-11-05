import { Router } from 'express';
import * as searchController from '../../controllers/public/search.controller.js';

const router = Router();

// Global search formatted for frontend (peta-budaya page)
router.get('/global', searchController.globalSearchFormatted);

// Global search across all content
router.get('/', searchController.globalSearch);

// Search specifically in lexicon with relevance scoring
router.get('/lexicon', searchController.searchLexicon);

// Advanced search with multiple parameters
router.get('/advanced', searchController.advancedSearch);

export default router;