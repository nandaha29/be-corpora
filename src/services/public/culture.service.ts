import { prisma } from '../../lib/prisma.js';
import { Prisma, StatusPublish, CultureReferenceRole } from '@prisma/client';

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
      cultureReferences: {
        where: {
          reference: { status: 'PUBLISHED' }
        },
        include: {
          reference: true
        },
        orderBy: { displayOrder: 'asc' }
      },
    },
  });
};

// Get about page data (culture with references)
// This is used for the /about page that displays culture information with references
export const getAboutPageData = async (identifier?: string) => {
  // If identifier is provided, try to find by slug or ID
  // Otherwise, get the first published culture (or a default one)
  let culture = null;

  if (identifier) {
    // Try by slug first
    culture = await prisma.culture.findFirst({
      where: {
        OR: [
          { slug: identifier, status: 'PUBLISHED' },
          { cultureId: isNaN(Number(identifier)) ? -1 : Number(identifier), status: 'PUBLISHED' }
        ]
      },
      include: {
        subcultures: {
          where: { status: 'PUBLISHED' },
          include: {
            _count: {
              select: { codificationDomains: true }
            }
          }
        },
        cultureReferences: {
          where: {
            reference: { status: 'PUBLISHED' }
          },
          include: {
            reference: true
          },
          orderBy: { displayOrder: 'asc' }
        },
        cultureAssets: {
          include: { asset: true }
        }
      }
    });
  }

  // If not found or no identifier, get first published culture
  if (!culture) {
    culture = await prisma.culture.findFirst({
      where: { status: 'PUBLISHED' },
      include: {
        subcultures: {
          where: { status: 'PUBLISHED' },
          include: {
            _count: {
              select: { codificationDomains: true }
            }
          }
        },
        cultureReferences: {
          where: {
            reference: { status: 'PUBLISHED' }
          },
          include: {
            reference: true
          },
          orderBy: { displayOrder: 'asc' }
        },
        cultureAssets: {
          include: { asset: true }
        }
      },
      orderBy: { cultureId: 'asc' }
    });
  }

  if (!culture) {
    return null;
  }

  return {
    cultureId: culture.cultureId,
    slug: culture.slug,
    cultureName: culture.cultureName,
    originIsland: culture.originIsland,
    province: culture.province,
    cityRegion: culture.cityRegion,
    classification: culture.classification,
    characteristics: culture.characteristics,
    conservationStatus: culture.conservationStatus,
    latitude: culture.latitude,
    longitude: culture.longitude,
    subcultures: culture.subcultures.map(sub => ({
      subcultureId: sub.subcultureId,
      slug: sub.slug,
      subcultureName: sub.subcultureName,
      domainCount: sub._count.codificationDomains
    })),
    cultureReferences: (culture.cultureReferences || []).map((ref: any) => ({
      ...ref.reference,
      referenceRole: CultureReferenceRole.PRIMARY_SOURCE
    })),
    cultureAssets: culture.cultureAssets || []
  };
};