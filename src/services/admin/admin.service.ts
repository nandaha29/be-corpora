import { prisma } from '../../lib/prisma.js';
import { AdminRegisterInput, AdminLoginInput } from '../../lib/validators.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AdminRole } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

export const registerAdmin = async (data: AdminRegisterInput) => {
  // Check if admin with email or username already exists
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username }
      ]
    }
  });

  if (existingAdmin) {
    if (existingAdmin.email === data.email) {
      const err = new Error('Email already registered');
      (err as any).code = 'EMAIL_EXISTS';
      throw err;
    }
    if (existingAdmin.username === data.username) {
      const err = new Error('Username already taken');
      (err as any).code = 'USERNAME_EXISTS';
      throw err;
    }
  }

  // Hash password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(data.password, saltRounds);

  try {
    const admin = await prisma.admin.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        role: data.role || AdminRole.EDITOR,
      },
      select: {
        adminId: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
      }
    });

    return admin;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // Handle unique constraint violations
      if (error.code === 'P2002') {
        const err = new Error('Email or username already exists');
        (err as any).code = 'DUPLICATE_ENTRY';
        throw err;
      }
    }
    throw error;
  }
};

export const loginAdmin = async (data: AdminLoginInput) => {
  // Find admin by email
  const admin = await prisma.admin.findUnique({
    where: { email: data.email }
  });

  if (!admin) {
    const err = new Error('Invalid email or password');
    (err as any).code = 'INVALID_CREDENTIALS';
    throw err;
  }

  if (!admin.isActive) {
    const err = new Error('Account is deactivated');
    (err as any).code = 'ACCOUNT_INACTIVE';
    throw err;
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(data.password, admin.password);
  if (!isPasswordValid) {
    const err = new Error('Invalid email or password');
    (err as any).code = 'INVALID_CREDENTIALS';
    throw err;
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      adminId: admin.adminId,
      username: admin.username,
      email: admin.email,
      role: admin.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return {
    admin: {
      adminId: admin.adminId,
      username: admin.username,
      email: admin.email,
      role: admin.role,
      isActive: admin.isActive,
    },
    token,
    expiresIn: JWT_EXPIRES_IN,
  };
};

export const getAdminById = async (adminId: number) => {
  const admin = await prisma.admin.findUnique({
    where: { adminId },
    select: {
      adminId: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    }
  });

  if (!admin) {
    const err = new Error('Admin not found');
    (err as any).code = 'ADMIN_NOT_FOUND';
    throw err;
  }

  return admin;
};

export const updateAdminStatus = async (adminId: number, isActive: boolean) => {
  const admin = await prisma.admin.update({
    where: { adminId },
    data: { isActive },
    select: {
      adminId: true,
      username: true,
      email: true,
      role: true,
      isActive: true,
    }
  });

  return admin;
};

export const changeAdminPassword = async (adminId: number, newPassword: string) => {
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  await prisma.admin.update({
    where: { adminId },
    data: { password: hashedPassword }
  });

  return { message: 'Password updated successfully' };
};