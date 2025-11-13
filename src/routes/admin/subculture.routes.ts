import express from "express";
import * as subcultureController from "../../controllers/admin/subculture.controller.js";
import { authenticateAdmin } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", authenticateAdmin, subcultureController.getAllSubculturesPaginated);
router.get("/:id", authenticateAdmin, subcultureController.getSubcultureById);
router.post("/", authenticateAdmin, subcultureController.createSubculture);
router.put("/:id", authenticateAdmin, subcultureController.updateSubculture);
router.delete("/:id", authenticateAdmin, subcultureController.deleteSubculture);

router
  .route('/:id/assets')
  .get(authenticateAdmin, subcultureController.getSubcultureAssets)
  .post(authenticateAdmin, subcultureController.addAssetToSubculture);

router
  .route('/:id/assets/:assetId')
  .delete(authenticateAdmin, subcultureController.removeAssetFromSubculture);

  // 🔹 Tambahkan route baru ini
// router.get("/culture/:culture_id/subcultures", subcultureController.getSubculturesByCulture);
router.get("/:cultureId/subcultures", authenticateAdmin, subcultureController.getSubculturesByCulture);

export default router;
