import { prisma } from '../../lib/prisma.js';
import { StatusCoordinator, Prisma } from '@prisma/client';

// Get all published contributors (coordinators only for public)
export const getPublishedContributors = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const whereCondition = {
    isCoordinator: true,
    coordinatorStatus: StatusCoordinator.ACTIVE, // Only show active coordinators publicly
  };

  const [data, total] = await Promise.all([
    prisma.contributor.findMany({
      where: whereCondition,
      skip,
      take: limit,
      select: {
        contributorId: true,
        contributorName: true,
        institution: true,
        expertiseArea: true,
        displayPriorityStatus: true,
        registeredAt: true,
        contributorAssets: {
          where: {
            assetNote: 'LOGO', // Only show logo assets publicly
          },
          include: {
            asset: {
              select: {
                assetId: true,
                fileName: true,
                url: true,
              },
            },
          },
        },
      },
      orderBy: [
        { displayPriorityStatus: 'asc' }, // HIGH first
        { contributorName: 'asc' },
      ],
    }),
    prisma.contributor.count({
      where: whereCondition,
    }),
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

// Get published contributor by ID
export const getPublishedContributorById = async (contributorId: number) => {
  return prisma.contributor.findFirst({
    where: {
      contributorId,
      isCoordinator: true,
      coordinatorStatus: StatusCoordinator.ACTIVE,
    },
    select: {
      contributorId: true,
      contributorName: true,
      institution: true,
      expertiseArea: true,
      displayPriorityStatus: true,
      registeredAt: true,
      contributorAssets: {
        include: {
          asset: {
            select: {
              assetId: true,
              fileName: true,
              url: true,
            },
          },
        },
      },
    },
  });
};

// Search published contributors (active coordinators)
export const searchPublishedContributors = async (keyword: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const whereClause = {
    isCoordinator: true,
    coordinatorStatus: StatusCoordinator.ACTIVE,
    OR: [
      { contributorName: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
      { institution: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
      { expertiseArea: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
    ],
  };

  const [data, total] = await Promise.all([
    prisma.contributor.findMany({
      where: whereClause,
      skip,
      take: limit,
      select: {
        contributorId: true,
        contributorName: true,
        institution: true,
        expertiseArea: true,
        displayPriorityStatus: true,
        registeredAt: true,
        contributorAssets: {
          where: {
            assetNote: 'LOGO',
          },
          include: {
            asset: {
              select: {
                assetId: true,
                fileName: true,
                url: true,
              },
            },
          },
        },
      },
      orderBy: [
        { displayPriorityStatus: 'asc' },
        { contributorName: 'asc' },
      ],
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