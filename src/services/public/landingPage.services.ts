import { prisma } from '../../lib/prisma.js';

export const getLandingPageData = async () => {
  // HEROSECTION: Get a random published culture from Jawa Timur province and its photo assets
  const cultures = await prisma.culture.findMany({
    where: {
      status: 'PUBLISHED',
    },
    include: {
      subcultures: {
        where: { status: 'PUBLISHED' },
        include: {
          subcultureAssets: {
            include: {
              asset: true,
            },
            where: {
              asset: { tipe: 'FOTO' },
            },
          },
        },
      },
    },
  });

  const randomIndex = Math.floor(Math.random() * cultures.length);
  const heroCulture = cultures[randomIndex];

  const heroSection = {
    cultureName: heroCulture?.provinsi || 'Default Culture',
    assets: heroCulture?.subcultures.flatMap((sub: { subcultureAssets: any[]; }) => sub.subcultureAssets.map(sa => sa.asset.url)) || [],
  };

  // SUBCULTURE SECTION: Get 4 published subcultures from the same province as hero culture
  const subcultures = await prisma.subculture.findMany({
    where: {
      status: 'PUBLISHED',
      cultureId: heroCulture?.cultureId // Only get subcultures from the same province as hero culture
    },
    take: 4,
    include: {
      culture: true,
      subcultureAssets: {
        include: { asset: true },
        where: {
          asset: { tipe: 'FOTO' },
        },
      },
    },
  });

  const subcultureSection = subcultures.map((sub: { subcultureId: any; slug: any; namaSubculture: any; penjelasan: any; culture: { namaBudaya: any; provinsi: any; }; subcultureAssets: string | any[]; }) => ({
    id: sub.subcultureId,
    slug: sub.slug,
    name: sub.namaSubculture,
    description: sub.penjelasan,
    culture: sub.culture.namaBudaya,
    province: sub.culture.provinsi,
    heroImage: sub.subcultureAssets && sub.subcultureAssets.length > 0 ? sub.subcultureAssets[0]!.asset.url : null,
  }));

  // COLLABORATIONASSET: Get photo assets with notes
  const collaborationAssets = await prisma.contributorAsset.findMany({
    include: {
      asset: true,
      contributor: true,
    },
    where: {
      asset: { tipe: 'FOTO' },
    },
  });

  // VISI & MISI SECTION: Statistics
  const stats = await Promise.all([
    prisma.culture.count({ where: { status: 'PUBLISHED' } }),
    prisma.subculture.count({ where: { status: 'PUBLISHED' } }),
    prisma.leksikon.count({ where: { status: 'PUBLISHED' } }),
    prisma.contributor.count(),
    prisma.asset.count(),
  ]);

  const visiMisiSection = {
    publishedCultures: stats[0],
    publishedSubcultures: stats[1],
    publishedLeksikons: stats[2],
    totalContributors: stats[3],
    totalAssets: stats[4],
  };

  // TEAM SCIENTIS SECTION: Contributors
  const teamScientis = await prisma.contributor.findMany({
    select: {
      namaContributor: true,
      expertiseArea: true,
    },
  });

  return {
    heroSection,
    subcultureSection,
    collaborationAssets,
    visiMisiSection,
    teamScientis,
  };
};