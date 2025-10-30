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
          }
        }
      },
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
    }
  }));
};