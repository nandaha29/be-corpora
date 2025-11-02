import { Router } from "express";
import * as referenceController from "../../controllers/admin/reference.controller.js";
import { authenticateAdmin } from "../../middleware/auth.middleware.js";

const router = Router();

router.get("/", authenticateAdmin, referenceController.getAllReferensiPaginated);
router.get('/search', authenticateAdmin, referenceController.searchReferensi);
router.get("/:id", authenticateAdmin, referenceController.getReferenceById);
router.post("/", authenticateAdmin, referenceController.createReference);
router.put("/:id", authenticateAdmin, referenceController.updateReference);
router.delete("/:id", authenticateAdmin, referenceController.deleteReference);

export default router;
