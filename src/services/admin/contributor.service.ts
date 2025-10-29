import { Prisma } from '@prisma/client';
import { prisma } from '../../lib/prisma.js';
import { CreateContributorInput, UpdateContributorInput, CreateContributorAssetInput } from '../../lib/validators.js';

// Get all contributors
export const getAllContributors = async () => {
  return prisma.contributor.findMany();
};

// Get contributor by ID
export const getContributorById = async (id: number) => {
  return prisma.contributor.findUnique({
    where: { contributorId: id },
  });
};

// Create contributor
export const createContributor = async (data: CreateContributorInput) => {
  return prisma.contributor.create({
    data: {
      ...data,
      institusi: data.institusi ?? '',
      expertiseArea: data.expertiseArea ?? '',
      contactInfo: data.contactInfo ?? '',
    },
  });
};

// Update contributor
export const updateContributor = async (id: number, data: UpdateContributorInput) => {
  return prisma.contributor.update({
   where: { contributorId: id },
    data,
  });
};

// Delete contributor
export const deleteContributor = async (id: number) => {
  return prisma.contributor.delete({
    where: { contributorId: id },
  });
};

// Search contributors by keyword
export const searchContributors = async (query: string) => {
  return prisma.contributor.findMany({
    where: {
      OR: [
        { namaContributor: { contains: query, mode: 'insensitive' } },
        { institusi: { contains: query, mode: 'insensitive' } },
        { expertiseArea: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
  });
};

// Get all contributors with pagination
export const getAllContributorsPaginated = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [contributors, totalCount] = await Promise.all([
    prisma.contributor.findMany({
      skip,
      take: limit,
      orderBy: {
        contributorId: 'asc',
      },
    }),
    prisma.contributor.count(),
  ]);

  return {
    data: contributors,
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

// Get contributor assets
export const getContributorAssets = async (contributorId: number) => {
  return prisma.contributorAsset.findMany({
    where: { contributorId },
    include: {
      asset: true,
    },
  });
};

// Add asset to contributor
export const addAssetToContributor = async (contributorId: number, assetId: number, assetNote: string) => {
  // verify contributor exists
  const contributor = await prisma.contributor.findUnique({ where: { contributorId } });
  if (!contributor) {
    const err = new Error('Contributor not found');
    (err as any).code = 'CONTRIBUTOR_NOT_FOUND';
    throw err;
  }

  // verify asset exists
  const asset = await prisma.asset.findUnique({ where: { assetId } });
  if (!asset) {
    const err = new Error('Asset not found');
    (err as any).code = 'ASSET_NOT_FOUND';
    throw err;
  }

  // ✅ pakai upsert biar tidak error P2002
  return prisma.contributorAsset.upsert({
    where: {
      contributorId_assetId: { contributorId, assetId },
    },
    update: { assetNote },
    create: { contributorId, assetId, assetNote },
    include: { asset: true },
  });
};

// Remove asset from contributor
export const removeAssetFromContributor = async (contributorId: number, assetId: number) => {
  try {
    return await prisma.contributorAsset.delete({
      where: { contributorId_assetId: { contributorId, assetId } },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      const err = new Error('Association not found');
      (err as any).code = 'ASSOCIATION_NOT_FOUND';
      throw err;
    }
    throw error;
  }
};
