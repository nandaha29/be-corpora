import { prisma } from '../../lib/prisma.js';
import { StatusPublish, StatusFile, StatusCoordinator } from '@prisma/client';

export const getLandingPageData = async () => {
    // HEROSECTION: Get a random published culture that has active banner photo assets from culture or subcultures
  const cultures = await prisma.culture.findMany({
    where: {
      status: StatusPublish.PUBLISHED,
    },
    include: {
      cultureAssets: {
        include: {
          asset: true,
        },
        where: {
          asset: { 
            fileType: 'PHOTO',
            status: StatusFile.ACTIVE
          },
          assetRole: 'BANNER',
        },
      },
      subcultures: {
        where: { status: StatusPublish.PUBLISHED },
        include: {
          subcultureAssets: {
            include: {
              asset: true,
            },
            where: {
              asset: { 
                fileType: 'PHOTO',
                status: StatusFile.ACTIVE
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

  // Get up to 3 active highlight photo URLs from the hero culture's subcultures (HIGHLIGHT role)
  const highlightAssets = heroCulture?.subcultures.flatMap((sub: { subcultureAssets: any[]; }) => 
    sub.subcultureAssets
      .filter((sa: { assetRole: string; asset: { fileType: string; status: any; }; }) => 
        sa.assetRole === 'HIGHLIGHT' && sa.asset.fileType === 'PHOTO' && sa.asset.status === StatusFile.ACTIVE
      )
      .map(sa => sa.asset.url)
  ).slice(0, 3) || []; // Take up to 3, but only use 2 for rotation

  // Get hero image from BANNER role (from culture assets or subculture assets)
  const heroImageAsset = heroCulture?.cultureAssets?.find((ca: any) => 
    ca.assetRole === 'BANNER' && ca.asset.fileType === 'PHOTO' && ca.asset.status === StatusFile.ACTIVE
  )?.asset.url || 
  heroCulture?.subcultures.flatMap((sub: { subcultureAssets: any[]; }) => 
    sub.subcultureAssets
      .filter((sa: { assetRole: string; asset: { fileType: string; status: any; }; }) => 
        sa.assetRole === 'BANNER' && sa.asset.fileType === 'PHOTO' && sa.asset.status === StatusFile.ACTIVE
      )
      .map(sa => sa.asset.url)
  )[0] || null; // Take the first BANNER as hero image (prefer culture banner, fallback to subculture banner)

  const heroSection = {
    cultureName: heroCulture?.cultureName || 'Indonesia Culture',
    // heroImage: heroImageAsset, // 1 BANNER image for hero (from culture or subculture)
    // highlightImages: highlightAssets.slice(0, 2), // 2 images for highlight rotation
  };

  // SUBCULTURE SECTION: Get 4 published subcultures ordered by priority status (HIGH first)
  const subcultures = await prisma.subculture.findMany({
    where: {
      status: StatusPublish.PUBLISHED,
    },
    take: 4,
    orderBy: [
      { displayPriorityStatus: 'asc' }, // HIGH first, then MEDIUM, LOW, HIDDEN
      // { createdAt: 'desc' } // Secondary order by newest first
    ],
    include: {
      culture: true,
      subcultureAssets: {
        include: { asset: true },
        where: {
          asset: { 
            fileType: 'PHOTO',
            status: StatusFile.ACTIVE
          },
          assetRole: 'THUMBNAIL',
        },
      },
    },
  });

  const subcultureSection = subcultures.map((sub: any) => ({
    id: sub.subcultureId,
    slug: sub.slug,
    name: sub.subcultureName,
    description: sub.explanation,
    culture: sub.culture.cultureName,
    province: sub.culture.province,
    heroImage: sub.subcultureAssets && sub.subcultureAssets.length > 0 ? sub.subcultureAssets[0]!.asset.url : null,
  }));

  // COLLABORATIONASSET: Get photo assets with notes from ACTIVE coordinators only
  const collaborationAssets = await prisma.contributorAsset.findMany({
    include: {
      asset: true,
      contributor: true,
    },
    where: {
      asset: { fileType: 'PHOTO' },
      assetNote: 'LOGO', // Only get LOGO assets
      contributor: {
        isCoordinator: true,
        coordinatorStatus: StatusCoordinator.ACTIVE,
      },
    },
  });

  // VISI & MISI SECTION: Statistics
  const stats = await Promise.all([
    prisma.culture.count({ where: { status: StatusPublish.PUBLISHED } }),
    prisma.subculture.count({ where: { status: StatusPublish.PUBLISHED } }),
    prisma.lexicon.count({ where: { status: StatusPublish.PUBLISHED } }),
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
      coordinatorStatus: StatusCoordinator.ACTIVE,
    },
    orderBy: [
      { displayPriorityStatus: 'asc' }, // HIGH first, then MEDIUM, LOW, HIDDEN
    ],
    select: {
      contributorName: true,
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