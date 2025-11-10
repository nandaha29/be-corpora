import { prisma } from '../../lib/prisma.js';

export const getLandingPageData = async () => {
    // HEROSECTION: Get a random published culture that has active highlight photo assets from its subcultures
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
              asset: { 
                tipe: 'FOTO',
                status: 'ACTIVE'
              },
              assetRole: 'THUMBNAIL',
            },
          },
        },
      },
    },
  });

  const randomIndex = Math.floor(Math.random() * cultures.length);
  const heroCulture = cultures[randomIndex];

  // Get up to 3 active highlight photo URLs from the hero culture's subcultures
  const highlightAssets = heroCulture?.subcultures.flatMap((sub: { subcultureAssets: any[]; }) => 
    sub.subcultureAssets.map(sa => sa.asset.url)
  ).slice(0, 3) || [];

  const heroSection = {
    cultureName: heroCulture?.provinsi || 'Default Culture',
    assets: highlightAssets,
  };

  // SUBCULTURE SECTION: Get 4 published subcultures ordered by priority status (HIGH first)
  const subcultures = await prisma.subculture.findMany({
    where: {
      status: 'PUBLISHED',
    },
    take: 4,
    orderBy: [
      { statusPriorityDisplay: 'asc' }, // HIGH first, then MEDIUM, LOW, HIDDEN
      // { createdAt: 'desc' } // Secondary order by newest first
    ] as any,
    include: {
      culture: true,
      subcultureAssets: {
        include: { asset: true },
        where: {
          asset: { 
            tipe: 'FOTO',
            status: 'ACTIVE'
          },
          assetRole: 'THUMBNAIL',
        },
      },
    },
  });

  const subcultureSection = subcultures.map((sub: any) => ({
    id: sub.subcultureId,
    slug: sub.slug,
    name: sub.namaSubculture,
    description: sub.penjelasan,
    culture: sub.culture.namaBudaya,
    province: sub.culture.provinsi,
    heroImage: sub.subcultureAssets && sub.subcultureAssets.length > 0 ? sub.subcultureAssets[0]!.asset.url : null,
  }));

  // COLLABORATIONASSET: Get photo assets with notes from ACTIVE coordinators only
  const collaborationAssets = await prisma.contributorAsset.findMany({
    include: {
      asset: true,
      contributor: true,
    },
    where: {
      asset: { tipe: 'FOTO' },
      assetNote: 'LOGO', // Only get LOGO assets
      contributor: {
        isCoordinator: true,
        statusCoordinator: 'ACTIVE',
      },
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
    where: {
      isCoordinator: true,
      statusCoordinator: 'ACTIVE',
    },
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