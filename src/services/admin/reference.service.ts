import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";

import { CreateReferensiInput, UpdateReferensiInput } from '../../lib/validators.js';

export const getAllReferences = async () => {
  return prisma.referensi.findMany();
};

export const getReferenceById = async (id: number) => {
  return prisma.referensi.findUnique({
    where: { referensiId: id },
  });
};

export const createReference = async (data: CreateReferensiInput) => {
  return prisma.referensi.create({
    data: {
      ...data,
      penjelasan: data.penjelasan ?? "",
      url: data.url ?? "",
      penulis: data.penulis ?? "",
      tahunTerbit: data.tahunTerbit ?? "",
    },
  });
};

export const updateReference = async (id: number, data: UpdateReferensiInput) => {
  return prisma.referensi.update({
    where: { referensiId: id },
    data,
  });
};

export const deleteReference = async (id: number) => {
  return prisma.referensi.delete({
    where: { referensiId: id },
  });
};

// ✅ Get all referensi (with pagination + filter)
export const getAllReferensiPaginated = async (page = 1, limit = 10, type?: string) => {
  const skip = (page - 1) * limit;

  const [referensi, totalCount] = await Promise.all([
    prisma.referensi.findMany({
      skip,
      take: limit,
      orderBy: {
        referensiId: 'asc',
      },
    }),
    prisma.referensi.count(),
  ]);

  return {
    data: referensi,
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

// ✅ Get public references (status = published) BELUM UPDATE SCHEMA
// export const getPublicReferensi = async () => {
//   return prisma.referensi.findMany({
//     where: { status: 'published' },
//     orderBy: { createdAt: 'desc' },
//   });
// };

// ✅ Search references
export const searchReferensi = async (keyword: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const enumValues = ['JURNAL', 'BUKU', 'ARTIKEL', 'WEBSITE', 'LAPORAN'];
  const isEnumMatch = enumValues.includes(keyword.toUpperCase());

  const whereClause: any = {
    OR: [
      { judul: { contains: keyword, mode: 'insensitive' } },
      { penjelasan: { contains: keyword, mode: 'insensitive' } },
      { penulis: { contains: keyword, mode: 'insensitive' } },
      { tahunTerbit: { contains: keyword, mode: 'insensitive' } },
    ],
  };

  if (isEnumMatch) {
    whereClause.OR.push({ tipeReferensi: { equals: keyword.toUpperCase() as any } });
  }

  const [data, total] = await Promise.all([
    prisma.referensi.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.referensi.count({
      where: whereClause,
    }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      query: keyword,
    },
  };
};

// ✅ Filter references by type, year, status, createdAt with pagination
export const filterReferences = async (filters: {
  tipeReferensi?: string;
  tahunTerbit?: string;
  status?: string;
  createdAtFrom?: string;
  createdAtTo?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  // Build where condition dynamically
  const whereCondition: any = {};

  // Add tipeReferensi filter if provided
  if (filters.tipeReferensi) {
    const normalized = filters.tipeReferensi.toUpperCase();
    const allowed = ["JURNAL", "BUKU", "ARTIKEL", "WEBSITE", "LAPORAN"];
    if (allowed.includes(normalized)) {
      whereCondition.tipeReferensi = normalized as any;
    }
  }

  // Add tahunTerbit filter if provided
  if (filters.tahunTerbit) {
    whereCondition.tahunTerbit = {
      contains: filters.tahunTerbit,
      mode: 'insensitive'
    };
  }

  // Add status filter if provided
  if (filters.status) {
    const normalized = filters.status.toUpperCase();
    const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
    if (allowed.includes(normalized)) {
      whereCondition.status = normalized as any;
    }
  }

  // Add createdAt range filter if provided
  if (filters.createdAtFrom || filters.createdAtTo) {
    whereCondition.createdAt = {};
    if (filters.createdAtFrom) {
      whereCondition.createdAt.gte = new Date(filters.createdAtFrom);
    }
    if (filters.createdAtTo) {
      whereCondition.createdAt.lte = new Date(filters.createdAtTo);
    }
  }

  const [data, total] = await Promise.all([
    prisma.referensi.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.referensi.count({ where: whereCondition }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        tipeReferensi: filters.tipeReferensi || null,
        tahunTerbit: filters.tahunTerbit || null,
        status: filters.status || null,
        createdAtFrom: filters.createdAtFrom || null,
        createdAtTo: filters.createdAtTo || null,
      },
    },
  };
};
