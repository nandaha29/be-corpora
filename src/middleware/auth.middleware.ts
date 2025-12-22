/**
 * ===========================================
 * AUTHENTICATION MIDDLEWARE
 * ===========================================
 * 
 * File: src/middleware/auth.middleware.ts
 * 
 * Purpose:
 * Validates JWT tokens for protected admin routes.
 * Extracts admin information from token and attaches to request object.
 * 
 * How it works:
 * 1. Extract Bearer token from Authorization header
 * 2. Verify token signature using JWT_SECRET
 * 3. Check if admin exists and is active in database
 * 4. Attach admin info to req.admin for use in controllers
 * 
 * Usage:
 * - Import and use as middleware in routes
 * - app.use('/api/v1/admin/cultures', authenticateAdmin, cultureRoutes)
 * 
 * Token Format:
 * Authorization: Bearer <jwt_token>
 * 
 * Token Payload:
 * {
 *   adminId: number,
 *   email: string,
 *   role: string,
 *   iat: number,
 *   exp: number
 * }
 * 
 * Error Codes:
 * - NO_TOKEN: No authorization header
 * - INVALID_TOKEN: Token verification failed
 * - ADMIN_NOT_FOUND: Admin deleted from database
 * - ACCOUNT_INACTIVE: Admin account deactivated
 * - TOKEN_EXPIRED: Token has expired
 * 
 * @module middleware/auth
 * @author Development Team
 * @since 2025-01-01
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Extend Express Request interface to include admin
declare global {
  namespace Express {
    interface Request {
      admin?: {
        adminId: number;
        username: string;
        email: string;
        role: string;
      };
    }
  }
}

export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        message: 'Access token required',
        code: 'NO_TOKEN'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    // Check if admin still exists and is active
    const admin = await prisma.admin.findUnique({
      where: { adminId: decoded.adminId },
      select: {
        adminId: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
      }
    });

    if (!admin) {
      return res.status(401).json({
        message: 'Admin not found',
        code: 'ADMIN_NOT_FOUND'
      });
    }

    if (!admin.isActive) {
      return res.status(401).json({
        message: 'Account is deactivated',
        code: 'ACCOUNT_INACTIVE'
      });
    }

    // Attach admin to request object
    req.admin = {
      adminId: admin.adminId,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        message: 'Invalid token',
        code: 'INVALID_TOKEN'
      });
    }

    console.error('Authentication error:', error);
    return res.status(500).json({
      message: 'Authentication failed',
      code: 'AUTH_ERROR'
    });
  }
};

export const requireRole = (requiredRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): any => {
    if (!req.admin) {
      return res.status(401).json({
        message: 'Authentication required',
        code: 'NO_AUTH'
      });
    }

    if (!requiredRoles.includes(req.admin.role)) {
      return res.status(403).json({
        message: 'Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Convenience middleware for specific roles
export const requireSuperAdmin = requireRole(['SUPER_ADMIN']);
export const requireEditorOrAbove = requireRole(['SUPER_ADMIN', 'EDITOR']);
export const requireAnyAdmin = requireRole(['SUPER_ADMIN', 'EDITOR', 'VIEWER']);