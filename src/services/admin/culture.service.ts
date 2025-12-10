import { prisma } from '../../lib/prisma.js';
import { CreateCultureInput, UpdateCultureInput } from '../../lib/validators.js';
import { StatusKonservasi, StatusPublish, CultureReferenceRole } from '@prisma/client';

// Helper function to generate slug
const generateSlug = (name: string): string => {
  if (!name || name.trim() === '') {
    return 'unnamed-culture'; // fallback for empty names
  }
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing dashes
};

export const getAllCultures = async (page: number, limit: number) => {
  return prisma.culture.findMany();
};

// New function to get a single culture by ID
export const getCultureById = async (id: number) => {
  return prisma.culture.findUnique({
   where: { cultureId: id },
  });
};

export const createCulture = async (data: CreateCultureInput) => {
  const slug = generateSlug(data.cultureName);
  return prisma.culture.create({
    data: {
      ...data,
      slug,
      characteristics: data.characteristics ?? '', 
      classification: data.classification ?? '', 
      ...(data.conservationStatus !== undefined ? { conservationStatus: data.conservationStatus } : {}),
    } as any,
  });
};

// New function to update a culture
export const updateCulture = async (id: number, data: UpdateCultureInput) => {
  const updateData: any = { ...data };

  // Regenerate slug if cultureName is being updated
  if (data.cultureName !== undefined) {
    updateData.slug = generateSlug(data.cultureName);
  }

  return prisma.culture.update({
    where: { cultureId: id },
    data: updateData,
  });
};

// New function to delete a culture
export const deleteCulture = async (id: number) => {
  return prisma.culture.delete({
    where: { cultureId: id },
  });
};

// Get all cultures with pagination
export const getAllCulturesPaginated = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [cultures, totalCount] = await Promise.all([
    prisma.culture.findMany({
      skip,
      take: limit,
      orderBy: {
        cultureId: 'asc',
      },
    }),
    prisma.culture.count(),
  ]);

  return {
    data: cultures,
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

  export async function getCultureWithAssets(cultureId: number) {
  return await prisma.culture.findUnique({
    where: { cultureId },
    select: {
      cultureId: true,
      cultureName: true,
      subcultures: {
        select: {
          subcultureAssets: {
            select: {
              asset: {
                select: {
                  assetId: true,
                  url: true,
                  fileName: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

// Search cultures with pagination
export const searchCultures = async (
  page: number = 1,
  limit: number = 20,
  searchQuery?: string
) => {
  const skip = (page - 1) * limit;

  // Build where clause for search
  const where: any = {};

  if (searchQuery && searchQuery.trim()) {
    const searchTerm = searchQuery.trim();
    where.OR = [
      { cultureName: { contains: searchTerm, mode: 'insensitive' } },
      { originIsland: { contains: searchTerm, mode: 'insensitive' } },
      { province: { contains: searchTerm, mode: 'insensitive' } },
      { cityRegion: { contains: searchTerm, mode: 'insensitive' } },
      { classification: { contains: searchTerm, mode: 'insensitive' } },
      { characteristics: { contains: searchTerm, mode: 'insensitive' } },
    ];
  }

  const [cultures, totalCount] = await Promise.all([
    prisma.culture.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        cultureId: 'asc',
      },
    }),
    prisma.culture.count({ where }),
  ]);

  return {
    data: cultures,
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

// Filter cultures with pagination (separate from search)
export const filterCultures = async (
  page: number = 1,
  limit: number = 20,
  conservationStatus?: StatusKonservasi,
  status?: StatusPublish,
  originIsland?: string,
  province?: string,
  cityRegion?: string
) => {
  const skip = (page - 1) * limit;

  // Build where clause for filters only
  const where: any = {};

  if (conservationStatus) {
    where.conservationStatus = conservationStatus;
  }

  if (status) {
    where.status = status;
  }

  if (originIsland) {
    where.originIsland = { contains: originIsland, mode: 'insensitive' };
  }

  if (province) {
    where.province = { contains: province, mode: 'insensitive' };
  }

  if (cityRegion) {
    where.cityRegion = { contains: cityRegion, mode: 'insensitive' };
  }

  const [cultures, totalCount] = await Promise.all([
    prisma.culture.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        cultureId: 'asc',
      },
    }),
    prisma.culture.count({ where }),
  ]);

  return {
    data: cultures,
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

// Assign reference directly to CultureReference (for about page)
export const addReferenceToCulture = async (
  cultureId: number,
  referenceId: number,
  displayOrder?: number,
  referenceRole?: CultureReferenceRole
) => {
  // Verify culture exists
  const culture = await prisma.culture.findUnique({ where: { cultureId } });
  if (!culture) {
    const err = new Error('Culture not found');
    (err as any).code = 'CULTURE_NOT_FOUND';
    throw err;
  }

  // Verify reference exists
  const reference = await prisma.reference.findUnique({ where: { referenceId } });
  if (!reference) {
    const err = new Error('Reference not found');
    (err as any).code = 'REFERENCE_NOT_FOUND';
    throw err;
  }

  // Use upsert to avoid duplicates
  return prisma.cultureReference.upsert({
    where: {
      cultureId_referenceId: {
        cultureId,
        referenceId,
      },
    },
    update: {
      referenceRole,
      displayOrder: displayOrder ?? 0,
    },
    create: {
      cultureId,
      referenceId,
      referenceRole,
      displayOrder: displayOrder ?? 0,
    },
    include: {
      reference: true,
      culture: true,
    },
  });
};

// Remove reference from CultureReference
export const removeReferenceFromCulture = async (
  cultureId: number,
  referenceId: number
) => {
  return prisma.cultureReference.delete({
    where: {
      cultureId_referenceId: {
        cultureId,
        referenceId,
      },
    },
  });
};

// Get all references assigned directly to culture
export const getCultureReferences = async (cultureId: number) => {
  return prisma.cultureReference.findMany({
    where: { cultureId },
    include: {
      reference: true,
    },
    orderBy: { displayOrder: 'asc' },
  });
};