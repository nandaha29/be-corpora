import { prisma } from '../../lib/prisma.js';
import {
  CreateCodificationDomainInput,
  UpdateCodificationDomainInput,
} from '../../lib/validators.js';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const getAllDomainKodifikasi = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.codificationDomain.findMany({
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.codificationDomain.count(),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getDomainKodifikasiById = async (id: number) => {
  return prisma.codificationDomain.findUnique({
    where: { domainId: id },
  });
};

export const createDomainKodifikasi = async (data: CreateCodificationDomainInput) => {
  // Verify referenced Subculture exists
  const subculture = await prisma.subculture.findUnique({
    where: { subcultureId: data.subcultureId },
  });
  if (!subculture) {
    const err = new Error('Subculture not found');
    (err as any).code = 'SUBCULTURE_NOT_FOUND';
    throw err;
  }

  try {
    const created = await prisma.codificationDomain.create({
      data,
    });
    return created;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      const err = new Error('Unique constraint failed on the fields: code');
      (err as any).code = 'CODE_DUPLICATE';
      throw err;
    }
    throw error;
  }
};

export const updateDomainKodifikasi = async (id: number, data: UpdateCodificationDomainInput) => {
  // If subcultureId is being updated, verify it exists
  if (data.subcultureId) {
    const subculture = await prisma.subculture.findUnique({
      where: { subcultureId: data.subcultureId },
    });
    if (!subculture) {
      const err = new Error('Subculture not found');
      (err as any).code = 'SUBCULTURE_NOT_FOUND';
      throw err;
    }
  }

  try {
    // Using prisma.update; Prisma will throw P2025 if the record doesn't exist
    return await prisma.codificationDomain.update({
      where: { domainId: id },
      data,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // Unique constraint failed
      if (error.code === 'P2002') {
        const err = new Error('Unique constraint failed on the fields: code');
        (err as any).code = 'CODE_DUPLICATE';
        throw err;
      }
      // Record to update not found => rethrow to be handled by controller
      if (error.code === 'P2025') {
        throw error;
      }
    }
    throw error;
  }
};

export const deleteDomainKodifikasi = async (id: number) => {
  return prisma.codificationDomain.delete({
    where: { domainId: id },
  });
};

// Filter domain kodifikasi by code and/or status with pagination
export const filterDomainKodifikasis = async (filters: {
  code?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  // Build where condition dynamically
  const whereCondition: any = {};

  // Add code filter if provided
  if (filters.code) {
    whereCondition.code = {
      contains: filters.code,
      // mode: 'insensitive'
    };
  }

  // Add status filter if provided
  if (filters.status) {
    const normalized = String(filters.status).toUpperCase();
    const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
    if (allowed.includes(normalized)) {
      whereCondition.status = normalized as any;
    }
  }

  const [data, total] = await Promise.all([
    prisma.codificationDomain.findMany({
      where: whereCondition,
      // include: {
      //   subculture: true,
      // },
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.codificationDomain.count({ where: whereCondition }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        code: filters.code || null,
        status: filters.status || null,
      },
    },
  };
};

// Search domain kodifikasi by query across code, domainName, and explanation
export const searchDomainKodifikasis = async (query: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.codificationDomain.findMany({
      where: {
        OR: [
          { code: { contains: query } },
          { domainName: { contains: query } },
          { explanation: { contains: query } },
        ],
      },
      // include: {
      //   subculture: true,
      // },
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.codificationDomain.count({
      where: {
        OR: [
          { code: { contains: query } },
          { domainName: { contains: query } },
          { explanation: { contains: query } },
        ],
      },
    }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      query,
    },
  };
};