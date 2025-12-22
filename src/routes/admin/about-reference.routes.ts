import { Router } from "express";
import * as aboutReferenceController from "../../controllers/admin/about-reference.controller.js";
import { authenticateAdmin } from "../../middleware/auth.middleware.js";

const router = Router();

// ============================================
// ABOUT REFERENCE ROUTES
// Routes for managing references displayed on About page
// File: src/routes/admin/about-reference.routes.ts
// Controller: src/controllers/admin/about-reference.controller.ts
// Service: src/services/admin/about-reference.service.ts
// ============================================

/**
 * @route GET /api/v1/admin/about-references
 * @desc Get all about references (references displayed on About page)
 * @access Admin only
 * @returns {Array} List of about references ordered by displayOrder
 * @usage Digunakan untuk menampilkan daftar referensi di halaman About
 */
router.get("/", authenticateAdmin, aboutReferenceController.getAllAboutReferences);

/**
 * @route PUT /api/v1/admin/about-references/reorder
 * @desc Reorder about references display order
 * @access Admin only
 * @body {Array} items - Array of { id, displayOrder } objects
 * @usage Digunakan untuk mengubah urutan tampilan referensi di halaman About
 * @note This route must be before /:id to avoid conflict
 */
router.put("/reorder", authenticateAdmin, aboutReferenceController.reorderAboutReferences);

/**
 * @route GET /api/v1/admin/about-references/:id
 * @desc Get about reference by ID
 * @access Admin only
 * @param {number} id - About Reference ID
 * @returns {Object} About reference detail
 * @usage Digunakan untuk mendapatkan detail referensi tertentu
 */
router.get("/:id", authenticateAdmin, aboutReferenceController.getAboutReferenceById);

/**
 * @route POST /api/v1/admin/about-references
 * @desc Create new about reference
 * @access Admin only
 * @body {number} referenceId - ID referensi yang akan ditampilkan
 * @body {number} displayOrder - Urutan tampilan (optional)
 * @body {string} customDescription - Deskripsi kustom (optional)
 * @returns {Object} Created about reference
 * @usage Digunakan untuk menambahkan referensi baru ke halaman About
 */
router.post("/", authenticateAdmin, aboutReferenceController.createAboutReference);

/**
 * @route PUT /api/v1/admin/about-references/:id
 * @desc Update about reference by ID
 * @access Admin only
 * @param {number} id - About Reference ID
 * @body {number} referenceId - ID referensi (optional)
 * @body {number} displayOrder - Urutan tampilan (optional)
 * @body {string} customDescription - Deskripsi kustom (optional)
 * @returns {Object} Updated about reference
 * @usage Digunakan untuk mengubah referensi di halaman About
 */
router.put("/:id", authenticateAdmin, aboutReferenceController.updateAboutReference);

/**
 * @route DELETE /api/v1/admin/about-references/:id
 * @desc Delete about reference by ID
 * @access Admin only
 * @param {number} id - About Reference ID
 * @returns {Object} Deletion confirmation
 * @usage Digunakan untuk menghapus referensi dari halaman About
 */
router.delete("/:id", authenticateAdmin, aboutReferenceController.deleteAboutReference);

export default router;