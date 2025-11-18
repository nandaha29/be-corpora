import { prisma } from '../../lib/prisma.js';
import {
  CreateDomainKodifikasiInput,
  UpdateDomainKodifikasiInput,
} from '../../lib/validators.js';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export const getAllDomainKodifikasi = async () => {
  return prisma.domainKodifikasi.findMany();
};

export const getDomainKodifikasiById = async (id: number) => {
  return prisma.domainKodifikasi.findUnique({
    where: { domainKodifikasiId: id },
  });
};

export const createDomainKodifikasi = async (data: CreateDomainKodifikasiInput) => {
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
    const created = await prisma.domainKodifikasi.create({
      data,
    });
    return created;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
      const err = new Error('Unique constraint failed on the fields: kode');
      (err as any).code = 'KODE_DUPLICATE';
      throw err;
    }
    throw error;
  }
};

export const updateDomainKodifikasi = async (id: number, data: UpdateDomainKodifikasiInput) => {
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
    return await prisma.domainKodifikasi.update({
      where: { domainKodifikasiId: id },
      data,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // Unique constraint failed
      if (error.code === 'P2002') {
        const err = new Error('Unique constraint failed on the fields: kode');
        (err as any).code = 'KODE_DUPLICATE';
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
  return prisma.domainKodifikasi.delete({
    where: { domainKodifikasiId: id },
  });
};

// Filter domain kodifikasi by kode and/or status with pagination
export const filterDomainKodifikasis = async (filters: {
  kode?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  // Build where condition dynamically
  const whereCondition: any = {};

  // Add kode filter if provided
  if (filters.kode) {
    whereCondition.kode = {
      contains: filters.kode,
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
    prisma.domainKodifikasi.findMany({
      where: whereCondition,
      // include: {
      //   subculture: true,
      // },
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.domainKodifikasi.count({ where: whereCondition }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        kode: filters.kode || null,
        status: filters.status || null,
      },
    },
  };
};

// Search domain kodifikasi by query across kode, namaDomain, and penjelasan
export const searchDomainKodifikasis = async (query: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.domainKodifikasi.findMany({
      where: {
        OR: [
          { kode: { contains: query } },
          { namaDomain: { contains: query } },
          { penjelasan: { contains: query } },
        ],
      },
      // include: {
      //   subculture: true,
      // },
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.domainKodifikasi.count({
      where: {
        OR: [
          { kode: { contains: query } },
          { namaDomain: { contains: query } },
          { penjelasan: { contains: query } },
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