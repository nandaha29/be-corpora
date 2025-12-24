import { prisma } from '../../lib/prisma.js';

// Search cultures with pagination
export const searchCultures = async (query: string, page: number = 1, limit: number = 20) => {
  const skip = (page - 1) * limit;
  const searchTerm = query.toLowerCase();

  const [cultures, totalCount] = await Promise.all([
    prisma.culture.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { cultureName: { contains: searchTerm, mode: 'insensitive' } },
          { originIsland: { contains: searchTerm, mode: 'insensitive' } },
          { province: { contains: searchTerm, mode: 'insensitive' } },
          { cityRegion: { contains: searchTerm, mode: 'insensitive' } },
          { classification: { contains: searchTerm, mode: 'insensitive' } },
          { characteristics: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
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
    prisma.culture.count({
      where: {
        status: 'PUBLISHED',
        OR: [
          { cultureName: { contains: searchTerm, mode: 'insensitive' } },
          { originIsland: { contains: searchTerm, mode: 'insensitive' } },
          { province: { contains: searchTerm, mode: 'insensitive' } },
          { cityRegion: { contains: searchTerm, mode: 'insensitive' } },
          { classification: { contains: searchTerm, mode: 'insensitive' } },
          { characteristics: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
    }),
  ]);

  return {
    data: cultures,
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

// Global search across all content
export const globalSearch = async (query: string, filters?: {
  type?: string;
  culture_id?: number;
  subculture_id?: number;
  domain_id?: number;
}) => {
  const searchTerm = query.toLowerCase();

  // Build where conditions based on filters
  const whereConditions: any = {};

  if (filters?.culture_id) {
    whereConditions.cultureId = filters.culture_id;
  }

  if (filters?.domain_id) {
    whereConditions.domainId = filters.domain_id;
  }

  // Search in leksikons
  const leksikonResults = await prisma.lexicon.findMany({
    where: {
      ...whereConditions,
      OR: [
        { lexiconWord: { contains: searchTerm, mode: 'insensitive' } },
        { ipaInternationalPhoneticAlphabet: { contains: searchTerm, mode: 'insensitive' } },
        { transliteration: { contains: searchTerm, mode: 'insensitive' } },
        { etymologicalMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { culturalMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { translation: { contains: searchTerm, mode: 'insensitive' } },
        { variant: { contains: searchTerm, mode: 'insensitive' } },
        { variantTranslations: { contains: searchTerm, mode: 'insensitive' } },
        { otherDescription: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
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
    },
    take: 50,
  });

  // Search in subcultures if no type filter or type includes subculture
  let subcultureResults: any[] = [];
  if (!filters?.type || filters.type === 'subculture') {
    subcultureResults = await prisma.subculture.findMany({
      where: {
        ...(filters?.culture_id && { cultureId: filters.culture_id }),
        OR: [
          { subcultureName: { contains: searchTerm, mode: 'insensitive' } },
          { explanation: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        culture: true,
        codificationDomains: true,
      },
      take: 20,
    });
  }

  // Search in cultures if no type filter or type includes culture
  let cultureResults: any[] = [];
  if (!filters?.type || filters.type === 'culture') {
    cultureResults = await prisma.culture.findMany({
      where: {
        OR: [
          { cultureName: { contains: searchTerm, mode: 'insensitive' } },
          { province: { contains: searchTerm, mode: 'insensitive' } },
          { cityRegion: { contains: searchTerm, mode: 'insensitive' } },
          { classification: { contains: searchTerm, mode: 'insensitive' } },
          { characteristics: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        subcultures: {
          include: {
            codificationDomains: true,
          },
        },
      },
      take: 20,
    });
  }

  return {
    leksikons: leksikonResults,
    subcultures: subcultureResults,
    cultures: cultureResults,
    total: leksikonResults.length + subcultureResults.length + cultureResults.length,
  };
};

// Search specifically in lexicon fields
export const searchLeksikons = async (query: string) => {
  const searchTerm = query.toLowerCase();

  return prisma.lexicon.findMany({
    where: {
      OR: [
        { lexiconWord: { contains: searchTerm, mode: 'insensitive' } },
        { ipaInternationalPhoneticAlphabet: { contains: searchTerm, mode: 'insensitive' } },
        { transliteration: { contains: searchTerm, mode: 'insensitive' } },
        { etymologicalMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { culturalMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { translation: { contains: searchTerm, mode: 'insensitive' } },
        { variant: { contains: searchTerm, mode: 'insensitive' } },
        { variantTranslations: { contains: searchTerm, mode: 'insensitive' } },
        { otherDescription: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
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
    },
    take: 100,
  });
};

// Advanced search with multiple parameters
export const advancedSearch = async (params: {
  kata?: string;
  makna?: string;
  dk_id?: number;
  culture_id?: number;
  subculture_id?: number;
  status?: string;
}) => {
  const whereConditions: any = {};

  // Build search conditions
  const orConditions: any[] = [];

  if (params.kata) {
    orConditions.push(
      { lexiconWord: { contains: params.kata, mode: 'insensitive' } },
      { ipaInternationalPhoneticAlphabet: { contains: params.kata, mode: 'insensitive' } },
      { transliteration: { contains: params.kata, mode: 'insensitive' } }
    );
  }

  if (params.makna) {
    orConditions.push(
      { etymologicalMeaning: { contains: params.makna, mode: 'insensitive' } },
      { culturalMeaning: { contains: params.makna, mode: 'insensitive' } },
      { commonMeaning: { contains: params.makna, mode: 'insensitive' } },
      { translation: { contains: params.makna, mode: 'insensitive' } }
    );
  }

  if (orConditions.length > 0) {
    whereConditions.OR = orConditions;
  }

  // Add filter conditions
  if (params.dk_id) {
    whereConditions.domainId = params.dk_id;
  }

  if (params.culture_id) {
    // Filter by culture through codificationDomain -> subculture -> culture
    whereConditions.codificationDomain = {
      subculture: {
        cultureId: params.culture_id,
      },
    };
  }

  if (params.subculture_id) {
    // Filter by subculture through codificationDomain -> subculture
    whereConditions.codificationDomain = {
      subcultureId: params.subculture_id,
    };
  }

  if (params.status) {
    whereConditions.status = params.status;
  }

  return prisma.lexicon.findMany({
    where: whereConditions,
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
    take: 100,
  });
};

// Search leksikons within a specific subculture
export const searchLeksikonsInSubculture = async (subcultureId: number, query: string) => {
  const searchTerm = query.toLowerCase();

  return prisma.lexicon.findMany({
    where: {
      codificationDomain: {
        subcultureId,
      },
      OR: [
        { lexiconWord: { contains: searchTerm, mode: 'insensitive' } },
        { ipaInternationalPhoneticAlphabet: { contains: searchTerm, mode: 'insensitive' } },
        { transliteration: { contains: searchTerm, mode: 'insensitive' } },
        { etymologicalMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { culturalMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { translation: { contains: searchTerm, mode: 'insensitive' } },
        { variant: { contains: searchTerm, mode: 'insensitive' } },
        { variantTranslations: { contains: searchTerm, mode: 'insensitive' } },
        { otherDescription: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
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
    take: 50,
  });
};

// Search leksikons within a specific domain
export const searchLeksikonsInDomain = async (domainId: number, query: string) => {
  const searchTerm = query.toLowerCase();

  return prisma.lexicon.findMany({
    where: {
      domainId: domainId,
      OR: [
        { lexiconWord: { contains: searchTerm, mode: 'insensitive' } },
        { ipaInternationalPhoneticAlphabet: { contains: searchTerm, mode: 'insensitive' } },
        { transliteration: { contains: searchTerm, mode: 'insensitive' } },
        { etymologicalMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { culturalMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { translation: { contains: searchTerm, mode: 'insensitive' } },
        { variant: { contains: searchTerm, mode: 'insensitive' } },
        { variantTranslations: { contains: searchTerm, mode: 'insensitive' } },
        { otherDescription: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
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
    take: 50,
  });
};

// Search leksikons within a culture hierarchy (culture and its subcultures)
export const searchLeksikonsInCulture = async (cultureId: number, query: string) => {
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

  return prisma.lexicon.findMany({
    where: {
      domainId: { in: domainIds },
      OR: [
        { lexiconWord: { contains: searchTerm, mode: 'insensitive' } },
        { ipaInternationalPhoneticAlphabet: { contains: searchTerm, mode: 'insensitive' } },
        { transliteration: { contains: searchTerm, mode: 'insensitive' } },
        { etymologicalMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { culturalMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { translation: { contains: searchTerm, mode: 'insensitive' } },
        { variant: { contains: searchTerm, mode: 'insensitive' } },
        { variantTranslations: { contains: searchTerm, mode: 'insensitive' } },
        { otherDescription: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
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
    take: 50,
  });
};

// Global search formatted for frontend (peta-budaya page)
export const globalSearchFormatted = async (query: string, category: 'subculture' | 'lexicon' | 'all' = 'all') => {
  const searchTerm = query.toLowerCase();

  const results: Array<any> = [];
  const lexiconRegionMap: Record<string, string> = {};

  if (category === 'subculture' || category === 'all') {
    // Search in subcultures
    const subcultureResults = await prisma.subculture.findMany({
      where: {
        OR: [
          { subcultureName: { contains: searchTerm, mode: 'insensitive' } },
          { explanation: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        culture: true,
        codificationDomains: {
          include: {
            lexicons: true,
          },
        },
      },
      take: 20,
    });

    // Format subculture results
    for (const subculture of subcultureResults) {
      // Create highlights from domain names or use explanation as fallback
      const highlights = subculture.codificationDomains
        .slice(0, 3)
        .map(dk => dk.domainName);

      if (highlights.length === 0) {
        // If no domains, use first part of explanation as highlight
        highlights.push(subculture.explanation.substring(0, 100) + '...');
      }

      results.push({
        id: subculture.slug, // Use slug as ID for frontend routing
        name: subculture.subcultureName,
        highlights,
        type: 'region'
      });
    }
  }

  if (category === 'lexicon' || category === 'all') {
    // Search in lexicons
    const leksikonResults = await prisma.lexicon.findMany({
      where: {
        OR: [
          { lexiconWord: { contains: searchTerm, mode: 'insensitive' } },
          { culturalMeaning: { contains: searchTerm, mode: 'insensitive' } },
          { etymologicalMeaning: { contains: searchTerm, mode: 'insensitive' } },
          { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
          { translation: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
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
      },
      take: 50,
    });

    // Format leksikon results
    for (const leksikon of leksikonResults) {
      const regionName = leksikon.codificationDomain?.subculture?.subcultureName ||
                        leksikon.codificationDomain?.subculture?.culture?.cultureName ||
                        'Unknown Region';

      results.push({
        term: leksikon.lexiconWord,
        definition: leksikon.culturalMeaning || leksikon.commonMeaning || leksikon.translation,
        transliterasi: leksikon.transliteration,
        termCode: leksikon.lexiconId.toString(),
        type: 'lexicon'
      });

      // Add to region map
      lexiconRegionMap[leksikon.lexiconId.toString()] = regionName;
    }
  }

  return {
    results,
    lexiconRegionMap,
    total: results.length,
  };
};

// Search lexicon with relevance scoring
export const searchLexiconWithScoring = async (query: string, fields: string[], limit: number) => {
  const searchTerm = query.toLowerCase();

  // Build where conditions based on fields
  const orConditions: any[] = [];

  if (fields.includes('term')) {
    orConditions.push({ lexiconWord: { contains: searchTerm, mode: 'insensitive' } });
  }
  if (fields.includes('definition')) {
    orConditions.push({ culturalMeaning: { contains: searchTerm, mode: 'insensitive' } });
    orConditions.push({ commonMeaning: { contains: searchTerm, mode: 'insensitive' } });
  }
  if (fields.includes('etymology')) {
    orConditions.push({ etymologicalMeaning: { contains: searchTerm, mode: 'insensitive' } });
  }

  const lexicons = await prisma.lexicon.findMany({
    where: {
      status: 'PUBLISHED',
      OR: orConditions,
    },
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
    },
    take: limit,
  });

  // Calculate relevance score
  const scoredResults = lexicons.map(lexicon => {
    let score = 0;
    const term = lexicon.lexiconWord?.toLowerCase() || '';
    const definition = (lexicon.culturalMeaning || lexicon.commonMeaning || '')?.toLowerCase() || '';
    const etymology = lexicon.etymologicalMeaning?.toLowerCase() || '';

    if (fields.includes('term') && term.includes(searchTerm)) score += 10;
    if (fields.includes('definition') && definition.includes(searchTerm)) score += 5;
    if (fields.includes('etymology') && etymology.includes(searchTerm)) score += 3;

    // Exact matches get higher score
    if (fields.includes('term') && term === searchTerm) score += 20;
    if (fields.includes('definition') && definition.includes(searchTerm) && definition.split(' ').includes(searchTerm)) score += 10;

    return {
      ...lexicon,
      relevanceScore: score,
    };
  });

  // Sort by score descending
  scoredResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return scoredResults.slice(0, limit);
};

// Helper functions for analysis
export const checkLexiconExists = async (params: { kata?: string; makna?: string }) => {
  const where: any = {};
  if (params.kata) {
    where.OR = [
      { lexiconWord: { contains: params.kata, mode: 'insensitive' } },
      { ipaInternationalPhoneticAlphabet: { contains: params.kata, mode: 'insensitive' } },
      { transliteration: { contains: params.kata, mode: 'insensitive' } }
    ];
  }
  if (params.makna) {
    where.OR = where.OR || [];
    where.OR.push(
      { etymologicalMeaning: { contains: params.makna, mode: 'insensitive' } },
      { culturalMeaning: { contains: params.makna, mode: 'insensitive' } },
      { commonMeaning: { contains: params.makna, mode: 'insensitive' } },
      { translation: { contains: params.makna, mode: 'insensitive' } }
    );
  }
  const count = await prisma.lexicon.count({ where });
  return count > 0;
};

export const checkDomainExists = async (domainId: number) => {
  const count = await prisma.codificationDomain.count({ where: { domainId } });
  return count > 0;
};

export const checkCultureExists = async (cultureId: number) => {
  const count = await prisma.culture.count({ where: { cultureId } });
  return count > 0;
};