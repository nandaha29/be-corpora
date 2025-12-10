import { Router } from "express";
import * as referenceController from "../../controllers/admin/reference.controller.js";
import { authenticateAdmin } from "../../middleware/auth.middleware.js";

const router = Router();

// ============================================
// REFERENCE MANAGEMENT ENDPOINTS
// ============================================

/**
 * @route GET /api/v1/admin/references
 * @desc Get all references with pagination
 * @access Admin only
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get("/", authenticateAdmin, referenceController.getAllReferensiPaginated);

/**
 * @route GET /api/v1/admin/references/search
 * @desc Search references by title, author, or description
 * @access Admin only
 * @query {string} q - Search query (required)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/search', authenticateAdmin, referenceController.searchReferensi);

/**
 * @route GET /api/v1/admin/references/filter
 * @desc Filter references by type, year, status, createdAt (combination)
 * @access Admin only
 * @query {string} referenceType - Filter by type (JOURNAL, BOOK, ARTICLE, WEBSITE, REPORT, THESIS, DISSERTATION, FIELD_NOTE)
 * @query {string} publicationYear - Filter by publication year
 * @query {string} status - Filter by status (DRAFT, PUBLISHED, ARCHIVED)
 * @query {string} createdAtFrom - Filter by createdAt from date (ISO string)
 * @query {string} createdAtTo - Filter by createdAt to date (ISO string)
 * @query {number} page - Page number (default: 1)
 * @query {number} limit - Items per page (default: 20)
 */
router.get('/filter', authenticateAdmin, referenceController.filterReferences);

/**
 * @route GET /api/v1/admin/references/:id
 * @desc Get reference by ID
 * @access Admin only
 * @param {number} id - Reference ID
 */
router.get("/:id", authenticateAdmin, referenceController.getReferenceById);

/**
 * @route POST /api/v1/admin/references
 * @desc Create new reference
 * @access Admin only
 * @body {string} title - Reference title
 * @body {string} referenceType - Reference type (JOURNAL, BOOK, ARTICLE, WEBSITE, REPORT, THESIS, DISSERTATION, FIELD_NOTE)
 * @body {string} description - Description
 * @body {string} url - URL (optional)
 * @body {string} authors - Author (optional)
 * @body {string} publicationYear - Publication year (optional)
 * @body {string} referenceRole - Reference role (PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING) (optional)
 * @body {string} status - Status (DRAFT, PUBLISHED, ARCHIVED)
 */
router.post("/", authenticateAdmin, referenceController.createReference);

/**
 * @route PUT /api/v1/admin/references/:id
 * @desc Update reference by ID
 * @access Admin only
 * @param {number} id - Reference ID
 * @body {string} title - Reference title
 * @body {string} referenceType - Reference type
 * @body {string} description - Description
 * @body {string} url - URL (optional)
 * @body {string} authors - Author (optional)
 * @body {string} publicationYear - Publication year (optional)
 * @body {string} referenceRole - Reference role (PRIMARY_SOURCE, SECONDARY_SOURCE, SUPPORTING) (optional)
 * @body {string} status - Status
 */
router.put("/:id", authenticateAdmin, referenceController.updateReference);

/**
 * @route DELETE /api/v1/admin/references/:id
 * @desc Delete reference by ID
 * @access Admin only
 * @param {number} id - Reference ID
 */
router.delete("/:id", authenticateAdmin, referenceController.deleteReference);

export default router;
