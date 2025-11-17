import { prisma } from '../../lib/prisma.js';
import { CreateLeksikonInput, UpdateLeksikonInput } from '../../lib/validators.js';
import { Prisma, LeksikonAssetRole, CitationNoteType } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Helper function to generate slug
const generateSlug = (name: string): string => {
  if (!name || name.trim() === '') {
    return 'unnamed-term'; // fallback for empty names
  }
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric with dash
    .replace(/(^-|-$)/g, ""); // Remove leading/trailing dashes
};

export const getAllLeksikons = async () => {
  return prisma.leksikon.findMany({
    include: {
      domainKodifikasi: true,
      contributor: true,
      leksikonAssets: { include: { asset: true } },
      leksikonReferensis: { include: { referensi: true } },
    },
  });
};

export const getLeksikonById = async (id: number) => {
  return prisma.leksikon.findUnique({
    where: { leksikonId: id },
    include: {
      domainKodifikasi: true,
      contributor: true,
      leksikonAssets: { include: { asset: true } },
      leksikonReferensis: { include: { referensi: true } },
    },
  });
};

export const createLeksikon = async (data: CreateLeksikonInput) => {
  // verify domain exists
  const domain = await prisma.domainKodifikasi.findUnique({
    where: { domainKodifikasiId: data.domainKodifikasiId },
  });
  if (!domain) {
    const err = new Error('Domain not found');
    (err as any).code = 'DOMAIN_NOT_FOUND';
    throw err;
  }

  // verify contributor exists
  const contributor = await prisma.contributor.findUnique({
    where: { contributorId: data.contributorId },
  });
  if (!contributor) {
    const err = new Error('Contributor not found');
    (err as any).code = 'CONTRIBUTOR_NOT_FOUND';
    throw err;
  }

  try {
    const slug = generateSlug(data.kataLeksikon);
    const created = await prisma.leksikon.create({
      data: {
        kataLeksikon: data.kataLeksikon,
        slug,
        ipa: data.ipa ?? null,
        transliterasi: data.transliterasi ?? null,
        maknaEtimologi: data.maknaEtimologi ?? null,
        maknaKultural: data.maknaKultural ?? null,
        commonMeaning: data.commonMeaning ?? null,
        translation: data.translation ?? null,
        varian: data.varian ?? null,
        translationVarians: data.translationVarians ?? null,
        deskripsiLain: data.deskripsiLain ?? null,
        domainKodifikasiId: data.domainKodifikasiId,
        statusPreservasi: data.statusPreservasi ?? undefined,
        contributorId: data.contributorId,
        status: data.status ?? undefined,
      } as any,
      include: {
        domainKodifikasi: true,
        contributor: true,
        leksikonAssets: { include: { asset: true } },
        leksikonReferensis: { include: { referensi: true } },
      },
    });
    return created;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // handle known Prisma errors if you add unique constraints later
    }
    throw error;
  }
};

export const updateLeksikon = async (id: number, data: UpdateLeksikonInput) => {
  // check relation updates
  if (data.domainKodifikasiId !== undefined) {
    const domain = await prisma.domainKodifikasi.findUnique({
      where: { domainKodifikasiId: data.domainKodifikasiId },
    });
    if (!domain) {
      const err = new Error('Domain not found');
      (err as any).code = 'DOMAIN_NOT_FOUND';
      throw err;
    }
  }
  if (data.contributorId !== undefined) {
    const contributor = await prisma.contributor.findUnique({
      where: { contributorId: data.contributorId },
    });
    if (!contributor) {
      const err = new Error('Contributor not found');
      (err as any).code = 'CONTRIBUTOR_NOT_FOUND';
      throw err;
    }
  }

  try {
    const updateData: any = {
      ...(data.kataLeksikon !== undefined && { kataLeksikon: data.kataLeksikon }),
      ...(data.ipa !== undefined && { ipa: data.ipa }),
      ...(data.transliterasi !== undefined && { transliterasi: data.transliterasi }),
      ...(data.maknaEtimologi !== undefined && { maknaEtimologi: data.maknaEtimologi }),
      ...(data.maknaKultural !== undefined && { maknaKultural: data.maknaKultural }),
      ...(data.commonMeaning !== undefined && { commonMeaning: data.commonMeaning }),
      ...(data.translation !== undefined && { translation: data.translation }),
      ...(data.varian !== undefined && { varian: data.varian }),
      ...(data.translationVarians !== undefined && { translationVarians: data.translationVarians }),
      ...(data.deskripsiLain !== undefined && { deskripsiLain: data.deskripsiLain }),
      ...(data.domainKodifikasiId !== undefined && { domainKodifikasiId: data.domainKodifikasiId }),
      ...(data.statusPreservasi !== undefined && { statusPreservasi: data.statusPreservasi }),
      ...(data.contributorId !== undefined && { contributorId: data.contributorId }),
      ...(data.status !== undefined && { status: data.status }),
    };

    // Regenerate slug if kataLeksikon is being updated
    if (data.kataLeksikon !== undefined) {
      updateData.slug = generateSlug(data.kataLeksikon);
    }

    const updated = await prisma.leksikon.update({
      where: { leksikonId: id },
      data: updateData as any,
      include: {
        domainKodifikasi: true,
        contributor: true,
        leksikonAssets: { include: { asset: true } },
        leksikonReferensis: { include: { referensi: true } },
      },
    });
    return updated;
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      // P2025: record to update not found
      if (error.code === 'P2025') {
        throw error; // bubble to controller to map to 404
      }
    }
    throw error;
  }
};

export const deleteLeksikon = async (id: number) => {
  return prisma.leksikon.delete({
    where: { leksikonId: id },
  });
};

// export const addAssetToLeksikon = async (leksikonId: number, assetId: number, assetRole: string) => {
//   // verify leksikon exists
//   const leksikon = await prisma.leksikon.findUnique({
//     where: { leksikonId },
//   });
//   if (!leksikon) {
//     const err = new Error('Leksikon not found');
//     (err as any).code = 'LEKSIKON_NOT_FOUND';
//     throw err;
//   }

//   // verify asset exists
//   const asset = await prisma.asset.findUnique({
//     where: { assetId },
//   });
//   if (!asset) {
//     const err = new Error('Asset not found');
//     (err as any).code = 'ASSET_NOT_FOUND';
//     throw err;
//   }

//   return prisma.leksikonAsset.create({
//     data: { leksikonId, assetId, assetRole },
//     include: { asset: true },
//   });
// };

export const addAssetToLeksikon = async (leksikonId: number, assetId: number, assetRole: LeksikonAssetRole) => {
  // Pastikan leksikon dan asset ada
  const leksikon = await prisma.leksikon.findUnique({ where: { leksikonId } });
  if (!leksikon) {
    const err = new Error('Leksikon not found');
    (err as any).code = 'LEKSIKON_NOT_FOUND';
    throw err;
  }

  const asset = await prisma.asset.findUnique({ where: { assetId } });
  if (!asset) {
    const err = new Error('Asset not found');
    (err as any).code = 'ASSET_NOT_FOUND';
    throw err;
  }

  // Gunakan upsert agar tidak duplikat dan tidak menimbulkan rekursi
  return prisma.leksikonAsset.upsert({
    where: {
      leksikonId_assetId: {
        leksikonId,
        assetId,
      },
    },
    update: {
      assetRole,
    },
    create: {
      leksikonId,
      assetId,
      assetRole,
    },
  });
};


export const removeAssetFromLeksikon = async (leksikonId: number, assetId: number) => {
  return prisma.leksikonAsset.delete({
    where: { leksikonId_assetId: { leksikonId, assetId } },
  });
};

export const getLeksikonAssets = async (id: number) => {
  return prisma.leksikonAsset.findMany({
    where: { leksikonId: id },
    include: { asset: true },
  });
};

// export const addReferenceToLeksikon = async (leksikonId: number, referensiId: number, citationNote?: string) => {
//   // verify leksikon exists
//   const leksikon = await prisma.leksikon.findUnique({
//     where: { leksikonId },
//   });
//   if (!leksikon) {
//     const err = new Error('Leksikon not found');
//     (err as any).code = 'LEKSIKON_NOT_FOUND';
//     throw err;
//   }

//   // verify referensi exists
//   const referensi = await prisma.referensi.findUnique({
//     where: { referensiId },
//   });
//   if (!referensi) {
//     const err = new Error('Referensi not found');
//     (err as any).code = 'REFERENSI_NOT_FOUND';
//     throw err;
//   }

//   return prisma.leksikonReferensi.create({
//     data: { leksikonId, referensiId, citationNote },
//     include: { referensi: true },
//   });
// };

export const addReferenceToLeksikon = async  (leksikonId: number, referensiId: number, citationNote?: CitationNoteType) => {
  const leksikon = await prisma.leksikon.findUnique({ where: { leksikonId } });
  if (!leksikon) {
    const err = new Error('Leksikon not found');
    (err as any).code = 'LEKSIKON_NOT_FOUND';
    throw err;
  }

  const referensi = await prisma.referensi.findUnique({ where: { referensiId } });
  if (!referensi) {
    const err = new Error('Referensi not found');
    (err as any).code = 'REFERENSI_NOT_FOUND';
    throw err;
  }

  // Gunakan upsert agar tidak duplikat
  return prisma.leksikonReferensi.upsert({
    where: {
      leksikonId_referensiId: {
        leksikonId,
        referensiId,
      },
    },
    update: {
      citationNote,
    },
    create: {
      leksikonId,
      referensiId,
      citationNote,
    },
  });
};


export const removeReferenceFromLeksikon = async (leksikonId: number, referensiId: number) => {
  return prisma.leksikonReferensi.delete({
    where: { leksikonId_referensiId: { leksikonId, referensiId } },
  });
};

export const getLeksikonReferences = async (id: number) => {
  return prisma.leksikonReferensi.findMany({
    where: { leksikonId: id },
    include: { referensi: true },
  });
};

// UPDATE assetRole di relasi leksikonAsset
export const updateAssetRole = async (
  leksikonId: number,
  assetId: number,
  assetRole: LeksikonAssetRole
) => {
  // Pastikan relasi ada
  const existing = await prisma.leksikonAsset.findUnique({
    where: { leksikonId_assetId: { leksikonId, assetId } },
  });

  if (!existing) {
    const err = new Error('Association not found');
    (err as any).code = 'ASSOCIATION_NOT_FOUND';
    throw err;
  }

  return prisma.leksikonAsset.update({
    where: { leksikonId_assetId: { leksikonId, assetId } },
    data: { assetRole },
    include: { asset: true },
  });
};

// UPDATE citationNote di relasi leksikonReferensi
export const updateCitationNote = async (
  leksikonId: number,
  referensiId: number,
  citationNote?: CitationNoteType
) => {
  const existing = await prisma.leksikonReferensi.findUnique({
    where: { leksikonId_referensiId: { leksikonId, referensiId } },
  });

  if (!existing) {
    const err = new Error('Association not found');
    (err as any).code = 'ASSOCIATION_NOT_FOUND';
    throw err;
  }

  return prisma.leksikonReferensi.update({
    where: { leksikonId_referensiId: { leksikonId, referensiId } },
    data: { citationNote },
    include: { referensi: true },
  });
};

export const getAllLeksikonsPaginated = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.leksikon.findMany({
      skip,
      take: limit,
      include: {
        domainKodifikasi: true,
        contributor: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.leksikon.count(),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getLeksikonsByDomain = async (domainKodifikasiId: number) => {
  return prisma.leksikon.findMany({
    where: { domainKodifikasiId },
    include: {
      contributor: true,
    },
  });
};

export const getLeksikonsByStatus = async (status?: string) => {
  // If no status provided, return all leksikons
  if (!status) {
    return prisma.leksikon.findMany({
      include: {
        domainKodifikasi: true,
        contributor: true,
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  // Normalize and validate status (handle lowercase query params)
  const normalized = String(status).toUpperCase();
  const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
  if (!allowed.includes(normalized)) {
    // Return empty array for unknown status to be forgiving for clients
    return [];
  }

  return prisma.leksikon.findMany({
    where: { status: normalized as any },
    include: {
      domainKodifikasi: true,
      contributor: true,
    },
    orderBy: { updatedAt: "desc" },
  });
};

// Filter leksikons by status and/or domain with pagination
export const filterLeksikons = async (filters: {
  status?: string;
  domainId?: number;
  page?: number;
  limit?: number;
}) => {
  const page = filters.page || 1;
  const limit = filters.limit || 20;
  const skip = (page - 1) * limit;

  // Build where condition dynamically
  const whereCondition: any = {};

  // Add status filter if provided
  if (filters.status) {
    const normalized = String(filters.status).toUpperCase();
    const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
    if (allowed.includes(normalized)) {
      whereCondition.status = normalized as any;
    }
  }

  // Add domain filter if provided
  if (filters.domainId) {
    whereCondition.domainKodifikasiId = filters.domainId;
  }

  const [data, total] = await Promise.all([
    prisma.leksikon.findMany({
      where: whereCondition,
      include: {
        domainKodifikasi: true,
        contributor: true,
      },
      skip,
      take: limit,
      orderBy: { updatedAt: "desc" },
    }),
    prisma.leksikon.count({ where: whereCondition }),
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
        domainId: filters.domainId || null,
      },
    },
  };
};

export const updateLeksikonStatus = async (id: number, status: string) => {
  const normalized = String(status).toUpperCase();
  const allowed = ["DRAFT", "PUBLISHED", "ARCHIVED"];
  if (!allowed.includes(normalized)) {
    throw new Error(`Invalid status: ${status}`);
  }

  return prisma.leksikon.update({
    where: { leksikonId: id },
    data: { status: normalized as any },
  });
};

// GET assets by assetRole for a specific leksikon
export const getAssetsByRole = async (leksikonId: number, assetRole: LeksikonAssetRole) => {
  return prisma.leksikonAsset.findMany({
    where: {
      leksikonId,
      assetRole,
    },
    include: {
      asset: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

// ============================================
// 🔍 SEARCH & USAGE TRACKING FUNCTIONS
// ============================================

// Search assets used in lexicons by query (namaFile, tipe, penjelasan)
export const searchAssetsInLeksikons = async (query: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const whereCondition = {
    leksikonAssets: {
      some: {}, // Assets that are linked to at least one leksikon
    },
    OR: query ? [
      { namaFile: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { penjelasan: { contains: query, mode: Prisma.QueryMode.insensitive } },
    ] : undefined,
  };

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where: whereCondition,
      include: {
        leksikonAssets: {
          include: {
            leksikon: {
              include: {
                domainKodifikasi: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { namaFile: 'asc' },
    }),
    prisma.asset.count({ where: whereCondition }),
  ]);

  return {
    data: assets,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get all assets that are assigned to any leksikon
export const getAssignedAssets = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where: {
        leksikonAssets: {
          some: {}, // Only assets that have at least one leksikon association
        },
      },
      include: {
        leksikonAssets: {
          include: {
            leksikon: {
              include: {
                domainKodifikasi: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { namaFile: 'asc' },
    }),
    prisma.asset.count({
      where: {
        leksikonAssets: {
          some: {},
        },
      },
    }),
  ]);

  return {
    data: assets,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get which leksikons use a specific asset
export const getAssetUsage = async (assetId: number) => {
  return prisma.leksikonAsset.findMany({
    where: { assetId },
    include: {
      leksikon: {
        include: {
          domainKodifikasi: true,
          contributor: true,
        },
      },
      asset: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

// Search references used in lexicons by query (judul, penulis, tipeReferensi)
export const searchReferencesInLeksikons = async (query: string, page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const whereCondition = {
    leksikonReferensi: {
      some: {}, // References that are linked to at least one leksikon
    },
    OR: query ? [
      { judul: { contains: query, mode: Prisma.QueryMode.insensitive } },
      { penulis: { contains: query, mode: Prisma.QueryMode.insensitive } },
    ] : undefined,
  };

  const [references, total] = await Promise.all([
    prisma.referensi.findMany({
      where: whereCondition,
      include: {
        leksikonReferensi: {
          include: {
            leksikon: {
              include: {
                domainKodifikasi: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { judul: 'asc' },
    }),
    prisma.referensi.count({ where: whereCondition }),
  ]);

  return {
    data: references,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get all references that are assigned to any leksikon
export const getAssignedReferences = async (page = 1, limit = 20) => {
  const skip = (page - 1) * limit;

  const [references, total] = await Promise.all([
    prisma.referensi.findMany({
      where: {
        leksikonReferensi: {
          some: {}, // Only references that have at least one leksikon association
        },
      },
      include: {
        leksikonReferensi: {
          include: {
            leksikon: {
              include: {
                domainKodifikasi: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
      orderBy: { judul: 'asc' },
    }),
    prisma.referensi.count({
      where: {
        leksikonReferensi: {
          some: {},
        },
      },
    }),
  ]);

  return {
    data: references,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get which leksikons use a specific reference
export const getReferenceUsage = async (referenceId: number) => {
  return prisma.leksikonReferensi.findMany({
    where: { referensiId: referenceId },
    include: {
      leksikon: {
        include: {
          domainKodifikasi: true,
          contributor: true,
        },
      },
      referensi: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};