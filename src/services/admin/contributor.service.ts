import { Prisma, ContributorAssetRole } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { prisma } from '../../lib/prisma.js';
import { CreateContributorInput, UpdateContributorInput, CreateContributorAssetInput } from '../../lib/validators.js';

// Get all contributors
export const getAllContributors = async () => {
  return prisma.contributor.findMany({
    include: {
      contributorAssets: {
        include: { asset: true },
      },
    },
  });
};

// Get contributor by ID
export const getContributorById = async (id: number) => {
  return prisma.contributor.findUnique({
    where: { contributorId: id },
    include: {
      contributorAssets: {
        include: { asset: true },
      },
    },
  });
};

// Create contributor
export const createContributor = async (data: CreateContributorInput) => {
  return prisma.contributor.create({
    data: {
      ...data,
      institution: data.institution ?? '',
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
        { contributorName: { contains: query, mode: 'insensitive' } },
        { institution: { contains: query, mode: 'insensitive' } },
        { expertiseArea: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    },
    include: {
      contributorAssets: {
        include: { asset: true },
      },
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
      include: {
        contributorAssets: {
          include: { asset: true },
        },
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
export const addAssetToContributor = async (contributorId: number, assetId: number, assetNote: ContributorAssetRole) => {
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
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      const err = new Error('Association not found');
      (err as any).code = 'ASSOCIATION_NOT_FOUND';
      throw err;
    }
    throw error;
  }
};

// Search coordinators by keyword
export const searchCoordinators = async (keyword: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const whereClause = {
    isCoordinator: true,
    OR: [
      { contributorName: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
      { institution: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
      { expertiseArea: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
      { email: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
    ],
  };

  const [data, total] = await Promise.all([
    prisma.contributor.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        contributorAssets: {
          include: { asset: true },
        },
      },
      orderBy: { contributorName: 'asc' },
    }),
    prisma.contributor.count({
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

// Filter coordinators by status and other criteria
export const filterCoordinators = async (filters: {
  coordinatorStatus?: string;
  expertiseArea?: string;
  institution?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const whereCondition: any = {
    isCoordinator: true,
  };

  // console.log('Filter coordinators - initial whereCondition:', whereCondition);

  // Add coordinatorStatus filter if provided
  if (filters.coordinatorStatus) {
    const normalized = filters.coordinatorStatus.toUpperCase();
    const allowed = ["ACTIVE", "INACTIVE", "ALUMNI"];
    if (allowed.includes(normalized)) {
      whereCondition.coordinatorStatus = normalized as any;
      // console.log('Added coordinatorStatus filter:', normalized);
    } else {
      // console.log('Invalid coordinatorStatus:', normalized);
    }
  }

  // Add expertiseArea filter if provided
  if (filters.expertiseArea) {
    whereCondition.expertiseArea = {
      contains: filters.expertiseArea,
      mode: Prisma.QueryMode.insensitive
    };
  }

  // Add institution filter if provided
  if (filters.institution) {
    whereCondition.institution = {
      contains: filters.institution,
      mode: Prisma.QueryMode.insensitive
    };
  }

  // console.log('Final whereCondition:', whereCondition);

  const [data, total] = await Promise.all([
    prisma.contributor.findMany({
      where: whereCondition,
      skip,
      take: limit,
      include: {
        contributorAssets: {
          include: { asset: true },
        },
      },
      orderBy: { contributorName: 'asc' },
    }),
    prisma.contributor.count({ where: whereCondition }),
  ]);

  // console.log('Query result - total:', total, 'data length:', data.length);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        coordinatorStatus: filters.coordinatorStatus || null,
        expertiseArea: filters.expertiseArea || null,
        institution: filters.institution || null,
      },
    },
  };
};

// Get all coordinators (without pagination for debugging)
export const getAllCoordinators = async () => {
  return prisma.contributor.findMany({
    where: {
      isCoordinator: true,
    },
    include: {
      contributorAssets: {
        include: { asset: true },
      },
    },
    orderBy: { contributorName: 'asc' },
  });
};
