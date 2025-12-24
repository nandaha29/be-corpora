import { Request, Response } from 'express';
import * as adminService from '../../services/admin/admin.service.js';
import { adminRegisterSchema, adminLoginSchema, updateAdminSchema } from '../../lib/validators.js';
import { ZodError } from 'zod';

// POST /api/v1/admin/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const validated = adminRegisterSchema.parse(req.body);
    const admin = await adminService.registerAdmin(validated);

    return res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      data: admin
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues
      });
    }

    const err = error as any;
    if (err.code === 'EMAIL_EXISTS') {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }

    if (err.code === 'USERNAME_EXISTS') {
      return res.status(409).json({
        success: false,
        message: 'Username already taken',
        code: 'USERNAME_EXISTS'
      });
    }

    if (err.code === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email or username already exists',
        code: 'DUPLICATE_ENTRY'
      });
    }

    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
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
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues.map(issue => ({
          field: issue.path.join('.'),
          ...issue
        }))
      });
    }

    const err = error as any;
    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        code: 'INVALID_CREDENTIALS'
      });
    }

    if (err.code === 'ACCOUNT_INACTIVE') {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
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
        success: false,
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    const admin = await adminService.getAdminById(req.admin.adminId);

    return res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully',
      data: admin
    });
  } catch (error) {
    const err = error as any;
    if (err.code === 'ADMIN_NOT_FOUND') {
      return res.status(404).json({
        success: false,
        message: 'Admin not found',
        code: 'ADMIN_NOT_FOUND'
      });
    }

    console.error('Get profile error:', error);
    return res.status(500).json({
      success: false,
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
        success: false,
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
        code: 'MISSING_FIELDS'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
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
      success: true,
      message: 'Password changed successfully',
      data: result
    });
  } catch (error) {
    const err = error as any;
    if (err.code === 'INVALID_CREDENTIALS') {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
        code: 'INVALID_CURRENT_PASSWORD'
      });
    }

    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
      details: error
    });
  }
};

// PUT /api/v1/admin/auth/update-profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    const validated = updateAdminSchema.parse(req.body);
    const admin = await adminService.updateAdmin(req.admin.adminId, validated);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: admin
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.issues
      });
    }

    const err = error as any;
    if (err.code === 'EMAIL_EXISTS') {
      return res.status(409).json({
        success: false,
        message: 'Email already registered',
        code: 'EMAIL_EXISTS'
      });
    }

    if (err.code === 'USERNAME_EXISTS') {
      return res.status(409).json({
        success: false,
        message: 'Username already taken',
        code: 'USERNAME_EXISTS'
      });
    }

    if (err.code === 'DUPLICATE_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'Email or username already exists',
        code: 'DUPLICATE_ENTRY'
      });
    }

    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      details: error
    });
  }
};

// PUT /api/v1/admin/admins/:id/status
export const updateAdminStatus = async (req: Request, res: Response) => {
  try {
    if (!req.admin) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    const { id } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'isActive must be a boolean',
        code: 'INVALID_INPUT'
      });
    }

    const admin = await adminService.updateAdminStatus(Number(id), isActive);

    return res.status(200).json({
      success: true,
      message: 'Admin status updated successfully',
      data: admin
    });
  } catch (error) {
    console.error('Update admin status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update admin status',
      details: error
    });
  }
};

// // POST /api/v1/admin/auth/verify
// export const verifyToken = async (req: Request, res: Response) => {
//   try {
//     if (!req.admin) {
//       return res.status(401).json({
//         message: 'Authentication required',
//         code: 'NO_AUTH'
//       });
//     }

//     // Token is already verified by middleware, just return admin data
//     const admin = await adminService.getAdminById(req.admin.adminId);

//     return res.status(200).json({
//       message: 'Token is valid',
//       data: {
//         admin: {
//           adminId: admin.adminId,
//           username: admin.username,
//           email: admin.email,
//           role: admin.role,
//           isActive: admin.isActive,
//         },
//         tokenValid: true,
//         // You can add token expiry info here if needed
//       }
//     });
//   } catch (error) {
//     const err = error as any;
//     if (err.code === 'ADMIN_NOT_FOUND') {
//       return res.status(401).json({
//         message: 'Admin not found',
//         code: 'ADMIN_NOT_FOUND'
//       });
//     }

//     console.error('Token verification error:', error);
//     return res.status(500).json({
//       message: 'Token verification failed',
//       details: error
//     });
//   }
// };