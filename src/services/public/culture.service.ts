import { prisma } from '../../lib/prisma.js';
import { Prisma, StatusPublish } from '@prisma/client';

// Get all published cultures with pagination
export const getAllPublishedCultures = async (page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;

  const [cultures, totalCount] = await Promise.all([
    prisma.culture.findMany({
      where: { status: 'PUBLISHED' },
      skip,
      take: limit,
      orderBy: {
        cultureId: 'asc',
      },
      include: {
        cultureAssets: { 
          include: { asset: true },
          take: 1 // Include only one asset per culture for preview
        },
        subcultures: {
          where: { status: 'PUBLISHED' },
          select: {
            subcultureId: true,
            subcultureName: true,
          },
        },
      },
    }),
    prisma.culture.count({ where: { status: 'PUBLISHED' } }),
  ]);

  return {
    data: cultures,
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

// Search leksikons within a culture hierarchy (culture and its subcultures)
export const searchLeksikonsInCulture = async (cultureId: number, query: string, page: number = 1, limit: number = 10) => {
  const searchTerm = query.toLowerCase();

  // Get all domain IDs that belong to subcultures of this culture
  const domains = await prisma.codificationDomain.findMany({
    where: {
      subculture: {
        cultureId,
      },
    },
    select: {
      domainId: true,
    },
  });

  const domainIds = domains.map(d => d.domainId);

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Build where clause
  const whereClause = {
    domainId: { in: domainIds },
    status: StatusPublish.PUBLISHED,
    OR: [
      { lexiconWord: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      { ipaInternationalPhoneticAlphabet: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      { transliteration: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      { etymologicalMeaning: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      { culturalMeaning: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      { commonMeaning: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      { translation: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      { variant: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      { variantTranslations: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
      { otherDescription: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
    ],
  };

  // Get total count for pagination
  const totalCount = await prisma.lexicon.count({
    where: whereClause,
  });

  // Get paginated results
  const lexicons = await prisma.lexicon.findMany({
    where: whereClause,
    include: {
      codificationDomain: {
        include: {
          subculture: {
            include: {
              culture: true,
            },
          },
        },
      },
      contributor: true,
      lexiconAssets: { include: { asset: true } },
    },
    skip,
    take: limit,
    orderBy: {
      lexiconWord: 'asc',
    },
  });

  return {
    data: lexicons,
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

// Get culture details
export const getCultureDetail = async (cultureId: number) => {
  return prisma.culture.findUnique({
    where: { cultureId, status: 'PUBLISHED' },
    include: {
      subcultures: {
        where: { status: 'PUBLISHED' },
        include: {
          codificationDomains: {
            where: { status: 'PUBLISHED' },
            include: {
              lexicons: {
                where: { status: 'PUBLISHED' },
                include: {
                  contributor: true,
                  lexiconAssets: { include: { asset: true } },
                },
              },
            },
          },
        },
      },
      cultureAssets: { include: { asset: true } },
    },
  });
};