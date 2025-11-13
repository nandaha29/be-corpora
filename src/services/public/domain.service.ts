import { prisma } from '../../lib/prisma.js';

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

// Get domain details
export const getDomainDetail = async (domainId: number) => {
  return prisma.domainKodifikasi.findUnique({
    where: { domainKodifikasiId: domainId, status: 'PUBLISHED' },
    include: {
      subculture: {
        include: {
          culture: true,
        },
      },
      leksikons: {
        where: { status: 'PUBLISHED' },
        include: {
          contributor: true,
          leksikonAssets: { include: { asset: true } },
        },
      },
    },
  });
};