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
    return await prisma.subcultureAsset.delete({
      where: { subcultureId_assetId_assetRole: { subcultureId, assetId, assetRole } },
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
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

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

  const [data, total] = await Promise.all([
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
      skip,
      take: limit,
    }),
    prisma.subculture.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        status: filters.status || null,
        statusPriorityDisplay: filters.statusPriorityDisplay || null,
        statusKonservasi: filters.statusKonservasi || null,
        cultureId: filters.cultureId || null,
        search: filters.search || null,
      },
    },
  };
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

export const addReferenceToSubculture = async (subcultureId: number, referensiId: number, leksikonId?: number) => {
  // Verify subculture exists
  const subculture = await prisma.subculture.findUnique({ where: { subcultureId } });
  if (!subculture) {
    const err = new Error('Subculture not found');
    (err as any).code = 'SUBCULTURE_NOT_FOUND';
    throw err;
  }

  // Verify referensi exists
  const referensi = await prisma.referensi.findUnique({ where: { referensiId } });
  if (!referensi) {
    const err = new Error('Referensi not found');
    (err as any).code = 'REFERENSI_NOT_FOUND';
    throw err;
  }

  if (leksikonId) {
    // Assign to specific leksikon
    const leksikon = await prisma.leksikon.findUnique({ where: { leksikonId } });
    if (!leksikon) {
      const err = new Error('Leksikon not found');
      (err as any).code = 'LEKSIKON_NOT_FOUND';
      throw err;
    }

    // Check if leksikon belongs to subculture
    const domainIds = await prisma.domainKodifikasi.findMany({
      where: { subcultureId },
      select: { domainKodifikasiId: true },
    });
    const domainIdList = domainIds.map(d => d.domainKodifikasiId);
    if (!domainIdList.includes(leksikon.domainKodifikasiId)) {
      const err = new Error('Leksikon does not belong to this subculture');
      (err as any).code = 'LEKSIKON_NOT_IN_SUBCULTURE';
      throw err;
    }

    return prisma.leksikonReferensi.create({
      data: { leksikonId, referensiId },
      include: { referensi: true, leksikon: true },
    });
  } else {
    // Assign to all leksikon in subculture
    const domainIds = await prisma.domainKodifikasi.findMany({
      where: { subcultureId },
      select: { domainKodifikasiId: true },
    });
    const domainIdList = domainIds.map(d => d.domainKodifikasiId);

    const leksikons = await prisma.leksikon.findMany({
      where: { domainKodifikasiId: { in: domainIdList } },
      select: { leksikonId: true },
    });

    const assignments = leksikons.map(leksikon => ({
      leksikonId: leksikon.leksikonId,
      referensiId,
    }));

    return prisma.leksikonReferensi.createMany({
      data: assignments,
      skipDuplicates: true,
    });
  }
};

export const filterSubcultureAssets = async (subcultureId: number, filters: {
  tipe?: string;
  assetRole?: string;
  status?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = { subcultureId };

  // Add tipe filter
  if (filters.tipe) {
    const normalized = filters.tipe.toUpperCase();
    const allowed = ["FOTO", "AUDIO", "VIDEO", "MODEL_3D"];
    if (allowed.includes(normalized)) {
      where.asset = { tipe: normalized as any };
    }
  }

  // Add assetRole filter
  if (filters.assetRole) {
    const normalized = filters.assetRole.toUpperCase();
    const allowed = ["HIGHLIGHT", "THUMBNAIL", "GALLERY", "BANNER", "VIDEO_DEMO", "MODEL_3D"];
    if (allowed.includes(normalized)) {
      where.assetRole = normalized as any;
    }
  }

  // Add status filter
  if (filters.status) {
    const normalized = filters.status.toUpperCase();
    const allowed = ["ACTIVE", "PROCESSING", "ARCHIVED", "CORRUPTED"];
    if (allowed.includes(normalized)) {
      where.asset = { status: normalized as any };
    }
  }

  const [data, total] = await Promise.all([
    prisma.subcultureAsset.findMany({
      where,
      include: { asset: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.subcultureAsset.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        tipe: filters.tipe || null,
        assetRole: filters.assetRole || null,
        status: filters.status || null,
      },
    },
  };
};

export const filterSubcultureReferences = async (subcultureId: number, filters: {
  tipeReferensi?: string;
  tahunTerbit?: string;
  status?: string;
  citationNote?: string;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  // Get domain IDs for subculture
  const domainIds = await prisma.domainKodifikasi.findMany({
    where: { subcultureId },
    select: { domainKodifikasiId: true },
  });
  const domainIdList = domainIds.map(d => d.domainKodifikasiId);

  const where: any = {
    leksikon: {
      domainKodifikasiId: { in: domainIdList },
    },
  };

  // Add tipeReferensi filter
  if (filters.tipeReferensi) {
    const normalized = filters.tipeReferensi.toUpperCase();
    const allowed = ["JURNAL", "BUKU", "ARTIKEL", "WEBSITE", "LAPORAN"];
    if (allowed.includes(normalized)) {
      where.referensi = { tipeReferensi: normalized as any };
    }
  }

  // Add tahunTerbit filter
  if (filters.tahunTerbit) {
    where.referensi = { ...where.referensi, tahunTerbit: { contains: filters.tahunTerbit, mode: 'insensitive' } };
  }

  // Add status filter
  if (filters.status) {
    const normalized = filters.status.toUpperCase();
    const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
    if (allowed.includes(normalized)) {
      where.referensi = { ...where.referensi, status: normalized as any };
    }
  }

  // Add citationNote filter
  if (filters.citationNote) {
    const normalized = filters.citationNote.toUpperCase();
    if (normalized === "RESOURCE") {
      where.citationNote = "RESOURCE" as any;
    }
  }

  const [data, total] = await Promise.all([
    prisma.leksikonReferensi.findMany({
      where,
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
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.leksikonReferensi.count({ where }),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      filters: {
        tipeReferensi: filters.tipeReferensi || null,
        tahunTerbit: filters.tahunTerbit || null,
        status: filters.status || null,
        citationNote: filters.citationNote || null,
      },
    },
  };
};

