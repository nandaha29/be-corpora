import { prisma } from '../../lib/prisma.js';

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

// Get culture details
export const getCultureDetail = async (cultureId: number) => {
  return prisma.culture.findUnique({
    where: { cultureId, status: 'PUBLISHED' },
    include: {
      subcultures: {
        where: { status: 'PUBLISHED' },
        include: {
          domainKodifikasis: {
            where: { status: 'PUBLISHED' },
            include: {
              leksikons: {
                where: { status: 'PUBLISHED' },
                include: {
                  contributor: true,
                  leksikonAssets: { include: { asset: true } },
                },
              },
            },
          },
        },
      },
      cultureAssets: { include: { asset: true } },
    },
  });
};