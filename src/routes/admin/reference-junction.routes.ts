import { Router } from "express";
import * as referenceJunctionController from "../../controllers/admin/reference-junction.controller.js";

const router = Router();

/**
 * REFERENCE JUNCTION ROUTES
 * Routes for managing reference assignments to different entities
 */

// ============================================
// LEXICON REFERENCE ROUTES
// ============================================

/**
 * @route POST /api/v1/admin/reference-junctions/lexicon/assign
 * @desc Assign a reference to a lexicon
 * @access Admin
 */
router.post("/lexicon/assign", referenceJunctionController.assignReferenceToLexicon);

/**
 * @route DELETE /api/v1/admin/reference-junctions/lexicon/:lexiconId/:referenceId
 * @desc Remove reference assignment from lexicon
 * @access Admin
 */
router.delete("/lexicon/:lexiconId/:referenceId", referenceJunctionController.removeReferenceFromLexicon);

/**
 * @route GET /api/v1/admin/reference-junctions/lexicon/:lexiconId
 * @desc Get all references assigned to a lexicon
 * @access Admin
 */
router.get("/lexicon/:lexiconId", referenceJunctionController.getReferencesByLexicon);

// ============================================
// SUBCULTURE REFERENCE ROUTES
// ============================================

/**
 * @route POST /api/v1/admin/reference-junctions/subculture/assign
 * @desc Assign a reference to a subculture
 * @access Admin
 */
router.post("/subculture/assign", referenceJunctionController.assignReferenceToSubculture);

/**
 * @route DELETE /api/v1/admin/reference-junctions/subculture/:subcultureId/:referenceId
 * @desc Remove reference assignment from subculture
 * @access Admin
 */
router.delete("/subculture/:subcultureId/:referenceId", referenceJunctionController.removeReferenceFromSubculture);

/**
 * @route GET /api/v1/admin/reference-junctions/subculture/:subcultureId
 * @desc Get all references assigned to a subculture
 * @access Admin
 */
router.get("/subculture/:subcultureId", referenceJunctionController.getReferencesBySubculture);

// ============================================
// CULTURE REFERENCE ROUTES
// ============================================

/**
 * @route POST /api/v1/admin/reference-junctions/culture/assign
 * @desc Assign a reference to a culture
 * @access Admin
 */
router.post("/culture/assign", referenceJunctionController.assignReferenceToCulture);

/**
 * @route DELETE /api/v1/admin/reference-junctions/culture/:cultureId/:referenceId
 * @desc Remove reference assignment from culture
 * @access Admin
 */
router.delete("/culture/:cultureId/:referenceId", referenceJunctionController.removeReferenceFromCulture);

/**
 * @route GET /api/v1/admin/reference-junctions/culture/:cultureId
 * @desc Get all references assigned to a culture
 * @access Admin
 */
router.get("/culture/:cultureId", referenceJunctionController.getReferencesByCulture);

// ============================================
// REFERENCE STATISTICS ROUTES
// ============================================

/**
 * @route GET /api/v1/admin/reference-junctions/stats/:referenceId
 * @desc Get usage statistics for a reference across all entities
 * @access Admin
 */
router.get("/stats/:referenceId", referenceJunctionController.getReferenceUsageStats);

export default router;