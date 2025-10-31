import { prisma } from '../../lib/prisma.js';

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
    whereConditions.domainKodifikasiId = filters.domain_id;
  }

  // Search in leksikons
  const leksikonResults = await prisma.leksikon.findMany({
    where: {
      ...whereConditions,
      OR: [
        { kataLeksikon: { contains: searchTerm, mode: 'insensitive' } },
        { ipa: { contains: searchTerm, mode: 'insensitive' } },
        { transliterasi: { contains: searchTerm, mode: 'insensitive' } },
        { maknaEtimologi: { contains: searchTerm, mode: 'insensitive' } },
        { maknaKultural: { contains: searchTerm, mode: 'insensitive' } },
        { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { translation: { contains: searchTerm, mode: 'insensitive' } },
        { varian: { contains: searchTerm, mode: 'insensitive' } },
        { translationVarians: { contains: searchTerm, mode: 'insensitive' } },
        { deskripsiLain: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: {
      domainKodifikasi: {
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
          { namaSubculture: { contains: searchTerm, mode: 'insensitive' } },
          { penjelasan: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        culture: true,
        domainKodifikasis: true,
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
          { namaBudaya: { contains: searchTerm, mode: 'insensitive' } },
          { provinsi: { contains: searchTerm, mode: 'insensitive' } },
          { kotaDaerah: { contains: searchTerm, mode: 'insensitive' } },
          { klasifikasi: { contains: searchTerm, mode: 'insensitive' } },
          { karakteristik: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        subcultures: {
          include: {
            domainKodifikasis: true,
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

  return prisma.leksikon.findMany({
    where: {
      OR: [
        { kataLeksikon: { contains: searchTerm, mode: 'insensitive' } },
        { ipa: { contains: searchTerm, mode: 'insensitive' } },
        { transliterasi: { contains: searchTerm, mode: 'insensitive' } },
        { maknaEtimologi: { contains: searchTerm, mode: 'insensitive' } },
        { maknaKultural: { contains: searchTerm, mode: 'insensitive' } },
        { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { translation: { contains: searchTerm, mode: 'insensitive' } },
        { varian: { contains: searchTerm, mode: 'insensitive' } },
        { translationVarians: { contains: searchTerm, mode: 'insensitive' } },
        { deskripsiLain: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: {
      domainKodifikasi: {
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
      { kataLeksikon: { contains: params.kata, mode: 'insensitive' } },
      { ipa: { contains: params.kata, mode: 'insensitive' } },
      { transliterasi: { contains: params.kata, mode: 'insensitive' } }
    );
  }

  if (params.makna) {
    orConditions.push(
      { maknaEtimologi: { contains: params.makna, mode: 'insensitive' } },
      { maknaKultural: { contains: params.makna, mode: 'insensitive' } },
      { commonMeaning: { contains: params.makna, mode: 'insensitive' } },
      { translation: { contains: params.makna, mode: 'insensitive' } }
    );
  }

  if (orConditions.length > 0) {
    whereConditions.OR = orConditions;
  }

  // Add filter conditions
  if (params.dk_id) {
    whereConditions.domainKodifikasiId = params.dk_id;
  }

  if (params.culture_id) {
    // Filter by culture through domainKodifikasi -> subculture -> culture
    whereConditions.domainKodifikasi = {
      subculture: {
        cultureId: params.culture_id,
      },
    };
  }

  if (params.subculture_id) {
    // Filter by subculture through domainKodifikasi -> subculture
    whereConditions.domainKodifikasi = {
      subcultureId: params.subculture_id,
    };
  }

  if (params.status) {
    whereConditions.status = params.status;
  }

  return prisma.leksikon.findMany({
    where: whereConditions,
    include: {
      domainKodifikasi: {
        include: {
          subculture: {
            include: {
              culture: true,
            },
          },
        },
      },
      contributor: true,
      leksikonAssets: { include: { asset: true } },
    },
    take: 100,
  });
};

// Search leksikons within a specific subculture
export const searchLeksikonsInSubculture = async (subcultureId: number, query: string) => {
  const searchTerm = query.toLowerCase();

  return prisma.leksikon.findMany({
    where: {
      domainKodifikasi: {
        subcultureId,
      },
      OR: [
        { kataLeksikon: { contains: searchTerm, mode: 'insensitive' } },
        { ipa: { contains: searchTerm, mode: 'insensitive' } },
        { transliterasi: { contains: searchTerm, mode: 'insensitive' } },
        { maknaEtimologi: { contains: searchTerm, mode: 'insensitive' } },
        { maknaKultural: { contains: searchTerm, mode: 'insensitive' } },
        { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { translation: { contains: searchTerm, mode: 'insensitive' } },
        { varian: { contains: searchTerm, mode: 'insensitive' } },
        { translationVarians: { contains: searchTerm, mode: 'insensitive' } },
        { deskripsiLain: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: {
      domainKodifikasi: {
        include: {
          subculture: {
            include: {
              culture: true,
            },
          },
        },
      },
      contributor: true,
      leksikonAssets: { include: { asset: true } },
    },
    take: 50,
  });
};

// Search leksikons within a specific domain
export const searchLeksikonsInDomain = async (domainId: number, query: string) => {
  const searchTerm = query.toLowerCase();

  return prisma.leksikon.findMany({
    where: {
      domainKodifikasiId: domainId,
      OR: [
        { kataLeksikon: { contains: searchTerm, mode: 'insensitive' } },
        { ipa: { contains: searchTerm, mode: 'insensitive' } },
        { transliterasi: { contains: searchTerm, mode: 'insensitive' } },
        { maknaEtimologi: { contains: searchTerm, mode: 'insensitive' } },
        { maknaKultural: { contains: searchTerm, mode: 'insensitive' } },
        { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { translation: { contains: searchTerm, mode: 'insensitive' } },
        { varian: { contains: searchTerm, mode: 'insensitive' } },
        { translationVarians: { contains: searchTerm, mode: 'insensitive' } },
        { deskripsiLain: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: {
      domainKodifikasi: {
        include: {
          subculture: {
            include: {
              culture: true,
            },
          },
        },
      },
      contributor: true,
      leksikonAssets: { include: { asset: true } },
    },
    take: 50,
  });
};

// Search leksikons within a culture hierarchy (culture and its subcultures)
export const searchLeksikonsInCulture = async (cultureId: number, query: string) => {
  const searchTerm = query.toLowerCase();

  // Get all domain IDs that belong to subcultures of this culture
  const domains = await prisma.domainKodifikasi.findMany({
    where: {
      subculture: {
        cultureId,
      },
    },
    select: {
      domainKodifikasiId: true,
    },
  });

  const domainIds = domains.map(d => d.domainKodifikasiId);

  return prisma.leksikon.findMany({
    where: {
      domainKodifikasiId: { in: domainIds },
      OR: [
        { kataLeksikon: { contains: searchTerm, mode: 'insensitive' } },
        { ipa: { contains: searchTerm, mode: 'insensitive' } },
        { transliterasi: { contains: searchTerm, mode: 'insensitive' } },
        { maknaEtimologi: { contains: searchTerm, mode: 'insensitive' } },
        { maknaKultural: { contains: searchTerm, mode: 'insensitive' } },
        { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
        { translation: { contains: searchTerm, mode: 'insensitive' } },
        { varian: { contains: searchTerm, mode: 'insensitive' } },
        { translationVarians: { contains: searchTerm, mode: 'insensitive' } },
        { deskripsiLain: { contains: searchTerm, mode: 'insensitive' } },
      ],
    },
    include: {
      domainKodifikasi: {
        include: {
          subculture: {
            include: {
              culture: true,
            },
          },
        },
      },
      contributor: true,
      leksikonAssets: { include: { asset: true } },
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
          { namaSubculture: { contains: searchTerm, mode: 'insensitive' } },
          { penjelasan: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        culture: true,
        domainKodifikasis: {
          include: {
            leksikons: true,
          },
        },
      },
      take: 20,
    });

    // Format subculture results
    for (const subculture of subcultureResults) {
      // Create highlights from domain names or use penjelasan as fallback
      const highlights = subculture.domainKodifikasis
        .slice(0, 3)
        .map(dk => dk.namaDomain);

      if (highlights.length === 0) {
        // If no domains, use first part of penjelasan as highlight
        highlights.push(subculture.penjelasan.substring(0, 100) + '...');
      }

      results.push({
        id: subculture.slug, // Use slug as ID for frontend routing
        name: subculture.namaSubculture,
        highlights,
        type: 'region'
      });
    }
  }

  if (category === 'lexicon' || category === 'all') {
    // Search in leksikons
    const leksikonResults = await prisma.leksikon.findMany({
      where: {
        OR: [
          { kataLeksikon: { contains: searchTerm, mode: 'insensitive' } },
          { maknaKultural: { contains: searchTerm, mode: 'insensitive' } },
          { maknaEtimologi: { contains: searchTerm, mode: 'insensitive' } },
          { commonMeaning: { contains: searchTerm, mode: 'insensitive' } },
          { translation: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      include: {
        domainKodifikasi: {
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
      const regionName = leksikon.domainKodifikasi?.subculture?.namaSubculture ||
                        leksikon.domainKodifikasi?.subculture?.culture?.namaBudaya ||
                        'Unknown Region';

      results.push({
        term: leksikon.kataLeksikon,
        definition: leksikon.maknaKultural || leksikon.commonMeaning || leksikon.translation,
        transliterasi: leksikon.transliterasi,
        termCode: leksikon.leksikonId.toString(),
        type: 'lexicon'
      });

      // Add to region map
      lexiconRegionMap[leksikon.leksikonId.toString()] = regionName;
    }
  }

  return {
    results,
    lexiconRegionMap,
    total: results.length,
  };
};