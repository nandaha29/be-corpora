import { Router } from "express";
import * as referenceController from "../../controllers/admin/reference.controller.js";
import { authenticateAdmin } from "../../middleware/auth.middleware.js";

const router = Router();

// ============================================
// REFERENCE MANAGEMENT ENDPOINTS
// ============================================

/**
 * @route GET /api/admin/references
 * @desc Get all references with pagination
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get("/", authenticateAdmin, referenceController.getAllReferensiPaginated);

/**
 * @route GET /api/admin/references/search
 * @desc Search references by title, author, or description
 * @access Admin only
 * @query {string} q - Search query
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search', authenticateAdmin, referenceController.searchReferensi);

/**
 * @route GET /api/admin/references/:id
 * @desc Get reference by ID
 * @access Admin only
 * @param {number} id - Reference ID
 */
router.get("/:id", authenticateAdmin, referenceController.getReferenceById);

/**
 * @route POST /api/admin/references
 * @desc Create new reference
 * @access Admin only
 * @body {string} judul - Reference title
 * @body {string} tipeReferensi - Reference type (JURNAL, BUKU, ARTIKEL, WEBSITE, LAPORAN)
 * @body {string} penjelasan - Description
 * @body {string} url - URL (optional)
 * @body {string} penulis - Author (optional)
 * @body {string} tahunTerbit - Publication year (optional)
 * @body {string} status - Status (DRAFT, PUBLISHED, ARCHIVED)
 */
router.post("/", authenticateAdmin, referenceController.createReference);

/**
 * @route PUT /api/admin/references/:id
 * @desc Update reference by ID
 * @access Admin only
 * @param {number} id - Reference ID
 * @body {string} judul - Reference title
 * @body {string} tipeReferensi - Reference type
 * @body {string} penjelasan - Description
 * @body {string} url - URL (optional)
 * @body {string} penulis - Author (optional)
 * @body {string} tahunTerbit - Publication year (optional)
 * @body {string} status - Status
 */
router.put("/:id", authenticateAdmin, referenceController.updateReference);

/**
 * @route DELETE /api/admin/references/:id
 * @desc Delete reference by ID
 * @access Admin only
 * @param {number} id - Reference ID
 */
router.delete("/:id", authenticateAdmin, referenceController.deleteReference);

export default router;
