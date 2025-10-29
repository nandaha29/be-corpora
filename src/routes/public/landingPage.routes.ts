import { Router } from "express";
import * as landingPageController from "@/controllers/public/landingPage.controller.js";

const router = Router();

router.get("/hero", landingPageController.getHeroSection);
router.get("/cultures", landingPageController.getAllCultures);
router.get("/subcultures", landingPageController.getSubcultures);
router.get("/gallery", landingPageController.getGallery);
router.get("/statistics", landingPageController.getStatistics);
router.get("/references", landingPageController.getReferences);
router.get("/contributors", landingPageController.getContributors);

export default router;

