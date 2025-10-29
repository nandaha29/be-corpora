import { prisma } from '../../lib/prisma.js';

export const getLandingPageData = async () => {
  // HEROSECTION: Get first published culture and its photo assets
  const heroCulture = await prisma.culture.findFirst({
    where: { status: 'PUBLISHED' },
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

  const heroSection = {
    cultureName: heroCulture?.namaBudaya || 'Default Culture',
    assets: heroCulture?.subcultures.flatMap(sub => sub.subcultureAssets.map(sa => sa.asset.url)) || [],
  };

  // SUBCULTURE SECTION: Get 4 published subcultures
  const subcultures = await prisma.subculture.findMany({
    where: { status: 'PUBLISHED' },
    take: 4,
  });

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
    subcultures,
    collaborationAssets,
    visiMisiSection,
    teamScientis,
  };
};