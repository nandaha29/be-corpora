import { Prisma, PrismaClient, SubcultureAssetRole } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateSubcultureInput, UpdateSubcultureInput } from "../../lib/validators.js";

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

export const getAllSubcultures = async () => {
  return prisma.subculture.findMany({
    include: {
      culture: true,
      domainKodifikasis: true,
      subcultureAssets: {
        include: { asset: true },
      },
    },
  });
};

export const getSubcultureById = async (id: number) => {
  return prisma.subculture.findUnique({
    where: { subcultureId: id },
    include: {
      culture: true,
      domainKodifikasis: true,
      subcultureAssets: {
        include: { asset: true },
      },
    },
  });
};

export const createSubculture = async (data: CreateSubcultureInput) => {
  const slug = generateSlug(data.namaSubculture);
  return prisma.subculture.create({ 
    data: {
      namaSubculture: data.namaSubculture,
      salamKhas: data.salamKhas,
      artiSalamKhas: data.artiSalamKhas,
      penjelasan: data.penjelasan,
      cultureId: data.cultureId,
      status: data.status,
      statusKonservasi: data.statusKonservasi,
      statusPriorityDisplay: data.statusPriorityDisplay,
      slug,
    }
  });
};

export const updateSubculture = async (id: number, data: UpdateSubcultureInput) => {
  console.log('UpdateSubculture called with id:', id);
  console.log('Input data:', data);
  
  let updateData: any = { ...data };
  
  if (data.namaSubculture) {
    updateData.slug = generateSlug(data.namaSubculture);
    console.log('Generated slug:', updateData.slug);
  }
  
  console.log('Final updateData to send to Prisma:', updateData);
  
  const result = await prisma.subculture.update({
    where: { subcultureId: id },
    data: updateData,
  });
  
  console.log('Update result:', result);
  return result;
};

export const deleteSubculture = async (id: number) => {
  return prisma.subculture.delete({
    where: { subcultureId: id },
  });
};

export const addAssetToSubculture = async (subcultureId: number, assetId: number, assetRole: SubcultureAssetRole) => {
  // verify subculture exists
  const subculture = await prisma.subculture.findUnique({ where: { subcultureId } });
  if (!subculture) {
    const err = new Error('Subculture not found');
    (err as any).code = 'SUBCULTURE_NOT_FOUND';
    throw err;
  }

  // verify asset exists
  const asset = await prisma.asset.findUnique({ where: { assetId } });
  if (!asset) {
    const err = new Error('Asset not found');
    (err as any).code = 'ASSET_NOT_FOUND';
    throw err;
  }

  // For GALLERY role, allow multiple photos by always creating new associations
  // For other roles, use upsert to replace existing
  if (assetRole === 'GALLERY') {
    return prisma.subcultureAsset.create({
      data: { subcultureId, assetId, assetRole },
      include: { asset: true },
    });
  } else {
    return prisma.subcultureAsset.upsert({
      where: {
        subcultureId_assetId_assetRole: { subcultureId, assetId, assetRole },
      },
      update: { assetRole },
      create: { subcultureId, assetId, assetRole },
      include: { asset: true },
    });
  }
};


export const removeAssetFromSubculture = async (subcultureId: number, assetId: number, assetRole: SubcultureAssetRole) => {
  try {
    return await prisma.subcultureAsset.deleteMany({
      where: { subcultureId, assetId, assetRole },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
      const err = new Error('Association not found');
      (err as any).code = 'ASSOCIATION_NOT_FOUND';
      throw err;
    }
    throw error;
  }
};


export const getSubcultureAssets = async (id: number) => {
  return prisma.subcultureAsset.findMany({
    where: { subcultureId: id },
    include: { asset: true },
  });
};

export const getAllSubculturesPaginated = async (skip: number, limit: number) => {
  const [subcultures, total] = await Promise.all([
    prisma.subculture.findMany({
      skip,
      take: limit,
      include: {
        culture: true,
        domainKodifikasis: true,
        subcultureAssets: { include: { asset: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.subculture.count(),
  ]);

  return { subcultures, total };
};

export const getSubculturesByCulture = async (cultureId: number) => {
  return prisma.subculture.findMany({
    where: { cultureId },
    include: {
      culture: true,
      domainKodifikasis: true,
      subcultureAssets: { include: { asset: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getFilteredSubcultures = async (filters: {
  status?: string;
  statusPriorityDisplay?: string;
  statusKonservasi?: string;
  cultureId?: number;
  search?: string;
}, pagination: { skip: number; limit: number }) => {
  const where: any = {};

  // Status filters
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.statusPriorityDisplay) {
    where.statusPriorityDisplay = filters.statusPriorityDisplay;
  }
  if (filters.statusKonservasi) {
    where.statusKonservasi = filters.statusKonservasi;
  }
  if (filters.cultureId) {
    where.cultureId = filters.cultureId;
  }

  // Search filter
  if (filters.search) {
    where.OR = [
      { namaSubculture: { contains: filters.search, mode: 'insensitive' } },
      { salamKhas: { contains: filters.search, mode: 'insensitive' } },
      { penjelasan: { contains: filters.search, mode: 'insensitive' } },
      { culture: { namaBudaya: { contains: filters.search, mode: 'insensitive' } } },
    ];
  }

  const [subcultures, total] = await Promise.all([
    prisma.subculture.findMany({
      where,
      include: {
        culture: true,
        domainKodifikasis: true,
        subcultureAssets: { include: { asset: true } },
      },
      orderBy: [
        { statusPriorityDisplay: 'desc' }, // HIGH first, then MEDIUM, LOW, HIDDEN
        { createdAt: 'desc' }
      ],
      skip: pagination.skip,
      take: pagination.limit,
    }),
    prisma.subculture.count({ where }),
  ]);

  return { subcultures, total };
};

export const getAssignedAssets = async (subcultureId: number) => {
  return prisma.subcultureAsset.findMany({
    where: { subcultureId },
    include: {
      asset: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAssignedReferences = async (subcultureId: number) => {
  // Get all leksikon that belong to this subculture's domainKodifikasis
  const domainIds = await prisma.domainKodifikasi.findMany({
    where: { subcultureId },
    select: { domainKodifikasiId: true },
  });

  const domainIdList = domainIds.map(d => d.domainKodifikasiId);

  // Get all references used by leksikons in those domains
  return prisma.leksikonReferensi.findMany({
    where: {
      leksikon: {
        domainKodifikasiId: { in: domainIdList },
      },
    },
    include: {
      referensi: true,
      leksikon: {
        include: {
          domainKodifikasi: {
            include: {
              subculture: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const searchAssetsInSubculture = async (subcultureId: number, searchQuery: string) => {
  return prisma.subcultureAsset.findMany({
    where: {
      subcultureId,
      asset: {
        OR: [
          { namaFile: { contains: searchQuery, mode: 'insensitive' } },
          { penjelasan: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
    },
    include: {
      asset: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const searchReferencesInSubculture = async (subcultureId: number, searchQuery: string) => {
  // Get all leksikon that belong to this subculture's domainKodifikasis
  const domainIds = await prisma.domainKodifikasi.findMany({
    where: { subcultureId },
    select: { domainKodifikasiId: true },
  });

  const domainIdList = domainIds.map(d => d.domainKodifikasiId);

  // Search references used by leksikons in those domains
  return prisma.leksikonReferensi.findMany({
    where: {
      leksikon: {
        domainKodifikasiId: { in: domainIdList },
      },
      referensi: {
        OR: [
          { judul: { contains: searchQuery, mode: 'insensitive' } },
          { penjelasan: { contains: searchQuery, mode: 'insensitive' } },
          { penulis: { contains: searchQuery, mode: 'insensitive' } },
        ],
      },
    },
    include: {
      referensi: true,
      leksikon: {
        include: {
          domainKodifikasi: {
            include: {
              subculture: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getAssetUsage = async (assetId: number) => {
  return prisma.subcultureAsset.findMany({
    where: { assetId },
    include: {
      subculture: {
        include: {
          culture: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getReferenceUsage = async (referensiId: number) => {
  return prisma.leksikonReferensi.findMany({
    where: { referensiId },
    include: {
      leksikon: {
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
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

