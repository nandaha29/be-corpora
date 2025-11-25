import { prisma } from '../../lib/prisma.js';

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

// Get domain details
export const getDomainDetail = async (domainId: number) => {
  return prisma.codificationDomain.findUnique({
    where: { domainId: domainId, status: 'PUBLISHED' },
    include: {
      subculture: {
        include: {
          culture: true,
        },
      },
      lexicons: {
        where: { status: 'PUBLISHED' },
        include: {
          contributor: true,
          lexiconAssets: { include: { asset: true } },
        },
      },
    },
  });
};