import { loginAdmin } from '../admin.service';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('@/lib/prisma', () => ({
  prisma: {
    admin: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('loginAdmin - WHITE BOX TESTING', () => {
  
  const mockAdmin = {
    adminId: 1,
    email: 'admin@ub.ac.id',
    password: '$2b$10$mockhash1234567890abcdef',
    role: 'EDITOR',
    isActive: true,
    username: 'admin'
  };

  /** P1: Admin not found */
  it('P1 - Admin not found → throw INVALID_CREDENTIALS', async () => {
    (prisma.admin.findUnique as jest.Mock).mockResolvedValue(null);
    await expect(loginAdmin({ email: 'admin@ub.ac.id', password: 'pass123' })).rejects.toThrow('Invalid email or password');
  });

  /** P2: Admin inactive */
  it('P2 - Admin inactive → throw ACCOUNT_INACTIVE', async () => {
    (prisma.admin.findUnique as jest.Mock).mockResolvedValue({
      ...mockAdmin,
      isActive: false
    });
    await expect(loginAdmin({ email: 'admin@ub.ac.id', password: 'pass123' })).rejects.toThrow('Account is deactivated');
  });

  /** P3: Wrong password */
  it('P3 - Wrong password → throw INVALID_CREDENTIALS', async () => {
    (prisma.admin.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);
    await expect(loginAdmin({ email: 'admin@ub.ac.id', password: 'wrongpass' })).rejects.toThrow('Invalid email or password');
  });

  /** P4: SUCCESS - Valid login */
  it('P4 - Valid credentials → return token and admin data', async () => {
    (prisma.admin.findUnique as jest.Mock).mockResolvedValue(mockAdmin);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (jwt.sign as jest.Mock).mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token');

    const result = await loginAdmin({ email: 'admin@ub.ac.id', password: 'Password123' });
    
    expect(result.token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token');
    expect(result.admin.email).toBe('admin@ub.ac.id');
    expect(result.expiresIn).toBeDefined();
  });
});
