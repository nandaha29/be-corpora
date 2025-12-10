import { PrismaClient, LexiconReferenceRole } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLexicons = async (regionFilter: string = 'all', searchQuery: string = '', page: number = 1, limit: number = 10) => {
  // Build where clause
  const whereClause: any = {
    status: 'PUBLISHED',
  };

  // Add region filter if specified
  if (regionFilter !== 'all') {
    // Find subculture by slug or name, then get its codificationDomains IDs
    const subculture = await prisma.subculture.findFirst({
      where: {
        OR: [
          { slug: regionFilter },
          { subcultureName: { contains: regionFilter, mode: 'insensitive' } }
        ],
        status: 'PUBLISHED'
      },
      include: {
        codificationDomains: true
      }
    });

    if (subculture && subculture.codificationDomains.length > 0) {
      whereClause.domainId = {
        in: subculture.codificationDomains.map(dk => dk.domainId)
      };
    }
  }

  // Add search filter if specified
  if (searchQuery) {
    whereClause.OR = [
      { lexiconWord: { contains: searchQuery, mode: 'insensitive' } },
      { culturalMeaning: { contains: searchQuery, mode: 'insensitive' } },
      { commonMeaning: { contains: searchQuery, mode: 'insensitive' } },
      { translation: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;

  // Get total count for pagination
  const totalCount = await prisma.lexicon.count({
    where: whereClause,
  });

  const lexicons = await prisma.lexicon.findMany({
    where: whereClause,
    include: {
      contributor: true,
      codificationDomain: {
        include: {
          subculture: {
            include: {
              culture: true
            }
          },
        }
      },
      lexiconAssets: { include: { asset: true } },
      lexiconReferences: {
        where: {
          reference: { status: 'PUBLISHED' }
        },
        include: { 
          reference: true 
        },
        orderBy: { displayOrder: 'asc' }
      },
    },
    orderBy: {
      lexiconWord: 'asc'
    },
    skip,
    take: limit,
  });

  const transformedLexicons = lexicons.map(lexicon => ({
    id: (lexicon as any).slug || lexicon.lexiconId.toString(),
    term: lexicon.lexiconWord || 'Unknown Term',
    definition: lexicon.culturalMeaning || lexicon.commonMeaning || 'No definition available',
    regionKey: (lexicon as any).codificationDomain?.subculture?.slug || (lexicon as any).codificationDomain?.subculture?.subcultureName || 'Unknown Region',
    subculture: {
      name: (lexicon as any).codificationDomain?.subculture?.subcultureName || 'Unknown Subculture',
      province: (lexicon as any).codificationDomain?.subculture?.culture?.province || 'Unknown Province',
    },
    domain: (lexicon as any).codificationDomain?.domainName || 'Unknown Domain',
    contributor: (lexicon as any).contributor?.contributorName || 'Unknown Contributor',
    details: {
      ipa: lexicon.ipaInternationalPhoneticAlphabet || '',
      transliteration: lexicon.transliteration || '',
      etymology: lexicon.etymologicalMeaning || '',
      culturalMeaning: lexicon.culturalMeaning || '',
      commonMeaning: lexicon.commonMeaning || '',
      translation: lexicon.translation || '',
      variants: lexicon.variant || '',
      translationVariants: lexicon.variantTranslations || '',
      otherDescription: lexicon.otherDescription || '',
    },
    leksikonAssets: (lexicon as any).lexiconAssets || [],
    leksikonReferensis: ((lexicon as any).lexiconReferences || []).map((ref: any) => ({
      ...ref.reference,
      referenceRole: LexiconReferenceRole.SUPPORTING
    })),
  }));

  return {
    data: transformedLexicons,
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
};

export const getLexiconDetail = async (identifier: string) => {
  let lexicon = null;

  // Try to find by slug first
  try {
    lexicon = await prisma.lexicon.findUnique({
      where: { slug: identifier, status: 'PUBLISHED' },
      include: {
        contributor: true,
        codificationDomain: {
          include: {
            subculture: {
              include: {
                culture: true,
                subcultureAssets: {
                  include: { asset: true },
                },
              },
            },
          },
        },
        lexiconAssets: { 
          include: { asset: true },
          where: { asset: { status: 'ACTIVE' } }
        },
        lexiconReferences: { include: { reference: true } },
      },
    });
  } catch (error) {
    console.error('Error finding lexicon by slug:', error);
  }

  // If not found by slug, try by term
  if (!lexicon) {
    lexicon = await prisma.lexicon.findFirst({
      where: {
        lexiconWord: { equals: identifier, mode: 'insensitive' },
        status: 'PUBLISHED'
      },
      include: {
        contributor: true,
        codificationDomain: {
          include: {
            subculture: {
              include: {
                culture: true,
                subcultureAssets: {
                  include: { asset: true },
                },
              },
            },
          },
        },
        lexiconAssets: { 
          include: { asset: true },
          where: { asset: { status: 'ACTIVE' } }
        },
        lexiconReferences: { include: { reference: true } },
      },
    });
  }

  // If not found, try by ID
  if (!lexicon) {
    const id = Number(identifier);
    if (!isNaN(id)) {
      lexicon = await prisma.lexicon.findUnique({
        where: { lexiconId: id, status: 'PUBLISHED' },
        include: {
          contributor: true,
          codificationDomain: {
            include: {
              subculture: {
                include: {
                  culture: true,
                  subcultureAssets: {
                    include: { asset: true },
                  },
                },
              },
            },
          },
          lexiconAssets: { 
            include: { asset: true },
            where: { asset: { status: 'ACTIVE' } }
          },
          lexiconReferences: { include: { reference: true } },
        },
      });
    }
  }

  if (!lexicon) {
    return null;
  }

  // // Get subculture's gallery images
  // const subcultureGalleryImages = (lexicon as any).codificationDomain?.subculture?.subcultureAssets
  //   .filter((sa: any) => sa.asset.fileType === 'PHOTO')
  //   .map((sa: any) => ({ url: sa.asset.url })) || [];

  // Get lexicon's gallery images
  const lexiconGalleryImages = (lexicon as any).lexiconAssets
    .filter((la: any) => la.assetRole === 'GALLERY' && la.asset.fileType === 'PHOTO')
    .map((la: any) => ({ url: la.asset.url }));

  // Combine galleries
  // const galleryImages = [...subcultureGalleryImages, ...lexiconGalleryImages];
  const galleryImages = [...lexiconGalleryImages];

  return {
    id: (lexicon as any).slug || lexicon.lexiconId.toString(),
    term: lexicon.lexiconWord || 'Unknown Term',
    definition: lexicon.culturalMeaning || lexicon.commonMeaning || 'No definition available',
    regionKey: (lexicon as any).codificationDomain?.subculture?.slug || (lexicon as any).codificationDomain?.subculture?.subcultureName || 'Unknown Region',
    subculture: {
      name: (lexicon as any).codificationDomain?.subculture?.subcultureName || 'Unknown Subculture',
      province: (lexicon as any).codificationDomain?.subculture?.culture?.province || 'Unknown Province',
    },
    domain: (lexicon as any).codificationDomain?.domainName || 'Unknown Domain',
    contributor: (lexicon as any).contributor?.contributorName || 'Unknown Contributor',
    details: {
      ipa: lexicon.ipaInternationalPhoneticAlphabet || '',
      transliteration: lexicon.transliteration || '',
      etymology: lexicon.etymologicalMeaning || '',
      culturalMeaning: lexicon.culturalMeaning || '',
      commonMeaning: lexicon.commonMeaning || '',
      translation: lexicon.translation || '',
      variants: lexicon.variant || '',
      translationVariants: lexicon.variantTranslations || '',
      otherDescription: lexicon.otherDescription || '',
    },
    galleryImages,
    lexiconAssets: (lexicon as any).lexiconAssets || [],
    lexiconReferences: ((lexicon as any).lexiconReferences || []).map((ref: any) => ({
      ...ref.reference,
      referenceRole: LexiconReferenceRole.SUPPORTING
    })),
  };
};