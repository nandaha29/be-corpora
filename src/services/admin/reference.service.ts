import { prisma } from "../../lib/prisma.js";
import { Prisma } from "@prisma/client";

import { CreateReferenceInput, UpdateReferenceInput } from '../../lib/validators.js';

export const getAllReferences = async () => {
  return prisma.reference.findMany();
};

export const getReferenceById = async (id: number) => {
  return prisma.reference.findUnique({
    where: { referenceId: id },
  });
};

export const createReference = async (data: CreateReferenceInput) => {
  return prisma.reference.create({
    data: {
      ...data,
      description: data.description ?? "",
      url: data.url ?? "",
      authors: data.authors ?? "",
      publicationYear: data.publicationYear ?? "",
      topicCategory: data.topicCategory ?? "",
    },
  });
};

export const updateReference = async (id: number, data: UpdateReferenceInput) => {
  return prisma.reference.update({
    where: { referenceId: id },
    data,
  });
};

export const deleteReference = async (id: number) => {
  return prisma.reference.delete({
    where: { referenceId: id },
  });
};

// ✅ Get all references (with pagination + filter)
export const getAllReferensiPaginated = async (page = 1, limit = 10, type?: string) => {
  const skip = (page - 1) * limit;

  const [references, totalCount] = await Promise.all([
    prisma.reference.findMany({
      skip,
      take: limit,
      orderBy: {
        referenceId: 'asc',
      },
    }),
    prisma.reference.count(),
  ]);

  return {
    data: references,
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

  const enumValues = ['JOURNAL', 'BOOK', 'ARTICLE', 'WEBSITE', 'REPORT', 'THESIS', 'DISSERTATION', 'FIELD_NOTE'];
  const isEnumMatch = enumValues.includes(keyword.toUpperCase());

  const whereClause: any = {
    OR: [
      { title: { contains: keyword, mode: 'insensitive' } },
      { description: { contains: keyword, mode: 'insensitive' } },
      { authors: { contains: keyword, mode: 'insensitive' } },
      { publicationYear: { contains: keyword, mode: 'insensitive' } },
    ],
  };

  if (isEnumMatch) {
    whereClause.OR.push({ referenceType: { equals: keyword.toUpperCase() as any } });
  }

  const [data, total] = await Promise.all([
    prisma.reference.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.reference.count({
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
  referenceType?: string;
  publicationYear?: string;
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

  // Add referenceType filter if provided
  if (filters.referenceType) {
    const normalized = filters.referenceType.toUpperCase();
    const allowed = ["JOURNAL", "BOOK", "ARTICLE", "WEBSITE", "REPORT", "THESIS", "DISSERTATION", "FIELD_NOTE"];
    if (allowed.includes(normalized)) {
      whereCondition.referenceType = normalized as any;
    }
  }

  // Add publicationYear filter if provided
  if (filters.publicationYear) {
    whereCondition.publicationYear = {
      contains: filters.publicationYear,
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
    prisma.reference.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.reference.count({ where: whereCondition }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        referenceType: filters.referenceType || null,
        publicationYear: filters.publicationYear || null,
        status: filters.status || null,
        createdAtFrom: filters.createdAtFrom || null,
        createdAtTo: filters.createdAtTo || null,
      },
    },
  };
};
