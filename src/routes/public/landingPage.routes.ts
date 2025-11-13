import { Router } from 'express';
import * as landingPageController from '../../controllers/public/landingPage.controller.js';

const router = Router();

router.get('/', landingPageController.getLandingPage);
router.post('/contact', landingPageController.submitContactForm);

export default router;