import { Router } from "express";
import * as aboutReferenceController from "../../controllers/admin/about-reference.controller.js";

const router = Router();

/**
 * ABOUT REFERENCE ROUTES
 * Routes for managing references displayed on about page
 */

// GET /api/v1/admin/about-references - Get all about references
router.get("/", aboutReferenceController.getAllAboutReferences);

// GET /api/v1/admin/about-references/:id - Get about reference by ID
router.get("/:id", aboutReferenceController.getAboutReferenceById);

// POST /api/v1/admin/about-references - Create new about reference
router.post("/", aboutReferenceController.createAboutReference);

// PUT /api/v1/admin/about-references/:id - Update about reference
router.put("/:id", aboutReferenceController.updateAboutReference);

// DELETE /api/v1/admin/about-references/:id - Delete about reference
router.delete("/:id", aboutReferenceController.deleteAboutReference);

// PUT /api/v1/admin/about-references/reorder - Reorder about references
router.put("/reorder", aboutReferenceController.reorderAboutReferences);

export default router;