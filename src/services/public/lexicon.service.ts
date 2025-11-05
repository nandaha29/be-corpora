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
    term: lexicon.kataLeksikon || 'Unknown Term',
    definition: lexicon.maknaKultural || lexicon.commonMeaning || 'No definition available',
    regionKey: lexicon.domainKodifikasi?.subculture?.slug || lexicon.domainKodifikasi?.subculture?.namaSubculture || 'Unknown Region',
    subculture: {
      name: lexicon.domainKodifikasi?.subculture?.namaSubculture || 'Unknown Subculture',
      province: lexicon.domainKodifikasi?.subculture?.culture?.provinsi || 'Unknown Province',
    },
    domain: lexicon.domainKodifikasi?.namaDomain || 'Unknown Domain',
    contributor: lexicon.contributor?.namaContributor || 'Unknown Contributor',
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
    leksikonAssets: lexicon.leksikonAssets || [],
    leksikonReferensis: lexicon.leksikonReferensis || [],
  }));
};

export const getLexiconDetail = async (identifier: string) => {
  // Try to find by slug first (assuming we generate slug for lexicon), then by ID
  let lexicon = await prisma.leksikon.findFirst({
    where: {
      OR: [
        { kataLeksikon: { equals: identifier, mode: 'insensitive' } }, // Assuming identifier is the term
      ],
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

  // If not found, try by ID
  if (!lexicon) {
    const id = Number(identifier);
    if (!isNaN(id)) {
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
    }
  }

  if (!lexicon) return null;

  // Get subculture's gallery images
  const subcultureGalleryImages = lexicon.domainKodifikasi?.subculture?.subcultureAssets
    .filter(sa => sa.asset.tipe === 'FOTO')
    .map(sa => ({ url: sa.asset.url })) || [];

  // Get lexicon's gallery images
  const lexiconGalleryImages = lexicon.leksikonAssets
    .filter(la => la.assetRole === 'GALLERY' && la.asset.tipe === 'FOTO')
    .map(la => ({ url: la.asset.url }));

  // Combine galleries
  const galleryImages = [...subcultureGalleryImages, ...lexiconGalleryImages];

  return {
    term: lexicon.kataLeksikon || 'Unknown Term',
    definition: lexicon.maknaKultural || lexicon.commonMeaning || 'No definition available',
    regionKey: lexicon.domainKodifikasi?.subculture?.slug || lexicon.domainKodifikasi?.subculture?.namaSubculture || 'Unknown Region',
    subculture: {
      name: lexicon.domainKodifikasi?.subculture?.namaSubculture || 'Unknown Subculture',
      province: lexicon.domainKodifikasi?.subculture?.culture?.provinsi || 'Unknown Province',
    },
    domain: lexicon.domainKodifikasi?.namaDomain || 'Unknown Domain',
    contributor: lexicon.contributor?.namaContributor || 'Unknown Contributor',
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
    leksikonAssets: lexicon.leksikonAssets || [],
    leksikonReferensis: lexicon.leksikonReferensis || [],
  };
};