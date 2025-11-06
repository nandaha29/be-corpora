import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllLexicons = async (regionFilter: string = 'all', searchQuery: string = '') => {
  // Build where clause
  const whereClause: any = {
    status: 'PUBLISHED',
  };

  // Add region filter if specified
  if (regionFilter !== 'all') {
    // Find subculture by slug or name, then get its domainKodifikasi IDs
    const subculture = await prisma.subculture.findFirst({
      where: {
        OR: [
          { slug: regionFilter },
          { namaSubculture: { contains: regionFilter, mode: 'insensitive' } }
        ],
        status: 'PUBLISHED'
      },
      include: {
        domainKodifikasis: true
      }
    });

    if (subculture && subculture.domainKodifikasis.length > 0) {
      whereClause.domainKodifikasiId = {
        in: subculture.domainKodifikasis.map(dk => dk.domainKodifikasiId)
      };
    }
  }

  // Add search filter if specified
  if (searchQuery) {
    whereClause.OR = [
      { kataLeksikon: { contains: searchQuery, mode: 'insensitive' } },
      { maknaKultural: { contains: searchQuery, mode: 'insensitive' } },
      { commonMeaning: { contains: searchQuery, mode: 'insensitive' } },
      { translation: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  const lexicons = await prisma.leksikon.findMany({
    where: whereClause,
    include: {
      contributor: true,
      domainKodifikasi: {
        include: {
          subculture: {
            include: {
              culture: true
            }
          },
        }
      },
      leksikonAssets: { include: { asset: true } },
      leksikonReferensis: { include: { referensi: true } },
    },
    orderBy: {
      kataLeksikon: 'asc'
    }
  });

  return lexicons.map(lexicon => ({
    id: (lexicon as any).slug || lexicon.leksikonId.toString(),
    term: lexicon.kataLeksikon || 'Unknown Term',
    definition: lexicon.maknaKultural || lexicon.commonMeaning || 'No definition available',
    regionKey: (lexicon as any).domainKodifikasi?.subculture?.slug || (lexicon as any).domainKodifikasi?.subculture?.namaSubculture || 'Unknown Region',
    subculture: {
      name: (lexicon as any).domainKodifikasi?.subculture?.namaSubculture || 'Unknown Subculture',
      province: (lexicon as any).domainKodifikasi?.subculture?.culture?.provinsi || 'Unknown Province',
    },
    domain: (lexicon as any).domainKodifikasi?.namaDomain || 'Unknown Domain',
    contributor: (lexicon as any).contributor?.namaContributor || 'Unknown Contributor',
    details: {
      ipa: lexicon.ipa || '',
      transliteration: lexicon.transliterasi || '',
      etymology: lexicon.maknaEtimologi || '',
      culturalMeaning: lexicon.maknaKultural || '',
      commonMeaning: lexicon.commonMeaning || '',
      translation: lexicon.translation || '',
      variants: lexicon.varian || '',
      translationVariants: lexicon.translationVarians || '',
      otherDescription: lexicon.deskripsiLain || '',
    },
    leksikonAssets: (lexicon as any).leksikonAssets || [],
    leksikonReferensis: (lexicon as any).leksikonReferensis || [],
  }));
};

export const getLexiconDetail = async (identifier: string) => {
  console.log(`Searching for lexicon with identifier: ${identifier}`);
  let lexicon = null;

  // Try to find by slug first
  try {
    console.log('Trying to find by slug...');
    lexicon = await prisma.leksikon.findUnique({
      where: { slug: identifier, status: 'PUBLISHED' } as any,
      include: {
        contributor: true,
        domainKodifikasi: {
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
        leksikonAssets: { include: { asset: true } },
        leksikonReferensis: { include: { referensi: true } },
      },
    });
    if (lexicon) {
      console.log(`Found by slug: ${lexicon.kataLeksikon}`);
    } else {
      console.log('Not found by slug');
    }
  } catch (error) {
    console.log('Error finding by slug:', error);
  }

  // If not found by slug, try by term
  if (!lexicon) {
    console.log('Trying to find by term...');
    lexicon = await prisma.leksikon.findFirst({
      where: {
        kataLeksikon: { equals: identifier, mode: 'insensitive' },
        status: 'PUBLISHED'
      },
      include: {
        contributor: true,
        domainKodifikasi: {
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
        leksikonAssets: { include: { asset: true } },
        leksikonReferensis: { include: { referensi: true } },
      },
    });
    if (lexicon) {
      console.log(`Found by term: ${lexicon.kataLeksikon}`);
    } else {
      console.log('Not found by term');
    }
  }

  // If not found, try by ID
  if (!lexicon) {
    const id = Number(identifier);
    if (!isNaN(id)) {
      console.log(`Trying to find by ID: ${id}`);
      lexicon = await prisma.leksikon.findUnique({
        where: { leksikonId: id, status: 'PUBLISHED' },
        include: {
          contributor: true,
          domainKodifikasi: {
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
          leksikonAssets: { include: { asset: true } },
          leksikonReferensis: { include: { referensi: true } },
        },
      });
      if (lexicon) {
        console.log(`Found by ID: ${lexicon.kataLeksikon}`);
      } else {
        console.log('Not found by ID');
      }
    } else {
      console.log('Identifier is not a valid number for ID search');
    }
  }

  if (!lexicon) {
    console.log('No lexicon found for identifier:', identifier);
    return null;
  }

  console.log('Returning lexicon data');
  // ... rest of the code

  // Get subculture's gallery images
  const subcultureGalleryImages = (lexicon as any).domainKodifikasi?.subculture?.subcultureAssets
    .filter((sa: any) => sa.asset.tipe === 'FOTO')
    .map((sa: any) => ({ url: sa.asset.url })) || [];

  // Get lexicon's gallery images
  const lexiconGalleryImages = (lexicon as any).leksikonAssets
    .filter((la: any) => la.assetRole === 'GALLERY' && la.asset.tipe === 'FOTO')
    .map((la: any) => ({ url: la.asset.url }));

  // Combine galleries
  const galleryImages = [...subcultureGalleryImages, ...lexiconGalleryImages];

  return {
    id: (lexicon as any).slug || lexicon.leksikonId.toString(),
    term: lexicon.kataLeksikon || 'Unknown Term',
    definition: lexicon.maknaKultural || lexicon.commonMeaning || 'No definition available',
    regionKey: (lexicon as any).domainKodifikasi?.subculture?.slug || (lexicon as any).domainKodifikasi?.subculture?.namaSubculture || 'Unknown Region',
    subculture: {
      name: (lexicon as any).domainKodifikasi?.subculture?.namaSubculture || 'Unknown Subculture',
      province: (lexicon as any).domainKodifikasi?.subculture?.culture?.provinsi || 'Unknown Province',
    },
    domain: (lexicon as any).domainKodifikasi?.namaDomain || 'Unknown Domain',
    contributor: (lexicon as any).contributor?.namaContributor || 'Unknown Contributor',
    details: {
      ipa: lexicon.ipa || '',
      transliteration: lexicon.transliterasi || '',
      etymology: lexicon.maknaEtimologi || '',
      culturalMeaning: lexicon.maknaKultural || '',
      commonMeaning: lexicon.commonMeaning || '',
      translation: lexicon.translation || '',
      variants: lexicon.varian || '',
      translationVariants: lexicon.translationVarians || '',
      otherDescription: lexicon.deskripsiLain || '',
    },
    galleryImages,
    leksikonAssets: (lexicon as any).leksikonAssets || [],
    leksikonReferensis: (lexicon as any).leksikonReferensis || [],
  };
};