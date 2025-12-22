import { Router } from "express";
import * as referenceJunctionController from "../../controllers/admin/reference-junction.controller.js";
import { authenticateAdmin } from "../../middleware/auth.middleware.js";

const router = Router();

// ============================================
// REFERENCE JUNCTION ROUTES
// Routes for managing reference assignments to different entities
// (Lexicon, Subculture, Culture)
// 
// File: src/routes/admin/reference-junction.routes.ts
// Controller: src/controllers/admin/reference-junction.controller.ts
// Service: src/services/admin/reference-junction.service.ts
// ============================================

// ============================================
// LEXICON REFERENCE ROUTES
// ============================================

/**
 * @route POST /api/v1/admin/reference-junctions/lexicon/assign
 * @desc Assign a reference to a lexicon
 * @access Admin only
 * @body {number} lexiconId - ID leksikon
 * @body {number} referenceId - ID referensi
 * @body {string} citationNote - Catatan sitasi (optional)
 * @body {string} referenceRole - Role referensi (PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING)
 * @usage Digunakan untuk menghubungkan referensi dengan leksikon tertentu
 */
router.post("/lexicon/assign", authenticateAdmin, referenceJunctionController.assignReferenceToLexicon);

/**
 * @route DELETE /api/v1/admin/reference-junctions/lexicon/:lexiconId/:referenceId
 * @desc Remove reference assignment from lexicon
 * @access Admin only
 * @param {number} lexiconId - ID leksikon
 * @param {number} referenceId - ID referensi
 * @usage Digunakan untuk menghapus hubungan referensi dari leksikon
 */
router.delete("/lexicon/:lexiconId/:referenceId", authenticateAdmin, referenceJunctionController.removeReferenceFromLexicon);

/**
 * @route GET /api/v1/admin/reference-junctions/lexicon/:lexiconId
 * @desc Get all references assigned to a lexicon
 * @access Admin only
 * @param {number} lexiconId - ID leksikon
 * @returns {Array} List of references with citation notes and roles
 * @usage Digunakan untuk menampilkan daftar referensi yang terkait dengan leksikon
 */
router.get("/lexicon/:lexiconId", authenticateAdmin, referenceJunctionController.getReferencesByLexicon);

// ============================================
// SUBCULTURE REFERENCE ROUTES
// ============================================

/**
 * @route POST /api/v1/admin/reference-junctions/subculture/assign
 * @desc Assign a reference to a subculture
 * @access Admin only
 * @body {number} subcultureId - ID subculture
 * @body {number} referenceId - ID referensi
 * @body {string} referenceRole - Role referensi (optional)
 * @body {number} displayOrder - Urutan tampilan (optional)
 * @usage Digunakan untuk menghubungkan referensi dengan subculture tertentu
 */
router.post("/subculture/assign", authenticateAdmin, referenceJunctionController.assignReferenceToSubculture);

/**
 * @route DELETE /api/v1/admin/reference-junctions/subculture/:subcultureId/:referenceId
 * @desc Remove reference assignment from subculture
 * @access Admin only
 * @param {number} subcultureId - ID subculture
 * @param {number} referenceId - ID referensi
 * @usage Digunakan untuk menghapus hubungan referensi dari subculture
 */
router.delete("/subculture/:subcultureId/:referenceId", authenticateAdmin, referenceJunctionController.removeReferenceFromSubculture);

/**
 * @route GET /api/v1/admin/reference-junctions/subculture/:subcultureId
 * @desc Get all references assigned to a subculture
 * @access Admin only
 * @param {number} subcultureId - ID subculture
 * @returns {Array} List of references with roles and display order
 * @usage Digunakan untuk menampilkan daftar referensi yang terkait dengan subculture
 */
router.get("/subculture/:subcultureId", authenticateAdmin, referenceJunctionController.getReferencesBySubculture);

// ============================================
// CULTURE REFERENCE ROUTES
// ============================================

/**
 * @route POST /api/v1/admin/reference-junctions/culture/assign
 * @desc Assign a reference to a culture
 * @access Admin only
 * @body {number} cultureId - ID culture
 * @body {number} referenceId - ID referensi
 * @body {string} referenceRole - Role referensi (optional)
 * @body {number} displayOrder - Urutan tampilan (optional)
 * @usage Digunakan untuk menghubungkan referensi dengan culture tertentu
 */
router.post("/culture/assign", authenticateAdmin, referenceJunctionController.assignReferenceToCulture);

/**
 * @route DELETE /api/v1/admin/reference-junctions/culture/:cultureId/:referenceId
 * @desc Remove reference assignment from culture
 * @access Admin only
 * @param {number} cultureId - ID culture
 * @param {number} referenceId - ID referensi
 * @usage Digunakan untuk menghapus hubungan referensi dari culture
 */
router.delete("/culture/:cultureId/:referenceId", authenticateAdmin, referenceJunctionController.removeReferenceFromCulture);

/**
 * @route GET /api/v1/admin/reference-junctions/culture/:cultureId
 * @desc Get all references assigned to a culture
 * @access Admin only
 * @param {number} cultureId - ID culture
 * @returns {Array} List of references with roles and display order
 * @usage Digunakan untuk menampilkan daftar referensi yang terkait dengan culture
 */
router.get("/culture/:cultureId", authenticateAdmin, referenceJunctionController.getReferencesByCulture);

// ============================================
// REFERENCE STATISTICS ROUTES
// ============================================

/**
 * @route GET /api/v1/admin/reference-junctions/stats/:referenceId
 * @desc Get usage statistics for a reference across all entities
 * @access Admin only
 * @param {number} referenceId - ID referensi
 * @returns {Object} Statistics showing reference usage in lexicons, subcultures, and cultures
 * @usage Digunakan untuk mendeteksi orphan data dan melihat dimana referensi digunakan
 */
router.get("/stats/:referenceId", authenticateAdmin, referenceJunctionController.getReferenceUsageStats);

export default router;