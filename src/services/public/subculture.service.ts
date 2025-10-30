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

export const getSubculturesGallery = async (searchQuery: string = '') => {
  const subcultures = await prisma.subculture.findMany({
    where: {
      status: 'PUBLISHED',
      ...(searchQuery && {
        namaSubculture: {
          contains: searchQuery,
          mode: 'insensitive'
        }
      })
    },
    include: {
      culture: true,
      subcultureAssets: {
        include: { asset: true },
        where: { asset: { tipe: 'FOTO' } },
      },
    },
    orderBy: {
      namaSubculture: 'asc'
    }
  });

  return subcultures.map(subculture => ({
    id: subculture.slug || (subculture.subcultureId ? subculture.subcultureId.toString() : `subculture-${Math.random()}`),
    name: subculture.namaSubculture || 'Unnamed Subculture',
    description: subculture.penjelasan || 'No description available',
    image: subculture.subcultureAssets.length > 0
      ? subculture.subcultureAssets[0]!.asset.url
      : null,
    culture: {
      name: subculture.culture?.namaBudaya || 'Unknown Culture',
      province: subculture.culture?.provinsi || 'Unknown Province',
    }
  }));
};

export const getSubcultureDetail = async (identifier: string) => {
  // Try to find by slug first, then by ID if not found
  let subculture = await prisma.subculture.findUnique({
    where: { slug: identifier, status: 'PUBLISHED' },
    include: {
      culture: true,
      domainKodifikasis: {
        include: {
          leksikons: {
            where: { status: 'PUBLISHED' },
            include: {
              contributor: true,
              leksikonAssets: {
                include: { asset: true },
              },
              leksikonReferensis: {
                include: { referensi: true },
              },
            },
          },
        },
      },
      subcultureAssets: {
        include: { asset: true },
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
          domainKodifikasis: {
            include: {
              leksikons: {
                where: { status: 'PUBLISHED' },
                include: {
                  contributor: true,
                  leksikonAssets: {
                    include: { asset: true },
                  },
                  leksikonReferensis: {
                    include: { referensi: true },
                  },
                },
              },
            },
          },
          subcultureAssets: {
            include: { asset: true },
          },
        },
      });
    }
  }

  if (!subculture) return null;

  // Transform data to match frontend expectations
  const profile = {
    displayName: subculture.namaSubculture || 'Unnamed Subculture',
    history: subculture.penjelasan || 'No description available',
    highlights: [], // TODO: add if needed
  };

  const galleryImages = subculture.subcultureAssets
    .filter((sa: { asset: { tipe: string; }; }) => sa.asset.tipe === 'FOTO')
    .map((sa: { asset: { url: any; }; }) => ({ url: sa.asset.url }));

  const model3dArray = subculture.subcultureAssets
    .filter((sa: { asset: { tipe: string; }; }) => sa.asset.tipe === 'MODEL_3D')
    .map((sa: { asset: { url: string; namaFile: any; penjelasan: any; }; }) => ({
      sketchfabId: sa.asset.url?.split('/').pop() || '',
      title: sa.asset.namaFile || 'Untitled Model',
      description: sa.asset.penjelasan || '',
      artifactType: 'Cultural Artifact',
      tags: [],
    }));

  const lexicon = subculture.domainKodifikasis.flatMap((dk: { leksikons: any[]; namaDomain: any; }) =>
    dk.leksikons.map(l => ({
      term: l.kataLeksikon || 'Unknown Term',
      ipa: l.ipa || '',
      transliteration: l.transliterasi || '',
      etymology: l.maknaEtimologi || '',
      culturalMeaning: l.maknaKultural || '',
      commonMeaning: l.commonMeaning || '',
      translation: l.translation || '',
      variants: l.varian || '',
      translationVariants: l.translationVarians || '',
      otherDescription: l.deskripsiLain || '',
      domain: dk.namaDomain || 'Unknown Domain',
      contributor: l.contributor?.namaContributor || 'Unknown Contributor',
    }))
  );

  const heroImage = galleryImages.length > 0 ? galleryImages[0]!.url : null;

  return {
    subcultureId: subculture.subcultureId || 0,
    profile,
    galleryImages,
    model3dArray,
    lexicon,
    heroImage,
    culture: {
      name: subculture.culture?.namaBudaya || 'Unknown Culture',
      province: subculture.culture?.provinsi || 'Unknown Province',
      region: subculture.culture?.kotaDaerah || 'Unknown Region',
    },
  };
};

export const searchLexicon = async (identifier: string, query: string) => {
  // First get the subculture to find its ID
  const subculture = await getSubcultureDetail(identifier);
  if (!subculture) return [];

  const subcultureData = await prisma.subculture.findUnique({
    where: { subcultureId: subculture.subcultureId, status: 'PUBLISHED' },
    include: {
      domainKodifikasis: {
        include: {
          leksikons: {
            where: {
              status: 'PUBLISHED',
              OR: [
                { kataLeksikon: { contains: query, mode: 'insensitive' } },
                { maknaKultural: { contains: query, mode: 'insensitive' } },
                { commonMeaning: { contains: query, mode: 'insensitive' } },
                { translation: { contains: query, mode: 'insensitive' } },
              ],
            },
            include: {
              contributor: true,
            },
          },
        },
      },
    },
  });

  if (!subcultureData) return [];

  return subcultureData.domainKodifikasis.flatMap((dk: { leksikons: any[]; namaDomain: any; }) =>
    dk.leksikons.map(l => ({
      term: l.kataLeksikon || 'Unknown Term',
      ipa: l.ipa || '',
      transliteration: l.transliterasi || '',
      etymology: l.maknaEtimologi || '',
      culturalMeaning: l.maknaKultural || '',
      commonMeaning: l.commonMeaning || '',
      translation: l.translation || '',
      variants: l.varian || '',
      translationVariants: l.translationVarians || '',
      otherDescription: l.deskripsiLain || '',
      domain: dk.namaDomain || 'Unknown Domain',
      contributor: l.contributor?.namaContributor || 'Unknown Contributor',
    }))
  );
};