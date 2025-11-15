import { Router } from 'express';
import * as adminController from '../../controllers/admin/admin.controller.js';
import { authenticateAdmin } from '../../middleware/auth.middleware.js';

const router = Router();

// ============================================
// PUBLIC ADMIN ENDPOINTS (No Authentication Required)
// ============================================

/**
 * @route POST /api/admin/register
 * @desc Register new admin user
 * @access Public
 * @body {string} username - Username (3-50 characters)
 * @body {string} email - Email address (must be valid)
 * @body {string} password - Password (minimum 8 characters)
 * @body {string} role - Admin role (EDITOR, ADMIN, etc.) - optional, defaults to EDITOR
 */
router.post('/register', adminController.register);

/**
 * @route POST /api/admin/login
 * @desc Admin login authentication
 * @access Public
 * @body {string} email - Admin email address
 * @body {string} password - Admin password
 * @returns {object} JWT token and admin profile
 */
router.post('/login', adminController.login);

// ============================================
// PROTECTED ADMIN ENDPOINTS (Authentication Required)
// ============================================

/**
 * @route GET /api/admin/profile
 * @desc Get current admin profile information
 * @access Admin only (requires valid JWT token)
 * @returns {object} Admin profile data (username, email, role, etc.)
 */
router.get('/profile', authenticateAdmin, adminController.getProfile);

/**
 * @route PUT /api/admin/change-password
 * @desc Change admin password
 * @access Admin only (requires valid JWT token)
 * @body {string} currentPassword - Current password
 * @body {string} newPassword - New password (minimum 8 characters)
 */
router.put('/change-password', authenticateAdmin, adminController.changePassword);

// ============================================
// TODO: Additional Admin Management Features
// ============================================

// TODO: Implement token verification endpoint
// router.post('/verify', authenticateAdmin, adminController.verifyToken);

// TODO: Implement admin user management (for super admins)
// - GET /api/admin/admins - List all admins
// - PUT /api/admin/admins/:id - Update admin role/status
// - DELETE /api/admin/admins/:id - Delete admin user

export default router;