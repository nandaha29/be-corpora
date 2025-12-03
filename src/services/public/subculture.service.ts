import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper function to generate slug
const generateSlug = (name: string): string => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing dashes
};

export const getSubculturesGallery = async (searchQuery: string = '', category: string = 'all', page: number = 1, limit: number = 10) => {
  const whereClause: any = {
    status: 'PUBLISHED',
  };

  // Add category filter (assuming category is culture name or province)
  if (category !== 'all') {
    whereClause.culture = {
      OR: [
        { cultureName: { contains: category, mode: 'insensitive' } },
        { province: { contains: category, mode: 'insensitive' } },
      ],
    };
  }

  // Add search filter
  if (searchQuery) {
    whereClause.subcultureName = {
      contains: searchQuery,
      mode: 'insensitive',
    };
  }

  const total = await prisma.subculture.count({ where: whereClause });
  const subcultures = await prisma.subculture.findMany({
    where: whereClause,
    include: {
      culture: true,
      subcultureAssets: {
        include: { asset: true },
        where: { 
          asset: { 
            fileType: 'PHOTO',
            status: 'ACTIVE'
          },
          assetRole: 'THUMBNAIL'
        },
      },
    },
    orderBy: [
      { displayPriorityStatus: 'asc' }, // HIGH first, then MEDIUM, LOW, HIDDEN
      { subcultureName: 'asc' }, // Secondary order by name
    ],
    skip: (page - 1) * limit,
    take: limit,
  });

  const data = subcultures.map(subculture => ({
    id: subculture.slug || (subculture.subcultureId ? subculture.subcultureId.toString() : `subculture-${Math.random()}`),
    name: subculture.subcultureName || 'Unnamed Subculture',
    description: subculture.explanation || 'No description available',
    salamKhas: (subculture as any).traditionalGreeting || null,
    artiSalamKhas: (subculture as any).greetingMeaning || null,
    image: subculture.subcultureAssets.length > 0
      ? subculture.subcultureAssets[0]!.asset.url
      : null,
    culture: {
      name: subculture.culture?.cultureName || 'Unknown Culture',
      province: subculture.culture?.province || 'Unknown Province',
    }
  }));

  return { subcultures: data, total, page, limit };
};

export const getSubcultureDetail = async (identifier: string, searchQuery?: string) => {
  // Try to find by slug first, then by ID if not found
  let subculture = await prisma.subculture.findUnique({
    where: { slug: identifier, status: 'PUBLISHED' },
    include: {
      culture: true,
      codificationDomains: {
        include: {
          lexicons: {
            where: { status: 'PUBLISHED' },
            include: {
              contributor: true,
              lexiconAssets: {
                include: { asset: true },
              },
              lexiconReferences: {
                include: { reference: true },
              },
            },
          },
        },
      },
      subcultureAssets: {
        include: { asset: true },
      },
      subcultureReferences: {
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

  // If not found by slug, try by ID
  if (!subculture) {
    const id = Number(identifier);
    if (!isNaN(id)) {
      subculture = await prisma.subculture.findUnique({
        where: { subcultureId: id, status: 'PUBLISHED' },
        include: {
          culture: true,
          codificationDomains: {
            include: {
              lexicons: {
                where: { status: 'PUBLISHED' },
                include: {
                  contributor: true,
                  lexiconAssets: {
                    include: { asset: true },
                  },
                  lexiconReferences: {
                    include: { reference: true },
                  },
                },
              },
            },
          },
          subcultureAssets: {
            include: { asset: true },
          },
          subcultureReferences: {
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
    }
  }

  if (!subculture) return null;

  // Extract salam khas from description if not available in field
  const salamKhas = (subculture as any).traditionalGreeting || subculture.explanation;
    // (subculture.explanation && subculture.explanation.includes('Hong hulun Basuki Langgeng') ? 'Hong hulun Basuki Langgeng' : null);

  // const highlights = subculture.subcultureAssets
  //   .filter(sa => sa.assetRole === 'HIGHLIGHT' && sa.asset.fileType === 'PHOTO' && sa.asset.status === 'ACTIVE')
  //   .map(sa => ({ url: sa.asset.url }));

  const heroImageAsset = subculture.subcultureAssets
    .find(sa => sa.assetRole === 'THUMBNAIL' && sa.asset.fileType === 'PHOTO' && sa.asset.status === 'ACTIVE');

  const profile = {
    displayName: subculture.subcultureName || 'Unnamed Subculture',
    history: subculture.explanation || 'No description available',
    salamKhas: salamKhas,
    artiSalamKhas: (subculture as any).greetingMeaning || null,
    // highlights,
  };

  // Gallery images from lexicons only (photos with assetRole 'GALLERY')
  const galleryImages = subculture.codificationDomains
    .flatMap(dk => dk.lexicons)
    .flatMap(l => l.lexiconAssets
      .filter(la => la.assetRole === 'GALLERY' && la.asset.fileType === 'PHOTO' && la.asset.status === 'ACTIVE')
      .map(la => ({
        url: la.asset.url,
        description: la.asset.description || `${l.lexiconWord} Gallery Image`,
        caption: la.asset.fileName || 'Cultural heritage image',
        lexiconTerm: l.lexiconWord || 'Unknown Term'
      }))
    );

  const model3dArray = subculture.subcultureAssets
    .filter((sa: { asset: { fileType: string; }; }) => sa.asset.fileType === 'MODEL_3D')
    .map((sa: { asset: { url: string; fileName: any; description: any; }; }) => ({
      sketchfabId: sa.asset.url?.split('/').pop()?.split('-').pop() || '',
      title: sa.asset.fileName || 'Untitled Model',
      description: sa.asset.description || '',
      artifactType: 'Cultural Artifact',
      // tags: [],
    }));

  const lexicon = subculture.codificationDomains.flatMap((dk: { lexicons: any[]; domainName: any; }) => {
    let filteredLeksikons = dk.lexicons;

    // Filter lexicon if search query is provided
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredLeksikons = dk.lexicons.filter(l =>
        (l.lexiconWord && l.lexiconWord.toLowerCase().includes(query)) ||
        (l.culturalMeaning && l.culturalMeaning.toLowerCase().includes(query)) ||
        (l.commonMeaning && l.commonMeaning.toLowerCase().includes(query)) ||
        (l.translation && l.translation.toLowerCase().includes(query)) ||
        (l.transliteration && l.transliteration.toLowerCase().includes(query))
      );
    }

    return filteredLeksikons.map(l => ({
      term: l.lexiconWord || 'Unknown Term',
      definition: l.culturalMeaning || l.commonMeaning || l.translation || 'No definition available',
      category: dk.domainName || 'Unknown Domain',
      region: subculture.subcultureName || 'Unknown Region',
      slug: generateSlug(l.lexiconWord || 'unknown-term'),
    }));
  });

  const heroImage = heroImageAsset ? heroImageAsset.asset.url : null;

  const videoUrl = subculture.subcultureAssets.find(sa => sa.assetRole === 'VIDEO_DEMO')?.asset.url || null;

  // If search query is provided, return search results format
  if (searchQuery && searchQuery.trim()) {
    return {
      subcultureId: subculture.subcultureId || 0,
      profile,
      galleryImages: galleryImages,
      model3dArray,
      lexicon: [], // Don't return full lexicon when searching
      heroImage,
      videoUrl,
      culture: {
        name: subculture.culture?.cultureName || 'Unknown Culture',
        province: subculture.culture?.province || 'Unknown Province',
        region: subculture.culture?.cityRegion || 'Unknown Region',
      },
      subcultureAssets: subculture.subcultureAssets, // Add subcultureAssets for frontend gallery handling
      subcultureReferences: (subculture as any).subcultureReferences || [], // Add subcultureReferences
      searchResults: lexicon, // Return filtered results as searchResults
    };
  }

  // Return full data when no search query
  return {
    subcultureId: subculture.subcultureId || 0,
    profile,
    galleryImages: galleryImages,
    model3dArray,
    lexicon,
    heroImage,
    videoUrl,
    culture: {
      name: subculture.culture?.cultureName || 'Unknown Culture',
      province: subculture.culture?.province || 'Unknown Province',
      region: subculture.culture?.cityRegion || 'Unknown Region',
    },
    subcultureAssets: subculture.subcultureAssets, // Add subcultureAssets for frontend gallery handling
    subcultureReferences: (subculture as any).subcultureReferences || [], // Add subcultureReferences
  };
};

export const getSubcultureLexicons = async (identifier: string, searchQuery?: string, page: number = 1, limit: number = 10) => {
  // First get the subculture to find its ID
  const subculture = await getSubcultureDetail(identifier);
  if (!subculture) return { lexicons: [], total: 0, page, limit };

  const subcultureData = await prisma.subculture.findUnique({
    where: { subcultureId: subculture.subcultureId, status: 'PUBLISHED' },
    include: {
      codificationDomains: {
        include: {
          lexicons: {
            where: { status: 'PUBLISHED' },
            include: {
              contributor: true,
            },
          },
        },
      },
    },
  });

  if (!subcultureData) return { lexicons: [], total: 0, page, limit };

  let allLeksikons = subcultureData.codificationDomains.flatMap(dk => dk.lexicons);

  // Filter by search query
  if (searchQuery && searchQuery.trim()) {
    const query = searchQuery.toLowerCase().trim();
    allLeksikons = allLeksikons.filter(l =>
      (l.lexiconWord && l.lexiconWord.toLowerCase().includes(query)) ||
      (l.culturalMeaning && l.culturalMeaning.toLowerCase().includes(query)) ||
      (l.commonMeaning && l.commonMeaning.toLowerCase().includes(query)) ||
      (l.translation && l.translation.toLowerCase().includes(query)) ||
      (l.transliteration && l.transliteration.toLowerCase().includes(query))
    );
  }

  const total = allLeksikons.length;
  const startIndex = (page - 1) * limit;
  const paginatedLeksikons = allLeksikons.slice(startIndex, startIndex + limit);

  const lexicons = paginatedLeksikons.map(l => ({
    term: l.lexiconWord || 'Unknown Term',
    definition: l.culturalMeaning || l.commonMeaning || l.translation || 'No definition available',
    category: subcultureData.codificationDomains.find(dk => dk.domainId === l.domainId)?.domainName || 'Unknown Domain',
    region: subcultureData.subcultureName || 'Unknown Region',
    slug: generateSlug(l.lexiconWord || 'unknown-term'),
  }));

  return { lexicons, total, page, limit };
};