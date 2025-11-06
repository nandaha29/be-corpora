import { prisma } from '../../lib/prisma.js';
import { CreateCultureInput, UpdateCultureInput } from '../../lib/validators.js';

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
  const slug = generateSlug(data.namaBudaya);
  return prisma.culture.create({
    data: {
      ...data,
      slug,
      karakteristik: data.karakteristik ?? '', 
      klasifikasi: data.klasifikasi ?? '', 
      ...(data.statusKonservasi !== undefined ? { statusKonservasi: data.statusKonservasi } : {}),
    } as any,
  });
};

// New function to update a culture
export const updateCulture = async (id: number, data: UpdateCultureInput) => {
  const updateData: any = { ...data };

  // Regenerate slug if namaBudaya is being updated
  if (data.namaBudaya !== undefined) {
    updateData.slug = generateSlug(data.namaBudaya);
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
      namaBudaya: true,
      subcultures: {
        select: {
          subcultureAssets: {
            select: {
              asset: {
                select: {
                  assetId: true,
                  url: true,
                  namaFile: true,
                },
              },
            },
          },
        },
      },
    },
  });
}