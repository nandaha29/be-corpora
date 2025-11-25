import { Router } from 'express';
import * as referenceController from '../../controllers/public/reference.controller.js';

const router = Router();

// ============================================
// PUBLIC REFERENCE ENDPOINTS
// ============================================

/**
 * @route GET /api/public/references
 * @desc Get all published references
 * @access Public
 * @returns {array} List of all published references (jurnal, buku, artikel, website, laporan)
 */
router.get('/', referenceController.getPublishedReferences);

/**
 * @route GET /api/public/references/:reference_id
 * @desc Get detailed information about a specific published reference
 * @access Public
 * @param {number} reference_id - Reference ID
 * @returns {object} Reference details including title, author, type, and description
 */
router.get('/:reference_id', referenceController.getPublishedReferenceById);

export default router;