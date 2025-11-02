import { Router } from 'express';
import * as adminController from '../../controllers/admin/admin.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// Public routes (no authentication required)
router.post('/register', adminController.register);
router.post('/login', adminController.login);

// Protected routes (authentication required)
router.get('/profile', authenticateAdmin, adminController.getProfile);
router.put('/change-password', authenticateAdmin, adminController.changePassword);

export default router;