import { prisma } from '../../lib/prisma.js';

// Get all published references
export const getPublishedReferences = async () => {
  return prisma.referensi.findMany({
    where: {
      status: 'PUBLISHED',
    },
    select: {
      referensiId: true,
      judul: true,
      tipeReferensi: true,
      penjelasan: true,
      url: true,
      penulis: true,
      tahunTerbit: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// Get reference by ID (only if published)
export const getPublishedReferenceById = async (referensiId: number) => {
  return prisma.referensi.findFirst({
    where: {
      referensiId,
      status: 'PUBLISHED',
    },
    select: {
      referensiId: true,
      judul: true,
      tipeReferensi: true,
      penjelasan: true,
      url: true,
      penulis: true,
      tahunTerbit: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};