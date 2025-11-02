import { Request, Response } from 'express';
import * as adminService from '../../services/admin/admin.service.js';
import { adminRegisterSchema, adminLoginSchema } from '../../lib/validators.js';
import { ZodError } from 'zod';

// POST /api/v1/admin/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const validated = adminRegisterSchema.parse(req.body);
    const admin = await adminService.registerAdmin(validated);

    return res.status(201).json({
      message: 'Admin registered successfully',
      data: admin
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.issues
      });
    }

    const err = error as any;
    if (err.code === 'EMAIL_EXISTS') {
      return res.status(409).json({
        message: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }

    if (err.code === 'USERNAME_EXISTS') {
      return res.status(409).json({
        message: 'Username already taken',
        code: 'USERNAME_EXISTS'
      });
    }

    if (err.code === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        message: 'Email or username already exists',
        code: 'DUPLICATE_ENTRY'
      });
    }

    console.error('Registration error:', error);
    return res.status(500).json({
      message: 'Registration failed',
      details: error
    });
  }
};

// POST /api/v1/admin/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const validated = adminLoginSchema.parse(req.body);
    const result = await adminService.loginAdmin(validated);

    return res.status(200).json({
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.issues
      });
    }

    const err = error as any;
    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (err.code === 'ACCOUNT_INACTIVE') {
      return res.status(401).json({
        message: 'Account is deactivated',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    console.error('Login error:', error);
    return res.status(500).json({
      message: 'Login failed',
      details: error
    });
  }
};

// GET /api/v1/admin/auth/profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    const admin = await adminService.getAdminById(req.admin.adminId);

    return res.status(200).json({
      message: 'Profile retrieved successfully',
      data: admin
    });
  } catch (error) {
    const err = error as any;
    if (err.code === 'ADMIN_NOT_FOUND') {
      return res.status(404).json({
        message: 'Admin not found',
        code: 'ADMIN_NOT_FOUND'
      });
    }

    console.error('Get profile error:', error);
    return res.status(500).json({
      message: 'Failed to retrieve profile',
      details: error
    });
  }
};

// PUT /api/v1/admin/auth/change-password
export const changePassword = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required',
        code: 'MISSING_FIELDS'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: 'New password must be at least 8 characters',
        code: 'PASSWORD_TOO_SHORT'
      });
    }

    // First verify current password
    const loginResult = await adminService.loginAdmin({
      email: req.admin.email,
      password: currentPassword
    });

    // If login succeeds, change password
    const result = await adminService.changeAdminPassword(req.admin.adminId, newPassword);

    return res.status(200).json({
      message: 'Password changed successfully',
      data: result
    });
  } catch (error) {
    const err = error as any;
    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(400).json({
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    console.error('Change password error:', error);
    return res.status(500).json({
      message: 'Failed to change password',
      details: error
    });
  }
};